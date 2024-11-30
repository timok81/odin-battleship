class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
  hits = 0;
  sunk = false;

  hit() {
    this.hits++;
    this.sunk = this.hits === this.length;
  }

  getName() {
    return this.name;
  }

  getHits() {
    return this.hits;
  }

  isSunk() {
    return this.sunk;
  }

  getLength() {
    return this.length;
  }
}

export { Ship };
