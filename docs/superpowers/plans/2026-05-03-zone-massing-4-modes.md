# Zone Massing 4-Mode Toolbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2-mode (draw/navigate) toolbar with a 4-mode system (Navigate / 2D / 3D / Paint) using a 3-line toolbar: mode tabs → function buttons → active function prompts.

**Architecture:** All logic lives in `src/zoneMassing.js`. CSS additions go in `facadePlaybook.html`'s `<style>` block. The toolbar is rebuilt as three composable HTML-string helpers (`buildLine1Html`, `buildLine2Html`, `buildLine3Html`) used by both `buildViewportHtml()` (first render) and `syncDom()` (live updates). The Three.js canvas and scene are untouched except for paint-mode mesh picking and per-loop coloring.

**Tech Stack:** Vanilla JS (IIFE), Three.js r152, HTML/CSS, no build step.

---

## File Map

| File | What changes |
|------|-------------|
| `src/zoneMassing.js` | State shape, HTML builders, bindUI, setMode, updateMode, viewport events, updateScene |
| `facadePlaybook.html` | CSS additions in `<style>` block only |

---

## Task 1: Update state shape — rename `dialog` → `extrudeInput`, add new fields

**Files:** `src/zoneMassing.js` lines 2–96, 324–362

- [ ] **Step 1: Replace `DEFAULTS` (lines 2–16)**

```js
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
```

- [ ] **Step 2: Update `state()` validation — replace the `s.dialog` block and mode check**

Find and replace these lines inside `state()`:

```js
// REMOVE these lines:
if (!s.dialog || typeof s.dialog !== 'object') s.dialog = { ...DEFAULTS.dialog };
if (typeof s.dialog.open !== 'boolean') s.dialog.open = false;
s.dialog.floors = clamp(round(num(s.dialog.floors, DEFAULTS.dialog.floors)), 1, 120);
s.dialog.typicalFloorHeight = clamp(num(s.dialog.typicalFloorHeight, DEFAULTS.dialog.typicalFloorHeight), 2.4, 6.0);

// ADD these lines in their place:
if (!s.extrudeInput || typeof s.extrudeInput !== 'object') s.extrudeInput = { ...DEFAULTS.extrudeInput };
s.extrudeInput.floors = clamp(round(num(s.extrudeInput.floors, DEFAULTS.extrudeInput.floors)), 1, 120);
s.extrudeInput.typicalFloorHeight = clamp(num(s.extrudeInput.typicalFloorHeight, DEFAULTS.extrudeInput.typicalFloorHeight), 2.4, 6.0);
```

Also replace the mode validation line:

```js
// REMOVE:
if (typeof s.mode !== 'string') s.mode = 'draw';

// ADD:
if (!['navigate', '2d', '3d', 'paint'].includes(s.mode)) s.mode = 'navigate';
```

Add new field guards after the `drawTool` guard:

```js
if (typeof s.activeFunction !== 'string' && s.activeFunction !== null) s.activeFunction = null;
if (typeof s.paintZone !== 'string' && s.paintZone !== null) s.paintZone = null;
if (!s.loopPaints || typeof s.loopPaints !== 'object' || Array.isArray(s.loopPaints)) s.loopPaints = {};
```

- [ ] **Step 3: Update `confirmExtrude()` (around line 340) to use `extrudeInput`**

```js
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
```

- [ ] **Step 4: Update `updateDialogField()` to use `extrudeInput`**

```js
function updateDialogField(field, value) {
  const s = state();
  if (field === 'floors') s.extrudeInput.floors = clamp(round(num(value, s.extrudeInput.floors)), 1, 120);
  if (field === 'typicalFloorHeight') s.extrudeInput.typicalFloorHeight = clamp(num(value, s.extrudeInput.typicalFloorHeight), 2.4, 6.0);
  render();
}
```

- [ ] **Step 5: Open browser, navigate to the configurator, reach the massing step — no visual change expected, console should be error-free**

- [ ] **Step 6: Commit**

```bash
git add src/zoneMassing.js
git commit -m "refactor: rename dialog→extrudeInput, add activeFunction/paintZone/loopPaints to massing state"
```

---

## Task 2: Add CSS for the 3-line toolbar

**Files:** `facadePlaybook.html` — inside `<style>`, after the `.plan-inline-extrude` block (around line 971)

- [ ] **Step 1: Insert the following CSS block after `.plan-inline-extrude.open { display: block; }`**

