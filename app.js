/* ═══════════════════════════════════════════════════════════════
   ARQADEX CTF PLATFORM — Complete SPA Engine
   ctf.arqadex.site © 2025
═══════════════════════════════════════════════════════════════ */
(function(){'use strict';

/* ══ MOCK DATA ══════════════════════════════════════════════ */
const EVENTS=[
  {id:'ae25',slug:'arqadex-prime-2025',name:'ARQADEX PRIME 2025',status:'live',
   start:'2025-06-04T10:00:00Z',end:'2025-06-06T10:00:00Z',
   banner:'linear-gradient(135deg,#020228,#0A0A3A,#02021A)',
   accentColor:'#00F5FF',desc:'The flagship 48-hour CTF event by ARQADEX. Elite challenges across all domains.',
   prizes:['$5,000','$2,500','$1,000'],teams:212,maxTeams:500,teamSize:4,
   categories:['web','pwn','crypto','re','osint','dfir','stego','misc'],organizer:'ARQADEX DIVISION'},
  {id:'qs4',slug:'qualifier-series-iv',name:'QUALIFIER SERIES IV',status:'upcoming',
   start:'2025-07-12T14:00:00Z',end:'2025-07-13T14:00:00Z',
   banner:'linear-gradient(135deg,#180A28,#280A28,#100A18)',
   accentColor:'#FF2DA6',desc:'24-hour qualifying event for the ARQADEX Championship. Top 20 teams advance.',
   prizes:['Championship Seed','Championship Seed','Championship Seed'],teams:89,maxTeams:200,teamSize:4,
   categories:['web','crypto','re','misc'],organizer:'ARQADEX DIVISION'},
  {id:'nc25',slug:'neural-clash-2025',name:'NEURAL CLASH 2025',status:'upcoming',
   start:'2025-08-01T08:00:00Z',end:'2025-08-03T08:00:00Z',
   banner:'linear-gradient(135deg,#00180A,#002820,#001008)',
   accentColor:'#C7FF4D',desc:'AI-focused CTF. Prompt injection, model inversion, adversarial ML.',
   prizes:['$3,000','$1,500','$750'],teams:34,maxTeams:150,teamSize:3,
   categories:['ai','web','crypto','misc'],organizer:'NEURAL LAB'},
  {id:'ae24',slug:'arqadex-prime-2024',name:'ARQADEX PRIME 2024',status:'past',
   start:'2024-06-01T10:00:00Z',end:'2024-06-03T10:00:00Z',
   banner:'linear-gradient(135deg,#180820,#200820)',
   accentColor:'#7A5CFF',desc:'The 2024 flagship event. 48 hours. 450 teams. Legendary challenges.',
   prizes:['$5,000','$2,500','$1,000'],teams:450,maxTeams:500,teamSize:4,
   winner:'0xGHOST',categories:['web','pwn','crypto','re','osint','dfir','stego','misc'],organizer:'ARQADEX DIVISION'},
  {id:'bs24',slug:'binary-storm-2024',name:'BINARY STORM 2024',status:'past',
   start:'2024-03-15T12:00:00Z',end:'2024-03-16T12:00:00Z',
   banner:'linear-gradient(135deg,#0A0A00,#181800)',
   accentColor:'#FF8800',desc:'Pure binary exploitation. Pwn and RE only. 187 teams.',
   prizes:['$2,000','$1,000','$500'],teams:187,maxTeams:200,teamSize:4,
   winner:'NULL_PTR',categories:['pwn','re'],organizer:'ARQADEX DIVISION'},
];

const CHALLENGES=[
  {id:'w1',cat:'web',name:'JWT_NIGHTMARE',pts:350,diff:3,solves:47,desc:'The auth panel issues JWT tokens. The algorithm field is trusted from the client header.',files:['server.py','Dockerfile'],hints:['The alg field is trusted by the server.','Try setting alg to "none".'],flag:'ARQADEX{alg0_n0ne_byp4ss}',eventId:'ae25'},
  {id:'w2',cat:'web',name:'GRAPHQL_INTRUSION',pts:500,diff:4,solves:23,desc:'A modern API on GraphQL. Introspection is on. One mutation has no auth check.',files:['server.js'],hints:['Run a full introspection query.','Find the mutation that modifies roles.'],flag:'ARQADEX{graphql_secret}',eventId:'ae25'},
  {id:'w3',cat:'web',name:'SSRF_LABYRINTH',pts:450,diff:4,solves:18,desc:'URL preview service. EC2 with IMDSv1. No SSRF protection.',files:['app.py'],hints:['Try http://169.254.169.254/latest/'],flag:'ARQADEX{ssrf_imds_v1}',eventId:'ae25'},
  {id:'p1',cat:'pwn',name:'STACK_PHANTOM',pts:600,diff:5,solves:9,desc:'Full protections. Format string leaks canary+libc. One ROP chain.',files:['phantom_svc','libc.so.6'],hints:['%7$p leaks canary, %21$p leaks libc','ret2system via pop_rdi gadget'],flag:'ARQADEX{rop_chain_shell}',eventId:'ae25'},
  {id:'p2',cat:'pwn',name:'HEAP_LABYRINTH',pts:700,diff:5,solves:4,desc:'UAF + tcache. Poison freelist. Overwrite __free_hook.',files:['heap_lab','libc-2.31.so'],hints:['edit() writes to freed chunks'],flag:'ARQADEX{tcache_free_hook}',eventId:'ae25'},
  {id:'c1',cat:'crypto',name:'ORACLE_WHISPERS',pts:400,diff:3,solves:38,desc:'AES-CBC padding oracle. The server leaks one bit per query via status code.',files:['oracle.py'],hints:['HTTP 400 = bad padding, 403 = valid'],flag:'ARQADEX{padding_oracle}',eventId:'ae25'},
  {id:'c2',cat:'crypto',name:'LATTICE_DREAMS',pts:650,diff:5,solves:6,desc:'LWE-based KEM. q=97, sigma=0.5. Use LLL reduction.',files:['kem.py'],hints:['Build basis [A|I; q*I|0] then LLL'],flag:'ARQADEX{lll_attack}',eventId:'ae25'},
  {id:'r1',cat:'re',name:'BINARY_PHANTOM',pts:400,diff:3,solves:31,desc:'Anti-debug binary. Patch the ptrace check. Feistel cipher inside.',files:['phantom.elf'],hints:['NOP the ptrace self-attach call'],flag:'ARQADEX{anti_debug_bypass}',eventId:'ae25'},
  {id:'r2',cat:'re',name:'VM_LABYRINTH',pts:650,diff:5,solves:7,desc:'Custom stack VM with 32 opcodes. Reverse the bytecode to find the password.',files:['labyrinth.elf','bytecode.bin'],hints:['Dispatch table at 0x401890'],flag:'ARQADEX{vm_bytecode_rev}',eventId:'ae25'},
  {id:'o1',cat:'osint',name:'SHADOW_PROFILE',pts:300,diff:3,solves:52,desc:'Username from a breach dump. Six platforms. Trace the full identity.',files:['seed.txt'],hints:['Check archive.org for old blog'],flag:'ARQADEX{osint_pgp_verified}',eventId:'ae25'},
  {id:'o2',cat:'osint',name:'METADATA_GHOST',pts:200,diff:2,solves:89,desc:'One photograph. EXIF GPS stripped. MakerNote was not.',files:['photo.jpg'],hints:['Use exiftool -a photo.jpg'],flag:'ARQADEX{exif_makernote_geo}',eventId:'ae25'},
  {id:'d1',cat:'dfir',name:'PHANTOM_BREACH',pts:350,diff:3,solves:29,desc:'Windows memory dump. DLL injection into lsass. Reconstruct the kill chain.',files:['memory.dmp.gz'],hints:['volatility3 windows.malfind'],flag:'ARQADEX{lsass_injection_c2}',eventId:'ae25'},
  {id:'s1',cat:'stego',name:'FREQUENCY_GHOST',pts:250,diff:2,solves:71,desc:'30 seconds of static. Open in a spectrogram viewer at 8-16kHz.',files:['signal.wav'],hints:['Audacity > Spectrogram 8-16kHz band'],flag:'ARQADEX{spectrogram_signal}',eventId:'ae25'},
  {id:'m1',cat:'misc',name:'DARK_PAYLOAD',pts:400,diff:3,solves:34,desc:'Python script with 7 obfuscation layers. What does it actually do?',files:['invoice.py'],hints:['Replace exec( with print( at each layer'],flag:'ARQADEX{7_layer_deobfuscated}',eventId:'ae25'},
];

const TEAMS=[
  {id:'t1',name:'0xGHOST',score:4250,solves:13,members:['ghost_root','null_byte','void_ptr','hex_witch'],color:'#00F5FF'},
  {id:'t2',name:'PHANTOM_LAB',score:3890,solves:11,members:['ph4ntom','lab_rat','signal_9'],color:'#FF2DA6'},
  {id:'t3',name:'NULL_PTR',score:3650,solves:10,members:['nullptr','overflow','segfault','heapspray'],color:'#7A5CFF'},
  {id:'t4',name:'SHELLCODE_FC',score:3120,solves:9,members:['shellcode','ret2win','gadget'],color:'#FF8800'},
  {id:'t5',name:'CRYPTONITES',score:2850,solves:8,members:['rsa_killer','aes_breaker'],color:'#C7FF4D'},
  {id:'t6',name:'BYTE_RUNNERS',score:2430,solves:7,members:['byterun','flipflop','xor_god'],color:'#FF4444'},
  {id:'t7',name:'EXPLOIT_DB',score:2100,solves:6,members:['edb_user','poc_writer'],color:'#00FFAA'},
  {id:'t8',name:'PWNED_INC',score:1890,solves:5,members:['pwner','patcher'],color:'#4488FF'},
  {id:'t9',name:'STACK_SMASH',score:1450,solves:4,members:['smasher','rop_master'],color:'#FFD700'},
  {id:'t10',name:'KERNEL_PANIC',score:980,solves:3,members:['kpanic','rootkit_dev'],color:'#8888AA'},
];

const ACHIEVEMENTS=[
  {id:'first_blood',icon:'🩸',name:'FIRST BLOOD',desc:'First team to solve any challenge',earned:true},
  {id:'speedrun',icon:'⚡',name:'SPEEDRUN',desc:'Solve a challenge within 10 minutes of release',earned:true},
  {id:'category_king',icon:'👑',name:'CATEGORY KING',desc:'Solve all challenges in one category',earned:false},
  {id:'unstoppable',icon:'🔥',name:'UNSTOPPABLE',desc:'Solve 5 challenges in a row without a wrong flag',earned:false},
  {id:'night_owl',icon:'🦉',name:'NIGHT OWL',desc:'Solve a challenge between 2 and 5 AM',earned:true},
  {id:'purist',icon:'🎯',name:'PURIST',desc:'Complete an event without using any hints',earned:false},
  {id:'podium',icon:'🏆',name:'PODIUM',desc:'Finish in the top 3',earned:false},
  {id:'veteran',icon:'⭐',name:'VETERAN',desc:'Participate in 5 or more events',earned:false},
];

const NOTIFICATIONS=[
  {id:1,type:'blood',text:'🩸 Team 0xGHOST got FIRST BLOOD on VM_LABYRINTH',time:'2m ago',read:false},
  {id:2,type:'solve',text:'Your team solved ORACLE_WHISPERS — +400 pts',time:'14m ago',read:false},
  {id:3,type:'rank',text:'You moved to rank #4 on the scoreboard',time:'31m ago',read:true},
  {id:4,type:'announce',text:'📢 ORGANIZER: Hint added to HEAP_LABYRINTH',time:'1h ago',read:true},
  {id:5,type:'event',text:'QUALIFIER SERIES IV opens in 3 days',time:'2h ago',read:true},
];

/* ══ STATE ═══════════════════════════════════════════════ */
const S={
  user:JSON.parse(localStorage.getItem('arq_user')||'null'),
  route:'/',orgTab:'overview',solved:JSON.parse(localStorage.getItem('arq_solved')||'["o2","s1"]'),
  teamScore:2430,teamRank:6,
};

/* ══ ROUTER ══════════════════════════════════════════════ */
function getRoute(){return location.hash.replace('#','').split('?')[0]||'/';}
function navigate(path){location.hash=path;}
window.addEventListener('hashchange',()=>{S.route=getRoute();render();});

function render(){
  const r=getRoute();S.route=r;
  const app=document.getElementById('app-root');
  const parts=r.split('/').filter(Boolean);
  if(r==='/'||r===''){app.innerHTML=viewLanding();initLanding();}
  else if(r==='/login'){app.innerHTML=viewAuth('login');initAuth();}
  else if(r==='/register'){app.innerHTML=viewAuth('register');initAuth();}
  else if(r==='/dashboard'){if(!S.user)return navigate('/login');app.innerHTML=viewDashboard();initDashboard();}
  else if(r==='/events'){app.innerHTML=viewEvents();initReveal();}
  else if(parts[0]==='event'&&parts[1]){app.innerHTML=viewEventDetail(parts[1]);initEventDetail();}
  else if(parts[0]==='compete'&&parts[1]){if(!S.user)return navigate('/login');app.innerHTML=viewCompete(parts[1]);initCompete();}
  else if(parts[0]==='scoreboard'&&parts[1]){app.innerHTML=viewScoreboard(parts[1]);initScoreboard();}
  else if(r==='/team'){if(!S.user)return navigate('/login');app.innerHTML=viewTeam();initReveal();}
  else if(r==='/profile'){if(!S.user)return navigate('/login');app.innerHTML=viewProfile();initReveal();}
  else if(r==='/organize'){if(!S.user||S.user.role!=='organizer')return navigate('/login');app.innerHTML=viewOrganize();initOrganize();}
  else if(parts[0]==='organize'&&parts[1]==='create'){app.innerHTML=viewCreateEvent();initReveal();}
  else if(parts[0]==='organize'&&parts[2]==='challenges'){app.innerHTML=viewChallengeManager(parts[1]);initChallengeManager();}
  else if(parts[0]==='organize'&&parts[2]==='anticheat'){app.innerHTML=viewAntiCheat(parts[1]);initAntiCheat();}
  else{app.innerHTML=view404();}
  renderNav();setupCursorHover();initReveal();window.scrollTo(0,0);
}

/* ══ NAV ══════════════════════════════════════════════════ */
function renderNav(){
  const r=S.route;
  document.getElementById('nav-root').innerHTML=`
  <nav class="nav" id="main-nav">
    <a href="#/" class="nav-logo"><span class="nl-bracket">[</span>ARQADEX<span class="nl-slash">/</span>CTF<span class="nl-bracket">]</span><span class="nl-domain" style="margin-left:6px">ctf.arqadex.site</span></a>
    <div class="nav-links">
      <a href="#/events" class="nav-link ${r==='/events'?'active':''}">EVENTS</a>
      <a href="#/scoreboard/arqadex-prime-2025" class="nav-link">SCOREBOARD</a>
      <a href="https://arqadex.pages.dev" class="nav-link" target="_blank">ARCADE</a>
      <a href="https://build.arqadex.site" class="nav-link" target="_blank">BUILD</a>
    </div>
    <div class="nav-right">
      ${S.user?`
        <div class="nav-notif" onclick="showNotifications()">🔔<span class="notif-badge">${NOTIFICATIONS.filter(n=>!n.read).length}</span></div>
        <div class="nav-user" onclick="navigate('/dashboard')">
          <div class="nav-avatar">${S.user.username.charAt(0).toUpperCase()}</div>
          <span class="nav-uname">${S.user.username.toUpperCase()}</span>
        </div>
        ${S.user.role==='organizer'?`<a href="#/organize"><button class="btn-nav btn-register" style="font-size:8px;padding:7px 14px">ORG PANEL</button></a>`:''}
        <button class="btn-nav btn-ghost" onclick="logout()">EXIT</button>
      `:`
        <a href="#/login"><button class="btn-nav btn-login">LOGIN</button></a>
        <a href="#/register"><button class="btn-nav btn-register">JOIN</button></a>
      `}
    </div>
  </nav>`;
  window.addEventListener('scroll',()=>document.getElementById('main-nav')?.classList.toggle('scrolled',scrollY>30),{passive:true});
}

/* ══ LANDING ══════════════════════════════════════════════ */
function viewLanding(){
  const live=EVENTS.find(e=>e.status==='live');
  const upcoming=EVENTS.filter(e=>e.status==='upcoming').slice(0,2);
  const past=EVENTS.filter(e=>e.status==='past').slice(0,2);
  return`<div class="page-wrap">
    <section class="hero">
      <div class="hero-bg-grid"></div>
      <div class="hero-content">
        ${live?`<div class="event-ticker"><span class="ticker-label"><span class="dot-live" style="display:inline-block;margin-right:6px"></span>LIVE</span><span class="ticker-sep">│</span><span class="ticker-content">${live.name} — ${live.teams} teams competing — <strong style="color:var(--c)">47:58:00</strong> remaining</span></div>`:''}
        <div class="hero-badge"><span class="dot-live"></span>ARQADEX CTF ARENA — COMPETITIVE INTELLIGENCE PLATFORM</div>
        <h1 class="title-hero" style="margin-bottom:24px">
          <span class="gradient-text">CAPTURE</span><br>
          <span style="color:rgba(255,255,255,.12);-webkit-text-stroke:1px rgba(255,255,255,.18)">THE FLAG</span><br>
          <span style="background:linear-gradient(135deg,var(--p),var(--v));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">ARENA</span>
        </h1>
        <p style="font-family:var(--mono);font-size:14px;color:var(--si);line-height:1.8;max-width:560px;margin:0 auto 40px">
          World-class CTF competitions for elite offensive-security teams.<br>Host. Compete. Conquer. — Built by ARQADEX.
        </p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:60px">
          ${live?`<a href="#/event/${live.slug}"><button class="btn btn-primary btn-lg">⚡ JOIN LIVE EVENT</button></a>`:''}
          <a href="#/events"><button class="btn btn-ghost btn-lg">BROWSE EVENTS</button></a>
          ${!S.user?`<a href="#/register"><button class="btn btn-lg" style="background:rgba(255,45,166,.1);border-color:rgba(255,45,166,.4);color:var(--p)">CREATE ACCOUNT</button></a>`:''}
        </div>
        <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap">
          ${[['2,400+','REGISTERED TEAMS'],['12,000+','CHALLENGES SOLVED'],['48','EVENTS HOSTED'],['$50K+','PRIZE POOL']].map(([v,l],i)=>`
          <div style="padding:0 28px;text-align:center;${i<3?'border-right:1px solid rgba(255,255,255,.07)':''}">
            <div style="font-size:30px;font-weight:900;color:var(--c);font-family:var(--mono);text-shadow:0 0 20px rgba(0,245,255,.3)">${v}</div>
            <div style="font-size:8px;letter-spacing:3px;color:var(--mu);margin-top:4px">${l}</div>
          </div>`).join('')}
        </div>
      </div>
      <div class="hero-scroll"><div class="hero-scroll-line"></div><span>SCROLL</span></div>
    </section>

    ${live?`<section class="section-sm" style="padding-top:0"><div class="container">
      <div style="border:1px solid rgba(0,245,255,.2);border-radius:16px;overflow:hidden;background:rgba(5,5,20,.9)">
        <div style="padding:24px;background:linear-gradient(135deg,rgba(0,245,255,.08),rgba(122,92,255,.08));border-bottom:1px solid rgba(0,245,255,.12);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px">
          <div style="display:flex;align-items:center;gap:16px">
            <span class="badge badge-live"><span class="dot-live"></span> LIVE</span>
            <div><div class="title-lg" style="color:var(--c)">${live.name}</div><div style="font-family:var(--mono);font-size:11px;color:var(--si);margin-top:4px">${live.desc}</div></div>
          </div>
          <div style="display:flex;align-items:center;gap:24px">
            <div style="text-align:center"><div style="font-size:28px;font-weight:900;font-family:var(--mono);color:var(--c)" id="hero-timer">47:58:00</div><div style="font-size:8px;letter-spacing:3px;color:var(--mu)">REMAINING</div></div>
            <a href="#/event/${live.slug}"><button class="btn btn-primary">VIEW EVENT →</button></a>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr))">
          ${[['👥',live.teams+' TEAMS','COMPETING'],['🏆',live.prizes[0],'1ST PRIZE'],['⚡',live.categories.length+' CATS','CATEGORIES'],['🛡️','ACTIVE','INTEGRITY SHIELD']].map(([ic,v,l])=>`
          <div style="padding:20px;text-align:center;border-right:1px solid rgba(255,255,255,.05)">
            <div style="font-size:20px;margin-bottom:6px">${ic}</div>
            <div style="font-size:14px;font-weight:700">${v}</div>
            <div style="font-size:8px;letter-spacing:2px;color:var(--mu);margin-top:2px">${l}</div>
          </div>`).join('')}
        </div>
      </div>
    </div></section>`:''}

    <section class="section"><div class="container">
      <div class="section-header reveal text-center"><div class="eyebrow">MISSION QUEUE</div><h2 class="title-xl">Upcoming Events</h2></div>
      <div class="grid-2" style="margin-bottom:24px">${upcoming.map(e=>eventCard(e)).join('')}</div>
      <div style="text-align:center"><a href="#/events"><button class="btn btn-ghost">VIEW ALL EVENTS →</button></a></div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="section-header reveal text-center"><div class="eyebrow">INTELLIGENCE FEED</div><h2 class="title-xl">Live Scoreboard</h2></div>
      <div class="scoreboard reveal">
        <div class="sb-header"><span style="font-size:10px;letter-spacing:3px;color:var(--mu)">RANK / TEAM</span><span style="font-size:10px;letter-spacing:3px;color:var(--mu)">SCORE</span></div>
        ${TEAMS.slice(0,6).map((t,i)=>`
        <div class="sb-row">
          <div class="sb-rank ${['gold','silver','bronze','','',''][i]}">${['🥇','🥈','🥉','#4','#5','#6'][i]}</div>
          <div class="sb-team">
            <div class="sb-avatar" style="background:${t.color}22;color:${t.color}">${t.name.charAt(0)}</div>
            <div><div style="font-size:12px;font-weight:700">${t.name}</div><div style="font-family:var(--mono);font-size:9px;color:var(--mu)">${t.solves} solves</div></div>
          </div>
          <div></div><div class="sb-score">${t.score.toLocaleString()}</div>
          <div class="sb-change ${i<4?'up':''}">▲${Math.floor(Math.random()*3+1)}</div>
        </div>`).join('')}
      </div>
      <div style="text-align:center;margin-top:16px"><a href="#/scoreboard/arqadex-prime-2025"><button class="btn btn-ghost">FULL SCOREBOARD →</button></a></div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="section-header reveal text-center"><div class="eyebrow">PLATFORM CAPABILITIES</div><h2 class="title-xl">Built for Serious Competition</h2></div>
      <div class="grid-3">
        ${[['⚡','INTEGRITY SHIELD','Per-team flag derivatives, IP clustering detection, behavioral analysis, and honeypot challenges.','#00F5FF'],
           ['🎯','LIVE INTELLIGENCE','Real-time scoreboards, instant solve notifications, live category analytics.','#FF2DA6'],
           ['🏗️','ORGANIZER CONTROL','Full event management, challenge uploader, participant admin, anti-cheat dashboard.','#7A5CFF'],
           ['🌐','MULTI-DISCIPLINE','Web, Pwn, Crypto, RE, OSINT, DFIR, Stego, Malware, AI, Cloud — all supported.','#C7FF4D'],
           ['🎮','RICH PARTICIPANT UX','Team management, achievements, progress tracking, notifications, writeups.','#FF8800'],
           ['📊','POST-EVENT','Complete archives, writeup publishing, educational content, community interaction.','#00FFAA'],
          ].map(([ic,t,d,c])=>`
        <div class="card card-glow reveal" style="--top-color:${c}">
          <div style="font-size:28px;margin-bottom:14px">${ic}</div>
          <div class="title-sm" style="color:${c};margin-bottom:10px">${t}</div>
          <p style="font-family:var(--mono);font-size:11px;color:var(--si);line-height:1.8">${d}</p>
        </div>`).join('')}
      </div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div class="section-header reveal"><div class="eyebrow">ARCHIVES</div><h2 class="title-xl">Past Events</h2></div>
      <div class="grid-2">${past.map(e=>eventCard(e,'compact')).join('')}</div>
    </div></section>

    <section class="section" style="padding-top:0"><div class="container">
      <div style="text-align:center;padding:80px 40px;background:rgba(5,5,20,.6);border:1px solid rgba(0,245,255,.1);border-radius:20px;position:relative;overflow:hidden" class="reveal">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(0,245,255,.05),transparent 70%);pointer-events:none"></div>
        <div class="eyebrow">ARE YOU READY?</div>
        <h2 class="title-xl" style="margin-bottom:20px">Enter the Arena</h2>
        <p style="font-family:var(--mono);font-size:13px;color:var(--si);max-width:480px;margin:0 auto 36px;line-height:1.8">Join thousands of security researchers. Compete. Build your reputation.</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          ${!S.user?`<a href="#/register"><button class="btn btn-primary btn-lg">CREATE ACCOUNT</button></a>`:`<a href="#/dashboard"><button class="btn btn-primary btn-lg">GO TO DASHBOARD</button></a>`}
          <a href="#/events"><button class="btn btn-ghost btn-lg">BROWSE EVENTS</button></a>
          <a href="https://build.arqadex.site" target="_blank"><button class="btn btn-lg" style="border-color:rgba(255,45,166,.3);color:var(--p);background:rgba(255,45,166,.06)">HOST A CTF</button></a>
        </div>
      </div>
    </div></section>

    <footer style="border-top:1px solid rgba(255,255,255,.05);padding:48px 0 28px"><div class="container">
      <div class="grid-4" style="margin-bottom:36px">
        <div><div style="font-size:16px;font-weight:900;letter-spacing:3px;margin-bottom:12px">ARQADEX<span style="color:var(--p)">/</span>CTF</div><p style="font-family:var(--mono);font-size:11px;color:var(--si);line-height:1.7">Competitive intelligence arena. World-class CTF hosting.</p></div>
        ${[['PLATFORM',['Events','Scoreboard','Achievements','Teams']],['ECOSYSTEM',['arqadex.site','build.arqadex.site','Arcade Lab']],['CONTACT',['ctf@arqadex.site','Discord','Twitter']]].map(([t,ls])=>`
        <div><div style="font-size:9px;letter-spacing:4px;color:var(--mu);margin-bottom:14px">${t}</div>${ls.map(l=>`<div style="font-family:var(--mono);font-size:11px;color:var(--si);margin-bottom:8px">${l}</div>`).join('')}</div>`).join('')}
      </div>
      <div class="neon-divider"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:18px;flex-wrap:wrap;gap:10px">
        <span style="font-family:var(--mono);font-size:9px;color:var(--mu)">© 2025 ARQADEX CTF DIVISION</span>
        <span style="font-size:10px;font-weight:700;letter-spacing:4px;color:rgba(255,45,166,.35)">BUILT FOR CHAOS.</span>
      </div>
    </div></footer>
  </div>`;
}

