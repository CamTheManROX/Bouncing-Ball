"use strict";

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Imports P5. Instantiates the sketch at the bottom of this file.
const p5 = require("p5");

//Starting out sketch and
//injecting p5, as the param p, into our sketch function.

const sketch = (p) => {
  let ball;
  const G = 0.3;
  let previousPos;
  let ballGrabbed = false;
  let missed = true;

  p.setup = () => {
    // Create the canvas
    p.createCanvas(p.windowWidth, p.windowHeight);
    ball = new Ball(p.width / 2, p.height / 2, 50);
  };

  p.draw = () => {
    p.background(52);
    previousPos = p.createVector(ball.pos.x, ball.pos.y);
    ball.show();
    ball.update();

    if (
      (p.mouseIsPressed &&
        p.dist(ball.pos.x, ball.pos.y, p.mouseX, p.mouseY) <= ball.r &&
        !missed) ||
      ballGrabbed
    ) {
      ball.setPos(p.mouseX, p.mouseY);
      ball.setVel(0, 0);
      ballGrabbed = true;
    }
  };

  p.mouseReleased = () => {
    missed = false;
    if (ballGrabbed) {
      let throwVect = p.createVector(
        p.mouseX - previousPos.x,
        p.mouseY - previousPos.y
      );
      throwVect = throwVect.limit(40);
      ball.setVel(throwVect.x, throwVect.y);
      ballGrabbed = false;
    }
  };

  p.mousePressed = () => {
    if (p.dist(ball.pos.x, ball.pos.y, p.mouseX, p.mouseY) <= ball.r) {
      missed = false;
    } else {
      missed = true;
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  class Ball {
    constructor(x, y, r) {
      this.pos = p.createVector(x, y);
      this.vel = p.createVector();
      this.acc = p.createVector(0, G);

      this.friction = 0.997;

      this.r = r;
    }

    show() {
      p.noStroke();
      p.fill(200);
      p.circle(this.pos.x, this.pos.y, this.r * 2);
    }

    setPos(x, y) {
      this.pos.set(x, y);
    }

    setVel(xVel, yVel) {
      this.vel.set(xVel, yVel);
    }

    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);

      if (this.pos.y + this.r >= p.height && this.vel.y > 0.01) {
        this.vel.y = -this.vel.y;
        this.pos.y = p.height - this.r;
      }

      if (this.pos.x + this.r >= p.width && this.vel.x > 0.01) {
        this.vel.x = -this.vel.x;
        this.pos.x = p.width - this.r;
      }

      if (this.pos.x - this.r <= 0 && this.vel.x < 0.01) {
        this.vel.x = -this.vel.x;
        this.pos.x = this.r;
      }

      this.vel.y *= this.friction;
      this.vel.x *= this.friction;
    }
  }
};

//Instantiates P5 sketch to keep it out of the global scope.
const app = new p5(sketch);
