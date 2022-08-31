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
      TTTApplication.makeMove(this.el);
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
          lastBodyItemQuery = 'table#cells > tbody:last',
          cellView = new CellView({
            model: cell
          }),
          tableLast = $(lastBodyItemQuery);

        tableLast.append(cellView.render().el);

        if (currCellNumber % 3 === 0) {
          tableLast.append(TTTApplication.newRow);
        }

      });
    }
  });

  TTTApplication.setup();
}());