function eventCard(e,mode='full'){
  const sb=e.status==='live'?'badge-live':e.status==='upcoming'?'badge-upcoming':'badge-past';
  return`<div class="event-card card-glow reveal" style="--top-color:${e.accentColor};cursor:pointer" onclick="navigate('/event/${e.slug}')">
    <div class="ec-banner" style="background:${e.banner}">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.015) 20px,rgba(255,255,255,.015) 40px)"></div>
      <span class="badge ${sb}">${e.status==='live'?'⚡ LIVE':e.status==='upcoming'?'UPCOMING':'COMPLETED'}</span>
    </div>
    <div class="ec-body">
      <div class="ec-name">${e.name}</div>
      <div class="ec-meta">
        <span class="ec-meta-item">👥 ${e.teams}${e.maxTeams?' / '+e.maxTeams:''}</span>
        <span class="ec-meta-item">⏱ 48h</span>
        ${e.winner?`<span class="ec-meta-item">🏆 ${e.winner}</span>`:''}
      </div>
      ${mode==='full'?`<p style="font-family:var(--mono);font-size:11px;color:var(--si);line-height:1.7;margin-bottom:14px">${e.desc}</p>`:''}
      <div class="ec-stats">
        <div class="ec-stat"><div class="ec-stat-val" style="color:${e.accentColor}">${e.prizes[0]}</div><div class="ec-stat-lbl">1ST PRIZE</div></div>
        <div class="ec-stat"><div class="ec-stat-val">${e.categories.length}</div><div class="ec-stat-lbl">CATEGORIES</div></div>
        <div class="ec-stat"><div class="ec-stat-val">${e.teams}</div><div class="ec-stat-lbl">TEAMS</div></div>
      </div>
    </div>
    <div class="ec-footer">
      <div style="display:flex;gap:6px;flex-wrap:wrap">${e.categories.slice(0,4).map(c=>`<span class="badge badge-cat" style="color:var(--cat-${c});border-color:var(--cat-${c})">${c.toUpperCase()}</span>`).join('')}</div>
      <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();navigate('/event/${e.slug}')">VIEW →</button>
    </div>
  </div>`;
}

