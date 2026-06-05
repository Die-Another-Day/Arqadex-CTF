# ⚡ ARQADEX CTF PLATFORM
### ctf.arqadex.site — World-Class Competitive Intelligence Arena

> The complete CTF hosting and competition platform for the ARQADEX ecosystem.

---

## 🚀 Run the Demo

```bash
# Zero dependencies — open directly
open index.html

# Or serve locally
python3 -m http.server 8080
npx serve .
```

**Demo accounts** (click on login screen):
- 👤 **PARTICIPANT** — full competition experience
- ⚙️ **ORGANIZER** — full organizer dashboard

---

## 📁 Files

| File | Size | Purpose |
|---|---|---|
| `index.html` | 1.4KB | SPA shell — app container |
| `style.css` | 26KB | Complete design system — 300+ components |
| `app.js` | 89KB | Complete SPA — all views, routing, logic |
| `ARCHITECTURE.md` | — | Full production stack specification |

---

## 🗺️ All Platform Routes

```
#/                          Landing — hero, live event, scoreboard preview, stats
#/login                     Authentication
#/register                  Registration with role selection (Participant / Organizer)
#/dashboard                 Participant dashboard — solves, notifications, achievements
#/events                    All events — live, upcoming, past
#/event/:slug               Event detail — info, registration, results
#/compete/:slug             Competition interface — challenges, timer, live scoreboard sidebar
#/scoreboard/:slug          Full live scoreboard with category breakdown
#/team                      Team management — members, progress, invites
#/profile                   User profile — history, skill breakdown, achievements
#/organize                  Organizer home — overview, stats, active event controls
#/organize/create           Create event wizard — full settings + Integrity Shield config
#/organize/:slug/challenges Challenge manager — add/edit/hide challenges with flag upload
#/organize/:slug/anticheat  Integrity Shield — alerts, submission log, per-team flags
```

---

## 🏆 Platform Features

### For Participants
- **Competition Interface** — Challenge grid by category, difficulty stars, solve count, first blood indicators
- **Working Flag Submission** — Real validation with correct/incorrect feedback
- **Live Scoreboard** — Animated team rankings with category breakdown
- **Live Feed** — Real-time solve notifications, announcements, rank changes
- **Team Management** — Members, invite system, per-category progress
- **Achievement System** — 8 achievements, unlock on solve
- **User Profile** — Event history, skill radar, earned badges
- **Countdown Timer** — Synchronized across all views

### For Organizers
- **Event Creation** — Full wizard with all settings, Integrity Shield config
- **Challenge Manager** — Add/edit challenges, upload files, set per-team flags, mark as honeypot
- **Integrity Shield** — Real-time anti-cheat monitoring dashboard
- **Analytics** — Registration trends, solve rates by category
- **Activity Feed** — Live solve/submission/alert feed
- **Announcement System** — Send to all competing teams

### Anti-Cheat (Integrity Shield)
- **Per-team flag derivatives** — HMAC-SHA256 unique flag per team
- **IP clustering detection** — Flag teams sharing subnet
- **Submission rate limiting** — Auto-detect automated solvers
- **Timing correlation** — Alert on flag shared between teams within 60s
- **Honeypot challenges** — Trap for flag sharing detection
- **Submission log** — Full audit trail with IP, timestamp, team

---

## 🎮 Competition Demo

Login as **PARTICIPANT** then navigate to:
```
#/compete/arqadex-prime-2025
```

This shows the full competition interface:
- **Category tabs** — filter by Web, Pwn, Crypto, RE, OSINT, DFIR, Stego, Misc
- **Challenge cards** — click any to open challenge modal
- **Flag submission** — try the actual flags:
  - `ARQADEX{alg0_n0ne_byp4ss}` (JWT_NIGHTMARE)
  - `ARQADEX{exif_makernote_geo}` (METADATA_GHOST — already pre-solved)
  - `ARQADEX{spectrogram_signal}` (FREQUENCY_GHOST — already pre-solved)
- **Live sidebar** — scoreboard + live feed updating every 4-7 seconds
- **Timer** — real countdown

---

## ⚙️ Organizer Demo

Login as **ORGANIZER** then navigate to:
```
#/organize
```

Navigate through sidebar tabs:
- **OVERVIEW** — Platform stats, active event status, recent activity
- **INTEGRITY** — 🛡️ Anti-cheat alerts, per-team flag system, submission log
- **ANALYTICS** — Registration chart, solve rates by category

Then visit:
```
#/organize/arqadex-prime-2025/challenges  — Challenge manager
#/organize/arqadex-prime-2025/anticheat   — Full Integrity Shield
```

---

## 🏗️ Production Backend

See `ARCHITECTURE.md` for the complete technical specification:

- **Database schema** (PostgreSQL + Prisma) — all 10 models
- **API routes** — 25+ endpoints fully documented
- **WebSocket events** — real-time scoreboard, live feed, announcements
- **Anti-cheat implementation** — code examples for all 5 systems
- **Deployment guide** — Vercel + Railway + Neon + Upstash + Cloudflare R2

### Quick Stack Summary
```
Frontend:  Next.js 14 + TypeScript → Vercel
Backend:   Node.js + Express + Socket.io → Railway
Database:  PostgreSQL (Neon) + Redis (Upstash)
Files:     Cloudflare R2
Email:     Resend API
```

---

## 🎨 Design System

Matches ARQADEX ecosystem exactly:

| Token | Value |
|---|---|
| Background | `#020208` (primary) |
| Cyan | `#00F5FF` |
| Magenta | `#FF2DA6` |
| Purple | `#7A5CFF` |
| Lime | `#C7FF4D` |
| Orange | `#FF8800` |
| Font (display) | Orbitron |
| Font (data) | Space Mono |

**Category colors** (used throughout challenge grid, scoreboard, badges):
```
web=#00F5FF  pwn=#FF4444  crypto=#FF2DA6  re=#7A5CFF
osint=#C7FF4D  dfir=#FF8800  stego=#00FFAA  misc=#8888AA
```

---

## 📡 Subdomain Deployment

### Netlify (fastest for demo)
```bash
# Drag ctf-platform/ folder to netlify.com/drop
# Site Settings → Domain → ctf.arqadex.site
# DNS: CNAME ctf → your-site.netlify.app
```

### GitHub Pages
```bash
echo "ctf.arqadex.site" > CNAME
git add . && git commit -m "ctf platform" && git push
# Settings → Pages → main / root
# DNS: CNAME ctf → username.github.io
```

### Cloudflare Pages
```bash
# Connect repo → Build: none (static) → ctf.arqadex.site
```

---

*ARQADEX CTF DIVISION © 2025 — Built for chaos.*
