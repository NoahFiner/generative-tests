let start;
let triangles = [];
let allTriangles = [];
let iterations = 0;
const MAX_ITERATIONS = 10;

let centers = [];

// see if point is in triangle
function sign(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

function pointIsInTriangle(pt, tri) {
    
}

class Point {
    constructor(x, y, triangle) {
        this.x = x;
        this.y = y;
        this.rand = Math.random();
        if(triangle) this.triangle = triangle;
    }

    move() {
        this.x += 1*(Math.random() - 0.5);
        this.y += 1*(Math.random() - 0.5);
        // if(this.triangle) {
        //     if(!this.triangle.pointWithinTriangle(this)) {
        //         this.rand *= -1;
        //     }
        // }
    }

    rotate(angle) {
        let ca = cos(angle);
        let sa = sin(angle);
        let rotx = ca*this.x - sa*this.y;
        let roty = sa*this.x + ca*this.y;
        return new Point(rotx, roty);
    }
}

class Triangle {
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.color = 240 - ~~(Math.random()*50);
    }

    pointInTriangle(randomness) {
        let a, b, c;
        do {
            a = Math.random();
            b = Math.random();
        } while (a + b >= 1);

        a = 1/3 + randomness*(a-1/3);
        b = 1/3 + randomness*(b-1/3);

        c = 1 - a - b;

        let center_point = new Point (a*this.p1.x+b*this.p2.x+c*this.p3.x, a*this.p1.y+b*this.p2.y+c*this.p3.y, this);

        centers.push(center_point);

        return center_point;
    }

    pointWithinTriangle(pt) {
        let d1, d2, d3;
        let has_neg, has_pos;

        d1 = sign(pt, this.p1, this.p2);
        d2 = sign(pt, this.p2, this.p3);
        d3 = sign(pt, this.p3, this.p1);

        has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
        has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

        return !(has_neg && has_pos);
    }

    draw() {
        fill(this.color);
        stroke(0, 80);
        triangle(this.p1.x, this.p1.y, this.p2.x, this.p2.y, this.p3.x, this.p3.y);
    }
}

function mousePressed() {
    subdivide();
}

function subdivide() {
    iterations++;
    if(iterations > MAX_ITERATIONS) return;
    let subTriangles = [];
    triangles.forEach(tri => {
        if(Math.random() > 0.1) {
            let crackCenter = tri.pointInTriangle(0.5);
            subTriangles.push(new Triangle(tri.p1, tri.p2, crackCenter));
            subTriangles.push(new Triangle(tri.p2, tri.p3, crackCenter));
            subTriangles.push(new Triangle(tri.p3, tri.p1, crackCenter));
            subTriangles.forEach(subTri => allTriangles.push(subTri));
        } else {
            subTriangles.push(tri);
        }
    });
    triangles = subTriangles;
}

function create() {
    let radius = 450;
    let p1 = new Point(0, radius);
    let p2 = p1.rotate(radians(120));
    let p3 = p1.rotate(radians(240));
    start = new Triangle(p1, p2, p3);
    triangles.push(start);
    allTriangles.push(start);
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

    triangles.forEach(tri => tri.draw());

    // ellipse(0, 0, 20, 20);
}