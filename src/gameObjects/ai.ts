import Tile from "./tile";
export default function AIPlayer(data) {
  this.data = data;
  let seed;
  let opponentSeed;

  this.setSeed = (_seed) => {
    seed = _seed
    if(_seed === Tile.prototype.NOUGHT){
      opponentSeed = Tile.prototype.CROSS;
    } else opponentSeed = Tile.prototype.NOUGHT
  }

  this.getSeed = () => {
    return seed;
  }

  this.move = () => {
    return minimax(2,seed)[1];
  }

  this.hasWinner = function() {
		if (hasWon(seed)) {
			return seed;
		} if (hasWon(opponentSeed)) {
			return opponentSeed;
		}
		return false;
	}

  let winningPatterns = (function(){
    let winPat = ["111000000", "000111000", "000000111",
                  "100100100", "010010010", "001001001",
                  "100010001", "001010100"]

    let r = new Array(winPat.length);
    for(let i = winPat.length; i--;){
      r[i] = parseInt(winPat[i], 2)
    }
    return r;
  })();

  let hasWon = this.hasWon = (player) => {
    let pattern = 0;

    for(let i = data.length; i--;){
      if(data[i].equals(player)){
        pattern |= (1 << i);
      }
    }

    for(let i = winningPatterns.length; i--;){
      let winningPattern = winningPatterns[i];
      if((pattern & winningPattern) === winningPattern) return true;
    }
    return false;
  }

  let minimax = (depth, player) => {
    let nextMoves = getValidMoves();
    let best;
    let current;
    let bestIndex = -1;

    if(player === seed) {
      best = -1e100;
    } else best = 1e100;

    if(nextMoves.length === 0 || depth === 0){
      best = evaluate();
    } else {
      for(let i = nextMoves.length; i--;){
        let m = nextMoves[i];
        data[m].set(player);

        if(player === seed){
          current = minimax(depth-1, opponentSeed)[0];
          if(current > best){
            best = current;
            bestIndex = m;
          }
        } else {
          current = minimax(depth-1, seed)[0];
          if(current < best){
            best = current;
            bestIndex = m;
          }
        }
        data[m].set(Tile.prototype.BLANK)
      }
    }
    return [best, bestIndex];
  }

  let getValidMoves = () => {
    let moveList = [];
    if(hasWon(seed) || hasWon(opponentSeed)){
      return moveList;
    }
    for(let i = data.length; i--;){
      if(!data[i].hasData()){
        moveList.push(i);
      }
    }
    return moveList;
  }

  let evaluate = () => {
    let score = 0;
    score += evaluateLine(0,1,2); //top line
    score += evaluateLine(3,4,5); // middle line
    score += evaluateLine(6,7,8); // bottom line
    score += evaluateLine(0,3,6); // left vertical line
    score += evaluateLine(1,4,7); // middle vertical line
    score += evaluateLine(2,5,8); // right vertical line
    score += evaluateLine(0,4,8); // diagonal line \
    score += evaluateLine(2,4,6); // diagonal line /
    return score;
  }

  let evaluateLine = (index1,index2,index3) => {
    let score = 0;

    if(data[index1].equals(seed)) {
      score = 1;
    } else if(data[index1].equals(opponentSeed)) {
      score = -1;
    }

    if(data[index2].equals(seed)) {
      if(score === 1){
        score = 10;
      } else if(score === -1){
        return 0;
      } else score = 1;
    } else if(data[index2].equals(opponentSeed)) {
      if(score === -1){
        score = -10;
      } else if(score === 1){
        return 0;
      } else score = -1;
    }

    if(data[index3].equals(seed)) {
      if(score > 0){
        score *=10;
      } else if (score < 0){
        return 0;
      } else score = 1;
    } else if(data[index3].equals(opponentSeed)) {
      if(score < 0){
        score *=10;
      } else if (score > 0){
        return 0;
      } else score = -1;
    }

    return score;
  }

}
