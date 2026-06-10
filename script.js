// ===== Truly 3D Menu — WebGL (Three.js) =====
import * as THREE from 'three';

const MENU = [
    { id: 'home',      label: 'Home',      icon: '🏠', color: 0x667eea },
    { id: 'about',     label: 'About',     icon: 'ℹ️', color: 0x764ba2 },
    { id: 'services',  label: 'Services',  icon: '⚙️', color: 0xf093fb },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨', color: 0x4facfe },
    { id: 'contact',   label: 'Contact',   icon: '📧', color: 0x43e97b }
];

// ---------- Renderer / Scene / Camera ----------
const canvas = document.getElementById('webgl-scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a1a, 0.035);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
function cameraDistance() {
    return camera.aspect < 0.9 ? 13 : 9;
}
camera.position.set(0, 0.6, cameraDistance());

// ---------- Lights ----------
scene.add(new THREE.AmbientLight(0x404060, 1.2));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(5, 8, 6);
scene.add(keyLight);
const fillLight = new THREE.PointLight(0xf093fb, 30, 30);
fillLight.position.set(-6, -2, 4);
scene.add(fillLight);
const rimLight = new THREE.PointLight(0x4facfe, 25, 30);
rimLight.position.set(6, 3, -4);
scene.add(rimLight);

// ---------- Starfield ----------
{
    const count = 1200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = -10 - Math.random() * 60;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xaaaaff, size: 0.08, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(geo, mat));
}

// ---------- Floating wireframe shapes (deep background) ----------
const floaters = new THREE.Group();
const floaterGeos = [
    new THREE.IcosahedronGeometry(1.2, 0),
    new THREE.TorusKnotGeometry(0.8, 0.25, 64, 8),
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.TorusGeometry(1, 0.3, 8, 24)
];
for (let i = 0; i < 8; i++) {
    const geo = floaterGeos[i % floaterGeos.length];
    const mat = new THREE.MeshStandardMaterial({
        color: MENU[i % MENU.length].color,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 16, -8 - Math.random() * 20);
    mesh.userData.spin = { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 };
    mesh.userData.bobPhase = Math.random() * Math.PI * 2;
    mesh.userData.baseY = mesh.position.y;
    floaters.add(mesh);
}
scene.add(floaters);

// ---------- Label texture (canvas -> texture) ----------
function makeLabelTexture(item, hover) {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    const hex = '#' + item.color.toString(16).padStart(6, '0');
    grad.addColorStop(0, hover ? hex : '#1a1a2e');
    grad.addColorStop(1, hover ? '#1a1a2e' : hex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 240);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '80px serif';
    ctx.fillText(item.icon, 256, 105);
    ctx.font = 'bold 56px Arial, sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 12;
    ctx.fillText(item.label, 256, 195);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}

// ---------- 3D Menu carousel ----------
const carousel = new THREE.Group();
carousel.position.y = 0.4;
scene.add(carousel);

const RADIUS = 3.6;
const panels = [];

MENU.forEach((item, i) => {
    const angle = (i / MENU.length) * Math.PI * 2;

    const geo = new THREE.BoxGeometry(2.4, 1.3, 0.18);
    const side = new THREE.MeshPhysicalMaterial({
        color: item.color, metalness: 0.6, roughness: 0.3,
        clearcoat: 1, clearcoatRoughness: 0.2
    });
    const front = new THREE.MeshPhysicalMaterial({
        map: makeLabelTexture(item, false),
        metalness: 0.3, roughness: 0.35,
        clearcoat: 0.8, clearcoatRoughness: 0.25,
        emissive: new THREE.Color(item.color), emissiveIntensity: 0.05
    });
    // box material order: +x, -x, +y, -y, +z(front), -z
    const mesh = new THREE.Mesh(geo, [side, side, side, side, front, side.clone()]);

    mesh.position.set(Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS);
    mesh.lookAt(new THREE.Vector3(Math.sin(angle) * (RADIUS + 1), 0, Math.cos(angle) * (RADIUS + 1)));
    mesh.userData = { item, index: i, angle, frontMat: front, baseScale: 1 };
    panels.push(mesh);
    carousel.add(mesh);
});

// Glowing core at the center of the carousel
const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.45, 1),
    new THREE.MeshPhysicalMaterial({
        color: 0xf093fb, metalness: 0.9, roughness: 0.1,
        emissive: 0xf093fb, emissiveIntensity: 0.6, wireframe: true
    })
);
core.position.y = -0.55;
carousel.add(core);

// Reflective floor disc under the carousel
const floor = new THREE.Mesh(
    new THREE.CylinderGeometry(5.2, 5.4, 0.12, 64),
    new THREE.MeshPhysicalMaterial({
        color: 0x12122a, metalness: 0.9, roughness: 0.25,
        clearcoat: 1, transparent: true, opacity: 0.85
    })
);
floor.position.y = -1.15;
carousel.add(floor);

