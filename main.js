import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector("#webgl");

const scene = new THREE.Scene();

// 背景にテクスチャを追加
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load("./bg/scene-bg.jpg");
scene.background = bgTexture;

const sizes = {
  width: innerWidth,
  height: innerHeight,
};

const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 500);
const directionalLight = new THREE.DirectionalLight();
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.getPixelRatio(window.devicePixelRatio);

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener("resize", () => {
  sizes.width = innerWidth;
  sizes.height = innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.getPixelRatio(window.devicePixelRatio);
});
