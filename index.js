let cube;
let portal;
let gravity;

class Cube {
  constructor(){
    this.rect = new Rect(320,200,10,10)
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }
 
  update() {
    this.acc.add(gravity)
    this.vel.add(this.acc)
    this.acc = createVector(0,0)
    this.rect.pos.add(this.vel)
  }

  draw() {
    fill(250,0,0)
    this.rect.draw()
  };

}

setup  = () => {
  createCanvas(1300, 900).parent('jsCanvas');
  background(255, 112, 84);
  cube = new Cube();
  portal= new Portal();
  gravity = createVector(0,1);
}

draw = () => {
  background(255, 112, 84);
  cube.update()
  cube.draw()

  portal.draw()
  portal.checkColl(cube)
}

class Rect {
  constructor(x,y,w,h){
    this.pos = createVector(x,y)
    this.size = createVector(w,h)
    this.left = () => this.pos.x
    this.right = () => this.pos.x+this.size.x
    this.top = () => this.pos.y
    this.bottom = () => this.pos.y+this.size.y
  }

  draw(){
    rect(this.pos.x, this.pos.y, this.size.x,this.size.y)
  }
}

class Portal{
  constructor(){
    this.entrance1In = new Rect(300,750,50,50);
    this.entrance1Out = new Rect(300,700,50,50);
    this.entrance2In = new Rect(700,750,50,50);
    this.entrance2Out = new Rect(700,700,50,50);
  }

  draw(){
    fill(0,150,0)
    this.entrance1In.draw();
    this.entrance2In.draw();
    fill(0,0,150)
    this.entrance1Out.draw();
    this.entrance2Out.draw();
  };

  checkColl(cube){
    if(intersectRect(this.entrance1In,cube.rect)){
      console.log(cube.vel.mag())
      cube.rect.pos.x = this.entrance2Out.pos.x+this.entrance2Out.size.x/2;
      cube.rect.pos.y = this.entrance2Out.pos.y;

      let dif = this.entrance2Out.pos.copy().sub(this.entrance2In.pos).normalize()
      cube.vel.y = cube.vel.y*dif.y
    }
    if(intersectRect(this.entrance2In,cube.rect)){
      console.log(cube.vel.mag())
      cube.rect.pos.x = this.entrance1Out.pos.x+this.entrance2Out.size.x/2;
      cube.rect.pos.y = this.entrance1Out.pos.y;
      
      let dif = this.entrance1Out.pos.copy().sub(this.entrance1In.pos).normalize()
      cube.vel.y = cube.vel.y*dif.y
    }
  }

}

intersectRect = (r1, r2) => {
  return !(r2.left() > r1.right() || 
           r2.right() < r1.left() || 
           r2.top() > r1.bottom() ||
           r2.bottom() < r1.top());
}





