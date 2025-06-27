class Ship {
  constructor(length, hits, sunk) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    return this.hits++;
  }

  isSunk() {
    return this.length === this.hits ? (this.sunk = true) : (this.sunk = false);
  }
}

class Gameboard {
  constructor(size = 10) {
    // 2D array for the board, initialized to null
    this.size = size;
    this.grid = Array.from({ length: size }, () => Array(size).fill(null));
    this.ships = [];
  }

  // direction: 'horizontal' or 'vertical'
  placeShip(x, y, length, direction) {
    // Check if placement is valid
    if (!this.isValidPlacement(x, y, length, direction)) {
      throw new Error("Invalid ship placement");
    }

    // Create the ship
    const ship = new Ship(length);

    // Place ship on the board
    for (let i = 0; i < length; i++) {
      const xi = direction === "horizontal" ? x + i : x;
      const yi = direction === "vertical" ? y + i : y;
      this.grid[yi][xi] = ship;
    }

    // Track the ship
    this.ships.push(ship);
    return ship;
  }

  isValidPlacement(x, y, length, direction) {
    for (let i = 0; i < length; i++) {
      const xi = direction === "horizontal" ? x + i : x;
      const yi = direction === "vertical" ? y + i : y;
      // Check bounds
      if (xi < 0 || xi >= this.size || yi < 0 || yi >= this.size) return false;
      // Check for overlap
      if (this.grid[yi][xi] !== null) return false;
    }
    return true;
  }
}

module.exports = Ship;
module.exports = Gameboard;
