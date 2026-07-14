import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const app = document.querySelector('#app');
app.innerHTML = '<canvas id="scene"></canvas><div class="label">Procedural carved wooden trading ship · code-only Three.js model</div>';

const style = document.createElement('style');
style.textContent = `
  body { margin: 0; overflow: hidden; background: radial-gradient(circle at 50% 15%, #19304a 0%, #05070a 62%); font-family: Inter, system-ui, sans-serif; }
  #scene { width: 100vw; height: 100vh; display: block; }
  .label { position: fixed; left: 24px; bottom: 20px; color: #f4e4c7; letter-spacing: .04em; text-shadow: 0 2px 10px #000; }
`;
document.head.appendChild(style);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x05070a, 18, 48);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 120);
camera.position.set(8, 5.4, 13);

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#scene'), antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.8, 0);

scene.add(new THREE.HemisphereLight(0xf8ead0, 0x263345, 1.8));
const sun = new THREE.DirectionalLight(0xffdfab, 3.2);
sun.position.set(-5, 9, 6);
sun.castShadow = true;
scene.add(sun);

const wood = new THREE.MeshStandardMaterial({ color: 0xb4783f, roughness: 0.64, metalness: 0.02 });
const darkWood = new THREE.MeshStandardMaterial({ color: 0x5f3218, roughness: 0.78 });
const paleWood = new THREE.MeshStandardMaterial({ color: 0xd49b61, roughness: 0.55 });
const sailMat = new THREE.MeshStandardMaterial({ color: 0xffefd1, roughness: 0.92, side: THREE.DoubleSide });
const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc8a372, roughness: 0.88 });

function add(mesh, parent = scene) { mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; }
function cyl(radius, depth, radial = 18) { return new THREE.CylinderGeometry(radius, radius, depth, radial); }
function tubeBetween(a, b, radius, mat, segments = 8) {
  const curve = new THREE.LineCurve3(a, b);
  return add(new THREE.Mesh(new THREE.TubeGeometry(curve, 1, radius, segments), mat));
}
function rope(a, b, sag = 0.25, radius = 0.018) {
  const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -sag, 0));
  return add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, mid, b), 20, radius, 8), ropeMat));
}

function buildHull() {
  const group = new THREE.Group();
  scene.add(group);
  const shape = new THREE.Shape();
  shape.moveTo(-5.8, 0.2); shape.quadraticCurveTo(-4.4, -1.4, 0, -1.65); shape.quadraticCurveTo(4.9, -1.28, 6.35, 0.42); shape.quadraticCurveTo(3.7, -0.15, 0, -0.1); shape.quadraticCurveTo(-3.6, -0.05, -5.8, 0.2);
  const hull = add(new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 2.2, bevelEnabled: true, bevelSize: 0.18, bevelThickness: 0.22, bevelSegments: 8 }), wood), group);
  hull.rotation.x = Math.PI / 2; hull.position.z = -1.1; hull.scale.y = 0.82;

  for (let i = 0; i < 11; i++) {
    const y = -0.52 + i * 0.17;
    const rail = add(new THREE.Mesh(new THREE.TorusGeometry(4.75 + i * 0.08, 0.018, 6, 130, Math.PI * 1.03), darkWood), group);
    rail.scale.set(1.25, 0.12, 0.08); rail.rotation.set(Math.PI / 2, 0, 0); rail.position.set(0.24, y, 0);
  }
  for (let x = -4.8; x <= 4.9; x += 0.72) {
    const rib = add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.78, 2.36), darkWood), group);
    rib.position.set(x, -0.1 + Math.abs(x) * 0.035, 0); rib.rotation.z = x * 0.03;
  }
  const rail = add(new THREE.Mesh(new THREE.BoxGeometry(10.6, 0.14, 0.18), paleWood), group);
  rail.position.set(0, 0.72, 1.16);
  const rail2 = rail.clone(); rail2.position.z = -1.16; group.add(rail2);
  const prow = add(new THREE.Mesh(new THREE.ConeGeometry(0.28, 2.4, 24), paleWood), group);
  prow.position.set(6.2, 1.15, 0); prow.rotation.z = -0.52;
  for (let i = 0; i < 20; i++) {
    const bead = add(new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 18), darkWood), group);
    bead.position.set(-4.9 + i * 0.52, 0.55 + Math.sin(i) * 0.05, 1.23); bead.rotation.y = Math.PI / 2;
  }
  return group;
}

function mast(x, height) {
  const mast = add(new THREE.Mesh(cyl(0.09, height, paleWood), scene));
  mast.position.set(x, height / 2 - 0.85, 0);
  const yard = add(new THREE.Mesh(cyl(0.075, 3.9, paleWood), scene));
  yard.position.set(x, height * 0.52, 0); yard.rotation.z = Math.PI / 2 + 0.12;
  [height * 0.43, height * 0.5, height * 0.57].forEach(y => { const band = add(new THREE.Mesh(cyl(0.12, 0.06, darkWood), scene)); band.position.set(x, y - 0.85, 0); });
  return { mast, yard, top: new THREE.Vector3(x, height - 0.85, 0), yardY: height * 0.52 };
}
function sail(x, y, w, h) {
  const geom = new THREE.PlaneGeometry(w, h, 18, 18);
  const pos = geom.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const px = pos.getX(i), py = pos.getY(i);
    pos.setZ(i, Math.sin((px / w + 0.5) * Math.PI) * 0.22 + Math.cos(py * 3) * 0.04);
  }
  pos.needsUpdate = true; geom.computeVertexNormals();
  const mesh = add(new THREE.Mesh(geom, sailMat));
  mesh.position.set(x, y, 0.04); mesh.rotation.y = -0.08;
  return mesh;
}

buildHull();
const fore = mast(-2.8, 4.4); const main = mast(1.0, 6.4);
sail(-2.8, 1.75, 2.25, 2.3); sail(1.05, 2.75, 3.7, 3.55);
rope(new THREE.Vector3(-5.55, 0.75, 1.08), fore.top, 0.35); rope(fore.top, new THREE.Vector3(0.9, 3.0, 0), 0.15);
rope(new THREE.Vector3(6.0, 1.35, 1.0), main.top, 0.55); rope(main.top, new THREE.Vector3(-4.8, 0.8, -1.05), 0.7);
for (const x of [-2.8, 1.0]) {
  for (let i = -5; i <= 5; i++) rope(new THREE.Vector3(x, 3.0 + (x > 0 ? 1 : 0), 0), new THREE.Vector3(x + i * 0.45, 0.55, i > 0 ? 1.05 : -1.05), 0.08, 0.01);
}
for (let x = -4.7; x < 4.7; x += 0.85) tubeBetween(new THREE.Vector3(x, 0.66, -1.05), new THREE.Vector3(x + 0.25, 0.15, 1.05), 0.025, ropeMat);

const sea = add(new THREE.Mesh(new THREE.CircleGeometry(16, 96), new THREE.MeshStandardMaterial({ color: 0x0b2434, roughness: 0.7, metalness: 0.1 })), scene);
sea.rotation.x = -Math.PI / 2; sea.position.y = -1.65; sea.receiveShadow = true;

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y = Math.sin(performance.now() * 0.00018) * 0.08;
  controls.update(); renderer.render(scene, camera);
}
animate();
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
