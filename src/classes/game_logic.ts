import AIPlayer from './ai'
import Tile from './tile'

export default class Game {
  public data
  public player
  public ai
  public playerMove
  public aiMoved
  public winner
  public animationKey = null
  constructor (public canvas) {
  }

  init = (player?) => {
    this.data = []
    for (let i = 0; i < 9; i++) {
      let x = (i % 3) * 120 + 20
      let y = Math.floor(i / 3) * 120 + 20
      this.data.push(new Tile(x, y))
    }
    this.data.forEach(el => el.init())

    if (player) {
      this.player = player
    } else {
      this.player = Tile.NOUGHT
    }

    this.aiMoved = false

    if (this.player === Tile.NOUGHT) {
      this.playerMove = true
    } else {
      this.playerMove = false
    }

    this.ai = new AIPlayer(this.data)
    this.ai.setSeed(this.player === Tile.NOUGHT ? Tile.CROSS : Tile.NOUGHT)
  }

  start () {
    if (!this.animationKey) {
      this.tick()
    }
  }

  tick = () => {
    this.animationKey = window.requestAnimationFrame(this.tick)
    this.update()
    this.render()
  }

  update = () => {
    let activeAnimation = false

    this.data.forEach(element => {
      element.update()
      activeAnimation = activeAnimation || element.isActive()
    })

    if (!activeAnimation) {
      if (!this.aiMoved && !this.playerMove) {
        let move = this.ai.move()
        if (move === -1) {
          this.winner = true
        } else {
          this.data[move].flip(this.ai.getSeed())
        }
        this.playerMove = true
      }

      if (this.winner && !this.aiMoved) {
  		    if (this.winner === true) {
        alert('The game was a draw!')
      } else if (this.winner === Tile.NOUGHT) {
        alert('Kappas win!')
      } else {
        alert('PogChamps win!')
      }
      }
      this.aiMoved = true
    } else {
      if (this.aiMoved) {
        this.winner = this.ai.hasWinner()
      }
      this.aiMoved = false
    }
  }

  render = () => {
    let ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    for (let i = this.data.length; i--;) {
      this.data[i].draw(ctx)
    }
  }

  reset = (player = this.player) => {
    if (this.animationKey) {
      window.cancelAnimationFrame(this.animationKey)
      this.animationKey = null
      let ctx = this.canvas.getContext('2d')
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.data = null
      this.ai = null
      this.player = null
      this.playerMove = null
      this.aiMoved = null
      this.winner = null
      this.init(player)
      this.tick()
    }
  }

  changePlayer = () => {
    if (this.player === Tile.NOUGHT) {
      this.reset(Tile.CROSS)
    } else {
      this.reset(Tile.NOUGHT)
    }
  }

  mouseDown = (evt) => {
    if (!this.playerMove) {
      return
    }
    if (this.ai.hasWinner() !== false) {
      return
    }

    const el = evt.target
    const positionX = evt.clientX - el.offsetLeft
    const positionY = evt.clientY - el.offsetTop

    if (positionX % 120 >= 20 && positionY % 120 >= 20) {
      let index = Math.floor(positionX / 120)
      index += Math.floor(positionY / 120) * 3

      if (this.data[index].hasData()) {
        return
      }
      this.data[index].flip(this.player)
      this.playerMove = false
    }
  }
}
