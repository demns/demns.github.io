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

var playboard = {
    element: document.getElementById('board'),

    update: function (itemPos) {
        var str;
        for (var i = 0; i < array.length; i++) {
            str += array[i];
        }
        this.element.innerHTML = str;
    }
};

var mediator = {
    currMovePlayer1: true,

    players: {},

    setup: function () {
        var players = this.players;
        players.first = new Player('First');
        players.second = new ComputerPlayer('Second');

        var buttons = document.getElementsByTagName('button');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            button.onclick = mediator.buttonpress;
        }
    },

    played: function (el) {
        if (el.textContent != '_') {
            return;
        }

        if (this.currMovePlayer1) {
            el.textContent = 'X';
        }
        else {
            el.textContent = 'Y';
        }
        this.currMovePlayer1 = this.currMovePlayer1 ? false : true;
    },

    buttonpress: function (e) {
        var el = e.currentTarget;
        mediator.played(el);
    }
};


(function () {
    var title = document.getElementById("title");
    title.innerHTML = "The game is started";

    mediator.setup();
})();