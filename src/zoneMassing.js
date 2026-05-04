(function () {
  const DEFAULTS = {
    loops: [],
    points: [],
    closed: false,
    selected: true,
    mode: '2d',
    drawTool: 'polyline',
    rectStart: null,
    extrusion: null,
    activeFunction: null,
    paintZone: null,
    loopPaints: {},
    facePaints: {},
    faceMergedRegions: {},
    loopOffsets: {},
    loopExtrusions: {},
    meshifyPending: null,
    meshifyInput: {
      rows: 3,
      cols: 4
    },
    faceGrids: {},
    selectedPaintFace: null,
    selectedPaintFaces: [],
    selectedLoopIndices: [],
    selectedLoopIdx: null,
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
  let mouseDown = null;
  let gizmoDrag = null; // { axis, loopIdx, prevMouse, origin }
  let paintHoverFace = null;
  const HISTORY_LIMIT = 80;
  const historyStack = [];

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
    footprintMeshGroup: null,
    paintFaceGroup: null,
    gizmoGroup: null,
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
    if (s.rectStart && (typeof s.rectStart.x !== 'number' || typeof s.rectStart.y !== 'number')) s.rectStart = null;
    if (typeof s.activeFunction !== 'string' && s.activeFunction !== null) s.activeFunction = null;
    if (typeof s.paintZone !== 'string' && s.paintZone !== null) s.paintZone = null;
    if (!s.loopPaints || typeof s.loopPaints !== 'object' || Array.isArray(s.loopPaints)) s.loopPaints = {};
    if (!s.facePaints || typeof s.facePaints !== 'object' || Array.isArray(s.facePaints)) s.facePaints = {};
    if (!s.faceMergedRegions || typeof s.faceMergedRegions !== 'object' || Array.isArray(s.faceMergedRegions)) s.faceMergedRegions = {};
    if (!s.loopOffsets || typeof s.loopOffsets !== 'object' || Array.isArray(s.loopOffsets)) s.loopOffsets = {};
    if (!s.loopExtrusions || typeof s.loopExtrusions !== 'object' || Array.isArray(s.loopExtrusions)) s.loopExtrusions = {};
    if (!s.meshifyPending || typeof s.meshifyPending !== 'object' || Array.isArray(s.meshifyPending)) s.meshifyPending = null;
    if (s.meshifyPending) {
      s.meshifyPending.rows = clamp(round(num(s.meshifyPending.rows, 3)), 1, 40);
      s.meshifyPending.cols = clamp(round(num(s.meshifyPending.cols, 4)), 1, 40);
    }
    if (!s.meshifyInput || typeof s.meshifyInput !== 'object' || Array.isArray(s.meshifyInput)) s.meshifyInput = { rows: 3, cols: 4 };
    s.meshifyInput.rows = clamp(round(num(s.meshifyInput.rows, 3)), 1, 40);
    s.meshifyInput.cols = clamp(round(num(s.meshifyInput.cols, 4)), 1, 40);
    if (!s.faceGrids || typeof s.faceGrids !== 'object' || Array.isArray(s.faceGrids)) s.faceGrids = {};
    if (s.selectedPaintFace && typeof s.selectedPaintFace !== 'object') s.selectedPaintFace = null;
    if (s.selectedPaintFace && (!Number.isInteger(s.selectedPaintFace.loopIdx) || typeof s.selectedPaintFace.faceKey !== 'string')) s.selectedPaintFace = null;
    if (!Array.isArray(s.selectedPaintFaces)) {
      s.selectedPaintFaces = s.selectedPaintFace ? [s.selectedPaintFace] : [];
    }
    s.selectedPaintFaces = s.selectedPaintFaces
      .filter(face => face && Number.isInteger(face.loopIdx) && typeof face.faceKey === 'string')
      .map(face => ({
        loopIdx: face.loopIdx,
        faceKey: face.faceKey,
        facePath: face.facePath || face.faceKey,
        faceType: face.faceType || 'side',
        edgeIdx: Number.isInteger(face.edgeIdx) ? face.edgeIdx : null,
        faceLabel: face.faceLabel || '',
        row: Number.isInteger(face.row) ? face.row : null,
        col: Number.isInteger(face.col) ? face.col : null,
        rows: Number.isInteger(face.rows) ? face.rows : null,
        cols: Number.isInteger(face.cols) ? face.cols : null
      }));
    if (!s.selectedPaintFaces.length && s.selectedPaintFace) s.selectedPaintFaces = [s.selectedPaintFace];
    if (!s.selectedPaintFace && s.selectedPaintFaces.length) s.selectedPaintFace = s.selectedPaintFaces[0];
    if (!Array.isArray(s.selectedLoopIndices)) {
      if (typeof s.selectedLoopIdx === 'number') s.selectedLoopIndices = [s.selectedLoopIdx];
      else s.selectedLoopIndices = [];
    }
    if (!s.extrudeInput || typeof s.extrudeInput !== 'object') s.extrudeInput = { ...DEFAULTS.extrudeInput };
    s.extrudeInput.floors = clamp(round(num(s.extrudeInput.floors, DEFAULTS.extrudeInput.floors)), 1, 120);
    s.extrudeInput.typicalFloorHeight = clamp(num(s.extrudeInput.typicalFloorHeight, DEFAULTS.extrudeInput.typicalFloorHeight), 2.4, 6.0);
    s.loops = s.loops
      .map(loop => Array.isArray(loop) ? loop : [])
      .map(loop => loop
        .map(p => ({
          x: clamp(num(p.x, 0), -WORLD_HALF, WORLD_HALF),
          y: clamp(num(Number.isFinite(p.y) ? p.y : p.z, 0), -WORLD_HALF, WORLD_HALF)
        }))
        .filter(p => Number.isFinite(p.x) && Number.isFinite(p.y)))
      .filter(loop => loop.length >= 3);
    s.points = s.points
      .map(p => ({
        x: clamp(num(p.x, 0), -WORLD_HALF, WORLD_HALF),
        y: clamp(num(Number.isFinite(p.y) ? p.y : p.z, 0), -WORLD_HALF, WORLD_HALF)
      }))
      .filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
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
    s.selectedLoopIndices = s.selectedLoopIndices
      .map(v => Number(v))
      .filter(v => Number.isInteger(v) && v >= 0 && v < s.loops.length);
    s.selectedLoopIndices = Array.from(new Set(s.selectedLoopIndices)).sort((a, b) => a - b);
    s.selectedLoopIdx = s.selectedLoopIndices.length ? s.selectedLoopIndices[0] : null;
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
      sum += a.x * b.y - b.x * a.y;
    }
    return Math.abs(sum) / 2;
  }

  function polygonPerimeter(points) {
    if (!points || points.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      total += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return total;
  }

  function centroid(points) {
    if (!points || !points.length) return { x: 0, y: 0 };
    let x = 0;
    let y = 0;
    points.forEach(p => { x += p.x; y += p.y; });
    return { x: x / points.length, y: y / points.length };
  }

  function cloneValue(value) {
    if (typeof structuredClone === 'function') return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function snapshotViewportState() {
    const snapshot = {
      currentView: app.currentView || 'top',
      camera: null,
      controlsTarget: null,
      controlsEnabled: null
    };
    if (app.camera) {
      snapshot.camera = {
        position: app.camera.position.clone().toArray(),
        up: app.camera.up.clone().toArray()
      };
    }
    if (app.controls?.target) {
      snapshot.controlsTarget = app.controls.target.clone().toArray();
      snapshot.controlsEnabled = app.controls.enabled;
    }
    return snapshot;
  }

  function applyViewportState(snapshot) {
    if (!snapshot) return;
    app.currentView = snapshot.currentView || app.currentView || 'top';
    if (app.camera && snapshot.camera) {
      const [px = 0, py = 0, pz = 0] = snapshot.camera.position || [];
      const [ux = 0, uy = 0, uz = 1] = snapshot.camera.up || [];
      app.camera.position.set(px, py, pz);
      app.camera.up.set(ux, uy, uz);
      app.camera.updateProjectionMatrix?.();
    }
    if (app.controls) {
      if (snapshot.controlsTarget) {
        const [tx = 0, ty = 0, tz = 0] = snapshot.controlsTarget;
        app.controls.target.set(tx, ty, tz);
      }
      if (typeof snapshot.controlsEnabled === 'boolean') {
        app.controls.enabled = snapshot.controlsEnabled;
      }
      app.controls.update();
    }
  }

  function pushHistoryState() {
    historyStack.push({
      massing: cloneValue(getState()),
      viewport: snapshotViewportState()
    });
    if (historyStack.length > HISTORY_LIMIT) historyStack.shift();
  }

  function isEditableTarget(target) {
    return !!target && (
      target.isContentEditable ||
      ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
    );
  }

  function undoHistory() {
    const snapshot = historyStack.pop();
    if (!snapshot) return false;
    getCfg().massing = cloneValue(snapshot.massing);
    applyViewportState(snapshot.viewport);
    render();
    updateSceneIfReady();
    updateMode();
    if (typeof window.notify === 'function') window.notify('Undid last modeling action');
    return true;
  }

  function handleModelUndoShortcut(event) {
    const key = (event.key || '').toLowerCase();
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && key === 'z') {
      if (isEditableTarget(event.target)) return false;
      const configuratorPage = document.getElementById('page-configurator');
      if (configuratorPage && configuratorPage.classList.contains('page-hidden')) return false;
      const root = document.getElementById('zone-modeling-root');
      const canvas = app.renderer?.domElement || null;
      const active = document.activeElement;
      const inModelingContext =
        !!root && (
          root.contains(event.target) ||
          root.contains(active) ||
          canvas === event.target ||
          canvas === active
        );
      if (!inModelingContext) return false;
      event.preventDefault();
      event.stopPropagation();
      return undoHistory();
    }
    return false;
  }

  // Z is negated so that after ExtrudeGeometry + rotateX(-PI/2), world Z matches the footprint outline.
  // ExtrudeGeometry places shape in local XY, extrudes along +Z; rotateX(-PI/2) maps local Y → -worldZ,
  // so negating Z here gives the correct world position: (px, 0, pz).
  function getFootprintShape(points) {
    const shape = new THREE.Shape();
    if (!points || points.length < 3) return shape;
    // Negate Z so the rotated extrude lands in the same world X/Z positions as the footprint outline.
    shape.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
    }
    shape.lineTo(points[0].x, points[0].y);
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
    const extrData = (s.selectedLoopIdx !== null && s.loopExtrusions?.[s.selectedLoopIdx])
      || s.extrusion
      || (s.loopExtrusions && Object.values(s.loopExtrusions)[0])
      || null;
    const floors = extrData?.floors || 0;
    const typicalFloorHeight = extrData?.typicalFloorHeight || 0;
    const height = extrData?.height || (floors * typicalFloorHeight);
    const facadeArea = perimeter && height ? perimeter * height : 0;
    const volume = footprintArea && height ? footprintArea * height : 0;
    const totalCost = facadeArea * getBudgetRate();
    const formFactor = volume ? facadeArea / volume : 0;
    const slenderness = footprintArea ? height / Math.sqrt(footprintArea) : 0;
    const hasExtrusion = !!s.extrusion || (s.loopExtrusions && Object.keys(s.loopExtrusions).length > 0);
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
      selectedZones: getZoneLabels(),
      extrusion: hasExtrusion ? (s.extrusion || true) : null
    };
  }

  function resetModel() {
    pushHistoryState();
    getCfg().massing = JSON.parse(JSON.stringify(DEFAULTS));
    render();
    updateScene();
  }

  function setMode(mode) {
    pushHistoryState();
    const s = state();
    s.mode = mode;
    s.rectStart = null;
    if (mode !== 'paint') setPaintHoverFace(null);
    if (mode === '2d') {
      s.activeFunction = 'draw';
      render();
      setView('top', true);
    } else if (mode === '3d') {
      s.activeFunction = 'extrude';
      render();
    } else if (mode === 'paint') {
      s.activeFunction = 'paint-select';
      render();
    } else {
      s.activeFunction = null;
      render();
    }
    updateMode();
  }

  function setDrawTool(tool) {
    pushHistoryState();
    const s = state();
    s.drawTool = tool === 'rectangle' ? 'rectangle' : 'polyline';
    s.rectStart = null;
    if (s.mode !== '2d') { s.mode = '2d'; s.activeFunction = 'draw'; }
    render();
    setView('top', true);
    updateMode();
  }

  function addPoint(point) {
    pushHistoryState();
    const s = state();
    s.points.push(point);
    s.selected = true;
    s.extrusion = null;
    s.rectStart = null;
    render();
    updateScene();
  }

  function setRectangleStart(point) {
    pushHistoryState();
    const s = state();
    s.rectStart = { x: point.x, y: point.y };
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
    const minY = Math.min(start.y, point.y);
    const maxY = Math.max(start.y, point.y);
    if (Math.abs(maxX - minX) < 0.5 || Math.abs(maxY - minY) < 0.5) return;
    pushHistoryState();
    s.loops.push([
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY }
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
    if (!s.points.length && !s.rectStart) return;
    pushHistoryState();
    if (s.points.length) s.points.pop();
    else if (s.rectStart) s.rectStart = null;
    s.extrusion = null;
    render();
    updateScene();
  }

  function closeLoop() {
    const s = state();
    if (s.points.length < 3) return;
    pushHistoryState();
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
    pushHistoryState();
    const floors = clamp(round(num(s.extrudeInput.floors, DEFAULTS.extrudeInput.floors)), 1, 120);
    const typicalFloorHeight = clamp(num(s.extrudeInput.typicalFloorHeight, DEFAULTS.extrudeInput.typicalFloorHeight), 2.4, 6.0);
    const extrData = { floors, typicalFloorHeight, height: floors * typicalFloorHeight };
    if (!s.loopExtrusions) s.loopExtrusions = {};
    const selected = getSelectedLoopIndices(s);
    if (selected.length) {
      selected.forEach(idx => { if (s.loops[idx]) s.loopExtrusions[idx] = extrData; });
    } else {
      s.loops.forEach((_, i) => { s.loopExtrusions[i] = extrData; });
    }
    s.extrusion = extrData;
    s.selected = true;
    render();
    updateScene();
    updateContinueButton();
  }

  function updateDialogField(field, value, shouldRender = false, inputEl = null) {
    const s = state();
    const raw = String(value ?? '');
    const notifyInvalid = () => {
      if (typeof window.notify === 'function') window.notify('Numbers only');
    };
    if (field === 'floors') {
      if (/[a-z]/i.test(raw)) notifyInvalid();
      const cleaned = raw.replace(/[^\d]/g, '');
      if (inputEl && inputEl.value !== cleaned) inputEl.value = cleaned;
      s.extrudeInput.floors = clamp(round(num(cleaned || s.extrudeInput.floors, s.extrudeInput.floors)), 1, 120);
    }
    if (field === 'typicalFloorHeight') {
      if (/[a-z]/i.test(raw)) notifyInvalid();
      const cleaned = raw.replace(/[^\d.]/g, '').replace(/^(\d*\.\d*).*$/, '$1');
      if (inputEl && inputEl.value !== cleaned) inputEl.value = cleaned;
      s.extrudeInput.typicalFloorHeight = clamp(num(cleaned || s.extrudeInput.typicalFloorHeight, s.extrudeInput.typicalFloorHeight), 2.4, 6.0);
    }
    if (field === 'meshify-rows') {
      if (/[a-z]/i.test(raw)) notifyInvalid();
      const cleaned = raw.replace(/[^\d]/g, '');
      if (inputEl && inputEl.value !== cleaned) inputEl.value = cleaned;
      s.meshifyInput.rows = clamp(round(num(cleaned || s.meshifyInput.rows, s.meshifyInput.rows)), 1, 40);
    }
    if (field === 'meshify-cols') {
      if (/[a-z]/i.test(raw)) notifyInvalid();
      const cleaned = raw.replace(/[^\d]/g, '');
      if (inputEl && inputEl.value !== cleaned) inputEl.value = cleaned;
      s.meshifyInput.cols = clamp(round(num(cleaned || s.meshifyInput.cols, s.meshifyInput.cols)), 1, 40);
    }
    if (field === 'meshify-rows' || field === 'meshify-cols') s.meshifyPending = { rows: s.meshifyInput.rows, cols: s.meshifyInput.cols };
    if (shouldRender) render();
  }

  function setFunction(fn) {
    pushHistoryState();
    state().activeFunction = fn;
    if (!String(fn || '').startsWith('paint')) setPaintHoverFace(null);
    if (!String(fn || '').startsWith('paint')) state().meshifyPending = null;
    render();
    updateScene();
    updateMode();
  }

  function setPaintZone(zone) {
    pushHistoryState();
    state().paintZone = zone;
    render();
  }

  function samePaintFace(a, b) {
    return !!a && !!b &&
      (a.facePath || a.faceKey) === (b.facePath || b.faceKey) &&
      a.loopIdx === b.loopIdx &&
      (a.row ?? null) === (b.row ?? null) &&
      (a.col ?? null) === (b.col ?? null) &&
      (a.rows ?? null) === (b.rows ?? null) &&
      (a.cols ?? null) === (b.cols ?? null);
  }

  function setPaintHoverFace(face) {
    if (face && paintHoverFace && samePaintFace(face, paintHoverFace)) return;
    if (!face && !paintHoverFace) return;
    paintHoverFace = face ? { ...face } : null;
    updateScene();
  }

  function meshifyFace() {
    pushHistoryState();
    const s = state();
    if (!s.meshifyInput || typeof s.meshifyInput !== 'object') s.meshifyInput = { rows: 3, cols: 4 };
    s.meshifyPending = { rows: s.meshifyInput.rows, cols: s.meshifyInput.cols };
    s.activeFunction = 'meshify';
    render();
    updateScene();
    updateMode();
  }

  function mergeSelectedFaces() {
    const s = state();
    const faces = Array.isArray(s.selectedPaintFaces) ? s.selectedPaintFaces.filter(face => face && Number.isInteger(face.loopIdx) && typeof face.faceKey === 'string') : [];
    if (faces.length < 2) {
      if (typeof window.notify === 'function') window.notify('Select at least 2 faces to merge');
      return false;
    }

    const first = faces[0];
    const loopIdx = first.loopIdx;
    const faceType = first.faceType || 'side';
    const basePath = getFaceParentPath(first.facePath || first.faceKey);
    const rows = first.rows;
    const cols = first.cols;
    const cells = [];

    for (const face of faces) {
      const facePath = face.facePath || face.faceKey;
      if (face.loopIdx !== loopIdx || (face.faceType || 'side') !== faceType) {
        if (typeof window.notify === 'function') window.notify('Merge needs faces from the same grid');
        return false;
      }
      if (getFaceParentPath(facePath) !== basePath) {
        if (typeof window.notify === 'function') window.notify('Merge needs a single rectangular block');
        return false;
      }
      if (!Number.isInteger(face.row) || !Number.isInteger(face.col) || !Number.isInteger(face.rows) || !Number.isInteger(face.cols)) {
        if (typeof window.notify === 'function') window.notify('Merge only works on meshified face cells');
        return false;
      }
      if (face.rows !== rows || face.cols !== cols) {
        if (typeof window.notify === 'function') window.notify('Merge needs cells from the same grid');
        return false;
      }
      cells.push({ row: face.row, col: face.col });
    }

    const minRow = Math.min(...cells.map(c => c.row));
    const maxRow = Math.max(...cells.map(c => c.row));
    const minCol = Math.min(...cells.map(c => c.col));
    const maxCol = Math.max(...cells.map(c => c.col));
    const rectRows = maxRow - minRow + 1;
    const rectCols = maxCol - minCol + 1;
    const expectedCount = rectRows * rectCols;
    const cellSet = new Set(cells.map(c => `${c.row}:${c.col}`));

    if (cellSet.size !== faces.length || faces.length !== expectedCount) {
      if (typeof window.notify === 'function') window.notify('Merge needs a rectangular selection');
      return false;
    }
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (!cellSet.has(`${r}:${c}`)) {
          if (typeof window.notify === 'function') window.notify('Merge needs a rectangular selection');
          return false;
        }
      }
    }

    const mergedPath = mergedFacePath(basePath, minRow, minCol, rectRows, rectCols);
    const mergedKey = mergedFaceKey(loopIdx, basePath, minRow, minCol, rectRows, rectCols);
    const existingRegions = getMergedRegions(loopIdx, basePath);
    const overlapsExisting = existingRegions.some(region =>
      !(maxRow < region.row || minRow >= region.row + region.rows || maxCol < region.col || minCol >= region.col + region.cols)
    );
    if (overlapsExisting) {
      if (typeof window.notify === 'function') window.notify('That area is already merged');
      return false;
    }

    const zoneList = faces
      .map(face => getPaintZoneForFace(face))
      .filter(Boolean);
    const commonZone = zoneList.length && zoneList.every(z => z === zoneList[0]) ? zoneList[0] : null;

    pushHistoryState();
    if (!s.faceMergedRegions[loopIdx]) s.faceMergedRegions[loopIdx] = {};
    if (!Array.isArray(s.faceMergedRegions[loopIdx][basePath])) s.faceMergedRegions[loopIdx][basePath] = [];
    s.faceMergedRegions[loopIdx][basePath].push({
      row: minRow,
      col: minCol,
      rows: rectRows,
      cols: rectCols,
      facePath: mergedPath,
      faceKey: mergedPath,
      parentPath: basePath
    });
    if (commonZone) {
      s.facePaints[mergedKey] = commonZone;
    }

    s.selectedPaintFaces = [{
      loopIdx,
      faceKey: mergedPath,
      facePath: mergedPath,
      faceType,
      edgeIdx: null,
      faceLabel: 'Merged face',
      row: minRow,
      col: minCol,
      rows: rectRows,
      cols: rectCols
    }];
    s.selectedPaintFace = s.selectedPaintFaces[0];
    s.meshifyPending = null;
    render();
    updateScene();
    updateMode();
    if (typeof window.notify === 'function') window.notify('Faces merged');
    return true;
  }

  function confirmMeshify() {
    const s = state();
    const faces = (Array.isArray(s.selectedPaintFaces) && s.selectedPaintFaces.length)
      ? s.selectedPaintFaces
      : ((s.selectedPaintFace || paintHoverFace) ? [s.selectedPaintFace || paintHoverFace] : []);
    const rows = s.meshifyInput?.rows ?? s.meshifyPending?.rows;
    const cols = s.meshifyInput?.cols ?? s.meshifyPending?.cols;
    if (!faces.length) return false;
    if (!Number.isFinite(rows) || !Number.isFinite(cols)) return false;
    pushHistoryState();
    let success = false;
    faces.forEach(face => {
      success = meshifySelectedFace(face, { rows, cols }) || success;
    });
    if (success) {
      s.meshifyPending = null;
      s.activeFunction = 'paint-select';
      render();
      updateScene();
      updateMode();
    }
    return success;
  }

  function cancelMeshify() {
    pushHistoryState();
    const s = state();
    s.meshifyPending = null;
    s.activeFunction = 'paint-select';
    render();
    updateScene();
    updateMode();
  }

  function clearPaints() {
    pushHistoryState();
    state().loopPaints = {};
    state().facePaints = {};
    state().faceGrids = {};
    state().faceMergedRegions = {};
    state().selectedPaintFace = null;
    state().selectedPaintFaces = [];
    state().meshifyPending = null;
    render();
    updateScene();
  }

  function cancelExtrude() {
    pushHistoryState();
    state().activeFunction = null;
    render();
  }

  function getSelectedLoopIndices(s = state()) {
    return Array.isArray(s.selectedLoopIndices) ? s.selectedLoopIndices.slice() : [];
  }

  function setSelectedLoopIndices(indices) {
    const s = state();
    s.selectedLoopIndices = Array.from(new Set((indices || [])
      .map(v => Number(v))
      .filter(v => Number.isInteger(v) && v >= 0 && v < s.loops.length))).sort((a, b) => a - b);
    s.selectedLoopIdx = s.selectedLoopIndices.length ? s.selectedLoopIndices[0] : null;
  }

  function clearSelection() {
    setSelectedLoopIndices([]);
  }

  function toggleLoopSelection(idx, additive = false) {
    pushHistoryState();
    const s = state();
    const current = getSelectedLoopIndices(s);
    if (!additive) {
      const next = (current.length === 1 && current[0] === idx) ? [] : [idx];
      setSelectedLoopIndices(next);
    } else {
      const set = new Set(current);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      setSelectedLoopIndices(Array.from(set));
    }
    render();
    updateScene();
  }

  function selectLoop(idx, additive = false) {
    toggleLoopSelection(idx, additive);
  }

  function deleteSelectedLoops() {
    const s = state();
    const selected = getSelectedLoopIndices(s).sort((a, b) => b - a);
    if (!selected.length) return;
    pushHistoryState();
    selected.forEach(idx => s.loops.splice(idx, 1));
    // Remap per-loop dictionaries
    const remap = (src) => {
      const out = {};
      const deleted = new Set(selected);
      Object.keys(src || {}).forEach(k => {
        const ki = parseInt(k, 10);
        if (deleted.has(ki)) return;
        const shift = selected.filter(d => d < ki).length;
        out[ki - shift] = src[k];
      });
      return out;
    };
    s.loopOffsets = remap(s.loopOffsets);
    s.loopExtrusions = remap(s.loopExtrusions);
    s.loopPaints = remap(s.loopPaints);
    s.facePaints = remapFacePaintState(s.facePaints, selected);
    s.faceGrids = remapFaceGridState(s.faceGrids, selected);
    if (s.selectedPaintFace && selected.includes(s.selectedPaintFace.loopIdx)) s.selectedPaintFace = null;
    if (Array.isArray(s.selectedPaintFaces)) {
      s.selectedPaintFaces = s.selectedPaintFaces.filter(face => !selected.includes(face.loopIdx));
      if (!s.selectedPaintFaces.length) s.selectedPaintFace = null;
    }
    setSelectedLoopIndices([]);
    s.extrusion = Object.values(s.loopExtrusions)[0] || null;
    render();
    updateScene();
  }

  function remapFacePaintState(src, deletedIndices) {
    const out = {};
    const deleted = new Set(deletedIndices || []);
    Object.entries(src || {}).forEach(([key, value]) => {
      const match = key.match(/^(\d+):(.+)$/);
      if (!match) return;
      const oldIdx = parseInt(match[1], 10);
      if (deleted.has(oldIdx)) return;
      const shift = deletedIndices.filter(d => d < oldIdx).length;
      out[`${oldIdx - shift}:${match[2]}`] = value;
    });
    return out;
  }

  function remapFaceGridState(src, deletedIndices) {
    const out = {};
    const deleted = new Set(deletedIndices || []);
    Object.entries(src || {}).forEach(([loopIdxStr, faces]) => {
      const oldIdx = parseInt(loopIdxStr, 10);
      if (!Number.isInteger(oldIdx) || deleted.has(oldIdx)) return;
      const shift = deletedIndices.filter(d => d < oldIdx).length;
      const newIdx = oldIdx - shift;
      out[newIdx] = { ...(faces || {}) };
    });
    return out;
  }

  function faceStateKey(loopIdx, faceKey) {
    return `${loopIdx}:${faceKey}`;
  }

  function faceGridKey(loopIdx, faceKey) {
    return `${loopIdx}:${faceKey}`;
  }

  function getFaceParentPath(facePath) {
    const parts = String(facePath || '').split('__').filter(Boolean);
    if (!parts.length) return '';
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join('__');
  }

  function isMergedFacePath(facePath) {
    return String(facePath || '').includes('__merge_');
  }

  function mergedFacePath(parentPath, row, col, rows, cols) {
    return `${parentPath}__merge_${row}_${col}_${rows}x${cols}`;
  }

  function mergedFaceKey(loopIdx, parentPath, row, col, rows, cols) {
    return `${loopIdx}:${mergedFacePath(parentPath, row, col, rows, cols)}`;
  }

  function getMergedRegions(loopIdx, parentPath) {
    const s = state();
    return s.faceMergedRegions?.[loopIdx]?.[parentPath] || [];
  }

  function findMergedRegion(loopIdx, parentPath, row, col) {
    return getMergedRegions(loopIdx, parentPath).find(region =>
      row >= region.row &&
      row < region.row + region.rows &&
      col >= region.col &&
      col < region.col + region.cols
    ) || null;
  }

  function getPaintZoneForFace(face) {
    const s = state();
    if (!face) return null;
    const facePath = face.facePath || face.faceKey;
    if (!facePath) return null;
    return s.facePaints?.[faceStateKey(face.loopIdx, facePath)]
      || (Number.isInteger(face.row) && Number.isInteger(face.col) ? s.facePaints?.[faceGridStateKey(face.loopIdx, facePath, face.row, face.col)] : null)
      || null;
  }

  function getMergedFaceRegionFrame(face) {
    return getFaceRegionFrame(face, face.facePath || face.faceKey)?.frame || null;
  }

  function setSelectedPaintFace(faceInfo) {
    setSelectedPaintFaces(faceInfo ? [faceInfo] : []);
  }

  function normalizePaintFace(faceInfo) {
    if (!faceInfo || !Number.isInteger(faceInfo.loopIdx) || typeof faceInfo.faceKey !== 'string') return null;
    return {
      loopIdx: faceInfo.loopIdx,
      faceKey: faceInfo.faceKey,
      facePath: faceInfo.facePath || faceInfo.faceKey,
      faceType: faceInfo.faceType || 'side',
      edgeIdx: Number.isInteger(faceInfo.edgeIdx) ? faceInfo.edgeIdx : null,
      faceLabel: faceInfo.faceLabel || '',
      row: Number.isInteger(faceInfo.row) ? faceInfo.row : null,
      col: Number.isInteger(faceInfo.col) ? faceInfo.col : null,
      rows: Number.isInteger(faceInfo.rows) ? faceInfo.rows : null,
      cols: Number.isInteger(faceInfo.cols) ? faceInfo.cols : null
    };
  }

  function samePaintFaceEntry(a, b) {
    return samePaintFace(a, b);
  }

  function setSelectedPaintFaces(faces, additive = false) {
    const s = state();
    const nextFaces = (Array.isArray(faces) ? faces : [faces])
      .map(normalizePaintFace)
      .filter(Boolean);
    if (additive) {
      const current = Array.isArray(s.selectedPaintFaces) ? s.selectedPaintFaces.slice() : [];
      nextFaces.forEach(face => {
        const idx = current.findIndex(existing => samePaintFaceEntry(existing, face));
        if (idx >= 0) current.splice(idx, 1);
        else current.push(face);
      });
      s.selectedPaintFaces = current;
    } else {
      s.selectedPaintFaces = nextFaces;
    }
    s.selectedPaintFace = s.selectedPaintFaces[0] || null;
  }

  function clearSelectedPaintFace() {
    const s = state();
    s.selectedPaintFace = null;
    s.selectedPaintFaces = [];
  }

  function selectPaintFace(faceInfo, additive = false) {
    if (!faceInfo) {
      if (!additive) clearSelectedPaintFace();
      return;
    }
    pushHistoryState();
    setSelectedPaintFaces(faceInfo, additive);
  }

  function deleteSelectedLoop() {
    deleteSelectedLoops();
  }

  function updateGizmo() {
    if (!app.gizmoGroup || !THREE) return;
    clearThreeObject(app.gizmoGroup);
    const s = state();
    const selected = getSelectedLoopIndices(s);
    if (!selected.length) {
      app.gizmoGroup.visible = false;
      return;
    }
    const centers = selected.map(idx => {
      const loop = s.loops[idx];
      if (!loop || loop.length < 3) return null;
      const c = centroid(loop);
      const offset = s.loopOffsets?.[idx] || { x: 0, y: 0, z: 0 };
      return new THREE.Vector3(c.x + offset.x, c.y + offset.y, offset.z);
    }).filter(Boolean);
    if (!centers.length) { app.gizmoGroup.visible = false; return; }
    const origin = centers.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / centers.length);
    const len = 28, headLen = 7, headWidth = 4;
    const hitRadius = 1.6;
    const hitMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.001, depthWrite: false });
    const makeHit = (axis, orient) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(hitRadius, hitRadius, len, 10, 1, true), hitMat.clone());
      mesh.position.copy(origin);
      if (orient === 'x') mesh.rotation.z = Math.PI / 2;
      if (orient === 'z') mesh.rotation.x = Math.PI / 2;
      mesh.userData.isGizmo = true;
      mesh.userData.gizmoAxis = axis;
      return mesh;
    };

    const xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, len, 0xff3333, headLen, headWidth);
    const yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, len, 0x22cc44, headLen, headWidth);
    const zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, len, 0x3366ff, headLen, headWidth);

    const tag = (helper, axis) => helper.traverse(child => {
      if (child.isMesh) {
        child.userData.isGizmo = true;
        child.userData.gizmoAxis = axis;
      }
    });
    tag(xArrow, 'x'); tag(yArrow, 'y'); tag(zArrow, 'z');

    app.gizmoGroup.add(xArrow, yArrow, zArrow, makeHit('x', 'x'), makeHit('y', 'y'), makeHit('z', 'z'));
    app.gizmoGroup.visible = true;
  }

  function pickGizmoAxis(event, canvas) {
    if (!app.raycaster || !app.camera || !app.gizmoGroup || !app.gizmoGroup.visible) return null;
    const rect = canvas.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);
    const meshes = [];
    app.gizmoGroup.traverse(c => { if (c.isMesh && c.userData.isGizmo) meshes.push(c); });
    const hits = app.raycaster.intersectObjects(meshes, false);
    return hits.length ? (hits[0].object.userData.gizmoAxis || null) : null;
  }

  function pickFootprint(event, canvas) {
    if (!app.raycaster || !app.camera || !app.footprintMeshGroup) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);
    const hits = app.raycaster.intersectObjects(app.footprintMeshGroup.children, false);
    if (!hits.length) return null;
    const loopIdx = hits[0].object.userData.loopIdx;
    return typeof loopIdx === 'number' ? loopIdx : null;
  }

  function pickSelectableLoop(event, canvas, s) {
    if (!app.raycaster || !app.camera) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);

    const candidates = [];
    if (s.mode === '2d') {
      if (app.footprintMeshGroup) candidates.push(...app.footprintMeshGroup.children);
    } else if (s.mode === '3d') {
      if (app.extrudedGroup) candidates.push(...app.extrudedGroup.children);
      if (app.footprintMeshGroup) candidates.push(...app.footprintMeshGroup.children);
    }

    if (!candidates.length) return null;
    const hits = app.raycaster.intersectObjects(candidates, false);
    if (!hits.length) return null;
    const loopIdx = hits[0].object.userData.loopIdx;
    return typeof loopIdx === 'number' ? loopIdx : null;
  }

  function pointInPolygon(point, polygon) {
    if (!polygon || polygon.length < 3) return false;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / ((yj - yi) || 1e-9) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function nearestLoopEdgeIndex(loop, point) {
    if (!Array.isArray(loop) || loop.length < 2) return 0;
    let bestIdx = 0;
    let bestDist = Infinity;
    loop.forEach((a, i) => {
      const b = loop[(i + 1) % loop.length];
      const abx = b.x - a.x;
      const aby = b.y - a.y;
      const apx = point.x - a.x;
      const apy = point.y - a.y;
      const denom = abx * abx + aby * aby || 1e-9;
      const t = clamp((apx * abx + apy * aby) / denom, 0, 1);
      const cx = a.x + abx * t;
      const cy = a.y + aby * t;
      const dist = Math.hypot(point.x - cx, point.y - cy);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    return bestIdx;
  }

  function faceKeyToLabel(faceKey) {
    if (faceKey === 'top') return 'Top';
    if (faceKey === 'bottom') return 'Bottom';
    if (faceKey.startsWith('side-')) return `Side ${parseInt(faceKey.split('-')[1], 10) + 1}`;
    return faceKey;
  }

  function getFaceInfoFromHit(mesh, hit) {
    const loopIdx = mesh?.userData?.loopIdx;
    if (!Number.isInteger(loopIdx)) return null;
    const s = state();
    const loop = s.loops[loopIdx];
    if (!loop || loop.length < 3) return null;
    const extrData = s.loopExtrusions?.[loopIdx];
    if (!extrData) return null;
    const localPoint = mesh.worldToLocal(hit.point.clone());
    const localNormal = hit.face?.normal ? hit.face.normal.clone() : new THREE.Vector3(0, 0, 1);
    const faceType = Math.abs(localNormal.z) > 0.75 ? (localNormal.z > 0 ? 'top' : 'bottom') : 'side';
    if (faceType === 'side') {
      const edgeIdx = nearestLoopEdgeIndex(loop, { x: localPoint.x, y: localPoint.y });
      const a = loop[edgeIdx];
      const b = loop[(edgeIdx + 1) % loop.length];
      const edgeLen = Math.hypot(b.x - a.x, b.y - a.y);
      return {
        loopIdx,
        faceType,
        edgeIdx,
        faceKey: `side-${edgeIdx}`,
        faceLabel: faceKeyToLabel(`side-${edgeIdx}`),
        edgeStart: a,
        edgeEnd: b,
        height: extrData.height,
        offset: s.loopOffsets?.[loopIdx] || { x: 0, y: 0, z: 0 },
        loop,
        edgeLen
      };
    }
    const faceKey = faceType;
    return {
      loopIdx,
      faceType,
      edgeIdx: null,
      faceKey,
      faceLabel: faceKeyToLabel(faceKey),
      height: extrData.height,
      offset: s.loopOffsets?.[loopIdx] || { x: 0, y: 0, z: 0 },
      loop
    };
  }

  function pickPaintFace(event, canvas) {
    if (!app.raycaster || !app.camera || !app.extrudedGroup) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);
    const overlayHits = app.paintFaceGroup ? app.raycaster.intersectObjects(app.paintFaceGroup.children, true) : [];
    if (overlayHits.length) {
      const obj = overlayHits[0].object;
      if (obj.userData && Number.isInteger(obj.userData.loopIdx) && typeof obj.userData.faceKey === 'string') {
        return {
          loopIdx: obj.userData.loopIdx,
          faceKey: obj.userData.faceKey,
          facePath: obj.userData.facePath || obj.userData.faceKey,
          faceType: obj.userData.faceType || 'side',
          faceLabel: obj.userData.faceLabel || faceKeyToLabel(obj.userData.faceKey),
          edgeIdx: Number.isInteger(obj.userData.edgeIdx) ? obj.userData.edgeIdx : null,
          row: Number.isInteger(obj.userData.row) ? obj.userData.row : null,
          col: Number.isInteger(obj.userData.col) ? obj.userData.col : null,
          rows: Number.isInteger(obj.userData.rows) ? obj.userData.rows : null,
          cols: Number.isInteger(obj.userData.cols) ? obj.userData.cols : null
        };
      }
    }
    const hits = app.raycaster.intersectObjects(app.extrudedGroup.children, false);
    if (!hits.length) return null;
    const hit = hits[0];
    return getFaceInfoFromHit(hit.object, hit);
  }

  function faceGridStateKey(loopIdx, faceKey, row, col) {
    return `${loopIdx}:${faceKey}:${row}:${col}`;
  }

  function parseFacePath(facePath) {
    const parts = String(facePath || '').split('__').filter(Boolean);
    if (!parts.length) return { baseFaceKey: '', segments: [] };
    const mergePartIndex = parts.findIndex(part => /^merge_\d+_\d+_\d+x\d+$/.test(part));
    let merge = null;
    const preParts = mergePartIndex >= 0 ? parts.slice(0, mergePartIndex) : parts;
    const postParts = mergePartIndex >= 0 ? parts.slice(mergePartIndex + 1) : [];
    if (mergePartIndex >= 0) {
      const [row, col, rows, cols] = parts[mergePartIndex]
        .replace(/^merge_/, '')
        .split(/[_x]/)
        .map(v => Number.parseInt(v, 10));
      if ([row, col, rows, cols].every(Number.isInteger)) merge = { row, col, rows, cols };
    }
    const parseGridSegments = arr => arr.map(seg => {
      const [rowStr, colStr] = String(seg).split('_');
      return {
        row: Number.parseInt(rowStr, 10),
        col: Number.parseInt(colStr, 10)
      };
    }).filter(seg => Number.isInteger(seg.row) && Number.isInteger(seg.col));
    const preSegments = parseGridSegments(preParts.slice(1));
    const postSegments = parseGridSegments(postParts);
    return {
      baseFaceKey: preParts[0],
      segments: preSegments,
      preSegments,
      postSegments,
      merge
    };
  }

  function makeFacePath(parentPath, row, col) {
    return `${parentPath}__${row}_${col}`;
  }

  function getFaceRootFrame(face) {
    const s = state();
    const loop = s.loops[face.loopIdx];
    if (!loop || loop.length < 3) return null;
    const extrData = s.loopExtrusions?.[face.loopIdx];
    if (!extrData) return null;
    const offset = s.loopOffsets?.[face.loopIdx] || { x: 0, y: 0, z: 0 };

    if (face.faceType === 'side') {
      const a = loop[face.edgeIdx];
      const b = loop[(face.edgeIdx + 1) % loop.length];
      if (!a || !b) return null;
      const edgeVec = new THREE.Vector3(b.x - a.x, b.y - a.y, 0);
      const width = edgeVec.length();
      if (width < 1e-6) return null;
      return {
        faceType: 'side',
        origin: new THREE.Vector3(offset.x + a.x, offset.y + a.y, offset.z),
        uVec: edgeVec,
        vVec: new THREE.Vector3(0, 0, extrData.height),
        width,
        height: extrData.height
      };
    }

    const bounds = getLoopBounds(loop);
    const width = bounds.maxX - bounds.minX;
    const height = bounds.maxY - bounds.minY;
    if (width < 1e-6 || height < 1e-6) return null;
    return {
      faceType: face.faceType,
      origin: new THREE.Vector3(offset.x + bounds.minX, offset.y + bounds.minY, offset.z + (face.faceType === 'top' ? extrData.height : 0)),
      uVec: new THREE.Vector3(width, 0, 0),
      vVec: new THREE.Vector3(0, height, 0),
      width,
      height
    };
  }

  function splitFaceFrame(frame, row, col, rows, cols) {
    if (!frame || !rows || !cols) return null;
    const cellW = frame.width / cols;
    const cellH = frame.height / rows;
    if (!Number.isFinite(cellW) || !Number.isFinite(cellH) || cellW <= 0 || cellH <= 0) return null;
    const uStep = frame.uVec.clone().multiplyScalar(1 / cols);
    const vStep = frame.vVec.clone().multiplyScalar(1 / rows);
    const origin = frame.origin.clone()
      .add(uStep.clone().multiplyScalar(col))
      .add(vStep.clone().multiplyScalar(row));
    return {
      faceType: frame.faceType,
      origin,
      uVec: uStep,
      vVec: vStep,
      width: cellW,
      height: cellH
    };
  }

  function getFaceFrameForPath(face, facePath = null) {
    const s = state();
    const parsed = parseFacePath(facePath || face.faceKey);
    if (!parsed.baseFaceKey) return null;
    const rootFace = {
      ...face,
      faceKey: parsed.baseFaceKey,
      facePath: parsed.baseFaceKey
    };
    let frame = getFaceRootFrame(rootFace);
    if (!frame) return null;
    let currentPath = parsed.baseFaceKey;
    for (const segment of parsed.preSegments || parsed.segments || []) {
      const grid = s.faceGrids?.[face.loopIdx]?.[currentPath];
      if (!grid) return null;
      frame = splitFaceFrame(frame, segment.row, segment.col, grid.rows, grid.cols);
      if (!frame) return null;
      currentPath = makeFacePath(currentPath, segment.row, segment.col);
    }
    if (parsed.merge) {
      const grid = s.faceGrids?.[face.loopIdx]?.[currentPath];
      if (!grid) return null;
      const mergedTopLeft = splitFaceFrame(frame, parsed.merge.row, parsed.merge.col, grid.rows, grid.cols);
      if (!mergedTopLeft) return null;
      frame = {
        faceType: mergedTopLeft.faceType,
        origin: mergedTopLeft.origin.clone(),
        uVec: mergedTopLeft.uVec.clone().multiplyScalar(parsed.merge.cols),
        vVec: mergedTopLeft.vVec.clone().multiplyScalar(parsed.merge.rows),
        width: mergedTopLeft.width * parsed.merge.cols,
        height: mergedTopLeft.height * parsed.merge.rows
      };
      currentPath = `${currentPath}__merge_${parsed.merge.row}_${parsed.merge.col}_${parsed.merge.rows}x${parsed.merge.cols}`;
    }
    for (const segment of parsed.postSegments || []) {
      const grid = s.faceGrids?.[face.loopIdx]?.[currentPath];
      if (!grid) return null;
      frame = splitFaceFrame(frame, segment.row, segment.col, grid.rows, grid.cols);
      if (!frame) return null;
      currentPath = makeFacePath(currentPath, segment.row, segment.col);
    }
    return { frame, facePath: currentPath || parsed.baseFaceKey };
  }

  function getLoopBounds(loop) {
    const xs = loop.map(p => p.x);
    const ys = loop.map(p => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }

  function makeFaceMaterial(zoneKey, alpha = 0.95) {
    const color = (zoneKey && ZONE_COLORS[zoneKey]) ? ZONE_COLORS[zoneKey] : DEFAULT_MESH_COLOR;
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.82,
      metalness: 0.0,
      transparent: true,
      opacity: alpha,
      side: THREE.DoubleSide
    });
  }

  function buildFaceGeometryFromFrame(frame) {
    if (!frame) return null;
    const geometry = new THREE.PlaneGeometry(frame.width, frame.height, 1, 1);
    const xAxis = frame.uVec.clone().normalize();
    const yAxis = frame.vVec.clone().normalize();
    const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis);
    if (zAxis.lengthSq() < 1e-8) zAxis.set(0, 0, 1);
    else zAxis.normalize();
    const center = frame.origin.clone()
      .add(frame.uVec.clone().multiplyScalar(0.5))
      .add(frame.vVec.clone().multiplyScalar(0.5));
    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    basis.setPosition(center);
    geometry.applyMatrix4(basis);
    return geometry;
  }

  function buildFaceBorderLines(frame, color = 0xd9d0cf, opacity = 0.42) {
    const plane = new THREE.PlaneGeometry(frame.width, frame.height, 1, 1);
    const edges = new THREE.EdgesGeometry(plane);
    plane.dispose();
    const xAxis = frame.uVec.clone().normalize();
    const yAxis = frame.vVec.clone().normalize();
    const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis);
    if (zAxis.lengthSq() < 1e-8) zAxis.set(0, 0, 1);
    else zAxis.normalize();
    const center = frame.origin.clone()
      .add(frame.uVec.clone().multiplyScalar(0.5))
      .add(frame.vVec.clone().multiplyScalar(0.5));
    const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
    basis.setPosition(center);
    edges.applyMatrix4(basis);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      depthTest: false
    });
    const lines = new THREE.LineSegments(edges, material);
    lines.raycast = () => {};
    lines.renderOrder = 5;
    return lines;
  }

  function getFaceRegionFrame(face, facePath = null) {
    const resolved = getFaceFrameForPath(face, facePath);
    return resolved ? { frame: resolved.frame, facePath: resolved.facePath } : null;
  }

  function buildFacePatchMesh(face, row, col, rows, cols, zoneKey, options = {}) {
    const s = state();
    const loop = s.loops[face.loopIdx];
    if (!loop || loop.length < 3) return null;
    const extrData = s.loopExtrusions?.[face.loopIdx];
    if (!extrData) return null;
    const alpha = options.alpha ?? 0.9;
    const material = makeFaceMaterial(zoneKey, alpha);
    let geometry = null;
    const mesh = new THREE.Mesh();
    mesh.material = material;
    const facePath = options.facePath || face.facePath || face.faceKey;
    mesh.userData = {
      loopIdx: face.loopIdx,
      faceKey: facePath,
      facePath,
      faceType: face.faceType,
      faceLabel: face.faceLabel,
      edgeIdx: Number.isInteger(face.edgeIdx) ? face.edgeIdx : null,
      row,
      col,
      rows,
      cols
    };

    const shouldUseFrame = !!options.frame || String(facePath || '').includes('__') || rows > 1 || cols > 1;
    const frame = options.frame || (shouldUseFrame ? getFaceRegionFrame(face, facePath)?.frame || null : null);
    if (frame) {
      geometry = buildFaceGeometryFromFrame(frame);
    } else {
      const offset = s.loopOffsets?.[face.loopIdx] || { x: 0, y: 0, z: 0 };
      if (face.faceType === 'side') {
        const a = loop[face.edgeIdx];
        const b = loop[(face.edgeIdx + 1) % loop.length];
        const edgeVec = new THREE.Vector3(b.x - a.x, b.y - a.y, 0);
        const len = edgeVec.length();
        if (len < 1e-6) return null;
        const xAxis = edgeVec.clone().normalize();
        const yAxis = new THREE.Vector3(0, 0, 1);
        const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
        const cellW = len / cols;
        const cellH = extrData.height / rows;
        const localX = -len / 2 + (col + 0.5) * cellW;
        const localY = -extrData.height / 2 + (row + 0.5) * cellH;
        geometry = new THREE.PlaneGeometry(cellW, cellH, 1, 1);
        const center = new THREE.Vector3(
          offset.x + ((a.x + b.x) / 2) + xAxis.x * localX,
          offset.y + ((a.y + b.y) / 2) + xAxis.y * localX,
          offset.z + (extrData.height / 2) + localY
        );
        const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
        basis.setPosition(center);
        geometry.applyMatrix4(basis);
      } else {
        const bounds = getLoopBounds(loop);
        const cellW = (bounds.maxX - bounds.minX) / cols;
        const cellH = (bounds.maxY - bounds.minY) / rows;
        const localX = bounds.minX + (col + 0.5) * cellW;
        const localY = bounds.minY + (row + 0.5) * cellH;
        if (!pointInPolygon({ x: localX, y: localY }, loop)) return null;
        geometry = new THREE.PlaneGeometry(cellW, cellH, 1, 1);
        geometry.rotateX(face.faceType === 'bottom' ? Math.PI : 0);
        geometry.translate(
          offset.x + localX,
          offset.y + localY,
          offset.z + (face.faceType === 'top' ? extrData.height : 0)
        );
      }
    }

    mesh.geometry = geometry;
    mesh.renderOrder = 4;
    if (options.showBoundary !== false && frame) {
      const border = buildFaceBorderLines(frame, options.boundaryColor || 0xc1b6aa, options.boundaryOpacity ?? 0.55);
      if (border) mesh.add(border);
    }
    return mesh;
  }

  function buildSelectableFaceMesh(face) {
    const s = state();
    const loop = s.loops[face.loopIdx];
    if (!loop || loop.length < 3) return null;
    const extrData = s.loopExtrusions?.[face.loopIdx];
    if (!extrData) return null;
    const offset = s.loopOffsets?.[face.loopIdx] || { x: 0, y: 0, z: 0 };
    let geometry = null;
    const mesh = new THREE.Mesh();
    mesh.material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.001,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    mesh.userData = {
      loopIdx: face.loopIdx,
      faceKey: face.faceKey,
      facePath: face.facePath || face.faceKey,
      faceType: face.faceType,
      faceLabel: face.faceLabel,
      edgeIdx: Number.isInteger(face.edgeIdx) ? face.edgeIdx : null
    };

    if (face.faceType === 'side') {
      const a = loop[face.edgeIdx];
      const b = loop[(face.edgeIdx + 1) % loop.length];
      const edgeVec = new THREE.Vector3(b.x - a.x, b.y - a.y, 0);
      const len = edgeVec.length();
      if (len < 1e-6) return null;
      const xAxis = edgeVec.clone().normalize();
      const yAxis = new THREE.Vector3(0, 0, 1);
      const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
      geometry = new THREE.PlaneGeometry(len, extrData.height, 1, 1);
      const center = new THREE.Vector3(
        offset.x + ((a.x + b.x) / 2),
        offset.y + ((a.y + b.y) / 2),
        offset.z + extrData.height / 2
      );
      const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
      basis.setPosition(center);
      geometry.applyMatrix4(basis);
    } else {
      geometry = new THREE.ShapeGeometry(getFootprintShape(loop));
      geometry.translate(offset.x, offset.y, offset.z + (face.faceType === 'top' ? extrData.height : 0));
    }

    mesh.geometry = geometry;
    return mesh;
  }

  function buildSelectableFaceRegionMesh(face, row, col, rows, cols, frame) {
    const s = state();
    const loop = s.loops[face.loopIdx];
    if (!loop || loop.length < 3) return null;
    const extrData = s.loopExtrusions?.[face.loopIdx];
    if (!extrData) return null;
    const offset = s.loopOffsets?.[face.loopIdx] || { x: 0, y: 0, z: 0 };
    const mesh = new THREE.Mesh();
    mesh.material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.001,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    mesh.userData = {
      loopIdx: face.loopIdx,
      faceKey: face.faceKey,
      facePath: face.facePath || face.faceKey,
      faceType: face.faceType,
      faceLabel: face.faceLabel,
      edgeIdx: Number.isInteger(face.edgeIdx) ? face.edgeIdx : null,
      row,
      col,
      rows,
      cols
    };

    const resolvedFrame = frame || getFaceRegionFrame(face, face.facePath || face.faceKey)?.frame || null;
    if (resolvedFrame) {
      mesh.geometry = buildFaceGeometryFromFrame(resolvedFrame);
      return mesh;
    }

    let geometry = null;
    if (face.faceType === 'side') {
      const a = loop[face.edgeIdx];
      const b = loop[(face.edgeIdx + 1) % loop.length];
      const edgeVec = new THREE.Vector3(b.x - a.x, b.y - a.y, 0);
      const len = edgeVec.length();
      if (len < 1e-6) return null;
      const xAxis = edgeVec.clone().normalize();
      const yAxis = new THREE.Vector3(0, 0, 1);
      const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
      const cellW = len / cols;
      const cellH = extrData.height / rows;
      const localX = -len / 2 + (col + 0.5) * cellW;
      const localY = -extrData.height / 2 + (row + 0.5) * cellH;
      geometry = new THREE.PlaneGeometry(cellW, cellH, 1, 1);
      const center = new THREE.Vector3(
        offset.x + ((a.x + b.x) / 2) + xAxis.x * localX,
        offset.y + ((a.y + b.y) / 2) + xAxis.y * localX,
        offset.z + (extrData.height / 2) + localY
      );
      const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
      basis.setPosition(center);
      geometry.applyMatrix4(basis);
    } else {
      const bounds = getLoopBounds(loop);
      const cellW = (bounds.maxX - bounds.minX) / cols;
      const cellH = (bounds.maxY - bounds.minY) / rows;
      const localX = bounds.minX + (col + 0.5) * cellW;
      const localY = bounds.minY + (row + 0.5) * cellH;
      if (!pointInPolygon({ x: localX, y: localY }, loop)) return null;
      geometry = new THREE.PlaneGeometry(cellW, cellH, 1, 1);
      geometry.rotateX(face.faceType === 'bottom' ? Math.PI : 0);
      geometry.translate(
        offset.x + localX,
        offset.y + localY,
        offset.z + (face.faceType === 'top' ? extrData.height : 0)
      );
    }

    mesh.geometry = geometry;
    return mesh;
  }

  function buildFaceHighlightMesh(face, options = {}) {
    const s = state();
    const loop = s.loops[face.loopIdx];
    if (!loop || loop.length < 3) return null;
    const extrData = s.loopExtrusions?.[face.loopIdx];
    if (!extrData) return null;
    const color = options.color || 0x4a7cff;
    const mergedFace = isMergedFacePath(face.facePath || face.faceKey) || (Number.isInteger(face.rows) && Number.isInteger(face.cols) && (face.rows > 1 || face.cols > 1));
    const opacity = mergedFace ? Math.max(options.opacity ?? 0.22, 0.3) : (options.opacity ?? 0.22);
    const mesh = new THREE.Mesh();
    mesh.material = new THREE.MeshStandardMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    mesh.material.depthTest = false;
    mesh.material.polygonOffset = true;
    mesh.material.polygonOffsetFactor = -4;
    mesh.material.polygonOffsetUnits = -4;
    mesh.raycast = () => {};
    const facePath = face.facePath || face.faceKey;
    if (mergedFace) {
      const resolved = getMergedFaceRegionFrame(face);
      if (!resolved) return null;
      mesh.geometry = buildFaceGeometryFromFrame(resolved);
      mesh.add(buildFaceBorderLines(resolved, color, Math.min(0.85, opacity + 0.12)));
      mesh.renderOrder = 20;
      return mesh;
    }
    if (facePath && facePath.includes('__')) {
      const resolved = getFaceRegionFrame(face, facePath);
      if (!resolved) return null;
      mesh.geometry = buildFaceGeometryFromFrame(resolved.frame);
      mesh.add(buildFaceBorderLines(resolved.frame, color, Math.min(0.8, opacity + 0.18)));
      mesh.renderOrder = 20;
      return mesh;
    }
    if (face.faceType === 'side') {
      const a = loop[face.edgeIdx];
      const b = loop[(face.edgeIdx + 1) % loop.length];
      const edgeVec = new THREE.Vector3(b.x - a.x, b.y - a.y, 0);
      const len = edgeVec.length();
      if (len < 1e-6) return null;
      const xAxis = edgeVec.clone().normalize();
      const yAxis = new THREE.Vector3(0, 0, 1);
      const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize();
      const geometry = new THREE.PlaneGeometry(len, extrData.height, 1, 1);
      const offset = s.loopOffsets?.[face.loopIdx] || { x: 0, y: 0, z: 0 };
      const center = new THREE.Vector3(
        offset.x + ((a.x + b.x) / 2),
        offset.y + ((a.y + b.y) / 2),
        offset.z + extrData.height / 2
      );
      const basis = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
      basis.setPosition(center);
      geometry.applyMatrix4(basis);
      mesh.geometry = geometry;
      mesh.renderOrder = 20;
      return mesh;
    }
    const offset = s.loopOffsets?.[face.loopIdx] || { x: 0, y: 0, z: 0 };
    const geometry = new THREE.ShapeGeometry(getFootprintShape(loop));
    geometry.translate(offset.x, offset.y, offset.z + (face.faceType === 'top' ? extrData.height : 0));
    mesh.geometry = geometry;
    mesh.renderOrder = 20;
    return mesh;
  }

  function meshifySelectedFace(faceOverride = null, gridOverride = null) {
    const s = state();
    const face = faceOverride || s.selectedPaintFace || paintHoverFace;
    if (!face || !Number.isInteger(face.loopIdx) || !face.faceKey) return false;
    const meshifyGrid = gridOverride || s.meshifyInput || s.meshifyPending;
    const rows = meshifyGrid?.rows;
    const cols = meshifyGrid?.cols;
    if (!Number.isFinite(rows) || !Number.isFinite(cols)) return false;
    if (!s.faceGrids) s.faceGrids = {};
    if (!s.faceGrids[face.loopIdx]) s.faceGrids[face.loopIdx] = {};
    s.faceGrids[face.loopIdx][face.faceKey] = { rows, cols };
    render();
    updateScene();
    return true;
  }

  function renderFaceGridRegion(loopIdx, face, facePath, frame, grid) {
    const s = state();
    if (!grid || !frame) return;
    const parentZone = s.facePaints?.[faceStateKey(loopIdx, facePath)] || null;
    for (let row = 0; row < (grid.rows || 0); row++) {
      for (let col = 0; col < (grid.cols || 0); col++) {
        const mergedRegion = findMergedRegion(loopIdx, facePath, row, col);
        if (mergedRegion && (mergedRegion.row !== row || mergedRegion.col !== col)) continue;
        const cellFrame = splitFaceFrame(frame, row, col, grid.rows, grid.cols);
        if (!cellFrame) continue;
        const cellPath = makeFacePath(facePath, row, col);
        if (mergedRegion) {
          const mergedFacePathValue = mergedRegion.facePath || mergedFacePath(facePath, mergedRegion.row, mergedRegion.col, mergedRegion.rows, mergedRegion.cols);
          const mergedFace = {
            ...face,
            faceKey: mergedFacePathValue,
            facePath: mergedFacePathValue,
            faceType: face.faceType,
            faceLabel: `${face.faceLabel || face.faceKey}`,
            row: mergedRegion.row,
            col: mergedRegion.col,
            rows: mergedRegion.rows,
            cols: mergedRegion.cols
          };
          const mergedFrame = {
            faceType: cellFrame.faceType,
            origin: cellFrame.origin.clone(),
            uVec: cellFrame.uVec.clone().multiplyScalar(mergedRegion.cols),
            vVec: cellFrame.vVec.clone().multiplyScalar(mergedRegion.rows),
            width: cellFrame.width * mergedRegion.cols,
            height: cellFrame.height * mergedRegion.rows
          };
          const nestedGrid = s.faceGrids?.[loopIdx]?.[mergedFacePathValue];
          if (nestedGrid) {
            renderFaceGridRegion(loopIdx, mergedFace, mergedFacePathValue, mergedFrame, nestedGrid);
          } else {
            const zoneKey = s.facePaints?.[faceStateKey(loopIdx, mergedFacePathValue)] || parentZone || null;
            const piece = buildFacePatchMesh(mergedFace, mergedRegion.row, mergedRegion.col, mergedRegion.rows, mergedRegion.cols, zoneKey, {
              alpha: 0.995,
              frame: mergedFrame,
              facePath: mergedFacePathValue,
              showBoundary: true,
              boundaryColor: zoneKey ? 0xc3b4a7 : 0xd7d0c8,
              boundaryOpacity: 0.95
            });
            if (piece) app.paintFaceGroup.add(piece);
            const mergedHit = buildSelectableFaceRegionMesh(mergedFace, mergedRegion.row, mergedRegion.col, mergedRegion.rows, mergedRegion.cols, mergedFrame);
            if (mergedHit) app.paintFaceGroup.add(mergedHit);
          }
          continue;
        }
        const nestedGrid = s.faceGrids?.[loopIdx]?.[cellPath];
        if (nestedGrid) {
          renderFaceGridRegion(loopIdx, face, cellPath, cellFrame, nestedGrid);
          continue;
        }
        const zoneKey = s.facePaints?.[faceStateKey(loopIdx, cellPath)] || s.facePaints?.[faceGridStateKey(loopIdx, cellPath, row, col)] || parentZone || null;
        const cellFace = {
          ...face,
          faceKey: cellPath,
          facePath: cellPath
        };
        const piece = buildFacePatchMesh(cellFace, row, col, grid.rows, grid.cols, zoneKey, {
          alpha: 0.94,
          frame: cellFrame,
          facePath: cellPath,
          showBoundary: true,
          boundaryColor: zoneKey ? 0xc3b4a7 : 0xd7d0c8,
          boundaryOpacity: 0.7
        });
        if (piece) app.paintFaceGroup.add(piece);
        const hit = buildSelectableFaceRegionMesh(cellFace, row, col, grid.rows, grid.cols, cellFrame);
        if (hit) app.paintFaceGroup.add(hit);
      }
    }
  }

  function computeGizmoDelta(event, axis, origin, canvas) {
    if (!app.camera || !app.renderer) return 0;
    const axisDir = axis === 'x'
      ? new THREE.Vector3(1, 0, 0)
      : axis === 'y'
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(0, 0, 1);
    const p1 = origin.clone().project(app.camera);
    const p2 = origin.clone().add(axisDir).project(app.camera);
    const sax = p2.x - p1.x, say = p2.y - p1.y;
    const slen = Math.sqrt(sax * sax + say * say);
    if (slen < 1e-6) return 0;
    const sdx = sax / slen, sdy = say / slen;
    const rect = canvas.getBoundingClientRect();
    const prevNX = (gizmoDrag.prevMouse.x - rect.left) / rect.width * 2 - 1;
    const prevNY = -((gizmoDrag.prevMouse.y - rect.top) / rect.height * 2 - 1);
    const currNX = (event.clientX - rect.left) / rect.width * 2 - 1;
    const currNY = -((event.clientY - rect.top) / rect.height * 2 - 1);
    const proj = (currNX - prevNX) * sdx + (currNY - prevNY) * sdy;
    const dist = app.camera.position.distanceTo(origin);
    const worldPerNDC = dist * Math.tan(THREE.MathUtils.degToRad(app.camera.fov / 2));
    return proj * worldPerNDC;
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
    app.renderer.domElement.tabIndex = 0;
    app.renderer.domElement.addEventListener('pointerdown', () => app.renderer?.domElement?.focus(), { passive: true });
    app.renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
    viewport.appendChild(app.renderer.domElement);

    app.controls = new OrbitControls(app.camera, app.renderer.domElement);
    app.controls.target.set(0, 0, 0);
    app.controls.enableDamping = true;
    app.controls.dampingFactor = 0.08;
    app.controls.screenSpacePanning = true;
    app.controls.minPolarAngle = 0.01;
    app.controls.maxPolarAngle = Math.PI - 0.01;
    app.controls.minDistance = 20;
    app.controls.maxDistance = 500;

    app.raycaster = new THREE.Raycaster();

    const ambient = new THREE.AmbientLight(0xffffff, 1.65);
    app.scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1.55);
    sun.position.set(160, 220, 90);
    app.scene.add(sun);

    app.grid = new THREE.GridHelper(GRID_SIZE, 30, 0x9d9588, 0xd9d0cf);
    app.grid.rotation.x = Math.PI / 2;
    const gridMaterials = Array.isArray(app.grid.material) ? app.grid.material : [app.grid.material];
    gridMaterials.forEach(mat => { mat.transparent = true; mat.opacity = 0.5; });
    app.scene.add(app.grid);

    app.axes = new THREE.AxesHelper(GRID_SIZE * 0.4);
    app.scene.add(app.axes);

    const planeGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE);
    const planeMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, color: 0xffffff });
    app.ground = new THREE.Mesh(planeGeo, planeMat);
    app.scene.add(app.ground);

    app.pointGroup = new THREE.Group();
    app.scene.add(app.pointGroup);
    app.loopGroup = new THREE.Group();
    app.scene.add(app.loopGroup);
    app.extrudedGroup = new THREE.Group();
    app.scene.add(app.extrudedGroup);
    app.footprintMeshGroup = new THREE.Group();
    app.scene.add(app.footprintMeshGroup);
    app.paintFaceGroup = new THREE.Group();
    app.scene.add(app.paintFaceGroup);
    app.gizmoGroup = new THREE.Group();
    app.scene.add(app.gizmoGroup);

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
    points.forEach(p => positions.push(p.x, p.y, 0.15));
    if (closed && points.length >= 3) positions.push(points[0].x, points[0].y, 0.15);
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
    if (app.footprintMeshGroup) clearThreeObject(app.footprintMeshGroup);
    if (app.paintFaceGroup) clearThreeObject(app.paintFaceGroup);
    const selectedSet = new Set(getSelectedLoopIndices(s));

    loops.forEach((loop, loopIdx) => {
      const isSelected = selectedSet.has(loopIdx);
      const offset = s.loopOffsets?.[loopIdx] || { x: 0, y: 0, z: 0 };
      const loopColor = isSelected ? 0x0055cc : [0x1a1814, 0x28536b, 0x7a5c2e, 0x4a6f43][loopIdx % 4];

      // Group shifted by offset so all children inherit it
      const loopGroupI = new THREE.Group();
      loopGroupI.position.set(offset.x, offset.y, offset.z);

      const positions = [];
      loop.forEach(p => positions.push(p.x, p.y, 0.15));
      if (loop.length >= 3) positions.push(loop[0].x, loop[0].y, 0.15);
      const loopGeo = new THREE.BufferGeometry();
      loopGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      const loopLine = new THREE.LineLoop(loopGeo, new THREE.LineBasicMaterial({ color: loopColor, linewidth: isSelected ? 3 : 2 }));
      loopGroupI.add(loopLine);

      loop.forEach((p, idx) => {
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(isSelected ? 1.1 : 0.9, 16, 16),
          new THREE.MeshStandardMaterial({ color: loopColor, roughness: 0.45, metalness: 0.05 })
        );
        sphere.position.set(p.x, p.y, 0.9);
        loopGroupI.add(sphere);
        const label = createLabel(`${idx + 1}`);
        label.position.set(p.x + 1.1, p.y + 1.1, 1.55);
        loopGroupI.add(label);
      });

      app.loopGroup.add(loopGroupI);

      // Invisible filled mesh for selection raycasting
      if (app.footprintMeshGroup) {
        const fShape = getFootprintShape(loop);
        const fGeo = new THREE.ShapeGeometry(fShape);
        const fMesh = new THREE.Mesh(
          fGeo,
          new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
        );
        fMesh.position.set(offset.x, offset.y, offset.z);
        fMesh.userData.loopIdx = loopIdx;
        app.footprintMeshGroup.add(fMesh);
      }
    });

    // Draft points
    points.forEach((p, idx) => {
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.9, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x1a1814, roughness: 0.45, metalness: 0.05 })
      );
      sphere.position.set(p.x, p.y, 0.9);
      app.pointGroup.add(sphere);
      const label = createLabel(`${idx + 1}`);
      label.position.set(p.x + 1.1, p.y + 1.1, 1.55);
      app.pointGroup.add(label);
    });

    if (app.line.geometry) app.line.geometry.dispose();
    app.line.geometry = buildPointLine(points, false);
    app.line.material.color.set(0x7e7362);

    // Per-loop extruded meshes
    loops.forEach((loop, loopIdx) => {
      if (loop.length < 3) return;
      const extrData = s.loopExtrusions?.[loopIdx];
      if (!extrData) return;
      const offset = s.loopOffsets?.[loopIdx] || { x: 0, y: 0, z: 0 };
      const shape = getFootprintShape(loop);
      const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
        depth: extrData.height,
        bevelEnabled: false,
        steps: 1
      });
      const zoneKey = s.loopPaints ? s.loopPaints[loopIdx] : null;
      const color = (zoneKey && ZONE_COLORS[zoneKey]) ? ZONE_COLORS[zoneKey] : DEFAULT_MESH_COLOR;
      const material = new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.0, transparent: true, opacity: 0.92 });
      const mesh = new THREE.Mesh(extrudeGeo, material);
      mesh.position.set(offset.x, offset.y, offset.z);
      mesh.userData.loopIdx = loopIdx;
      app.extrudedGroup.add(mesh);
    });

    // Selected face highlight and meshified grids
      const selectedFaces = Array.isArray(s.selectedPaintFaces)
        ? s.selectedPaintFaces.filter(face => face && Number.isInteger(face.loopIdx) && typeof face.faceKey === 'string')
        : [];
      const selectedFace = selectedFaces[0] || (s.selectedPaintFace && Number.isInteger(s.selectedPaintFace.loopIdx) ? s.selectedPaintFace : null);
    if (app.paintFaceGroup) {
      // Always add selectable face hit meshes for painted masses.
      loops.forEach((loop, loopIdx) => {
        if (loop.length < 3) return;
        const extrData = s.loopExtrusions?.[loopIdx];
        if (!extrData) return;
        const faceDefs = [
          { faceKey: 'top', faceType: 'top', faceLabel: 'Top', edgeIdx: null },
          { faceKey: 'bottom', faceType: 'bottom', faceLabel: 'Bottom', edgeIdx: null }
        ];
        loop.forEach((_, edgeIdx) => {
          faceDefs.push({
            faceKey: `side-${edgeIdx}`,
            faceType: 'side',
            faceLabel: faceKeyToLabel(`side-${edgeIdx}`),
            edgeIdx
          });
        });
        faceDefs.forEach(face => {
          if (s.faceGrids?.[loopIdx]?.[face.faceKey]) return;
          const hit = buildSelectableFaceMesh({ ...face, loopIdx, facePath: face.faceKey });
          if (hit) app.paintFaceGroup.add(hit);
        });
      });

      Object.entries(s.faceGrids || {}).forEach(([loopIdxStr, faces]) => {
        const loopIdx = parseInt(loopIdxStr, 10);
        const loop = loops[loopIdx];
        const extrData = s.loopExtrusions?.[loopIdx];
        if (!loop || !extrData) return;
        Object.entries(faces || {}).forEach(([facePath, grid]) => {
          if (!grid) return;
          const parsed = parseFacePath(facePath);
          if (facePath.includes('__') && !parsed.merge && parsed.segments.length) return;
          const faceType = parsed.baseFaceKey === 'top' || parsed.baseFaceKey === 'bottom' ? parsed.baseFaceKey : 'side';
          const face = {
            loopIdx,
            faceKey: parsed.baseFaceKey,
            facePath,
            faceType,
            faceLabel: faceKeyToLabel(parsed.baseFaceKey),
            edgeIdx: faceType === 'side' ? parseInt(parsed.baseFaceKey.split('-')[1], 10) : null
          };
          const root = getFaceRegionFrame(face, facePath);
          if (!root) return;
          renderFaceGridRegion(loopIdx, face, facePath, root.frame, grid);
        });
      });
      Object.entries(s.facePaints || {}).forEach(([key, zoneKey]) => {
        if (key.match(/:\d+:\d+$/)) return;
        const match = key.match(/^(\d+):([^:]+)$/);
        if (!match) return;
        const loopIdx = parseInt(match[1], 10);
        const facePath = match[2];
        if (facePath.includes('__')) return;
        if (s.faceGrids?.[loopIdx]?.[facePath]) return;
        const loop = loops[loopIdx];
        const extrData = s.loopExtrusions?.[loopIdx];
        if (!loop || !extrData) return;
        const parsed = parseFacePath(facePath);
        const faceType = parsed.baseFaceKey === 'top' || parsed.baseFaceKey === 'bottom' ? parsed.baseFaceKey : 'side';
        const face = {
          loopIdx,
          faceKey: parsed.baseFaceKey,
          facePath,
          faceType,
          faceLabel: faceKeyToLabel(parsed.baseFaceKey),
          edgeIdx: faceType === 'side' ? parseInt(parsed.baseFaceKey.split('-')[1], 10) : null
        };
        const resolved = facePath.includes('__') ? getFaceRegionFrame(face, facePath) : null;
        const overlay = buildFacePatchMesh(face, 0, 0, 1, 1, zoneKey, {
          alpha: 0.72,
          frame: resolved?.frame || null,
          facePath
        });
        if (overlay) app.paintFaceGroup.add(overlay);
      });
      selectedFaces.forEach((face, idx) => {
        const highlight = buildFaceHighlightMesh(face, { color: idx === 0 ? 0xff2d2d : 0xf05a5a, opacity: idx === 0 ? 0.3 : 0.22 });
        if (highlight) {
          highlight.userData.isSelectionFace = true;
          app.paintFaceGroup.add(highlight);
        }
      });
      if (paintHoverFace && (!selectedFace || !samePaintFace(paintHoverFace, selectedFace))) {
        const hover = buildFaceHighlightMesh(paintHoverFace, { color: 0x57b5ff, opacity: 0.18 });
        if (hover) {
          hover.userData.isHoverFace = true;
          app.paintFaceGroup.add(hover);
        }
      }
    }

    updateGizmo();
    updateContinueButton(metrics);
    syncDom();
  }

  function updateContinueButton() {
    const s = state();
    const hasExtrusion = !!s.extrusion || (s.loopExtrusions && Object.keys(s.loopExtrusions).length > 0);
    const btn = document.getElementById('s2-next');
    if (btn) btn.disabled = !hasExtrusion;
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
    group.userData.dispose = () => { texture.dispose(); material.dispose(); };
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
      { id: '2d',       label: '2D' },
      { id: '3d',       label: '3D' },
      { id: 'paint',    label: 'Paint' }
    ];
    return tabs.map(t =>
      `<button class="mode-tab${s.mode === t.id ? ' active' : ''}" data-action="set-mode" data-mode="${t.id}">${t.label}</button>`
    ).join('');
  }

  function buildViewButtonsHtml() {
    const currentView = app.currentView || 'top';
    return ['top','front','iso','left','right','back'].map(v =>
      `<button class="fn-btn${currentView === v ? ' active' : ''}" data-action="view" data-view="${v}">${v.charAt(0).toUpperCase() + v.slice(1)}</button>`
    ).join('');
  }

  function buildLine2Html(s) {
    if (s.mode === '2d') {
      return `
        <button class="fn-btn${s.activeFunction === 'draw' ? ' active' : ''}" data-action="set-function" data-fn="draw">Draw</button>
        <button class="fn-btn${s.activeFunction === 'select' ? ' active' : ''}" data-action="set-function" data-fn="select">Select</button>
        <button class="fn-btn" disabled>Offset</button>
        <button class="fn-btn" disabled>Trim</button>
      `;
    }
    if (s.mode === '3d') {
      const noLoops = !s.loops.length;
      return `
        <button class="fn-btn${s.activeFunction === 'select' ? ' active' : ''}" data-action="set-function" data-fn="select" ${noLoops ? 'disabled title="Draw and close a loop in 2D mode first"' : ''}>Select</button>
        <button class="fn-btn${s.activeFunction === 'extrude' ? ' active' : ''}" data-action="set-function" data-fn="extrude" ${noLoops ? 'disabled title="Draw and close a loop in 2D mode first"' : ''}>Extrude</button>
        <button class="fn-btn" disabled>Sweep</button>
        <button class="fn-btn" disabled>Extract</button>
        <button class="fn-btn" disabled>Boolean</button>
      `;
    }
    if (s.mode === 'paint') {
      const noExtrusion = !s.extrusion && !(s.loopExtrusions && Object.keys(s.loopExtrusions).length);
      const selectedFaces = Array.isArray(s.selectedPaintFaces) ? s.selectedPaintFaces.length : 0;
      return `
        <button class="fn-btn${s.activeFunction === 'paint-select' ? ' active' : ''}" data-action="set-function" data-fn="paint-select" ${noExtrusion ? 'disabled title="Extrude a model in 3D mode first"' : ''}>Select</button>
        <button class="fn-btn${s.activeFunction === 'paint' ? ' active' : ''}" data-action="set-function" data-fn="paint" ${noExtrusion ? 'disabled title="Extrude a model in 3D mode first"' : ''}>Paint</button>
        <button class="fn-btn${s.activeFunction === 'meshify' ? ' active' : ''}" data-action="meshify-face" ${noExtrusion ? 'disabled title="Extrude a model in 3D mode first"' : ''}>Meshify</button>
        <button class="fn-btn" data-action="merge-faces" ${noExtrusion || selectedFaces < 2 ? 'disabled title="Select a rectangular block of at least 2 faces"' : ''}>Merge</button>
        <button class="fn-btn" disabled>Unpaint</button>
        <div style="flex:1"></div>
        <button class="fn-btn" data-action="clear-paints">Clear all</button>
      `;
    }
    return '';
  }

  function buildLine3Html(s) {
    const selected = getSelectedLoopIndices(s);
    const selectedCount = selected.length;
    const selectedLabel = selectedCount === 1 ? `Loop ${selected[0] + 1}` : selectedCount > 1 ? `${selectedCount} selected` : 'All loops';
    if (s.mode === 'navigate') {
      return `<span class="ln3-hint">Orbit - Zoom - Pan - no geometry editing in this mode</span>`;
    }
    if (s.mode === '2d' && s.activeFunction === 'select') {
      const hasSelected = selectedCount > 0;
      return `
        <span class="ln3-hint">Click a footprint to select - Shift-click adds more - Drag the gizmo to move all selected</span>
        ${hasSelected ? `
          <div style="flex:1"></div>
          <button class="fn-btn fn-danger" data-action="delete-loop">Delete Selected (${selectedCount})</button>
        ` : ''}
      `;
    }
    if (s.mode === '3d' && s.activeFunction === 'select') {
      const hasSelected = selectedCount > 0;
      return `
        <span class="ln3-hint">Click an object to select - Shift-click adds more - Delete or extrude the selection</span>
        ${hasSelected ? `
          <div style="flex:1"></div>
          <button class="fn-btn fn-danger" data-action="delete-loop">Delete Selected (${selectedCount})</button>
        ` : ''}
      `;
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
      const targetLabel = selectedLabel;
      return `
        <span class="ln3-label">Extrude (${escapeHtml(targetLabel)}):</span>
        <span class="ln3-lbl">Floors</span>
        <input class="ln3-input" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="${escapeHtml(String(floors))}" data-field="floors">
        <span class="ln3-lbl">Floor height (m)</span>
        <input class="ln3-input" type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="${escapeHtml(String(floorHt))}" data-field="typicalFloorHeight">
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
    if (s.mode === 'paint' && s.activeFunction === 'paint-select') {
      const face = s.selectedPaintFace;
      const selectedFaces = Array.isArray(s.selectedPaintFaces) ? s.selectedPaintFaces : [];
      const selectedCount = selectedFaces.length;
      const cellText = face && Number.isInteger(face.row) && Number.isInteger(face.col)
        ? `Cell ${face.row + 1}, ${face.col + 1}`
        : '';
      const mergedText = face && Number.isInteger(face.rows) && Number.isInteger(face.cols) && (face.rows > 1 || face.cols > 1)
        ? `Merged ${face.rows}x${face.cols}`
        : '';
      const faceText = selectedCount > 1
        ? `${selectedCount} faces selected`
        : face ? `Loop ${face.loopIdx + 1} · ${face.faceLabel || face.faceKey}${mergedText ? ` · ${mergedText}` : cellText ? ` · ${cellText}` : ''}` : 'No face selected';
      return `
        <span class="ln3-hint">Click a face or grid cell to select it · Meshify splits faces into selectable cells · Merge works on rectangular blocks</span>
        <span class="ln3-readout">${escapeHtml(faceText)}</span>
      `;
    }
    if (s.mode === 'paint' && s.activeFunction === 'meshify') {
      const pending = s.meshifyInput || s.meshifyPending;
      const gridText = pending ? `Meshify: ${pending.rows} rows × ${pending.cols} cols` : 'Meshify';
      return `
        <span class="ln3-label">Meshify:</span>
        <span class="ln3-lbl">Rows</span>
        <input class="ln3-input" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="${escapeHtml(String(pending?.rows ?? 3))}" data-field="meshify-rows">
        <span class="ln3-lbl">Columns</span>
        <input class="ln3-input" type="text" inputmode="numeric" autocomplete="off" spellcheck="false" value="${escapeHtml(String(pending?.cols ?? 4))}" data-field="meshify-cols">
        <div class="ln3-sep"></div>
        <button class="fn-btn fn-primary" data-action="confirm-meshify">Meshify</button>
        <span class="ln3-readout">${escapeHtml(gridText)}</span>
        <button class="fn-btn" data-action="cancel-meshify">Cancel</button>
      `;
    }
    return '';
  }

  function buildHintText(s) {
    const selectedCount = getSelectedLoopIndices(s).length;
    if (s.mode === '2d' && s.activeFunction === 'draw') return 'Click the viewport to place points - Close to finish the loop';
    if (s.mode === '2d' && s.activeFunction === 'select') return selectedCount ? 'Drag the gizmo to move all selected - Delete removes the selection' : 'Click a footprint to select it - Shift-click adds more';
    if (s.mode === '3d' && s.activeFunction === 'select') return selectedCount ? 'Delete removes the selection - Shift-click adds more objects' : 'Click an object to select it - Shift-click adds more';
    if (s.mode === '3d' && s.activeFunction === 'extrude') return selectedCount ? 'Extruding the selected objects - Click Extrude to confirm' : 'Click objects to select them, or extrude all loops';
    if (s.mode === 'paint' && s.activeFunction === 'paint-select') return 'Click a face or a divided cell to select it · Hover previews the target';
    if (s.mode === 'paint' && s.activeFunction === 'meshify') return 'Adjust rows and columns, then click a face or cell to subdivide it';
    if (s.mode === 'paint' && s.activeFunction === 'paint') return s.selectedPaintFace ? 'Click a selected face or grid cell to assign the zone' : 'Select a face first, then click Paint to assign a zone';
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
          <span class="badge badge-${metrics.extrusion ? 'green' : 'blue'}" data-role="status-badge">${metrics.extrusion ? 'Extruded' : 'Draft'}</span>
        </div>

        <div class="plan-layout">
          <div class="plan-stage">
            <div class="mode-toolbar">
              <div class="mode-line-1" data-role="mode-line-1">${buildLine1Html(s)}</div>
              <div class="mode-line-2" data-role="mode-line-2">${buildLine2Html(s)}</div>
              <div class="mode-line-3" data-role="mode-line-3">${buildLine3Html(s)}</div>
            </div>
            <div class="three-shell">
              <div class="viewcube">${buildViewButtonsHtml()}</div>
              <div class="three-hint" data-role="three-hint">${buildHintText(s)}</div>
              <div class="three-viewport" id="massing-viewport"></div>
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
      el.textContent = metrics.extrusion ? 'Extruded' : 'Draft';
      el.className = `badge badge-${metrics.extrusion ? 'green' : 'gray'}`;
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
    updateContinueButton();
  }

  function bindUI() {
    const root = document.getElementById('zone-modeling-root');
    if (!root || root.dataset.bound === '1') return;
    root.dataset.bound = '1';
    root.tabIndex = 0;
    root.addEventListener('pointerdown', event => {
      if (event.target === root) root.focus();
    }, { passive: true });

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
      if (action === 'confirm-meshify') { confirmMeshify(); return; }
      if (action === 'merge-faces')    { mergeSelectedFaces(); return; }
      if (action === 'cancel-extrude') { cancelExtrude(); return; }
      if (action === 'set-paint-zone') { setPaintZone(actionEl.dataset.zone); return; }
      if (action === 'clear-paints')   { clearPaints(); return; }
      if (action === 'meshify-face')    { meshifyFace(); return; }
      if (action === 'cancel-meshify')  { cancelMeshify(); return; }
      if (action === 'delete-loop')    { deleteSelectedLoop(); return; }
    });

    root.addEventListener('input', event => {
      const input = event.target.closest('[data-field]');
      if (!input) return;
      updateDialogField(input.dataset.field, input.value, false, input);
    });

    root.addEventListener('change', event => {
      const input = event.target.closest('[data-field]');
      if (!input) return;
      updateDialogField(input.dataset.field, input.value, true, input);
    });

    root.addEventListener('keydown', event => {
      const input = event.target.closest('input[data-field]');
      if (!input) return;
      const allowed = [
        'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ];
      if (event.ctrlKey || event.metaKey || allowed.includes(event.key)) return;
      if (input.dataset.field === 'floors') {
        if (/^[0-9]$/.test(event.key)) return;
      } else if (input.dataset.field === 'typicalFloorHeight') {
        if (/^[0-9.]$/.test(event.key)) return;
      } else if (input.dataset.field === 'meshify-rows' || input.dataset.field === 'meshify-cols') {
        if (/^[0-9]$/.test(event.key)) return;
      }
      event.preventDefault();
    });

    document.addEventListener('keydown', handleModelUndoShortcut);

    // Delete key removes selected loop
    document.addEventListener('keydown', e => {
      if (e.key === 'Delete' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        const s = state();
        if (getSelectedLoopIndices(s).length) { e.preventDefault(); deleteSelectedLoops(); }
      }
    });
  }

  function bindViewportEvents() {
    if (!app.renderer) return;
    const canvas = app.renderer.domElement;

    canvas.addEventListener('mousedown', event => {
      if (event.button !== 0) { mouseDown = null; return; }

      const s = state();

      // Gizmo drag takes priority
      const selected = getSelectedLoopIndices(s);
      if (selected.length && app.gizmoGroup?.visible) {
        const axis = pickGizmoAxis(event, canvas);
        if (axis) {
          const centers = selected.map(idx => {
            const loop = s.loops[idx];
            if (!loop || loop.length < 3) return null;
            const c = centroid(loop);
            const offset = s.loopOffsets?.[idx] || { x: 0, y: 0, z: 0 };
            return { idx, origin: new THREE.Vector3(c.x + offset.x, c.y + offset.y, offset.z) };
          }).filter(Boolean);
          if (!centers.length) return;
          gizmoDrag = {
            axis,
            loopIdx: selected[0],
            selectedIndices: selected.slice(),
            prevMouse: { x: event.clientX, y: event.clientY },
            origin: centers.reduce((acc, item) => acc.add(item.origin), new THREE.Vector3()).multiplyScalar(1 / centers.length)
          };
          if (app.controls) app.controls.enabled = false;
          mouseDown = null;
          return;
        }
      }

      mouseDown = { x: event.clientX, y: event.clientY, button: event.button };
    });

    window.addEventListener('mousemove', event => {
      const s = state();
      if (!gizmoDrag) {
        if (s.mode === 'paint' && s.activeFunction && s.activeFunction.startsWith('paint')) {
          const face = pickPaintFace(event, canvas);
          setPaintHoverFace(face);
          if (app.renderer) {
            app.renderer.domElement.style.cursor = face ? 'pointer' : 'crosshair';
          }
        } else if (paintHoverFace) {
          setPaintHoverFace(null);
        }
      }
      if (!gizmoDrag) return;
      const selectedIndices = Array.isArray(gizmoDrag.selectedIndices) ? gizmoDrag.selectedIndices : [gizmoDrag.loopIdx];
      const delta = computeGizmoDelta(event, gizmoDrag.axis, gizmoDrag.origin, canvas);
      if (!s.loopOffsets) s.loopOffsets = {};
      selectedIndices.forEach(idx => {
        const curr = s.loopOffsets?.[idx] || { x: 0, y: 0, z: 0 };
        const newOffset = { ...curr };
        if (gizmoDrag.axis === 'x') newOffset.x = (curr.x || 0) + delta;
        if (gizmoDrag.axis === 'y') newOffset.y = (curr.y || 0) + delta;
        if (gizmoDrag.axis === 'z') newOffset.z = (curr.z || 0) + delta;
        s.loopOffsets[idx] = newOffset;
      });

      // Update stored origin so next frame computes delta from the new selection center
      const centers = selectedIndices.map(idx => {
        const loop = s.loops[idx];
        if (!loop || loop.length < 3) return null;
        const c = centroid(loop);
        const off = s.loopOffsets?.[idx] || { x: 0, y: 0, z: 0 };
        return new THREE.Vector3(c.x + off.x, c.y + off.y, off.z);
      }).filter(Boolean);
      if (centers.length) gizmoDrag.origin = centers.reduce((acc, item) => acc.add(item), new THREE.Vector3()).multiplyScalar(1 / centers.length);
      gizmoDrag.prevMouse = { x: event.clientX, y: event.clientY };

      updateScene();
    });

    canvas.addEventListener('mouseleave', () => {
      if (paintHoverFace) setPaintHoverFace(null);
    });

      window.addEventListener('mouseup', event => {
      if (gizmoDrag) {
        gizmoDrag = null;
        updateMode(); // re-enable orbit controls per current mode
        return;
      }

      if (!mouseDown || mouseDown.button !== 0) return;
      const moved = Math.hypot(event.clientX - mouseDown.x, event.clientY - mouseDown.y);
      mouseDown = null;
      if (moved > 6) return;

      const s = state();

      // 2D draw: place points
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
          if (Math.hypot(point.x - first.x, point.y - first.y) <= 2.25) {
            closeLoop();
            return;
          }
        }
        addPoint(point);
        return;
      }

    });

    canvas.addEventListener('click', event => {
      const s = state();
      if (event.button !== 0) return;
      if (s.mode === '2d' && s.activeFunction === 'select') {
        const loopIdx = pickSelectableLoop(event, canvas, s);
        if (loopIdx !== null) {
          toggleLoopSelection(loopIdx, event.shiftKey);
        } else if (!event.shiftKey && getSelectedLoopIndices(s).length) {
          clearSelection();
        }
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (s.mode === '3d' && (s.activeFunction === 'select' || s.activeFunction === 'extrude')) {
        const loopIdx = pickSelectableLoop(event, canvas, s);
        if (loopIdx !== null) {
          toggleLoopSelection(loopIdx, event.shiftKey);
        } else if (!event.shiftKey && getSelectedLoopIndices(s).length) {
          clearSelection();
        }
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (!(s.mode === 'paint' && (s.activeFunction === 'paint-select' || s.activeFunction === 'meshify'))) return;
      const face = pickPaintFace(event, canvas);
      if (!face) return;
      selectPaintFace(face, event.shiftKey);
      if (s.activeFunction === 'meshify') {
        const success = meshifySelectedFace(face, s.meshifyInput || s.meshifyPending || null);
        if (success) {
          s.meshifyPending = null;
          s.activeFunction = 'paint-select';
        }
      } else if (s.activeFunction === 'paint' && s.paintZone) {
        if (s.faceGrids?.[face.loopIdx]?.[face.faceKey]) {
          const row = Number.isInteger(face.row) ? face.row : 0;
          const col = Number.isInteger(face.col) ? face.col : 0;
          s.facePaints[faceGridStateKey(face.loopIdx, face.faceKey, row, col)] = s.paintZone;
        } else {
          s.facePaints[faceStateKey(face.loopIdx, face.faceKey)] = s.paintZone;
        }
      }
      render();
      updateScene();
      updateMode();
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  function pickPlanPoint(event, surface) {
    if (!surface || !app.renderer || !app.camera || !app.raycaster || !app.ground) return null;
    const rect = surface.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return null;
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    app.raycaster.setFromCamera({ x: nx, y: ny }, app.camera);
    const hits = app.raycaster.intersectObject(app.ground, false);
    if (!hits.length) return null;
    const p = hits[0].point;
    return { x: clamp(p.x, -WORLD_HALF, WORLD_HALF), y: clamp(p.y, -WORLD_HALF, WORLD_HALF) };
  }

  function setView(view, skipHistory = false) {
    if (!skipHistory) pushHistoryState();
    if (!app.camera || !app.controls) return;
    const dist = 220;
    const center = new THREE.Vector3(0, 0, 0);
    app.currentView = view;
    app.controls.target.copy(center);
    switch (view) {
      case 'top':   app.camera.position.set(0, 0, dist);   app.camera.up.set(0, 1, 0); break;
      case 'front': app.camera.position.set(0, dist, 0);   app.camera.up.set(0, 0, 1); break;
      case 'back':  app.camera.position.set(0, -dist, 0);  app.camera.up.set(0, 0, 1); break;
      case 'left':  app.camera.position.set(-dist, 0, 0);   app.camera.up.set(0, 0, 1); break;
      case 'right': app.camera.position.set(dist, 0, 0);    app.camera.up.set(0, 0, 1); break;
      case 'iso':
      default:      app.camera.position.set(dist * 0.9, dist * 0.7, dist * 0.9); app.camera.up.set(0, 0, 1); break;
    }
    app.controls.update();
  }

  function initScene() {
    if (initialized) return;
    const viewport = document.getElementById('massing-viewport');
    if (!viewport || !THREE) return;
    if (app.animateHandle) cancelAnimationFrame(app.animateHandle);
    createScene();
    initialized = true;
    setView('top', true);
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
    if (app.controls && !gizmoDrag) {
      app.controls.enabled = s.mode !== '2d';
    }
    if (app.renderer) {
      const isSelect =
        (s.mode === '2d' && s.activeFunction === 'select') ||
        (s.mode === '3d' && s.activeFunction === 'select');
      const cursor = s.mode === '2d' && s.activeFunction === 'draw' ? 'crosshair'
                   : isSelect ? 'pointer'
                   : s.mode === '3d' && s.activeFunction === 'extrude' ? 'pointer'
                   : s.mode === 'paint' && (s.activeFunction === 'paint-select' || s.activeFunction === 'meshify') ? 'pointer'
                   : s.mode === 'paint' ? 'crosshair'
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
    undo: undoHistory,
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


