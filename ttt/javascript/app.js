import { AI } from './AI.js';
import { GAME_CONFIG } from './config.js';

// --- Main Application Logic ---
export const TTTApplication = {
    boardState: [],
    svgCircle: '<circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="2" fill-opacity="0"/>',
    svgCross: `<line x1="0" y1="0" x2="10" y2="10" style="stroke:currentColor;stroke-width:2"/><line x1="0" y1="10" x2="10" y2="0" style="stroke:currentColor;stroke-width:2"/>`,
    svgOpenTag: '<svg width="50%" height="50%" viewBox="0 0 10 10" style="display: block; margin: 0 auto;" role="img">',
    svgCloseTag: '</svg>',
    firstMoveComputer: false,
    gameBoard: document.getElementById('contents'),
    turnIndicator: document.getElementById('turn-indicator'),
    newGameButton: document.getElementById('new-game-button'),
    playAsXButton: document.getElementById('play-as-x'),
    playAsOButton: document.getElementById('play-as-o'),
    X: 'X',
    O: 'O',

    getComputerSymbol: function() {
      return this.firstMoveComputer ? this.X : this.O;
    },

    getPlayerSymbol: function() {
      return this.firstMoveComputer ? this.O : this.X;
    },

    clearBoard: function () {
      this.gameBoard.innerHTML = '';
      this.boardState = Array(GAME_CONFIG.BOARD_SIZE).fill('');
      const winningLine = document.getElementById('winning-line');
      if (winningLine) winningLine.remove();
    },

    setup: function (firstMoveComputer = false) {
      this.firstMoveComputer = firstMoveComputer;
      this.clearBoard();

      const whoStarts = this.firstMoveComputer ? 'Computer' : 'Your';
      this.newGameButton.classList.remove('show');
      this.turnIndicator.textContent = `${whoStarts} turn`;
      this.gameBoard.classList.remove('game-over');

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
        cell.addEventListener('click', () => this.handleCellClick(i));
        cell.setAttribute('role', 'gridcell');
        this.gameBoard.appendChild(cell);
      }

      if (this.firstMoveComputer) {
        this.computerMove();
      }
    },

    computerMove: function () {
      if (this.isGameOver()) return;

      const computerSymbol = this.getComputerSymbol();
      const cellIndex = AI.calculateComputerMove(this.boardState, computerSymbol);
      if (cellIndex !== -1) {
        this.makeMove(cellIndex);
      }
    },

    handleCellClick: function(index) {
      const isComputerTurn = this.getCurrentTurn() === this.getComputerSymbol();
      if (!isComputerTurn) {
        this.makeMove(index);
      }
    },

    getCurrentTurn: function() {
      const moveCount = this.boardState.filter(p => p !== '').length;
      return moveCount % 2 === 0 ? this.X : this.O;
    },

    isGameOver: function() {
      const moveCount = this.boardState.filter(p => p !== '').length;
      return AI.isFinished(this.boardState) || moveCount === 9;
    },

    makeMove: function (index) {
      if (this.isGameOver() || this.boardState[index] !== '') {
        return;
      }

      const symbol = this.getCurrentTurn();
      this.boardState[index] = symbol;

      const cell = this.gameBoard.querySelector(`[data-index='${index}']`);
      const symbolClass = symbol === this.X ? 'cross' : 'circle';
      const symbolSvg = symbol === this.X ? this.svgCross : this.svgCircle;
      cell.innerHTML = this.svgOpenTag.replace('>', ` class="${symbolClass}">`) + symbolSvg + this.svgCloseTag;
      cell.setAttribute('aria-label', `Cell ${index + 1}, occupied by ${symbol}`);

      const moveCount = this.boardState.filter(p => p !== '').length;
      const winningLine = AI.isFinished(this.boardState);

      if (winningLine) {
        this.turnIndicator.textContent = 'Game Over!';
        this.gameBoard.classList.add('game-over');
        this.drawWinningLine(winningLine);
        this.newGameButton.classList.add('show');
        this.newGameButton.focus(); // Set focus for accessibility
      } else if (moveCount === 9) {
        this.turnIndicator.textContent = 'It\'s a draw!';
        this.gameBoard.classList.add('game-over');
        this.newGameButton.classList.add('show');
        this.newGameButton.focus(); // Set focus for accessibility
      } else {
        const nextSymbol = this.getCurrentTurn();
        const isNextTurnComputer = nextSymbol === this.getComputerSymbol();
        const nextPlayer = isNextTurnComputer ? 'Computer' : 'Your';
        this.turnIndicator.textContent = `${nextPlayer} turn`;

        if (isNextTurnComputer) {
          this.computerMove();
        }
      }
    },

    drawWinningLine: function(line) {
      const cells = this.gameBoard.querySelectorAll('.cell');
      const startCell = cells[line[0]];
      const endCell = cells[line[2]];

      // Highlight the winning cells
      line.forEach(index => cells[index].classList.add('winning-cell'));

      const startRect = startCell.getBoundingClientRect();
      const endRect = endCell.getBoundingClientRect();
      const boardRect = this.gameBoard.getBoundingClientRect();

      const startX = startRect.left + startRect.width / 2 - boardRect.left;
      const startY = startRect.top + startRect.height / 2 - boardRect.top;
      const endX = endRect.left + endRect.width / 2 - boardRect.left;
      const endY = endRect.top + endRect.height / 2 - boardRect.top;

      const svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgLine.id = 'winning-line';
      svgLine.innerHTML = `<line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" />`;
      this.gameBoard.appendChild(svgLine);
    }
};

// --- Initializer ---
// Player starts as X by default on first load.
TTTApplication.setup(false);

TTTApplication.newGameButton.addEventListener('click', () => TTTApplication.setup(TTTApplication.firstMoveComputer));
TTTApplication.playAsXButton.addEventListener('click', () => TTTApplication.setup(false)); // Player is X, computer is O, player starts.
TTTApplication.playAsOButton.addEventListener('click', () => TTTApplication.setup(true)); // Player is O, computer is X, computer starts.