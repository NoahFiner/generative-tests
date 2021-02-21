let particles = [];
let iters = 0;
const height = 1000;
const width = 1000;

let vectorField = [];

let mouseClicked = false;

const MAX_VELOCITY = 10;

const FIELD_COUNT = 25;

const maxValue = val => {
    return val;
    // if(val < 0) {
    //     return Math.max(val, -MAX_VELOCITY);
    // } else {
    //     return Math.min(val, MAX_VELOCITY);
    // }
};

class Particle {
    constructor(x, y, velX = 0, velY = 0) {
        this.position = { x, y };
        this.prevPosition = { x, y };
        this.velocity = { x: velX, y: velY };
    }

    updatePosition() {
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    updateVectorField() {
        const currVector = vectorField[Math.floor(this.position.y / FIELD_COUNT)][Math.floor(this.position.x / FIELD_COUNT)];
        if(!currVector) return;
        currVector.x += this.velocity.x;
        currVector.y += this.velocity.y;

        currVector.x = maxValue(currVector.x) / 8;
        currVector.y = maxValue(currVector.y) / 8;
    }

    getUpdatedFromVectorField() {
        const currVector = vectorField[Math.floor(this.position.y / FIELD_COUNT)][Math.floor(this.position.x / FIELD_COUNT)];
        if(!currVector) return;
        this.velocity.x += currVector.x;
        this.velocity.y += currVector.y;

        this.velocity.x = maxValue(this.velocity.x);
        this.velocity.y = maxValue(this.velocity.y);
    }

    isOutOfBounds() {
        return this.position.x < 0 || this.position.y < 0 ||
               this.position.x >= width || this.position.y >= height;
    }
}

const diffuseVectorField = () => {
    const newVectorField = vectorField;
    for(let h = 0; h < height / FIELD_COUNT; h++) {
        vectorField[h][0] = {x: 0, y: 0};
        vectorField[h][Math.floor(height / FIELD_COUNT - 1)] = {x: 0, y: 0};
    }

    for(let w = 0; w < width / FIELD_COUNT; w++) {
        vectorField[0][w] = {x: 0, y: 0};
        vectorField[Math.floor(width / FIELD_COUNT - 1)][w] = {x: 0, y: 0};
    }

    for(let h = 1; h < height / FIELD_COUNT - 1; h++) {
        for(let w = 1; w < width / FIELD_COUNT - 1; w++) {
            sumX = vectorField[h][w].x +
                   vectorField[h-1][w].x +
                   vectorField[h+1][w].x +
                   vectorField[h][w-1].x +
                   vectorField[h][w+1].x +
                   vectorField[h+1][w+1].x +
                   vectorField[h+1][w-1].x +
                   vectorField[h-1][w+1].x +
                   vectorField[h-1][w-1].x;
            avgX = sumX / 9;

            sumY = vectorField[h][w].y +
                   vectorField[h-1][w].y +
                   vectorField[h+1][w].y +
                   vectorField[h][w-1].y +
                   vectorField[h][w+1].y +
                   vectorField[h+1][w+1].y +
                   vectorField[h+1][w-1].y +
                   vectorField[h-1][w+1].y +
                   vectorField[h-1][w-1].y;
            avgY = sumY / 9;

            vectorField[h][w] = { x: avgX, y: avgY };
        }
    }
    vectorField = newVectorField;
};

function setup() {
    createCanvas(width, height);
    for(let h = 0; h < height/FIELD_COUNT + 1; h++) {
        vectorField[h] = [];
        for(let w = 0; w < width/FIELD_COUNT + 1; w++) {
            vectorField[h][w] = { x: 0, y: 0 };
        }
    }
    smooth(16);
}

function gradientLine(x1, y1, x2, y2, c1, c2, iters = 3) {
    const colorDifferences = [];
    for(let i = 0; i < c1.levels.length; i++) {
        colorDifferences[i] = c1.levels[i] - c2.levels[i];
    }

    xDiff = x2 - x1;
    yDiff = y2 - y1;
    for(let i = 0; i < iters; i++) {
        strokeWeight(2);
        stroke(color(c2.levels[0] + colorDifferences[0]*(i/iters),
                     c2.levels[1] + colorDifferences[1]*(i/iters),
                     c2.levels[2] + colorDifferences[2]*(i/iters)));

        line(x1 + xDiff*(i/iters), y1 + yDiff*(i/iters),
             x1 + xDiff*((i+1)/iters), y1 + yDiff*((i+1)/iters));
    }
}

function draw() {
    background(10);
    diffuseVectorField();
    for(let i = 0; i < particles.length; i++) {
        strokeWeight(2);
        particle = particles[i];
        particle.updatePosition();
        if(particle.isOutOfBounds()) {
            particles.splice(i, 1);
        } else {
            particle.getUpdatedFromVectorField();
            particle.updateVectorField();
            const whiteColor = Math.min((Math.abs(particles[i].prevPosition.x - particles[i].position.x) + Math.abs(particles[i].prevPosition.y - particles[i].position.y)) * 10, 255);
            gradientLine(particles[i].prevPosition.x, particles[i].prevPosition.y,
                particles[i].position.x, particles[i].position.y,
                color(whiteColor, whiteColor, whiteColor), color(200, 100, 0));
            }
        }

    // for(let h = 0; h < height; h++) {
    //     for(let w = 0; w < width; w++) {
    //         strokeWeight(Math.abs(vectorField[h][w].x) + Math.abs(vectorField[h][w].y));
    //         color('#aaa');
    //         point(w*10, h*10);
    //     }
    // }

    iters += 1;
    if(mouseClicked) {
        for(let i = 0; i < 10; i++) {
            particles.push(new Particle(mouseX, mouseY, Math.random()*10 - 5, Math.random()*10 - 5));
        }
    }

    for(let i = 0; i < 5; i++) {
        particles.push(new Particle(Math.random()*width, height, Math.random()*2 - 1, -Math.random()*5 - 5));
    }

    for(let i = 0; i < 5; i++) {
        particles.push(new Particle(Math.random()*width, 0, Math.random()*2 - 1, Math.random()*5 + 5));
    }
}

function mousePressed() {
    mouseClicked = true;
    // for(let i = 0; i < 10; i++) {
    //     particles.push(new Particle(mouseX, mouseY, Math.random()*5 - 2.5, Math.random()*5 - 2.5));
    // }
}

function mouseReleased() {
    mouseClicked = false;
}