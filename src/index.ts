let canvas;
let ctx;

let data;

//import styles from 'style-loader!css-loader! ';

window.onload = main => {
  canvas = document.createElement('canvas');
  canvas.width = canvas.height = 3*120+20;
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);


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
  data[0].flip(data[0].NOUGHT);
};

let tick = () => {
  window.requestAnimationFrame(tick);

  update();
  render();
};

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

class Tile  {
  x: any;
  y: any;
  BLANK;
  NOUGHT;
  CROSS;
  tile = this.BLANK;
  anim = 0;

  constructor(x,y){
    this.x = x;
    this.y = y;

    if(this.tile==null){
      let _c= document.createElement('canvas');
      _c.width = canvas.height = 100;
      let _ctx = _c.getContext("2d");

      _ctx.fillStyle = "skyblue"
      _ctx.lineWidth = 4;
      _ctx.strokeStyle = "white";

      //Blank Tile
      _ctx.fillRect(0,0,100,100);
      this.BLANK = new Image();
      this.BLANK.src = _c.toDataURL();

      //Nought Tile
      _ctx.fillRect(0, 0, 100, 100);
      _ctx.beginPath();
      _ctx.arc(50,50,30,0,2*Math.PI);
      _ctx.stroke();
      this.NOUGHT = new Image();
      this.NOUGHT.src = _c.toDataURL();

      //Cross Tile
      _ctx.fillRect(0,0,100,100);
      _ctx.beginPath();
      _ctx.moveTo(20, 20);
      _ctx.lineTo(80, 80);
      _ctx.moveTo(80, 20);
      _ctx.lineTo(20, 80);
      _ctx.stroke();
      this.CROSS = new Image();
      this.CROSS.src = _c.toDataURL();

      this.tile = this.BLANK;
    }
  };

  flip(next) {
    this.tile = next;
    this.anim = 1;
  }

  update() {
    if(this.anim > 0){
      this.anim -=0.08;
    }
  };

  draw(ctx) {
    if(this.anim<=0){
     ctx.drawImage(this.tile,this.x,this.y);
     return;
    }
    const res = 4;
    const t = this.anim > 0.5 ? this.BLANK : this.tile;
    const p =  -Math.abs(2*this.anim-1)+1;
    for(let i=0; i<100; i+=res){

      let j = this.anim > 0.5 ? 100 - i : i;
      ctx.drawImage(t, i, 0, res, 100,
        this.x + i - p*i+50*p,
        this.y - j*p*0.2,
        res,
        100 + j*p*0.4);
    }
  };
}
