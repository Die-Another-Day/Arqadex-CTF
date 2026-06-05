# ARQADEX CTF PLATFORM — Architecture Specification
## ctf.arqadex.site

---

## Ecosystem Context

```
arqadex.site      → Games, labs, experiments (existing)
build.arqadex.site → CTF challenge development + booking (existing)
ctf.arqadex.site  → This platform — CTF hosting + competition
```

---

## Production Tech Stack

### Frontend
```
Next.js 14 (App Router) + TypeScript
Tailwind CSS + shadcn/ui base
Framer Motion (page transitions, scoreboard animations)
Socket.io-client (real-time events)
React Query (server state)
Zustand (client state)
```

### Backend
```
Node.js 20 + Express + TypeScript
Socket.io (WebSocket server — scoreboard, notifications, live feed)
Bull + Redis (job queues — flag validation, notifications)
Prisma ORM + PostgreSQL (primary database)
Redis (sessions, real-time caching, rate limiting)
AWS S3 / Cloudflare R2 (challenge file storage)
```

### Infrastructure
```
Frontend: Vercel (ctf.arqadex.site)
Backend:  Railway or Render (api.ctf.arqadex.site)
Database: Neon PostgreSQL (serverless) or Supabase
Cache:    Upstash Redis (serverless)
Files:    Cloudflare R2 (zero egress cost)
Email:    Resend API (notifications)
```

---

## Database Schema (PostgreSQL / Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  username      String   @unique
  email         String   @unique
  passwordHash  String
  role          Role     @default(PARTICIPANT)
  avatar        String?
  bio           String?
  teamId        String?
  team          Team?    @relation(fields:[teamId], references:[id])
  submissions   Submission[]
  achievements  UserAchievement[]
  createdAt     DateTime @default(now())
}

enum Role { PARTICIPANT ORGANIZER ADMIN }

model Team {
  id          String   @id @default(cuid())
  name        String   @unique
  inviteCode  String   @unique @default(cuid())
  score       Int      @default(0)
  members     User[]
  submissions Submission[]
  eventId     String?
  event       Event?   @relation(fields:[eventId], references:[id])
  createdAt   DateTime @default(now())
}

model Event {
  id           String      @id @default(cuid())
  slug         String      @unique
  name         String
  description  String
  organizerId  String
  organizer    User        @relation(fields:[organizerId], references:[id])
  status       EventStatus @default(DRAFT)
  startTime    DateTime
  endTime      DateTime
  maxTeams     Int         @default(500)
  teamSize     Int         @default(4)
  prizes       String[]
  rules        String?
  banner       String?
  accentColor  String      @default("#00F5FF")
  challenges   Challenge[]
  teams        Team[]
  announcements Announcement[]
  settings     EventSettings?
  createdAt    DateTime    @default(now())
}

enum EventStatus { DRAFT PUBLISHED LIVE ENDED ARCHIVED }

model EventSettings {
  id                    String  @id @default(cuid())
  eventId               String  @unique
  event                 Event   @relation(fields:[eventId], references:[id])
  perTeamFlags          Boolean @default(true)
  ipClusterDetection    Boolean @default(true)
  submissionRateLimit   Int     @default(10)  // per minute
  honeypotEnabled       Boolean @default(false)
  behavioralAnalysis    Boolean @default(true)
  maxWrongAttempts      Int     @default(0)   // 0 = unlimited
  freezeScoreboard      Boolean @default(false)
  freezeAt              DateTime?
}

model Challenge {
  id          String      @id @default(cuid())
  eventId     String
  event       Event       @relation(fields:[eventId], references:[id])
  name        String
  category    String
  description String
  points      Int
  difficulty  Int         @default(3)  // 1-5
  flagHash    String      // bcrypt hash of base flag
  baseFlag    String      // encrypted, server-side only
  files       ChallengeFile[]
  hints       Hint[]
  submissions Submission[]
  isVisible   Boolean     @default(true)
  isHoneypot  Boolean     @default(false)
  solveCount  Int         @default(0)
  firstBlood  String?     // team id
  createdAt   DateTime    @default(now())
}

