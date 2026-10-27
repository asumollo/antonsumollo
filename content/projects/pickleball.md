---
title: Pickleball open play
summary: Runs pickleball open-play sessions across 3 to 4 courts and 16 to 30 players. Fairness is counted in court minutes, so whoever the session owes most plays next.
date: 2026-10-02
tags: [TypeScript, React, PostgreSQL, Vitest]
live: https://pickleball-eta-flame.vercel.app
home: true
system:
  - [Operator: runs the courts, Player phones: claim a name and report scores]
  - "Next.js API: checks every request"
  - "Postgres functions: one function is one transaction"
  - "Live updates: Server-Sent Events to every device"
sequence:
  - Operator -> API: end game
  - API -> Postgres: append_event
  - Postgres -> Postgres: lock and write
  - Postgres -> API: new event
  - API -> Devices: push over SSE
decisions:
  - The queue counts court minutes, not games played, and picks whoever the session owes most.
  - Every write is a plpgsql function in one transaction, and a row lock serializes two devices ending the same game.
  - The session is an event log replayed by a pure reducer, so any device can rebuild it.
---

## The problem

At open play, whoever stands near the paddle rack plays more. Counting games doesn't fix it,
because games run different lengths.

## What I built

- A queue that tracks court minutes owed to each player
- An event log in Postgres, written only through database functions
- Live updates to every phone over Server-Sent Events, with players reporting their own scores

## The result

The operator runs the courts from one screen, and players see when they're up next.
