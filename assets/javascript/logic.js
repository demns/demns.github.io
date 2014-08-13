var globalVars = {
    count: 0,
    svgCircle: '<circle cx="5" cy="5" r="4" stroke="black" stroke-width="2" fill-opacity="0" />',
    svgCross: '<line x1="0" y1="0" x2="10" y2="10" style="stroke:purple;stroke-width:2" />' +
        '<line x1="0" y1="10" x2="10" y2="0" style="stroke:purple;stroke-width:2" />',
    svgOpenTag: '<svg width="50%" height="50%" viewBox="0 0 10 10" style="display: block; margin: 0 auto;">',
    svgCloseTag: '</svg>'
};

(function() {
    Cell = Backbone.Model.extend({

    });

    Cells = Backbone.Collection.extend({
        model: Cell
    });

    CellView = Backbone.View.extend({
        tagName: 'td',
        className: 'cell',

        events: {
            'click': 'changeState'
        },
        changeState: function() {
            if (globalVars.count > 9 || this.el.innerHTML.indexOf('line') > 0 || this.el.innerHTML.indexOf('circle') > 0) {
                return;
            }
            if (globalVars.count++ % 2 === 0) {
                this.el.innerHTML = globalVars.svgOpenTag + globalVars.svgCross + globalVars.svgCloseTag;
            } else {
                this.el.innerHTML = globalVars.svgOpenTag + globalVars.svgCircle + globalVars.svgCloseTag;
            }

        },

        render: function() {
            $(this.el).html(globalVars.svgOpenTag + globalVars.svgCloseTag + _.template($('#cell-template').html(), {}));
            return this;
        }
    });

    CellsView = Backbone.View.extend({
        el: $("div#contents"),
        render: function() {
            this.collection.each(function(cell) {
                var currCellNumber = parseInt(cell.cid[1]);
                if (currCellNumber !== 1 && currCellNumber % 3 === 1) {
                    $("table#cells > tbody:last").append('<tr></tr>');
                }
                var cellView = new CellView({
                    model: cell
                });
                $("table#cells > tbody:last").append(cellView.render().el);
            });
        }
    });
}());

(function() {
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
}());