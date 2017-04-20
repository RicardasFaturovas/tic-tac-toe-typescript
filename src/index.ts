import AIPlayer from './classes/ai'
import Tile from './classes/tile'

let canvas
let button
let buttonText
let ctx
let data
let player
let ai

let playerMove
let aiMoved
let winner

window.onload = () => {
  canvas = document.createElement('canvas')
  canvas.width = canvas.height = 3 * 120 + 20
  ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)

  canvas.addEventListener('mousedown', mouseDown)

  button = document.createElement('button')
  button.addEventListener('mousedown', reset)
  buttonText = document.createTextNode('RESET')
  button.appendChild(buttonText)
  document.body.appendChild(button)

  init()
  tick()
}

function init () {
  if (data === null) {
    data = []
    for (let i = 0; i < 9; i++) {
      let x = (i % 3) * 120 + 20
      let y = Math.floor(i / 3) * 120 + 20
      data.push(new Tile(x, y))
    }
    data.forEach(el => el.init())
  }

  player = Tile.NOUGHT
  aiMoved = false

  if (player === Tile.NOUGHT) {
    playerMove = true
  } else {
    playerMove = false
  }

  ai = new AIPlayer(data)
  ai.setSeed(player === Tile.NOUGHT ? Tile.CROSS : Tile.NOUGHT)
};

function reset () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  data = null
  init()
  tick()
}

function tick () {
  window.requestAnimationFrame(tick)
  update()
  render()
};

function update () {
  let activeAnimation = false

  data.forEach(element => {
    element.update()
    activeAnimation = activeAnimation || element.isActive()
  })

  if (!activeAnimation) {
    if (!aiMoved && !playerMove) {
      let move = ai.move()
      if (move === -1) {
        winner = true
      } else {
        data[move].flip(ai.getSeed())
      }
      playerMove = true
    }

    if (winner && !aiMoved) {
		    if (winner === true) {
      alert('The game was a draw!')
    } else if (winner === Tile.NOUGHT) {
      alert('The Kappa player won!')
    } else {
      alert('The PogChamp AI won!')
    }
    }
    aiMoved = true
  } else {
    if (aiMoved) {
      winner = ai.hasWinner()
    }
    aiMoved = false
  }
}

function render () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = data.length; i--;) {
    data[i].draw(ctx)
  }
}

function mouseDown (evt) {
  if (!playerMove) {
    return
  }
  if (ai.hasWinner() !== false) {
    return
  }

  const el = evt.target
  const positionX = evt.clientX - el.offsetLeft
  const positionY = evt.clientY - el.offsetTop

  if (positionX % 120 >= 20 && positionY % 120 >= 20) {
    let index = Math.floor(positionX / 120)
    index += Math.floor(positionY / 120) * 3

    if (data[index].hasData()) {
      return
    }
    data[index].flip(player)
    playerMove = false
  }
}
