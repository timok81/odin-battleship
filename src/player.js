import { Gameboard } from "./gameboard.js";

class Player {
  constructor(name, type = 0) {
    this.name = name;
    this.gameboard = new Gameboard(10, 10, this);
    //type 1 is computer, type 0 human
    this.type = type;
  }

  getBoard() {
    return this.gameboard;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }
}

export { Player };
