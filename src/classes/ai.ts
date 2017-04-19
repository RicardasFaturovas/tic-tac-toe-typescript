import Tile from "./tile";

export default class AIPlayer {
  public data;
  public aiSeed;
  public playerSeed;
  static winningPatterns = [0b111000000, 0b000111000, 0b000000111,
                0b100100100, 0b010010010, 0b001001001,
                0b100010001, 0b001010100]

  constructor(data) {
    this.data = data;
  }

  setSeed(value) {
    this.aiSeed = value
    if(value === Tile.NOUGHT) {
      this.playerSeed = Tile.CROSS;
    } else this.playerSeed = Tile.NOUGHT
  }

  getSeed() {
    return this.aiSeed;
  }

  move() {
    const optimalDepth = 2;
    // returns the best index of the minimax function
    return this.minimax(optimalDepth,this.aiSeed)[1];
  }

  hasWinner() {
		if (this.hasWon(this.aiSeed)) {
			return this.aiSeed;
		} if (this.hasWon(this.playerSeed)) {
			return this.playerSeed;
		}
		return false;
	}

  hasWon(player) {
    let pattern = 0;

    this.data.forEach((element,index) => {
      if(element.equals(player)) {
        pattern |= (1 << index); // construct a bit pattern based on the board layout
      }
    })

    // checks if the pattern matches winning patterns
    for(let i = AIPlayer.winningPatterns.length; i--;){
      let winningPattern = AIPlayer.winningPatterns[i];
      if(pattern === winningPattern) return true;
    }

    return false;
  }

  // function uses a recurssive minimax algorithm which goes through
  // a tree of all the possible situations of the game.
  // * each node will have a calculated score
  // * depth limits the accuracy of the AI
  // * for Tic tac toe a general depth of 2 is enough to make the AI accurate
  minimax(depth, player) {
    let nextMoves = this.getValidMoves();
    let bestScore;
    let current;
    let bestIndex = -1;

    // assign best score to a large number if the current player is the AI
    // or to a small number if it is the human player
    if(player === this.aiSeed) {
      bestScore = -1e100;
    } else bestScore = 1e100;

    // evaluates the score on all 8 possible lines if no moves are left
    if(nextMoves.length === 0 || depth === 0) {
      bestScore = this.evaluate();
    } else {
      for(let i = nextMoves.length; i--;){
        let nextMove = nextMoves[i];
        this.data[nextMove].setNextTile(player);

        if(player === this.aiSeed) {
          current = this.minimax(depth-1, this.playerSeed)[0]; // go up the tree by 1 level
          if(current > bestScore){
            bestScore = current;
            bestIndex = nextMove;
          }
        } else {
          current = this.minimax(depth-1, this.aiSeed)[0]; // go up the tree by 1 level
          if(current < bestScore){
            bestScore = current;
            bestIndex = nextMove;
          }
        }
        this.data[nextMove].setNextTile(Tile.BLANK)
      }
    }
    return [bestScore, bestIndex];
  }

  getValidMoves() {
    let moveList = [];
    if(this.hasWon(this.aiSeed) || this.hasWon(this.playerSeed)) {
      return moveList;
    }
    for(let i = this.data.length; i--;) {
      if(!this.data[i].hasData()) {
        moveList.push(i);
      }
    }
    return moveList;
  }

  // heuristic board evaluation function
  // evaluates each line seperately and adds the scores
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

  // single line evaluation function
  // calculates score based on theses rules:
  // * +100 for EACH 3-in-a-line for computer.
  // * +10 for EACH two-in-a-line (with a empty cell) for computer.
  // * +1 for EACH one-in-a-line (with two empty cells) for computer.
  // * exactly same but negative scores for opponent
  evaluateLine(index1,index2,index3) {
    let score = 0;

    if(this.data[index1].equals(this.aiSeed)) {
      score = 1;
    } else if(this.data[index1].equals(this.playerSeed)) {
      score = -1;
    }

    if(this.data[index2].equals(this.aiSeed)) {
      if(score === 1) {
        score = 10;
      } else if(score === -1) {
        return 0;
      } else score = 1;
    } else if(this.data[index2].equals(this.playerSeed)) {
      if(score === -1) {
        score = -10;
      } else if(score === 1) {
        return 0;
      } else score = -1;
    }

    if(this.data[index3].equals(this.aiSeed)) {
      if(score > 0) {
        score *=10;
      } else if (score < 0) {
        return 0;
      } else score = 1;
    } else if(this.data[index3].equals(this.playerSeed)) {
      if(score < 0) {
        score *=10;
      } else if (score > 0) {
        return 0;
      } else score = -1;
    }

    return score;
  }
}