const ring = new THREE.Mesh(
    new THREE.TorusGeometry(5.3, 0.04, 12, 96),
    new THREE.MeshBasicMaterial({ color: 0x667eea, transparent: true, opacity: 0.8 })
);
ring.rotation.x = Math.PI / 2;
ring.position.y = -1.05;
carousel.add(ring);

// ---------- Section switching ----------
const sections = document.querySelectorAll('.section');
function activateSection(id) {
    sections.forEach(s => s.classList.toggle('section-active', s.id === id));
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
if (sections.length) sections[0].classList.add('section-active');

// rotate carousel so panel i faces the camera, then activate its section
let targetRotation = 0;
function focusPanel(index) {
    const panel = panels[index];
    // we want carousel.rotation.y + panel.angle ≡ 0 (mod 2π), choose nearest
    let desired = -panel.userData.angle;
    const twoPi = Math.PI * 2;
    while (desired - targetRotation > Math.PI) desired -= twoPi;
    while (desired - targetRotation < -Math.PI) desired += twoPi;
    targetRotation = desired;
    activateSection(panel.userData.item.id);
}

// ---------- Interaction: raycast hover + click, drag to spin ----------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(-10, -10);
let hovered = null;
let dragging = false, dragMoved = false, lastX = 0;
let mouseX = 0, mouseY = 0;

function setPointer(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseX = pointer.x; mouseY = pointer.y;
}

window.addEventListener('pointermove', (e) => {
    setPointer(e);
    if (dragging) {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        if (Math.abs(dx) > 2) dragMoved = true;
        targetRotation += dx * 0.008;
    }
});
window.addEventListener('pointerdown', (e) => {
    setPointer(e);
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.intersectObjects(panels).length || isOverViewport(e)) {
        dragging = true; dragMoved = false; lastX = e.clientX;
    }
});
window.addEventListener('pointerup', (e) => {
    if (dragging && !dragMoved) {
        setPointer(e);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(panels)[0];
        if (hit) focusPanel(hit.object.userData.index);
    }
    dragging = false;
});

const viewportEl = document.getElementById('menu3d-viewport');
function isOverViewport(e) {
    if (!viewportEl) return false;
    const r = viewportEl.getBoundingClientRect();
    return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
}

// keyboard navigation
let currentIndex = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % MENU.length; focusPanel(currentIndex); }
    if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + MENU.length) % MENU.length; focusPanel(currentIndex); }
});

// ---------- Scroll-reveal for content cards ----------
const observer = new IntersectionObserver((entries) => {
    entries.forEach(en => {
        if (en.isIntersecting) en.target.style.animation = 'slideUp 0.8s ease-out forwards';
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
document.querySelectorAll('.section-card').forEach(c => observer.observe(c));

// ---------- Resize ----------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = cameraDistance();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Animation loop ----------
const clock = new THREE.Clock();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let idleSpin = !reducedMotion;
let idleTimeout;
function pokeIdle() {
    idleSpin = false;
    clearTimeout(idleTimeout);
    if (!reducedMotion) idleTimeout = setTimeout(() => { idleSpin = true; }, 4000);
}
window.addEventListener('pointerdown', pokeIdle);
document.addEventListener('keydown', pokeIdle);

renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();

    // carousel rotation: ease toward target, slow idle spin
    if (idleSpin && !dragging) targetRotation += 0.0018;
    carousel.rotation.y += (targetRotation - carousel.rotation.y) * 0.08;

    // gentle bob for the whole carousel
    carousel.position.y = 0.4 + Math.sin(t * 0.8) * 0.08;

    // core pulse
    core.rotation.y = t * 0.6;
    core.rotation.x = t * 0.3;
    const pulse = 1 + Math.sin(t * 2) * 0.08;
    core.scale.setScalar(pulse);

    ring.rotation.z = t * 0.15;

    // floaters drift
    floaters.children.forEach(m => {
        m.rotation.x += m.userData.spin.x;
        m.rotation.y += m.userData.spin.y;
        m.position.y = m.userData.baseY + Math.sin(t * 0.5 + m.userData.bobPhase) * 0.6;
    });

    // camera parallax follows the mouse — real perspective shift
    camera.position.x += (mouseX * 1.6 - camera.position.x) * 0.05;
    camera.position.y += (0.6 + mouseY * 0.9 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.2, 0);

    // hover highlight via raycast
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(panels)[0];
    const hitMesh = hit ? hit.object : null;
    if (hovered !== hitMesh) {
        if (hovered) {
            hovered.userData.frontMat.emissiveIntensity = 0.05;
            hovered.userData.baseScale = 1;
        }
        hovered = hitMesh;
        if (hovered) {
            hovered.userData.frontMat.emissiveIntensity = 0.35;
            hovered.userData.baseScale = 1.15;
        }
        document.body.style.cursor = hovered ? 'pointer' : 'default';
    }
    panels.forEach(p => {
        const s = p.scale.x + (p.userData.baseScale - p.scale.x) * 0.12;
        p.scale.setScalar(s);
    });

    renderer.render(scene, camera);
});
