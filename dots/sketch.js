const width = 500;
const height = 500;
const amt = 100;
let iters = 0;

let noise;

function periodicFunction(p, seed = 0) {
    const radius = 1.3;
    const scale = 0.01;
    return 1*noise.noise4D(radius*Math.cos(2*Math.PI*p) + seed, radius*Math.sin(2*Math.PI*p) + seed, scale*x, scale*y);
}

function offset(x, y) {
    return 0.00001*Math.pow(x, 2);
}

function setup() {
    createCanvas(width, height);
    smooth(16);
    noise = openSimplexNoise(12345);
}

function makeLine(x, y, size) {
    strokeWeight(size/2);
    line(x, y, x + size, y + size);

}

function draw() {
    background(240);
    stroke(0);
    for(let i = 0; i < amt; i++) {
        for(let j = 0; j < amt; j++) {
            margin = 50;
            x = map(i, 0, amt-1, margin, width-margin);
            y = map(j, 0, amt-1, margin, height-margin);

            dx = 20*periodicFunction(iters-offset(x, y), 0);
            dy = 20*periodicFunction(iters-offset(x, y), 123);

            x += dx;
            y += dy;

            // x -= x - mouseX;
            // y -= Math.pow(y - mouseY, 3)/200000;

            stroke(1);
            point(x, y);
        }
    }
    iters += 0.01;
}

function mouseClicked() {

}