<!--
Anton's CAD resume, as facts for the "Ask about me" assistant. It reads this when a visitor is
hiring for CAD, EDA or electronics tooling. Keep it in sync with the CAD resume PDF. Leave out
the phone number and references.
-->

Title: Software Engineer for CAD (AI native)

Summary: Software engineer with 6 years of engineering experience across electronics and CAD software, the last 3 fully remote at SnapMagic, a Y Combinator-backed US startup, as the sole software engineer on the CAD team. Owned the CAD model download pipeline (symbols, footprints and 3D files), handling 10,000+ downloads a week with under 1% failures, and took over the 8+ year-old conversion backend after its original authors had left. Built LLM features with RAG and vector search over a 1M+ part database, and an autowiring system for schematics. Licensed Electronics Engineer.

## Software Engineer, SnapMagic (YC), full-time, remote, Apr 2023 to Mar 2026
- Sole software engineer on the CAD team, shipping full-stack features with a JavaScript front end and Django back end, including REST APIs and third-party integrations, prioritized from user interviews and partner feedback.
- Resolved about 15 tickets a week on average, from triage to production, helping keep Net Promoter Score above 60.
- Owned the CAD model download pipeline end to end, converting symbols, footprints and 3D files between CAD formats (units, coordinates, pad geometry), with failures under 1% across 10,000+ downloads a week.
- Fixed failures by type based on reports, adding retries for long-running conversions, validating generated models against datasheet values to the decimal, and keeping converted models consistent in the database.
- Designed and built customizable downloads, from the UI to the conversion logic behind it, so users could set pin naming, layer stacking and pin expansion before export instead of editing by hand in their CAD tool.
- Took over the 8+ year-old Python backend and Altium VBScript automation behind the core file-conversion service, keeping its 6 to 8 VMs at 99% uptime.
- Set up alerting so no VM stayed down longer than 30 minutes, fixed whatever broke, from replica lag to unreachable servers, and updated the team before anyone had to ask.
- Owned LLM pipelines end to end, from extracting structured data out of PDF datasheets to matching written requirements against a 1M+ part database with RAG and vector search.
- Traced endpoint slowdowns, mostly in search, through New Relic, and set up alerts on PostgreSQL table bloat so cleanup could run as soon as it grew.
- Wrote and indexed PostgreSQL queries used by 3 teams (CAD, go-to-market and software) for site-wide metrics reports, invoices, and investigations into NPS detractors and scraping.
- Owned deployment and monitoring on Heroku, Cloudflare and New Relic, protecting resource-heavy endpoints with caching, rate limiting, challenges and blocks for known bad traffic.
- Shipped every feature with unit and regression tests that gated its release.

## Python Programmer, data broker opt-out automation, part-time, Jan to Apr 2023
- Reverse-engineered the search and opt-out flows of data broker websites using Python and JavaScript.

## Associate Machine Learning Engineer, Analog Devices Philippines, full-time, Jun 2021 to Apr 2023
- Cut ADC/DAC tester cycle time by 20% by using ML to find and remove redundant test paths without reducing coverage, raising production throughput.

## Analog IC Design Engineer / AMS Design Verification Engineer, Analog Devices Philippines, full-time, Jan 2020 to Jun 2021
- Designed power circuits (voltage regulators and LDOs).
- Automated test-creation workflows in Python and wrote C/C++ verification scripts for automated test equipment (ATE) on Linux, confirming designs were ready for tapeout.

## Online Computer Science Teacher, US private school, part-time, Dec 2022 to Apr 2024
- Taught computer science to grades 6 to 12 online.

## Projects
- End-to-End Model Series Conversion (SnapMagic, 2024): an on-demand pipeline that generates CAD models for a partner's 10,000+ part series the moment a user views a part, with no human in the loop, delivered through a widget embedded on the partner's site. Anton designed the embed UI, wired the page-visit trigger, parsed part-number variations into the parameters that drive each variant's geometry, fanned out to a 2D converter producing symbols and footprints for Altium, OrCAD, KiCad and others, and automated FreeCAD on a dedicated Azure VM to produce 3D STEP files.
- Circuit Autowire (SnapMagic, 2025): an autowiring system that replaced a fully manual CAD step by generating pin-to-pin connections between schematic components, as part of the LLM-driven schematic generation pipeline. Owned end to end from problem framing to production. Prototyped several routing approaches, chose a pathfinding method, and encoded the rules engineers follow by hand: routing around components and wires, junctions versus jumpers where paths cross, and minimal bends so the output looks hand drawn.
- Amazon Product Research Automation (freelance, 2024): a Python tool that analyzes up to 200,000 products per spreadsheet with parallel workers, on AWS EC2 with Redis and Celery. Won a follow-up contract.

## Skills
- Languages: JavaScript, TypeScript, Python, SQL, C/C++
- Frontend: React, Next.js, HTML/CSS, Tailwind CSS
- Backend: Python, Django, Node.js, PostgreSQL, Supabase, REST APIs, third-party API integrations
- Infra and ops: Linux, Docker, Cloudflare, Heroku, New Relic, Azure VMs, Git, CI, n8n, AWS (EC2), Redis, Celery
- AI: LLM integration, RAG, embeddings, vector search, Claude Code with custom skills for specs, development and validation, Orca for orchestrating parallel coding agents
- Testing: unit and regression suites, Vitest, Playwright
- CAD formats and tools: Altium (including VBScript automation), OrCAD, KiCad, FreeCAD, schematic symbols, PCB footprints, 3D STEP models

## Education, licenses and awards
- BS in Electronics Engineering, Holy Angel University, 2019. Dean's and President's Lister, Best Thesis, Best Presenter, Most Outstanding Electronics Engineering Student.
- Licensed Electronics Engineer (ECE) and Licensed Electronics Technician (ECT), Professional Regulation Commission, Apr 2019.
- Spot Award, Analog Devices, 2021, for cutting ADC/DAC tester cycle time by 20%.
