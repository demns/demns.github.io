using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApplication1 {
    public static class TicTacToe {
        private const char X = 'X';
        private const char O = 'O';

        private static readonly int[,] TwoInARow =
        {
            {0, 1, 2}, {0, 2, 1}, {1, 2, 0}, {3, 4, 5}, {3, 5, 4}, {4, 5, 3}, {6, 7, 8}, {6, 8, 7}, {7, 8, 6},
            {0, 3, 6}, {0, 6, 3}, {3, 6, 0}, {1, 4, 7}, {1, 7, 4}, {4, 7, 1}, {2, 5, 8}, {2, 8, 5}, {5, 8, 2},
            {0, 4, 8}, {4, 8, 0}, {0, 8, 4}, {2, 4, 6}, {2, 6, 4}, {4, 6, 2}
        };

        private static readonly int[,] Fork =
        {
            {2, 6, 1}, {0, 8, 5},
            {2, 3, 0}, {3, 8, 6}, {0, 7, 6}, {2, 7, 8}, {5, 6, 8}, {0, 5, 2}, {1, 6, 0}, {1, 8, 2},
            {1, 3, 6}, {3, 7, 0}, {1, 5, 2}, {5, 7, 8}
        };

        public static bool HaveTwoInARowCrosses(char[] arr) {
            return IsTwoInARow(arr, X, O);
        }

        public static bool HaveTwoInARowNoughts(char[] arr) {
            return IsTwoInARow(arr, O, X);
        }

        private static bool IsTwoInARow(char[] arr, char ch, char oppositeCh) {
            for (int i = 0; i < TwoInARow.GetLength(0); i++) {
                if (arr[TwoInARow[i, 0]] == ch &&
                    arr[TwoInARow[i, 1]] == ch &&
                    arr[TwoInARow[i, 2]] != oppositeCh)
                    return true;
            }

            return false;
        }


        public static bool HaveForkForCrosses(char[] arr) {
            return IsFork(arr, X, O);
        }

        public static bool HaveForkForNoughts(char[] arr) {
            return IsFork(arr, O, X);
        }

        private static bool IsFork(char[] arr, char ch, char oppositeCh) {
            for (int i = 0; i < Fork.GetLength(0); i++) {
                if (arr[Fork[i, 0]] == ch &&
                    arr[Fork[i, 1]] == ch &&
                    arr[Fork[i, 2]] != oppositeCh)
                    return true;
            }

            return false;
        }


        public static void Main() {
            var arr = new[] { ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ' };


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


            for (int currMove = 0; currMove < 9; currMove++) {
                Console.WriteLine(arr);

                //1
                if (CurrentPlayerX(currMove)) {
                    if (HaveTwoInARowCrosses(arr)) {
                        WinForCrosses(arr);
                        break;
                    }
                }
                else {
                    if (HaveTwoInARowNoughts(arr)) {
                        WinForNoughts(arr);
                        break;
                    }
                }


                //2
                if (CurrentPlayerX(currMove)) {
                    if (HaveTwoInARowNoughts(arr)) {
                        BlockFromCrosses(arr);
                        continue;
                    }
                }
                else {
                    if (HaveTwoInARowCrosses(arr)) {
                        BlockFromNoughts(arr);
                        continue;
                    }
                }

                //3
                //if (CurrentPlayerX(currMove)) {
                //    if (HaveForkForCrosses(arr)) {
                //        ForkFromCrosses(arr);
                //        continue;
                //    }
                //}
                //else {
                //    if (HaveForkForNoughts(arr)) {
                //        ForkFromNoughts(arr);
                //        continue;
                //    }
                //}

                //5
                if (arr[4] == ' ') {
                    arr[4] = CurrentPlayer(currMove, X, O);
                    continue;
                }
                //6
                if (CurrentPlayerX(currMove)) {
                    if (SetCorner(arr, O, currMove, X)) {
                        continue;
                    }
                }
                else {
                    if (SetCorner(arr, X, currMove, O)) {
                        continue;
                    }
                }

                //7
                if (SetCornerIfNot(arr, 0, currMove, X, O)) continue;
                if (SetCornerIfNot(arr, 2, currMove, X, O)) continue;
                if (SetCornerIfNot(arr, 6, currMove, X, O)) continue;
                if (SetCornerIfNot(arr, 8, currMove, X, O)) continue;

                //8
                if (SetSideIfNot(arr, 1, currMove, X, O)) continue;
                if (SetSideIfNot(arr, 3, currMove, X, O)) continue;
                if (SetSideIfNot(arr, 5, currMove, X, O)) continue;
                if (SetSideIfNot(arr, 7, currMove, X, O)) continue;


            }
            Console.WriteLine(arr);
        }

        private static void ForkFromCrosses(char[] arr) {
            for (int i = 0; i < Fork.GetLength(0); i++) {
                if (arr[Fork[i, 0]] == X &&
                    arr[Fork[i, 1]] == X &&
                    arr[Fork[i, 2]] != O)
                    arr[Fork[i, 2]] = X;
            }
        }

        private static void ForkFromNoughts(char[] arr) {
            for (int i = 0; i < Fork.GetLength(0); i++) {
                if (arr[Fork[i, 0]] == O &&
                    arr[Fork[i, 1]] == O &&
                    arr[Fork[i, 2]] != X)
                    arr[Fork[i, 2]] = O;
            }
        }

        private static void BlockFromNoughts(char[] arr) {
            for (int i = 0; i < TwoInARow.GetLength(0); i++) {
                if (arr[TwoInARow[i, 0]] == X &&
                    arr[TwoInARow[i, 1]] == X &&
                    arr[TwoInARow[i, 2]] != O)
                    arr[TwoInARow[i, 2]] = O;
            }
        }

        private static void BlockFromCrosses(char[] arr) {
            for (int i = 0; i < TwoInARow.GetLength(0); i++) {
                if (arr[TwoInARow[i, 0]] == O &&
                    arr[TwoInARow[i, 1]] == O &&
                    arr[TwoInARow[i, 2]] != X)
                    arr[TwoInARow[i, 2]] = X;
            }
        }

        private static void WinForNoughts(char[] arr) {
            for (int i = 0; i < TwoInARow.GetLength(0); i++) {
                if (arr[TwoInARow[i, 0]] == O &&
                    arr[TwoInARow[i, 1]] == O &&
                    arr[TwoInARow[i, 2]] != X)
                    arr[TwoInARow[i, 2]] = O;
            }
        }

        private static void WinForCrosses(char[] arr) {
            for (int i = 0; i < TwoInARow.GetLength(0); i++) {
                if (arr[TwoInARow[i, 0]] == X &&
                    arr[TwoInARow[i, 1]] == X &&
                    arr[TwoInARow[i, 2]] != O)
                    arr[TwoInARow[i, 2]] = X;
            }
        }

        private static bool SetCornerIfNot(char[] arr, int number, int currMove, char x, char o) {
            if (arr[number] == ' ') {
                arr[number] = CurrentPlayer(currMove, x, o);
                return true;
            }
            return false;
        }

        private static bool SetSideIfNot(char[] arr, int number, int currMove, char x, char o) {
            if (arr[number] == ' ') {
                arr[number] = CurrentPlayer(currMove, x, o);
                return true;
            }
            return false;
        }

        private static bool SetCorner(char[] arr, char o, int currMove, char x) {
            if (arr[0] == o && arr[8] == ' ') {
                arr[8] = CurrentPlayer(currMove, x, o);
                return true;
            }
            if (arr[2] == o && arr[6] == ' ') {
                arr[6] = CurrentPlayer(currMove, x, o);
                return true;
            }
            if (arr[6] == o && arr[2] == ' ') {
                arr[2] = CurrentPlayer(currMove, x, o);
                return true;
            }
            if (arr[8] == o && arr[0] == ' ') {
                arr[0] = CurrentPlayer(currMove, x, o);
                return true;
            }
            return false;
        }

        private static bool CurrentPlayerX(int currMove) {
            return currMove % 2 == 0;
        }

        private static char CurrentPlayer(int currMove, char x, char o) {
            return currMove % 2 == 0 ? x : o;
        }
    }
}
