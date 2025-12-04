const { knightMoves, printKnightMoves } = require("./knightsTravails");

console.log("Test 1: [0,0] to [1,2]");
printKnightMoves([0, 0], [1, 2]);
console.log("\nTest 2: [0,0] to [3,3]");
printKnightMoves([0, 0], [3, 3]);
console.log("\nTest 3: [3,3] to [0,0]");
printKnightMoves([3, 3], [0, 0]);
console.log("\nTest 4: [0,0] to [7,7]");
printKnightMoves([0, 0], [7, 7]);
console.log("\nTest 5: [3,3] to [4,3]");
printKnightMoves([3, 3], [4, 3]);
