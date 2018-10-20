let cube;
let portal;
let gravity;
let maxDepth;
let maxSpeed;
let rootNode;
let reinsert;
let spheres;
let collisions;
let graph;
let tick;

setup = () => {
  createCanvas(1300, 900).parent('jsCanvas');
  background(255, 112, 84);
  gravity = createVector(0, 0);
  maxDepth = 4
  rootNode = new Node(0, createVector(0, 0), createVector(width, height))
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
  rootNode = new Node(0, createVector(0, 0), createVector(width, height))
  spheres.forEach(s => rootNode.insert(s))
}

draw = () => {
  background(255, 112, 84);
  document.querySelector('.frameRate').innerHTML = frameRate();

  initTree()
  rootNode.update()
  handleCollisions()

  spheres.forEach(c => c.update())
  spheres.forEach(c => c.draw())

  drawGraph()
}

drawGraph = () => {
  tick += 0.5
  graph.push({ x: tick, y: spheres.size })

  for (let i = 1; i < graph.length - 1; i++) {
    rect(graph[i].x, graph[i].y, 2, 2)
    rect(graph[i + 1].x, graph[i + 1].y, 2, 2)
    line(graph[i].x, graph[i].y, graph[i].x + 1, graph[i].y + 1)
  }
}

handleCollisions = () => {
  for (let i = 0; i < collisions.length; i++) {
    let s1 = spheres.get(collisions[i].a)
    let s2 = spheres.get(collisions[i].b)
    if (s1 && s2) {
      let r1 = s1.size / 2
      let r2 = s2.size / 2
      let area1 = pow(r1, 2) * PI
      let area2 = pow(r2, 2) * PI
      let sum = area1 + area2
      let newRadius = sqrt(sum / PI)
      let newSize = newRadius * 2
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

class Node {
  constructor(depth, pos, size) {
    this.depth = depth
    this.children = [];
    this.rect = new Rectangle1(pos, size);
    if (depth !== maxDepth) {
      for (let i = 0; i < 4; i++) {
        let newSize = this.rect.size.copy().div(2)
        let newPos = this.rect.pos.copy()
        switch (i) {
          case 0:
            this.children.push(new Node(depth + 1, newPos, newSize))
            break;
          case 1:
            newPos.x = newPos.x + newSize.x
            this.children.push(new Node(depth + 1, newPos, newSize))
            break;
          case 2:
            newPos.y = newPos.y + newSize.y
            this.children.push(new Node(depth + 1, newPos, newSize))
            break;
          case 3:
            newPos.x = newPos.x + newSize.x
            newPos.y = newPos.y + newSize.y
            this.children.push(new Node(depth + 1, newPos, newSize))
            break;
          default:
            break;
        }
      }
    }

  }

  childs() {
    return this.children.length
  }

  insert(element) {
    if (this.depth == maxDepth) {
      this.children.push(element)
    } else {
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i].contains(element)) {
          this.children[i].insert(element)
        }
      }
    }
  }

  update() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].update()
    }
    if (this.depth == maxDepth) {
      this.draw()
      if (this.children.length >= 2) {
        for (let i = 0; i < this.children.length - 1; i++) {
          for (let y = i + 1; y < this.children.length; y++) {
            let sphere1 = this.children[i]
            let sphere2 = this.children[y]
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
  }

  contains(sphere) {
    return sphereInRect(sphere, this.rect)
  }

  draw() {
    fill(0, 0, 80 * this.children.length, 50)
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
    const speed = 0.5;
    this.acc = createVector(random(-speed, speed), random(-speed, speed));
  }

  update() {
    this.acc.add(gravity)
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
    ellipse(this.pos.x, this.pos.y, this.size)
  };
}

function sphereInRect(sphere, rect) {
  return !(sphere.pos.x > rect.right() ||
    sphere.pos.x < rect.left() ||
    sphere.pos.y > rect.bottom() ||
    sphere.pos.y < rect.top());
}


