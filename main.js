import * as THREE from 'three';
import "./style.css";
// animation
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Gsap
import gsap from "gsap";

// Scane
const scene = new THREE.Scene();

// saphire 3d model
const bola = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
    roughness: 0.5,
});
const mesh = new THREE.Mesh(bola, material);
scene.add(mesh);

// Sizes -new tapi harus di taru atas karena harus dipanggil sebelum code yang bawah
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Light
const light = new THREE.PointLight("#fff", 1 , 100);
// X , Y , Z
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

// Camera
// 0.1, 100 clipping point min-max yang bisa dilihat opleh cameara
// original --
// const camera = new THREE.PerspectiveCamera(45, 800 / 600, 0.1, 100);
// fullsize browser
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
// original
// renderer.setSize(800, 600);
// fullsize browser
renderer.setSize(sizes.width, sizes.height);
// to make it more smooth teh edge
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
// give a gravity / mesh
controls.enableDamping = true;
// tidak biosa di drag menggunakan right clcick
controls.enablePan = false;
// tidak biosa di zoom menggunakan scroll
controls.enableZoom = false;
// optional
controls.autoRotate = true;
controls.autoRotateSpeed = 5;


// Resize
window.addEventListener("resize", () => {
    // update size / responsive
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // console.log(window.innerWidth)

    // update camera
    // digunakan agar tidak ada distorsi atau screatching
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // ==================================================
    renderer.setSize(sizes.width, sizes.height)
});

// important resize everthing 3d model, cameara, dll
const loop = () => {
    // // we can animate here position, rotation for mesh or light or any
    // mesh.position.x += 0.1;
    // =======================

    controls.update();
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop);
}
loop();

// Gsap timeline magic
const tl = gsap.timeline({defaults: {duration: 1}});
tl.fromTo(mesh.scale, {x:0, y: 0, z: 0}, {x:1, y:1, z:1});
tl.fromTo("nav", {y: "-100%"}, {y: "0%"});
tl.fromTo(".title", {opacity: 0}, {opacity: 1});

// color change
let mouse = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouse = true));
window.addEventListener("mouseup", () => (mouse = false));

window.addEventListener("mousemove", (e) => {
    if(mouse){
        rgb = [
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255), 
            150,
        ];
        // console.log(rgb);
        
        // let's animation
        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        });
    }
});