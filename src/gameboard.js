import { Ship } from "./ship.js";

class Gameboard {
  constructor(rows, columns, player) {
    this.rows = rows;
    this.columns = columns;
    this.player = player;
  }
  allShipsSunk = false;
  #shipsActive = 0;
  #ships = new Map();
  #shipList = new Set();
  #misses = new Set();
  #receivedAttacks = new Set();
  #hits = new Set();

  getHits() {
    return this.#hits;
  }

  getShipList() {
    return this.#shipList;
  }

  getReceivedAttacks() {
    return this.#receivedAttacks;
  }

  getPlayer() {
    return this.player;
  }

  getSize() {
    return this.rows * this.columns;
  }

  getShipsActive() {
    return this.#shipsActive;
  }

  getMisses() {
    return this.#misses;
  }

  getShips() {
    return this.#ships;
  }

  receiveAttack(row, column) {
    this.#receivedAttacks.add([row, column].toString());

    const ship = this.#ships.get(`${row},${column}`);
    if (!ship) {
      this.#misses.add(`${row},${column}`);
      return null;
    }
    this.#hits.add(`${row},${column}`);
    ship.hit();
    if (ship.isSunk() === true) {
      console.log("Ship sunk")
      this.#shipsActive--;
    }
    if (this.#shipsActive === 0) {
      this.allShipsSunk = true;
    }
    return ship;
  }

  placeShip(name = "Battleship", length = 4, coords = []) {
    const newShip = new Ship(name, length);
    this.#shipsActive++;
    coords.forEach((element) => {
      this.#ships.set(element.toString(), newShip);
      this.#shipList.add(newShip);
    });
    return newShip;
  }
}

export { Gameboard };
