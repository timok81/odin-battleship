class DOM {
  randomizeButton = document.querySelector("#randomize");
  p1ShipIcons = document.querySelector(".p1Ships");
  p2ShipIcons = document.querySelector(".p2Ships");
  p1VisualBoard = document.querySelector(".p1Board");
  p2VisualBoard = document.querySelector(".p2Board");
  turnInfo = document.querySelector(".turnInfo");

  setupNewGameButton(callback) {
    this.randomizeButton.addEventListener("click", callback);
  }

  changeTurnInfo(player) {
    this.turnInfo.textContent = player.getName() + "'s turn";
  }

  displayWinMsg(player) {
    this.turnInfo.textContent = player.getName() + " has won!";
  }

  createVisualSquare() {
    const visualSquare = document.createElement("div");
    visualSquare.classList.add("square");
    return visualSquare;
  }

  appendVisualSquare(visualBoard, visualSquare) {
    visualBoard.appendChild(visualSquare);
  }

  renderVisualBoard(board, squareList) {
    board.getHits().forEach((hitPos) => {
      const hitSquare = squareList.get(hitPos.toString());
      hitSquare.classList.add("hit");
    });

    board.getMisses().forEach((missPos) => {
      const missSquare = squareList.get(missPos.toString());
      missSquare.textContent = "x";
    });
  }

  fadeBoard(player) {
    if (player === 1) {
      this.p2VisualBoard.classList.remove("faded");
      this.p1VisualBoard.classList.add("faded");
    } else if (player === 2) {
      this.p1VisualBoard.classList.remove("faded");
      this.p2VisualBoard.classList.add("faded");
    }
  }

  placeVisualShip(
    name = "Ship",
    length = 4,
    pos = [0, 0],
    //0 is horizontal, 1 is vertical
    orientation = 0,
    board,
    playerType
  ) {
    const shipDiv = document.createElement("div");
    shipDiv.classList.add("shipDiv");
    let posArray = []; //for passing ship coordinates to board
    const ships = board.getShips();
    const dirs = [
      [0, 0],
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ];
    let shipPlacementIsValid = true;

    if (orientation === 0) {
      shipDiv.style.width = 40 * length + "px";
      shipDiv.style.height = "40px";

      for (let i = 0; i < length; i++) {
        posArray.push([pos[0], pos[1] + i]);

        dirs.forEach((element) => {
          const newRow = pos[0] + element[0];
          const newCol = pos[1] + element[1] + i;
          if (ships.has(Number(newRow) + "," + Number(newCol)) || newCol > 9) {
            shipPlacementIsValid = false;
          }
        });
      }
    } else if (orientation === 1) {
      shipDiv.style.height = 40 * length + "px";
      shipDiv.style.width = "40px";

      for (let i = 0; i < length; i++) {
        posArray.push([pos[0] + i, pos[1]]);

        dirs.forEach((element) => {
          const newRow = pos[0] + element[0] + i;
          const newCol = pos[1] + element[1];
          if (ships.has(Number(newRow) + "," + Number(newCol)) || newRow > 9) {
            shipPlacementIsValid = false;
          }
        });
      }
    }
    if (shipPlacementIsValid === false) return false;
    if (playerType === 0) this.p1VisualBoard.appendChild(shipDiv);

    shipDiv.style.transform = `translateX(${pos[1] * 40}px) translateY(${
      pos[0] * 40
    }px)`;

    board.placeShip(name, length, posArray);
    return true;
  }

  renderShipIcons(board, player) {
    let iconList;
    if (player === 2) iconList = this.p2ShipIcons;
    else if (player === 1) iconList = this.p1ShipIcons;
    const previousIcons = iconList.querySelectorAll(".shipIcon, .shipIconSunk");
    previousIcons.forEach((element) => {
      element.remove();
    });

    board.getShipList().forEach((element) => {
      const shipIcon = document.createElement("div");
      if (element.isSunk()) {
        shipIcon.classList.add("shipIconSunk");
      } else shipIcon.classList.add("shipIcon");
      shipIcon.style.width = 10 * element.getLength() + "px";
      shipIcon.style.height = "10px";
      iconList.appendChild(shipIcon);
    });
  }

  placeShipRandomly(name = "Ship", length = 4, board, playerType = 0) {
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);
    let orient;
    Math.random() < 0.5 ? (orient = 0) : (orient = 1);
    return this.placeVisualShip(name, length, [row, col], orient, board, playerType);
  }

  randomPlacement(p1Board, p2Board) {
    const prevVisualShips = document.querySelectorAll(".shipDiv");
    prevVisualShips.forEach((element) => {
      element.remove();
    });

    let ship = false;
    while (ship === false) ship = this.placeShipRandomly("Carrier", 5, p1Board);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Battleship", 4, p1Board);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Destroyer", 3, p1Board);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Destroyer", 3, p1Board);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Submarine", 3, p1Board);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Patrol Boat", 2, p1Board);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Patrol Boat", 2, p1Board);

    ship = false;
    while (ship === false) ship = this.placeShipRandomly("Carrier", 5, p2Board, 1);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Battleship", 4, p2Board, 1);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Destroyer", 3, p2Board, 1);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Destroyer", 3, p2Board, 1);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Submarine", 3, p2Board, 1);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Patrol Boat", 2, p2Board, 1);
    ship = false;
    while (ship === false)
      ship = this.placeShipRandomly("Patrol Boat", 2, p2Board, 1);
  }
}

export { DOM };