/* ══ AUTH ════════════════════════════════════════════════ */
function viewAuth(mode){return`
  <div class="auth-page"><div class="auth-card">
    <div class="auth-logo"><div style="font-size:22px;font-weight:900;letter-spacing:4px">ARQADEX<span style="color:var(--p)">/</span><span style="color:var(--c)">CTF</span></div><div style="font-size:10px;letter-spacing:3px;color:var(--mu);margin-top:6px">${mode==='login'?'AUTHENTICATE':'CREATE ACCOUNT'}</div></div>
    ${mode==='register'?`<div class="role-select" id="role-select">
      <div class="role-card selected" data-role="participant" onclick="selectRole('participant')"><div class="role-icon">🎯</div><div class="role-name">PARTICIPANT</div><div style="font-family:var(--mono);font-size:9px;color:var(--mu);margin-top:4px">Compete in CTFs</div></div>
      <div class="role-card" data-role="organizer" onclick="selectRole('organizer')"><div class="role-icon">⚙️</div><div class="role-name">ORGANIZER</div><div style="font-family:var(--mono);font-size:9px;color:var(--mu);margin-top:4px">Host CTF events</div></div>
    </div>`:''}
    <form id="auth-form" onsubmit="handleAuth(event,'${mode}')">
      <div style="display:flex;flex-direction:column;gap:16px">
        ${mode==='register'?`<div class="form-group"><label class="form-label">USERNAME</label><input class="form-input" type="text" id="inp-username" placeholder="ghost_root" required minlength="3"></div>`:''}
        <div class="form-group"><label class="form-label">EMAIL</label><input class="form-input" type="email" id="inp-email" placeholder="operator@arqadex.site" required></div>
        <div class="form-group"><label class="form-label">PASSWORD</label><input class="form-input" type="password" id="inp-password" placeholder="••••••••••" required minlength="6"></div>
        ${mode==='register'?`<label style="display:flex;align-items:flex-start;gap:10px;cursor:none"><input type="checkbox" required style="margin-top:2px;accent-color:var(--c)"><span style="font-family:var(--mono);font-size:10px;color:var(--si);line-height:1.6">I agree to the platform rules. No flag sharing. Violations result in disqualification.</span></label>`:''}
      </div>
      <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:24px">${mode==='login'?'ACCESS ARENA':'CREATE OPERATIVE'}</button>
    </form>
    <div style="text-align:center;margin-top:18px;font-family:var(--mono);font-size:11px;color:var(--si)">
      ${mode==='login'?`No account? <a href="#/register" style="color:var(--c)">Register →</a>`:`Already registered? <a href="#/login" style="color:var(--c)">Login →</a>`}
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.06);margin-top:22px;padding-top:16px;text-align:center">
      <div style="font-size:8px;letter-spacing:2px;color:var(--mu);margin-bottom:8px">DEMO ACCOUNTS</div>
      <div style="display:flex;gap:8px;justify-content:center">
        <button class="btn btn-sm btn-ghost" onclick="quickLogin('participant')">👤 PARTICIPANT</button>
        <button class="btn btn-sm btn-ghost" onclick="quickLogin('organizer')">⚙️ ORGANIZER</button>
      </div>
    </div>
  </div></div>`;}

