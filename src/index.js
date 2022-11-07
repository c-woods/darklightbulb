const canvasSketch = require("canvas-sketch");

const THREE = require("three");
global.THREE = THREE;

// Import extra THREE plugins
require("three/examples/js/controls/OrbitControls");
require("three/examples/js/geometries/RoundedBoxGeometry.js");

const Stats = require("stats-js");

const settings = {
    animate: true,
    context: "webgl",
    resizeCanvas: false
};

const sketch = ({ context, canvas }) => {
    // const stats = new Stats();
    // document.body.appendChild(stats.dom);

    // Setup
    // -----

    const renderer = new THREE.WebGLRenderer({ context });
    renderer.setClearColor(0x0f0e0c, 1);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    camera.position.set(0, 0, 15);

    const controls = new THREE.OrbitControls(camera, canvas);

    const scene = new THREE.Scene();

    // Content
    // -------

    const geometry = new THREE.IcosahedronGeometry(1, 0);

    const material = new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 1,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.DirectionalLight(0xaaaaaa, 0);
    light.position.set(10, 5, 10);
    scene.add(light);

    // Update
    // ------

    const update = (deltaTime) => {
        const ROTATE_TIME = 30; // Time in seconds for a full rotation
        const xAxis = new THREE.Vector3(1, 0, 0);
        const yAxis = new THREE.Vector3(0, 1, 0);
        const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 4;
        const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 6;

        mesh.rotateOnWorldAxis(xAxis, rotateX);
        mesh.rotateOnWorldAxis(yAxis, rotateY);
    };

    // Lifecycle
    // ---------

    return {
        resize({ canvas, pixelRatio, viewportWidth, viewportHeight }) {
            const dpr = Math.min(pixelRatio, 2); // Cap DPR scaling to 2x

            canvas.width = viewportWidth * dpr;
            canvas.height = viewportHeight * dpr;
            canvas.style.width = viewportWidth + "px";
            canvas.style.height = viewportHeight + "px";

            renderer.setPixelRatio(dpr);
            renderer.setSize(viewportWidth, viewportHeight);

            camera.aspect = viewportWidth / viewportHeight;
            camera.updateProjectionMatrix();
        },
        render({ time, deltaTime }) {
            // stats.begin();
            controls.update();
            update(deltaTime);
            renderer.render(scene, camera);
            // stats.end();
        },
        unload() {
            geometry.dispose();
            material.dispose();
            controls.dispose();
            renderer.dispose();
            document.body.removeChild(stats.dom);
        }
    };
};

canvasSketch(sketch, settings);
