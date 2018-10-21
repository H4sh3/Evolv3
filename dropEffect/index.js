let drops;

setup = () => {
  createCanvas(1300, 900).parent('jsCanvas');
  drops = [];
  let numberOfCircles = 5
  for (let i = 1; i < numberOfCircles; i++) {
    addNewDrop()
  }
}

draw = () => {
  background(0, 0, 0);
  document.querySelector('.frameRate').innerHTML = frameRate();
  handleDrops();
}

handleDrops = () => {
  drops.map(e => e.draw());

  drops = drops.filter(e => !e.done);

  if (random() > 0.1337) {
    addNewDrop();
  }
}

addNewDrop = () => {
  drops.push(new Drop());
}

class Drop {
  constructor() {
    this.ellipse = new Ellipse()
    this.tick = 0;
    this.maxTicks = random(80, 120)
    this.step = random(0.5, 1.5)
    this.done = false;
  }

  draw() {
    stroke(255)
    noFill()
    this.tick += this.step
    this.ellipse.size = this.tick;
    this.ellipse.draw()
    this.done = this.tick > this.maxTicks
  }
}


class Ellipse {
  constructor() {
    this.pos = createVector(random(width),random(height));
    this.size = 1;
  }

  draw() {
    ellipse(this.pos.x, this.pos.y, this.size, this.size)
  }
}




