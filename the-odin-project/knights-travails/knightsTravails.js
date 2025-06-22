// knightMoves([start], [end]) => shortest path for a knight on a chessboard
// Example: knightMoves([0,0],[7,7])

function knightMoves(start, end) {
  const moves = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
  ];

  function isValid([x, y]) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  const queue = [[start, [start]]];
  const visited = new Set();
  visited.add(start.toString());

  while (queue.length > 0) {
    const [current, path] = queue.shift();
    if (current[0] === end[0] && current[1] === end[1]) {
      return path;
    }
    for (const [dx, dy] of moves) {
      const next = [current[0] + dx, current[1] + dy];
      if (isValid(next) && !visited.has(next.toString())) {
        visited.add(next.toString());
        queue.push([next, [...path, next]]);
      }
    }
  }
  return null; // No path found (shouldn't happen on 8x8 board)
}

// CLI demo output
function printKnightMoves(start, end) {
  const path = knightMoves(start, end);
  if (!path) {
    console.log("No path found.");
    return;
  }
  console.log(`You made it in ${path.length - 1} moves! Here's your path:`);
  for (const pos of path) {
    console.log(`[${pos[0]},${pos[1]}]`);
  }
}

// Example usage:
// printKnightMoves([3,3],[4,3]);
// printKnightMoves([0,0],[7,7]);

module.exports = { knightMoves, printKnightMoves };
