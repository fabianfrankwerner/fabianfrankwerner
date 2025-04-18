import csv
import itertools
import sys

PROBS = {

    # Unconditional probabilities for having gene
    "gene": {
        2: 0.01,
        1: 0.03,
        0: 0.96
    },

    "trait": {

        # Probability of trait given two copies of gene
        2: {
            True: 0.65,
            False: 0.35
        },

        # Probability of trait given one copy of gene
        1: {
            True: 0.56,
            False: 0.44
        },

        # Probability of trait given no gene
        0: {
            True: 0.01,
            False: 0.99
        }
    },

    # Mutation probability
    "mutation": 0.01
}


def main():

    # Check for proper usage
    if len(sys.argv) != 2:
        sys.exit("Usage: python heredity.py data.csv")
    people = load_data(sys.argv[1])

    # Keep track of gene and trait probabilities for each person
    probabilities = {
        person: {
            "gene": {
                2: 0,
                1: 0,
                0: 0
            },
            "trait": {
                True: 0,
                False: 0
            }
        }
        for person in people
    }

    # Loop over all sets of people who might have the trait
    names = set(people)
    for have_trait in powerset(names):

        # Check if current set of people violates known information
        fails_evidence = any(
            (people[person]["trait"] is not None and
             people[person]["trait"] != (person in have_trait))
            for person in names
        )
        if fails_evidence:
            continue

        # Loop over all sets of people who might have the gene
        for one_gene in powerset(names):
            for two_genes in powerset(names - one_gene):

                # Update probabilities with new joint probability
                p = joint_probability(people, one_gene, two_genes, have_trait)
                update(probabilities, one_gene, two_genes, have_trait, p)

    # Ensure probabilities sum to 1
    normalize(probabilities)

    # Print results
    for person in people:
        print(f"{person}:")
        for field in probabilities[person]:
            print(f"  {field.capitalize()}:")
            for value in probabilities[person][field]:
                p = probabilities[person][field][value]
                print(f"    {value}: {p:.4f}")


def load_data(filename):
    """
    Load gene and trait data from a file into a dictionary.
    File assumed to be a CSV containing fields name, mother, father, trait.
    mother, father must both be blank, or both be valid names in the CSV.
    trait should be 0 or 1 if trait is known, blank otherwise.
    """
    data = dict()
    with open(filename) as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["name"]
            data[name] = {
                "name": name,
                "mother": row["mother"] or None,
                "father": row["father"] or None,
                "trait": (True if row["trait"] == "1" else
                          False if row["trait"] == "0" else None)
            }
    return data


def powerset(s):
    """
    Return a list of all possible subsets of set s.
    """
    s = list(s)
    return [
        set(s) for s in itertools.chain.from_iterable(
            itertools.combinations(s, r) for r in range(len(s) + 1)
        )
    ]


def joint_probability(people, one_gene, two_genes, have_trait):
    """
    Compute and return a joint probability.

    The probability returned should be the probability that
        * everyone in set `one_gene` has one copy of the gene, and
        * everyone in set `two_genes` has two copies of the gene, and
        * everyone not in `one_gene` or `two_gene` does not have the gene, and
        * everyone in set `have_trait` has the trait, and
        * everyone not in set` have_trait` does not have the trait.
    """
    # Initialize the joint probability to 1 (we'll multiply probabilities)
    joint_prob = 1.0

    # Process each person in the people dictionary
    for person in people:
        # Determine number of genes for this person
        if person in two_genes:
            genes = 2
        elif person in one_gene:
            genes = 1
        else:
            genes = 0

        # Determine if person has the trait
        has_trait = person in have_trait

        # Get mother and father from data
        mother = people[person]["mother"]
        father = people[person]["father"]

        # Calculate the gene probability
        gene_prob = 0

        # Case 1: No parental information
        if mother is None and father is None:
            # Use unconditional probability
            gene_prob = PROBS["gene"][genes]

        # Case 2: We have parental information
        else:
            # Calculate probability of gene inherited from mother
            mother_gene_probs = []

            # Mother has 2 copies: probability of passing one is (1 - mutation)
            if mother in two_genes:
                mother_gene_probs.append((1 - PROBS["mutation"]))
            # Mother has 1 copy: probability of passing one is 0.5
            elif mother in one_gene:
                mother_gene_probs.append(0.5)
            # Mother has 0 copies: probability of passing one is only through mutation
            else:
                mother_gene_probs.append(PROBS["mutation"])

            # Also calculate probability of NOT passing the gene
            mother_gene_probs.append(1 - mother_gene_probs[0])

            # Calculate probability of gene inherited from father (same logic)
            father_gene_probs = []

            if father in two_genes:
                father_gene_probs.append((1 - PROBS["mutation"]))
            elif father in one_gene:
                father_gene_probs.append(0.5)
            else:
                father_gene_probs.append(PROBS["mutation"])

            father_gene_probs.append(1 - father_gene_probs[0])

            # Calculate gene probability based on the number of genes
            if genes == 0:
                # Need to inherit 0 genes: not from mother AND not from father
                gene_prob = mother_gene_probs[1] * father_gene_probs[1]
            elif genes == 1:
                # Need to inherit exactly 1 gene: either from mother OR from father (not both)
                gene_prob = (mother_gene_probs[0] * father_gene_probs[1]) + (mother_gene_probs[1] * father_gene_probs[0])
            else:  # genes == 2
                # Need to inherit 2 genes: one from mother AND one from father
                gene_prob = mother_gene_probs[0] * father_gene_probs[0]

        # Calculate trait probability given genes
        trait_prob = PROBS["trait"][genes][has_trait]

        # Update joint probability
        joint_prob *= gene_prob * trait_prob

    return joint_prob


def update(probabilities, one_gene, two_genes, have_trait, p):
    """
    Add to `probabilities` a new joint probability `p`.
    Each person should have their "gene" and "trait" distributions updated.
    Which value for each distribution is updated depends on whether
    the person is in `have_gene` and `have_trait`, respectively.
    """
    # Update each person's probability distribution
    for person in probabilities:
        # Update gene distribution
        if person in two_genes:
            probabilities[person]["gene"][2] += p
        elif person in one_gene:
            probabilities[person]["gene"][1] += p
        else:
            probabilities[person]["gene"][0] += p

        # Update trait distribution
        if person in have_trait:
            probabilities[person]["trait"][True] += p
        else:
            probabilities[person]["trait"][False] += p


def normalize(probabilities):
    """
    Update `probabilities` such that each probability distribution
    is normalized (i.e., sums to 1, with relative proportions the same).
    """
    # For each person
    for person in probabilities:
        # Normalize gene distribution
        gene_total = sum(probabilities[person]["gene"].values())
        for gene_value in probabilities[person]["gene"]:
            if gene_total > 0:  # Avoid division by zero
                probabilities[person]["gene"][gene_value] /= gene_total

        # Normalize trait distribution
        trait_total = sum(probabilities[person]["trait"].values())
        for trait_value in probabilities[person]["trait"]:
            if trait_total > 0:  # Avoid division by zero
                probabilities[person]["trait"][trait_value] /= trait_total


if __name__ == "__main__":
    main()
