import { DOM } from "./dom.js";
import { Player } from "./player.js";

class GameController {
  dom = new DOM();
  player1;
  player2;
  p1Board;
  p2Board;

  p1SquaresOfPos = new Map(); //used for retrieving visual square of pos
  p1PosOfSquares = new Map(); //used for retrieving pos of visual square
  p2SquaresOfPos = new Map(); //used for retrieving visual square of pos
  p2PosOfSquares = new Map(); //used for retrieving pos of visual square

  turn = null; //keeps track of whose turn it is
  gameWon = 0;

  availablePositions = []; //Used by AI to keep track available positions to attack
  previousHits = []; //Used by AI to keep track of hits
  miss = null; //Used by AI to figure out where to attack after missing after 2 hits

  setupGameBoard(
    player = this.player1,
    board = this.p1Board,
    visualBoard
  ) {
    for (let row = 0; row < 10; row++) {
      for (let column = 0; column < 10; column++) {
        if (board === this.p1Board) this.availablePositions.push([row, column].toString());

        const visualSquare = this.dom.createVisualSquare();
        let pos = [row, column].toString();

        if (player === this.player1) {
          this.p1SquaresOfPos.set(pos, visualSquare);
          this.p1PosOfSquares.set(visualSquare, pos);
        } else if (player === this.player2) {
          this.p2SquaresOfPos.set(pos, visualSquare);
          this.p2PosOfSquares.set(visualSquare, pos);
        }
        if (player.getType() === 1) {
          visualSquare.addEventListener("click", () =>
            this.clickSquare(visualSquare, board, row, column)
          );
        }
        this.dom.appendVisualSquare(visualBoard, visualSquare);
      }
    }
  }

  checkForWin(board = this.p2Board, player = this.turn, squares = this.p2SquaresOfPos) {
    if (board.getShipsActive() === 0) {
      this.dom.renderVisualBoard(board, squares);
      this.dom.displayWinMsg(player);
      this.gameWon = 1;
      this.turn = null;
      return true;
    }
    return false;
  }

  clickSquare(visualSquare, board, row, column) {
    //If clicking on own board
    if (this.turn != this.player1) return;
    if (board.getPlayer() === this.turn) return null;

    const pos = this.p2PosOfSquares.get(visualSquare);
    if (board.getReceivedAttacks().has(pos.toString())) return null;
    const hitShip = board.receiveAttack(row, column);

    if (hitShip) {
      if (hitShip.isSunk()) {
        this.dom.renderShipIcons(this.p2Board, 2);
      }
      if (this.checkForWin()) return;
    }
    this.dom.renderVisualBoard(this.p2Board, this.p2SquaresOfPos);
    this.changeTurn();
  }

  changeTurn() {
    if (this.gameWon === 1) return;
    if (this.turn === null) {
      this.turn = this.player1;
      this.dom.fadeBoard(1);
      this.dom.changeTurnInfo(this.player1);
    } else if (this.turn === this.player1) {
      this.turn = this.player2;
      setTimeout(() => this.dom.fadeBoard(2), 500);
      this.dom.changeTurnInfo(this.player2);
      setTimeout(() => this.computerPlay(),800);
    } else if (this.turn === this.player2) {
      this.turn = this.player1;
      this.dom.fadeBoard(1);
      this.dom.changeTurnInfo(this.player1);
    }
  }

  computerPlay(
    board = this.p1Board,
    squarePositions = this.p1PosOfSquares,
    squares = this.p1SquaresOfPos
  ) {
    if (this.turn != this.player2) return;
    let row;
    let column;
    [row, column] = this.getPosition(row, column);

    let visualSquare = squares.get([row, column].toString());
    const pos = squarePositions.get(visualSquare);
    const hitShip = board.receiveAttack(row, column);

    if (hitShip) {
      this.miss = null;
      if (hitShip.isSunk()) {
        this.previousHits = [];
        this.dom.renderShipIcons(this.p1Board, 1);
      } else {
        this.previousHits.push([pos[0], pos[2]]);
      }
      if (this.checkForWin(this.p1Board, this.turn, this.p1SquaresOfPos))
        return;
    } else {
      if (this.previousHits.length > 1) this.miss = [row, column];
    }
    this.dom.renderVisualBoard(board, squares);
    setTimeout(() => this.changeTurn(), 500);
  }

