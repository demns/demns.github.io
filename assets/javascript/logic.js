var TTTApplication = {
  count: 0,
  svgCircle: '<circle cx="5" cy="5" r="4" stroke="black" stroke-width="2" fill-opacity="0" />',
  svgCross: '<line x1="0" y1="0" x2="10" y2="10" style="stroke:purple;stroke-width:2" />' +
    '<line x1="0" y1="10" x2="10" y2="0" style="stroke:purple;stroke-width:2" />',
  svgOpenTag: '<svg width="50%" height="50%" viewBox="0 0 10 10" style="display: block; margin: 0 auto;">',
  svgCloseTag: '</svg>',
  newRow: '<tr></tr>',
  cellsTable: $("table#cells"),
  lastBodyItemQuery: 'table#cells > tbody:last',
  mainDivItemQuery: "div#contents",
  cellClassName: 'cell',
  cellTemplateQuery: '#cell-template',
  firstMoveComputer: false,

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
    var success = false,
      randNumber;
    do {
      randNumber = Math.floor((Math.random() * 9));
      success = this.makeMove($('.' + this.cellClassName)[randNumber], true);
    }
    while (!success);
  },

  makeMove: function(el, computerMove) {
    if (TTTApplication.count === 9) {
      return true;
    }
    if (el.innerHTML.indexOf('circle') > 0 ||
      el.innerHTML.indexOf('line') > 0) {
      if (computerMove) {
        return false;
      }
    }
    if (TTTApplication.count++ % 2 === 0) {
      el.innerHTML = TTTApplication.svgOpenTag + TTTApplication.svgCross + TTTApplication.svgCloseTag;
    } else {
      el.innerHTML = TTTApplication.svgOpenTag + TTTApplication.svgCircle + TTTApplication.svgCloseTag;
    }
    if (TTTApplication.firstMoveComputer && TTTApplication.count % 2 === 0) {
      TTTApplication.computerMove();
    }
    if (!TTTApplication.firstMoveComputer && !(TTTApplication.count % 2 === 0)) {
      TTTApplication.computerMove();
    }

    return true;
  }
};

//backbone
(function() {
  Cell = Backbone.Model.extend({

  });

  Cells = Backbone.Collection.extend({
    model: Cell
  });

  CellView = Backbone.View.extend({
    tagName: 'td',
    className: TTTApplication.cellClassName,

    events: {
      click: 'changeState'
    },

    changeState: function() {
      TTTApplication.makeMove(this.el, false);
    },

    render: function() {
      $(this.el).html(TTTApplication.svgOpenTag + TTTApplication.svgCloseTag + _.template($(TTTApplication.cellTemplateQuery).html(), {}));
      return this;
    }
  });

  CellsView = Backbone.View.extend({
    el: $(TTTApplication.mainDivItemQuery),

    render: function() {
      this.collection.each(function(cell) {
        var currCellNumber = cell.attributes.name,
          cellView = new CellView({
            model: cell
          }),
          tableLast = $(TTTApplication.lastBodyItemQuery);
        tableLast.append(cellView.render().el);
        if (currCellNumber % 3 === 0) {
          tableLast.append(TTTApplication.newRow);
        }
      });
    }
  });

  TTTApplication.setup();
}());
