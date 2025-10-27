const TTTApplication = {
  count: 0,
  svgCircle: '<circle cx="5" cy="5" r="4" stroke="black" stroke-width="2" fill-opacity="0"/>',
  svgCross: `<line x1="0" y1="0" x2="10" y2="10" style="stroke:purple;stroke-width:2"/>
    <line x1="0" y1="10" x2="10" y2="0" style="stroke:purple;stroke-width:2"/>`,
  svgOpenTag: '<svg width="50%" height="50%" viewBox="0 0 10 10" style="display: block; margin: 0 auto;">',
  svgCloseTag: '</svg>',
  newRow: '<tr style="height:0"></tr>',
  cellsTable: $('table#cells'),
  lastBodyItemQuery: 'table#cells > tbody:last',
  mainDivItemQuery: 'div#contents',
  cellClassName: 'cell',
  cellTemplateQuery: '#cell-template',
  firstMoveComputer: false,
  gameBoard: $('div#contents'),
  turnIndicator: $('#turn-indicator'),
  newGameButton: $('#new-game-button'),
  X: 'X',
  O: 'O',

  clearTable: function () {
    this.cellsTable.html(this.newRow);
    $('#winning-line').remove(); // Remove old winning line
    this.count = 0;
  },

  setup: function (firstMoveComputer) {
    this.firstMoveComputer = firstMoveComputer;
    this.clearTable();
    const whoStarts = this.firstMoveComputer ? 'Computer' : 'Your';
    this.newGameButton.hide(); // Hide button at the start of a new game
    this.turnIndicator.text(whoStarts + " turn");
    const cells = new Cells();
    for (let i = 1; i < 10; i++) {
      cells.add([new Cell({
        name: i
      })]);
    }
    const cellsView = new CellsView({
      collection: cells
    });
    cellsView.render();
    if (this.firstMoveComputer) {
      this.computerMove();
    }
  },

  computerMove: function () {
    const cellNumber = AI.calculateComputerMove(this.getPositionsArray(), this.count);
    this.makeMove($('.' + this.cellClassName)[cellNumber]);
  },

  getPositionsArray: function () {
    const positionsArray = ['', '', '', '', '', '', '', '', ''];
    const X = this.X;
    const O = this.O;

    for (let i = 0; i < 9; i++) {
      if ($('.' + this.cellClassName)[i].innerHTML.indexOf('circle') > 0) {
        positionsArray[i] = O;
      }
      if ($('.' + this.cellClassName)[i].innerHTML.indexOf('line') > 0) {
        positionsArray[i] = X;
      }
    }

    return positionsArray;
  },

  makeMove: function (el) {
    if (AI.isFinished(this.getPositionsArray())) {
      return;
    }

    if (TTTApplication.count === 9 ||
      el.innerHTML.indexOf('circle') > 0 ||
      el.innerHTML.indexOf('line') > 0) {
      return;
    }

    if (TTTApplication.count++ % 2 === 0) {
      el.innerHTML = TTTApplication.svgOpenTag + TTTApplication.svgCross + TTTApplication.svgCloseTag;
    } else {
      el.innerHTML = TTTApplication.svgOpenTag + TTTApplication.svgCircle + TTTApplication.svgCloseTag;
    }

    const winningLine = AI.isFinished(this.getPositionsArray());
    if (winningLine) {
      this.turnIndicator.text('Game Over!');
      this.drawWinningLine(winningLine);
      this.newGameButton.show(); // Show button when game is over
    } else if (this.count === 9) {
      this.turnIndicator.text('It\'s a draw!');
      this.newGameButton.show();
    } else {
      const nextPlayer = (this.count % 2 === 0) === this.firstMoveComputer ? 'Computer' : 'Your';
      this.turnIndicator.text(nextPlayer + " turn");
    }

    if (!winningLine && this.count < 9 &&
      (TTTApplication.firstMoveComputer && TTTApplication.count % 2 === 0 ||
        (!TTTApplication.firstMoveComputer && !(TTTApplication.count % 2 === 0)))) {
      TTTApplication.computerMove();
    }
  },

  drawWinningLine: function (line) {
    const cells = $('.' + this.cellClassName);
    const startCell = $(cells[line[0]]);
    const endCell = $(cells[line[2]]);

    const startPos = startCell.position();
    const endPos = endCell.position();

    const startX = startPos.left + startCell.width() / 2;
    const startY = startPos.top + startCell.height() / 2;
    const endX = endPos.left + endCell.width() / 2;
    const endY = endPos.top + endCell.height() / 2;

    const svgLine = `<svg id="winning-line"><line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" style="stroke:red; stroke-width:10; stroke-linecap:round;"/></svg>`;

    this.gameBoard.append(svgLine);
  }
};
