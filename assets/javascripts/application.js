(function () {
    "use strict";
    var gameLogicModule = {};
    gameLogicModule.winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    gameLogicModule.checkForWin = function () {
        var arr = mainModule.globalVars.currArray,
            i = 0,

            isWinningCombination = function () {
                var winnComb = gameLogicModule.winningCombinations,
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
            mainModule.globalVars.theWinnerIs = isWin;
            return true;
        }

        for (i = 0; i < 9; i++) {
            if (arr[i] !== 'X' && arr[i] !== 'Y') {
                return false;
            }
        }

        mainModule.globalVars.theWinnerIs = "Draw";
        return true;
    };




    var mainModule = new window.Backbone.Marionette.Application();
    mainModule.globalVars = {};
    mainModule.globalVars.currMove = 0;
    mainModule.globalVars.currArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    mainModule.globalVars.appendIndex = 0;
    mainModule.globalVars.theWinnerIs = false;


    mainModule.addRegions({
        mainRegion: "#content"
    });

    mainModule.addInitializer(function (options) {
        var cellsView = new CellsView({
            collection: options.cells
        });
        mainModule.mainRegion.show(cellsView);
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
                var elem = this.el,
                    ch = mainModule.globalVars.currMove % 2 === 0 ? 'X' : 'Y',
                    winnerField = $("#winner"),
                    path = ((ch === 'X') ? "cross" : "nought") + Math.round(Math.random() * 2 + 1) + ".png",
                    gameArr = mainModule.globalVars.currArray;

                if (mainModule.globalVars.theWinnerIs === false &&
                    gameArr[parseInt(elem.id[0], 10) - 1] !== 'X' &&
                    gameArr[parseInt(elem.id[0], 10) - 1] !== 'Y') {


                    elem.innerHTML = '';
                    var img = document.createElement("img");
                    img.src = "./assets/images/" + path;
                    elem.appendChild(img);

                    gameArr[parseInt(elem.id[0], 10) - 1] = ch;
                    mainModule.globalVars.currMove++;

                    if (gameLogicModule.checkForWin()) {
                        winnerField.text("The winner is: " + mainModule.globalVars.theWinnerIs);
                    }

                    if (ch === 'X' && mainModule.globalVars.theWinnerIs === false) {
                        var currStrike = 1,
                            currMove = mainModule.globalVars.currMove;
                        if (currMove === 1) {
                            if (gameArr[0] === 'X' || gameArr[2] === 'X' || gameArr[6] === 'X' || gameArr[8] === 'X') {
                                currStrike = 4;
                            }
                            if (gameArr[4] === 'X') {
                                currStrike = 0;
                            }
                            if (gameArr[1] === 'X' || gameArr[3] === 'X' || gameArr[5] === 'X' || gameArr[7] === 'X') {
                                currStrike = 4;
                            }
                        }
                        
                        if (currMove !== 1) { 
                            currStrike = Math.round(Math.random() * 8);
                            while (mainModule.globalVars.currArray[currStrike] === 'X' ||
                                mainModule.globalVars.currArray[currStrike] === 'Y') {
                                currStrike = Math.round(Math.random() * 8);
                            }

                        }
                        currStrike++;
                        $("#" + currStrike).click();
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
                if (mainModule.globalVars.appendIndex++ % 3 === 0) {
                    collectionView.$("tbody").append("<tr></tr>");
                }
                itemView.el.id = itemView.el.innerHTML.trim();
                collectionView.$("tbody").append(itemView.el);
            }
        });


    $(document).ready(function () {
        var cells = new Cells(),
            i;
        for (i = 1; i < 10; i++) {
            cells.push(new Cell({ name: i }));
        }

        mainModule.start({ cells: cells });
    });
}());