let canvas;
let ctx;
let data;
let player;
//import styles from 'style-loader!css-loader! ';

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
};

let tick = () => {
  window.requestAnimationFrame(tick);

  update();
  render();
};


function Tile (x,y) {
	let tile = Tile.prototype.BLANK;
	let anim = 0;


    this.x = x;
    this.y = y;

    if(tile==null){
      let _c= document.createElement('canvas');
      _c.width = _c.height = 100;
      let _ctx = _c.getContext("2d");

      _ctx.fillStyle = "skyblue"
      _ctx.lineWidth = 4;
      _ctx.strokeStyle = "white";

      //Blank Tile
      _ctx.fillRect(0,0,100,100);
      Tile.prototype.BLANK = new Image();
      Tile.prototype.BLANK.src = _c.toDataURL();

      //Kappa Tile
      Tile.prototype.NOUGHT = new Image(20,20);
      Tile.prototype.NOUGHT.src = 'http://i.picresize.com/images/2017/04/12/TqxYX.png';
      Tile.prototype.NOUGHT.onload = function() {
        _ctx.drawImage(Tile.prototype.NOUGHT, 20, 20);
      };


      //Cross Tile
      Tile.prototype.CROSS = new Image();
      Tile.prototype.CROSS.src = 'http://i.picresize.com/images/2017/04/12/g8RX.png';
      Tile.prototype.CROSS.onload = function() {
        _ctx.drawImage(Tile.prototype.CROSS, 20, 20);
      };

      tile = Tile.prototype.BLANK;
    }


  this.hasData = () => {
    return tile!==Tile.prototype.BLANK;
  }

  this.flip = (next) => {
    tile = next;
    anim = 1;
  }

  this.update = () => {
    if(anim > 0){
      anim -=0.08;
    }
  };

  this.draw = (ctx) => {
    if(anim<=0){
     ctx.drawImage(tile,x,y);
     return;
    }
    const res = 4;
    let t;

    if(anim > 0.5){
      t = this.BLANK;
    } else t = tile

    const p =  -Math.abs(2*anim-1)+1;
    for(let i=0; i<100; i+=res){

      let j = anim > 0.5 ? 100 - i : i;
      ctx.drawImage(t, i, 0, res, 100,
        x + i - p*i+50*p,
        y - j*p*0.2,
        res,
        100 + j*p*0.4);
    }
  };
}

let update = () => {
  for(let i = data.length; i--;){
    data[i].update();
  }
}

let render = () => {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  for(let i= data.length; i--;){
    data[i].draw(ctx);
  }
}

let mouseDown = (evt) => {
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

    if(player === Tile.prototype.NOUGHT){
      player = Tile.prototype.CROSS;
    } else player = Tile.prototype.NOUGHT
    console.log(index);
  }
}