model ChallengeFile {
  id          String    @id @default(cuid())
  challengeId String
  challenge   Challenge @relation(fields:[challengeId], references:[id])
  name        String
  url         String    // R2/S3 signed URL
  size        Int
  uploadedAt  DateTime  @default(now())
}

model Hint {
  id          String    @id @default(cuid())
  challengeId String
  challenge   Challenge @relation(fields:[challengeId], references:[id])
  text        String
  cost        Int       @default(50)
  order       Int       @default(0)
}

model Submission {
  id          String     @id @default(cuid())
  teamId      String
  team        Team       @relation(fields:[teamId], references:[id])
  userId      String
  user        User       @relation(fields:[userId], references:[id])
  challengeId String
  challenge   Challenge  @relation(fields:[challengeId], references:[id])
  flag        String
  isCorrect   Boolean
  ipAddress   String
  userAgent   String
  submittedAt DateTime   @default(now())
  flagVariant String?    // which team-specific flag was used
}

model Announcement {
  id        String   @id @default(cuid())
  eventId   String
  event     Event    @relation(fields:[eventId], references:[id])
  message   String
  type      String   @default("info") // info | warning | critical
  createdAt DateTime @default(now())
}

model Achievement {
  id          String            @id @default(cuid())
  slug        String            @unique
  name        String
  description String
  icon        String
  users       UserAchievement[]
}

model UserAchievement {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields:[userId], references:[id])
  achievementId String
  achievement   Achievement @relation(fields:[achievementId], references:[id])
  earnedAt      DateTime    @default(now())
}
```

---

## API Routes

### Authentication
```
POST /api/auth/register     → Create account
POST /api/auth/login        → JWT login
POST /api/auth/logout       → Invalidate session
GET  /api/auth/me           → Current user
PUT  /api/auth/profile      → Update profile
```

### Events (Public)
```
GET  /api/events            → List all events
GET  /api/events/:slug      → Event detail
GET  /api/events/:slug/scoreboard → Live scoreboard
GET  /api/events/:slug/challenges → Challenge list (when event is live)
```

### Events (Organizer)
```
POST   /api/organizer/events                    → Create event
PUT    /api/organizer/events/:id                → Update event
DELETE /api/organizer/events/:id                → Delete event
POST   /api/organizer/events/:id/publish        → Publish event
POST   /api/organizer/events/:id/announce       → Send announcement
GET    /api/organizer/events/:id/analytics      → Event analytics
GET    /api/organizer/events/:id/anticheat      → Anti-cheat report
```

### Challenges (Organizer)
```
POST   /api/organizer/challenges                → Create challenge
PUT    /api/organizer/challenges/:id            → Update challenge
DELETE /api/organizer/challenges/:id            → Delete challenge
POST   /api/organizer/challenges/:id/files      → Upload file
GET    /api/organizer/challenges/:id/flags      → View team flags
```

### Participation
```
POST /api/events/:slug/register     → Register team for event
POST /api/events/:slug/submit       → Submit flag
POST /api/events/:slug/hints/:id    → Use hint (deducts points)
GET  /api/teams/:id                 → Team info
POST /api/teams                     → Create team
POST /api/teams/join                → Join team via invite code
```

---

## Integrity Shield — Anti-Cheat Systems

### 1. Per-Team Flag Derivatives
```javascript
// Server generates unique flag for each team
function deriveTeamFlag(baseFlag, teamId, eventId) {
  const secret = process.env.FLAG_SECRET;
  const input  = `${baseFlag}:${teamId}:${eventId}`;
  const hash   = crypto.createHmac('sha256', secret)
                       .update(input).digest('hex').slice(0,8);
  // baseFlag = "ARQADEX{oracle_whispers}"
  // team flag = "ARQADEX{0x4f7a_oracle_whispers}"
  return baseFlag.replace('{', `{${hash}_`);
}
```

### 2. Submission Rate Limiting
```javascript
// Redis-based sliding window per team per event
const key = `ratelimit:${teamId}:${eventId}`;
const count = await redis.incr(key);
if (count === 1) await redis.expire(key, 60);
if (count > settings.submissionRateLimit) throw new RateLimitError();
```

### 3. IP Clustering Detection
```javascript
// Track IPs per event, flag if multiple teams share subnet
async function detectIPClustering(ipAddress, teamId, eventId) {
  const subnet = ipAddress.split('.').slice(0,3).join('.');
  const key = `ipcluster:${eventId}:${subnet}`;
  const teams = await redis.sadd(key, teamId);
  if (teams > 2) await flagForReview(teamId, 'IP_CLUSTER', { subnet });
}
```

### 4. Timing Correlation (Flag Sharing)
```javascript
// Alert if same challenge solved by multiple teams within 60s
async function detectFlagSharing(challengeId, teamId, solvedAt) {
  const key = `solve:${challengeId}`;
  const recent = await redis.lrange(key, 0, 10);
  const suspiciousWindow = 60; // seconds
  for (const entry of recent) {
    const { teamId: otherTeam, time } = JSON.parse(entry);
    if (otherTeam !== teamId && (solvedAt - time) < suspiciousWindow * 1000) {
      await createAlert({ type: 'FLAG_SHARING', teams: [teamId, otherTeam], challengeId });
    }
  }
  await redis.lpush(key, JSON.stringify({ teamId, time: solvedAt }));
}
```

### 5. Honeypot Challenges
- Challenges marked as honeypot have flags deliberately planted in vulnerable locations
- Any team that submits the honeypot flag is flagged for manual review
- Honeypot challenges appear identical to real challenges on the surface

---

## WebSocket Events (Socket.io)

### Server → Client
```typescript
// New solve notification
socket.to(eventRoom).emit('solve', {
  team: string, challenge: string, points: number,
  isFirstBlood: boolean, timestamp: number
});

