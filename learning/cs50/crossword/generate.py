import sys

from crossword import *


class CrosswordCreator():

    def __init__(self, crossword):
        """
        Create new CSP crossword generate.
        """
        self.crossword = crossword
        self.domains = {
            var: self.crossword.words.copy()
            for var in self.crossword.variables
        }

    def letter_grid(self, assignment):
        """
        Return 2D array representing a given assignment.
        """
        letters = [
            [None for _ in range(self.crossword.width)]
            for _ in range(self.crossword.height)
        ]
        for variable, word in assignment.items():
            direction = variable.direction
            for k in range(len(word)):
                i = variable.i + (k if direction == Variable.DOWN else 0)
                j = variable.j + (k if direction == Variable.ACROSS else 0)
                letters[i][j] = word[k]
        return letters

    def print(self, assignment):
        """
        Print crossword assignment to the terminal.
        """
        letters = self.letter_grid(assignment)
        for i in range(self.crossword.height):
            for j in range(self.crossword.width):
                if self.crossword.structure[i][j]:
                    print(letters[i][j] or " ", end="")
                else:
                    print("█", end="")
            print()

    def save(self, assignment, filename):
        """
        Save crossword assignment to an image file.
        """
        from PIL import Image, ImageDraw, ImageFont
        cell_size = 100
        cell_border = 2
        interior_size = cell_size - 2 * cell_border
        letters = self.letter_grid(assignment)

        # Create a blank canvas
        img = Image.new(
            "RGBA",
            (self.crossword.width * cell_size,
             self.crossword.height * cell_size),
            "black"
        )
        font = ImageFont.truetype("assets/fonts/OpenSans-Regular.ttf", 80)
        draw = ImageDraw.Draw(img)

        for i in range(self.crossword.height):
            for j in range(self.crossword.width):

                rect = [
                    (j * cell_size + cell_border,
                     i * cell_size + cell_border),
                    ((j + 1) * cell_size - cell_border,
                     (i + 1) * cell_size - cell_border)
                ]
                if self.crossword.structure[i][j]:
                    draw.rectangle(rect, fill="white")
                    if letters[i][j]:
                        _, _, w, h = draw.textbbox((0, 0), letters[i][j], font=font)
                        draw.text(
                            (rect[0][0] + ((interior_size - w) / 2),
                             rect[0][1] + ((interior_size - h) / 2) - 10),
                            letters[i][j], fill="black", font=font
                        )

        img.save(filename)

    def solve(self):
        """
        Enforce node and arc consistency, and then solve the CSP.
        """
        self.enforce_node_consistency()
        self.ac3()
        return self.backtrack(dict())

    def enforce_node_consistency(self):
        """
        Update `self.domains` such that each variable is node-consistent.
        (Remove any values that are inconsistent with a variable's unary
         constraints; in this case, the length of the word.)
        """
        for var in self.domains:
            # Create a copy to avoid modifying the set during iteration
            domain_copy = self.domains[var].copy()
            for word in domain_copy:
                # Remove words that don't match the variable's length
                if len(word) != var.length:
                    self.domains[var].remove(word)

    def revise(self, x, y):
        """
        Make variable `x` arc consistent with variable `y`.
        To do so, remove values from `self.domains[x]` for which there is no
        possible corresponding value for `y` in `self.domains[y]`.

        Return True if a revision was made to the domain of `x`; return
        False if no revision was made.
        """
        revised = False
        overlap = self.crossword.overlaps[x, y]

        # If there's no overlap between the variables, no revision needed
        if overlap is None:
            return False

        x_index, y_index = overlap

        # Check if any value in x's domain conflicts with all values in y's domain
        x_domain_copy = self.domains[x].copy()
        for x_value in x_domain_copy:
            # Try to find at least one compatible value in y's domain
            compatible = False
            for y_value in self.domains[y]:
                # If the overlapping characters match, it's compatible
                if x_value[x_index] == y_value[y_index]:
                    compatible = True
                    break

            # If no compatible value found in y's domain, remove x_value from x's domain
            if not compatible:
                self.domains[x].remove(x_value)
                revised = True

        return revised

    def ac3(self, arcs=None):
        """
        Update `self.domains` such that each variable is arc consistent.
        If `arcs` is None, begin with initial list of all arcs in the problem.
        Otherwise, use `arcs` as the initial list of arcs to make consistent.

        Return True if arc consistency is enforced and no domains are empty;
        return False if one or more domains end up empty.
        """
        # Initialize queue with all arcs if arcs is None
        if arcs is None:
            queue = [(x, y) for x in self.crossword.variables for y in self.crossword.neighbors(x)]
        else:
            queue = arcs.copy()

        # Process arcs until queue is empty
        while queue:
            (x, y) = queue.pop(0)

            # If x's domain is revised
            if self.revise(x, y):
                # If x's domain is empty, this problem is unsolvable
                if len(self.domains[x]) == 0:
                    return False

                # Add arcs (z, x) to queue for each neighbor z of x except y
                for z in self.crossword.neighbors(x):
                    if z != y:
                        queue.append((z, x))

        return True

    def assignment_complete(self, assignment):
        """
        Return True if `assignment` is complete (i.e., assigns a value to each
        crossword variable); return False otherwise.
        """
        # Check if all variables have been assigned
        return all(var in assignment for var in self.crossword.variables)

    def consistent(self, assignment):
        """
        Return True if `assignment` is consistent (i.e., words fit in crossword
        puzzle without conflicting characters); return False otherwise.
        """
        # Check that all values are distinct
        values = list(assignment.values())
        if len(values) != len(set(values)):
            return False

        # Check that all values have the correct length
        for var, word in assignment.items():
            if len(word) != var.length:
                return False

        # Check that there are no conflicts between neighboring variables
        for var1 in assignment:
            for var2 in self.crossword.neighbors(var1):
                if var2 in assignment:
                    overlap = self.crossword.overlaps[var1, var2]
                    if overlap:
                        i, j = overlap
                        # Check if overlapping characters match
                        if assignment[var1][i] != assignment[var2][j]:
                            return False

        return True

    def order_domain_values(self, var, assignment):
        """
        Return a list of values in the domain of `var`, in order by
        the number of values they rule out for neighboring variables.
        The first value in the list, for example, should be the one
        that rules out the fewest values among the neighbors of `var`.
        """
        # Get unassigned neighbors
        unassigned_neighbors = [
            neighbor for neighbor in self.crossword.neighbors(var)
            if neighbor not in assignment
        ]

        # Dictionary to store the number of ruled-out values for each word
        constraints = {}

        for word in self.domains[var]:
            # Count ruled-out values for each word
            constraints[word] = 0

            # For each unassigned neighbor
            for neighbor in unassigned_neighbors:
                overlap = self.crossword.overlaps[var, neighbor]
                if overlap:
                    var_idx, neighbor_idx = overlap

                    # Count incompatible values in neighbor's domain
                    for neighbor_word in self.domains[neighbor]:
                        # If overlapping characters don't match, count as ruled out
                        if word[var_idx] != neighbor_word[neighbor_idx]:
                            constraints[word] += 1

        # Sort domain values by number of constraints (least constraining first)
        return sorted(self.domains[var], key=lambda word: constraints[word])

    def select_unassigned_variable(self, assignment):
        """
        Return an unassigned variable not already part of `assignment`.
        Choose the variable with the minimum number of remaining values
        in its domain. If there is a tie, choose the variable with the highest
        degree. If there is a tie, any of the tied variables are acceptable
        return values.
        """
        # Get unassigned variables
        unassigned = [var for var in self.crossword.variables if var not in assignment]

        # Sort by domain size (minimum remaining values heuristic)
        # In case of tie, sort by degree (number of neighbors) in descending order
        return min(
            unassigned,
            key=lambda var: (
                len(self.domains[var]),
                -len(self.crossword.neighbors(var))
            )
        )

    def backtrack(self, assignment):
        """
        Using Backtracking Search, take as input a partial assignment for the
        crossword and return a complete assignment if possible to do so.

        `assignment` is a mapping from variables (keys) to words (values).

        If no assignment is possible, return None.
        """
        # Check if assignment is complete
        if self.assignment_complete(assignment):
            return assignment

        # Select an unassigned variable
        var = self.select_unassigned_variable(assignment)

        # Try each value in the domain of the variable
        for value in self.order_domain_values(var, assignment):
            # Add {var = value} to assignment
            assignment[var] = value

            # Check if the new assignment is consistent
            if self.consistent(assignment):
                # If consistent, try to complete the assignment recursively
                result = self.backtrack(assignment)
                if result is not None:
                    return result

            # If we get here, this value didn't work, remove from assignment
            assignment.pop(var)

        # If no value works, return failure
        return None


def main():

    # Check usage
    if len(sys.argv) not in [3, 4]:
        sys.exit("Usage: python generate.py structure words [output]")

    # Parse command-line arguments
    structure = sys.argv[1]
    words = sys.argv[2]
    output = sys.argv[3] if len(sys.argv) == 4 else None

    # Generate crossword
    crossword = Crossword(structure, words)
    creator = CrosswordCreator(crossword)
    assignment = creator.solve()

    # Print result
    if assignment is None:
        print("No solution.")
    else:
        creator.print(assignment)
        if output:
            creator.save(assignment, output)


if __name__ == "__main__":
    main()
