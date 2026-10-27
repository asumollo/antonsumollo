---
title: CAD file conversion
summary: The pipeline behind CAD model downloads at SnapMagic. It parses symbols, footprints and 3D models and converts them between CAD formats, with failures under 1% across 10,000+ downloads a week.
date: 2026-03-01
tags: [Python, Altium Designer, KiCad, OrCAD]
repo: private
featured: true
system:
  - "Download: a user picks a CAD format and output options"
  - "Parser: reads symbols, footprints and 3D files"
  - "Converter: maps units, coordinates and pad geometry"
  - [CAD tools: desktop CAD apps automated on a VM fleet, Validation: checks against datasheet values]
sequence:
  - User -> Backend: request download
  - Backend -> Converter: convert to format
  - Converter -> CAD VM: run CAD automation
  - CAD VM -> Converter: converted files
  - Converter -> Converter: validate output
  - Converter -> Backend: done or retry
  - Backend -> User: download
decisions:
  - Failures were fixed by type, so each fix closed a whole class of parts, not one part.
  - Long-running conversions retry instead of failing the download.
  - Alerting on the VM fleet keeps it at 99% uptime, with no VM down more than 30 minutes.
  - Output options (pin naming, layer stacking, pin expansion) built end to end, from the UI to the conversion logic.
---

## The problem

Engineers download a part's CAD model in the format their tool uses. Every format describes the
same part differently: units, coordinate systems, pad shapes. A model that converts wrong costs
the engineer a board respin.

## What I built

I owned the download and conversion pipeline end to end.

- Parsed symbols, footprints and 3D files and converted them between CAD formats
- Validated generated models against datasheet values, to the decimal
- Took over the 8+ year-old Python backend and CAD automation behind the core conversion service

## The result

Failures under 1% across 10,000+ downloads a week, on a fleet of 6 to 8 VMs at 99% uptime.