// Scoreboard update (every 30s or on solve)
socket.to(eventRoom).emit('scoreboard', {
  teams: [{rank, name, score, solves, delta}]
});

// Announcement
socket.to(eventRoom).emit('announcement', {
  message: string, type: 'info'|'warning'|'critical'
});

// Timer sync
socket.to(eventRoom).emit('timer', {
  remaining: number // seconds
});
```

### Client → Server
```typescript
socket.emit('join_event', { eventSlug, teamId, token });
socket.emit('submit_flag', { challengeId, flag, eventSlug });
```

---

## Deployment Guide

### 1. Clone and configure
```bash
git clone https://github.com/arqadex/ctf-platform
cd ctf-platform
cp .env.example .env
# Fill in all environment variables
```

### 2. Environment Variables
```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<random 64 chars>
FLAG_SECRET=<random 64 chars>
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
R2_BUCKET=arqadex-ctf-files
RESEND_API_KEY=...
NEXT_PUBLIC_API_URL=https://api.ctf.arqadex.site
NEXT_PUBLIC_WS_URL=wss://api.ctf.arqadex.site
```

### 3. Deploy
```bash
# Database
npx prisma migrate deploy
npx prisma db seed

# Backend (Railway)
railway deploy

# Frontend (Vercel)
vercel --prod
```

### 4. DNS
```
ctf.arqadex.site     → Vercel deployment
api.ctf.arqadex.site → Railway deployment
```

---

## Demo Platform

The included `index.html` + `style.css` + `app.js` is a complete frontend demo:
- **No backend required** — all state in localStorage
- **All views rendered** — landing, auth, dashboard, compete, scoreboard, organizer, etc.
- **Working flag submission** — validate flags from CHALLENGES data
- **Live timer simulation** — real countdown from 48h
- **Live feed simulation** — random solve notifications
- **Achievement system** — trigger on flag solve

### Demo routes
```
#/                    Landing page
#/login               Login (demo accounts available)
#/register            Register
#/dashboard           Participant dashboard (requires login)
#/events              All events
#/event/:slug         Event detail
#/compete/:slug       Competition interface (requires login)
#/scoreboard/:slug    Live scoreboard
#/team                Team management (requires login)
#/profile             User profile (requires login)
#/organize            Organizer dashboard (requires organizer login)
#/organize/create     Create event
#/organize/:slug/challenges   Challenge manager
#/organize/:slug/anticheat    Integrity Shield panel
```

---

*ARQADEX CTF DIVISION © 2025 — ctf.arqadex.site*
