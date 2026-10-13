/**
 * XIPHIAS - 3D WebGL Undulating Wave Engine
 * Built with Three.js
 * Features: Dynamic Sine Wave Mesh, Glowing Particle Grid, Pointer Reactive Lighting
 */

(function () {
  'use strict';

  let scene, camera, renderer, particles, particleGeo, particleMat;
  let count = 0;
  let mouseX = 0, mouseY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  // Wave configuration parameters
  const waveConfig = {
    amountX: 75,
    amountY: 75,
    separation: 40,
    speed: 0.035,
    waveHeight: 32,
    mode: 'cyber' // 'cyber', 'cosmic', 'quantum'
  };

  const canvas = document.getElementById('webgl-wave-canvas');
  // Disabled: Blue particles effect removed from website
  return;

  function init() {
    // 1. Scene & Camera setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.0006);

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 350, 1200);
    camera.lookAt(0, 0, 0);

    // 2. Particle Geometry for 3D Wave
    const numParticles = waveConfig.amountX * waveConfig.amountY;
    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);
    const colors = new Float32Array(numParticles * 3);

    const baseColor1 = new THREE.Color(0x0284c7); // Vibrant Cyan
    const baseColor2 = new THREE.Color(0x6366f1); // Vibrant Indigo

    let i = 0, j = 0;
    for (let ix = 0; ix < waveConfig.amountX; ix++) {
      for (let iy = 0; iy < waveConfig.amountY; iy++) {
        positions[i] = ix * waveConfig.separation - ((waveConfig.amountX * waveConfig.separation) / 2); // x
        positions[i + 1] = 0; // y (calculated in loop)
        positions[i + 2] = iy * waveConfig.separation - ((waveConfig.amountY * waveConfig.separation) / 2); // z

        scales[j] = 1.0;

        // Gradient color across particles
        const ratio = (ix / waveConfig.amountX + iy / waveConfig.amountY) * 0.5;
        const c = baseColor1.clone().lerp(baseColor2, ratio);
        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;

        i += 3;
        j++;
      }
    }

    particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circle texture programmatically created for glowing dots
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 32;
    canvasTexture.height = 32;
    const ctx = canvasTexture.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(2, 132, 199, 1)');
    gradient.addColorStop(0.35, 'rgba(99, 102, 241, 0.85)');
    gradient.addColorStop(0.7, 'rgba(124, 58, 237, 0.35)');
    gradient.addColorStop(1, 'rgba(2, 132, 199, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvasTexture);

    particleMat = new THREE.PointsMaterial({
      size: 15,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 4. Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchmove', onDocumentTouchMove, { passive: true });

    // Interactive Mode Buttons Handler
    setupWaveControls();
  }

  function setupWaveControls() {
    const buttons = document.querySelectorAll('.wave-control-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', function () {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const mode = this.getAttribute('data-mode');
        setWaveMode(mode);
      });
    });
  }

  function setWaveMode(mode) {
    waveConfig.mode = mode;
    if (mode === 'cyber') {
      waveConfig.speed = 0.035;
      waveConfig.waveHeight = 32;
      particleMat.size = 14;
    } else if (mode === 'cosmic') {
      waveConfig.speed = 0.02;
      waveConfig.waveHeight = 48;
      particleMat.size = 18;
    } else if (mode === 'quantum') {
      waveConfig.speed = 0.06;
      waveConfig.waveHeight = 24;
      particleMat.size = 12;
    }
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.4;
    mouseY = (event.clientY - windowHalfY) * 0.4;
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX - windowHalfX) * 0.4;
      mouseY = (event.touches[0].clientY - windowHalfY) * 0.4;
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    // Camera gentle tracking
    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY + 360 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    const positions = particleGeo.attributes.position.array;
    const scales = particleGeo.attributes.scale.array;

    let i = 0, j = 0;
    for (let ix = 0; ix < waveConfig.amountX; ix++) {
      for (let iy = 0; iy < waveConfig.amountY; iy++) {
        // Multi-frequency sine & cosine wave generation
        let waveY = 0;
        if (waveConfig.mode === 'cyber') {
          waveY = (Math.sin((ix + count) * 0.3) * waveConfig.waveHeight) +
                  (Math.sin((iy + count) * 0.5) * waveConfig.waveHeight);
        } else if (waveConfig.mode === 'cosmic') {
          waveY = (Math.sin((ix + count) * 0.15) * waveConfig.waveHeight) +
                  (Math.cos((iy + count) * 0.25) * waveConfig.waveHeight * 1.3);
        } else if (waveConfig.mode === 'quantum') {
          waveY = (Math.sin((ix * 0.4 + count * 2)) * Math.cos((iy * 0.4 + count)) * waveConfig.waveHeight);
        }

        positions[i + 1] = waveY;

        scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 6 +
                    (Math.sin((iy + count) * 0.5) + 1) * 6;

        i += 3;
        j++;
      }
    }

    particleGeo.attributes.position.needsUpdate = true;
    particleGeo.attributes.scale.needsUpdate = true;

    count += waveConfig.speed;
    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      animate();
    });
  } else {
    init();
    animate();
  }
})();
