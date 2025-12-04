import itertools
import random


class Minesweeper():
    """
    Minesweeper game representation
    """

    def __init__(self, height=8, width=8, mines=8):

        # Set initial width, height, and number of mines
        self.height = height
        self.width = width
        self.mines = set()

        # Initialize an empty field with no mines
        self.board = []
        for i in range(self.height):
            row = []
            for j in range(self.width):
                row.append(False)
            self.board.append(row)

        # Add mines randomly
        while len(self.mines) != mines:
            i = random.randrange(height)
            j = random.randrange(width)
            if not self.board[i][j]:
                self.mines.add((i, j))
                self.board[i][j] = True

        # At first, player has found no mines
        self.mines_found = set()

    def print(self):
        """
        Prints a text-based representation
        of where mines are located.
        """
        for i in range(self.height):
            print("--" * self.width + "-")
            for j in range(self.width):
                if self.board[i][j]:
                    print("|X", end="")
                else:
                    print("| ", end="")
            print("|")
        print("--" * self.width + "-")

    def is_mine(self, cell):
        i, j = cell
        return self.board[i][j]

    def nearby_mines(self, cell):
        """
        Returns the number of mines that are
        within one row and column of a given cell,
        not including the cell itself.
        """

        # Keep count of nearby mines
        count = 0

        # Loop over all cells within one row and column
        for i in range(cell[0] - 1, cell[0] + 2):
            for j in range(cell[1] - 1, cell[1] + 2):

                # Ignore the cell itself
                if (i, j) == cell:
                    continue

                # Update count if cell in bounds and is mine
                if 0 <= i < self.height and 0 <= j < self.width:
                    if self.board[i][j]:
                        count += 1

        return count

    def won(self):
        """
        Checks if all mines have been flagged.
        """
        return self.mines_found == self.mines


