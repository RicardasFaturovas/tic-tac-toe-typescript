import Tile from "./tile";
export default function AIPlayer(data) {
    this.data = data;
    var seed;
    var opponentSeed;
    this.setSeed = function (_seed) {
        seed = _seed;
        if (_seed === Tile.prototype.NOUGHT) {
            opponentSeed = Tile.prototype.CROSS;
        }
        else
            opponentSeed = Tile.prototype.NOUGHT;
    };
    this.getSeed = function () {
        return seed;
    };
    this.move = function () {
        return minimax(2, seed)[1];
    };
    this.hasWinner = function () {
        if (hasWon(seed)) {
            return seed;
        }
        if (hasWon(opponentSeed)) {
            return opponentSeed;
        }
        return false;
    };
    var winningPatterns = (function () {
        var winPat = ["111000000", "000111000", "000000111",
            "100100100", "010010010", "001001001",
            "100010001", "001010100"];
        var r = new Array(winPat.length);
        for (var i = winPat.length; i--;) {
            r[i] = parseInt(winPat[i], 2);
        }
        return r;
    })();
    var hasWon = this.hasWon = function (player) {
        var pattern = 0;
        for (var i = data.length; i--;) {
            if (data[i].equals(player)) {
                pattern |= (1 << i);
            }
        }
        for (var i = winningPatterns.length; i--;) {
            var winningPattern = winningPatterns[i];
            if ((pattern & winningPattern) === winningPattern)
                return true;
        }
        return false;
    };
    var minimax = function (depth, player) {
        var nextMoves = getValidMoves();
        var best;
        var current;
        var bestIndex = -1;
        if (player === seed) {
            best = -1e100;
        }
        else
            best = 1e100;
        if (nextMoves.length === 0 || depth === 0) {
            best = evaluate();
        }
        else {
            for (var i = nextMoves.length; i--;) {
                var m = nextMoves[i];
                data[m].set(player);
                if (player === seed) {
                    current = minimax(depth - 1, opponentSeed)[0];
                    if (current > best) {
                        best = current;
                        bestIndex = m;
                    }
                }
                else {
                    current = minimax(depth - 1, seed)[0];
                    if (current < best) {
                        best = current;
                        bestIndex = m;
                    }
                }
                data[m].set(Tile.prototype.BLANK);
            }
        }
        return [best, bestIndex];
    };
    var getValidMoves = function () {
        var moveList = [];
        if (hasWon(seed) || hasWon(opponentSeed)) {
            return moveList;
        }
        for (var i = data.length; i--;) {
            if (!data[i].hasData()) {
                moveList.push(i);
            }
        }
        return moveList;
    };
    var evaluate = function () {
        var score = 0;
        score += evaluateLine(0, 1, 2);
        score += evaluateLine(3, 4, 5);
        score += evaluateLine(6, 7, 8);
        score += evaluateLine(0, 3, 6);
        score += evaluateLine(1, 4, 7);
        score += evaluateLine(2, 5, 8);
        score += evaluateLine(0, 4, 8);
        score += evaluateLine(2, 4, 6);
        return score;
    };
    var evaluateLine = function (index1, index2, index3) {
        var score = 0;
        if (data[index1].equals(seed)) {
            score = 1;
        }
        else if (data[index1].equals(opponentSeed)) {
            score = -1;
        }
        if (data[index2].equals(seed)) {
            if (score === 1) {
                score = 10;
            }
            else if (score === -1) {
                return 0;
            }
            else
                score = 1;
        }
        else if (data[index2].equals(opponentSeed)) {
            if (score === -1) {
                score = -10;
            }
            else if (score === 1) {
                return 0;
            }
            else
                score = -1;
        }
        if (data[index3].equals(seed)) {
            if (score > 0) {
                score *= 10;
            }
            else if (score < 0) {
                return 0;
            }
            else
                score = 1;
        }
        else if (data[index3].equals(opponentSeed)) {
            if (score < 0) {
                score *= 10;
            }
            else if (score > 0) {
                return 0;
            }
            else
                score = -1;
        }
        return score;
    };
}
//# sourceMappingURL=ai.js.map