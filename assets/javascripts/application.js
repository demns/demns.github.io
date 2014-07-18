var MyApp = new Backbone.Marionette.Application();
MyApp.globalVars = {};
MyApp.globalVars.currMove = 0;
MyApp.globalVars.currArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
MyApp.globalVars.winningCombinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
MyApp.globalVars.appendIndex = 0;
MyApp.globalVars.theWinnerIs = false;
MyApp.globalVars.checkForWin = function () {
    var arr = MyApp.globalVars.currArray;

    var isWinningCombination = function () {
        var winningCombinations = MyApp.globalVars.winningCombinations,
            length = winningCombinations.length;

        for (var j = 0; j < length; j++) {
            if (arr[winningCombinations[j][0]] === 
                arr[winningCombinations[j][1]] && arr[winningCombinations[j][1]] ===
                arr[winningCombinations[j][2]])
                return arr[winningCombinations[j][2]];
        }
        return false;
    };

    var isWin = isWinningCombination();
    if (isWin !== false) {
        MyApp.globalVars.theWinnerIs = isWin;
        return true;
    }

    for (var i = 0; i < 9; i++) {
        if (arr[i] !== 'X' && arr[i] !== 'Y') {
            return false;
        }
    }

    MyApp.globalVars.theWinnerIs = "Draw";
    return true;
};


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
        if (MyApp.globalVars.theWinnerIs === false && this.el.firstElementChild.innerHTML !== 'X' && this.el.firstElementChild.innerHTML !== 'Y') {
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
