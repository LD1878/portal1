# JUROSpain Living Visa Codex

Source-backed English operating manual for **two** Spanish residencies:

1. **International telework** (digital nomad) — Ley 14/2013 as amended, including Ley 28/2022; consular visa versus UGE-CE / Plataforma ONE residence if already lawfully in Spain.
2. **Non-lucrative temporary residence** — Ley Orgánica 4/2000 + Reglamento RD 1155/2024 arts. 61–64; consular visa + later TIE.

Entrepreneur, highly qualified, golden visa, student, arraigo and other permits are **out of scope**.

> Consolidated BOE text is informative; the official gazette publication is the only legally binding source.

## Source of truth

Law lives in `data/`, not in hand-written Markdown:

| Path | What it holds |
| --- | --- |
| `data/norms/` | BOE ID, title, rank, URLs, last-seen hash, in-force dates |
| `data/requirements/` | Requirement atoms (track, route, actor, topic) |
| `data/process-pages/` | Official procedure pages and the fields they may supply |
| `data/conflicts/` | Two official sources that disagree — the guide must show a banner |
| `data/indices/` | IPREM and SMI as **indices**, not as the visa statute |
| `data/checklists/` | Master packets in file order |

`guides/` is **generated** (`node scripts/generate-guides.mjs`). Do not hand-write law there.

## Money

Publish the legal formula only:

- Non-lucrative: **400% IPREM** (holder) + **100% IPREM** per family member, monthly, times the authorised period.
- Telework: **200% SMI** (holder) + **75% SMI** first family member + **25% SMI** each additional (joint instruction applying Ley 14/2013 art. 62.3.f).

Do not treat this year’s euro arithmetic as the statute. The SMI monthly conversion is an open conflict — see `data/conflicts/conflicts.json`.

## Update policy

- Weekday watcher: `.github/workflows/watch-boe.yml`.
- On change: update structured data + metadata. Safe metadata may auto-merge.
- Guide English goes through a pull request. Never a silent rewrite.
- If a source vanishes or conflicts: banner, and do not present a single rule.
- Repealed text is not published.

## Checks

```bash
node scripts/validate-codex.mjs
node scripts/generate-guides.mjs
node scripts/watch-boe.mjs --sample
```

CI fails if a guide citation points at a missing BOE ID, a non-official URL, or a conflict/repealed record without a banner.

## Visual design

`theme/jurospain.css` — paper, ink, oxblood. The published guide is a JUROSpain work, not a generic docs theme.

## Disclaimer

This codex is an operating manual generated from official records. It is not legal advice. The competent consulate, UGE-CE or extranjería file is the one that decides.
