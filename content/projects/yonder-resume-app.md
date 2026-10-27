---
title: Yonder Resume App
summary: A desktop résumé editor. Click the page to edit, export a PDF. The résumé never leaves your computer.
date: 2026-10-01
tags: [TypeScript, React, Vitest]
system:
  - "Résumé file: a .yonder file with JSON Résumé inside"
  - "Electron app: opens, saves and recovers files"
  - "Editor: click any text on the page to edit"
  - "Export: PDF that breaks where the page does"
sequence:
  - User -> Editor: open a file
  - Editor -> App: read .yonder
  - App -> Editor: résumé data
  - User -> Editor: edit on the page
  - Editor -> App: export PDF
decisions:
  - No server and no account. The only network call is an update check, which carries nothing about you.
  - Unsaved edits are recovered after a crash.
  - The PDF breaks pages at the same places the editor shows.
---

## The problem

Résumé builders want an account and keep your résumé on their server.

## What I built

- A desktop editor where you click the rendered page to change it
- Its own file type, with JSON Résumé inside, readable in any text editor
- Export to PDF, plain text or JSON

## The result

A résumé is a file on your computer, opened and saved like any other document.
