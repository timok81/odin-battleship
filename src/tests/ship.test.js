import { Ship } from "../ship.js";
import { Gameboard } from "../gameboard.js"
import { Player } from "../player.js"

describe("ship", () => {

  test("Is defined", () => {
    expect(Ship).toBeDefined;
  });

  test("Hit function increments hits", () => {
    const newShip = new Ship("Battleship", 4);
    newShip.hit();
    expect(newShip.getHits()).toEqual(1)
  });

  test("Sinks when hits equals length", () => {
    const newShip = new Ship("Patrol Boat", 2);
    newShip.hit();
    expect(newShip.isSunk()).toEqual(false)
  });

  test("Sinks when hits equals length", () => {
    const newShip = new Ship("Patrol Boat", 2);
    newShip.hit();
    newShip.hit();
    expect(newShip.isSunk()).toEqual(true)
  });
});

describe("Gameboard", () => {

    test("Is defined", () => {
      expect(Gameboard).toBeDefined;
    });

    test("Ships returns the ship at coords", () => {
        const newBoard = new Gameboard(10,10);
        newBoard.placeShip("Battleship", 4, [[5,1],[5,2],[5,3],[5,4]])
        const ship = newBoard.getShips().get([5,1].toString())
        expect(ship.getName()).toEqual("Battleship")
        expect(ship.isSunk()).toEqual(false)
      });

      test("ships returns the ship at coords", () => {
        const newBoard = new Gameboard(10,10);
        newBoard.placeShip("Destroyer", 4, [[5,1],[5,2],[5,3]])
        const ship = newBoard.getShips().get([5,1].toString())
        expect(ship.getName()).toEqual("Destroyer")
        expect(ship.getHits()).toEqual(0)
      });

      test("Multiple hits at ship actually affect the same ship object", () => {
        const newBoard = new Gameboard(10,10);
        newBoard.placeShip("Destroyer", 4, [[5,1],[5,2],[5,3]])
        const ship = newBoard.getShips().get([5,1].toString())
        const shipB = newBoard.getShips().get([5,2].toString())
        expect(ship === shipB).toEqual(true)
      });

    test("receiveAttack returns null if coords contain nothing", () => {
      const newBoard = new Gameboard(10,10);
      expect(newBoard.receiveAttack(1,1)).toEqual(null)
    });

    test("receiveAttack records coords of missed shots", () => {
        const newBoard = new Gameboard(10,10);
        newBoard.receiveAttack(1,1);
        newBoard.receiveAttack(1,2);
        expect(newBoard.getMisses().has([1,1].toString())).toEqual(true);
        expect(newBoard.getMisses().has([1,2].toString())).toEqual(true);
        expect(newBoard.getMisses().has([1,3].toString())).toEqual(false);
      });

    test("receiveAttack deals damage to ship at coords", () => {
        const newBoard = new Gameboard(10,10);
        newBoard.placeShip("Battleship", 4, [[5,1],[5,2],[5,3],[5,4]])
        const ship = newBoard.receiveAttack(5,1);
        expect(ship.getHits()).toEqual(1)
      });

      test("Gameboard reports correct amount of ships active", () => {
        const newBoard = new Gameboard(10,10);
        newBoard.placeShip("Patrol Boat", 1, [[5,2]])
        newBoard.placeShip("Patrol BoatB", 1, [[5,3]])
        newBoard.receiveAttack(5,2)
        expect(newBoard.getShipsActive()).toEqual(1)
      });
  });
  
  
  describe("player", () => {

    test("Is defined", () => {
      expect(Player).toBeDefined;
    });
  
    test("One player has a working gameboard", () => {
        const player1 = new Player();
        const p1Board = player1.getBoard();
        p1Board.placeShip("Patrol Boat", 1, [[5,2]]);
        const newShip = p1Board.getShips().get([5,2].toString())
      expect(newShip.getName()).toEqual("Patrol Boat")
    });

  });
  