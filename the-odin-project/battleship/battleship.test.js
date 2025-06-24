const Ship = require("./battleship");

describe("Ship", () => {
  test("constructor initializes length, hits, and sunk", () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  test("hit() increments hits", () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.hits).toBe(1);
    ship.hit();
    expect(ship.hits).toBe(2);
  });

  test("isSunk() returns true when hits equal length", () => {
    const ship = new Ship(2);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    expect(ship.sunk).toBe(true);
  });

  test("isSunk() returns false when hits less than length", () => {
    const ship = new Ship(4);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
    expect(ship.sunk).toBe(false);
  });
});
