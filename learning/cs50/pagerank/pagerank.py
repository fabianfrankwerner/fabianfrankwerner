import os
import random
import re
import sys

DAMPING = 0.85
SAMPLES = 10000


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python pagerank.py corpus")
    corpus = crawl(sys.argv[1])
    ranks = sample_pagerank(corpus, DAMPING, SAMPLES)
    print(f"PageRank Results from Sampling (n = {SAMPLES})")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
    ranks = iterate_pagerank(corpus, DAMPING)
    print(f"PageRank Results from Iteration")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")


def crawl(directory):
    """
    Parse a directory of HTML pages and check for links to other pages.
    Return a dictionary where each key is a page, and values are
    a list of all other pages in the corpus that are linked to by the page.
    """
    pages = dict()

    # Extract all links from HTML files
    for filename in os.listdir(directory):
        if not filename.endswith(".html"):
            continue
        with open(os.path.join(directory, filename)) as f:
            contents = f.read()
            links = re.findall(r"<a\s+(?:[^>]*?)href=\"([^\"]*)\"", contents)
            pages[filename] = set(links) - {filename}

    # Only include links to other pages in the corpus
    for filename in pages:
        pages[filename] = set(
            link for link in pages[filename]
            if link in pages
        )

    return pages


def transition_model(corpus, page, damping_factor):
    """
    Return a probability distribution over which page to visit next,
    given a current page.

    With probability `damping_factor`, choose a link at random
    linked to by `page`. With probability `1 - damping_factor`, choose
    a link at random chosen from all pages in the corpus.
    """
    # Initialize probability distribution
    probability_dist = {}

    # Get the total number of pages in the corpus
    n = len(corpus)

    # Random probability for any page (probability 1 - damping_factor)
    random_prob = (1 - damping_factor) / n

    # Get outgoing links from the current page
    links = corpus[page]

    # If the page has no links, treat it as having links to all pages
    if not links:
        # Equal probability to go to any page
        for p in corpus:
            probability_dist[p] = 1 / n
        return probability_dist

    # Calculate probability for linked pages
    link_prob = damping_factor / len(links)

    # Assign probabilities to each page
    for p in corpus:
        # Start with random probability
        probability_dist[p] = random_prob

        # Add link probability if the page is linked from current page
        if p in links:
            probability_dist[p] += link_prob

    return probability_dist


def sample_pagerank(corpus, damping_factor, n):
    """
    Return PageRank values for each page by sampling `n` pages
    according to transition model, starting with a page at random.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    # Initialize PageRank counts for each page
    pagerank = {page: 0 for page in corpus}

    # Choose the first sample randomly from all pages
    current_page = random.choice(list(corpus.keys()))
    pagerank[current_page] += 1

    # Generate remaining n-1 samples based on the transition model
    for _ in range(n - 1):
        # Get probability distribution for the current page
        prob_dist = transition_model(corpus, current_page, damping_factor)

        # Choose the next page based on the probability distribution
        pages = list(prob_dist.keys())
        probabilities = list(prob_dist.values())

        current_page = random.choices(pages, probabilities)[0]
        pagerank[current_page] += 1

    # Convert counts to proportions
    for page in pagerank:
        pagerank[page] /= n

    return pagerank


def iterate_pagerank(corpus, damping_factor):
    """
    Return PageRank values for each page by iteratively updating
    PageRank values until convergence.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    # Get total number of pages
    n = len(corpus)

    # Initialize PageRank values
    pagerank = {page: 1 / n for page in corpus}

    # Create a dictionary that maps each page to the pages that link to it
    links_to = {page: set() for page in corpus}
    for page, links in corpus.items():
        for link in links:
            links_to[link].add(page)

    # Handle pages with no outgoing links
    for page, links in corpus.items():
        if not links:
            # If a page has no links, it has one link to every page (including itself)
            corpus[page] = set(corpus.keys())

    # Iterate until convergence
    while True:
        # Keep track of the largest change in PageRank
        max_change = 0

        # Calculate new PageRank values
        new_pagerank = {}

        for page in corpus:
            # Calculate sum part of the formula
            pagerank_sum = 0

            # Iterate through pages that link to current page
            for linking_page in links_to[page]:
                # Get number of links on the linking page
                num_links = len(corpus[linking_page])
                # Add contribution from the linking page
                pagerank_sum += pagerank[linking_page] / num_links

            # Calculate new PageRank with damping factor
            new_value = (1 - damping_factor) / n + damping_factor * pagerank_sum

            # Update new_pagerank
            new_pagerank[page] = new_value

            # Calculate change in PageRank
            change = abs(new_pagerank[page] - pagerank[page])
            max_change = max(max_change, change)

        # Update PageRank values
        pagerank = new_pagerank

        # Check for convergence
        if max_change < 0.001:
            break

    # Normalize PageRank values to ensure they sum to 1
    total = sum(pagerank.values())
    for page in pagerank:
        pagerank[page] /= total

    return pagerank


if __name__ == "__main__":
    main()
