---
title: Amazon product research
summary: A Python tool that scores Amazon products in bulk from a spreadsheet, for profitability, sales rank and competition. Up to 200,000 products per sheet.
date: 2024-09-01
tags: [Python, Redis, Celery, AWS]
home: true
system:
  - "Upload API: a sheet of up to 200,000 products"
  - "Redis queue: holds the work for the workers"
  - "Celery workers: profit, sales rank and competition"
  - "Email: results sent to the client"
sequence:
  - Client -> API: upload sheet
  - API -> Redis: queue products
  - Redis -> Workers: next batch
  - Workers -> Workers: score products
  - Workers -> Email: results
  - Email -> Client: results by email
decisions:
  - Workers run in parallel, which took it from a 30,000-product brief to 200,000 per sheet.
  - Uploads go through an API and results come back by email, so the client never logs into the server.
  - It won a follow-up contract for sales history and seller analysis, which I supported for 2 months.
---

## The problem

The client researched Amazon products one at a time. A sheet of candidates took days to work through.

## What I built

- A Python tool that scores every product in a sheet for profitability, sales rank and competition
- Parallel workers on AWS EC2 with a Redis and Celery queue
- Uploads by API, results by email

## The result

Up to 200,000 products per sheet, from a brief that asked for 30,000.
