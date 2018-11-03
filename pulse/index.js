let drops;
let rectangles;
let rectangleSize = 5;
let pulses;

setup = () => {
  createCanvas(1300, 900).parent('jsCanvas');
  rectangles = [];
  pulses = [];
  console.log(floor(width / rectangleSize) + ' ' + floor(height / rectangleSize))
  for (let x = 0; x < floor(width / rectangleSize); x++) {
    for (let y = 0; y < floor(height / rectangleSize); y++) {
      rectangles.push(new Rect(rectangleSize * x, rectangleSize * y))
    }
  }
}

draw = () => {
  background(0, 0, 0);
  document.querySelector('.frameRate').innerHTML = frameRate();

  noStroke()
  fill(120, 0, 0)
  //rectangles.map(r => r.draw());

  pulses.map(p => p.handle())
  pulses = pulses.filter(p => !p.done)
}

function mousePressed() {
  let x = floor(mouseX / rectangleSize)
  let y = floor(mouseY / rectangleSize)
  pulses.push(new Pulse(x * rectangleSize, y * rectangleSize,'u'))
  pulses.push(new Pulse(x * rectangleSize, y * rectangleSize,'d'))
  pulses.push(new Pulse(x * rectangleSize, y * rectangleSize,'l'))
  pulses.push(new Pulse(x * rectangleSize, y * rectangleSize,'r'))
}

class Pulse {
  constructor(x, y,dir) {
    this.pos = createVector(x, y)
    this.tick = 0;
    this.maxTicks = 50
    if(dir){
      this.direction = dir
    }else{
      this.direction = random(['u', 'd', 'l', 'r']) // pick random direction
    }
    this.rectangles = []
    switch (this.direction) {
      case 'u':
        for (let i = 1; i < this.maxTicks; i++) {
          let curr = []
          for (let j = -i; j <= i; j++) {
            curr.push(new Rect(this.pos.x + j * rectangleSize, this.pos.y - i * rectangleSize))
          }
          this.rectangles.push(curr)
        }
        break;
      case 'd':
        for (let i = 1; i < this.maxTicks; i++) {
          let curr = []
          for (let j = -i+1; j < i; j++) {
            curr.push(new Rect(this.pos.x + (j * rectangleSize), this.pos.y + i * rectangleSize))
          }
          this.rectangles.push(curr)
        }
        break;
      case 'l':
        for (let i = 1; i < this.maxTicks; i++) {
          let curr = []
          for (let j = -i; j < i; j++) {
            curr.push(new Rect(this.pos.x - (i * rectangleSize), this.pos.y - j * rectangleSize))
          }
          this.rectangles.push(curr)
        }
        break;
        case 'r':
        for (let i = 1; i < this.maxTicks; i++) {
          let curr = []
          for (let j = -i; j < i; j++) {
            curr.push(new Rect(this.pos.x + (i * rectangleSize), this.pos.y - j * rectangleSize))
          }
          this.rectangles.push(curr)
        }
        break;
      default:
        break;
    }
  }

  get done() {
    return false//this.tick >= this.maxTicks;
  }

  handle() {
    this.tick += 0.1;
    this.update()
    this.draw();
  }

  update() {

  }

  draw() {
    noStroke()

    for (let i = 0; i < this.rectangles.length; i++) {
      for (let j = 0; j < this.rectangles[i].length; j++) {
        let normalized = map(i * this.tick, 0, this.rectangles.length, 0, 1)
        let alpha = map(sin(normalized), 0, 1, 0, 100)
        fill(255, 0, 0, alpha)
        this.rectangles[i][j].draw()
      }
    }
  }
}


class Rect {
  constructor(x, y) {
    this.pos = createVector(x, y);
  }

  draw() {
    rect(this.pos.x, this.pos.y, rectangleSize, rectangleSize)
  }
}




