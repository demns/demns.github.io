function inherit(C, P) {
    'use strict';
    var F = function () { };
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype;
    C.prototype.constructor = C;
}

function Player(name) {
    this.name = name;
}

function ComputerPlayer(name) {
    inherit(ComputerPlayer, Player);
    this.name = name;
}

var Playboard = function () {
    'use strict';
    //var element = document.getElementById('board'),
    //    i = 0;

    //this.update = function (itemPos) {
    //    var str = '';
    //    for (i = 0; i < array.length; i++) {
    //        str += array[i];
    //    }
    //    this.element.innerHTML = str;
    //}
};

var Mediator = function () {
    'use strict';
    var i = 0,
        button,
        isFinished = false,
        movesNumber = 0,
        currMovePlayer1 = true,
        players = {},
        that = this;

    that.setup = function () {
        players.first = new Player('First');
        players.second = new ComputerPlayer('Second');

        var buttons = document.getElementsByTagName('button');
        for (i = 0; i < buttons.length; i += 1) {
            button = buttons[i];
            button.onclick = that.buttonpress;
        }
        return that;
    },

    that.played = function (el) {
        if (el.textContent !== '_' || isFinished) {
            return;
        }

        if (currMovePlayer1) {
            el.textContent = 'X';
        }
        else {
            el.textContent = 'Y';
        }
        currMovePlayer1 = currMovePlayer1 ? false : true;
        movesNumber++;

        if (movesNumber === 9) {
            isFinished = true;
            that.finish();
        }
        return that;
    },

    that.buttonpress = function (e) {
        var el = e.currentTarget;
        that.played(el);
        return that;
    },

     that.finish = function () {
         var title = document.getElementById("title");
         title.innerHTML = "The game is finished";
         alert("the winner is i don't know who");
         return that;
     };
};



(function () {
    var title = document.getElementById("title");
    title.innerHTML = "The game is started";

    var mediator = new Mediator();
    mediator.setup();
})();