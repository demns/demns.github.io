(function () {
    "use strict";
    var myApp = new window.Backbone.Marionette.Application();
    myApp.globalVars = {};
    myApp.globalVars.currMove = 0;
    myApp.globalVars.currArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    myApp.globalVars.winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    myApp.globalVars.appendIndex = 0;
    myApp.globalVars.theWinnerIs = false;
    myApp.globalVars.checkForWin = function () {
        var arr = myApp.globalVars.currArray,
            i = 0,

            isWinningCombination = function () {
                var winnComb = myApp.globalVars.winningCombinations,
                    length = winnComb.length;

                for (i = 0; i < length; i++) {
                    if (arr[winnComb[i][0]] ===
                        arr[winnComb[i][1]] && arr[winnComb[i][1]] ===
                        arr[winnComb[i][2]]) {
                        return arr[winnComb[i][2]];
                    }

                }
                return false;
            },
            isWin = isWinningCombination();

        if (isWin !== false) {
            myApp.globalVars.theWinnerIs = isWin;
            return true;
        }

        for (i = 0; i < 9; i++) {
            if (arr[i] !== 'X' && arr[i] !== 'Y') {
                return false;
            }
        }

        myApp.globalVars.theWinnerIs = "Draw";
        return true;
    };

    myApp.addRegions({
        mainRegion: "#content"
    });

    myApp.addInitializer(function (options) {
        var cellsView = new CellsView({
            collection: options.cells
        });
        myApp.mainRegion.show(cellsView);
    });


    var Cell = window.Backbone.Model.extend({}),

        Cells = window.Backbone.Collection.extend({
            model: Cell
        }),


        CellView = window.Backbone.Marionette.ItemView.extend({
            template: "#cell-template",
            tagName: 'td',
            className: 'cell',
            events: {
                'click': 'changeState'
            },

            changeState: function () {
                var elem = this.el.firstElementChild,
                    ch = myApp.globalVars.currMove % 2 === 0 ? 'X' : 'Y',
                    winnerField = $("#winner");
                if (myApp.globalVars.theWinnerIs === false &&
                    elem.innerHTML !== 'X' &&
                    elem.innerHTML !== 'Y') {

                    elem.innerHTML = ch;
                    myApp.globalVars.currArray[parseInt(elem.id[2], 10) - 1] = ch;
                    myApp.globalVars.currMove++;
                    if (myApp.globalVars.checkForWin()) {
                        winnerField.text("The winner is: " + myApp.globalVars.theWinnerIs);
                    }
                }
            }
        }),


        CellsView = window.Backbone.Marionette.CompositeView.extend({
            tagName: "tr",
            id: "cells",
            className: "table table-bordered",
            template: "#cells-template",
            itemView: CellView,

            appendHtml: function (collectionView, itemView) {
                if (myApp.globalVars.appendIndex++ % 3 === 0) {
                    collectionView.$("tbody").append("<tr></tr>");
                }
                collectionView.$("tbody").append(itemView.el);
            }
        });


    $(document).ready(function () {
        var cells = new Cells(),
            i;
        for (i = 1; i < 10; i++) {
            cells.push(new Cell({ name: i }));
        }

        myApp.start({ cells: cells });
    });
}());