import { GameController } from "./gamecontroller.js";
import "./styles.css";

const gameController = new GameController();

document.addEventListener("DOMContentLoaded", () => {
  gameController.setupNewGame();
});
