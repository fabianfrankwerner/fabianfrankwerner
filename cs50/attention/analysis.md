# Analysis

## Layer 2, Head 7
This attention head appears to focus on the relationship between determiners (like "a", "the") and the nouns they precede. The determiner often shows a high attention score for the subsequent noun.

Example Sentences:
- Text: The cat sat on the [MASK].
  - The cat sat on the mat.
  - The cat sat on the floor.
  - The cat sat on the rug.
  (In the generated attention diagram for Layer 2, Head 7, "The" shows high attention to "cat", and "the" also shows high attention to "[MASK]" before the prediction.)
- Text: I saw a [MASK] running in the park.
  - I saw a dog running in the park.
  - I saw a squirrel running in the park.
  - I saw a bird running in the park.
  (Here, "a" shows high attention to "[MASK]" in the Layer 2, Head 7 diagram.)

## Layer 7, Head 3
This attention head seems to pay attention to the relationship between prepositions and the nouns or noun phrases that follow them. The preposition often has a relatively high attention score for the word immediately following it, which is often the start of the object of the preposition.

Example Sentences:
- Text: The book is [MASK] the table.
  - The book is on the table.
  - The book is under the table.
  - The book is beside the table.
  (In the Layer 7, Head 3 diagram, the predicted preposition like "on" shows attention to "the".)
- Text: She walked [MASK] the street.
  - She walked along the street.
  - She walked across the street.
  - She walked down the street.
  (Here, the predicted preposition like "along" shows attention to "the" in the Layer 7, Head 3 diagram.)
