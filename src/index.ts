import Tile from "./gameObjects/tile";
import AIPlayer from "./gameObjects/ai";

let canvas;
let ctx;
let data;
let player;
let ai;

let isPlayer;
let aiMoved;
let winner;

window.onload = main => {
  canvas = document.createElement('canvas');
  canvas.width = canvas.height = 3*120+20;
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  canvas.addEventListener("mousedown",mouseDown);

  init();
  tick();
};

let init = () => {
  if(data==null){
    data = [];
    for(let i=0; i<9; i++){
      let x = (i % 3)*120+20;
      let y = Math.floor(i/3)*120+20;
      data.push(new Tile(x,y));
    }
  }
  player = Tile.prototype.NOUGHT;
  isPlayer = player === Tile.prototype.NOUGHT;
  aiMoved = false;

  ai = new AIPlayer(data);
  ai.setSeed(player === Tile.prototype.NOUGHT ? Tile.prototype.CROSS : Tile.prototype.NOUGHT);

  console.log(ai.move());
};

let tick = () => {
  window.requestAnimationFrame(tick);

  update();
  render();
};

let update = () => {
  let activeAnim = false;

  for(let i = data.length; i--;){
    data[i].update();
    activeAnim = activeAnim || data[i].active();
  }
  if(!activeAnim){
    if(!aiMoved && !isPlayer){
      let move = ai.move();
      if(move === -1){
        winner = true;
      } else data[move].flip(ai.getSeed());
      isPlayer = true;
    }

    if (winner && !aiMoved) {
				if (winner === true) {
					 console.log("The game was a draw!");
				} else if (winner === Tile.prototype.NOUGHT) {
					 console.log("The Kappa player won!");
				} else {
					 console.log("The PogChamp AI won!");
				}
			}
    aiMoved = true;
  } else {
			if (aiMoved){
         winner = ai.hasWinner();
      }
			aiMoved = false;
	}
}

let render = () => {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  for(let i= data.length; i--;){
    data[i].draw(ctx);
  }
}

let mouseDown = (evt) => {
  if(!isPlayer) return;
  const el = evt.target;

  const positionX = evt.clientX - el.offsetLeft;
  const positionY = evt.clientY - el.offsetTop;

  if(positionX % 120 >= 20 && positionY % 120 >= 20){
    let index = Math.floor(positionX/120);
    index += Math.floor(positionY/120)*3;

    if(data[index].hasData()){
      return;
    }
    data[index].flip(player);
    isPlayer = false;
  }
}
