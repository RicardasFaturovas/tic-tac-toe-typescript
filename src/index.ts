import AIPlayer from './classes/ai'
import Tile from './classes/tile'
import Game from './classes/game_logic'

let game

window.onload = () => {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 3 * 120 + 20
  const ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)

  const resetButton = document.createElement('button')
  resetButton.addEventListener('mousedown', reset)
  const resetButtonText = document.createTextNode('RESET')
  resetButton.appendChild(resetButtonText)
  document.body.appendChild(resetButton)

  const changePlayerButton = document.createElement('button')
  changePlayerButton.addEventListener('mousedown', changePlayer)
  const changePlayerButtonText = document.createTextNode('CHANGE PLAYER')
  changePlayerButton.appendChild(changePlayerButtonText)
  document.body.appendChild(changePlayerButton)

  canvas.addEventListener('mousedown', mouseDown)

  game = new Game(canvas)
  game.init()
  game.start()

}
function reset () {
  game.reset()
}

function mouseDown (evt) {
  game.mouseDown(evt)
}

function changePlayer () {
  game.changePlayer()
}