```css
/* ── 3-line mode toolbar ── */
.mode-toolbar { border-bottom: 1px solid var(--border); }
.mode-line-1 {
  display: flex;
  background: #faf7f2;
  border-bottom: 1px solid var(--border);
}
.mode-tab {
  padding: 9px 22px;
  font-size: 13px;
  font-family: var(--sans);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  color: var(--text-2);
  font-weight: 500;
  white-space: nowrap;
}
.mode-tab:hover { color: #1a1814; }
.mode-tab.active {
  background: var(--surface);
  border-bottom-color: #1a1814;
  color: #1a1814;
  font-weight: 700;
}
.mode-line-2 {
  display: flex;
  gap: 5px;
  padding: 7px 12px;
  background: #fefcf8;
  border-bottom: 1px solid var(--border);
  align-items: center;
  min-height: 38px;
  flex-wrap: wrap;
}
.mode-line-3 {
  display: flex;
  gap: 8px;
  padding: 6px 12px;
  background: #fff;
  border-bottom: 1px solid #f0ebe2;
  align-items: center;
  min-height: 34px;
  flex-wrap: wrap;
}
.mode-line-3:empty { display: none; }
.fn-btn {
  padding: 4px 12px;
  font-size: 12px;
  font-family: var(--sans);
  background: #f0ebe2;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #555;
  white-space: nowrap;
  line-height: 1.4;
}
.fn-btn:hover:not(:disabled) { background: #e8e2d8; color: #333; }
.fn-btn.active { background: #1a1814; color: #fff; font-weight: 600; }
.fn-btn.fn-primary { background: #1a1814; color: #fff; font-weight: 600; }
.fn-btn.fn-primary:hover:not(:disabled) { background: #333; }
.fn-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.ln3-label { font-size: 11px; font-weight: 600; color: #555; margin-right: 4px; white-space: nowrap; }
.ln3-lbl   { font-size: 11px; color: #666; white-space: nowrap; }
.ln3-input {
  width: 60px; padding: 3px 7px;
  border: 1px solid #ddd; border-radius: 4px;
  font-size: 12px; font-family: var(--sans); background: #fafafa;
}
.ln3-sep     { width: 1px; height: 16px; background: #e0d9ce; margin: 0 2px; flex-shrink: 0; }
.ln3-readout { font-size: 11px; color: #aaa; white-space: nowrap; }
.ln3-hint    { font-size: 11px; color: #aaa; }
```

- [ ] **Step 2: Verify CSS compiles — hard-refresh the browser, no layout breakage**

- [ ] **Step 3: Commit**

```bash
git add facadePlaybook.html
git commit -m "style: add 3-line mode toolbar CSS classes"
```

---

## Task 3: Add `buildLine1Html`, `buildLine2Html`, `buildLine3Html` helpers

**Files:** `src/zoneMassing.js` — insert after the `buildExtrudeDialogHtml` function (around line 732)

- [ ] **Step 1: Add `buildLine1Html`**

```js
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
```

- [ ] **Step 2: Add `buildLine2Html`**

```js
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
```

- [ ] **Step 3: Add `buildLine3Html`**

```js
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
```

- [ ] **Step 4: Open browser devtools console, type `window.ZoneMassing` — verify the object exists and has no errors**

- [ ] **Step 5: Commit**

```bash
git add src/zoneMassing.js
git commit -m "feat: add buildLine1Html/buildLine2Html/buildLine3Html toolbar helpers"
```

---

## Task 4: Refactor `buildViewportHtml` and `syncDom`

**Files:** `src/zoneMassing.js` — `buildViewportHtml` (lines 612–711) and `syncDom` (lines 746–783)

- [ ] **Step 1: Replace `buildViewportHtml` entirely**

```js
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
```

- [ ] **Step 2: Add `buildHintText` helper (insert just before `buildViewportHtml`)**

```js
function buildHintText(s) {
  if (s.mode === '2d' && s.activeFunction === 'draw') return 'Click the viewport to place points · Close to finish the loop';
  if (s.mode === 'paint' && s.activeFunction === 'paint') return 'Click a mesh to assign the selected zone';
  return '';
}
```

- [ ] **Step 3: Replace `syncDom` entirely**

```js
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

  const statusBadge = root.querySelector('[data-role="status-badge"]');
  const statusBadgeSidebar = root.querySelector('[data-role="status-badge-sidebar"]');
  const footprint     = root.querySelector('[data-role="kpi-footprint"]');
  const perimeter     = root.querySelector('[data-role="kpi-perimeter"]');
  const height        = root.querySelector('[data-role="kpi-height"]');
  const cost          = root.querySelector('[data-role="kpi-cost"]');
  const loopStatus    = root.querySelector('[data-role="loop-status"]');
  const modeText      = root.querySelector('[data-role="mode-text"]');
  const floorsText    = root.querySelector('[data-role="floors-text"]');
  const floorHeightText = root.querySelector('[data-role="floor-height-text"]');

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
```

