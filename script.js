
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const stage = document.getElementById('stage');
const loading = document.getElementById('loading');
const hint = document.getElementById('hint');

/* ---------- renderer / scene / camera ---------- */
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x041420, 0.055);

const camera = new THREE.PerspectiveCamera(38, stage.clientWidth / stage.clientHeight, 0.1, 100);
camera.position.set(6.2, 3.4, 6.6);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 3.5;
controls.maxDistance = 14;
controls.maxPolarAngle = Math.PI * 0.52;
controls.target.set(0, 0.5, 0);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.4;

/* ---------- lighting ---------- */
scene.add(new THREE.HemisphereLight(0x2e8fc0, 0x02101a, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 1.4);
key.position.set(5, 6, 4);
scene.add(key);
const rim = new THREE.PointLight(0x3fa62f, 6, 12);
rim.position.set(-4, 2, -3);
scene.add(rim);
const fill = new THREE.PointLight(0x2e8fc0, 3, 14);
fill.position.set(4, 1, -4);
scene.add(fill);

/* ---------- materials ---------- */
const matHull   = new THREE.MeshStandardMaterial({ color: 0x4b5866, metalness: 0.35, roughness: 0.55 });
const matStripe = new THREE.MeshStandardMaterial({ color: 0x2e8fc0, metalness: 0.3, roughness: 0.5, emissive: 0x0d3348, emissiveIntensity: 0.3 });
const matDeck   = new THREE.MeshStandardMaterial({ color: 0x39424c, metalness: 0.3, roughness: 0.6 });
const matGreen  = new THREE.MeshStandardMaterial({ color: 0x3fa62f, metalness: 0.2, roughness: 0.45 });
const matWhite  = new THREE.MeshStandardMaterial({ color: 0xf0f4f6, metalness: 0.1, roughness: 0.4 });
const matGlass  = new THREE.MeshStandardMaterial({ color: 0x8fe4ff, metalness: 0.6, roughness: 0.15, emissive: 0x2e8fc0, emissiveIntensity: 0.6 });
const matDark   = new THREE.MeshStandardMaterial({ color: 0x14181c, metalness: 0.4, roughness: 0.6 });
const matFender = new THREE.MeshStandardMaterial({ color: 0x0c0e10, metalness: 0.1, roughness: 0.9 });

const allMats = [matHull, matStripe, matDeck, matGreen, matWhite, matGlass, matDark, matFender];

/* ---------- hull (extruded plan shape) ---------- */
const boat = new THREE.Group();

const shape = new THREE.Shape();
shape.moveTo(2.05, 0);
shape.quadraticCurveTo(1.7, 0.78, 0.85, 0.88);
shape.lineTo(-1.55, 0.88);
shape.quadraticCurveTo(-1.85, 0.88, -1.85, 0.55);
shape.lineTo(-1.85, -0.55);
shape.quadraticCurveTo(-1.85, -0.88, -1.55, -0.88);
shape.lineTo(0.85, -0.88);
shape.quadraticCurveTo(1.7, -0.78, 2.05, 0);

const hullGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.62, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 3, curveSegments: 24 });
hullGeo.rotateX(-Math.PI / 2);
hullGeo.translate(0, 0.05, 0);
const hull = new THREE.Mesh(hullGeo, matHull);
hull.castShadow = true;
boat.add(hull);

// waterline stripe (thin extruded band, slightly larger footprint, flattened)
const stripeShape = shape.clone();
const stripeGeo = new THREE.ExtrudeGeometry(stripeShape, { depth: 0.16, bevelEnabled: false, curveSegments: 24 });
stripeGeo.rotateX(-Math.PI / 2);
stripeGeo.translate(0, -0.28, 0);
stripeGeo.scale(1.015, 1, 1.015);
const stripe = new THREE.Mesh(stripeGeo, matStripe);
boat.add(stripe);

// main deck plate
const deckGeo = new THREE.CylinderGeometry(1, 1, 0.12, 4, 1);
const deckShape = new THREE.Shape();
deckShape.moveTo(1.5, 0);
deckShape.quadraticCurveTo(1.3, 0.62, 0.7, 0.7);
deckShape.lineTo(-1.4, 0.7);
deckShape.lineTo(-1.4, -0.7);
deckShape.lineTo(0.7, -0.7);
deckShape.quadraticCurveTo(1.3, -0.62, 1.5, 0);
const deckPlateGeo = new THREE.ExtrudeGeometry(deckShape, { depth: 0.1, bevelEnabled: false, curveSegments: 20 });
deckPlateGeo.rotateX(-Math.PI / 2);
deckPlateGeo.translate(0, 0.38, 0);
const deckPlate = new THREE.Mesh(deckPlateGeo, matDeck);
boat.add(deckPlate);

/* ---------- wheelhouse ---------- */
const wheelhouse = new THREE.Group();
wheelhouse.position.set(-0.35, 0.5, 0);

