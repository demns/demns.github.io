(function () {
  // --- Main Application Logic ---
  const TTTApplication = {
    boardState: [],
    svgCircle: '<circle cx="5" cy="5" r="4" stroke="currentColor" stroke-width="2" fill-opacity="0"/>',
    svgCross: `<line x1="0" y1="0" x2="10" y2="10" style="stroke:currentColor;stroke-width:2"/><line x1="0" y1="10" x2="10" y2="0" style="stroke:currentColor;stroke-width:2"/>`,
    svgOpenTag: '<svg width="50%" height="50%" viewBox="0 0 10 10" style="display: block; margin: 0 auto;" role="img">',
    svgCloseTag: '</svg>',
    firstMoveComputer: false,
    gameBoard: document.getElementById('contents'),
    turnIndicator: document.getElementById('turn-indicator'),
    newGameButton: document.getElementById('new-game-button'),
    X: 'X',
    O: 'O',

    clearBoard: function () {
      this.gameBoard.innerHTML = '';
      this.boardState = Array(9).fill('');
      const winningLine = document.getElementById('winning-line');
      if (winningLine) winningLine.remove();
    },

    setup: function (firstMoveComputer = false) {
      this.firstMoveComputer = firstMoveComputer;
      this.clearBoard();

      const whoStarts = this.firstMoveComputer ? 'Computer' : 'Your';
      this.newGameButton.classList.remove('show');
      this.turnIndicator.textContent = `${whoStarts} turn`;

      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
        cell.addEventListener('click', () => this.handleCellClick(i));
        this.gameBoard.appendChild(cell);
      }

      if (this.firstMoveComputer) {
        this.computerMove();
      }
    },

    computerMove: function () {
      if (this.isGameOver()) return;

      const computerSymbol = this.firstMoveComputer ? this.X : this.O;
      console.log('[APP] Computer to move. Symbol:', computerSymbol, 'Board:', this.boardState);
      const cellIndex = AI.calculateComputerMove(this.boardState, computerSymbol);
      console.log('[APP] AI chose move:', cellIndex);
      if (cellIndex !== -1) {
        this.makeMove(cellIndex);
      }
    },

    handleCellClick: function(index) {
      const isComputerTurn = this.getCurrentTurn() === (this.firstMoveComputer ? this.X : this.O);
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
        console.log('[APP] Game Over! Winning line:', winningLine);
        this.drawWinningLine(winningLine);
        this.newGameButton.classList.add('show');
      } else if (moveCount === 9) {
        this.turnIndicator.textContent = 'It\'s a draw!';
        console.log('[APP] Game is a draw.');
        this.newGameButton.classList.add('show');
      } else {
        const nextSymbol = this.getCurrentTurn();
        const isNextTurnComputer = nextSymbol === (this.firstMoveComputer ? this.X : this.O);
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
  TTTApplication.setup(false); // Initial setup on page load
  TTTApplication.newGameButton.addEventListener('click', () => TTTApplication.setup());

  // Make TTTApplication globally available for view.js
  window.TTTApplication = TTTApplication;
}());