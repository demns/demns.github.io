/**
 * An AI for Tic-Tac-Toe that implements the perfect strategy outlined
 * by Newell and Simon in 1972, commonly found on Wikipedia.
 *
 * The strategy is a hierarchy of rules, executed in order:
 * 1. Win: If you have two in a row, play the third to win.
 * 2. Block: If the opponent has two in a row, play the third to block them.
 * 3. Fork: Create an opportunity where you have two ways to win.
 * 4. Block Fork: Block an opponent's fork.
 * 5. Center: Play the center.
 * 6. Opposite Corner: If the opponent is in a corner, play the opposite corner.
 * 7. Empty Corner: Play an empty corner.
 * 8. Empty Side: Play an empty side.
 */
export const AI = {
  X: 'X',
  O: 'O',

  // --- Core Data & Helpers ---

  winningLines: [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ],

  /**
   * Finds a move that completes a line for a given player.
   * @param {string[]} positions - The current board state.
   * @param {string} player - The player to check for ('X' or 'O').
   * @returns {number|null} The index of the winning move, or null.
   */
  _findWinningMove: function(positions, player) {
    for (const line of this.winningLines) {
      const [a, b, c] = line;
      if (positions[a] === player && positions[b] === player && positions[c] === '') return c;
      if (positions[a] === player && positions[c] === player && positions[b] === '') return b;
      if (positions[b] === player && positions[c] === player && positions[a] === '') return a;
    }
    return null;
  },

  /**
   * Counts how many "two-in-a-row" threats a player has.
   * @param {string[]} board - The current board state.
   * @param {string} player - The player to check for ('X' or 'O').
   * @returns {number} The number of threats.
   */
  _countThreats: function(board, player) {
    let threats = 0;
    for (const line of this.winningLines) {
      const lineValues = [board[line[0]], board[line[1]], board[line[2]]];
      const playerCount = lineValues.filter(v => v === player).length;
      const emptyCount = lineValues.filter(v => v === '').length;
      if (playerCount === 2 && emptyCount === 1) {
        threats++;
      }
    }
    return threats;
  },

  /**
   * Finds a move that creates a fork (two or more threats).
   * @param {string[]} positions - The current board state.
   * @param {string} player - The player to create the fork for.
   * @returns {number|null} The index of the forking move, or null.
   */
  _findForkMove: function(positions, player) {
    const emptySquares = positions.map((p, i) => p === '' ? i : null).filter(i => i !== null);
    for (const square of emptySquares) {
      const tempPositions = [...positions];
      tempPositions[square] = player;
      if (this._countThreats(tempPositions, player) >= 2) {
        return square;
      }
    }
    return null;
  },

  // --- AI Strategy Rules (in order of priority) ---

  // Rule 1: Win
  _rule1_Win: (positions, player) => AI._findWinningMove(positions, player),

  // Rule 2: Block
  _rule2_Block: (positions, opponent) => AI._findWinningMove(positions, opponent),

  // Rule 3: Fork
  _rule3_Fork: (positions, player) => AI._findForkMove(positions, player),

  // Rule 4: Block Opponent's Fork
  _rule4_BlockFork: function(positions, player, opponent) {
    const opponentForkMove = this._findForkMove(positions, opponent);
    if (opponentForkMove === null) return null;

    // The primary strategy to block a fork is to create a two-in-a-row threat
    // to force the opponent into defending. This is more effective than just
    // occupying the fork square.
    const emptySquares = positions.map((p, i) => p === '' ? i : null).filter(i => i !== null);
    for (const move of emptySquares) {
      const tempPositions = [...positions];
      tempPositions[move] = player;

      // Check if this move creates a threat for us
      const ourThreats = this._countThreats(tempPositions, player);
      if (ourThreats > 0) {
        // Now, check if the opponent can still create a fork after they are forced to block our threat.
        const opponentBlockMove = this._findWinningMove(tempPositions, player);
        if (opponentBlockMove !== null) {
          tempPositions[opponentBlockMove] = opponent; // Simulate opponent blocking
          // If the opponent can no longer fork, this is a safe and effective blocking move.
          if (this._findForkMove(tempPositions, opponent) === null) {
            return move;
          }
        }
      }
    }

    // If no forcing move is found, fall back to playing in the opponent's fork square.
    return opponentForkMove;
  },

  // Rule 5: Center
  _rule5_Center: (positions) => (positions[4] === '' ? 4 : null),

  // Rule 6: Opposite Corner
  _rule6_OppositeCorner: function(positions, opponent) {
    const corners = [0, 2, 6, 8];
    const oppositeCorners = {0: 8, 2: 6, 6: 2, 8: 0};
    for (const corner of corners) {
      if (positions[corner] === opponent && positions[oppositeCorners[corner]] === '') {
        return oppositeCorners[corner];
      }
    }
    return null;
  },

  // Rule 7: Empty Corner
  _rule7_EmptyCorner: function(positions) {
    const corners = [0, 2, 6, 8];
    for (const corner of corners) {
      if (positions[corner] === '') {
        return corner;
      }
    }
    return null;
  },

  // Rule 8: Empty Side
  _rule8_EmptySide: function(positions) {
    const sides = [1, 3, 5, 7];
    for (const side of sides) {
      if (positions[side] === '') {
        return side;
      }
    }
    return null;
  },

  // --- Main Public Method ---

  calculateComputerMove: function(positions, computerSymbol) {
    const player = computerSymbol;
    const opponent = (player === this.X) ? this.O : this.X;

    // Opening move: prefer a corner for more strategic options.
    const isBoardEmpty = positions.every(p => p === '');
    if (isBoardEmpty) {
      return 0;
    }

    // Execute strategy in order of priority
    return this._rule1_Win(positions, player) ??
           this._rule2_Block(positions, opponent) ??
           this._rule3_Fork(positions, player) ??
           this._rule4_BlockFork(positions, player, opponent) ??
           this._rule5_Center(positions) ??
           this._rule6_OppositeCorner(positions, opponent) ??
           this._rule7_EmptyCorner(positions) ??
           this._rule8_EmptySide(positions) ??
           -1; // Fallback, should not be reached
  },

  isFinished: function(positions) {
    return this.isFinishedFor(positions, this.X) || this.isFinishedFor(positions, this.O);
  },

  isFinishedFor: function(positions, player) {
    for (const combo of this.winningLines) {
      const [a, b, c] = combo;
      if (positions[a] === player && positions[b] === player && positions[c] === player) {
        return combo;
      }
    }
    return false;
  }
};

