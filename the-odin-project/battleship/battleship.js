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
