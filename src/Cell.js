class Cell {
  /**
   * Get index of the given element in its parent
   *
   * @param {Element} element
   *
   * @return {Number}
   */
  static getIndex(element) {
    return Array.from(element.parentElement.children).indexOf(element);
  }

  /**
   * @param {Element} element
   * @param {String} id
   * @param {Function} onClick
   */
  constructor(element, onClick) {
    this.element = element;
    this.x = this.constructor.getIndex(element);
    this.y = this.constructor.getIndex(element.parentElement);
    this.player = null;
    this.winning = false;

    this.element.addEventListener('click', () => onClick(this));
  }

  /**
   * Is the cell free?
   *
   * @return {Boolean}
   */
  isFree() {
    return this.player === null;
  }

  /**
   * Is the cell owned by the given player?
   *
   * @param {Player} player
   *
   * @return {Boolean}
   */
  isOwned(player) {
    return this.player === player;
  }

  /**
   * Set owner
   *
   * @param {Player} player
   */
  setOwner(player) {
    if (this.isFree()) {
      this.player = player;
    }
  }

  /**
   * Mark as winning
   */
  setWinning() {
    this.winning = true;
  }

  /**
   * Reset cell
   */
  reset() {
    this.player = null;
    this.winning = false;
  }

  /**
   * Update HTML view
   */
  update() {
    const playerClass = this.player ? this.player.id : '';
    const winningClass = this.winning ? 'win' : '';

    this.element.className = `cell ${playerClass} ${winningClass}`;
  }
}
