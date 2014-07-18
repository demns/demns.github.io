var MyApp = new Backbone.Marionette.Application();
MyApp.globalVars = {};
MyApp.globalVars.currMove = 0;
MyApp.globalVars.currArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
MyApp.globalVars.appendIndex = 0;
MyApp.globalVars.checkForWin = function () {
    var arr = MyApp.globalVars.currArray;

    if (arr[0] === arr[1] && arr[1] === arr[2]) {
        MyApp.globalVars.theWinnerIs = arr[2];
        return true;
    }
    if (arr[3] === arr[4] && arr[4] === arr[5]) {
        MyApp.globalVars.theWinnerIs = arr[5];
        return true;
    }
    if (arr[6] === arr[7] && arr[7] === arr[8]) {
        MyApp.globalVars.theWinnerIs = arr[8];
        return true;
    }
    if (arr[0] === arr[3] && arr[3] === arr[6]) {
        MyApp.globalVars.theWinnerIs = arr[6];
        return true;
    }
    if (arr[1] === arr[4] && arr[4] === arr[7]) {
        MyApp.globalVars.theWinnerIs = arr[7];
        return true;
    }
    if (arr[2] === arr[5] && arr[5] === arr[8]) {
        MyApp.globalVars.theWinnerIs = arr[8];
        return true;
    }
    if (arr[0] === arr[4] && arr[4] === arr[8]) {
        MyApp.globalVars.theWinnerIs = arr[8];
        return true;
    }
    if (arr[2] === arr[4] && arr[4] === arr[6]) {
        MyApp.globalVars.theWinnerIs = arr[6];
        return true;
    }

    for (var i = 0; i < 9; i++) {
        if (arr[i] === 'X' || arr[i] === 'O') {
            return false;
        }
    }

    MyApp.globalVars.theWinnerIs = "Draw";
    return true;
};

MyApp.globalVars.theWinnerIs = false;

MyApp.addRegions({
    mainRegion: "#content"
});

var Cell = Backbone.Model.extend({});

var Cells = Backbone.Collection.extend({
    model: Cell
});


var CellView = Backbone.Marionette.ItemView.extend({
    template: "#cell-template",
    tagName: 'td',
    className: 'cell',
    events: {
        'click': 'changeState'
    },

    changeState: function() {
        if (MyApp.globalVars.theWinnerIs === false) {
            var ch = MyApp.globalVars.currMove++ % 2 === 0 ? 'X' : 'Y';
            this.el.firstElementChild.innerHTML = ch;
            MyApp.globalVars.currArray[parseInt(this.el.firstElementChild.id[2], 10) - 1] = ch;
            var winnerField = $("#winner");
            if (MyApp.globalVars.checkForWin()) {
                winnerField.text("The winner is: " + MyApp.globalVars.theWinnerIs);
            }
        }
    },
});




var CellsView = Backbone.Marionette.CompositeView.extend({
    tagName: "tr",
    id: "cells",
    className: "table table-bordered",
    template: "#cells-template",
    itemView: CellView,

    appendHtml: function(collectionView, itemView) {
        if (MyApp.globalVars.appendIndex++ % 3 === 0) {
            collectionView.$("tbody").append("<tr></tr>");
        }
        collectionView.$("tbody").append(itemView.el);
    }
});

MyApp.addInitializer(function(options) {
    var cellsView = new CellsView({
        collection: options.cells
    });
    MyApp.mainRegion.show(cellsView);
});

$(document).ready(function() {
    var cells = new Cells([
        new Cell({ name: '1' }),
        new Cell({ name: '2' }),
        new Cell({ name: '3' }),
        new Cell({ name: '4' }),
        new Cell({ name: '5' }),
        new Cell({ name: '6' }),
        new Cell({ name: '7' }),
        new Cell({ name: '8' }),
        new Cell({ name: '9' })
    ]);

    MyApp.start({ cells: cells });
});
