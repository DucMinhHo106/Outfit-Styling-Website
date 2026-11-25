# SDD ledger — plan: docs/implementation-plan.md

Base: af034f120214650a91efae1ae186f76fe32649e2

Pre-flight: task 3 produces normalized catalog/template data consumed by task 4 matcher and task 5 picker; use selectedItemIds and templateId consistently. Task 6 owns storage consumed by global favorites and picker. Task 2 owns current catalog rendering.

Ruling: Work in a fresh dedicated clone on a feature branch instead of another worktree — project mirror has no Git repo and this clone isolates production — cost if wrong: separate checkout must be synchronized explicitly at release.

Ruling: Native execution with per-step verification and final independent review — user requested careful review at every step, no separate implementer needed — cost if wrong: per-step review shares author's context until final review.

Task 1: inspected baseline and original UI at 360×800 and 1280×800, server 8017, Node v22.23.4. No baseline automated test suite exists. Original branch clean before documentation copy.

Ruling: New templates use original vector clothing illustrations rather than unverified third-party photos — supports self-contained preview without claiming image rights — cost if wrong: illustrations are less realistic than model photography. Existing images remain subject to a production rights audit.
Task 2: complete — 3/3 regression tests PASS after RED; browser black + trang returned 0 and clear conditions. Hot Hits removed, old URL redirects to library. Favorites change events added; full persistence/UI review follows task 6.
Task 3: complete — 24 templates, 21 catalog items, original SVG sources; 4 data tests RED-to-GREEN. Image files and normalized references checked.
Task 4 matcher: complete — 8 matching tests RED-to-GREEN; exact, substitutions, missing, one-piece and unrelated/unknown selections checked.
Tasks 5-6: complete — 23/23 tests PASS. Browser one shirt -> missing items; full work outfit -> ready; save -> reload -> remove immediately -> count 0. Mobile 360 and desktop 1280 screenshots reviewed; no horizontal overflow at 360. Modal instructions and focus restore checked.