/* ══ DASHBOARD ══════════════════════════════════════════ */
function viewDashboard(){
  const u=S.user;
  return`<div class="page-wrap"><div class="container" style="padding-top:36px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div><div class="eyebrow">OPERATIVE DASHBOARD</div><h1 class="title-xl">Welcome back, <span class="text-c">${u.username.toUpperCase()}</span></h1></div>
      <div style="display:flex;gap:10px"><a href="#/compete/arqadex-prime-2025"><button class="btn btn-primary">⚡ ACTIVE EVENT</button></a><a href="#/team"><button class="btn btn-ghost">TEAM PANEL</button></a></div>
    </div>
    <div style="background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.15);border-radius:16px;padding:24px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px" class="reveal">
      <div style="display:flex;align-items:center;gap:16px">
        <span class="badge badge-live"><span class="dot-live"></span> LIVE</span>
        <div><div class="title-md">ARQADEX PRIME 2025</div><div style="font-family:var(--mono);font-size:11px;color:var(--si)">Team: BYTE_RUNNERS · Rank #6 · 2,430 pts</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:24px">
        <div style="text-align:center"><div style="font-size:28px;font-weight:900;font-family:var(--mono);color:var(--c)" id="dash-timer">47:52:00</div><div style="font-size:8px;letter-spacing:2px;color:var(--mu)">REMAINING</div></div>
        <a href="#/compete/arqadex-prime-2025"><button class="btn btn-primary">ENTER →</button></a>
      </div>
    </div>
    <div class="grid-4" style="margin-bottom:24px">
      ${[['🎯',S.solved.length,'CHALLENGES SOLVED'],['📊','#6','TEAM RANK'],['⚡','2,430','TEAM SCORE'],['🏅',ACHIEVEMENTS.filter(a=>a.earned).length,'ACHIEVEMENTS']].map(([ic,v,l])=>`<div class="stat-card reveal"><div style="font-size:22px;margin-bottom:8px">${ic}</div><div class="sc-val">${v}</div><div class="sc-lbl">${l}</div></div>`).join('')}
    </div>
    <div class="grid-2">
      <div class="card reveal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div class="title-sm">RECENT SOLVES</div><a href="#/compete/arqadex-prime-2025"><button class="btn btn-sm btn-ghost">ALL →</button></a></div>
        ${CHALLENGES.filter(c=>S.solved.includes(c.id)).map(c=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)">
          <div style="display:flex;align-items:center;gap:10px"><span class="chip" style="color:var(--cat-${c.cat});border-color:var(--cat-${c.cat})">${c.cat.toUpperCase()}</span><span style="font-size:12px;font-weight:700">${c.name}</span></div>
          <span style="color:var(--li);font-weight:700;font-family:var(--mono)">+${c.pts}</span>
        </div>`).join('')}
        <a href="#/compete/arqadex-prime-2025"><button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px">SOLVE MORE →</button></a>
      </div>
      <div class="card reveal">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div class="title-sm">NOTIFICATIONS</div><span style="font-size:8px;letter-spacing:2px;color:var(--p)">${NOTIFICATIONS.filter(n=>!n.read).length} NEW</span></div>
        ${NOTIFICATIONS.map(n=>`<div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);opacity:${n.read?.55:1}"><div style="font-family:var(--mono);font-size:11px;line-height:1.6">${n.text}</div><div style="font-size:9px;color:var(--mu);margin-top:4px">${n.time}</div></div>`).join('')}
      </div>
    </div>
    <div style="margin-top:24px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px" class="reveal"><div class="title-md">ACHIEVEMENTS</div><span style="font-family:var(--mono);font-size:11px;color:var(--si)">${ACHIEVEMENTS.filter(a=>a.earned).length} / ${ACHIEVEMENTS.length}</span></div>
    <div class="ach-grid">${ACHIEVEMENTS.map(a=>`<div class="ach-card ${a.earned?'earned':'locked'} reveal"><div class="ach-emoji">${a.icon}</div><div class="ach-name" style="color:${a.earned?'var(--c)':'var(--mu)'}">${a.name}</div><div class="ach-desc">${a.desc}</div>${a.earned?`<div style="font-size:8px;color:var(--li);letter-spacing:2px;margin-top:6px">EARNED</div>`:''}</div>`).join('')}</div></div>
  </div></div>`;}

/* ══ EVENT DETAIL ════════════════════════════════════════ */
function viewEventDetail(slug){
  const e=EVENTS.find(x=>x.slug===slug)||EVENTS[0];
  return`<div class="page-wrap">
    <div style="height:260px;background:${e.banner};position:relative;display:flex;align-items:flex-end;padding:40px">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 20px,rgba(255,255,255,.01) 20px,rgba(255,255,255,.01) 40px)"></div>
      <div style="position:relative;z-index:2;width:100%;padding:0 32px;max-width:1312px;margin:0 auto">
        <span class="badge ${e.status==='live'?'badge-live':e.status==='upcoming'?'badge-upcoming':'badge-past'}" style="margin-bottom:12px">${e.status.toUpperCase()}</span>
        <h1 class="title-xl" style="color:${e.accentColor}">${e.name}</h1>
        <p style="font-family:var(--mono);font-size:13px;color:rgba(255,255,255,.45);margin-top:8px">${e.desc}</p>
      </div>
    </div>
    <div class="container" style="padding-top:36px"><div class="grid-2">
      <div>
        <div class="card reveal" style="margin-bottom:18px">
          <div class="title-sm" style="margin-bottom:16px">EVENT INFO</div>
          ${[['📅','START','Jun 4, 2025 · 10:00 UTC'],['🏁','END','Jun 6, 2025 · 10:00 UTC'],['👥','TEAM SIZE','Up to '+e.teamSize+' members'],['🎯','FORMAT','Jeopardy-style CTF'],['🏆','PRIZES',e.prizes.join(' · ')],['🛡️','INTEGRITY','Integrity Shield Active']].map(([ic,l,v])=>`
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)">
            <span style="font-size:18px;width:24px">${ic}</span>
            <div><div style="font-size:8px;letter-spacing:2px;color:var(--mu)">${l}</div><div style="font-family:var(--mono);font-size:12px;margin-top:2px">${v}</div></div>
          </div>`).join('')}
        </div>
        <div class="card reveal"><div class="title-sm" style="margin-bottom:14px">CATEGORIES</div><div style="display:flex;flex-wrap:wrap;gap:8px">${e.categories.map(c=>`<span class="badge badge-cat" style="color:var(--cat-${c});border-color:var(--cat-${c})">${c.toUpperCase()}</span>`).join('')}</div></div>
      </div>
      <div>
        <div class="card reveal" style="margin-bottom:18px;border-color:rgba(0,245,255,.15)">
          <div class="title-sm" style="margin-bottom:16px;color:var(--c)">${e.status==='live'?'JOIN NOW':'REGISTRATION'}</div>
          ${e.status==='live'?`
          <div style="text-align:center;padding:16px 0;margin-bottom:20px"><div style="font-size:40px;font-weight:900;color:var(--c);font-family:var(--mono)" id="event-timer">47:51:00</div><div style="font-size:9px;letter-spacing:3px;color:var(--mu);margin-top:6px">TIME REMAINING</div></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px">
            ${[['👥',e.teams,'TEAMS'],['✅',CHALLENGES.length,'CHALLENGES']].map(([ic,v,l])=>`<div style="background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.08);border-radius:8px;padding:14px;text-align:center"><div style="font-size:20px;margin-bottom:4px">${ic}</div><div style="font-size:22px;font-weight:900;color:var(--c)">${v}</div><div style="font-size:8px;letter-spacing:2px;color:var(--mu);margin-top:2px">${l}</div></div>`).join('')}
          </div>
          <a href="#/compete/${e.slug}"><button class="btn btn-primary btn-lg" style="width:100%;justify-content:center">⚡ ENTER COMPETITION</button></a>
          <a href="#/scoreboard/${e.slug}"><button class="btn btn-ghost" style="width:100%;justify-content:center;margin-top:10px">SCOREBOARD</button></a>`:`
          <div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-family:var(--mono);font-size:11px;color:var(--si)">Registration</span><span style="font-family:var(--mono);font-size:11px;color:var(--c)">${e.teams} / ${e.maxTeams}</span></div><div class="progress-bar"><div class="progress-fill progress-c" style="width:${Math.round(e.teams/e.maxTeams*100)}%"></div></div></div>
          ${S.user?`<button class="btn btn-primary btn-lg" style="width:100%;justify-content:center" onclick="showToast('Registered!','success')">REGISTER TEAM</button>`:`<a href="#/register"><button class="btn btn-primary btn-lg" style="width:100%;justify-content:center">SIGN UP TO REGISTER</button></a>`}`}
        </div>
        ${e.status==='past'&&e.winner?`<div class="card reveal"><div class="title-sm" style="margin-bottom:14px">FINAL RESULTS</div>${TEAMS.slice(0,3).map((t,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)"><div class="sb-rank ${['gold','silver','bronze'][i]}">${['🥇','🥈','🥉'][i]}</div><div class="sb-avatar" style="background:${t.color}22;color:${t.color}">${t.name.charAt(0)}</div><div style="flex:1"><div style="font-size:12px;font-weight:700">${t.name}</div></div><div class="sb-score" style="font-size:16px">${t.score.toLocaleString()}</div></div>`).join('')}<a href="#/scoreboard/${e.slug}"><button class="btn btn-ghost" style="width:100%;justify-content:center;margin-top:14px">FULL RESULTS →</button></a></div>`:''}</div>
    </div></div></div>`;}

/* ══ COMPETITION ═════════════════════════════════════════ */
function viewCompete(slug){
  const e=EVENTS.find(x=>x.slug===slug)||EVENTS[0];
  const cats=['all',...new Set(CHALLENGES.map(c=>c.cat))];
  return`<div style="padding-top:60px;height:calc(100vh - 60px)">
    <div style="background:rgba(2,2,12,.95);border-bottom:1px solid rgba(255,255,255,.06);padding:10px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:16px"><span class="badge badge-live"><span class="dot-live"></span> LIVE</span><div class="title-sm">${e.name}</div></div>
      <div style="display:flex;align-items:center;gap:20px">
        <div style="text-align:center"><div style="font-size:10px;letter-spacing:3px;color:var(--mu)">TEAM</div><div style="font-weight:700;color:var(--c)">BYTE_RUNNERS</div></div>
        <div style="text-align:center"><div style="font-size:10px;letter-spacing:3px;color:var(--mu)">SCORE</div><div style="font-weight:900;font-size:20px;color:var(--c);font-family:var(--mono)">${S.teamScore.toLocaleString()}</div></div>
        <div style="text-align:center"><div style="font-size:10px;letter-spacing:3px;color:var(--mu)">RANK</div><div style="font-weight:700;font-size:20px">#${S.teamRank}</div></div>
        <div style="font-size:28px;font-weight:900;color:var(--c);font-family:var(--mono)" id="compete-timer">47:49:00</div>
        <a href="#/scoreboard/${slug}"><button class="btn btn-sm btn-ghost">BOARD</button></a>
      </div>
    </div>
    <div class="compete-layout" style="height:calc(100% - 56px)">
      <div class="compete-main">
        <div class="cat-tabs" id="cat-tabs">
          ${cats.map((c,i)=>`<button class="cat-tab ${i===0?'active':''}" data-cat="${c}" style="--tab-color:var(--cat-${c},var(--c))" onclick="filterChallenges('${c}')">${c.toUpperCase()} <span style="opacity:.5;font-size:9px">${c==='all'?CHALLENGES.length:CHALLENGES.filter(ch=>ch.cat===c).length}</span></button>`).join('')}
        </div>
        <div class="ch-grid" id="ch-grid">${CHALLENGES.map(c=>challengeCard(c)).join('')}</div>
      </div>
      <div class="compete-sidebar">
        <div class="compete-timer">
          <div style="font-size:9px;letter-spacing:3px;color:var(--mu);margin-bottom:8px">TIME REMAINING</div>
          <div class="timer-digits" id="sidebar-timer">47:49:00</div>
          <div style="margin-top:10px"><div class="progress-bar"><div class="progress-fill progress-c" style="width:99.8%"></div></div></div>
        </div>
        <div class="team-score-display">
          <div style="font-size:9px;letter-spacing:3px;color:var(--mu);margin-bottom:4px">BYTE_RUNNERS</div>
          <div class="tsd-score">${S.teamScore.toLocaleString()}</div>
          <div class="tsd-rank">RANK #${S.teamRank} OF 212 TEAMS</div>
          <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:9px">
            <div style="background:rgba(255,255,255,.04);border-radius:6px;padding:8px;text-align:center"><div style="font-weight:700;font-size:14px">${S.solved.length}</div><div style="color:var(--mu)">SOLVED</div></div>
            <div style="background:rgba(255,255,255,.04);border-radius:6px;padding:8px;text-align:center"><div style="font-weight:700;font-size:14px">${CHALLENGES.length-S.solved.length}</div><div style="color:var(--mu)">LEFT</div></div>
          </div>
        </div>
        <div style="font-size:8px;letter-spacing:3px;color:var(--mu);margin-bottom:8px">TOP TEAMS</div>
        ${TEAMS.slice(0,8).map((t,i)=>`<div style="display:flex;align-items:center;gap:7px;padding:8px 4px;border-bottom:1px solid rgba(255,255,255,.04);${t.name==='BYTE_RUNNERS'?'background:rgba(0,245,255,.06);border-radius:6px;padding:8px;':''}">
          <span style="font-size:10px;color:${i<3?['#FFD700','#C0C0C0','#CD7F32'][i]:'var(--mu)'};min-width:16px;font-weight:700">#${i+1}</span>
          <div class="sb-avatar" style="width:20px;height:20px;font-size:8px;background:${t.color}22;color:${t.color}">${t.name.charAt(0)}</div>
          <span style="flex:1;font-size:10px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.name}</span>
          <span style="font-family:var(--mono);font-size:10px;color:var(--c)">${t.score.toLocaleString()}</span>
        </div>`).join('')}
        <div style="font-size:8px;letter-spacing:3px;color:var(--mu);margin:12px 0 8px">LIVE FEED</div>
        <div id="live-feed" class="notif-feed"></div>
      </div>
    </div>
  </div>`;}