- [ ] **Step 4: Open browser — the massing step should now show the 3-line toolbar. Mode tabs should appear in Line 1. Navigate should be the default with view preset buttons in Line 2.**

- [ ] **Step 5: Commit**

```bash
git add src/zoneMassing.js
git commit -m "feat: refactor buildViewportHtml and syncDom to 3-line toolbar structure"
```

---

## Task 5: Update `bindUI` — new action handlers

**Files:** `src/zoneMassing.js` — `bindUI` function (around lines 785–851)

- [ ] **Step 1: Replace the entire `bindUI` click handler block**

```js
function bindUI() {
  const root = document.getElementById('zone-modeling-root');
  if (!root || root.dataset.bound === '1') return;
  root.dataset.bound = '1';

  root.addEventListener('click', event => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    event.preventDefault();

    if (action === 'set-mode') { setMode(actionEl.dataset.mode); return; }
    if (action === 'set-function') { setFunction(actionEl.dataset.fn); return; }
    if (action === 'view') { setView(actionEl.dataset.view); return; }
    if (action === 'draw-tool') { setDrawTool(actionEl.dataset.tool); return; }
    if (action === 'undo-point') { undoPoint(); return; }
    if (action === 'close-loop') { closeLoop(); return; }
    if (action === 'reset-model') { resetModel(); return; }
    if (action === 'confirm-extrude') { confirmExtrude(); return; }
    if (action === 'cancel-extrude') { cancelExtrude(); return; }
    if (action === 'set-paint-zone') { setPaintZone(actionEl.dataset.zone); return; }
    if (action === 'clear-paints') { clearPaints(); return; }
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
```

- [ ] **Step 2: Add the new action functions — insert them after `updateDialogField` (around line 362)**

```js
function setFunction(fn) {
  const s = state();
  s.activeFunction = fn;
  render();
}

function setPaintZone(zone) {
  const s = state();
  s.paintZone = zone;
  render();
}

function clearPaints() {
  const s = state();
  s.loopPaints = {};
  render();
  updateScene();
}

function cancelExtrude() {
  const s = state();
  s.activeFunction = null;
  render();
}
```

- [ ] **Step 3: Open browser — click each mode tab. Line 2 should update. Click "Draw" in 2D mode — Line 3 should show Polyline/Rectangle/Undo/Close/Reset. Click "Extrude" in 3D mode — Line 3 should show Floors/Floor height/Confirm/Cancel.**

- [ ] **Step 4: Commit**

```bash
git add src/zoneMassing.js
git commit -m "feat: wire bindUI for set-mode, set-function, set-paint-zone, clear-paints, cancel-extrude"
```

---

## Task 6: Update `setMode` and `updateMode` for 4 modes

**Files:** `src/zoneMassing.js` — `setMode` (around line 242), `setModeAndRefresh` (around line 959), `updateMode` (around line 965)

- [ ] **Step 1: Replace `setMode`**

```js
function setMode(mode) {
  const s = state();
  s.mode = mode;
  s.rectStart = null;
  if (mode === '2d') {
    s.activeFunction = 'draw';
    setView('top');
  } else if (mode === '3d') {
    s.activeFunction = 'extrude';
  } else if (mode === 'paint') {
    s.activeFunction = 'paint';
  } else {
    s.activeFunction = null;
  }
  render();
  updateMode();
}
```

- [ ] **Step 2: Replace `setModeAndRefresh`**

```js
function setModeAndRefresh(mode) {
  setMode(mode);
}
```

- [ ] **Step 3: Replace `updateMode`**

```js
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
    const cursor = s.mode === '2d' ? 'crosshair'
                 : s.mode === 'paint' ? 'crosshair'
                 : s.mode === 'navigate' ? 'grab'
                 : 'default';
    app.renderer.domElement.style.cursor = cursor;
  }
}
```

- [ ] **Step 4: Open browser — click Navigate tab, then 2D tab. 2D should snap camera to Top view, Draw should be auto-selected in Line 2, Line 3 should show draw tools. Click 3D — Extrude auto-selected.**

- [ ] **Step 5: Commit**

```bash
git add src/zoneMassing.js
git commit -m "feat: update setMode/updateMode for 4-mode system with auto-function selection"
```

---

## Task 7: Update viewport `mouseup` handler — 2D drawing and Paint picking

**Files:** `src/zoneMassing.js` — `bindViewportEvents` (around line 853)

- [ ] **Step 1: Replace `bindViewportEvents` entirely**

```js
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

    // 2D drawing
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

    // Paint picking
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
```

