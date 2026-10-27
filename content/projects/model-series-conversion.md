---
title: Model series conversion
summary: CAD models for a partner's 10,000+ part series, generated on demand when someone views a part. No human in the loop.
date: 2024-06-01
tags: [Python, Altium Designer, KiCad, OrCAD]
repo: private
system:
  - "Part page: a visitor opens a part on the partner site"
  - "Part number parser: turns each variation into parameters"
  - [2D converter: schematic symbols and PCB footprints, FreeCAD on a VM: 3D STEP models]
  - "Widget: shows the models on the partner site"
sequence:
  - Visitor -> Widget: open a part
  - Widget -> Pipeline: generate models
  - Pipeline -> Pipeline: parse part number
  - Pipeline -> 2D converter: symbol, footprint
  - Pipeline -> FreeCAD VM: 3D STEP
  - Pipeline -> Widget: models ready
decisions:
  - A page visit triggers generation, so there is no request queue and no human in the loop.
  - FreeCAD has no headless mode, so the desktop app runs automated on a dedicated VM.
  - One parser turns every part number variation into the parameters that drive the geometry.
---

## The problem

A partner had a part series with more than 10,000 variations. Drawing a CAD model for each one by
hand was never going to happen.

## What I built

- Parsed part number variations into the parameters that drive each model's geometry
- Fanned out to a 2D converter for symbols and footprints (Altium, OrCAD, KiCad and others) and to
  FreeCAD for 3D STEP files
- Designed the widget that embeds the models on the partner's site

## The result

Every part in the series has CAD models the first time someone looks at it.