function challengeCard(c){
  const solved=S.solved.includes(c.id);
  return`<div class="ch-card ${solved?'solved':''}" data-cat="${c.cat}" style="--cat-c:var(--cat-${c.cat})" onclick="openChallenge('${c.id}')">
    ${c.id==='p2'&&!solved?`<div class="first-blood">🩸</div>`:''}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">
      <span class="chip" style="font-size:7px;color:var(--cat-${c.cat});border-color:var(--cat-${c.cat})">${c.cat.toUpperCase()}</span>
      <span class="ch-solves">${c.solves} solves</span>
    </div>
    <div class="ch-name">${c.name}</div>
    <div class="ch-pts">${c.pts}<span style="font-size:10px;color:var(--mu);font-weight:400"> pts</span></div>
    <div class="ch-diff">${Array.from({length:5},(_,i)=>`<div class="ch-diff-pip ${i<c.diff?'filled':''}"></div>`).join('')}</div>
  </div>`;}

/* ══ SCOREBOARD ══════════════════════════════════════════ */
function viewScoreboard(slug){
  const e=EVENTS.find(x=>x.slug===slug)||EVENTS[0];
  return`<div class="page-wrap"><div class="container" style="padding-top:36px">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:16px" class="reveal">
      <div><div class="eyebrow">LIVE INTELLIGENCE</div><h1 class="title-xl">SCOREBOARD</h1><div style="font-family:var(--mono);font-size:12px;color:var(--si);margin-top:6px">${e.name} · <span style="color:var(--c)">${TEAMS.length} teams</span></div></div>
      <div style="display:flex;gap:12px;align-items:center">
        <div style="text-align:center"><div style="font-family:var(--mono);font-size:28px;font-weight:900;color:var(--c)" id="sb-timer">47:48:00</div><div style="font-size:8px;letter-spacing:3px;color:var(--mu)">REMAINING</div></div>
        <a href="#/compete/${slug}"><button class="btn btn-primary">COMPETE →</button></a>
      </div>
    </div>
    <div class="card reveal" style="margin-bottom:22px">
      <div class="title-sm" style="margin-bottom:14px">CATEGORY BREAKDOWN</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px">
        ${[...new Set(CHALLENGES.map(c=>c.cat))].map(cat=>{const total=CHALLENGES.filter(c=>c.cat===cat).reduce((a,c)=>a+c.solves,0);return`<div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:9px;letter-spacing:2px;color:var(--cat-${cat})">${cat.toUpperCase()}</span><span style="font-family:var(--mono);font-size:10px;color:var(--mu)">${total}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.round(total/100*100)}%;background:var(--cat-${cat})"></div></div></div>`;}).join('')}
      </div>
    </div>
    <div class="scoreboard reveal">
      <div class="sb-header"><span style="font-size:10px;letter-spacing:3px;color:var(--mu)">RANK / TEAM</span><span style="font-size:10px;letter-spacing:3px;color:var(--mu)">SCORE / SOLVES</span></div>
      ${TEAMS.map((t,i)=>`<div class="sb-row ${t.name==='BYTE_RUNNERS'?'highlight':''}">
        <div class="sb-rank ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">${i<3?['🥇','🥈','🥉'][i]:'#'+(i+1)}</div>
        <div class="sb-team">
          <div class="sb-avatar" style="background:${t.color}22;color:${t.color};width:32px;height:32px;font-size:13px">${t.name.charAt(0)}</div>
          <div><div style="font-size:13px;font-weight:700">${t.name}</div><div style="font-family:var(--mono);font-size:9px;color:var(--mu)">${t.members.length} members · ${t.solves} solves</div></div>
        </div>
        <div></div><div class="sb-score">${t.score.toLocaleString()}</div>
        <div class="sb-change up">▲${Math.floor(Math.random()*200+20)}</div>
      </div>`).join('')}
    </div>
  </div></div>`;}

