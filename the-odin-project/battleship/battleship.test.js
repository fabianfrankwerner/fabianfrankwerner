const { Ship, Gameboard, Player } = require("./battleship");

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

describe("Gameboard", () => {
  let board;
  beforeEach(() => {
    board = new Gameboard(5);
  });

  test("constructor initializes grid and ships", () => {
    expect(board.grid.length).toBe(5);
    expect(board.grid[0].length).toBe(5);
    expect(board.ships).toEqual([]);
  });

  test("placeShip places a ship on the board", () => {
    const ship = board.placeShip(0, 0, 3, "horizontal");
    expect(board.grid[0][0]).toBe(ship);
    expect(board.grid[0][1]).toBe(ship);
    expect(board.grid[0][2]).toBe(ship);
    expect(board.ships).toContain(ship);
  });

  test("placeShip throws error for invalid placement", () => {
    board.placeShip(0, 0, 3, "horizontal");
    expect(() => board.placeShip(0, 0, 3, "horizontal")).toThrow();
    expect(() => board.placeShip(4, 4, 3, "horizontal")).toThrow();
  });

  test("receiveAttack registers a miss", () => {
    expect(board.receiveAttack(1, 1)).toBe("miss");
    expect(board.grid[1][1]).toBe("miss");
  });

  test("receiveAttack registers a hit", () => {
    board.placeShip(0, 0, 2, "vertical");
    expect(board.receiveAttack(0, 0)).toBe("hit");
    expect(board.grid[0][0]).toBe("hit");
  });

  test("receiveAttack prevents double attack", () => {
    expect(board.receiveAttack(2, 2)).toBe("miss");
    expect(board.receiveAttack(2, 2)).toBe("already attacked");
  });

  test("allShipsSunk returns true only if all ships are sunk", () => {
    const ship1 = board.placeShip(0, 0, 1, "horizontal");
    const ship2 = board.placeShip(2, 2, 1, "horizontal");
    board.receiveAttack(0, 0);
    expect(board.allShipsSunk()).toBe(false);
    board.receiveAttack(2, 2);
    expect(board.allShipsSunk()).toBe(true);
  });
});

describe("Player", () => {
  test("constructor sets name", () => {
    const player = new Player("Alice");
    expect(player.name).toBe("Alice");
  });

  test("default name is Computer", () => {
    const player = new Player();
    expect(player.name).toBe("Computer");
  });

  test("createGameboard returns a Gameboard instance", () => {
    const player = new Player();
    const board = player.createGameboard();
    expect(board).toBeInstanceOf(Gameboard);
  });
});
