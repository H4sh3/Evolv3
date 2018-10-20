let cube;
let portal;
let gravity;
let maxDepth;

let rootNode;

setup = () => {
  createCanvas(1300, 900).parent('jsCanvas');
  background(255, 112, 84);
  cube = new Cube();
  portal = new Portal();
  gravity = createVector(0, 1);

  maxDepth = 3
  console.log(pow(4,maxDepth))
  rootNode = new Node(0, createVector(0, 0), createVector(width, height))
}

draw = () => {
  background(255, 112, 84);
  cube.update()
  cube.draw()

  portal.draw()
  portal.checkColl(cube)

  rootNode.draw()
}

class Node {
  constructor(depth, pos, size) {
    this.depth = depth
    this.children = [];
    this.rect = new Rect(pos, size);
    if (depth < maxDepth) {
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

  draw() {
    fill(10 + 30 * this.depth, 0, 0)
    this.rect.draw()
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].draw()
    }
  };
}

class Rect {
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

class Cube {
  constructor() {
    this.rect = new Rect(createVector(320, 200), createVector(10, 10))
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }

  update() {
    this.acc.add(gravity)
    this.vel.add(this.acc)
    this.acc = createVector(0, 0)
    this.rect.pos.add(this.vel)
  }

  draw() {
    this.rect.draw()
  };
}


class Portal {
  constructor() {
    this.entrance1In = new Rect(createVector(300, 750), createVector(50, 50));
    this.entrance1Out = new Rect(createVector(300, 700), createVector(50, 50));
    this.entrance2In = new Rect(createVector(700, 750), createVector(50, 50));
    this.entrance2Out = new Rect(createVector(700, 700), createVector(50, 50));
  }

  draw() {
    fill(0, 150, 0)
    this.entrance1In.draw();
    this.entrance2In.draw();
    fill(0, 0, 150)
    this.entrance1Out.draw();
    this.entrance2Out.draw();
  };

  checkColl(cube) {
    if (intersectRect(this.entrance1In, cube.rect)) {
      cube.rect.pos.x = this.entrance2Out.pos.x + this.entrance2Out.size.x / 2;
      cube.rect.pos.y = this.entrance2Out.pos.y;

      let dif = this.entrance2Out.pos.copy().sub(this.entrance2In.pos).normalize()
      cube.vel.y = cube.vel.y * dif.y
    }
    if (intersectRect(this.entrance2In, cube.rect)) {
      cube.rect.pos.x = this.entrance1Out.pos.x + this.entrance2Out.size.x / 2;
      cube.rect.pos.y = this.entrance1Out.pos.y;

      let dif = this.entrance1Out.pos.copy().sub(this.entrance1In.pos).normalize()
      cube.vel.y = cube.vel.y * dif.y
    }
  }
}

function intersectRect(r1, r2) {
  return !(r2.left() > r1.right() ||
    r2.right() < r1.left() ||
    r2.top() > r1.bottom() ||
    r2.bottom() < r1.top());
}





