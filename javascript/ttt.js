function inherit(C, P) {
    var F = function () {};
    F.prototype = P.prototype;
    C.prototype = new F();
    C.uber = P.prototype;
    C.prototype.constructor = C;
};

function Player(name) {
    this.name = name;
};

function ComputerPlayer(name) {
    inherit(ComputerPlayer, Player);
};

var Playboard = function(){
    var element = document.getElementById('board');

    this.update = function (itemPos) {
        var str;
        for (var i = 0; i < array.length; i++) {
            str += array[i];
        }
        this.element.innerHTML = str;
    }
};

var Mediator = function () {
    var isFinished = false,
    movesNumber = 0,
    currMovePlayer1 = true,
    players = {}
    that = this;

    that.setup = function () {
        players.first = new Player('First');
        players.second = new ComputerPlayer('Second');

        var buttons = document.getElementsByTagName('button');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.onclick = that.buttonpress;
        }
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
    },

    that.buttonpress = function (e) {
        var el = e.currentTarget;
        that.played(el);
    },

     that.finish = function () {
         var title = document.getElementById("title");
         title.innerHTML = "The game is finished";
         alert("the winner is i don't know who");
     }
};



(function () {
    var title = document.getElementById("title");
    title.innerHTML = "The game is started";

    var mediator = new Mediator();
    mediator.setup();
})();