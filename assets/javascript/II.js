//1 Win: If the player has two in a row, they can place a third to get three in a row.
//2 Block: If the opponent has two in a row, the player must play the third themself to block the opponent.
//3 Fork: Create an opportunity where the player has two threats to win (two non-blocked lines of 2).
//4 Blocking an opponent's fork:
//    Option 1: The player should create two in a row to force the opponent into defending, as long as it doesn't result in them creating a fork. For example, if "X" has a corner, "O" has the center, and "X" has the opposite corner as well, "O" must not play a corner in order to win. (Playing a corner in this scenario creates a fork for "X" to win.)
//    Option 2: If there is a configuration where the opponent can fork, the player should block that fork.
//5 Center: A player marks the center. (If it is the first move of the game, playing on a corner gives "O" more opportunities to make a mistake and may therefore be the better choice; however, it makes no difference between perfect players.)
//6 Opposite corner: If the opponent is in the corner, the player plays the opposite corner.
//7 Empty corner: The player plays in a corner square.
//8 Empty side: The player plays in a middle square on any of the 4 sides.
var II = {
  twoInARow: [
    [0, 1, 2],
    [0, 2, 1],
    [1, 2, 0],
    [3, 4, 5],
    [3, 5, 4],
    [4, 5, 3],
    [6, 7, 8],
    [6, 8, 7],
    [7, 8, 6],
    [0, 3, 6],
    [0, 6, 3],
    [3, 6, 0],
    [1, 4, 7],
    [1, 7, 4],
    [4, 7, 1],
    [2, 5, 8],
    [2, 8, 5],
    [5, 8, 2],
    [0, 4, 8],
    [4, 8, 0],
    [0, 8, 4],
    [2, 4, 6],
    [2, 6, 4],
    [4, 6, 2]
  ],

  fork: [
    [2, 6, 1],
    [0, 8, 5],
    [2, 3, 0],
    [3, 8, 6],
    [0, 7, 6],
    [2, 7, 8],
    [5, 6, 8],
    [0, 5, 2],
    [1, 6, 0],
    [1, 8, 2],
    [1, 3, 6],
    [3, 7, 0],
    [1, 5, 2],
    [5, 7, 8]
  ],

  X: 'X',
  O: 'O',
  positions: [],

  currentPlayerX: function(currMove) {
    return currMove % 2 == 0;
  },

  haveTwoInARowCrosses: function() {
    var X = this.X,
      O = this.O;
    return this.isTwoInARow(X, O);
  },

  haveTwoInARowNoughts: function() {
    var X = this.X,
      O = this.O;
    return this.isTwoInARow(O, X);
  },

  isTwoInARow: function(ch, oppositeCh) {
    var twoInARow = this.twoInARow,
      positions = this.positions;
    for (var i = 0; i < twoInARow.length; i++) {
      if (positions[twoInARow[i][0]] == ch &&
        positions[twoInARow[i][1]] == ch &&
        positions[twoInARow[i][2]] != oppositeCh)
        return true;
    }
    return false;
  },

  winForNoughts: function() {
    var twoInARow = this.twoInARow,
      positions = this.positions,
      X = this.X,
      O = this.O;
    for (var i = 0; i < twoInARow.length; i++) {
      if (positions[twoInARow[i][0]] == O &&
        positions[twoInARow[i][1]] == O &&
        positions[twoInARow[i][2]] != X)
        return twoInARow[i][2];
    }
  },

  winForCrosses: function() {
    var twoInARow = this.twoInARow,
      positions = this.positions,
      X = this.X,
      O = this.O;
    for (var i = 0; i < twoInARow.length; i++) {
      if (positions[twoInARow[i][0]] == X &&
        positions[twoInARow[i][1]] == X &&
        positions[twoInARow[i][2]] != O)
        return twoInARow[i][2];
    }
  },

  blockFromNoughts: function() {
    return this.winForCrosses();
  },

  blockFromCrosses: function() {
    return this.winForNoughts();
  },

  haveForkCrosses: function() {
    var X = this.X,
      O = this.O;
    return this.isFork(X, O);
  },

  haveForkNoughts: function() {
    var X = this.X,
      O = this.O;
    return this.isFork(O, X);
  },

  isFork: function(ch, oppositeCh) {
    var fork = this.fork,
      positions = this.positions;
    for (var i = 0; i < fork.length; i++) {
      if (positions[fork[i][0]] == ch &&
        positions[fork[i][1]] == ch &&
        positions[fork[i][2]] != oppositeCh)
        return true;
    }
    return false;
  },

  setForkNoughts: function() {
    var fork = this.fork,
      positions = this.positions,
      X = this.X,
      O = this.O;
    for (var i = 0; i < fork.length; i++) {
      if (positions[fork[i][0]] == O &&
        positions[fork[i][1]] == O &&
        positions[fork[i][2]] != X)
        return fork[i][2];
    }
  },

  setForkCrosses: function() {
    var fork = this.fork,
      positions = this.positions,
      X = this.X,
      O = this.O;
    for (var i = 0; i < fork.length; i++) {
      if (positions[fork[i][0]] == X &&
        positions[fork[i][1]] == X &&
        positions[fork[i][2]] != O)
        return fork[i][2];
    }
  },

  blockForkFromNoughts: function() {
    return this.setForkCrosses();
  },

  blockForkFromCrosses: function() {
    return this.setForkNoughts();
  },

  getCorner: function(ch) {
    var positions = this.positions;
    if (positions[0] === ch && positions[8] === '') {
      return 8;
    }
    if (positions[2] === ch && positions[6] === '') {
      return 6;
    }
    if (positions[6] === ch && positions[2] === '') {
      return 2;
    }
    if (positions[8] === ch && positions[0] === '') {
      return 0;
    }
    return -1;
  },

  getCornerOrNot: function() {
    var positions = this.positions;
    if (positions[0] === '') return 0;
    if (positions[2] === '') return 2;
    if (positions[6] === '') return 6;
    if (positions[8] === '') return 8;
    return -1;
  },

  getSideOrNot: function() {
    var positions = this.positions;
    if (positions[1] === '') return 1;
    if (positions[3] === '') return 3;
    if (positions[5] === '') return 5;
    if (positions[7] === '') return 7;
    return -1;
  },

  calculateComputerMove: function(positions, currMove) {
    this.positions = positions;
    //1
    if (this.currentPlayerX(currMove)) {
      if (this.haveTwoInARowCrosses()) {
        return this.winForCrosses();
      }
    } else {
      if (this.haveTwoInARowNoughts()) {
        return this.winForNoughts();
      }
    }

    //2
    if (this.currentPlayerX(currMove)) {
      if (this.haveTwoInARowNoughts()) {
        return this.blockFromCrosses();
      }
    } else {
      if (this.haveTwoInARowCrosses()) {
        return this.blockFromNoughts();
      }
    }

    //3
    if (this.currentPlayerX(currMove)) {
      if (this.haveForkCrosses()) {
        return this.setForkCrosses();
      }
    } else {
      if (this.haveForkNoughts()) {
        return this.setForkNoughts();
      }
    }

    //2
    if (this.currentPlayerX(currMove)) {
      if (this.haveForkNoughts()) {
        return this.blockForkFromCrosses();
      }
    } else {
      if (this.haveForkCrosses()) {
        return this.blockForkFromNoughts();
      }
    }

    //5
    if (positions[4] === '') {
      return 4;
    }

    //6
    if (this.currentPlayerX(currMove)) {
      if (this.getCorner(this.O) !== -1)
        return this.getCorner(this.O);
    } else {
      if (this.getCorner(this.X) !== -1)
        return this.getCorner(this.X);
    }

    //7
    if (this.getCornerOrNot() !== -1)
      return this.getCornerOrNot();

    //8
    if (this.getSideOrNot() !== -1)
      return this.getSideOrNot();
  }
}
