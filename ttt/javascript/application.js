var Cell = Backbone.Model.extend({
  // No custom properties needed for the model
});

var Cells = Backbone.Collection.extend({
  model: Cell
});

var CellView = Backbone.View.extend({
  tagName: 'td',
  className: TTTApplication.cellClassName,

  events: {
    click: 'changeState'
  },

  changeState: function () {
    TTTApplication.makeMove(this.el);
  },

  render: function () {
    $(this.el).html(TTTApplication.svgOpenTag + TTTApplication.svgCloseTag + _.template($(TTTApplication.cellTemplateQuery).html(), {}));
    return this;
  }
});

var CellsView = Backbone.View.extend({
  el: $(TTTApplication.mainDivItemQuery),

  render: function () {
    this.collection.each(function (cell) {
      const currCellNumber = cell.attributes.name;
      const lastBodyItemQuery = 'table#cells > tbody:last';
      const cellView = new CellView({
        model: cell
      });
      const tableLast = $(lastBodyItemQuery);

      tableLast.append(cellView.render().el);

      if (currCellNumber % 3 === 0) {
        tableLast.append(TTTApplication.newRow);
      }
    });
  }
});

TTTApplication.setup();

TTTApplication.newGameButton.on('click', () => {
  TTTApplication.setup();
});
