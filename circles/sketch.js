const width = 500;
const height = 500;
const amt = 50;
let iters = 0;

function periodicFunction(p) {
    return map(Math.sin(2*Math.PI*p), -1, 1, 2, 5);
}

function offset(x, y) {
    return 0.001*Math.pow(dist(x, y, mouseX, mouseY), 1.5);
}

function setup() {
    createCanvas(width, height);
    smooth(16);
}

function draw() {
    background(245);
    stroke(0);
    for(let i = 0; i < amt; i++) {
        for(let j = 0; j < amt; j++) {
            x = map(i, 0, amt-1, 0, width);
            y = map(j, 0, amt-1, 0, height);

            size = periodicFunction(iters-offset(x, y));
            strokeWeight(size);

            point(x, y);
        }
    }
    iters += 0.04;
}

function mouseClicked() {

}