const cabinLower = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 1.5), matDeck);
cabinLower.position.y = 0.21;
wheelhouse.add(cabinLower);

const cabinBand = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.06, 1.54), matGreen);
cabinBand.position.y = 0.45;
wheelhouse.add(cabinBand);

const cabinUpper = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 1.3), matDark);
cabinUpper.position.y = 0.75;
wheelhouse.add(cabinUpper);

const trimTop = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.06, 1.36), matWhite);
trimTop.position.y = 1.02;
wheelhouse.add(trimTop);

const roof = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.5), matGreen);
roof.position.y = 1.1;
wheelhouse.add(roof);

// windows (front + sides)
const winGeo = new THREE.BoxGeometry(0.02, 0.28, 0.34);
[[-0.5, 0.66], [-0.16, 0.66], [0.18, 0.66], [0.52, 0.66]].forEach(([z, y]) => {
  const w = new THREE.Mesh(winGeo, matGlass);
  w.position.set(0.651, y, z);
  wheelhouse.add(w);
  const w2 = w.clone();
  w2.position.x = -0.651;
  wheelhouse.add(w2);
});
const frontWinGeo = new THREE.BoxGeometry(0.9, 0.26, 0.02);
const frontWin = new THREE.Mesh(frontWinGeo, matGlass);
frontWin.position.set(0, 0.66, 0.651);
wheelhouse.add(frontWin);

boat.add(wheelhouse);

/* ---------- funnel + mast ---------- */
const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.5, 16), matDark);
funnel.position.set(-0.85, 1.2, 0);
boat.add(funnel);
const funnelCap = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.05, 16), matGreen);
funnelCap.position.set(-0.85, 1.46, 0);
boat.add(funnelCap);

const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8), matDark);
mast.position.set(-0.2, 1.55, 0.2);
boat.add(mast);

// small flag (stripes echoing the logo)
const flagGroup = new THREE.Group();
const flagColors = [0xffffff, 0x2e8fc0, 0xffffff];
flagColors.forEach((c, i) => {
  const f = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.05), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide }));
  f.position.set(0.16, 1.86 - i * 0.05, 0.2);
  flagGroup.add(f);
});
boat.add(flagGroup);

/* ---------- fenders (tires along hull, echo of the logo) ---------- */
const fenderGeo = new THREE.TorusGeometry(0.16, 0.07, 10, 20);
[1.15, 0.6, 0.05, -0.5, -1.05].forEach((x) => {
  const f = new THREE.Mesh(fenderGeo, matFender);
  f.rotation.y = Math.PI / 2;
  f.position.set(x, -0.08, 0.92);
  boat.add(f);
  const f2 = f.clone();
  f2.position.z = -0.92;
  boat.add(f2);
});

/* ---------- bollards (bow + stern) ---------- */
const bollardGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.16, 10);
[[1.55, 0], [-1.4, 0]].forEach(([x, z]) => {
  const b = new THREE.Mesh(bollardGeo, matDark);
  b.position.set(x, 0.46, z);
  boat.add(b);
});

scene.add(boat);
boat.position.y = -0.15;

/* ---------- water plane ---------- */
const waterGeo = new THREE.PlaneGeometry(40, 40, 1, 1);
const water = new THREE.Mesh(waterGeo, new THREE.MeshStandardMaterial({ color: 0x0a3049, metalness: 0.4, roughness: 0.35, transparent: true, opacity: 0.85 }));
water.rotation.x = -Math.PI / 2;
water.position.y = -0.32;
scene.add(water);

const grid = new THREE.GridHelper(40, 40, 0x2e8fc0, 0x0f2e40);
grid.position.y = -0.31;
grid.material.opacity = 0.25;
grid.material.transparent = true;
scene.add(grid);

/* ---------- resize ---------- */
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
new ResizeObserver(resize).observe(stage);

/* ---------- animation loop ---------- */
let frames = 0;
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  if (frames < 3) {
    frames++;
    if (frames === 3 && loading) {
      loading.style.opacity = '0';
      setTimeout(() => loading.style.display = 'none', 400);
    }
  }
}
animate();

/* ---------- controls UI ---------- */
const btnRotate = document.getElementById('btn-rotate');
const btnWire = document.getElementById('btn-wire');
const btnReset = document.getElementById('btn-reset');

btnRotate.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  btnRotate.classList.toggle('active', controls.autoRotate);
});

let wireOn = false;
btnWire.addEventListener('click', () => {
  wireOn = !wireOn;
  allMats.forEach(m => m.wireframe = wireOn);
  scene.fog.color.set(wireOn ? 0x041a12 : 0x041420);
  btnWire.classList.toggle('active', wireOn);
});

btnReset.addEventListener('click', () => {
  camera.position.set(6.2, 3.4, 6.6);
  controls.target.set(0, 0.5, 0);
  controls.update();
});

// hide the drag hint after first interaction
controls.addEventListener('start', () => { if (hint) hint.style.opacity = '0'; });
const loader = new THREE.GLTFLoader();