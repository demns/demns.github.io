using System;
using ConsoleApplication1;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTestProjectTTT {
    [TestClass]
    public class TttTests {
        [TestMethod]
        public void HaveTwoCrossesInARowTrue() {
            IsTwoInARowCrossesTrue(ArrayFromString("XXXYYYXXX"));
            IsTwoInARowCrossesTrue(ArrayFromString("X XOOOOOO"));
        }

        private static void IsTwoInARowCrossesTrue(char[] arr) {
            Assert.IsTrue(TicTacToe.HaveTwoInARowCrosses(arr));
        }

        [TestMethod]
        public void HaveTwoCrossesInARowFalse() {
            IsTwoInARowCrossesFalse(ArrayFromString("XOXOOOXOX"));
            IsTwoInARowCrossesFalse(ArrayFromString("XOXOOOOOO"));
        }

        private static void IsTwoInARowCrossesFalse(char[] arr) {
            Assert.IsTrue(!TicTacToe.HaveTwoInARowCrosses(arr));
        }

        [TestMethod]
        public void HaveTwoNoughtsInARowTrue() {
            IsTwoInARowNoughtsTrue(ArrayFromString("XOXOOOOOO"));
            IsTwoInARowNoughtsTrue(ArrayFromString("O O      "));
        }

        private static void IsTwoInARowNoughtsTrue(char[] arr) {
            Assert.IsTrue(TicTacToe.HaveTwoInARowNoughts(arr));
        }

        [TestMethod]
        public void HaveTwoNoughtsInARowReturnFalse() {
            IsTwoInARowNoughtsFalse(ArrayFromString("OXO      "));
            IsTwoInARowNoughtsFalse(ArrayFromString("O      O "));
        }

        [TestMethod]
        public void HaveForkForCrossesTrue() {
            IsForkForCrossesTrue(ArrayFromString("X       X"));
            IsForkForCrossesTrue(ArrayFromString("  XX     "));
        }

        private static void IsForkForCrossesTrue(char[] arr) {
            Assert.IsTrue(TicTacToe.HaveForkForCrosses(arr));
        }

        [TestMethod]
        public void HaveForkForCrossesFalse() {
            IsForkForCrossesFalse(ArrayFromString(" OX   X  "));
            IsForkForCrossesFalse(ArrayFromString(" XO  X   "));
        }

        private static void IsForkForCrossesFalse(char[] arr) {
            Assert.IsTrue(!TicTacToe.HaveForkForCrosses(arr));
        }

        [Ignore]
        [TestMethod]
        public void HaveForkForNoughtsTrue() {

        }

        [Ignore]
        [TestMethod]
        public void HaveForkForNoughtsFalse() {

        }

        private static void IsTwoInARowNoughtsFalse(char[] arr) {
            Assert.IsTrue(!TicTacToe.HaveTwoInARowNoughts(arr));
        }


        private static char[] ArrayFromString(string str) {
            var toReturn = new char[9];
            for (int i = 0; i < str.Length; i++) {
                toReturn[i] = str[i];
            }
            return toReturn;
        }
    }
}
