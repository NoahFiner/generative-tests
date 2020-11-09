let start;
let polygons = [];
let allPolygons = [];
let iterations = 0;
const MAX_ITERATIONS = 10;

let centers = [];

class Point {
    constructor(x, y, triangle) {
        this.x = x;
        this.y = y;
        this.rand = Math.random();
        if(triangle) this.triangle = triangle;
    }

    move() {
        this.x += 2*(Math.random() - 0.5);
        this.y += 2*(Math.random() - 0.5);
    }

    rotate(angle) {
        let ca = cos(angle);
        let sa = sin(angle);
        let rotx = ca*this.x - sa*this.y;
        let roty = sa*this.x + ca*this.y;
        return new Point(rotx, roty);
    }
}

class Polygon {
    constructor(points) {
        this.p = points;
        // grayscale
        // this.color = 240 - ~~(Math.random() * 50;

        // dope colors
        this.color = color(~~(Math.random()*200) + 25, ~~(Math.random()*200) + 25, ~~(Math.random()*200) + 25);
    }

    pointInPolygon(randomness) {
        let x = 0;
        let y = 0;

        let weights = [];
        for (let i = 0; i < this.p.length; i++) {
            weights.push(Math.random());
        }
        let randWeightSum = weights.reduce((sum, w) => sum + w, 0);
        for (let i = 0; i < this.p.length; i++) {
            weights[i] /= randWeightSum;
        }

        this.p.forEach((p, i) => {
            x += (1/this.p.length*(1-randomness) + weights[i]*randomness)*p.x;
            y += (1/this.p.length*(1-randomness) + weights[i]*randomness)*p.y;
        });

        
        let center_point = new Point(x, y);

        centers.push(center_point);

        return center_point;
        // let a, b, c;
        // do {
        //     a = Math.random();
        //     b = Math.random();
        // } while (a + b >= 1);

        // a = 1/3 + randomness*(a-1/3);
        // b = 1/3 + randomness*(b-1/3);

        // c = 1 - a - b;

        // let center_point = new Point (a*this.p[0].x+b*this.p[1].x+c*this.p[2].x, a*this.p[0].y+b*this.p[1].y+c*this.p[2].y, this);

        // centers.push(center_point);

        // return center_point;
    }

    draw() {
        fill(this.color);
        stroke(0, 0);
        beginShape();
        this.p.forEach(p => {
            vertex(p.x, p.y);
        });
        endShape(CLOSE);
    }
}

function mousePressed() {
    subdivide();
}

function subdivide() {
    iterations++;
    if(iterations > MAX_ITERATIONS) return;
    let subPolygons = [];
    polygons.forEach(poly => {
        if(Math.random() > 0) {
            let crackCenter = poly.pointInPolygon(1);
            for (let i = 0; i < poly.p.length - 1; i++) {
                subPolygons.push(new Polygon([poly.p[i], poly.p[i + 1], crackCenter]));
            }
            subPolygons.push(new Polygon([poly.p[poly.p.length - 1], poly.p[0], crackCenter]));
            subPolygons.forEach(subPoly => allPolygons.push(subPoly));
        } else {
            subPolygons.push(poly);
        }
    });
    polygons = subPolygons;
}

function create() {
    start = new Polygon([
        new Point(400, 300),
        new Point(500, 0),
        new Point(400, -350),
        new Point(-400, -200),
        new Point(-500, 0),
        new Point(-400, 400)]);
    polygons.push(start);
    allPolygons.push(start);
}

function setup() {
    createCanvas(1000, 1000);
    smooth(16);
    create();
}

function draw() {
    background(15);
    translate(width/2, height/2 - 100);
    
    centers.forEach(pt => pt.move());

    polygons.forEach(poly => poly.draw());
}