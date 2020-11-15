import * as THREE from 'https://unpkg.com/three@0.122.0/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';

import {RectAreaLightUniformsLib} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/helpers/RectAreaLightHelper.js';


(function main() {
    const canvas = document.querySelector("#c");
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.physicallyCorrectLights = true;
    RectAreaLightUniformsLib.init();
    renderer.shadowMap.enabled = true;

    const fov = 45;
    const aspect = 2;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.set(0, 15, 15);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    // controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 30, 50);

    const planeSize = 80;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI*-0.5;
    scene.add(planeMesh);
    planeMesh.receiveShadow = true;

    const objects = [];

    const basicSphereGeo = new THREE.SphereBufferGeometry(4, 100, 100);
    const basicSphereMat = new THREE.MeshStandardMaterial({color: '#CA8'});
    const basicSphereMesh = new THREE.Mesh(basicSphereGeo, basicSphereMat);
    basicSphereMesh.position.set(0, 4, 0);
    scene.add(basicSphereMesh);
    basicSphereMesh.receiveShadow = true;
    basicSphereMesh.castShadow = true;

    const basicBoxGeo = new THREE.BoxBufferGeometry(4, 4, 4);
    const basicBoxMat = new THREE.MeshStandardMaterial({color: '#CA8'});
    const basicBoxMesh = new THREE.Mesh(basicBoxGeo, basicBoxMat);
    basicBoxMesh.position.set(10, 3, 0);
    basicBoxMesh.rotation.x = 45;
    basicBoxMesh.rotation.y = 45;
    scene.add(basicBoxMesh);
    basicBoxMesh.receiveShadow = true;
    basicBoxMesh.castShadow = true;
    
    // const sphereGeometry = new THREE.SphereBufferGeometry(1, 100, 100);
    const sphereGeometry = new THREE.BoxBufferGeometry(1, 1, 1);

    const solarSystem = new THREE.Object3D();
    solarSystem.position.y = 5;
    solarSystem.position.z = -20;
    scene.add(solarSystem);
    objects.push(solarSystem);

    const sunMaterial = new THREE.MeshStandardMaterial({color: 0xffff00, flatShading: true, roughness: 0});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    objects.push(sunMesh);
    sunMesh.receiveShadow = true;
    sunMesh.castShadow = true;

    const venusOrbit = new THREE.Object3D();
    venusOrbit.position.x = 7.5;
    venusOrbit.position.z = 7.5;
    solarSystem.add(venusOrbit);
    objects.push(venusOrbit);

    const venusMaterial = new THREE.MeshStandardMaterial({color: 0xff00ff, flatShading: true, roughness: 1});
    const venusMesh = new THREE.Mesh(sphereGeometry, venusMaterial);
    venusMesh.scale.set(0.75, 0.75, 0.75);
    venusOrbit.add(venusMesh);
    objects.push(venusMesh);
    venusMesh.receiveShadow = true;
    venusMesh.castShadow = true;

    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);

    const earthMaterial = new THREE.MeshStandardMaterial({color: 0x00000ff, flatShading: true, roughness: 0});
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.scale.set(1, 1, 1);
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);
    earthMesh.receiveShadow = true;
    earthMesh.castShadow = true;

    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 1.5;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshStandardMaterial({color: 0x888888, emissive: 0x333333});
    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.25, 0.25, 0.25);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);
    moonMesh.receiveShadow = true;
    moonMesh.castShadow = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));

    const light = new THREE.PointLight(0xfffffff, 1);
    light.power = 800;
    light.decay = 1.5;
    light.position.set(-10, 10, -10);
    light.distance = Infinity;
    light.castShadow = true;
    scene.add(light);

    light.shadow.mapSize.width = 500;
    light.shadow.mapSize.height = 500;
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    scene.add(cameraHelper);

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

        objects.forEach((obj) => {
            obj.rotation.y = time;
        });

        earthMesh.rotation.x = time;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
})();