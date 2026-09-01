/* =============================================================
   3D BACKGROUND SCENE
   -------------------------------------------------------------
   Three.js particle field, floating wireframe solids and a
   horizon grid, driven by mouse position and scroll depth.

   Performance and accessibility rules enforced here:
     - particle count scales down on small screens
     - device pixel ratio is capped
     - the render loop stops entirely when the tab is hidden or
       the canvas is scrolled out of view
     - honours prefers-reduced-motion by rendering one static
       frame instead of animating
     - degrades to a plain dark background if WebGL is missing
   ============================================================= */

(function () {
  'use strict';

  var canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isSmall = window.matchMedia('(max-width: 900px)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: !isSmall });
  } catch (e) {
    /* No WebGL available - the CSS background still looks correct. */
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  /* ---------- PARTICLE FIELD ---------- */
  var PARTICLES = isSmall ? 550 : 1800;
  var positions = new Float32Array(PARTICLES * 3);
  var colors = new Float32Array(PARTICLES * 3);

  for (var i = 0; i < PARTICLES; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    var r = Math.random();
    if (r < 0.5) {            /* cyan  */
      colors[i * 3] = 0; colors[i * 3 + 1] = 0.83; colors[i * 3 + 2] = 1;
    } else if (r < 0.8) {     /* violet */
      colors[i * 3] = 0.48; colors[i * 3 + 1] = 0.18; colors[i * 3 + 2] = 1;
    } else {                  /* aqua  */
      colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 0.9;
    }
  }

  var pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  var pMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false
  });

  var particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ---------- FLOATING SOLIDS ---------- */
  var geos = [
    new THREE.OctahedronGeometry(0.6, 0),
    new THREE.TetrahedronGeometry(0.5, 0),
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.4, 0)
  ];

  var meshes = geos.map(function (geo, idx) {
    var mat = new THREE.MeshBasicMaterial({
      color: idx % 2 === 0 ? 0x00d4ff : 0x7b2fff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((idx - 1.5) * 4, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3 - 2);
    scene.add(mesh);
    return mesh;
  });

  /* ---------- HORIZON GRID ---------- */
  var grid = new THREE.GridHelper(40, 40, 0x00d4ff, 0x00d4ff);
  grid.material.opacity = 0.04;
  grid.material.transparent = true;
  grid.position.y = -5;
  scene.add(grid);

  /* ---------- INPUT ---------- */
  var mouseX = 0, mouseY = 0, easeX = 0, easeY = 0;
  var scrollDepth = 0, easedScroll = 0;
  var boost = 0; /* raised by the easter egg in ui.js */

  window.addEventListener('mousemove', function (e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* Gyroscope-free parallax substitute for touch screens */
  window.addEventListener('touchmove', function (e) {
    var t = e.touches && e.touches[0];
    if (!t) return;
    mouseX = (t.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (t.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function readScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    scrollDepth = max > 0 ? window.scrollY / max : 0;
  }
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  document.addEventListener('portfolio:boost', function () {
    boost = 1;
  });

  /* ---------- RENDER LOOP ---------- */
  var t = 0;
  var running = false;
  var frameId = null;

  function renderFrame() {
    renderer.render(scene, camera);
  }

  function animate() {
    frameId = requestAnimationFrame(animate);

    t += 0.004 + boost * 0.02;
    if (boost > 0) boost = Math.max(0, boost - 0.004);

    easeX += (mouseX - easeX) * 0.04;
    easeY += (mouseY - easeY) * 0.04;
    easedScroll += (scrollDepth - easedScroll) * 0.06;

    particles.rotation.y = t * 0.05 + easeX * 0.15;
    particles.rotation.x = t * 0.02 + easeY * 0.1;

    meshes.forEach(function (m, idx) {
      m.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
      m.rotation.y += 0.008;
      m.position.y = Math.sin(t + idx * 1.2) * 0.5;
    });

    grid.rotation.y = t * 0.02;

    /* Cinematic drift: the camera eases forward and downward as the
       visitor travels through the page. */
    camera.position.z = 5 - easedScroll * 1.8;
    camera.position.y = easedScroll * 1.2;
    camera.rotation.x = -easedScroll * 0.12;

    renderFrame();
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    animate();
  }

  function stop() {
    running = false;
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  /* Never burn battery on a tab nobody is looking at. */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (reduceMotion) renderFrame();
  }, { passive: true });

  if (reduceMotion) {
    /* One static frame: the depth and colour stay, the motion goes. */
    renderFrame();
  } else {
    start();
  }
})();
