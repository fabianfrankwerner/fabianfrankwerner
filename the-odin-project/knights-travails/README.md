# Knights Travails

This project solves the classic Knights Travails problem from The Odin Project. It finds the shortest path for a knight on a standard 8x8 chessboard from a starting position to a target position using Breadth-First Search (BFS).

## Usage

The main function is `knightMoves(start, end)`, which returns an array of coordinates representing the shortest path.

- `start` and `end` are arrays: `[x, y]` where `0 <= x, y < 8`.

Example:

```js
const { printKnightMoves } = require("./knightsTravails");
printKnightMoves([0, 0], [7, 7]);
```

## Output

```
You made it in 6 moves! Here's your path:
[0,0]
[2,1]
[4,2]
[6,3]
[7,5]
[5,6]
[7,7]
```

## How it works

- The chessboard is treated as a graph.
- Each square is a node; valid knight moves are edges.
- BFS is used to find the shortest path.

## No GUI required

This is a console-based solution as per the assignment instructions.
