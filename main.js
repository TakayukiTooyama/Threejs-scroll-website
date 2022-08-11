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

// オブジェクトの作成
const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, -20);
box.rotation.set(1, 1, 0);
scene.add(box);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);
scene.add(torus);

// 線形補間で滑らかに移動させる
function lerp(x, y, a) {
  return (1 - a) * x + a * y;
}

function scalePercent(start, end) {
  return (scrollParcent - start) / (end - start);
}

// スクロールアニメーション
const animationScripts = [];
animationScripts.push({
  start: 0,
  end: 40,
  functoin() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scalePercent(0, 40));
    torus.position.z = lerp(10, -20, scalePercent(0, 40));
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  functoin() {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  functoin() {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scalePercent(60, 80));
    camera.position.y = lerp(1, 15, scalePercent(60, 80));
    camera.position.z = lerp(10, 25, scalePercent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 101,
  functoin() {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  },
});

//アニメーション開始
function playScrollAnimation() {
  animationScripts.forEach((animation) => {
    if (scrollParcent >= animation.start && scrollParcent <= animation.end) {
      animation.functoin();
    }
  });
}

//ブラウザのスクロール率を取得
let scrollParcent = 0;
document.body.onscroll = (e) => {
  scrollParcent =
    (document.documentElement.scrollTop /
      (document.documentElement.scrollHeight - document.documentElement.clientHeight)) *
    100;
  console.log(scrollParcent);
};

const tick = () => {
  renderer.render(scene, camera);
  playScrollAnimation();
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
