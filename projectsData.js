window.FACADE_DB = {
  "meta": {
    "organisation": "Design Studio",
    "version": "1.0",
    "last_updated": "2026-04-28",
    "description": "Facade Playbook - past project database with embedded facade system catalogue"
  },
  "projects": [
    {
      "id": "Project-001",
      "name": "Al Reef Downtown Tower C",
      "location": "Abu Dhabi",
      "year_completed": 2021,
      "type": "residential_apartment",
      "floors": 28,
      "gfa_m2": 42000,
      "facade_area_m2": 14800,
      "budget_tier": "bronze",
      "cost_per_m2_aed": 1050,
      "zones": [
        "tower",
        "podium"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "stick_cw",
          "system_label": "Stick curtain wall",
          "manufacturer": "Schüco",
          "product": "FW 50+",
          "module_width_mm": 1200,
          "floor_height_mm": 3200,
          "geometry": "flat",
          "repetition": "high",
          "glazing_type": "DGU",
          "glazing_spec": "6/12/6 low-e",
          "u_value": 1.6,
          "shgc": 0.23,
          "vlt": 0.38,
          "acoustic_rw_db": 34,
          "fire_class": "A2",
          "air_permeability": "A3",
          "water_tightness": "RE2",
          "fixing_type": "cast_in_channel",
          "wind_pressure_pa": 1400,
          "frame_finish": "PVDF",
          "frame_colour": "RAL 9006"
        },
        {
          "zone": "podium",
          "system": "rainscreen",
          "system_label": "Rainscreen cladding",
          "manufacturer": "Trespa",
          "product": "Meteon A-Grade",
          "panel_material": "HPL",
          "fire_class": "A2",
          "fixing_type": "drilled_anchor",
          "frame_finish": "powder_coat",
          "frame_colour": "RAL 7016"
        }
      ],
      "subcontractors": [
        {
          "package": "Stick CW",
          "name": "Al Ghurair Glass",
          "rating": 4,
          "notes": "Reliable, competitive, good QA"
        },
        {
          "package": "Rainscreen",
          "name": "Emirates Facade LLC",
          "rating": 3,
          "notes": "Acceptable quality, some delays"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "davit_arms"
      ],
      "design_life_years": 40,
      "lessons_learned": [
        "Thermal breaks on mullions were omitted in initial design — retrofit cost AED 180k. Always specify from outset.",
        "Wind pressure test at 1,400 Pa — specify RE2 water tightness minimum for this height range.",
        "Slab tolerance Class C required 20mm packer adjustment — allow for this in fixing bracket design.",
        "Spandrel insulation depth was underspecified, causing cold bridging at slab edge.",
        "Allow minimum 14 weeks fabrication lead time for Schüco systems from UAE distributor."
      ],
      "tags": [
        "high-repetition",
        "flat-geometry",
        "cost-efficient",
        "thermal-bridge-risk"
      ]
    },
    {
      "id": "ZFC-002",
      "name": "Bloom Living Cordoba Block B",
      "location": "Abu Dhabi",
      "year_completed": 2022,
      "type": "residential_apartment",
      "floors": 12,
      "gfa_m2": 18500,
      "facade_area_m2": 7200,
      "budget_tier": "bronze",
      "cost_per_m2_aed": 980,
      "zones": [
        "tower",
        "podium",
        "retail"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "stick_cw",
          "system_label": "Stick curtain wall",
          "manufacturer": "Technal",
          "product": "MX",
          "module_width_mm": 1200,
          "module_width_note": "900–1500mm mixed",
          "floor_height_mm": 3000,
          "geometry": "flat_with_angled_returns",
          "repetition": "medium",
          "glazing_type": "DGU",
          "glazing_spec": "6/14/6 low-e",
          "u_value": 1.4,
          "shgc": 0.22,
          "vlt": 0.35,
          "acoustic_rw_db": 36,
          "fire_class": "A2",
          "air_permeability": "A3",
          "water_tightness": "RE2",
          "fixing_type": "cast_in_channel",
          "wind_pressure_pa": 1200,
          "frame_finish": "PVDF",
          "frame_colour": "RAL 9010"
        },
        {
          "zone": "retail",
          "system": "stick_cw",
          "system_label": "Stick curtain wall (retail)",
          "manufacturer": "Technal",
          "product": "MX Retail",
          "module_width_mm": 1500,
          "floor_height_mm": 4200,
          "geometry": "flat",
          "repetition": "high",
          "glazing_type": "DGU",
          "glazing_spec": "8/14/8 low-e clear",
          "u_value": 1.3,
          "shgc": 0.28,
          "vlt": 0.52,
          "fire_class": "A1",
          "frame_finish": "anodised",
          "frame_colour": "Natural silver"
        }
      ],
      "subcontractors": [
        {
          "package": "Stick CW all zones",
          "name": "Emirates Glass",
          "rating": 4,
          "notes": "Good programme management, slight issue with retail transom alignment"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "davit_arms",
        "mewp"
      ],
      "design_life_years": 40,
      "lessons_learned": [
        "Mixed module widths (900–1500mm) increased fabrication complexity significantly — standardise to max 2 widths.",
        "Podium to tower interface required a bespoke transition detail — allow minimum 3 weeks extra design time.",
        "Retail zone specified clear glass for visibility but SHGC 0.28 caused solar glare complaints post-occupancy.",
        "Angled return corners required custom fabricated corner mullions — add 6 weeks to corner unit lead time.",
        "Technal MX local stock was limited — order long-lead extrusions at RIBA Stage 3."
      ],
      "tags": [
        "mixed-module-widths",
        "podium-tower-interface",
        "retail-zone",
        "angled-returns"
      ]
    },
    {
      "id": "ZFC-003",
      "name": "Saadiyat Grove Residential Plot 4",
      "location": "Abu Dhabi",
      "year_completed": 2023,
      "type": "residential_apartment",
      "floors": 18,
      "gfa_m2": 28000,
      "facade_area_m2": 10500,
      "budget_tier": "silver",
      "cost_per_m2_aed": 1320,
      "zones": [
        "tower",
        "roof_crown"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "stick_cw",
          "system_label": "Stick curtain wall",
          "manufacturer": "Hydro",
          "product": "HP 178",
          "module_width_mm": 1350,
          "floor_height_mm": 3400,
          "geometry": "flat",
          "repetition": "high",
          "glazing_type": "TGU",
          "glazing_spec": "6/12/4/12/6 low-e",
          "u_value": 1.1,
          "shgc": 0.2,
          "vlt": 0.32,
          "acoustic_rw_db": 40,
          "fire_class": "A2",
          "air_permeability": "A2",
          "water_tightness": "RE3",
          "fixing_type": "thermally_broken_bracket",
          "wind_pressure_pa": 1600,
          "frame_finish": "PVDF",
          "frame_colour": "RAL 7035"
        },
        {
          "zone": "roof_crown",
          "system": "unitised_cw",
          "system_label": "Unitised curtain wall (crown)",
          "manufacturer": "Reynaers",
          "product": "CS 77",
          "module_width_mm": 1500,
          "floor_height_mm": 3400,
          "geometry": "faceted",
          "repetition": "medium",
          "glazing_type": "TGU",
          "glazing_spec": "6/12/4/12/6 low-e",
          "u_value": 1,
          "shgc": 0.19,
          "fire_class": "A2",
          "frame_finish": "PVDF",
          "frame_colour": "RAL 9007"
        }
      ],
      "subcontractors": [
        {
          "package": "Stick CW tower",
          "name": "Facade Arabia",
          "rating": 5,
          "notes": "Excellent QA, on programme, best performance in ZFC portfolio"
        },
        {
          "package": "Unitised CW crown",
          "name": "Gulf Curtain Wall",
          "rating": 3,
          "notes": "Crown package late by 4 weeks, interface coordination issues"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "bmu"
      ],
      "design_life_years": 40,
      "lessons_learned": [
        "TGU uplift pushed cost above standard budget — TGU only justified if Estidama Pearl 2+ is a project requirement.",
        "Crown feature zone drove 22% cost premium on top 3 floors — always procure crown as a separate package.",
        "Faceted crown geometry with unitised system required early BIM coordination — start crown package 8 weeks before tower.",
        "Facade Arabia delivered best results in ZFC portfolio — preferred subcontractor for future residential stick CW.",
        "Thermally broken brackets essential for TGU spec — standard mild steel brackets caused condensation risk."
      ],
      "tags": [
        "tgu-glazing",
        "crown-zone",
        "high-performance",
        "preferred-subcontractor-facade-arabia"
      ]
    },
    {
      "id": "ZFC-004",
      "name": "Reem Island Commercial Tower",
      "location": "Abu Dhabi",
      "year_completed": 2022,
      "type": "commercial",
      "floors": 35,
      "gfa_m2": 58000,
      "facade_area_m2": 22000,
      "budget_tier": "silver",
      "cost_per_m2_aed": 1650,
      "zones": [
        "tower",
        "podium",
        "roof_crown"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "unitised_cw",
          "system_label": "Unitised curtain wall",
          "manufacturer": "Schüco",
          "product": "UCC 65",
          "module_width_mm": 1500,
          "floor_height_mm": 3600,
          "geometry": "flat",
          "repetition": "high",
          "glazing_type": "DGU",
          "glazing_spec": "8/16/8 low-e argon",
          "u_value": 1.3,
          "shgc": 0.21,
          "vlt": 0.36,
          "acoustic_rw_db": 38,
          "fire_class": "A2",
          "air_permeability": "A2",
          "water_tightness": "RE3",
          "fixing_type": "cast_in_channel",
          "wind_pressure_pa": 1800,
          "frame_finish": "PVDF",
          "frame_colour": "RAL 9005"
        }
      ],
      "subcontractors": [
        {
          "package": "Unitised CW",
          "name": "Permasteelisa Gulf",
          "rating": 5,
          "notes": "Premium contractor, tight QA, higher cost but zero defects"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "bmu",
        "davit_arms"
      ],
      "design_life_years": 60,
      "lessons_learned": [
        "Unitised system allowed fast installation — saved 6 weeks on programme vs equivalent stick system.",
        "Argon-filled DGU spec requires sealed unit warranty certification — confirm with glass supplier at tender.",
        "BMU track coordination with structural engineer must happen at Stage 2 — late coordination caused 3-week delay.",
        "PVDF RAL 9005 (black) retained high surface temperature — consider lighter colours for west-facing facades."
      ],
      "tags": [
        "unitised",
        "fast-programme",
        "commercial",
        "bmu-required",
        "dark-colour-heat-gain"
      ]
    },
    {
      "id": "ZFC-005",
      "name": "Yas Bay Waterfront Mixed-Use Block A",
      "location": "Abu Dhabi",
      "year_completed": 2023,
      "type": "mixed_use",
      "floors": 22,
      "gfa_m2": 38000,
      "facade_area_m2": 16000,
      "budget_tier": "platinum",
      "cost_per_m2_aed": 2200,
      "zones": [
        "tower",
        "podium",
        "lobby",
        "amenity_deck"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "unitised_cw",
          "system_label": "Unitised curtain wall",
          "manufacturer": "Reynaers",
          "product": "CS 86-HI",
          "module_width_mm": 1600,
          "floor_height_mm": 3800,
          "geometry": "single_curved",
          "repetition": "medium",
          "glazing_type": "TGU",
          "glazing_spec": "6/12/4/12/6 low-e argon",
          "u_value": 0.9,
          "shgc": 0.18,
          "vlt": 0.3,
          "acoustic_rw_db": 42,
          "fire_class": "A1",
          "air_permeability": "A1",
          "water_tightness": "RE3",
          "fixing_type": "thermally_broken_bracket",
          "wind_pressure_pa": 2000,
          "frame_finish": "PVDF",
          "frame_colour": "RAL 9003"
        },
        {
          "zone": "amenity_deck",
          "system": "louvre_screen",
          "system_label": "Louvre / screen",
          "manufacturer": "Hunter Douglas",
          "product": "Architectural louvres",
          "panel_material": "extruded_aluminium",
          "control": "fixed_angle",
          "frame_finish": "PVDF",
          "frame_colour": "RAL 1001"
        }
      ],
      "subcontractors": [
        {
          "package": "Unitised CW",
          "name": "Permasteelisa Gulf",
          "rating": 5,
          "notes": "Handled complex curved geometry well"
        },
        {
          "package": "Louvre screen",
          "name": "Al Masah Facades",
          "rating": 4,
          "notes": "Good delivery, minor alignment issues on upper levels"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "bmu",
        "rope_access"
      ],
      "design_life_years": 60,
      "lessons_learned": [
        "Single-curved unitised panels required 3D mock-up approval from authority — allow 8 weeks for mock-up process.",
        "TGU with argon fill at 0.9 W/m²K required Estidama documentation — prepare early.",
        "Louvre screen alignment critical at amenity level — establish laser survey control points before installation.",
        "Waterfront location increased salt spray exposure — specify enhanced sealant spec and annual inspection regime."
      ],
      "tags": [
        "curved-geometry",
        "high-performance",
        "waterfront",
        "louvre-screen",
        "tgu-argon"
      ]
    },
    {
      "id": "ZFC-006",
      "name": "Khalidiyah Street Office Retrofit",
      "location": "Abu Dhabi",
      "year_completed": 2020,
      "type": "commercial",
      "floors": 10,
      "gfa_m2": 12000,
      "facade_area_m2": 4800,
      "budget_tier": "bronze",
      "cost_per_m2_aed": 890,
      "zones": [
        "tower"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "window_wall",
          "system_label": "Window wall",
          "manufacturer": "Aluk",
          "product": "58BW",
          "module_width_mm": 1800,
          "floor_height_mm": 3000,
          "geometry": "flat",
          "repetition": "high",
          "glazing_type": "DGU",
          "glazing_spec": "6/12/6 low-e reflective",
          "u_value": 1.7,
          "shgc": 0.25,
          "vlt": 0.28,
          "acoustic_rw_db": 32,
          "fire_class": "A2",
          "air_permeability": "A3",
          "water_tightness": "RE1",
          "fixing_type": "drilled_anchor",
          "wind_pressure_pa": 1000,
          "frame_finish": "powder_coat",
          "frame_colour": "RAL 7040"
        }
      ],
      "subcontractors": [
        {
          "package": "Window wall",
          "name": "Alnoor Glass Works",
          "rating": 3,
          "notes": "Budget option, adequate quality, limited technical support"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "mewp"
      ],
      "design_life_years": 25,
      "lessons_learned": [
        "Window wall system on retrofit — existing slab edge condition was poor, required significant remediation.",
        "Reflective DGU caused glare complaints from adjacent building — use selective low-e coating instead.",
        "RE1 water tightness was borderline for 10-storey height — specify RE2 minimum on future projects.",
        "Drilled-in anchors in existing RC required pull-out testing on every 5th fixing — add to spec."
      ],
      "tags": [
        "retrofit",
        "window-wall",
        "low-rise",
        "budget-conscious",
        "existing-structure"
      ]
    },
    {
      "id": "ZFC-007",
      "name": "Mohamed Bin Zayed City Villa Community",
      "location": "Abu Dhabi",
      "year_completed": 2021,
      "type": "residential_villa",
      "floors": 3,
      "gfa_m2": 45000,
      "facade_area_m2": 28000,
      "budget_tier": "bronze",
      "cost_per_m2_aed": 750,
      "zones": [
        "podium",
        "amenity_deck"
      ],
      "systems": [
        {
          "zone": "podium",
          "system": "rainscreen",
          "system_label": "Rainscreen cladding",
          "manufacturer": "Equitone",
          "product": "Tectiva",
          "panel_material": "fibre_cement",
          "fire_class": "A2",
          "fixing_type": "drilled_anchor",
          "frame_finish": "galvanised",
          "frame_colour": "N/A"
        },
        {
          "zone": "amenity_deck",
          "system": "precast_panel",
          "system_label": "Precast concrete panel",
          "manufacturer": "Emirates Precast",
          "product": "Standard architectural precast",
          "finish": "exposed_aggregate",
          "fire_class": "A1",
          "fixing_type": "cast_in_channel",
          "module_width_mm": 2400,
          "module_height_mm": 900,
          "struct_role": "non_structural"
        }
      ],
      "subcontractors": [
        {
          "package": "Rainscreen",
          "name": "Al Masah Facades",
          "rating": 4,
          "notes": "Consistent, good value for villa-scale projects"
        },
        {
          "package": "Precast",
          "name": "Emirates Precast Construction",
          "rating": 4,
          "notes": "Good quality control, early order essential"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "mewp"
      ],
      "design_life_years": 40,
      "lessons_learned": [
        "Precast panel colour consistency across 200+ units required strict batch control — specify from single pour.",
        "Fibre cement panels in exposed coastal zone showed early staining — apply hydrophobic treatment at factory.",
        "Villa scale projects benefit from rainscreen over curtain wall — simpler installation, lower risk.",
        "Exposed aggregate finish required 3 sample approvals — start sample process at Stage 3."
      ],
      "tags": [
        "low-rise",
        "villa",
        "rainscreen",
        "precast",
        "coastal-exposure"
      ]
    },
    {
      "id": "ZFC-008",
      "name": "Corniche Road Commercial Office",
      "location": "Abu Dhabi",
      "year_completed": 2024,
      "type": "commercial",
      "floors": 45,
      "gfa_m2": 72000,
      "facade_area_m2": 30000,
      "budget_tier": "gold",
      "cost_per_m2_aed": 2800,
      "zones": [
        "tower",
        "roof_crown",
        "podium"
      ],
      "systems": [
        {
          "zone": "tower",
          "system": "unitised_cw",
          "system_label": "Unitised curtain wall",
          "manufacturer": "Schüco",
          "product": "UCC 65 SG",
          "module_width_mm": 1500,
          "floor_height_mm": 4000,
          "geometry": "flat",
          "repetition": "high",
          "glazing_type": "TGU",
          "glazing_spec": "8/12/4/12/8 SGP low-e",
          "u_value": 0.8,
          "shgc": 0.17,
          "vlt": 0.28,
          "acoustic_rw_db": 44,
          "fire_class": "A1",
          "air_permeability": "A1",
          "water_tightness": "REX",
          "fixing_type": "thermally_broken_bracket",
          "wind_pressure_pa": 2500,
          "frame_finish": "PVDF",
          "frame_colour": "RAL 9010"
        },
        {
          "zone": "roof_crown",
          "system": "double_skin",
          "system_label": "Double-skin facade",
          "manufacturer": "Bespoke",
          "product": "Shaft-box DSF",
          "cavity_type": "shaft_box",
          "inner_glazing": "TGU 6/12/4/12/6",
          "outer_screen": "Fritted glass panels",
          "fire_class": "A1",
          "wind_pressure_pa": 3000
        }
      ],
      "subcontractors": [
        {
          "package": "Unitised CW + DSF",
          "name": "Permasteelisa Gulf",
          "rating": 5,
          "notes": "Only contractor capable of DSF at this scale in UAE — sole source"
        }
      ],
      "authority": "Abu Dhabi Civil Defence",
      "access_method": [
        "bmu",
        "rope_access"
      ],
      "design_life_years": 60,
      "lessons_learned": [
        "SGP interlayer in TGU is critical for post-breakage retention at 45F height — do not value engineer out.",
        "Double-skin facade cavity cleaning access was underspecified — add dedicated maintenance walkway to inner skin.",
        "REX water tightness test required specialist third-party facility — allow 10 weeks for testing programme.",
        "Permasteelisa is sole-source for DSF at this complexity in UAE — engage them at Stage 3 to influence buildability.",
        "High wind pressure at 45F required independent wind tunnel study — budget AED 180k for this."
      ],
      "tags": [
        "landmark",
        "double-skin",
        "high-wind",
        "sgp-glass",
        "sole-source-contractor"
      ]
    }
  ],
  "subcontractor_register": [
    {
      "name": "Permasteelisa Gulf",
      "speciality": [
        "unitised_cw",
        "double_skin"
      ],
      "tier": "gold",
      "min_budget": "silver",
      "contact": "enquiries@permasteelisa-gulf.com"
    },
    {
      "name": "Facade Arabia",
      "speciality": [
        "stick_cw",
        "unitised_cw"
      ],
      "tier": "silver",
      "min_budget": "bronze",
      "contact": "info@facadearabia.com"
    },
    {
      "name": "Al Ghurair Glass",
      "speciality": [
        "stick_cw",
        "window_wall"
      ],
      "tier": "silver",
      "min_budget": "bronze",
      "contact": "facades@alghurairglass.com"
    },
    {
      "name": "Emirates Glass",
      "speciality": [
        "stick_cw",
        "window_wall"
      ],
      "tier": "silver",
      "min_budget": "bronze",
      "contact": "info@emiratesglass.com"
    },
    {
      "name": "Gulf Curtain Wall",
      "speciality": [
        "unitised_cw",
        "stick_cw"
      ],
      "tier": "silver",
      "min_budget": "bronze",
      "contact": "info@gcw.ae"
    },
    {
      "name": "Al Masah Facades",
      "speciality": [
        "rainscreen",
        "louvre_screen"
      ],
      "tier": "silver",
      "min_budget": "bronze",
      "contact": "info@almasah.ae"
    },
    {
      "name": "Emirates Precast Construction",
      "speciality": [
        "precast_panel",
        "gfrc_panel"
      ],
      "tier": "silver",
      "min_budget": "bronze",
      "contact": "info@emiratesprecast.ae"
    },
    {
      "name": "Alnoor Glass Works",
      "speciality": [
        "window_wall",
        "stick_cw"
      ],
      "tier": "bronze",
      "min_budget": "bronze",
      "contact": "info@alnoorglass.ae"
    }
  ],
  "system_catalogue": {
    "stick_cw": {
      "label": "Stick curtain wall",
      "min_budget": "bronze",
      "suitable_zones": [
        "tower",
        "podium",
        "lobby",
        "balcony"
      ],
      "suitable_types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    "unitised_cw": {
      "label": "Unitised curtain wall",
      "min_budget": "silver",
      "suitable_zones": [
        "tower",
        "roof_crown",
        "penthouse",
        "lobby",
        "skylight"
      ],
      "suitable_types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    "window_wall": {
      "label": "Window wall",
      "min_budget": "bronze",
      "suitable_zones": [
        "tower",
        "balcony",
        "penthouse",
        "lobby"
      ],
      "suitable_types": [
        "residential_apartment",
        "mixed_use"
      ]
    },
    "rainscreen": {
      "label": "Rainscreen cladding",
      "min_budget": "bronze",
      "suitable_zones": [
        "podium",
        "carpark_screen",
        "amenity_deck",
        "feature_wall",
        "roof",
        "canopy"
      ],
      "suitable_types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    "precast_panel": {
      "label": "Precast concrete panel",
      "min_budget": "bronze",
      "suitable_zones": [
        "podium",
        "carpark_screen",
        "feature_wall",
        "canopy"
      ],
      "suitable_types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    "gfrc_panel": {
      "label": "GFRC panel",
      "min_budget": "silver",
      "suitable_zones": [
        "podium",
        "roof_crown",
        "feature_wall",
        "canopy",
        "fin"
      ],
      "suitable_types": [
        "commercial",
        "mixed_use"
      ]
    },
    "double_skin": {
      "label": "Double-skin facade",
      "min_budget": "gold",
      "suitable_zones": [
        "tower",
        "roof_crown",
        "penthouse",
        "skylight",
        "bridge"
      ],
      "suitable_types": [
        "commercial"
      ]
    },
    "louvre_screen": {
      "label": "Louvre / screen",
      "min_budget": "bronze",
      "suitable_zones": [
        "tower",
        "podium",
        "carpark_screen",
        "amenity_deck",
        "feature_wall",
        "mep_screen",
        "canopy",
        "roof",
        "fin"
      ],
      "suitable_types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    }
  },
  "facade_systems": [
    {
      "name": "Balustrade",
      "options": [
        {
          "label": "Floor-Mounted Metal Balustrade System",
          "tags": {
            "interface": [
              "Balcony edge",
              "Terrace edge",
              "Stair edge"
            ],
            "fixing": [
              "Base shoe",
              "Floor post"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Cable Railing Balustrade System",
          "tags": {
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ],
            "fixing": [
              "Top mounted shoe",
              "Floor post"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Stainless Steel Vertical Balustrade System",
          "tags": {
            "interface": [
              "Balcony edge",
              "Terrace edge",
              "Stair edge"
            ],
            "fixing": [
              "Base shoe",
              "Floor post"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Floor-Mounted Glazed Balustrade System",
          "tags": {
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ],
            "fixing": [
              "Base shoe",
              "Side-mounted bracket"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "MEWP",
              "BMU"
            ],
            "replacement": [
              "Panel swap-out",
              "Full system replacement"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Face-Mounted Glazed Balustrade System",
          "tags": {
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ],
            "fixing": [
              "Side-mounted bracket"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Full system replacement"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Face-Mounted Metal Balustrade System",
          "tags": {
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ],
            "fixing": [
              "Side-mounted bracket"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        },
        {
          "id": "fire",
          "q": "Fire and authority details",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Balcony edge",
          "tags": {
            "interface": [
              "Balcony edge"
            ],
            "panel_family": [
              "Floor-Mounted Metal Balustrade System",
              "Floor-Mounted Glazed Balustrade System",
              "Aluminium Swing Door System",
              "Lift and Slide Door System"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Slab edge",
          "tags": {
            "interface": [
              "Slab edge"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Stair edge",
          "tags": {
            "interface": [
              "Stair edge"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Terrace edge",
          "tags": {
            "interface": [
              "Terrace edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Base shoe",
          "tags": {
            "fixing": [
              "Base shoe"
            ],
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Top mounted shoe",
          "tags": {
            "fixing": [
              "Top mounted shoe"
            ],
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Side-mounted bracket",
          "tags": {
            "fixing": [
              "Side-mounted bracket"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Floor post",
          "tags": {
            "fixing": [
              "Floor post"
            ],
            "interface": [
              "Balcony edge",
              "Terrace edge"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A1 non-combustible",
          "tags": {
            "fire": [
              "A1 non-combustible"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A2 limited combustibility",
          "tags": {
            "fire": [
              "A2 limited combustibility"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "Fire engineer / authority sign-off",
          "tags": {
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access",
              "Internal access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver",
        "gold"
      ],
      "zones": [
        "balcony",
        "roof",
        "amenity_deck"
      ],
      "types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    {
      "name": "Wall Cladding",
      "options": [
        {
          "label": "Extruded Aluminium Profile System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge",
              "Projected slab edge"
            ],
            "panel_family": [
              "Extruded aluminium profile"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "fire": [
              "A1 non-combustible",
              "A2 limited combustibility"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Fiber Reinforced Concrete (GFRC) System",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Projected slab edge",
              "Retrofit overclad"
            ],
            "panel_family": [
              "GFRC panel"
            ],
            "fixing": [
              "Concealed bracket",
              "Secondary steel subframe",
              "Drilled anchor"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "fire": [
              "A1 non-combustible",
              "A2 limited combustibility"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Reinforced Acrylic (GRA) System",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Projected slab edge",
              "Retrofit overclad"
            ],
            "panel_family": [
              "GRA system"
            ],
            "fixing": [
              "Concealed bracket",
              "Secondary steel subframe",
              "Drilled anchor"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "fire": [
              "A2 limited combustibility",
              "Fire engineer / authority sign-off"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Exterior Insulation Finish System (EIFS)",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad",
              "Flush slab edge"
            ],
            "panel_family": [
              "EIFS"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary steel subframe"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "fire": [
              "A2 limited combustibility",
              "Fire engineer / authority sign-off"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Panel geometry",
          "note": ""
        },
        {
          "id": "repetition",
          "q": "Repetition strategy",
          "note": ""
        },
        {
          "id": "primary_structure",
          "q": "Primary structure type",
          "note": ""
        },
        {
          "id": "slab_edge",
          "q": "Slab edge condition",
          "note": ""
        },
        {
          "id": "panel_family",
          "q": "Panel families",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        },
        {
          "id": "fire",
          "q": "Fire and authority details",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "repetition",
          "label": "High repetition / standard bays",
          "tags": {
            "repetition": [
              "High repetition / standard bays"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "repetition",
          "label": "Moderate repetition / mixed bays",
          "tags": {
            "repetition": [
              "Moderate repetition / mixed bays"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "repetition",
          "label": "Low repetition / bespoke pieces",
          "tags": {
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Reinforced concrete frame",
          "tags": {
            "primary_structure": [
              "Reinforced concrete frame"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor",
              "Concealed bracket",
              "Base shoe",
              "Top mounted shoe"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ],
            "interface": [
              "Slab edge",
              "Balcony edge"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Steel frame",
          "tags": {
            "primary_structure": [
              "Steel frame"
            ],
            "fixing": [
              "Secondary steel subframe",
              "Concealed bracket",
              "Head track",
              "Post-installed anchor"
            ],
            "slab_edge": [
              "Projected slab edge"
            ],
            "performance": [
              "High-performance"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Composite frame",
          "tags": {
            "primary_structure": [
              "Composite frame"
            ],
            "fixing": [
              "Cast-in channel",
              "Secondary subframe",
              "Concealed bracket"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Loadbearing masonry",
          "tags": {
            "primary_structure": [
              "Loadbearing masonry"
            ],
            "fixing": [
              "Drilled anchor"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "slab_edge",
          "label": "Flush slab edge",
          "tags": {
            "slab_edge": [
              "Flush slab edge"
            ],
            "fixing": [
              "Cast-in channel",
              "Concealed bracket"
            ],
            "interface": [
              "Flush slab edge",
              "At slab edge"
            ]
          }
        },
        {
          "question_id": "slab_edge",
          "label": "Recessed slab edge",
          "tags": {
            "slab_edge": [
              "Recessed slab edge"
            ],
            "fixing": [
              "Concealed bracket",
              "Cast-in channel"
            ],
            "interface": [
              "Recessed slab edge",
              "At slab edge"
            ]
          }
        },
        {
          "question_id": "slab_edge",
          "label": "Projected slab edge",
          "tags": {
            "slab_edge": [
              "Projected slab edge"
            ],
            "fixing": [
              "Secondary steel subframe"
            ],
            "interface": [
              "Projected slab edge"
            ]
          }
        },
        {
          "question_id": "slab_edge",
          "label": "Retrofit overclad",
          "tags": {
            "slab_edge": [
              "Retrofit overclad"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Standard"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Extruded aluminium profile",
          "tags": {
            "panel_family": [
              "Extruded aluminium profile"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "GFRC panel",
          "tags": {
            "panel_family": [
              "GFRC panel"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "GRA system",
          "tags": {
            "panel_family": [
              "GRA system"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "EIFS",
          "tags": {
            "panel_family": [
              "EIFS"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary steel subframe",
          "tags": {
            "fixing": [
              "Secondary steel subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A1 non-combustible",
          "tags": {
            "fire": [
              "A1 non-combustible"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A2 limited combustibility",
          "tags": {
            "fire": [
              "A2 limited combustibility"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "Fire engineer / authority sign-off",
          "tags": {
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access",
              "Internal access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver"
      ],
      "zones": [
        "podium",
        "lobby",
        "feature_wall",
        "roof_crown",
        "canopy",
        "retail"
      ],
      "types": [
        "commercial",
        "mixed_use",
        "residential_apartment"
      ]
    },
    {
      "name": "Column Cladding",
      "options": [
        {
          "label": "Solid Metal Cladding",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Steel frame",
              "Composite frame"
            ],
            "panel_family": [
              "Metal wrap"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor",
              "Concealed bracket"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "Scaffold"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "carpark_screen",
              "amenity_deck",
              "roof",
              "roof_crown"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Fiber Reinforced Concrete (GFRC)",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Steel frame",
              "Composite frame"
            ],
            "panel_family": [
              "GFRC shell"
            ],
            "fixing": [
              "Concealed bracket",
              "Secondary subframe"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Reinforced Acrylic (GRA) System",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Steel frame",
              "Composite frame"
            ],
            "panel_family": [
              "GRA wrap"
            ],
            "fixing": [
              "Concealed bracket",
              "Secondary subframe"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Exterior Insulation Finish System (EIFS)",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame",
              "Loadbearing masonry"
            ],
            "panel_family": [
              "EIFS build-up"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "carpark_screen",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "primary_structure",
          "q": "Primary structure type",
          "note": ""
        },
        {
          "id": "panel_family",
          "q": "Panel families",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Reinforced concrete frame",
          "tags": {
            "primary_structure": [
              "Reinforced concrete frame"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor",
              "Concealed bracket",
              "Base shoe",
              "Top mounted shoe"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ],
            "interface": [
              "Slab edge",
              "Balcony edge"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Steel frame",
          "tags": {
            "primary_structure": [
              "Steel frame"
            ],
            "fixing": [
              "Secondary steel subframe",
              "Concealed bracket",
              "Head track",
              "Post-installed anchor"
            ],
            "slab_edge": [
              "Projected slab edge"
            ],
            "performance": [
              "High-performance"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Composite frame",
          "tags": {
            "primary_structure": [
              "Composite frame"
            ],
            "fixing": [
              "Cast-in channel",
              "Secondary subframe",
              "Concealed bracket"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "primary_structure",
          "label": "Loadbearing masonry",
          "tags": {
            "primary_structure": [
              "Loadbearing masonry"
            ],
            "fixing": [
              "Drilled anchor"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Metal wrap",
          "tags": {
            "panel_family": [
              "Metal wrap"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "GFRC shell",
          "tags": {
            "panel_family": [
              "GFRC shell"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "GRA wrap",
          "tags": {
            "panel_family": [
              "GRA wrap"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "EIFS build-up",
          "tags": {
            "panel_family": [
              "EIFS build-up"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary subframe",
          "tags": {
            "fixing": [
              "Secondary subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver"
      ],
      "zones": [
        "podium",
        "lobby",
        "feature_wall",
        "canopy",
        "retail"
      ],
      "types": [
        "commercial",
        "mixed_use",
        "residential_apartment"
      ]
    },
    {
      "name": "Slab Edge Cladding",
      "options": [
        {
          "label": "Solid Aluminium Cladding System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Standard edge modules",
              "Variable edge modules"
            ],
            "interface": [
              "Flush slab edge",
              "Recessed slab edge",
              "Capped slab edge"
            ],
            "panel_family": [
              "Solid aluminium cap"
            ],
            "fixing": [
              "Cast-in channel",
              "Concealed bracket"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "fire": [
              "A1 non-combustible",
              "A2 limited combustibility"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "amenity_deck",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Fiber Reinforced Concrete (GFRC) System",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "module_matrix": [
              "Variable edge modules",
              "Bespoke edge pieces"
            ],
            "interface": [
              "Recessed slab edge",
              "Capped slab edge",
              "Fire-stop at perimeter"
            ],
            "panel_family": [
              "GFRC edge panel"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary steel subframe"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "fire": [
              "A1 non-combustible",
              "A2 limited combustibility"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Reinforced Acrylic (GRA) System",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "module_matrix": [
              "Variable edge modules",
              "Bespoke edge pieces"
            ],
            "interface": [
              "Recessed slab edge",
              "Capped slab edge",
              "Fire-stop at perimeter"
            ],
            "panel_family": [
              "GRA edge panel"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary steel subframe"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "fire": [
              "A2 limited combustibility",
              "Fire engineer / authority sign-off"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "module_matrix",
          "q": "Module matrix",
          "note": ""
        },
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "panel_family",
          "q": "Panel families",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        },
        {
          "id": "fire",
          "q": "Fire and authority details",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Standard edge modules",
          "tags": {
            "module_matrix": [
              "Standard edge modules"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Variable edge modules",
          "tags": {
            "module_matrix": [
              "Variable edge modules"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Bespoke edge pieces",
          "tags": {
            "module_matrix": [
              "Bespoke edge pieces"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Flush slab edge",
          "tags": {
            "interface": [
              "Flush slab edge"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Recessed slab edge",
          "tags": {
            "interface": [
              "Recessed slab edge"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Capped slab edge",
          "tags": {
            "interface": [
              "Capped slab edge"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Fire-stop at perimeter",
          "tags": {
            "interface": [
              "Fire-stop at perimeter"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Solid aluminium cap",
          "tags": {
            "panel_family": [
              "Solid aluminium cap"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "GFRC edge panel",
          "tags": {
            "panel_family": [
              "GFRC edge panel"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "GRA edge panel",
          "tags": {
            "panel_family": [
              "GRA edge panel"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary steel subframe",
          "tags": {
            "fixing": [
              "Secondary steel subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A1 non-combustible",
          "tags": {
            "fire": [
              "A1 non-combustible"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A2 limited combustibility",
          "tags": {
            "fire": [
              "A2 limited combustibility"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "Fire engineer / authority sign-off",
          "tags": {
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access",
              "Internal access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver"
      ],
      "zones": [
        "podium",
        "balcony",
        "roof_crown",
        "amenity_deck"
      ],
      "types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    {
      "name": "Soffit Cladding",
      "options": [
        {
          "label": "Solid Aluminium Cladding System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "interface": [
              "Slab underside",
              "Beam underside",
              "Canopy edge"
            ],
            "panel_family": [
              "Solid aluminium"
            ],
            "fixing": [
              "Cast-in channel",
              "Concealed bracket"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "carpark_screen",
              "amenity_deck",
              "roof",
              "lobby",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Cement Board with Render Finish System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "interface": [
              "Slab underside",
              "Beam underside",
              "Service zone"
            ],
            "panel_family": [
              "Cement board / render"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Local repair / patching"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "carpark_screen",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "panel_family",
          "q": "Panel families",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Slab underside",
          "tags": {
            "interface": [
              "Slab underside"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Beam underside",
          "tags": {
            "interface": [
              "Beam underside"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Canopy edge",
          "tags": {
            "interface": [
              "Canopy edge"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Service zone",
          "tags": {
            "interface": [
              "Service zone"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Solid aluminium",
          "tags": {
            "panel_family": [
              "Solid aluminium"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Cement board / render",
          "tags": {
            "panel_family": [
              "Cement board / render"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Bespoke folded metal",
          "tags": {
            "panel_family": [
              "Bespoke folded metal"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary subframe",
          "tags": {
            "fixing": [
              "Secondary subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze"
      ],
      "zones": [
        "canopy",
        "bridge",
        "roof",
        "lobby",
        "retail"
      ],
      "types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    {
      "name": "Curtain Wall",
      "options": [
        {
          "label": "Aluminium Stick Curtain Wall Capped System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Stick curtain wall"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Aluminium Stick Curtain Wall Toggle System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Stick curtain wall"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Steel Mullion with Add-on Curtain Wall System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Stick curtain wall"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Glass Fin Curtain Wall System",
          "tags": {
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "module_matrix": [
              "Custom / curved module"
            ],
            "interface": [
              "At slab edge",
              "At exposed edge"
            ],
            "panel_family": [
              "SSG / spider glass"
            ],
            "fixing": [
              "Structural silicone / point fix"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Structural Silicone Glazed (SSG) - Stick System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "SSG / spider glass"
            ],
            "fixing": [
              "Structural silicone / point fix"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Unitised-Stick Hybrid (Semi-unitised) System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Unitised curtain wall"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Unitised Curtain Wall System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Unitised curtain wall"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Spider Glazing System",
          "tags": {
            "geometry": [
              "Curved / radiused",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Custom / curved module"
            ],
            "interface": [
              "At slab edge",
              "At exposed edge"
            ],
            "panel_family": [
              "SSG / spider glass"
            ],
            "fixing": [
              "Structural silicone / point fix"
            ],
            "performance": [
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement",
              "Local repair / patching"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Routel-Supported Glass System",
          "tags": {
            "geometry": [
              "Curved / radiused",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Custom / curved module"
            ],
            "interface": [
              "At slab edge",
              "At exposed edge"
            ],
            "panel_family": [
              "SSG / spider glass"
            ],
            "fixing": [
              "Structural silicone / point fix"
            ],
            "performance": [
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement",
              "Local repair / patching"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Cable-Net System",
          "tags": {
            "geometry": [
              "Curved / radiused",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Custom / curved module"
            ],
            "interface": [
              "At slab edge",
              "At exposed edge"
            ],
            "panel_family": [
              "SSG / spider glass"
            ],
            "fixing": [
              "Structural silicone / point fix"
            ],
            "performance": [
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement",
              "Local repair / patching"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Slab-to-Slab Window Wall System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Stick curtain wall"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "BMU",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Double Skin Facade System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Custom / curved module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "At slab edge"
            ],
            "panel_family": [
              "Hybrid facade"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Internal access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Adaptive/Dynamic Facade System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Custom / curved module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "At slab edge"
            ],
            "panel_family": [
              "Hybrid facade"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Internal access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Blast-Resistant Curtain Wall System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Hybrid facade"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "Landmark"
            ],
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "access": [
              "BMU",
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "carpark_screen",
              "lobby",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Fire-Rated Curtain Wall System",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "1200 - 1500 mm module",
              "1500 - 1800 mm module"
            ],
            "interface": [
              "Slab-to-slab",
              "Spandrel line",
              "At slab edge"
            ],
            "panel_family": [
              "Hybrid facade"
            ],
            "fixing": [
              "Cast-in channel",
              "Thermally broken bracket",
              "Post-installed anchor"
            ],
            "performance": [
              "Landmark"
            ],
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "access": [
              "BMU",
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "carpark_screen",
              "roof"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "module_matrix",
          "q": "Module matrix",
          "note": ""
        },
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "panel_family",
          "q": "Panel families",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        },
        {
          "id": "fire",
          "q": "Fire and authority details",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "1200 - 1500 mm module",
          "tags": {
            "module_matrix": [
              "1200 - 1500 mm module"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "1500 - 1800 mm module",
          "tags": {
            "module_matrix": [
              "1500 - 1800 mm module"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Custom / curved module",
          "tags": {
            "module_matrix": [
              "Custom / curved module"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Slab-to-slab",
          "tags": {
            "interface": [
              "Slab-to-slab"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Spandrel line",
          "tags": {
            "interface": [
              "Spandrel line"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "At slab edge",
          "tags": {
            "interface": [
              "At slab edge"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "At exposed edge",
          "tags": {
            "interface": [
              "At exposed edge"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Stick curtain wall",
          "tags": {
            "panel_family": [
              "Stick curtain wall"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Unitised curtain wall",
          "tags": {
            "panel_family": [
              "Unitised curtain wall"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Internal access"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "SSG / spider glass",
          "tags": {
            "panel_family": [
              "SSG / spider glass"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "panel_family",
          "label": "Hybrid facade",
          "tags": {
            "panel_family": [
              "Hybrid facade"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Thermally broken bracket",
          "tags": {
            "fixing": [
              "Thermally broken bracket"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Post-installed anchor",
          "tags": {
            "fixing": [
              "Post-installed anchor"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Structural silicone / point fix",
          "tags": {
            "fixing": [
              "Structural silicone / point fix"
            ],
            "geometry": [
              "Curved / radiused",
              "Faceted / stepped"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A1 non-combustible",
          "tags": {
            "fire": [
              "A1 non-combustible"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A2 limited combustibility",
          "tags": {
            "fire": [
              "A2 limited combustibility"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "Fire engineer / authority sign-off",
          "tags": {
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access",
              "Internal access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver",
        "gold"
      ],
      "zones": [
        "tower",
        "roof_crown",
        "penthouse",
        "lobby",
        "balcony",
        "skylight",
        "retail"
      ],
      "types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    {
      "name": "Entrance Door",
      "options": [
        {
          "label": "Pivot Door System",
          "tags": {
            "module_matrix": [
              "Single leaf",
              "Double leaf"
            ],
            "interface": [
              "Lobby interface",
              "External threshold"
            ],
            "fixing": [
              "Floor pivot",
              "Side hinges",
              "Concealed closer"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "amenity_deck",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Automatic Sliding Door System",
          "tags": {
            "module_matrix": [
              "Double leaf",
              "Wide opening"
            ],
            "interface": [
              "Lobby interface",
              "Air-lock / vestibule",
              "Security turnstile line"
            ],
            "fixing": [
              "Head track",
              "Concealed closer"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "lobby",
              "amenity_deck",
              "carpark_screen",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Revolving Door System",
          "tags": {
            "module_matrix": [
              "Wide opening"
            ],
            "interface": [
              "Air-lock / vestibule",
              "Security turnstile line"
            ],
            "fixing": [
              "Head track",
              "Concealed closer"
            ],
            "performance": [
              "Landmark"
            ],
            "access": [
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "gold"
            ],
            "zones": [
              "tower",
              "lobby",
              "podium",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "module_matrix",
          "q": "Module matrix",
          "note": ""
        },
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        },
        {
          "id": "fire",
          "q": "Fire and authority details",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "module_matrix",
          "label": "Single leaf",
          "tags": {
            "module_matrix": [
              "Single leaf"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Double leaf",
          "tags": {
            "module_matrix": [
              "Double leaf"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Wide opening",
          "tags": {
            "module_matrix": [
              "Wide opening"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Lobby interface",
          "tags": {
            "interface": [
              "Lobby interface"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "External threshold",
          "tags": {
            "interface": [
              "External threshold"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Air-lock / vestibule",
          "tags": {
            "interface": [
              "Air-lock / vestibule"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Security turnstile line",
          "tags": {
            "interface": [
              "Security turnstile line"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Floor pivot",
          "tags": {
            "fixing": [
              "Floor pivot"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Head track",
          "tags": {
            "fixing": [
              "Head track"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Side hinges",
          "tags": {
            "fixing": [
              "Side hinges"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed closer",
          "tags": {
            "fixing": [
              "Concealed closer"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A1 non-combustible",
          "tags": {
            "fire": [
              "A1 non-combustible"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A2 limited combustibility",
          "tags": {
            "fire": [
              "A2 limited combustibility"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "Fire engineer / authority sign-off",
          "tags": {
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access",
              "Internal access"
            ]
          }
        }
      ],
      "budgets": [
        "silver",
        "bronze",
        "gold"
      ],
      "zones": [
        "lobby",
        "canopy",
        "bridge",
        "retail"
      ],
      "types": [
        "commercial",
        "mixed_use",
        "residential_apartment"
      ]
    },
    {
      "name": "Balcony Door",
      "options": [
        {
          "label": "Aluminium Swing Door System",
          "tags": {
            "interface": [
              "Balcony threshold",
              "Tight sill",
              "Flush sill"
            ],
            "fixing": [
              "Hinges",
              "Concealed frame",
              "Threshold profile"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Lift and Slide Door System",
          "tags": {
            "interface": [
              "Balcony threshold",
              "Flush sill",
              "Weather seal line"
            ],
            "fixing": [
              "Slide track",
              "Threshold profile",
              "Concealed frame"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "Internal access"
            ],
            "replacement": [
              "Unit-by-unit replacement",
              "Panel swap-out"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "roof"
            ],
            "type": [
              "residential_apartment",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "interface",
          "label": "Balcony threshold",
          "tags": {
            "interface": [
              "Balcony threshold"
            ],
            "panel_family": [
              "Floor-Mounted Metal Balustrade System",
              "Floor-Mounted Glazed Balustrade System",
              "Aluminium Swing Door System",
              "Lift and Slide Door System"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Tight sill",
          "tags": {
            "interface": [
              "Tight sill"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Flush sill",
          "tags": {
            "interface": [
              "Flush sill"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Weather seal line",
          "tags": {
            "interface": [
              "Weather seal line"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Hinges",
          "tags": {
            "fixing": [
              "Hinges"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Slide track",
          "tags": {
            "fixing": [
              "Slide track"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed frame",
          "tags": {
            "fixing": [
              "Concealed frame"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Threshold profile",
          "tags": {
            "fixing": [
              "Threshold profile"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver"
      ],
      "zones": [
        "balcony",
        "penthouse",
        "amenity_deck"
      ],
      "types": [
        "residential_apartment",
        "mixed_use"
      ]
    },
    {
      "name": "Screen",
      "options": [
        {
          "label": "Mesh Screen",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Regular grid",
              "Variable rhythm"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ],
            "access": [
              "MEWP",
              "Rope access",
              "BMU"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "podium",
              "carpark_screen",
              "roof",
              "amenity_deck",
              "tower"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Frosted Glass",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Feature / patterned grid"
            ],
            "fixing": [
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "amenity_deck",
              "lobby",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "module_matrix",
          "q": "Module matrix",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        },
        {
          "id": "fire",
          "q": "Fire and authority details",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Regular grid",
          "tags": {
            "module_matrix": [
              "Regular grid"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Variable rhythm",
          "tags": {
            "module_matrix": [
              "Variable rhythm"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Feature / patterned grid",
          "tags": {
            "module_matrix": [
              "Feature / patterned grid"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary subframe",
          "tags": {
            "fixing": [
              "Secondary subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard",
          "tags": {
            "performance": [
              "Standard"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced",
          "tags": {
            "performance": [
              "Enhanced"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High-performance",
          "tags": {
            "performance": [
              "High-performance"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Landmark",
          "tags": {
            "performance": [
              "Landmark"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A1 non-combustible",
          "tags": {
            "fire": [
              "A1 non-combustible"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "A2 limited combustibility",
          "tags": {
            "fire": [
              "A2 limited combustibility"
            ]
          }
        },
        {
          "question_id": "fire",
          "label": "Fire engineer / authority sign-off",
          "tags": {
            "fire": [
              "Fire engineer / authority sign-off"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ],
            "access": [
              "BMU",
              "Rope access",
              "Internal access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver"
      ],
      "zones": [
        "carpark_screen",
        "mep_screen",
        "feature_wall",
        "roof",
        "fin",
        "canopy",
        "bridge"
      ],
      "types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    },
    {
      "name": "MEP Louver",
      "options": [
        {
          "label": "Vertical MEP Louver",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Narrow blade set",
              "Mixed blade set"
            ],
            "interface": [
              "Plant room opening",
              "MEP shaft opening",
              "Podium screening"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Ventilation-led",
              "Balanced"
            ],
            "access": [
              "MEWP",
              "BMU"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "carpark_screen",
              "roof",
              "podium",
              "amenity_deck",
              "tower"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Horizontal MEP Louver",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Wide blade set",
              "Mixed blade set"
            ],
            "interface": [
              "Roof screening",
              "Podium screening"
            ],
            "fixing": [
              "Cast-in channel",
              "Drilled anchor",
              "Secondary subframe"
            ],
            "performance": [
              "Balanced",
              "High shielding"
            ],
            "access": [
              "MEWP",
              "BMU"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "carpark_screen",
              "roof",
              "podium",
              "amenity_deck",
              "tower"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "module_matrix",
          "q": "Module matrix",
          "note": ""
        },
        {
          "id": "interface",
          "q": "Interface rules",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Narrow blade set",
          "tags": {
            "module_matrix": [
              "Narrow blade set"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Wide blade set",
          "tags": {
            "module_matrix": [
              "Wide blade set"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Mixed blade set",
          "tags": {
            "module_matrix": [
              "Mixed blade set"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "performance": [
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Plant room opening",
          "tags": {
            "interface": [
              "Plant room opening"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "MEP shaft opening",
          "tags": {
            "interface": [
              "MEP shaft opening"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Roof screening",
          "tags": {
            "interface": [
              "Roof screening"
            ]
          }
        },
        {
          "question_id": "interface",
          "label": "Podium screening",
          "tags": {
            "interface": [
              "Podium screening"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary subframe",
          "tags": {
            "fixing": [
              "Secondary subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Ventilation-led",
          "tags": {
            "performance": [
              "Ventilation-led"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Balanced",
          "tags": {
            "performance": [
              "Balanced"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High shielding",
          "tags": {
            "performance": [
              "High shielding"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Acoustic / fire-rated",
          "tags": {
            "performance": [
              "Acoustic / fire-rated"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "access": [
              "BMU",
              "Internal access",
              "Rope access"
            ]
          }
        }
      ],
      "budgets": [
        "bronze"
      ],
      "zones": [
        "mep_screen",
        "carpark_screen",
        "podium",
        "roof",
        "feature_wall"
      ],
      "types": [
        "commercial",
        "mixed_use"
      ]
    },
    {
      "name": "Louver Fin",
      "options": [
        {
          "label": "Extruded Aluminium Louver",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Slim fins",
              "Deep fins"
            ],
            "fixing": [
              "Cast-in channel",
              "Concealed bracket"
            ],
            "performance": [
              "Standard shading",
              "Enhanced shading",
              "High solar control"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "bronze"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "residential_apartment",
              "commercial",
              "mixed_use"
            ]
          }
        },
        {
          "label": "Cladded Metal Louver",
          "tags": {
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "module_matrix": [
              "Deep fins",
              "Feature fins"
            ],
            "fixing": [
              "Concealed bracket",
              "Secondary subframe"
            ],
            "performance": [
              "Enhanced shading",
              "High solar control"
            ],
            "access": [
              "MEWP",
              "Rope access"
            ],
            "replacement": [
              "Panel swap-out",
              "Unit-by-unit replacement"
            ],
            "budget": [
              "silver"
            ],
            "zones": [
              "tower",
              "podium",
              "roof_crown",
              "lobby",
              "amenity_deck",
              "roof",
              "retail"
            ],
            "type": [
              "commercial",
              "mixed_use"
            ]
          }
        }
      ],
      "questions": [
        {
          "id": "geometry",
          "q": "Geometry rules",
          "note": ""
        },
        {
          "id": "module_matrix",
          "q": "Module matrix",
          "note": ""
        },
        {
          "id": "fixing",
          "q": "Support and fixing families",
          "note": ""
        },
        {
          "id": "performance",
          "q": "Performance bands",
          "note": ""
        }
      ],
      "question_options": [
        {
          "question_id": "geometry",
          "label": "Flat / planar",
          "tags": {
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ],
            "module_matrix": [
              "High repetition / standard bay",
              "Standard modules",
              "Single leaf",
              "Regular grid"
            ],
            "performance": [
              "Standard",
              "Enhanced"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Faceted / stepped",
          "tags": {
            "geometry": [
              "Faceted / stepped"
            ],
            "repetition": [
              "Moderate repetition / mixed bays",
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Mixed modules / coordinated grid",
              "Variable modules",
              "Bespoke modules / special pieces"
            ],
            "performance": [
              "Enhanced",
              "High-performance"
            ]
          }
        },
        {
          "question_id": "geometry",
          "label": "Curved / radiused",
          "tags": {
            "geometry": [
              "Curved / radiused"
            ],
            "repetition": [
              "Low repetition / bespoke pieces"
            ],
            "module_matrix": [
              "Bespoke modules / special pieces",
              "Custom / curved module"
            ],
            "performance": [
              "High-performance",
              "Landmark"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Slim fins",
          "tags": {
            "module_matrix": [
              "Slim fins"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Deep fins",
          "tags": {
            "module_matrix": [
              "Deep fins"
            ]
          }
        },
        {
          "question_id": "module_matrix",
          "label": "Feature fins",
          "tags": {
            "module_matrix": [
              "Feature fins"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Cast-in channel",
          "tags": {
            "fixing": [
              "Cast-in channel"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Flush slab edge",
              "Recessed slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Drilled anchor",
          "tags": {
            "fixing": [
              "Drilled anchor"
            ],
            "primary_structure": [
              "Reinforced concrete frame",
              "Loadbearing masonry"
            ],
            "slab_edge": [
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Concealed bracket",
          "tags": {
            "fixing": [
              "Concealed bracket"
            ],
            "geometry": [
              "Faceted / stepped",
              "Curved / radiused"
            ],
            "slab_edge": [
              "Recessed slab edge",
              "Flush slab edge"
            ]
          }
        },
        {
          "question_id": "fixing",
          "label": "Secondary subframe",
          "tags": {
            "fixing": [
              "Secondary subframe"
            ],
            "primary_structure": [
              "Steel frame",
              "Composite frame"
            ],
            "slab_edge": [
              "Projected slab edge",
              "Retrofit overclad"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Standard shading",
          "tags": {
            "performance": [
              "Standard shading"
            ],
            "geometry": [
              "Flat / planar"
            ],
            "repetition": [
              "High repetition / standard bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "Enhanced shading",
          "tags": {
            "performance": [
              "Enhanced shading"
            ],
            "geometry": [
              "Flat / planar",
              "Faceted / stepped"
            ],
            "repetition": [
              "High repetition / standard bays",
              "Moderate repetition / mixed bays"
            ]
          }
        },
        {
          "question_id": "performance",
          "label": "High solar control",
          "tags": {
            "performance": [
              "High solar control"
            ]
          }
        }
      ],
      "budgets": [
        "bronze",
        "silver"
      ],
      "zones": [
        "fin",
        "feature_wall",
        "roof_crown",
        "tower",
        "bridge"
      ],
      "types": [
        "residential_apartment",
        "commercial",
        "mixed_use"
      ]
    }
  ]
};