class Sentence():
    """
    Logical statement about a Minesweeper game
    A sentence consists of a set of board cells,
    and a count of the number of those cells which are mines.
    """

    def __init__(self, cells, count):
        self.cells = set(cells)
        self.count = count

    def __eq__(self, other):
        return self.cells == other.cells and self.count == other.count

    def __str__(self):
        return f"{self.cells} = {self.count}"

    def known_mines(self):
        """
        Returns the set of all cells in self.cells known to be mines.
        """
        # If the number of cells equals the count, all cells must be mines
        if len(self.cells) == self.count and self.count > 0:
            return self.cells.copy()
        return set()

    def known_safes(self):
        """
        Returns the set of all cells in self.cells known to be safe.
        """
        # If count is 0, all cells must be safe
        if self.count == 0:
            return self.cells.copy()
        return set()

    def mark_mine(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be a mine.
        """
        # If cell is in the sentence, remove it and decrease count
        if cell in self.cells:
            self.cells.remove(cell)
            self.count -= 1

    def mark_safe(self, cell):
        """
        Updates internal knowledge representation given the fact that
        a cell is known to be safe.
        """
        # If cell is in the sentence, just remove it (don't change count)
        if cell in self.cells:
            self.cells.remove(cell)


class MinesweeperAI():
    """
    Minesweeper game player
    """

    def __init__(self, height=8, width=8):

        # Set initial height and width
        self.height = height
        self.width = width

        # Keep track of which cells have been clicked on
        self.moves_made = set()

        # Keep track of cells known to be safe or mines
        self.mines = set()
        self.safes = set()

        # List of sentences about the game known to be true
        self.knowledge = []

    def mark_mine(self, cell):
        """
        Marks a cell as a mine, and updates all knowledge
        to mark that cell as a mine as well.
        """
        self.mines.add(cell)
        for sentence in self.knowledge:
            sentence.mark_mine(cell)

    def mark_safe(self, cell):
        """
        Marks a cell as safe, and updates all knowledge
        to mark that cell as safe as well.
        """
        self.safes.add(cell)
        for sentence in self.knowledge:
            sentence.mark_safe(cell)

    def add_knowledge(self, cell, count):
        """
        Called when the Minesweeper board tells us, for a given
        safe cell, how many neighboring cells have mines in them.

        This function should:
            1) mark the cell as a move that has been made
            2) mark the cell as safe
            3) add a new sentence to the AI's knowledge base
               based on the value of `cell` and `count`
            4) mark any additional cells as safe or as mines
               if it can be concluded based on the AI's knowledge base
            5) add any new sentences to the AI's knowledge base
               if they can be inferred from existing knowledge
        """
        # 1) Mark the cell as a move that has been made
        self.moves_made.add(cell)

        # 2) Mark the cell as safe
        self.mark_safe(cell)

        # 3) Add a new sentence to the AI's knowledge base
        # First, get all neighbors of the cell
        neighbors = set()
        i, j = cell

        # Check all neighboring cells (including diagonals)
        for row in range(max(0, i-1), min(i+2, self.height)):
            for col in range(max(0, j-1), min(j+2, self.width)):
                if (row, col) != cell:  # Skip the current cell
                    neighbors.add((row, col))

        # Remove cells that are already known to be safe or mines
        safe_neighbors = neighbors - self.safes
        mine_count = count

        # Adjust count for known mines in the neighborhood
        for neighbor in neighbors:
            if neighbor in self.mines:
                mine_count -= 1

        # Add new sentence if there are still undetermined cells
        if safe_neighbors - self.mines:  # Only add if some cells are not already known mines
            new_sentence = Sentence(safe_neighbors - self.mines, mine_count)
            if new_sentence not in self.knowledge and len(new_sentence.cells) > 0:
                self.knowledge.append(new_sentence)

        # 4) Mark any additional cells as safe or as mines
        self.update_knowledge()

        # 5) Add any new sentences that can be inferred
        self.infer_new_sentences()

    def update_knowledge(self):
        """
        Update knowledge by marking cells as mines or safe
        """
        # Keep checking for new information until no changes are made
        changes_made = True
        while changes_made:
            changes_made = False

            # Create a copy of the knowledge list to avoid modification during iteration
            knowledge_copy = self.knowledge.copy()

            # Filter out sentences with no cells
            self.knowledge = [s for s in self.knowledge if len(s.cells) > 0]

            for sentence in knowledge_copy:
                # If we found mines
                mines = sentence.known_mines()
                if mines:
                    changes_made = True
                    for mine in mines:
                        self.mark_mine(mine)

                # If we found safe cells
                safes = sentence.known_safes()
                if safes:
                    changes_made = True
                    for safe in safes:
                        self.mark_safe(safe)

    def infer_new_sentences(self):
        """
        Add new sentences that can be inferred from existing knowledge
        using the subset method
        """
        if not self.knowledge:
            return

        # Create a copy to avoid modification during iteration
        knowledge_length = len(self.knowledge)

        # Check each pair of sentences
        for i in range(knowledge_length):
            for j in range(i+1, knowledge_length):
                s1 = self.knowledge[i]
                s2 = self.knowledge[j]

                # Skip empty sentences or those with zero cells
                if not s1.cells or not s2.cells:
                    continue

                # If s1 is a subset of s2
                if s1.cells.issubset(s2.cells) and s1.cells != s2.cells:
                    new_cells = s2.cells - s1.cells
                    new_count = s2.count - s1.count
                    new_sentence = Sentence(new_cells, new_count)

                    # Only add if not empty and not already in knowledge
                    if new_cells and new_sentence not in self.knowledge:
                        self.knowledge.append(new_sentence)
                        # We made a change, so we need to update knowledge again
                        self.update_knowledge()

                # If s2 is a subset of s1
                elif s2.cells.issubset(s1.cells) and s1.cells != s2.cells:
                    new_cells = s1.cells - s2.cells
                    new_count = s1.count - s2.count
                    new_sentence = Sentence(new_cells, new_count)

                    # Only add if not empty and not already in knowledge
                    if new_cells and new_sentence not in self.knowledge:
                        self.knowledge.append(new_sentence)
                        # We made a change, so we need to update knowledge again
                        self.update_knowledge()

    def make_safe_move(self):
        """
        Returns a safe cell to choose on the Minesweeper board.
        The move must be known to be safe, and not already a move
        that has been made.
        """
        # Find cells that are safe but haven't been chosen yet
        safe_moves = self.safes - self.moves_made

        # Return a safe move if one exists
        if safe_moves:
            return safe_moves.pop()
        return None

    def make_random_move(self):
        """
        Returns a move to make on the Minesweeper board.
        Should choose randomly among cells that:
            1) have not already been chosen, and
            2) are not known to be mines
        """
        # Generate all possible moves
        all_possible_moves = set()
        for i in range(self.height):
            for j in range(self.width):
                all_possible_moves.add((i, j))

        # Remove moves that have been made or are known mines
        available_moves = all_possible_moves - self.moves_made - self.mines

        # Return a random move if one exists
        if available_moves:
            return random.choice(list(available_moves))
        return None