/* ══ TEAM ════════════════════════════════════════════════ */
function viewTeam(){return`<div class="page-wrap"><div class="container" style="padding-top:36px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:16px"><div><div class="eyebrow">TEAM OPS</div><h1 class="title-xl">BYTE_RUNNERS</h1></div><div style="display:flex;gap:10px"><button class="btn btn-primary" onclick="showToast('Invite link copied!','success')">📋 INVITE</button><button class="btn btn-ghost">SETTINGS</button></div></div>
  <div class="grid-4" style="margin-bottom:22px">${[['Rank','#6','212 teams'],['Score','2,430','pts'],['Solved','7','challenges'],['Events','3','attended']].map(([l,v,s])=>`<div class="stat-card reveal"><div class="sc-lbl">${l.toUpperCase()}</div><div class="sc-val">${v}</div><div class="sc-trend">${s}</div></div>`).join('')}</div>
  <div class="grid-2">
    <div class="card reveal">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><div class="title-sm">MEMBERS</div><span style="font-family:var(--mono);font-size:10px;color:var(--si)">3 / 4</span></div>
      ${TEAMS[5].members.map((m,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)">
        <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--c),var(--v));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700">${m.charAt(0).toUpperCase()}</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:700">${m}</div><div style="font-family:var(--mono);font-size:10px;color:var(--mu)">${i===0?'CAPTAIN':'MEMBER'}</div></div>
        ${i===0?`<span class="chip" style="color:var(--li);border-color:var(--li)">CAPTAIN</span>`:`<button class="btn btn-sm btn-ghost">REMOVE</button>`}
      </div>`).join('')}
      <div style="border:1px dashed rgba(255,255,255,.1);border-radius:8px;padding:16px;text-align:center;margin-top:12px;cursor:none" onclick="showToast('Invite link copied!','success')"><div style="font-size:9px;letter-spacing:3px;color:var(--mu)">OPEN SLOT — INVITE</div></div>
    </div>
    <div>
      <div class="card reveal" style="margin-bottom:14px">
        <div class="title-sm" style="margin-bottom:14px">SOLVE PROGRESS</div>
        ${[...new Set(CHALLENGES.map(c=>c.cat))].map(cat=>{const total=CHALLENGES.filter(c=>c.cat===cat).length,done=Math.max(1,Math.floor(Math.random()*total));return`<div style="margin-bottom:10px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:9px;letter-spacing:2px;color:var(--cat-${cat})">${cat.toUpperCase()}</span><span style="font-family:var(--mono);font-size:10px;color:var(--mu)">${done}/${total}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.round(done/total*100)}%;background:var(--cat-${cat})"></div></div></div>`;}).join('')}
      </div>
      <div class="card reveal">
        <div class="title-sm" style="margin-bottom:14px">ACTIVE EVENTS</div>
        ${EVENTS.filter(e=>e.status!=='past').map(e=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05)"><div><div style="font-size:12px;font-weight:700">${e.name}</div><div style="font-family:var(--mono);font-size:10px;color:var(--mu)">${e.status==='live'?'LIVE NOW':'Upcoming'}</div></div><a href="#/event/${e.slug}"><button class="btn btn-sm btn-${e.status==='live'?'primary':'ghost'}">${e.status==='live'?'COMPETE':'REGISTER'}</button></a></div>`).join('')}
      </div>
    </div>
  </div>
</div></div>`;}

/* ══ PROFILE ═════════════════════════════════════════════ */
function viewProfile(){const u=S.user;return`<div class="page-wrap"><div class="container" style="padding-top:36px">
  <div style="display:flex;gap:28px;align-items:flex-start;margin-bottom:28px;flex-wrap:wrap">
    <div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,var(--c),var(--v),var(--p));display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:900;flex-shrink:0">${u.username.charAt(0).toUpperCase()}</div>
    <div style="flex:1"><h1 class="title-xl">${u.username.toUpperCase()}</h1><div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px"><span class="chip" style="color:var(--c);border-color:var(--c)">PARTICIPANT</span><span class="chip" style="color:var(--li);border-color:var(--li)">BYTE_RUNNERS</span></div><p style="font-family:var(--mono);font-size:12px;color:var(--si);margin-top:10px;line-height:1.7">Offensive security researcher. Web exploitation and binary analysis specialist.</p></div>
    <button class="btn btn-ghost">EDIT</button>
  </div>
  <div class="grid-4" style="margin-bottom:22px">${[['🎯',S.solved.length,'SOLVED'],['⭐','2,430','SCORE'],['🏆','2','TOP 3s'],['🏅',ACHIEVEMENTS.filter(a=>a.earned).length,'BADGES']].map(([ic,v,l])=>`<div class="stat-card reveal"><div style="font-size:22px;margin-bottom:8px">${ic}</div><div class="sc-val">${v}</div><div class="sc-lbl">${l}</div></div>`).join('')}</div>
  <div class="grid-2">
    <div class="card reveal">
      <div class="title-sm" style="margin-bottom:18px">EVENT HISTORY</div>
      ${EVENTS.filter(e=>e.status!=='upcoming').map(e=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.05)"><div style="width:38px;height:38px;border-radius:8px;background:${e.banner};display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">${e.status==='live'?'⚡':'🏁'}</div><div style="flex:1"><div style="font-size:12px;font-weight:700">${e.name}</div><div style="font-family:var(--mono);font-size:10px;color:var(--mu)">#${Math.floor(Math.random()*15+4)} overall</div></div><span class="badge ${e.status==='live'?'badge-live':'badge-past'}">${e.status==='live'?'LIVE':'DONE'}</span></div>`).join('')}
    </div>
    <div>
      <div class="card reveal" style="margin-bottom:14px">
        <div class="title-sm" style="margin-bottom:14px">SKILL PROFILE</div>
        ${[['web',90],['pwn',65],['crypto',75],['re',80],['osint',55],['misc',70]].map(([cat,pct])=>`<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:9px;letter-spacing:2px;color:var(--cat-${cat})">${cat.toUpperCase()}</span><span style="font-family:var(--mono);font-size:10px;color:var(--mu)">${pct}%</span></div><div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:var(--cat-${cat});transition:width 1.5s ease"></div></div></div>`).join('')}
      </div>
      <div class="card reveal">
        <div class="title-sm" style="margin-bottom:14px">ACHIEVEMENTS</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${ACHIEVEMENTS.filter(a=>a.earned).map(a=>`<div style="text-align:center;padding:10px;background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.1);border-radius:8px" title="${a.name}"><div style="font-size:22px">${a.icon}</div></div>`).join('')}</div>
      </div>
    </div>
  </div>
</div></div>`;}

/* ══ ORGANIZER ════════════════════════════════════════════ */
function viewOrganize(){
  const tabs={overview:'OVERVIEW',events:'EVENTS',challenges:'CHALLENGES',anticheat:'INTEGRITY',analytics:'ANALYTICS',settings:'SETTINGS'};
  return`<div class="page-wrap" style="padding-top:60px"><div class="org-layout">
    <div class="org-sidebar">
      <div style="padding:20px 24px 20px"><div style="font-size:9px;letter-spacing:3px;color:var(--mu);margin-bottom:6px">ORGANIZER</div><div style="font-size:14px;font-weight:700">ARQADEX DIVISION</div></div>
      ${Object.entries(tabs).map(([k,v])=>`<div class="org-nav-item ${S.orgTab===k?'active':''}" onclick="setOrgTab('${k}')"><span class="org-icon">${{overview:'📊',events:'⚡',challenges:'🎯',anticheat:'🛡️',analytics:'📈',settings:'⚙️'}[k]}</span><span>${v}</span></div>`).join('')}
      <div style="padding:20px 24px;margin-top:auto"><a href="#/organize/create"><button class="btn btn-primary" style="width:100%;justify-content:center">+ NEW EVENT</button></a></div>
    </div>
    <div class="org-main" id="org-main">${orgTabContent()}</div>
  </div></div>`;}

function orgTabContent(){
  if(S.orgTab==='overview')return`
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><h2 class="title-lg">Platform Overview</h2></div>
      <div class="stat-cards">
        ${[['⚡','1','LIVE EVENTS','↑ 1 this week'],['👥','212','ACTIVE TEAMS','↑ 34 today'],['🎯',CHALLENGES.length,'CHALLENGES','8 categories'],['✅','847','TOTAL SOLVES','↑ 312 today']].map(([ic,v,l,t])=>`<div class="stat-card"><div style="font-size:22px;margin-bottom:8px">${ic}</div><div class="sc-val">${v}</div><div class="sc-lbl">${l}</div><div class="sc-trend">${t}</div></div>`).join('')}
      </div>
      <div class="grid-2">
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div class="title-sm">ACTIVE EVENT</div><span class="badge badge-live"><span class="dot-live"></span>LIVE</span></div>
          <div style="font-size:16px;font-weight:700;margin-bottom:6px">ARQADEX PRIME 2025</div>
          <div style="font-family:var(--mono);font-size:28px;font-weight:900;color:var(--c);margin-bottom:8px" id="org-timer">47:47:00</div>
          <div class="progress-bar" style="margin-bottom:16px"><div class="progress-fill progress-c" style="width:99.8%"></div></div>
          ${[['Teams Registered','212 / 500'],['Total Submissions','1,847'],['Correct Flags','847'],['Flagged Alerts','3']].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)"><span style="font-family:var(--mono);font-size:11px;color:var(--si)">${l}</span><span style="font-family:var(--mono);font-size:11px">${v}</span></div>`).join('')}
          <div style="display:flex;gap:10px;margin-top:16px"><a href="#/organize/arqadex-prime-2025/challenges" style="flex:1"><button class="btn btn-primary" style="width:100%;justify-content:center">MANAGE</button></a><a href="#/organize/arqadex-prime-2025/anticheat" style="flex:1"><button class="btn btn-danger" style="width:100%;justify-content:center">🛡️ INTEGRITY</button></a></div>
        </div>
        <div class="card">
          <div class="title-sm" style="margin-bottom:14px">RECENT ACTIVITY</div>
          ${[['🩸','Team 0xGHOST solved VM_LABYRINTH','2m ago'],['⚠️','Suspicious rate: PHANTOM_LAB','5m ago'],['✅','NULL_PTR solved HEAP_LABYRINTH','8m ago'],['📢','Announcement sent to all teams','15m ago'],['⚠️','IP clustering: 3 teams detected','45m ago']].map(([ic,t,ts])=>`<div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.04)"><span style="font-size:15px;flex-shrink:0">${ic}</span><div><div style="font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.6);line-height:1.6">${t}</div><div style="font-size:9px;color:var(--mu);margin-top:2px">${ts}</div></div></div>`).join('')}
        </div>
      </div>
    </div>`;
  if(S.orgTab==='anticheat')return`
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><h2 class="title-lg">🛡️ INTEGRITY SHIELD</h2><span class="badge badge-live"><span class="dot-live"></span>MONITORING</span></div>
      <div class="stat-cards" style="margin-bottom:22px">
        ${[['🚨','3','ACTIVE ALERTS'],['👁️','1,847','SCANNED'],['🔗','2','IP CLUSTERS'],['🎭','1','HONEYPOT HIT']].map(([ic,v,l])=>`<div class="stat-card"><div style="font-size:22px;margin-bottom:8px">${ic}</div><div class="sc-val">${v}</div><div class="sc-lbl">${l}</div></div>`).join('')}
      </div>
      <div class="card" style="margin-bottom:18px">
        <div class="title-sm" style="margin-bottom:14px">ACTIVE ALERTS</div>
        ${[{type:'crit',badge:'CRITICAL',text:'Team EXPLOIT_DB submitted correct flag for HEAP_LABYRINTH 4 seconds after NULL_PTR — same flag hash, different IPs. Flag sharing suspected.',time:'5 min ago'},{type:'warn',badge:'WARNING',text:'PHANTOM_LAB submitted 14 flags in 3 minutes. Automated tool or offline solver. Rate limit active.',time:'31 min ago'},{type:'info',badge:'INFO',text:'Honeypot challenge accessed but not submitted by 2 teams. Normal recon behavior.',time:'1 hr ago'}].map(a=>`<div class="ac-alert ${a.type}"><span class="ac-badge ${a.type==='crit'?'crit':a.type==='warn'?'warn':'info'}">${a.badge}</span><div><div class="ac-text">${a.text}</div><div style="font-size:9px;color:var(--mu);margin-top:4px">${a.time} · <span style="color:var(--or);cursor:none" onclick="showToast('Action recorded','info')">TAKE ACTION</span></div></div></div>`).join('')}
      </div>
      <div class="card" style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div class="title-sm">PER-TEAM FLAG DERIVATIVES</div><button class="btn btn-sm btn-success" onclick="showToast('Flags regenerated','success')">REGENERATE</button></div>
        <p style="font-family:var(--mono);font-size:11px;color:var(--si);line-height:1.7;margin-bottom:14px">Each team receives a unique flag: HMAC-SHA256(base_flag, team_secret). Identical flags from different teams auto-flag for review.</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-family:var(--mono);font-size:10px">
          ${[['BASE FLAG','ARQADEX{oracle_whispers}','var(--mu)'],['TEAM: 0xGHOST','ARQADEX{0x4f7a_oracle}','var(--c)'],['TEAM: NULL_PTR','ARQADEX{0x9b2c_oracle}','var(--p)']].map(([l,v,c])=>`<div style="background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:12px"><div style="color:var(--mu);font-size:8px;letter-spacing:2px;margin-bottom:6px">${l}</div><div style="color:${c};word-break:break-all">${v}</div></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="title-sm" style="margin-bottom:14px">SUBMISSION LOG</div>
        <table class="data-table"><thead><tr><th>TEAM</th><th>CHALLENGE</th><th>TIME</th><th>IP</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody>
          ${[['0xGHOST','VM_LABYRINTH','14:23:01','203.x.x.1','✅ CORRECT',''],['EXPLOIT_DB','HEAP_LABYRINTH','14:23:05','198.x.x.9','🚨 SUSPICIOUS','BAN'],['NULL_PTR','HEAP_LABYRINTH','14:23:01','91.x.x.4','✅ CORRECT',''],['PHANTOM_LAB','ORACLE_WHISPERS','14:19:44','77.x.x.2','⚠️ RATE LIMIT','WARN']].map(([team,ch,t,ip,st,act])=>`<tr><td style="font-weight:700">${team}</td><td style="color:var(--v)">${ch}</td><td>${t}</td><td style="color:var(--mu)">${ip}</td><td>${st}</td><td>${act?`<button class="btn btn-sm btn-${act==='BAN'?'danger':'ghost'}" onclick="showToast('${team}: action taken','info')">${act}</button>`:''}</td></tr>`).join('')}
        </tbody></table>
      </div>
    </div>`;
  if(S.orgTab==='analytics')return`
    <div><h2 class="title-lg" style="margin-bottom:24px">Analytics</h2>
      <div class="grid-2">
        <div class="card"><div class="title-sm" style="margin-bottom:14px">TEAM REGISTRATIONS</div><div style="height:140px;display:flex;align-items:flex-end;gap:5px;padding-top:16px">${[12,28,45,67,89,112,134,156,178,198,206,212].map((v,i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px"><div style="width:100%;background:linear-gradient(180deg,var(--c),var(--v));border-radius:2px 2px 0 0;height:${Math.round(v/212*120)}px"></div><span style="font-size:6px;color:var(--mu)">D${i+1}</span></div>`).join('')}</div></div>
        <div class="card"><div class="title-sm" style="margin-bottom:14px">SOLVES BY CATEGORY</div>${[...new Set(CHALLENGES.map(c=>c.cat))].map(cat=>{const t=CHALLENGES.filter(c=>c.cat===cat).reduce((a,c)=>a+c.solves,0);return`<div style="margin-bottom:9px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:9px;letter-spacing:2px;color:var(--cat-${cat})">${cat.toUpperCase()}</span><span style="font-family:var(--mono);font-size:10px;color:var(--mu)">${t}</span></div><div class="progress-bar"><div class="progress-fill" style="width:${Math.round(t/100*100)}%;background:var(--cat-${cat})"></div></div></div>`;}).join('')}</div>
      </div>
    </div>`;
  return`<div class="card"><div class="title-sm" style="margin-bottom:10px">SECTION AVAILABLE IN FULL DEPLOYMENT</div><p style="font-family:var(--mono);font-size:12px;color:var(--si)">This section requires backend API connectivity.</p></div>`;}

/* ══ CHALLENGE MANAGER ═══════════════════════════════════ */
function viewChallengeManager(slug){return`<div class="page-wrap"><div class="org-layout" style="height:calc(100vh - 60px)">
  <div class="org-sidebar"><div style="padding:20px 24px"><div style="font-size:9px;letter-spacing:3px;color:var(--mu);margin-bottom:6px">CHALLENGE MGR</div><div style="font-size:13px;font-weight:700">ARQADEX PRIME 2025</div></div>${['All Challenges','+ Add Challenge','Categories','Files','Flags','Hints','Scoring','Visibility'].map((item,i)=>`<div class="org-nav-item ${i===0?'active':''}">${item}</div>`).join('')}</div>
  <div class="org-main">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:12px"><h2 class="title-lg">Challenges</h2><button class="btn btn-primary" id="toggle-form" onclick="toggleAddForm()">+ ADD CHALLENGE</button></div>
    <div class="card" style="margin-bottom:20px;display:none;border-color:rgba(0,245,255,.15)" id="add-ch-form">
      <div class="title-sm" style="margin-bottom:18px;color:var(--c)">NEW CHALLENGE</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">NAME</label><input class="form-input" placeholder="BUFFER_OVERFLOW_101"></div>
        <div class="form-group"><label class="form-label">CATEGORY</label><select class="form-select">${['web','pwn','crypto','re','osint','dfir','stego','misc'].map(c=>`<option>${c.toUpperCase()}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">POINTS</label><input class="form-input" type="number" placeholder="500" min="50" max="1000"></div>
        <div class="form-group"><label class="form-label">DIFFICULTY (1-5)</label><input class="form-input" type="number" min="1" max="5" placeholder="3"></div>
      </div>
      <div class="form-group" style="margin-bottom:14px"><label class="form-label">DESCRIPTION</label><textarea class="form-textarea" placeholder="Describe the challenge..."></textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">BASE FLAG <span style="color:var(--mu);font-size:7px">— DERIVATIVES AUTO-GENERATED</span></label><input class="form-input" placeholder="ARQADEX{...}"></div>
        <div class="form-group"><label class="form-label">MAX ATTEMPTS (0=∞)</label><input class="form-input" type="number" placeholder="0"></div>
      </div>
      <div class="form-group" style="margin-bottom:14px"><label class="form-label">FILES</label><div style="border:2px dashed rgba(255,255,255,.1);border-radius:8px;padding:20px;text-align:center;cursor:none" onclick="showToast('File upload ready in production','info')"><div style="font-size:22px;margin-bottom:6px">📁</div><div style="font-family:var(--mono);font-size:11px;color:var(--si)">Drop files or click to upload</div></div></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary" onclick="showToast('Challenge saved!','success')">SAVE</button>
        <button class="btn btn-ghost" onclick="toggleAddForm()">CANCEL</button>
        <label style="display:flex;align-items:center;gap:8px;cursor:none;font-family:var(--mono);font-size:10px;color:var(--si);margin-left:auto"><input type="checkbox" checked style="accent-color:var(--c)"> Per-team derivatives</label>
        <label style="display:flex;align-items:center;gap:8px;cursor:none;font-family:var(--mono);font-size:10px;color:var(--or)"><input type="checkbox" style="accent-color:var(--or)"> Honeypot flag</label>
      </div>
    </div>
    <div class="card"><table class="data-table"><thead><tr><th>CHALLENGE</th><th>CAT</th><th>PTS</th><th>SOLVES</th><th>DIFF</th><th>ACTIONS</th></tr></thead><tbody>
      ${CHALLENGES.map(c=>`<tr><td style="font-weight:700">${c.name}</td><td><span class="chip" style="color:var(--cat-${c.cat});border-color:var(--cat-${c.cat})">${c.cat.toUpperCase()}</span></td><td style="color:var(--li);font-weight:700">${c.pts}</td><td style="color:var(--c)">${c.solves}</td><td>${Array.from({length:5},(_,i)=>`<span style="color:${i<c.diff?'var(--or)':'var(--mu)'}">★</span>`).join('')}</td><td style="display:flex;gap:6px"><button class="btn btn-sm btn-ghost" onclick="showToast('Editing ${c.name}','info')">EDIT</button><button class="btn btn-sm btn-danger" onclick="showToast('Hidden','info')">HIDE</button></td></tr>`).join('')}
    </tbody></table></div>
  </div>
</div></div>`;}

function viewAntiCheat(slug){return`<div class="page-wrap"><div class="container" style="padding-top:36px"><div style="margin-bottom:28px"><div class="eyebrow">INTEGRITY SYSTEM</div><h1 class="title-xl">🛡️ INTEGRITY SHIELD</h1></div><div id="ac-content">${(()=>{const prev=S.orgTab;S.orgTab='anticheat';const r=orgTabContent();S.orgTab=prev;return r;})()}</div></div></div>`;}

function viewEvents(){return`<div class="page-wrap"><div class="container" style="padding-top:36px">
  <div class="section-header reveal"><div class="eyebrow">MISSION REGISTRY</div><h2 class="title-xl">All Events</h2></div>
  ${EVENTS.filter(e=>e.status==='live').length?`<div style="margin-bottom:28px"><div style="font-size:9px;letter-spacing:4px;color:var(--li);margin-bottom:14px">LIVE NOW</div><div class="grid-2">${EVENTS.filter(e=>e.status==='live').map(e=>eventCard(e)).join('')}</div></div>`:''}
  <div style="margin-bottom:28px"><div style="font-size:9px;letter-spacing:4px;color:var(--c);margin-bottom:14px">UPCOMING</div><div class="grid-2">${EVENTS.filter(e=>e.status==='upcoming').map(e=>eventCard(e)).join('')}</div></div>
  <div><div style="font-size:9px;letter-spacing:4px;color:var(--mu);margin-bottom:14px">PAST</div><div class="grid-2">${EVENTS.filter(e=>e.status==='past').map(e=>eventCard(e,'compact')).join('')}</div></div>
</div></div>`;}

function viewCreateEvent(){return`<div class="page-wrap"><div class="container" style="padding-top:36px;max-width:820px">
  <div style="margin-bottom:28px"><div class="eyebrow">NEW OPERATION</div><h1 class="title-xl">Create CTF Event</h1></div>
  <div class="card" style="border-color:rgba(0,245,255,.15)"><div style="display:grid;gap:18px">
    <div class="form-group"><label class="form-label">EVENT NAME</label><input class="form-input" placeholder="ARQADEX PRIME 2026"></div>
    <div class="grid-2"><div class="form-group"><label class="form-label">START (UTC)</label><input class="form-input" type="datetime-local"></div><div class="form-group"><label class="form-label">END (UTC)</label><input class="form-input" type="datetime-local"></div></div>
    <div class="form-group"><label class="form-label">DESCRIPTION</label><textarea class="form-textarea" placeholder="Describe your CTF event..."></textarea></div>
    <div class="grid-2"><div class="form-group"><label class="form-label">MAX TEAMS</label><input class="form-input" type="number" placeholder="500"></div><div class="form-group"><label class="form-label">TEAM SIZE</label><input class="form-input" type="number" placeholder="4"></div><div class="form-group"><label class="form-label">1ST PRIZE</label><input class="form-input" placeholder="$5,000"></div><div class="form-group"><label class="form-label">FORMAT</label><select class="form-select"><option>Jeopardy</option><option>Attack-Defense</option><option>Mixed</option></select></div></div>
    <div class="form-group"><label class="form-label">CATEGORIES</label><div style="display:flex;flex-wrap:wrap;gap:10px">${['web','pwn','crypto','re','osint','dfir','stego','mal','misc'].map(c=>`<label style="display:flex;align-items:center;gap:6px;cursor:none;font-family:var(--mono);font-size:10px"><input type="checkbox" checked style="accent-color:var(--cat-${c})">${c.toUpperCase()}</label>`).join('')}</div></div>
    <div><div style="font-size:9px;letter-spacing:3px;color:var(--mu);margin-bottom:10px">INTEGRITY OPTIONS</div><div style="display:flex;flex-direction:column;gap:8px">${[['Per-team flag derivatives','checked'],['IP clustering detection','checked'],['Submission rate limiting','checked'],['Honeypot challenges','checked'],['Behavioral analysis',''],['Auto-ban on threshold','']].map(([l,c])=>`<label style="display:flex;align-items:center;gap:10px;cursor:none;font-family:var(--mono);font-size:11px;color:var(--si)"><input type="checkbox" ${c} style="accent-color:var(--c)">${l}</label>`).join('')}</div></div>
    <div style="display:flex;gap:12px"><button class="btn btn-primary btn-lg" onclick="showToast('Event created!','success');setTimeout(()=>navigate('/organize/new-event/challenges'),1200)">CREATE EVENT</button><button class="btn btn-ghost btn-lg" onclick="navigate('/organize')">CANCEL</button></div>
  </div></div>
</div></div>`;}

function view404(){return`<div class="page-wrap" style="display:flex;align-items:center;justify-content:center;min-height:100vh"><div style="text-align:center"><div style="font-size:80px;font-weight:900;color:rgba(255,255,255,.05);-webkit-text-stroke:2px rgba(0,245,255,.18);margin-bottom:20px">404</div><div class="title-xl" style="margin-bottom:14px">TARGET NOT FOUND</div><p style="font-family:var(--mono);font-size:13px;color:var(--si);margin-bottom:28px">The requested endpoint does not exist.</p><a href="#/"><button class="btn btn-primary">RETURN HOME</button></a></div></div>`;}

/* ══ CHALLENGE MODAL ════════════════════════════════════ */
function openChallenge(id){
  const c=CHALLENGES.find(x=>x.id===id);if(!c)return;
  const solved=S.solved.includes(id);
  document.getElementById('modal-root').classList.add('active');
  document.getElementById('modal-root').innerHTML=`
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" style="--top-color:var(--cat-${c.cat})">
      <button class="modal-close" onclick="closeModal()">✕ CLOSE</button>
      <div class="modal-hdr">
        <span class="chip" style="color:var(--cat-${c.cat});border-color:var(--cat-${c.cat});margin-bottom:10px">${c.cat.toUpperCase()}</span>
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">
          <div><h2 class="title-lg" style="color:var(--cat-${c.cat})">${c.name}</h2>
          <div style="display:flex;align-items:center;gap:14px;margin-top:8px">
            <span style="font-size:26px;font-weight:900;color:var(--c);font-family:var(--mono)">${c.pts} <span style="font-size:12px;color:var(--mu);font-weight:400">pts</span></span>
            <div class="ch-diff" style="margin:0">${Array.from({length:5},(_,i)=>`<div class="ch-diff-pip ${i<c.diff?'filled':''}" style="width:18px;height:4px"></div>`).join('')}</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--mu)">${c.solves} solves</span>
          </div></div>
          ${solved?`<span class="badge" style="color:var(--li);border-color:var(--li);background:rgba(199,255,77,.07);flex-shrink:0">✓ SOLVED</span>`:''}
        </div>
      </div>
      <div class="modal-body">
        <div style="font-family:var(--mono);font-size:13px;color:rgba(255,255,255,.62);line-height:1.85;margin-bottom:22px">${c.desc}</div>
        ${c.files.length?`<div style="margin-bottom:22px"><div style="font-size:8px;letter-spacing:4px;color:var(--mu);margin-bottom:9px">FILES</div><div style="display:flex;flex-wrap:wrap;gap:8px">${c.files.map(f=>`<div style="font-family:var(--mono);font-size:11px;color:var(--c);background:rgba(0,245,255,.06);border:1px solid rgba(0,245,255,.15);border-radius:6px;padding:7px 13px;cursor:none" onclick="showToast('${f}: available on challenge server','info')">📎 ${f}</div>`).join('')}</div></div>`:''}
        ${c.hints.length?`<div style="margin-bottom:22px"><div style="font-size:8px;letter-spacing:4px;color:var(--mu);margin-bottom:9px">HINTS <span style="color:var(--or)">(click to reveal)</span></div>${c.hints.map((h,i)=>`<div class="hint-item"><div class="hint-hdr" onclick="this.nextElementSibling.classList.toggle('open')"><span style="font-size:10px;letter-spacing:2px;color:var(--si)">HINT ${i+1}</span><span style="font-family:var(--mono);font-size:9px;color:var(--or)">click to reveal</span></div><div class="hint-body">${h}</div></div>`).join('')}</div>`:''}
        ${!solved?`<div><div style="font-size:8px;letter-spacing:4px;color:var(--mu);margin-bottom:9px">SUBMIT FLAG</div>
          <div class="flag-wrap"><input type="text" class="flag-inp" id="fi-${id}" placeholder="ARQADEX{...}" spellcheck="false" autocomplete="off" onkeydown="if(event.key==='Enter')submitFlag('${id}')"><button class="btn btn-primary" onclick="submitFlag('${id}')">SUBMIT</button></div>
          <div id="fr-${id}"></div></div>`:`<div style="padding:14px;background:rgba(199,255,77,.06);border:1px solid rgba(199,255,77,.2);border-radius:8px;font-family:var(--mono);font-size:12px;color:var(--li);letter-spacing:2px">✓ SOLVED — +${c.pts} POINTS AWARDED</div>`}
      </div>
    </div>
  </div>`;
  setTimeout(()=>document.getElementById(`fi-${id}`)?.focus(),100);
}

function closeModal(){const m=document.getElementById('modal-root');m.classList.remove('active');m.innerHTML='';}
function submitFlag(id){
  const c=CHALLENGES.find(x=>x.id===id);
  const inp=document.getElementById(`fi-${id}`).value.trim();
  const res=document.getElementById(`fr-${id}`);
  if(inp===c.flag||inp.toLowerCase()===c.flag.toLowerCase()){
    res.innerHTML=`<div class="flag-result flag-ok" style="margin-top:10px">✓ CORRECT FLAG — CHALLENGE SOLVED — +${c.pts} PTS</div>`;
    if(!S.solved.includes(id)){S.solved.push(id);localStorage.setItem('arq_solved',JSON.stringify(S.solved));S.teamScore+=c.pts;}
    showAchievement('⚡','CHALLENGE SOLVED',c.name+' conquered!');
    setTimeout(()=>{closeModal();render();},1600);
  }else if(!inp.startsWith('ARQADEX{')){
    res.innerHTML=`<div class="flag-result flag-bad" style="margin-top:10px">✗ INVALID FORMAT — USE ARQADEX{...}</div>`;
  }else{
    res.innerHTML=`<div class="flag-result flag-bad" style="margin-top:10px">✗ INCORRECT FLAG — SUBMISSION LOGGED</div>`;
    const el=document.getElementById(`fi-${id}`);if(el){el.style.borderColor='var(--re)';setTimeout(()=>el.style.borderColor='',800);}
  }
}

/* ══ TIMERS ═══════════════════════════════════════════════ */
const timers={};
function startTimer(id,secs){
  if(timers[id])clearInterval(timers[id]);
  function upd(){const el=document.getElementById(id);if(!el){clearInterval(timers[id]);return;}const h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60),s=secs%60;el.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;el.className=el.className.replace(/\bwarning\b|\bdanger\b/,'');if(secs<3600)el.classList.add('warning');if(secs<600)el.classList.add('danger');if(secs>0)secs--;}
  upd();timers[id]=setInterval(upd,1000);
}

/* ══ LIVE FEED ════════════════════════════════════════════ */
const FEEDS=[
  ()=>`<span style="color:var(--p);font-weight:700">🩸 FIRST BLOOD</span> Team <span style="color:var(--c);font-weight:700">${TEAMS[Math.floor(Math.random()*5)].name}</span> solved <span style="color:var(--v)">${CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)].name}</span>`,
  ()=>`Team <span style="color:var(--c);font-weight:700">${TEAMS[Math.floor(Math.random()*TEAMS.length)].name}</span> solved <span style="color:var(--v)">${CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)].name}</span> <span style="color:var(--li)">+${[250,350,400,500,600][Math.floor(Math.random()*5)]}pts</span>`,
  ()=>`📢 <span style="color:var(--or)">ORGANIZER:</span> Hint released for <span style="color:var(--v)">${CHALLENGES[Math.floor(Math.random()*CHALLENGES.length)].name}</span>`,
  ()=>`⚡ <span style="color:var(--c)">${TEAMS[Math.floor(Math.random()*4)].name}</span> moved to rank <span style="color:var(--li)">#${Math.floor(Math.random()*5+1)}</span>`,
];
function startLiveFeed(){
  const feed=document.getElementById('live-feed');if(!feed)return;
  const add=()=>{if(!document.getElementById('live-feed'))return;const d=document.createElement('div');d.className='notif-item';d.innerHTML=FEEDS[Math.floor(Math.random()*FEEDS.length)]();feed.insertBefore(d,feed.firstChild);while(feed.children.length>7)feed.removeChild(feed.lastChild);};
  add();add();add();setInterval(add,4000+Math.random()*3000);
}

/* ══ INIT FUNCTIONS ══════════════════════════════════════ */
function initLanding(){startTimer('hero-timer',47*3600+58*60);initReveal();}
function initEventDetail(){startTimer('event-timer',47*3600+51*60);initReveal();}
function initCompete(){startTimer('compete-timer',47*3600+49*60);startTimer('sidebar-timer',47*3600+49*60);startLiveFeed();window.filterChallenges=cat=>{document.querySelectorAll('.cat-tab').forEach(t=>t.classList.toggle('active',t.dataset.cat===cat));document.querySelectorAll('.ch-card').forEach(c=>{c.style.display=(cat==='all'||c.dataset.cat===cat)?'':'none';});};}
function initScoreboard(){startTimer('sb-timer',47*3600+48*60);setInterval(()=>document.querySelectorAll('.sb-bar').forEach(b=>b.style.width=(Math.random()*50+50)+'%'),7000);}
function initDashboard(){startTimer('dash-timer',47*3600+52*60);}
function initOrganize(){startTimer('org-timer',47*3600+47*60);}
function initReveal(){const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -30px 0px'});document.querySelectorAll('.reveal:not(.visible)').forEach(el=>obs.observe(el));}
function initAuth(){window.selectRole=r=>{document.querySelectorAll('.role-card').forEach(c=>c.classList.toggle('selected',c.dataset.role===r));};}
function initChallengeManager(){window.toggleAddForm=()=>{const f=document.getElementById('add-ch-form');if(f)f.style.display=f.style.display==='none'?'block':'none';};}
function initAntiCheat(){}

/* ══ ORG TABS ════════════════════════════════════════════ */
window.setOrgTab=tab=>{
  S.orgTab=tab;
  const m=document.getElementById('org-main');if(m)m.innerHTML=orgTabContent();
  startTimer('org-timer',47*3600+47*60);
  document.querySelectorAll('.org-nav-item').forEach((item,i)=>{
    item.classList.toggle('active',Object.keys({overview:1,events:1,challenges:1,anticheat:1,analytics:1,settings:1})[i]===tab);
  });
};

/* ══ AUTH ════════════════════════════════════════════════ */
window.handleAuth=(e,mode)=>{
  e.preventDefault();
  const role=document.querySelector('.role-card.selected')?.dataset.role||'participant';
  const username=mode==='register'?document.getElementById('inp-username')?.value:('operative_'+Math.floor(Math.random()*9999));
  const email=document.getElementById('inp-email').value;
  S.user={username:username||email.split('@')[0],email,role};
  localStorage.setItem('arq_user',JSON.stringify(S.user));
  showToast('Welcome, '+S.user.username.toUpperCase()+'!','success');
  setTimeout(()=>navigate(role==='organizer'?'/organize':'/dashboard'),700);
};
window.quickLogin=role=>{
  S.user={username:role==='organizer'?'arqadex_org':'ghost_root',email:role+'@arqadex.site',role};
  localStorage.setItem('arq_user',JSON.stringify(S.user));
  showToast('Demo: '+S.user.username,'success');
  setTimeout(()=>navigate(role==='organizer'?'/organize':'/dashboard'),500);
};
window.logout=()=>{S.user=null;localStorage.removeItem('arq_user');navigate('/');};
window.registerEvent=()=>showToast('Team registered!','success');
window.openChallenge=openChallenge;
window.submitFlag=submitFlag;
window.closeModal=closeModal;
window.filterChallenges=()=>{};

/* ══ TOAST ════════════════════════════════════════════════ */
window.showToast=(msg,type='info')=>{
  const d=document.createElement('div');d.className=`toast ${type}`;
  d.innerHTML=`<span>${{success:'✅',error:'❌',info:'ℹ️',warning:'⚠️'}[type]||'ℹ️'}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(d);
  setTimeout(()=>{d.style.opacity='0';d.style.transform='translateX(20px)';d.style.transition='all .3s';setTimeout(()=>d.remove(),300);},3000);
};

/* ══ ACHIEVEMENTS ═════════════════════════════════════════ */
function showAchievement(icon,name){
  const p=document.getElementById('achievement-popup');if(!p)return;
  document.getElementById('ach-icon').textContent=icon;
  document.getElementById('ach-name').textContent=name;
  p.classList.remove('hidden');setTimeout(()=>p.classList.add('hidden'),4000);
}

/* ══ NOTIFICATIONS ════════════════════════════════════════ */
window.showNotifications=()=>{
  document.getElementById('modal-root').classList.add('active');
  document.getElementById('modal-root').innerHTML=`<div class="modal-overlay" onclick="if(event.target===this)closeModal()"><div class="modal" style="max-width:460px"><button class="modal-close" onclick="closeModal()">✕</button><div class="modal-hdr"><div class="title-sm">NOTIFICATIONS</div></div><div class="modal-body" style="padding:0">${NOTIFICATIONS.map(n=>`<div style="padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.05);opacity:${n.read?.55:1}"><div style="font-family:var(--mono);font-size:12px;line-height:1.6">${n.text}</div><div style="font-size:9px;color:var(--mu);margin-top:5px">${n.time}</div></div>`).join('')}</div></div></div>`;
};

/* ══ CURSOR ═══════════════════════════════════════════════ */
const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
let rx=0,ry=0;
document.addEventListener('mousemove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';});
setInterval(()=>{rx+=(parseFloat(dot.style.left||0)-rx)*.12;ry+=(parseFloat(dot.style.top||0)-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';},16);
function setupCursorHover(){document.querySelectorAll('a,button,[onclick],.event-card,.ch-card,.org-nav-item,.role-card,.hint-hdr').forEach(el=>{el.addEventListener('mouseenter',()=>{dot.classList.add('hover');ring.classList.add('hover');});el.addEventListener('mouseleave',()=>{dot.classList.remove('hover');ring.classList.remove('hover');});});}

/* ══ CANVAS BG ════════════════════════════════════════════ */
const bc=document.getElementById('bg-canvas'),bx=bc.getContext('2d');
let BW=0,BH=0,bn=[];
function resizeBG(){BW=bc.width=innerWidth;BH=bc.height=innerHeight;}
window.addEventListener('resize',resizeBG);resizeBG();
bn=Array.from({length:75},()=>({x:Math.random()*BW,y:Math.random()*BH,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,r:Math.random()*1.2+.3,op:Math.random()*.28+.05,tw:Math.random()*Math.PI*2,ts:Math.random()*1.1+.4}));
let bgT=0;
(function bgLoop(){
  bgT+=.006;bx.clearRect(0,0,BW,BH);
  const g=bx.createLinearGradient(0,0,0,BH);g.addColorStop(0,'#020208');g.addColorStop(1,'#04040F');bx.fillStyle=g;bx.fillRect(0,0,BW,BH);
  for(let i=0;i<bn.length;i++){for(let j=i+1;j<bn.length;j++){const dx=bn[i].x-bn[j].x,dy=bn[i].y-bn[j].y,d=Math.hypot(dx,dy);if(d<105){bx.strokeStyle=`rgba(0,245,255,${(1-d/105)*.05})`;bx.lineWidth=.5;bx.beginPath();bx.moveTo(bn[i].x,bn[i].y);bx.lineTo(bn[j].x,bn[j].y);bx.stroke();}}}
  for(const n of bn){n.tw+=n.ts*.014;n.x+=n.vx;n.y+=n.vy;if(n.x<0)n.x=BW;if(n.x>BW)n.x=0;if(n.y<0)n.y=BH;if(n.y>BH)n.y=0;bx.fillStyle=`rgba(0,245,255,${n.op*(.5+.5*Math.sin(n.tw))})`;bx.beginPath();bx.arc(n.x,n.y,n.r,0,Math.PI*2);bx.fill();}
  const by=((bgT*.07)%1)*BH;const bg2=bx.createLinearGradient(0,by-14,0,by+14);bg2.addColorStop(0,'transparent');bg2.addColorStop(.5,'rgba(0,245,255,.016)');bg2.addColorStop(1,'transparent');bx.fillStyle=bg2;bx.fillRect(0,by-14,BW,28);
  requestAnimationFrame(bgLoop);
})();

/* ══ BOOT ══════════════════════════════════════════════════ */
window.navigate=navigate;
render();
})();
