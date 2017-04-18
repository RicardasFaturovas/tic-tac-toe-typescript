import Tile from "./tile";

export default class AIPlayer {
  public data;
  public seed;
  public opponentSeed;
  static winningPatterns = (function(){
    let winPat = ["111000000", "000111000", "000000111",
                  "100100100", "010010010", "001001001",
                  "100010001", "001010100"]

    let r = new Array(winPat.length);
    for(let i = winPat.length; i--;){
      r[i] = parseInt(winPat[i], 2)
    }
    return r;
  })();

  constructor(data) {
    this.data = data;
  }

  setSeed(_seed)  {
    this.seed = _seed
    if(_seed === Tile.NOUGHT){
      this.opponentSeed = Tile.CROSS;
    } else this.opponentSeed = Tile.NOUGHT
  }

  getSeed() {
    return this.seed;
  }

  move() {
    return this.minimax(2,this.seed)[1];
  }

  hasWinner() {
		if (this.hasWon(this.seed)) {
			return this.seed;
		} if (this.hasWon(this.opponentSeed)) {
			return this.opponentSeed;
		}
		return false;
	}

  hasWon(player) {
    let pattern = 0;

    for(let i = this.data.length; i--;){
      if(this.data[i].equals(player)){
        pattern |= (1 << i);
      }
    }

    for(let i = AIPlayer.winningPatterns.length; i--;){
      let winningPattern = AIPlayer.winningPatterns[i];
      if((pattern & winningPattern) === winningPattern) return true;
    }
    return false;
  }

  minimax(depth, player) {
    let nextMoves = this.getValidMoves();
    let best;
    let current;
    let bestIndex = -1;

    if(player === this.seed) {
      best = -1e100;
    } else best = 1e100;

    if(nextMoves.length === 0 || depth === 0){
      best = this.evaluate();
    } else {
      for(let i = nextMoves.length; i--;){
        let m = nextMoves[i];
        this.data[m].set(player);

        if(player === this.seed){
          current = this.minimax(depth-1, this.opponentSeed)[0];
          if(current > best){
            best = current;
            bestIndex = m;
          }
        } else {
          current = this.minimax(depth-1, this.seed)[0];
          if(current < best){
            best = current;
            bestIndex = m;
          }
        }
        this.data[m].set(Tile.BLANK)
      }
    }
    return [best, bestIndex];
  }

  getValidMoves() {
    let moveList = [];
    if(this.hasWon(this.seed) || this.hasWon(this.opponentSeed)){
      return moveList;
    }
    for(let i = this.data.length; i--;){
      if(!this.data[i].hasData()){
        moveList.push(i);
      }
    }
    return moveList;
  }

  evaluate() {
    let score = 0;
    score += this.evaluateLine(0,1,2); //top line
    score += this.evaluateLine(3,4,5); // middle line
    score += this.evaluateLine(6,7,8); // bottom line
    score += this.evaluateLine(0,3,6); // left vertical line
    score += this.evaluateLine(1,4,7); // middle vertical line
    score += this.evaluateLine(2,5,8); // right vertical line
    score += this.evaluateLine(0,4,8); // diagonal line \
    score += this.evaluateLine(2,4,6); // diagonal line /
    return score;
  }

  evaluateLine(index1,index2,index3) {
    let score = 0;

    if(this.data[index1].equals(this.seed)) {
      score = 1;
    } else if(this.data[index1].equals(this.opponentSeed)) {
      score = -1;
    }

    if(this.data[index2].equals(this.seed)) {
      if(score === 1){
        score = 10;
      } else if(score === -1){
        return 0;
      } else score = 1;
    } else if(this.data[index2].equals(this.opponentSeed)) {
      if(score === -1){
        score = -10;
      } else if(score === 1){
        return 0;
      } else score = -1;
    }

    if(this.data[index3].equals(this.seed)) {
      if(score > 0){
        score *=10;
      } else if (score < 0){
        return 0;
      } else score = 1;
    } else if(this.data[index3].equals(this.opponentSeed)) {
      if(score < 0){
        score *=10;
      } else if (score > 0){
        return 0;
      } else score = -1;
    }

    return score;
  }
}
