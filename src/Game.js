class Game {
  /**
   * @param {Element} element
   * @param {Element} message
   * @param {Element} reset
   */
  constructor(element, message, reset) {
    this.play = this.play.bind(this);
    this.reset = this.reset.bind(this);

    this.element = element;
    this.message = message;
    this.winner = false;
    this.players = [ new Player('player1'), new Player('player2') ];
    this.cells = Array.from(element.getElementsByClassName('cell'))
      .map(element => new Cell(element, this.play));

    reset.addEventListener('click', this.reset);

    this.update();
  }

  /**
   * Reset game
   */
  reset() {
    this.winner = false;
    this.cells.forEach(cell => cell.reset());
    this.update();
  }

  /**
   * On cell selected
   *
   * @param {Cell} cell
   */
  play(cell) {
    if (!this.isDone() && cell.isFree()) {
      cell.setOwner(this.getCurrentPlayer());
      this.resolve();
      this.update();
    }
  }

  /**
   * Is game done?
   */
  resolve() {
    let line = null;
    const winner = this.players.find(player => line = this.getWinningLine(player));

    if (winner) {
      // Game is won!
      this.end(winner, line);
    }

    if (!this.isPlayable()) {
      // No more cells to play!
      return this.end();
    }
  }

  /**
   * End of the game
   *
   * @param {Player|null} winner
   */
  end(winner = null, line = []) {
    this.winner = winner;
    line.forEach(cell => cell.setWinning());
  }

  /**
   * Is done?
   *
   * @return {Boolean}
   */
  isDone() {
    return this.winner !== false;
  }

  /**
   * Is playable?
   *
   * @return {Boolean}
   */
  isPlayable() {
    return this.cells.some(cell => cell.isFree());
  }

  /**
   * Who's turn is it?
   *
   * @return {Player}
   */
  getCurrentPlayer() {
    return this.players.reduce((current, player) => {
      return this.getCells(current).length <= this.getCells(player).length ? current : player;
    }, this.players[0]);
  }

  /**
   * Get all cells owned by the given player
   *
   * @param {Player} player
   *
   * @return {Cell[]}
   */
  getCells(player) {
    return this.cells.filter(cell => cell.isOwned(player));
  }

  /**
   * Has the given player won?
   *
   * @param {Player} player
   *
   * @return {Cell[]|null}
   */
  getWinningLine(player, size = 3) {
    const cells = this.getCells(player);
    const getLine = i => cells.filter(({ x }) => i === x);
    const getColumn = i => cells.filter(({ y }) => i === y);
    const getDiagonal = () => cells.filter(({ x, y }) => y === x);
    const getAntiDiagonal = () => cells.filter(({ x, y }) => (y + x) === size - 1);

    const lines = [getDiagonal(), getAntiDiagonal()];

    for (let i = 0; i < size; i++) {
      lines.push(getLine(i), getColumn(i));
    }

    return lines.find(line => line.length >= size);
  }

  /**
   * Get message
   *
   * @return {String}
   */
  getMessage() {
    if (this.isDone()) {
      if (this.winner) {
        return `${this.winner.id} à gagné ! 🎉`;
      }

      return `Equalité, les joueurs sont trop malins. 😯`;
    }

    return `C'est à ${this.getCurrentPlayer().id} de jouer !`;
  }

  /**
   * Update HTML view
   */
  update() {
    this.message.innerText = this.getMessage();
  }
}
