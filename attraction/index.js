var particles;
var attractors;
var G = 25;
let tick = 0;
let maxVel = 0;

setup = () => {
  createCanvas(1800, 950)
  particles = []
  attractors = []
  for (let i = 0; i < 460; i++) {
    //particles.push(new Particle(width / 2 + random(random(-i), random(i)), random(200,500)));
    particles.push(new Particle(random(width), random(height)));
  }

  //mid 
  //attractors.push(new Attractor(width/2, height/2));

  /* for (let i = 0; i < random(1,9); i++) {
    attractors.push(new Attractor(random(width), random(height)));
  } */
  let n = 2
  let steps = height / n

  for (let i = 1; i <= random(1, 3); i++) {
    attractors.push(new Attractor(width / 2, random(height)));
  }

  //blue
  //background(12, 65, 178)
  
  // grey
  background(105, 105, 105)
}

draw = () => {
  document.querySelector('.frameRate').innerHTML = frameRate();
  for (let i = 0; i < particles.length; i++) {
    particles[i].attracted(attractors)
    particles[i].update()
    if (tick > 1) {
      particles[i].draw()
    }
  }
  //attractors.map(a => a.draw())
  tick += 1
}

function mousePressed() {
  console.log(mouseX, mouseY)
  attractors.push(new Attractor(mouseX, mouseY))
}

class Attractor {
  constructor(x, y) {
    //this.pos = createVector(random(width), random(height))
    if (x && y) {
      this.pos = createVector(x, y)
    } else {
      this.pos = createVector(random(width), random(height))
    }
    this.size = 1;
    this.mass = 1;
  }

  draw() {
    stroke(0)
    strokeWeight(4)
    //ellipse(this.pos.x, this.pos.y, this.size)
    ellipse(this.pos.x, this.pos.y, this.size)
  };
}

class Particle {
  constructor(w, h) {
    this.pos = createVector(w, h)
    this.prev = createVector();
    this.vel = createVector();
    //this.vel = p5.Vector.random2D().mult(10)
    this.acc = createVector();
    this.color = createVector(random(255), random(255), random(255))

    this.size = 1;
    this.mass = 1;
    //this.size = random(5, 10);

  }

  update() {
    this.prev = this.pos.copy()
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0);
    maxVel = this.vel.mag() > maxVel? this.vel.mag(): maxVel
  }

  attracted(attractors) {
    let sumForce = createVector()
    for (let i = 0; i < attractors.length; i++) {
      let force = p5.Vector.sub(attractors[i].pos, this.pos)
      let dsq = force.magSq()
      dsq = constrain(dsq, 1, 1200)
      let strength = 27 / dsq
      force.setMag(strength)
      /*       if (dsq < 50) {
              force.mult(-1)
            } */
      sumForce.add(force)
    }
    this.acc.add(sumForce)
  }

  draw() {    
    let alpha = map(this.vel.mag(),0,maxVel,150,255) 
    
    stroke(alpha,0,0,10)
    // stroke(this.color.x,this.color.y,this.color.z, 5)
    strokeWeight(1)
    line(this.pos.x, this.pos.y, this.prev.x, this.prev.y)
  };
}