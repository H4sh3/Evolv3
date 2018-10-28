let cube;
let rootNode;
let spheres;
let collisions;
let graph;
let tick;

setup = () => {
  createCanvas(1300, 900).parent('jsCanvas');
  background(255, 112, 84);
  rootNode = new Quadtree(0, createVector(0, 0), createVector(width, height))
  spheres = new Map()
  collisions = []
  frameRate(50)
  for (let i = 0; i < 1000; i++) {
    let id = randomId()
    spheres.set(id, new Sphere(id))
  }
  initTree()
  graph = []
  tick = 0;
}

randomId = () => {
  return floor(random() * 101337733100)
}

initTree = () => {
  rootNode = new Quadtree(0, createVector(0, 0), createVector(width, height))
  spheres.forEach(s => rootNode.insert(s))
}

draw = () => {
  background(255, 153, 51)
  document.querySelector('.frameRate').innerHTML = frameRate();

  initTree()
  rootNode.update()
  handleCollisions()

  spheres.forEach(c => c.update())
  spheres.forEach(c => c.draw())

  drawGraph()
  if(tick%10===0){
    let id = randomId()
    spheres.set(id, new Sphere(id))
  }
}

drawGraph = () => {
  tick += 0.5
  //graph.push({ x: tick, y: spheres.size })
  graph.push({ x: tick, y: frameRate() })

  for (let i = 1; i < graph.length - 1; i++) {
    rect(graph[i].x, graph[i].y, 2, 2)
    rect(graph[i + 1].x, graph[i + 1].y, 2, 2)
    line(graph[i].x, graph[i].y, graph[i].x + 1, graph[i].y + 1)
  }
  if(graph.length>300){
    graph = []
    tick = 0
  }
}

handleCollisions = () => {
  for (let i = 0; i < collisions.length; i++) {
    let s1 = spheres.get(collisions[i].a)
    let s2 = spheres.get(collisions[i].b)
    if (s1 && s2) {
      let area1 = pow((s1.size / 2), 2) * PI
      let area2 = pow((s2.size / 2), 2) * PI
      let newSize = getNewSize(area1, area2)
      if (area1 > area2) {
        s1.size = newSize
        spheres.delete(s2.id)
      } else {
        s2.size = newSize
        spheres.delete(s1.id)
      }
    }
  }
  collisions = []
}

getNewSize = (area1, area2) => {
  let sum = area1 + area2
  let newRadius = sqrt(sum / PI)
  return newRadius * 2
}

class Quadtree {
  constructor(depth, pos, size) {
    this.depth = depth
    this.rect = new Rectangle1(pos, size);
    this.divided = false;
    this.nodes = [];
    this.capazity = 5;
  }


  childs() {
    return this.nodes.length
  }

  insert(element) {
    if (!this.divided && this.nodes.length < this.capazity) { // insert
      this.nodes.push(element)
    } else {
      if (!this.divided) {
        this.subdivide()
      }
      if (this.tl.contains(element)) {
        this.tl.insert(element)
      } else if (this.tr.contains(element)) {
        this.tr.insert(element)
      } else if (this.bl.contains(element)) {
        this.bl.insert(element)
      } else if (this.br.contains(element)) {
        this.br.insert(element)
      }
      for (let i = 0; i < this.nodes.length; i++) {
        if (this.tl.contains(this.nodes[i])) {
          this.tl.insert(this.nodes[i])
        } else if (this.tr.contains(this.nodes[i])) {
          this.tr.insert(this.nodes[i])
        } else if (this.bl.contains(this.nodes[i])) {
          this.bl.insert(this.nodes[i])
        } else if (this.br.contains(this.nodes[i])) {
          this.br.insert(this.nodes[i])
        }
      }
      this.nodes = []
    }
  }

  subdivide() {
    let newSize = this.rect.size.copy().div(2)
    let newPos = this.rect.pos.copy()

    this.tl = new Quadtree(this.depth + 1, newPos, newSize)

    newPos = this.rect.pos.copy()
    newPos.x = newPos.x + newSize.x
    this.tr = new Quadtree(this.depth + 1, newPos, newSize)

    newPos = this.rect.pos.copy()
    newPos.y = newPos.y + newSize.y
    this.bl = new Quadtree(this.depth + 1, newPos, newSize)

    newPos = this.rect.pos.copy()
    newPos.x = newPos.x + newSize.x
    newPos.y = newPos.y + newSize.y
    this.br = new Quadtree(this.depth + 1, newPos, newSize)
    this.divided = true
  }

  update() {
    this.draw()
    if (this.divided) {
      this.tl.update();
      this.tr.update();
      this.bl.update();
      this.br.update();
    } else {
      for (let i = 0; i < this.nodes.length; i++) {
        this.nodes[i].update()
      }
    }
    this.draw()
    if (this.nodes.length >= 2) {
      for (let i = 0; i < this.nodes.length - 1; i++) {
        for (let y = i + 1; y < this.nodes.length; y++) {
          let sphere1 = this.nodes[i]
          let sphere2 = this.nodes[y]
          if (sphere1.pos.dist(sphere2.pos) < 50) {
            line(sphere1.pos.x, sphere1.pos.y, sphere2.pos.x, sphere2.pos.y)
          }
          if (sphere1.pos.dist(sphere2.pos) < (sphere1.size / 2 + sphere2.size / 2)) {
            fill(0, 100, 0)
            ellipse(sphere1.pos.x, sphere1.pos.y, 20, 20)
            collisions.push({ a: sphere1.id, b: sphere2.id })
          }
        }
      }
    }

  }

  contains(sphere) {
    return sphereInRect(sphere, this.rect)
  }

  draw() {
    noFill()
    this.rect.draw()
  };
}

class Rectangle1 {
  constructor(pos, size) {
    this.pos = pos;
    this.size = size;
    this.left = () => this.pos.x
    this.right = () => this.pos.x + this.size.x
    this.top = () => this.pos.y
    this.bottom = () => this.pos.y + this.size.y
  }

  draw() {
    rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
  }
}

class Sphere {
  constructor(id) {
    this.id = id
    this.pos = createVector(random(width), random(height))
    this.size = random(5, 10);
    this.left = () => this.pos.x
    this.right = () => this.pos.x + this.size.x
    this.top = () => this.pos.y
    this.bottom = () => this.pos.y + this.size.y

    this.vel = createVector(0, 0);
    const speed = 1.5;
    this.acc = createVector(random(-speed, speed), random(-speed, speed));
  }

  update() {
    this.vel.add(this.acc)
    this.acc = createVector(0, 0)
    this.pos.add(this.vel)
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
  }

  draw() {
    fill(0,154,255)
    ellipse(this.pos.x, this.pos.y, this.size)
    fill(0)
    text(floor(this.size),this.pos.x, this.pos.y)
  };
}

function sphereInRect(sphere, rect) {
  return !(sphere.pos.x > rect.right() ||
    sphere.pos.x < rect.left() ||
    sphere.pos.y > rect.bottom() ||
    sphere.pos.y < rect.top());
}


