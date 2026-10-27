---
title: Circuit autowire
summary: Draws pin-to-pin wires in an LLM-driven schematic generator, following the rules engineers wire by. It replaced a manual CAD step.
date: 2025-06-01
tags: [Python]
repo: private
system:
  - "Schematic generator: an LLM places the parts"
  - "Autowire: decides which pins connect"
  - "Router: a pathfinding method with engineers' rules"
  - "Schematic: wired and ready for review"
decisions:
  - Several routing approaches were prototyped before choosing a pathfinding method.
  - Wires route around components and other wires.
  - Crossings become junctions or jumpers by rule, and bends are kept to a minimum.
---

## The problem

The schematic generator placed parts, but wiring them was still a manual CAD step.

## What I built

I owned the autowiring system end to end: it generates the pin-to-pin connections and routes
them the way an engineer would.

## The result

The manual wiring step is gone from the pipeline.
