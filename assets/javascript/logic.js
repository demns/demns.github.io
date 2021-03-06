var TTTApplication = {
  count: 0,
  svgCircle: '<circle cx="5" cy="5" r="4" stroke="black" stroke-width="2" fill-opacity="0" />',
  svgCross: '<line x1="0" y1="0" x2="10" y2="10" style="stroke:purple;stroke-width:2" />' +
    '<line x1="0" y1="10" x2="10" y2="0" style="stroke:purple;stroke-width:2" />',
  svgOpenTag: '<svg width="50%" height="50%" viewBox="0 0 10 10" style="display: block; margin: 0 auto;">',
  svgCloseTag: '</svg>',
  newRow: '<tr style="height:0"></tr>',
  cellsTable: $("table#cells"),
  lastBodyItemQuery: 'table#cells > tbody:last',
  mainDivItemQuery: "div#contents",
  cellClassName: 'cell',
  cellTemplateQuery: '#cell-template',
  firstMoveComputer: false,
  X: 'X',
  O: 'O',

  clearTable: function() {
    this.cellsTable.html(this.newRow);
    this.count = 0;
  },

  setup: function(firstMoveComputer) {
    this.firstMoveComputer = firstMoveComputer;
    this.clearTable();
    var cells = new Cells();
    for (var i = 1; i < 10; i++) {
      cells.add([new Cell({
        name: i
      })]);
    }
    var cellsView = new CellsView({
      collection: cells
    });
    cellsView.render();
    if (this.firstMoveComputer) {
      this.computerMove();
    }
  },

  computerMove: function() {
    var cellNumber = AI.calculateComputerMove(this.getPositionsArray(), this.count);
    this.makeMove($('.' + this.cellClassName)[cellNumber]);
  },

  getPositionsArray: function() {
    var positionsArray = ['', '', '', '', '', '', '', '', ''],
      X = this.X,
      O = this.O;

    for (var i = 0; i < 9; i++) {
      if ($('.' + this.cellClassName)[i].innerHTML.indexOf('circle') > 0) {
        positionsArray[i] = O;
      }
      if ($('.' + this.cellClassName)[i].innerHTML.indexOf('line') > 0) {
        positionsArray[i] = X;
      }
    };

    return positionsArray;
  },

  makeMove: function(el) {
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

    if (TTTApplication.count === 9) {
      return true;
    }

    if (TTTApplication.firstMoveComputer && TTTApplication.count % 2 === 0 ||
      (!TTTApplication.firstMoveComputer && !(TTTApplication.count % 2 === 0))) {
      TTTApplication.computerMove();
    }
  }
};
