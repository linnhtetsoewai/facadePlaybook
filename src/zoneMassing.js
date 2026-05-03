(function () {
  const DEFAULTS = {
    loops: [],
    points: [],
    closed: false,
    selected: true,
    mode: 'navigate',
    drawTool: 'polyline',
    rectStart: null,
    extrusion: null,
    activeFunction: null,
    paintZone: null,
    loopPaints: {},
    extrudeInput: {
      floors: 40,
      typicalFloorHeight: 3.3
    }
  };

  const BASE_RATES = {
    bronze: 950,
    silver: 1450,
    gold: 2100,
    platinum: 3000
  };

  const ZONE_COLORS = {
    tower:          0x2d6a8f,
    podium:         0x8a6a30,
    lobby:          0x4a7a5a,
    retail:         0xc47830,
    roof_crown:     0x7a5a8a,
    penthouse:      0x5a8a7a,
    canopy:         0x5a7a9a,
    bridge:         0x7a8a9a,
    carpark_screen: 0x8a8a7a,
    mep_screen:     0x9a8a7a,
    balcony:        0x6a8a5a,
    roof:           0x8a7a6a,
    skylight:       0x4a8ab0,
    amenity_deck:   0x5a9a8a,
    feature_wall:   0xb04a5a,
    fin:            0x7a6a9a
  };
  const DEFAULT_MESH_COLOR = 0xc6b8a6;

  const WORLD_SIZE = 1200;
  const WORLD_HALF = WORLD_SIZE / 2;
  const GRID_SIZE = 300;
  const MODULE_BASE = new URL('./', document.currentScript && document.currentScript.src ? document.currentScript.src : location.href).href;

  let THREE = null;
  let OrbitControls = null;
  let initialized = false;
  let bootstrapStarted = false;
  let mouseDown = { x: 0, y: 0, button: 0 };

  const app = {
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    raycaster: null,
    ground: null,
    viewport: null,
    animateHandle: 0,
    resizeObserver: null,
    pointGroup: null,
    loopGroup: null,
    line: null,
    extrudedGroup: null,
    axes: null,
    grid: null
  };

  function getCfg() {
    if (!window.CFG) window.CFG = {};
    return window.CFG;
  }

  function state() {
    const cfg = getCfg();
    if (!cfg.massing || typeof cfg.massing !== 'object') cfg.massing = JSON.parse(JSON.stringify(DEFAULTS));
    const s = cfg.massing;
    if (!Array.isArray(s.loops)) s.loops = [];
    if (!Array.isArray(s.points)) s.points = [];
    if (typeof s.closed !== 'boolean') s.closed = false;
    if (typeof s.selected !== 'boolean') s.selected = true;
    if (!['navigate', '2d', '3d', 'paint'].includes(s.mode)) s.mode = 'navigate';
    if (typeof s.drawTool !== 'string') s.drawTool = 'polyline';
    if (!['polyline', 'rectangle'].includes(s.drawTool)) s.drawTool = 'polyline';
    if (s.rectStart && (typeof s.rectStart.x !== 'number' || typeof s.rectStart.z !== 'number')) s.rectStart = null;
    if (typeof s.activeFunction !== 'string' && s.activeFunction !== null) s.activeFunction = null;
    if (typeof s.paintZone !== 'string' && s.paintZone !== null) s.paintZone = null;
    if (!s.loopPaints || typeof s.loopPaints !== 'object' || Array.isArray(s.loopPaints)) s.loopPaints = {};
    if (!s.extrudeInput || typeof s.extrudeInput !== 'object') s.extrudeInput = { ...DEFAULTS.extrudeInput };
    s.extrudeInput.floors = clamp(round(num(s.extrudeInput.floors, DEFAULTS.extrudeInput.floors)), 1, 120);
    s.extrudeInput.typicalFloorHeight = clamp(num(s.extrudeInput.typicalFloorHeight, DEFAULTS.extrudeInput.typicalFloorHeight), 2.4, 6.0);
    s.loops = s.loops
      .map(loop => Array.isArray(loop) ? loop : [])
      .map(loop => loop
        .map(p => ({ x: clamp(num(p.x, 0), -WORLD_HALF, WORLD_HALF), z: clamp(num(p.z, 0), -WORLD_HALF, WORLD_HALF) }))
        .filter(p => Number.isFinite(p.x) && Number.isFinite(p.z)))
      .filter(loop => loop.length >= 3);
    s.points = s.points
      .map(p => ({ x: clamp(num(p.x, 0), -WORLD_HALF, WORLD_HALF), z: clamp(num(p.z, 0), -WORLD_HALF, WORLD_HALF) }))
      .filter(p => Number.isFinite(p.x) && Number.isFinite(p.z));
    if (s.closed && s.points.length >= 3) {
      s.loops.push(s.points.map(p => ({ ...p })));
      s.points = [];
      s.closed = false;
    }
    if (!s.points.length) {
      s.closed = false;
      s.selected = true;
      s.rectStart = null;
    }
    return s;
  }

  function num(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function round(value) {
    return Math.round(value);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatArea(value) {
    return `${round(value).toLocaleString()} m2`;
  }

  function formatCurrency(value) {
    return `AED ${round(value).toLocaleString()}`;
  }

  function getBudgetTier() {
    const normalize = window.normalizeBudgetValue || ((v) => String(v || '').trim().toLowerCase());
    return normalize((window.CFG && window.CFG.budget) || 'bronze');
  }

  function getBudgetRate() {
    return BASE_RATES[getBudgetTier()] || BASE_RATES.bronze;
  }

  function getZoneLabels() {
    const zones = Array.isArray(window.CFG?.zones) ? window.CFG.zones : [];
    const normalize = window.normalizeZoneValue || ((v) => String(v || '').trim().toLowerCase());
    return zones.map(normalize).filter(Boolean).map(z => window.getZoneLabel ? window.getZoneLabel(z) : z);
  }

  function polygonArea(points) {
    if (!points || points.length < 3) return 0;
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      sum += a.x * b.z - b.x * a.z;
    }
    return Math.abs(sum) / 2;
  }

  function polygonPerimeter(points) {
    if (!points || points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      total += Math.hypot(b.x - a.x, b.z - a.z);
    }
    return total;
  }

  function centroid(points) {
    if (!points || !points.length) return { x: 0, z: 0 };
    let x = 0;
    let z = 0;
    points.forEach(p => { x += p.x; z += p.z; });
    return { x: x / points.length, z: z / points.length };
  }

  function getFootprintShape(points) {
    const shape = new THREE.Shape();
    if (!points || points.length < 3) return shape;
    shape.moveTo(points[0].x, points[0].z);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].z);
    }
    shape.lineTo(points[0].x, points[0].z);
    return shape;
  }

  function ensureThree() {
    if (window.THREE && window.THREE.OrbitControls) {
      THREE = window.THREE;
      OrbitControls = window.THREE.OrbitControls;
      return Promise.resolve();
    }
    if (THREE && OrbitControls) return Promise.resolve();
    return Promise.reject(new Error('Three.js globals were not initialized'));
  }

  function clearThreeObject(obj) {
    if (!obj) return;
    while (obj.children.length) {
      const child = obj.children.pop();
      disposeObject(child);
      if (child.userData && typeof child.userData.dispose === 'function') child.userData.dispose();
    }
  }

  function getMetrics() {
    const s = state();
    const loops = Array.isArray(s.loops) ? s.loops : [];
    const points = s.points;
    const footprintArea = loops.reduce((sum, loop) => sum + polygonArea(loop), 0);
    const perimeter = loops.reduce((sum, loop) => sum + polygonPerimeter(loop), 0);
    const floors = s.extrusion?.floors || 0;
    const typicalFloorHeight = s.extrusion?.typicalFloorHeight || 0;
    const height = s.extrusion?.height || (floors * typicalFloorHeight);
    const facadeArea = perimeter && height ? perimeter * height : 0;
    const volume = footprintArea && height ? footprintArea * height : 0;
    const totalCost = facadeArea * getBudgetRate();
    const formFactor = volume ? facadeArea / volume : 0;
    const slenderness = footprintArea ? height / Math.sqrt(footprintArea) : 0;
    return {
      ...s,
      footprintArea,
      perimeter,
      floors,
      typicalFloorHeight,
      height,
      facadeArea,
      volume,
      totalCost,
      formFactor,
      slenderness,
      center: centroid(loops.flat().concat(points)),
      loopCount: loops.length,
      draftPoints: points.length,
      selectedZones: getZoneLabels()
    };
  }

  function resetModel() {
    getCfg().massing = JSON.parse(JSON.stringify(DEFAULTS));
    render();
    updateScene();
  }

  function setMode(mode) {
    const s = state();
    s.mode = mode;
    s.rectStart = null;
    if (mode === '2d') {
      s.activeFunction = 'draw';
      render();
      setView('top');
    } else if (mode === '3d') {
      s.activeFunction = 'extrude';
      render();
    } else if (mode === 'paint') {
      s.activeFunction = 'paint';
      render();
    } else {
      s.activeFunction = null;
      render();
    }
    updateMode();
  }

  function setDrawTool(tool) {
    const s = state();
    s.drawTool = tool === 'rectangle' ? 'rectangle' : 'polyline';
    s.rectStart = null;
    if (s.mode !== '2d') { s.mode = '2d'; s.activeFunction = 'draw'; }
    render();
    setView('top');
    updateMode();
  }

  function addPoint(point) {
    const s = state();
    s.points.push(point);
    s.selected = true;
    s.extrusion = null;
    s.rectStart = null;
    render();
    updateScene();
  }

  function setRectangleStart(point) {
    const s = state();
    s.rectStart = { x: point.x, z: point.z };
    s.points = [point];
    s.selected = true;
    s.extrusion = null;
    render();
    updateScene();
  }

  function completeRectangle(point) {
    const s = state();
    const start = s.rectStart;
    if (!start) return;
    const minX = Math.min(start.x, point.x);
    const maxX = Math.max(start.x, point.x);
    const minZ = Math.min(start.z, point.z);
    const maxZ = Math.max(start.z, point.z);
    if (Math.abs(maxX - minX) < 0.5 || Math.abs(maxZ - minZ) < 0.5) return;
    s.loops.push([
      { x: minX, z: minZ },
      { x: maxX, z: minZ },
      { x: maxX, z: maxZ },
      { x: minX, z: maxZ }
    ]);
    s.points = [];
    s.selected = true;
    s.rectStart = null;
    s.extrusion = null;
    render();
    updateScene();
  }

  function undoPoint() {
    const s = state();
    if (s.points.length) s.points.pop();
    else if (s.rectStart) s.rectStart = null;
    s.extrusion = null;
    render();
    updateScene();
  }

  function closeLoop() {
    const s = state();
    if (s.points.length < 3) return;
    s.extrusion = null;
    s.loops.push(s.points.map(p => ({ ...p })));
    s.points = [];
    s.selected = true;
    s.rectStart = null;
    render();
    updateScene();
  }

  function confirmExtrude() {
    const s = state();
    if (!s.loops.length) return;
    const floors = clamp(round(num(s.extrudeInput.floors, DEFAULTS.extrudeInput.floors)), 1, 120);
    const typicalFloorHeight = clamp(num(s.extrudeInput.typicalFloorHeight, DEFAULTS.extrudeInput.typicalFloorHeight), 2.4, 6.0);
    s.extrusion = {
      floors,
      typicalFloorHeight,
      height: floors * typicalFloorHeight
    };
    s.selected = true;
    render();
    updateScene();
    updateContinueButton();
  }

  function updateDialogField(field, value) {
    const s = state();
    if (field === 'floors') s.extrudeInput.floors = clamp(round(num(value, s.extrudeInput.floors)), 1, 120);
    if (field === 'typicalFloorHeight') s.extrudeInput.typicalFloorHeight = clamp(num(value, s.extrudeInput.typicalFloorHeight), 2.4, 6.0);
    render();
  }

  function setFunction(fn) {
    state().activeFunction = fn;
    render();
  }

  function setPaintZone(zone) {
    state().paintZone = zone;
    render();
  }

  function clearPaints() {
    state().loopPaints = {};
    render();
    updateScene();
  }

  function cancelExtrude() {
    state().activeFunction = null;
    render();
  }

  function createScene() {
    const viewport = document.getElementById('massing-viewport');
    if (!viewport || !THREE) return;
    app.viewport = viewport;
    viewport.innerHTML = '';

    const width = viewport.clientWidth || 900;
    const height = viewport.clientHeight || 460;

    app.scene = new THREE.Scene();
    app.scene.background = new THREE.Color('#f8f4ed');

    app.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    app.camera.position.set(220, 180, 220);

    app.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    app.renderer.setPixelRatio(window.devicePixelRatio || 1);
    app.renderer.setSize(width, height);
    app.renderer.outputColorSpace = THREE.SRGBColorSpace;
    app.renderer.domElement.style.display = 'block';
    app.renderer.domElement.style.width = '100%';
    app.renderer.domElement.style.height = '100%';
    app.renderer.domElement.style.cursor = 'crosshair';
    app.renderer.domElement.style.touchAction = 'none';
    app.renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
    viewport.appendChild(app.renderer.domElement);

    app.controls = new OrbitControls(app.camera, app.renderer.domElement);
    app.controls.target.set(0, 0, 0);
    app.controls.enableDamping = true;
    app.controls.dampingFactor = 0.08;
    app.controls.screenSpacePanning = true;
    app.controls.maxPolarAngle = Math.PI * 0.49;
    app.controls.minDistance = 20;
    app.controls.maxDistance = 500;

    app.raycaster = new THREE.Raycaster();

    const ambient = new THREE.AmbientLight(0xffffff, 1.65);
    app.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1.55);
    sun.position.set(160, 220, 90);
    app.scene.add(sun);

    app.grid = new THREE.GridHelper(GRID_SIZE, 30, 0x9d9588, 0xd9d0cf);
    const gridMaterials = Array.isArray(app.grid.material) ? app.grid.material : [app.grid.material];
    gridMaterials.forEach(mat => {
      mat.transparent = true;
      mat.opacity = 0.5;
    });
    app.scene.add(app.grid);

    app.axes = new THREE.AxesHelper(GRID_SIZE * 0.4);
    app.scene.add(app.axes);

    const planeGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE);
    const planeMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      color: 0xffffff
    });
    app.ground = new THREE.Mesh(planeGeo, planeMat);
    app.ground.rotation.x = -Math.PI / 2;
    app.scene.add(app.ground);

    app.pointGroup = new THREE.Group();
    app.scene.add(app.pointGroup);
    app.loopGroup = new THREE.Group();
    app.scene.add(app.loopGroup);
    app.extrudedGroup = new THREE.Group();
    app.scene.add(app.extrudedGroup);

    app.line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x1a1814, linewidth: 2 }));
    app.scene.add(app.line);

    updateScene();
    bindViewportEvents();
    updateMode();
    animate();
    if (app.resizeObserver) app.resizeObserver.disconnect();
    app.resizeObserver = new ResizeObserver(() => resize());
    app.resizeObserver.observe(viewport);
  }

  function buildPointLine(points, closed) {
    if (!points.length) return new THREE.BufferGeometry();
    const positions = [];
    points.forEach(p => positions.push(p.x, 0.15, p.z));
    if (closed && points.length >= 3) positions.push(points[0].x, 0.15, points[0].z);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }

  function updateScene() {
    if (!THREE || !app.scene || !app.pointGroup || !app.loopGroup || !app.extrudedGroup) return;
    const s = state();
    const metrics = getMetrics();
    const loops = Array.isArray(s.loops) ? s.loops : [];
    const points = s.points;

    clearThreeObject(app.pointGroup);
    clearThreeObject(app.loopGroup);
    clearThreeObject(app.extrudedGroup);

    loops.forEach((loop, loopIdx) => {
      const loopColor = [0x1a1814, 0x28536b, 0x7a5c2e, 0x4a6f43][loopIdx % 4];
      const positions = [];
      loop.forEach(p => positions.push(p.x, 0.15, p.z));
      if (loop.length >= 3) positions.push(loop[0].x, 0.15, loop[0].z);
      const loopGeo = new THREE.BufferGeometry();
      loopGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const loopLine = new THREE.LineLoop(loopGeo, new THREE.LineBasicMaterial({ color: loopColor, linewidth: 2 }));
      app.loopGroup.add(loopLine);

      loop.forEach((p, idx) => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.9, 16, 16),
          new THREE.MeshStandardMaterial({ color: loopColor, roughness: 0.45, metalness: 0.05 })
        );
        sphere.position.set(p.x, 0.9, p.z);
        app.loopGroup.add(sphere);

        const label = createLabel(`${idx + 1}`);
        label.position.set(p.x + 1.1, 1.55, p.z - 1.1);
        app.loopGroup.add(label);
      });
    });

    points.forEach((p, idx) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x1a1814, roughness: 0.45, metalness: 0.05 })
      );
      sphere.position.set(p.x, 0.9, p.z);
      app.pointGroup.add(sphere);

      const label = createLabel(`${idx + 1}`);
      label.position.set(p.x + 1.1, 1.55, p.z - 1.1);
      app.pointGroup.add(label);
    });

    if (app.line.geometry) app.line.geometry.dispose();
    app.line.geometry = buildPointLine(points, false);
    app.line.material.color.set(0x7e7362);

    if (s.extrusion && loops.length) {
      loops.forEach((loop, loopIdx) => {
        if (loop.length < 3) return;
        const shape = getFootprintShape(loop);
        const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
          depth: s.extrusion.height,
          bevelEnabled: false,
          steps: 1
        });
        extrudeGeo.rotateX(-Math.PI / 2);
        const zoneKey = s.loopPaints ? s.loopPaints[loopIdx] : null;
        const color = (zoneKey && ZONE_COLORS[zoneKey]) ? ZONE_COLORS[zoneKey] : DEFAULT_MESH_COLOR;
        const material = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.82,
          metalness: 0.0,
          transparent: true,
          opacity: 0.92
        });
        const mesh = new THREE.Mesh(extrudeGeo, material);
        mesh.userData.loopIdx = loopIdx;
        app.extrudedGroup.add(mesh);
      });
    }

    updateContinueButton(metrics);
    syncDom();
  }

  function updateContinueButton(metrics = getMetrics()) {
    const btn = document.getElementById('s2-next');
    if (btn) btn.disabled = !metrics.extrusion;
  }

  function resize() {
    if (!app.viewport || !app.renderer || !app.camera) return;
    const width = app.viewport.clientWidth || 900;
    const height = app.viewport.clientHeight || 460;
    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(width, height);
  }

  function animate() {
    if (!app.renderer || !app.scene || !app.camera) return;
    app.animateHandle = window.requestAnimationFrame(animate);
    if (app.controls) app.controls.update();
    app.renderer.render(app.scene, app.camera);
  }

  function disposeObject(obj) {
    if (!obj) return;
    obj.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
    });
  }

  function createLabel(text) {
    const group = new THREE.Group();
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.strokeStyle = 'rgba(26,24,20,0.12)';
    ctx.lineWidth = 2;
    roundRect(ctx, 2, 2, 124, 60, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#1A1814';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 32);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(6, 3, 1);
    group.add(sprite);
    group.userData.dispose = () => {
      texture.dispose();
      material.dispose();
    };
    return group;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function buildLine1Html(s) {
    const tabs = [
      { id: 'navigate', label: 'Navigate' },
      { id: '2d',       label: '2D' },
      { id: '3d',       label: '3D' },
      { id: 'paint',    label: 'Paint' }
    ];
    return tabs.map(t =>
      `<button class="mode-tab${s.mode === t.id ? ' active' : ''}" data-action="set-mode" data-mode="${t.id}">${t.label}</button>`
    ).join('');
  }

  function buildLine2Html(s) {
    if (s.mode === 'navigate') {
      return ['top','front','iso','left','right','back'].map(v =>
        `<button class="fn-btn" data-action="view" data-view="${v}">${v.charAt(0).toUpperCase() + v.slice(1)}</button>`
      ).join('');
    }
    if (s.mode === '2d') {
      return `
        <button class="fn-btn${s.activeFunction === 'draw' ? ' active' : ''}" data-action="set-function" data-fn="draw">Draw</button>
        <button class="fn-btn" disabled>Offset</button>
        <button class="fn-btn" disabled>Trim</button>
      `;
    }
    if (s.mode === '3d') {
      const noLoops = !s.loops.length;
      return `
        <button class="fn-btn${s.activeFunction === 'extrude' ? ' active' : ''}" data-action="set-function" data-fn="extrude" ${noLoops ? 'disabled title="Draw and close a loop in 2D mode first"' : ''}>Extrude</button>
        <button class="fn-btn" disabled>Sweep</button>
        <button class="fn-btn" disabled>Extract</button>
        <button class="fn-btn" disabled>Boolean</button>
      `;
    }
    if (s.mode === 'paint') {
      const noExtrusion = !s.extrusion;
      return `
        <button class="fn-btn${s.activeFunction === 'paint' ? ' active' : ''}" data-action="set-function" data-fn="paint" ${noExtrusion ? 'disabled title="Extrude a model in 3D mode first"' : ''}>Paint</button>
        <button class="fn-btn" disabled>Unpaint</button>
        <div style="flex:1"></div>
        <button class="fn-btn" data-action="clear-paints">Clear all</button>
      `;
    }
    return '';
  }

  function buildLine3Html(s) {
    if (s.mode === 'navigate') {
      return `<span class="ln3-hint">Orbit · Zoom · Pan — no geometry editing in this mode</span>`;
    }
    if (s.mode === '2d' && s.activeFunction === 'draw') {
      return `
        <span class="ln3-label">Draw:</span>
        <button class="fn-btn${s.drawTool === 'polyline' ? ' active' : ''}" data-action="draw-tool" data-tool="polyline">Polyline</button>
        <button class="fn-btn${s.drawTool === 'rectangle' ? ' active' : ''}" data-action="draw-tool" data-tool="rectangle">Rectangle</button>
        <div class="ln3-sep"></div>
        <button class="fn-btn" data-action="undo-point">Undo point</button>
        <button class="fn-btn" data-action="close-loop">Close loop</button>
        <div style="flex:1"></div>
        <button class="fn-btn" data-action="reset-model">Reset</button>
      `;
    }
    if (s.mode === '3d' && s.activeFunction === 'extrude') {
      const floors = s.extrudeInput.floors;
      const floorHt = s.extrudeInput.typicalFloorHeight;
      const total = (floors * floorHt).toFixed(1);
      return `
        <span class="ln3-label">Extrude:</span>
        <span class="ln3-lbl">Floors</span>
        <input class="ln3-input" type="number" min="1" max="120" step="1" value="${escapeHtml(String(floors))}" data-field="floors">
        <span class="ln3-lbl">Floor height (m)</span>
        <input class="ln3-input" type="number" min="2.4" max="6" step="0.1" value="${escapeHtml(String(floorHt))}" data-field="typicalFloorHeight">
        <div class="ln3-sep"></div>
        <button class="fn-btn fn-primary" data-action="confirm-extrude">Confirm</button>
        <button class="fn-btn" data-action="cancel-extrude">Cancel</button>
        <div style="flex:1"></div>
        <span class="ln3-readout">Total: ${escapeHtml(total)} m</span>
      `;
    }
    if (s.mode === 'paint' && s.activeFunction === 'paint') {
      const ALL_ZONES = ['tower','podium','lobby','retail','roof_crown','penthouse','canopy','bridge','carpark_screen','mep_screen','balcony','roof','skylight','amenity_deck','feature_wall','fin'];
      const zones = (Array.isArray(window.CFG?.zones) && window.CFG.zones.length) ? window.CFG.zones : ALL_ZONES;
      const getLabel = window.getZoneLabel || (z => z.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
      return `
        <span class="ln3-label">Zone:</span>
        ${zones.map(z =>
          `<button class="fn-btn${s.paintZone === z ? ' active' : ''}" data-action="set-paint-zone" data-zone="${escapeHtml(z)}">${escapeHtml(getLabel(z))}</button>`
        ).join('')}
      `;
    }
    return '';
  }

  function buildHintText(s) {
    if (s.mode === '2d' && s.activeFunction === 'draw') return 'Click the viewport to place points · Close to finish the loop';
    if (s.mode === 'paint' && s.activeFunction === 'paint') return 'Click a mesh to assign the selected zone';
    return '';
  }

  function buildViewportHtml() {
    const s = state();
    const metrics = getMetrics();
    return `
      <div class="zone-modeling">
        <div class="zone-modeling-head">
          <div>
            <div class="zone-modeling-title">Massing from scratch</div>
            <div class="zone-modeling-sub">Draw footprints in 2D, extrude in 3D, assign facade zones in Paint.</div>
          </div>
          <span class="badge badge-${s.extrusion ? 'green' : 'blue'}" data-role="status-badge">${s.extrusion ? 'Extruded' : 'Draft'}</span>
        </div>

        <div class="plan-layout">
          <div class="plan-stage">
            <div class="mode-toolbar">
              <div class="mode-line-1" data-role="mode-line-1">${buildLine1Html(s)}</div>
              <div class="mode-line-2" data-role="mode-line-2">${buildLine2Html(s)}</div>
              <div class="mode-line-3" data-role="mode-line-3">${buildLine3Html(s)}</div>
            </div>
            <div class="three-shell">
              <div class="three-hint" data-role="three-hint">${buildHintText(s)}</div>
              <div class="three-viewport" id="massing-viewport"></div>
            </div>
          </div>

          <div class="plan-sidebar">
            <div class="card zone-modeling-panel">
              <div class="zone-modeling-panel-head">
                <div>
                  <div class="zone-modeling-panel-title">Massing summary</div>
                  <div class="zone-modeling-panel-sub">Footprints from one or more loops. Extrusion from floors and typical floor height.</div>
                </div>
                <span class="badge badge-${s.extrusion ? 'green' : 'gray'}" data-role="status-badge-sidebar">${s.extrusion ? 'Extruded' : 'Draft'}</span>
              </div>
              <div class="zone-kpi-grid mb-16">
                <div class="zone-kpi"><div class="v" data-role="kpi-footprint">${formatArea(metrics.footprintArea)}</div><div class="l">Footprint area</div></div>
                <div class="zone-kpi"><div class="v" data-role="kpi-perimeter">${metrics.perimeter.toFixed(1)} m</div><div class="l">Perimeter</div></div>
                <div class="zone-kpi"><div class="v" data-role="kpi-height">${metrics.height ? `${metrics.height.toFixed(1)} m` : '—'}</div><div class="l">Extruded height</div></div>
                <div class="zone-kpi"><div class="v" data-role="kpi-cost">${formatCurrency(metrics.totalCost)}</div><div class="l">Facade cost</div></div>
              </div>
              <div class="zone-breakdown">
                <div class="zone-breakdown-row"><div class="k">Loops</div><div class="v" data-role="loop-status">${metrics.loopCount} closed${s.points.length ? ` · drafting ${s.points.length}` : ''}</div></div>
                <div class="zone-breakdown-row"><div class="k">Mode</div><div class="v" data-role="mode-text">${s.mode}</div></div>
                <div class="zone-breakdown-row"><div class="k">Floors</div><div class="v" data-role="floors-text">${metrics.floors || '—'}</div></div>
                <div class="zone-breakdown-row"><div class="k">Typical floor height</div><div class="v" data-role="floor-height-text">${metrics.typicalFloorHeight ? `${metrics.typicalFloorHeight.toFixed(2)} m` : '—'}</div></div>
              </div>
            </div>

            <div class="card zone-modeling-panel">
              <div class="zone-modeling-panel-title">Workflow</div>
              <div class="plan-list mt-8">
                <div class="plan-item${s.points.length ? ' active' : ''}">
                  <div class="plan-item-title">1. Draw the loop (2D mode)</div>
                  <div class="plan-item-sub">Switch to 2D, select Draw, click the viewport to place points.</div>
                </div>
                <div class="plan-item${s.loops.length ? ' active' : ''}">
                  <div class="plan-item-title">2. Close the loop</div>
                  <div class="plan-item-sub">Click Close loop to finish each footprint polygon.</div>
                </div>
                <div class="plan-item${s.extrusion ? ' active' : ''}">
                  <div class="plan-item-title">3. Extrude (3D mode)</div>
                  <div class="plan-item-sub">Switch to 3D, click Extrude, enter floors and floor height.</div>
                </div>
                <div class="plan-item${Object.keys(s.loopPaints || {}).length ? ' active' : ''}">
                  <div class="plan-item-title">4. Paint zones (Paint mode)</div>
                  <div class="plan-item-sub">Switch to Paint, select a zone, click the mesh to assign it.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    const root = document.getElementById('zone-modeling-root');
    if (!root) return;
    const shellExists = !!root.querySelector('.three-shell');
    if (!shellExists || !initialized) {
      root.innerHTML = buildViewportHtml();
      bindUI();
    } else {
      syncDom();
    }
  }

  function syncDom() {
    const root = document.getElementById('zone-modeling-root');
    if (!root) return;
    const s = state();
    const metrics = getMetrics();

    const line1 = root.querySelector('[data-role="mode-line-1"]');
    const line2 = root.querySelector('[data-role="mode-line-2"]');
    const line3 = root.querySelector('[data-role="mode-line-3"]');
    const hint  = root.querySelector('[data-role="three-hint"]');
    if (line1) line1.innerHTML = buildLine1Html(s);
    if (line2) line2.innerHTML = buildLine2Html(s);
    if (line3) line3.innerHTML = buildLine3Html(s);
    if (hint)  hint.textContent = buildHintText(s);

    const statusBadge        = root.querySelector('[data-role="status-badge"]');
    const statusBadgeSidebar = root.querySelector('[data-role="status-badge-sidebar"]');
    const footprint          = root.querySelector('[data-role="kpi-footprint"]');
    const perimeter          = root.querySelector('[data-role="kpi-perimeter"]');
    const height             = root.querySelector('[data-role="kpi-height"]');
    const cost               = root.querySelector('[data-role="kpi-cost"]');
    const loopStatus         = root.querySelector('[data-role="loop-status"]');
    const modeText           = root.querySelector('[data-role="mode-text"]');
    const floorsText         = root.querySelector('[data-role="floors-text"]');
    const floorHeightText    = root.querySelector('[data-role="floor-height-text"]');

    [statusBadge, statusBadgeSidebar].forEach(el => {
      if (!el) return;
      el.textContent = s.extrusion ? 'Extruded' : 'Draft';
      el.className = `badge badge-${s.extrusion ? 'green' : 'gray'}`;
    });
    if (footprint)       footprint.textContent = formatArea(metrics.footprintArea);
    if (perimeter)       perimeter.textContent = `${metrics.perimeter.toFixed(1)} m`;
    if (height)          height.textContent = metrics.height ? `${metrics.height.toFixed(1)} m` : '—';
    if (cost)            cost.textContent = formatCurrency(metrics.totalCost);
    if (loopStatus)      loopStatus.textContent = `${metrics.loopCount} closed${s.points.length ? ` · drafting ${s.points.length}` : ''}`;
    if (modeText)        modeText.textContent = s.mode;
    if (floorsText)      floorsText.textContent = metrics.floors || '—';
    if (floorHeightText) floorHeightText.textContent = metrics.typicalFloorHeight ? `${metrics.typicalFloorHeight.toFixed(2)} m` : '—';

    updateMode();
    updateContinueButton(metrics);
  }

  function bindUI() {
    const root = document.getElementById('zone-modeling-root');
    if (!root || root.dataset.bound === '1') return;
    root.dataset.bound = '1';

    root.addEventListener('click', event => {
      const actionEl = event.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      event.preventDefault();

      if (action === 'set-mode')       { setMode(actionEl.dataset.mode); return; }
      if (action === 'set-function')   { setFunction(actionEl.dataset.fn); return; }
      if (action === 'view')           { setView(actionEl.dataset.view); return; }
      if (action === 'draw-tool')      { setDrawTool(actionEl.dataset.tool); return; }
      if (action === 'undo-point')     { undoPoint(); return; }
      if (action === 'close-loop')     { closeLoop(); return; }
      if (action === 'reset-model')    { resetModel(); return; }
      if (action === 'confirm-extrude'){ confirmExtrude(); return; }
      if (action === 'cancel-extrude') { cancelExtrude(); return; }
      if (action === 'set-paint-zone') { setPaintZone(actionEl.dataset.zone); return; }
      if (action === 'clear-paints')   { clearPaints(); return; }
    });

    root.addEventListener('input', event => {
      const input = event.target.closest('[data-field]');
      if (!input) return;
      updateDialogField(input.dataset.field, input.value);
    });

    root.addEventListener('change', event => {
      const input = event.target.closest('[data-field]');
      if (!input) return;
      updateDialogField(input.dataset.field, input.value);
    });
  }

  function bindViewportEvents() {
    if (!app.renderer) return;
    const canvas = app.renderer.domElement;

    canvas.addEventListener('mousedown', event => {
      mouseDown = { x: event.clientX, y: event.clientY, button: event.button };
    });

    window.addEventListener('mouseup', event => {
      const s = state();
      if (mouseDown.button !== 0) return;
      const moved = Math.hypot(event.clientX - mouseDown.x, event.clientY - mouseDown.y);
      if (moved > 6) return;

      if (s.mode === '2d' && s.activeFunction === 'draw') {
        const point = pickPlanPoint(event, canvas);
        if (!point) return;
        if (s.drawTool === 'rectangle') {
          if (!s.rectStart) { setRectangleStart(point); }
          else { completeRectangle(point); }
          return;
        }
        if (s.points.length >= 3) {
          const first = s.points[0];
          if (Math.hypot(point.x - first.x, point.z - first.z) <= 2.25) {
            closeLoop();
            return;
          }
        }
        addPoint(point);
        return;
      }

      if (s.mode === 'paint' && s.activeFunction === 'paint' && s.paintZone) {
        if (!app.raycaster || !app.camera || !app.extrudedGroup) return;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top  || event.clientY > rect.bottom) return;
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);
        const hits = app.raycaster.intersectObjects(app.extrudedGroup.children, false);
        if (!hits.length) return;
        const loopIdx = hits[0].object.userData.loopIdx;
        if (typeof loopIdx !== 'number') return;
        s.loopPaints[loopIdx] = s.paintZone;
        updateScene();
      }
    });
  }

  function pickPlanPoint(event, surface) {
    if (!surface || !app.renderer || !app.camera || !app.raycaster || !app.ground) return null;
    const rect = surface.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
      return null;
    }
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);
    const hits = app.raycaster.intersectObject(app.ground, false);
    if (!hits.length) return null;
    const p = hits[0].point;
    return {
      x: clamp(p.x, -WORLD_HALF, WORLD_HALF),
      z: clamp(p.z, -WORLD_HALF, WORLD_HALF)
    };
  }

  function setView(view) {
    if (!app.camera || !app.controls) return;
    const dist = 220;
    const center = new THREE.Vector3(0, 0, 0);
    app.controls.target.copy(center);
    switch (view) {
      case 'top':
        app.camera.position.set(0, dist, 0.01);
        app.camera.up.set(0, 0, -1);
        break;
      case 'front':
        app.camera.position.set(0, 70, dist);
        app.camera.up.set(0, 1, 0);
        break;
      case 'back':
        app.camera.position.set(0, 70, -dist);
        app.camera.up.set(0, 1, 0);
        break;
      case 'left':
        app.camera.position.set(-dist, 70, 0);
        app.camera.up.set(0, 1, 0);
        break;
      case 'right':
        app.camera.position.set(dist, 70, 0);
        app.camera.up.set(0, 1, 0);
        break;
      case 'iso':
      default:
        app.camera.position.set(dist * 0.9, dist * 0.7, dist * 0.9);
        app.camera.up.set(0, 1, 0);
        break;
    }
    app.controls.update();
  }

  function updateContinueButton(metrics = getMetrics()) {
    const btn = document.getElementById('s2-next');
    if (btn) btn.disabled = !metrics.extrusion;
  }

  function initScene() {
    if (initialized) return;
    const viewport = document.getElementById('massing-viewport');
    if (!viewport || !THREE) return;
    if (app.animateHandle) cancelAnimationFrame(app.animateHandle);

    createScene();
    initialized = true;
    setView('top');
    updateScene();
  }

  function setModeAndRefresh(mode) {
    setMode(mode);
  }

  function updateMode() {
    const s = state();
    const shell = document.querySelector('.three-shell');
    if (shell) {
      shell.classList.toggle('is-navigate', s.mode === 'navigate');
      shell.classList.toggle('is-2d',       s.mode === '2d');
      shell.classList.toggle('is-3d',       s.mode === '3d');
      shell.classList.toggle('is-paint',    s.mode === 'paint');
    }
    if (app.controls) {
      app.controls.enabled = s.mode === 'navigate' || s.mode === '3d' || s.mode === 'paint';
    }
    if (app.renderer) {
      const cursor = (s.mode === '2d' || s.mode === 'paint') ? 'crosshair'
                   : s.mode === 'navigate' ? 'grab'
                   : 'default';
      app.renderer.domElement.style.cursor = cursor;
    }
  }

  async function bootstrap() {
    if (bootstrapStarted) return;
    bootstrapStarted = true;
    render();
    try {
      await ensureThree();
      initScene();
    } catch (err) {
      console.error('Failed to load Three.js massing viewport', err);
      const root = document.getElementById('zone-modeling-root');
      if (root) {
        root.innerHTML = `
          <div class="card">
            <div class="empty">
              <div class="empty-title">Three.js failed to load</div>
              <div class="empty-sub">The 3D viewport could not be initialized. Check network access to the Three.js CDN.</div>
            </div>
          </div>
        `;
      }
    }
  }

  function getState() {
    return JSON.parse(JSON.stringify(state()));
  }

  function getSummaryData() {
    return getMetrics();
  }

  function getSummaryHtml() {
    const m = getMetrics();
    return `
      <div class="card zone-modeling-panel mb-16">
        <div class="zone-modeling-panel-head">
          <div>
            <div class="zone-modeling-panel-title">Massing summary</div>
            <div class="zone-modeling-panel-sub">Drawn loop, extrusion settings, and cost estimate.</div>
          </div>
          <span class="badge badge-blue">${m.extrusion ? 'Ready' : 'Draft'}</span>
        </div>
        <div class="zone-kpi-grid">
          <div class="zone-kpi"><div class="v">${formatArea(m.footprintArea)}</div><div class="l">Footprint area</div></div>
          <div class="zone-kpi"><div class="v">${m.perimeter.toFixed(1)} m</div><div class="l">Perimeter</div></div>
          <div class="zone-kpi"><div class="v">${m.height ? `${m.height.toFixed(1)} m` : '—'}</div><div class="l">Extruded height</div></div>
          <div class="zone-kpi"><div class="v">${formatCurrency(m.totalCost)}</div><div class="l">Facade cost</div></div>
        </div>
      </div>
    `;
  }

  function updateSceneIfReady() {
    if (!initialized) return;
    updateScene();
  }

  function syncFromConfig() {
    render();
    updateSceneIfReady();
  }

  function init() {
    bootstrap();
  }

  window.ZoneMassing = {
    init,
    render,
    reset: resetModel,
    getState,
    getSummaryData,
    getSummaryHtml,
    syncFromConfig,
    setMode: setModeAndRefresh
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();


