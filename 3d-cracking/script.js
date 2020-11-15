import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

(function main() {
    let iterations = 0;
    const MAX_ITERATIONS = 7;

    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 45;
    const aspect = 2;
    const near = 1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(30, -30, 30);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    // controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    // scene.fog = new THREE.Fog(0x000000, 30, 50);

    let color = 0xffffff;

    const lines = new THREE.Object3D();
    scene.add(lines);

    function drawLine(x1, y1, z1, x2, y2, z2) {
        const lineMaterial = new THREE.LineBasicMaterial({
            linewidth: 3,
        });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)]);
        const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
        lineMesh.material.color = new THREE.Color(color);
        lineMesh.material.needsUpdate = true;
        lines.add(lineMesh);
    };

    class Point {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    }
    
    class Shape {
        constructor(points, draw = true) {
            this.points = points;
            this.draw = () => {
                const len = points.length;
                for(let i = 0; i < points.length; i++) {
                    drawLine(this.points[(i) % len].x, this.points[(i) % len].y, this.points[(i) % len].z, this.points[(i+1) % len].x, this.points[(i+1) % len].y, this.points[(i+1) % len].z);
                }
            };
    
            if(draw) this.draw();
        }
    
        getPointInMiddle() {
            const new_x = this.points.reduce((acc, {x}) => acc += x, 0) / this.points.length;
            const new_y = this.points.reduce((acc, {y}) => acc += y, 0) / this.points.length;
            const new_z = this.points.reduce((acc, {z}) => acc += z, 0) / this.points.length;
    
            return new Point(new_x, new_y, new_z);
        }
    }

    let toSubdivide = [];


    const subdivide = () => {
        // color -= 0x111111;
        const newShapes = [];
        toSubdivide.forEach((tri) => {
            const new_pt = tri.getPointInMiddle();
            const len = tri.points.length;
            for(let i = 0; i < tri.points.length - 1; i++) {
                const shape = new Shape([tri.points[i % len], tri.points[(i + 1) % len], tri.points[(i + 2) % len], new_pt]);
                newShapes.push(shape);
            }
        });
        toSubdivide = newShapes;
    };

    toSubdivide.push(new Shape([new Point(-10, -10, -10),
                                new Point(10, -10, -10),
                                new Point(-10, 10, -10),
                                new Point(-10, -10, 10),
                                new Point(-10, 10, 10),
                                new Point(10, -10, 10),
                                new Point(10, 10, -10),
                                new Point(10, 10, 10)]));

    // toSubdivide.push(new Shape([new Point(-10, -10, -10),
    //                             new Point(10, -10, 10),
    //                             new Point(-10, -10, 10),
    //                             new Point(10, 10, 10)]));

    document.addEventListener('keyup', event => {
        if (event.code === 'Space' && iterations < MAX_ITERATIONS) {
            iterations++;
            subdivide();
        }
    });

    const cubeGeo = new THREE.BoxBufferGeometry(100, 100, 100);
    const cubeMat = new THREE.MeshPhongMaterial({
        color: '#333',
        reflectivity: 0.2,
        shininess: 0.2,
        side: THREE.BackSide,
    });
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    cubeMesh.position.set(0, 0, 0);
    scene.add(cubeMesh);

    const light = new THREE.PointLight(0xfffffff, 1);
    light.position.set(0, 10, 0);
    scene.add(light);

    renderer.render(scene, camera);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if(needResize) renderer.setSize(width, height, false);
        return needResize;
    }

    renderer.setPixelRatio(window.devicePixelRatio);

    resizeRendererToDisplaySize(renderer);

    function render(time) {
        time *= 0.001;

        if(resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        lines.rotation.y = time;
        lines.rotation.z = time;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})();