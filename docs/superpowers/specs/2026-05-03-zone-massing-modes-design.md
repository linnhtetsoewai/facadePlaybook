# Zone Massing — 4-Mode Toolbar Design

**Date:** 2026-05-03  
**File:** `src/zoneMassing.js`  
**Status:** Approved for implementation

---

## Overview

Replace the current 2-mode (draw / navigate) toolbar with a 4-mode system: **Navigate**, **2D**, **3D**, **Paint**. Each mode has its own function buttons. Clicking a function reveals its inputs on a third row.

---

## Toolbar Structure (3 lines)

```
┌─────────────────────────────────────────────────────────┐
│ Line 1 │ Navigate  │  2D  │  3D  │  Paint               │  ← mode tabs
├─────────────────────────────────────────────────────────┤
│ Line 2 │ [Extrude] [Sweep·] [Extract·] [Boolean·]       │  ← function buttons for active mode
├─────────────────────────────────────────────────────────┤
│ Line 3 │ Extrude: Floors [40] Floor ht [3.3]  Confirm   │  ← prompts for active function
└─────────────────────────────────────────────────────────┘
```

- Line 1 is always visible; switching tabs changes Lines 2 & 3.
- Line 2 shows the functions available in the active mode. Inactive/future functions are rendered but visually dimmed.
- Line 3 is only shown when a function is active. It renders that function's inputs.
- The viewport below the toolbar is always the Three.js canvas.

---

## Modes & Functions

### Navigate
- **Purpose:** Orbit, zoom, pan. No geometry creation or editing.
- **Line 2 (view presets):** Top · Front · Iso · Left · Right · Back — these are direct-action buttons (no Line 3 needed). Clicking one repositions the camera.
- **Line 3:** Status hint only — `"Orbit · Zoom · Pan — no geometry editing in this mode"`

### 2D
- **Purpose:** Draw plan footprints.
- **Line 2 functions:**
  - **Draw** (active) — draw polyline or rectangle footprint loops
  - Offset · Trim · (disabled, future)
- **Line 3 when Draw is active:**
  - Tool toggle: `Polyline` | `Rectangle`
  - Actions: `Undo point` · `Close loop`
  - Right-aligned: `Reset`
- Entering 2D mode auto-selects Draw.
- Camera auto-snaps to Top view on entering 2D mode.

### 3D
- **Purpose:** Extrude closed loops into 3D massing.
- **Line 2 functions:**
  - **Extrude** (active by default when entering mode)
  - Sweep · Extract · Boolean · (disabled, future)
- **Line 3 when Extrude is active:**
  - `Floors` number input (1–120, default 40)
  - `Floor height (m)` number input (2.4–6.0, default 3.3)
  - `Confirm` button — applies extrusion
  - `Cancel` button — dismisses without change
  - Right-aligned: live `Total: X m` readout
- Requires at least one closed loop from 2D mode. If no loops exist, Extrude button is disabled with a tooltip.
- Entering 3D mode auto-selects Extrude.

### Paint
- **Purpose:** Assign facade zones to faces of the extruded mesh by clicking.
- **Line 2 functions:**
  - **Paint** (active by default when entering mode)
  - Unpaint · (disabled, future)
  - Right-aligned: `Clear all`
- **Line 3 when Paint is active:**
  - `Zone:` label followed by zone chips. Source: `CFG.zones` if non-empty, otherwise the full hardcoded zone tag list (tower, podium, lobby, retail, roof_crown, penthouse, canopy, …).
  - Active zone chip is highlighted.
  - Click a mesh → assigns the active zone to that entire extruded loop (one zone per loop, v1). Per-face assignment is out of scope for this iteration.
- Requires an extruded model from 3D mode. If no extrusion exists, Paint button is disabled.
- Zone colors map to the existing zone color palette in the codebase.

---

## State Changes

Current state shape extended:

```js
{
  // existing fields unchanged
  loops: [],
  points: [],
  extrusion: null,
  dialog: { ... },          // REMOVED — replaced by Line 3 inline controls

  // new fields
  mode: 'navigate',         // 'navigate' | '2d' | '3d' | 'paint'  (was 'draw'|'navigate')
  activeFunction: null,     // string key of selected function within current mode, or null
  paintZone: null,          // zone key currently selected for painting (e.g. 'tower')
  loopPaints: {}            // { loopIdx: zoneKey } — one zone per extruded loop
}
```

`dialog.open` and the `plan-inline-extrude` panel are removed. Extrude inputs live in Line 3.

---

## Rendering Architecture

`buildViewportHtml()` is split into three composable helpers called in sequence:

```
buildLine1Html(s)     → mode tab HTML
buildLine2Html(s)     → function buttons for s.mode
buildLine3Html(s)     → prompts for s.activeFunction (empty string if none)
```

`syncDom()` updates each line independently via `data-role` attributes, avoiding full re-renders while the Three.js scene is live.

---

## Paint Mode — Mesh Picking (v1)

- Extruded geometry is built with `THREE.ExtrudeGeometry` per loop. Each loop's `THREE.Mesh` is stored in `app.extrudedGroup` with `userData.loopIdx`.
- In Paint mode, `mouseup` on the canvas runs `app.raycaster.intersectObjects(app.extrudedGroup.children)`. The first hit identifies which loop mesh was clicked.
- `s.loopPaints[loopIdx] = activePaintZone` is written to state (replaces `facePaints`).
- `updateScene()` rebuilds extruded meshes and sets each mesh's material color from `loopPaints`. Each loop gets a single `THREE.MeshStandardMaterial` colored by its assigned zone (or the default massing color if unpainted).
- Zone → color mapping uses the existing zone palette already in the codebase.
- Per-face (per-triangle-group) painting is future scope — `THREE.ExtrudeGeometry` triangulation does not map cleanly to semantic wall segments without additional geometry splitting.

---

## Mode Transition Rules

| From → To | Side effect |
|-----------|-------------|
| Any → 2D | Camera snaps to Top; Draw auto-selected |
| Any → 3D | Extrude auto-selected; camera stays |
| Any → Paint | Paint auto-selected; camera stays |
| Any → Navigate | No auto-snap; orbit/zoom/pan enabled |
| 2D (drawing) → any other | In-progress points are preserved in `s.points` |

---

## What Is Not Changing

- Three.js scene setup, lighting, grid, raycaster — unchanged.
- `OrbitControls` enable/disable logic — unchanged (enabled in Navigate, disabled in 2D/3D/Paint).
- Loop drawing, point placement, rectangle tool, undo, reset — logic unchanged, just re-homed under 2D/Draw.
- Massing summary panel (sidebar) — unchanged.
- `ZoneMassing` public API (`init`, `render`, `reset`, `getState`, etc.) — unchanged.
- `s2-next` continue button — still gated on `metrics.extrusion`.

---

## Out of Scope (this iteration)

- Sweep, Extract, Boolean, Offset, Trim — buttons rendered dimmed, no logic.
- Unpaint individual faces — button rendered dimmed.
- Multi-zone per face, floor-level zone splitting.
- Undo/redo history across modes.
