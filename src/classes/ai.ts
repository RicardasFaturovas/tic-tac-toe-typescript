import Tile from './tile'

export default class AIPlayer {
  static winningPatterns = [ 0b111000000, 0b000111000, 0b000000111,
    0b100100100, 0b010010010, 0b001001001,
    0b100010001, 0b001010100]

  public data
  public aiSeed
  public playerSeed

  constructor (data) {
    this.data = data
  }

  setSeed (value) {
    this.aiSeed = value
    if (value === Tile.NOUGHT) {
      this.playerSeed = Tile.CROSS
    } else {
      this.playerSeed = Tile.NOUGHT
    }
  }

  getSeed () {
    return this.aiSeed
  }

  /**
   * calculates the most optimal move based on depth
   * @return {number} the best index of the minimax function
   */
  move () {
    const optimalDepth = 2
    return this.minimax(optimalDepth,this.aiSeed)[1]
  }

  hasWinner () {
	   if (this.hasWon(this.aiSeed)) {
		     return this.aiSeed
		 } if (this.hasWon(this.playerSeed)) {
		     return this.playerSeed
		 }
    return false
	 }

  hasWon (player) {
    let pattern = 0

    this.data.forEach((element,index) => {
      if (element.equals(player)) {
        pattern |= (1 << index) // construct a bit pattern based on the board layout
      }
    })

    // checks if the pattern matches winning patterns
    for (let i = AIPlayer.winningPatterns.length; i--;) {
      let winningPattern = AIPlayer.winningPatterns[i]
      if (pattern === winningPattern) {
        return true
      }
    }

    return false
  }

  /**
   * unction uses a recurssive minimax algorithm which goes through
   * a tree of all the possible situations of the game
   * @param  {number} depth  limits the accuracy of the AI,
   *                         for Tic tac toe a general depth of 2 is enough to make the AI accurate
   * @param  {tile} player current player: compuer or AI
   * @return {array}        1st element is the best best score and 2nd is the best index
   */
  minimax (depth, player) {
    let nextMoves = this.getValidMoves()
    let bestScore
    let currentScore
    let bestIndex = -1

    // assign best score to a large number if the current player is the AI
    // or to a small number if it is the human player
    if (player === this.aiSeed) {
      bestScore = -1e100
    } else {
      bestScore = 1e100
    }

    // evaluates the score on all 8 possible lines if no moves are left
    if (nextMoves.length === 0 || depth === 0) {
      bestScore = this.evaluate()
    } else {
      for (let i = nextMoves.length; i--;) {
        let nextMove = nextMoves[i]
        this.data[nextMove].setNextTile(player)

        if (player === this.aiSeed) {
          currentScore = this.minimax(depth - 1, this.playerSeed)[0] // go up the tree by 1 level
          if (currentScore > bestScore) {
            bestScore = currentScore
            bestIndex = nextMove
          }
        } else {
          currentScore = this.minimax(depth - 1, this.aiSeed)[0] // go up the tree by 1 level
          if (currentScore < bestScore) {
            bestScore = currentScore
            bestIndex = nextMove
          }
        }
        this.data[nextMove].setNextTile(Tile.BLANK)
      }
    }
    return [bestScore, bestIndex]
  }

  getValidMoves () {
    let moveList = []
    if (this.hasWon(this.aiSeed) || this.hasWon(this.playerSeed)) {
      return moveList
    }
    for (let i = this.data.length; i--;) {
      if (!this.data[i].hasData()) {
        moveList.push(i)
      }
    }
    return moveList
  }

  /**
   * heuristic board evaluation function
   * evaluates each line seperately and adds the scores
   * @return {number} total score of all the evaluated lines
   */
  evaluate () {
    let score = 0
    score += this.evaluateLine(0,1,2) // top line
    score += this.evaluateLine(3,4,5) // middle line
    score += this.evaluateLine(6,7,8) // bottom line
    score += this.evaluateLine(0,3,6) // left vertical line
    score += this.evaluateLine(1,4,7) // middle vertical line
    score += this.evaluateLine(2,5,8) // right vertical line
    score += this.evaluateLine(0,4,8) // diagonal line \
    score += this.evaluateLine(2,4,6) // diagonal line /
    return score
  }

  /**
   * single line evaluation function
   * calculates score based on theses rules:
   * 10 for EACH 3-in-a-line for computer.
   * +10 for EACH two-in-a-line (with a empty cell) for computer.
   * +1 for EACH one-in-a-line (with two empty cells) for computer.
   * exactly same but negative scores for opponent
   * @param  {number} index1 first evaluated tile
   * @param  {number} index2 second evaluated tile
   * @param  {number} index3 third evaluated tile
   * @return {number}        final score after the evaluation is complete
   */
  evaluateLine (index1,index2,index3) {
    let score = 0

    if (this.data[index1].equals(this.aiSeed)) {
      score = 1
    } else if (this.data[index1].equals(this.playerSeed)) {
      score = -1
    }

    if (this.data[index2].equals(this.aiSeed)) {
      if (score === 1) {
        score = 10
      } else if (score === -1) {
        return 0
      } else {
        score = 1
      }
    } else if (this.data[index2].equals(this.playerSeed)) {
      if (score === -1) {
        score = -10
      } else if (score === 1) {
        return 0
      } else {
        score = -1
      }
    }

    if (this.data[index3].equals(this.aiSeed)) {
      if (score > 0) {
        score *= 10
      } else if (score < 0) {
        return 0
      } else {
        score = 1
      }
    } else if (this.data[index3].equals(this.playerSeed)) {
      if (score < 0) {
        score *= 10
      } else if (score > 0) {
        return 0
      } else {
        score = -1
      }
    }

    return score
  }
}