  getPosition(row, column) {
    const rng = Math.floor(Math.random() * this.availablePositions.length);
    if (this.previousHits.length === 0) {
      [row, column] = [this.availablePositions[rng].charAt(0), this.availablePositions[rng].charAt(2)];
      this.availablePositions.splice(rng, 1);
    } else if (this.previousHits.length > 0) {
      [row, column] = this.targetAdjacentSquares(row, column, rng);
    }
    return [row, column];
  }

  targetAdjacentSquares(row, column, rng) {
    let lastHit;
    let prevToLastHit;
    if (this.miss === null) {
      lastHit = this.previousHits[this.previousHits.length - 1];
      prevToLastHit = this.previousHits[this.previousHits.length - 2];
    } else if (this.miss != null) {
      lastHit = this.previousHits[0];
      prevToLastHit = this.miss;
    }
    const prevRow = Number(lastHit[0]);
    const prevCol = Number(lastHit[1]);
    const ogRow = this.previousHits[0][0];
    const ogCol = this.previousHits[0][1];
    let pos;
    if (this.previousHits.length > 1 && prevRow === Number(prevToLastHit[0])) {
      pos = [
        [prevRow, prevCol + 1],
        [prevRow, prevCol - 1],
        [ogRow, ogCol + 1],
        [ogRow, ogCol - 1],
      ];
    } else if (
      this.previousHits.length > 1 &&
      prevCol === Number(prevToLastHit[1])
    ) {
      pos = [
        [prevRow + 1, prevCol],
        [prevRow - 1, prevCol],
        [ogRow + 1, ogCol],
        [ogRow - 1, ogCol],
      ];
    } else {
      pos = [
        [prevRow + 1, prevCol],
        [prevRow, prevCol + 1],
        [prevRow - 1, prevCol],
        [prevRow, prevCol - 1],
      ];
    }
    if (this.availablePositions.includes([pos[0][0], pos[0][1]].toString())) {
      row = pos[0][0];
      column = pos[0][1];
    } else if (this.availablePositions.includes([pos[1][0], pos[1][1]].toString())) {
      row = pos[1][0];
      column = pos[1][1];
    } else if (
      pos[2] &&
      this.availablePositions.includes([pos[2][0], pos[2][1]].toString())
    ) {
      row = pos[2][0];
      column = pos[2][1];
    } else if (
      pos[3] &&
      this.availablePositions.includes([pos[3][0], pos[3][1]].toString())
    ) {
      row = pos[3][0];
      column = pos[3][1];
    } else {
      [row, column] = [
        this.availablePositions[rng].charAt(0),
        this.availablePositions[rng].charAt(2),
      ];
    }
    this.availablePositions.splice(this.availablePositions.indexOf([row, column].toString()), 1);
    return [row, column];
  }

  setupNewGame() {
    this.player1 = new Player("Player 1");
    this.player2 = new Player("Player 2", 1);
    this.p1Board = this.player1.getBoard();
    this.p2Board = this.player2.getBoard();

    const prevSquares = document.querySelectorAll(".square");
    prevSquares.forEach((element) => {
      element.remove();
    });

    this.dom.setupNewGameButton(() => this.setupNewGame());
    this.setupGameBoard(this.player1, this.p1Board, this.dom.p1VisualBoard);
    this.setupGameBoard(this.player2, this.p2Board, this.dom.p2VisualBoard);
    this.dom.randomPlacement(this.p1Board, this.p2Board);

    this.dom.renderShipIcons(this.p1Board, 1);
    this.dom.renderShipIcons(this.p2Board, 2);
    this.turn = null;
    this.gameWon = 0;
    this.changeTurn();
  }
}

export { GameController };