- [ ] **Step 2: Open browser — go to 2D mode, click the viewport to place points. Points should appear. Close loop should form a polygon. Navigate mode orbit should work. Switch to 3D, confirm extrude. Switch to Paint, select Tower zone, click the mesh — nothing will change color yet (that's Task 8).**

- [ ] **Step 3: Commit**

```bash
git add src/zoneMassing.js
git commit -m "feat: update viewport mouseup for 2D draw and Paint mesh picking"
```

---

## Task 8: Add zone color map and apply `loopPaints` colors in `updateScene`

**Files:** `src/zoneMassing.js` — add constant near top (after `BASE_RATES`), update `updateScene`

- [ ] **Step 1: Add `ZONE_COLORS` constant after `BASE_RATES` (around line 23)**

```js
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
```

- [ ] **Step 2: Update the extruded mesh section of `updateScene` — find the block starting `if (s.extrusion && loops.length)` (around line 511) and replace it**

```js
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
    const color = zoneKey && ZONE_COLORS[zoneKey] ? ZONE_COLORS[zoneKey] : DEFAULT_MESH_COLOR;
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
```

- [ ] **Step 3: Open browser — draw a loop, extrude, switch to Paint, select "Tower", click the mesh. The mesh should turn blue (`#2d6a8f`). Select another zone and click again — color should update.**

- [ ] **Step 4: Commit**

```bash
git add src/zoneMassing.js
git commit -m "feat: add ZONE_COLORS map and apply loopPaints coloring to extruded meshes"
```

---

## Task 9: Remove dead code

**Files:** `src/zoneMassing.js` and `facadePlaybook.html`

- [ ] **Step 1: In `src/zoneMassing.js`, delete these functions entirely:**
  - `openExtrudeDialog()` (around line 324)
  - `closeExtrudeDialog()` (around line 335)
  - `buildExtrudeDialogHtml()` (around line 713)

- [ ] **Step 2: In `facadePlaybook.html`, remove the `.plan-inline-extrude` CSS block (lines ~963–974):**

```css
/* DELETE these lines: */
.plan-inline-extrude {
  display: none;
  margin: 12px 14px 0;
  padding: 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, #fff, #fcfaf5);
  box-shadow: 0 8px 18px rgba(31, 41, 55, 0.04);
}
.plan-inline-extrude.open {
  display: block;
}
```

- [ ] **Step 3: In `facadePlaybook.html`, remove the static massing HTML inside `<div id="zone-modeling-root">` (lines ~1319–1384) — leave just the empty div. The JS rebuilds it.**

The result should be:
```html
<div id="zone-modeling-root"></div>
```

- [ ] **Step 4: Open browser — full walkthrough: Navigate → 2D (draw loop, close) → 3D (extrude) → Paint (select zone, click mesh). Verify no console errors.**

- [ ] **Step 5: Commit**

```bash
git add src/zoneMassing.js facadePlaybook.html
git commit -m "chore: remove dead dialog code, static massing HTML placeholder, and unused CSS"
```

---

## Self-Review Checklist

| Spec requirement | Covered in |
|-----------------|------------|
| 4 modes: Navigate, 2D, 3D, Paint | Tasks 1, 6 |
| Line 1: mode tabs | Task 3 (buildLine1Html) |
| Line 2: function buttons per mode | Task 3 (buildLine2Html) |
| Line 3: active function prompts | Task 3 (buildLine3Html) |
| Navigate: view presets (Top/Front/Iso/Left/Right/Back) | Tasks 3, 5 |
| 2D auto-selects Draw; camera snaps to Top | Task 6 (setMode) |
| 2D/Draw: Polyline/Rectangle, Undo, Close loop, Reset | Tasks 3, 5 |
| 3D auto-selects Extrude | Task 6 (setMode) |
| 3D/Extrude: Floors + Floor height + Confirm + Cancel + Total readout | Tasks 3, 5 |
| Extrude button disabled when no loops | Task 3 (buildLine2Html) |
| Paint auto-selects Paint | Task 6 (setMode) |
| Paint/Paint: zone chips from CFG.zones or fallback list | Task 3 (buildLine3Html) |
| Paint button disabled when no extrusion | Task 3 (buildLine2Html) |
| Click mesh → assigns paintZone to loopPaints | Task 7 |
| loopPaints → mesh color via ZONE_COLORS | Task 8 |
| Clear all resets loopPaints | Task 5 (clearPaints) |
| OrbitControls: enabled in Navigate, 3D, Paint; disabled in 2D | Task 6 (updateMode) |
| Dialog (plan-inline-extrude) removed | Tasks 4, 9 |
| ZoneMassing public API unchanged | Not touched |
| s2-next gated on metrics.extrusion | Not touched (unchanged) |
| Dimmed future functions (Sweep, Extract, etc.) | Task 3 (buildLine2Html) |
