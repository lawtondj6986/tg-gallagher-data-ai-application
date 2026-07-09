/* =============================================================================
   TG Gallagher — Enterprise Data & AI Platform  ·  DATA LAYER (v2)
   $250–300M New England mechanical contractor. All figures illustrative.
   ========================================================================== */

window.TGG = (function () {
  "use strict";

  const CANDIDATE = {
    name: "Daniel Lawton",
    role: "Head of Data Architecture & AI",
    email: "lawtondj@gmail.com",
    phone: "",
    location: "South Shore, Massachusetts",
    linkedin: "",
    tagline:
      "A construction-aware data leader who has already built and shipped modern data platforms and AI products — not just theorized about them.",
  };

  const COMPANY = {
    name: "TG Gallagher",
    founded: 1940,
    hq: "309 Waverley Oaks Road, Waltham, MA",
    trades: ["HVAC", "Plumbing", "Fire Protection", "Refrigeration", "Fabrication", "Service"],
    sectors: ["Healthcare", "Higher Education", "Life Sciences", "Biotech", "Industrial", "Commercial"],
  };

  /* ---- headline KPIs ----------------------------------------------------- */
  const KPIS = [
    { key: "backlog",  label: "Signed Backlog",         value: 412.6, unit: "$M", delta: +6.2,  good: true, spark: [318,330,341,355,360,372,381,390,398,404,409,412.6], live: 0.04 },
    { key: "revenue",  label: "Revenue YTD",            value: 214.8, unit: "$M", delta: +11.4, good: true, spark: [12,31,52,74,96,118,139,159,178,192,205,214.8], live: 0.03 },
    { key: "margin",   label: "Projected Gross Margin", value: 18.7,  unit: "%",  delta: +1.3,  good: true, spark: [16.1,16.4,16.9,17.2,17.0,17.5,17.9,18.1,18.0,18.3,18.5,18.7], live: 0.01 },
    { key: "wip",      label: "Under-billed WIP",       value: 9.42,  unit: "$M", delta: -2.1,  good: true, spark: [14.2,13.6,13.1,12.4,11.8,11.9,11.2,10.7,10.3,9.9,9.6,9.42], live: 0.02 },
    { key: "cochange", label: "Open Change Orders",     value: 5.85,  unit: "$M", delta: -14.0, good: true, spark: [9.1,8.7,8.9,8.2,7.6,7.8,7.1,6.9,6.6,6.3,6.0,5.85], live: 0.02 },
    { key: "prod",     label: "Field Productivity Idx", value: 1.06,  unit: "×",  delta: +4.0,  good: true, spark: [0.94,0.95,0.97,0.98,0.99,1.0,1.01,1.02,1.03,1.04,1.05,1.06], live: 0.005 },
  ];

  const TRADE_COLORS = {
    "HVAC": "#3987e5", "Plumbing": "#199e70", "Fire Protection": "#d95926",
    "Refrigeration": "#9085e9", "Fabrication": "#c98500", "Service": "#57b0e0",
  };
  const STATUS_COLORS = { "On Track": "#0ca30c", "Watch": "#fab219", "At Risk": "#ec835a", "Critical": "#d03b3b" };

  /* ---- project portfolio (with drill-down detail) ------------------------ */
  const PROJECTS = [
    { id:"P-2041", name:"Mass General Brigham — Cancer Center Fit-Out", short:"MGB Cancer Center", sector:"Healthcare",      pm:"D. Alves",  value:38.4, pctComplete:62, margin:19.2, marginBid:18.0, status:"On Track", ctc:11.9, schedVar:+2,  lead:"HVAC",            cos:{count:14, value:2.1}, mix:{HVAC:52,Plumbing:21,"Fire Protection":14,Refrigeration:5,Service:8} },
    { id:"P-2039", name:"MIT.nano — Cleanroom Expansion",              short:"MIT.nano Cleanroom", sector:"Life Sciences",   pm:"R. Okafor", value:52.1, pctComplete:41, margin:21.5, marginBid:20.0, status:"On Track", ctc:26.4, schedVar:+1,  lead:"HVAC",            cos:{count:9,  value:1.4}, mix:{HVAC:58,Plumbing:14,"Fire Protection":10,Refrigeration:12,Service:6} },
    { id:"P-2044", name:"Moderna Norwood — Fill/Finish Suite",         short:"Moderna Norwood",    sector:"Biotech",         pm:"S. Kelly",  value:29.7, pctComplete:78, margin:14.1, marginBid:17.5, status:"At Risk", ctc:5.8,  schedVar:-9,  lead:"Plumbing",        cos:{count:22, value:3.6}, mix:{HVAC:34,Plumbing:38,"Fire Protection":12,Refrigeration:10,Service:6} },
    { id:"P-2036", name:"Boston Children's — Central Utility Plant",   short:"BCH Utility Plant",  sector:"Healthcare",      pm:"M. Tran",   value:44.9, pctComplete:55, margin:17.8, marginBid:17.0, status:"Watch",   ctc:18.2, schedVar:-3,  lead:"HVAC",            cos:{count:16, value:2.4}, mix:{HVAC:60,Plumbing:15,"Fire Protection":9,Refrigeration:10,Service:6} },
    { id:"P-2048", name:"Harvard SEC — Allston Research Labs",         short:"Harvard SEC",        sector:"Higher Education",pm:"J. Byrne",  value:33.2, pctComplete:28, margin:20.1, marginBid:19.5, status:"On Track", ctc:22.1, schedVar:0,   lead:"Fire Protection", cos:{count:6,  value:0.8}, mix:{HVAC:44,Plumbing:20,"Fire Protection":24,Refrigeration:6,Service:6} },
    { id:"P-2031", name:"Vertex Seaport — Phase III Labs",             short:"Vertex Seaport",     sector:"Biotech",         pm:"A. Rivera", value:61.5, pctComplete:69, margin:16.4, marginBid:16.0, status:"Watch",   ctc:16.9, schedVar:-2,  lead:"HVAC",            cos:{count:18, value:2.9}, mix:{HVAC:55,Plumbing:18,"Fire Protection":11,Refrigeration:10,Service:6} },
    { id:"P-2045", name:"Beth Israel Deaconess — Inpatient Tower",     short:"BIDMC Tower",        sector:"Healthcare",      pm:"D. Alves",  value:57.8, pctComplete:34, margin:18.9, marginBid:18.5, status:"On Track", ctc:35.1, schedVar:+3,  lead:"Plumbing",        cos:{count:11, value:1.7}, mix:{HVAC:40,Plumbing:34,"Fire Protection":14,Refrigeration:6,Service:6} },
    { id:"P-2029", name:"Northeastern — ISEC II",                      short:"Northeastern ISEC II", sector:"Higher Education", pm:"R. Okafor", value:26.3, pctComplete:88, margin:11.7, marginBid:16.5, status:"Critical", ctc:2.9, schedVar:-12, lead:"Refrigeration",  cos:{count:27, value:4.2}, mix:{HVAC:38,Plumbing:16,"Fire Protection":10,Refrigeration:30,Service:6} },
    { id:"P-2050", name:"Dana-Farber — Longwood Expansion",           short:"Dana-Farber",        sector:"Healthcare",      pm:"S. Kelly",  value:41.0, pctComplete:12, margin:19.8, marginBid:19.0, status:"On Track", ctc:34.9, schedVar:+1,  lead:"HVAC",            cos:{count:3,  value:0.4}, mix:{HVAC:54,Plumbing:20,"Fire Protection":12,Refrigeration:8,Service:6} },
    { id:"P-2033", name:"Takeda Cambridge — Process Utilities",        short:"Takeda Cambridge",   sector:"Life Sciences",   pm:"M. Tran",   value:19.6, pctComplete:71, margin:15.2, marginBid:17.0, status:"Watch",   ctc:5.1,  schedVar:-4,  lead:"Plumbing",        cos:{count:13, value:1.9}, mix:{HVAC:36,Plumbing:40,"Fire Protection":10,Refrigeration:8,Service:6} },
  ];

  const MONTHS = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const TRENDS = {
    wip:    [14.2,13.6,13.1,12.4,11.8,11.9,11.2,10.7,10.3,9.9,9.6,9.42],
    cash:   [22.1,20.8,24.6,26.1,23.9,27.4,29.8,28.2,31.6,33.9,35.1,38.4],
    margin: [16.1,16.4,16.9,17.2,17.0,17.5,17.9,18.1,18.0,18.3,18.5,18.7],
  };

  const COST_VARIANCE = [
    { code:"23 05 — Common HVAC",          variance:+3.1 },
    { code:"23 07 — HVAC Insulation",      variance:+1.4 },
    { code:"23 31 — Ductwork / Sheet Mtl", variance:-2.2 },
    { code:"22 11 — Domestic Water",       variance:+0.8 },
    { code:"22 13 — Sanitary Waste",       variance:-1.1 },
    { code:"21 13 — Fire Suppression",     variance:+2.6 },
    { code:"23 64 — Chilled Water Plant",  variance:-4.7 },
    { code:"23 09 — Controls / BAS",       variance:+1.9 },
  ];

  const LABOR = [
    { trade:"HVAC", ratio:1.08 }, { trade:"Plumbing", ratio:1.02 },
    { trade:"Fire Protection", ratio:1.11 }, { trade:"Refrigeration", ratio:0.94 },
    { trade:"Fabrication", ratio:1.15 }, { trade:"Service", ratio:1.03 },
  ];

  const BACKLOG_SECTOR = [
    { sector:"Healthcare", value:148.2 }, { sector:"Life Sciences", value:96.4 },
    { sector:"Biotech", value:71.9 }, { sector:"Higher Education", value:63.1 },
    { sector:"Industrial", value:20.7 }, { sector:"Commercial", value:12.3 },
  ];

  /* ---- margin bridge (bid → projected, with drivers) --------------------- */
  const MARGIN_BRIDGE = [
    { label:"Blended bid margin", value:17.8, type:"base" },
    { label:"Productivity gains", value:+1.4, type:"pos" },
    { label:"Change-order recovery", value:+0.9, type:"pos" },
    { label:"Chilled-water overrun", value:-0.8, type:"neg" },
    { label:"Schedule slippage", value:-0.6, type:"neg" },
    { label:"Projected gross margin", value:18.7, type:"total" },
  ];

  /* ---- source-system connectors ----------------------------------------- */
  const CONNECTORS = [
    { name:"Viewpoint Vista",         kind:"ERP · Job Cost / GL",   status:"connected", latency:"4 min",  records:"2.1M", mode:"CDC + API" },
    { name:"Procore",                 kind:"Project Management",    status:"connected", latency:"90 sec", records:"884K", mode:"REST + Webhooks" },
    { name:"Trimble Construction One",kind:"Field / Estimating",    status:"connected", latency:"6 min",  records:"512K", mode:"REST API" },
    { name:"Egnyte",                  kind:"Document Storage",      status:"connected", latency:"12 min", records:"1.4M", mode:"API + Events" },
    { name:"SharePoint / M365",       kind:"Docs / Collaboration",  status:"connected", latency:"8 min",  records:"760K", mode:"Graph API" },
    { name:"Salesforce",              kind:"CRM · Pipeline",        status:"connected", latency:"5 min",  records:"96K",  mode:"REST API" },
    { name:"HRIS / Payroll",          kind:"Labor / Timecards",     status:"syncing",   latency:"—",      records:"148K", mode:"SFTP + API" },
    { name:"Autodesk / BIM 360",      kind:"BIM · Models",          status:"connected", latency:"20 min", records:"340K", mode:"Forge API" },
    { name:"Fabrication (MSUITE)",    kind:"Fab Throughput",        status:"planned",   latency:"—",      records:"—",    mode:"API (Phase 2)" },
    { name:"FP&A (Planful)",          kind:"Financial Planning",    status:"planned",   latency:"—",      records:"—",    mode:"API (Phase 2)" },
  ];

  const GOVERNANCE = [
    { policy:"Row-Level Security — PMs see only assigned projects", on:true },
    { policy:"Finance role — full portfolio visibility", on:true },
    { policy:"Column masking — labor rates & PII", on:true },
    { policy:"Data lineage tracking (bronze → gold)", on:true },
    { policy:"Semantic layer as single metric source of truth", on:true },
    { policy:"AI: responses grounded to governed sources only", on:true },
    { policy:"AI: external-LLM data-egress guardrail", on:true },
    { policy:"Data-quality checks on silver ingestion", on:true },
  ];

  const AI_PILOTS = [
    { name:"Project Copilot (RAG)",       desc:"NL Q&A over specs, submittals, RFIs & contracts — source-cited.", metric:"−7 hrs/wk searching · faster RFI turnaround", phase:"Live pilot", roi:"High" },
    { name:"AI-Assisted Estimating",      desc:"Surfaces comparable past jobs + risk flags from historical actuals.", metric:"Bid-vs-actual variance ↓ · precon cycle time ↓", phase:"Phase 2", roi:"High" },
    { name:"Margin-Risk Alerts",          desc:"Flags projects trending to overrun before period close.", metric:"At-risk jobs flagged 3–6 wks earlier", phase:"Live pilot", roi:"High" },
    { name:"Field Productivity Insights", desc:"Turns timecard + field data into crew productivity by trade/phase.", metric:"Labor productivity visibility by crew", phase:"Phase 3", roi:"Medium" },
  ];

  const ROADMAP = [
    { phase:"Phase 1 · 0–3 mo",  title:"Foundation & Quick Win", items:["Source-system inventory & assessment","Platform decision (Snowflake / Databricks)","First ingestions → bronze","Semantic layer v0","Ship trusted WIP / job-cost view","Project Copilot pilot"], milestone:"First governed executive dashboard live" },
    { phase:"Phase 2 · 3–6 mo",  title:"Expand & Prove AI",      items:["Procore / Trimble + estimating integration","AI-assisted estimating pilot","Margin-risk alerting","Governance operational (lineage, DQ, RLS)","First training workshops"], milestone:"2–3 AI pilots with named metrics" },
    { phase:"Phase 3 · 6–12 mo", title:"Scale & Self-Service",   items:["HRIS / BIM / fabrication integration","Self-service analytics rollout","Copilots expanded company-wide","MDM & governance maturity","Build / grow the data team"], milestone:"Self-service adoption + AI in daily use" },
    { phase:"Phase 4 · 12–18 mo",title:"Optimize & Lead",        items:["Warehouse cost / performance optimization","Predictive margin & schedule-risk models","Enterprise AI platform","Multi-year reinvestment roadmap"], milestone:"Data & AI as a measurable P&L advantage" },
  ];

  /* ---- Boston / New England market positioning --------------------------- */
  const MARKET = {
    headline: "The data backbone for New England's mechanical heavyweight.",
    stats: [
      { v:"85", u:"yrs", l:"Building Boston since 1940" },
      { v:"#1", u:"", l:"Mechanical contractor, New England" },
      { v:"59", u:"%", l:"Backlog in healthcare + life sciences" },
      { v:"400", u:"+", l:"Tradespeople & engineers" },
    ],
    clients: ["Mass General Brigham","MIT","Harvard","Boston Children's","Dana-Farber","Vertex","Moderna","Takeda","Beth Israel","Northeastern"],
  };

  /* ---- live AI insights feed (auto-surfaced) ----------------------------- */
  const INSIGHTS = [
    { sev:"critical", title:"Northeastern ISEC II margin breach", body:"Projected margin 11.7% vs 16.5% bid (−4.8 pts). Refrigeration burning 1.06× planned hours; CO backlog $4.2M across 27 open. Recommend PM escalation + CO execution sprint.", cite:"Vista · Procore" },
    { sev:"serious",  title:"Chilled-water plant cost-code drift", body:"Code 23 64 running −4.7% to estimate across 3 jobs. Pattern matches 2 prior closed jobs that finished −6%. Early-warning threshold crossed.", cite:"Vista job cost" },
    { sev:"warning",  title:"Moderna Norwood schedule risk", body:"Schedule variance −9 days with 78% complete. Plumbing rough-in trailing; downstream fire-protection start at risk.", cite:"Procore schedule" },
    { sev:"good",     title:"Fabrication throughput up 15%", body:"Shop earned/burned at 1.15× — best of any trade. Prefab strategy validated; recommend shifting more field scope to fab.", cite:"Field + timecards" },
    { sev:"good",     title:"Billing cadence tightening", body:"Under-billed WIP down $4.8M YoY to $9.42M. Faster billing on early-stage healthcare jobs is protecting cash.", cite:"Vista · WIP schedule" },
  ];

  /* ---- live activity log (event stream) ---------------------------------- */
  const ACTIVITY = [
    { t:"09:41", src:"Procore", msg:"Change order CO-118 approved · MGB Cancer Center · $184K" },
    { t:"09:38", src:"Vista",   msg:"Job-cost sync complete · 2.1M rows · 4 min lag" },
    { t:"09:31", src:"AI",      msg:"Margin-risk alert raised · Northeastern ISEC II" },
    { t:"09:24", src:"Trimble", msg:"Field timecards ingested · 148 crew · 6 trades" },
    { t:"09:12", src:"Copilot", msg:"12 spec queries answered · avg 1.8s · 100% cited" },
    { t:"08:57", src:"Egnyte",  msg:"340 submittals indexed to vector store" },
    { t:"08:45", src:"Salesforce", msg:"New pursuit added · $18M · Life Sciences" },
  ];

  /* ---- copilot knowledge base (grounded canned answers) ------------------ */
  const COPILOT_KB = [
    { q:["at risk","risk","overrun","behind","trouble","flag"], cite:"Vista · Procore",
      a:"3 projects are flagged for margin risk:\n\n• **Northeastern ISEC II** — Critical. Margin 11.7% vs 16.5% bid (−4.8 pts), schedule −12 days. Driver: chilled-water plant 23 64 at −4.7%.\n• **Moderna Norwood** — At Risk. Margin 14.1% vs 17.5% bid, −9 days.\n• **Takeda Process Utilities** — Watch. 15.2% vs 17.0% bid.\n\nRefreshed 4 min ago." },
    { q:["margin","gross margin","profit"], cite:"Semantic layer · gold.margin_by_project",
      a:"Portfolio projected gross margin is **18.7%**, +1.3 pts over 12 months and 0.9 pts above blended bid. Healthcare & Life Sciences carry the book; the drag is ISEC II and Moderna. The margin bridge: bid 17.8% + productivity 1.4 + CO recovery 0.9 − chilled-water 0.8 − schedule 0.6 = 18.7%." },
    { q:["wip","work in progress","under-billed","overbilled","billing"], cite:"Vista · gold.wip_schedule",
      a:"Under-billed WIP is **$9.42M**, down from $14.2M a year ago. Largest under-billed positions: Beth Israel Tower and Dana-Farber Longwood (both early-stage). Tightening billing cadence is protecting cash." },
    { q:["backlog","pipeline","book"], cite:"Salesforce · Vista",
      a:"Signed backlog is **$412.6M**, +6.2% MoM. Healthcare $148.2M, Life Sciences $96.4M, Biotech $71.9M, Higher Ed $63.1M, Industrial $20.7M, Commercial $12.3M. Healthcare + Life Sciences = 59% of the book." },
    { q:["change order","co ","cos","pending"], cite:"Procore · gold.change_orders",
      a:"Open change orders total **$5.85M**, down 14% MoM. Northeastern ISEC II carries the most exposure (27 open, $4.2M). Faster CO execution is a top-ROI process win." },
    { q:["productivity","labor","crew","field","trade"], cite:"HRIS timecards · Trimble",
      a:"Field productivity is **1.06×** earned/burned, +4% YoY. Fabrication 1.15×, Fire Protection 1.11×, HVAC 1.08×, Service 1.03×, Plumbing 1.02×, Refrigeration 0.94×. Refrigeration is the one trade underwater — concentrated on ISEC II." },
    { q:["architecture","medallion","semantic","platform","stack","snowflake","databricks"], cite:"Enterprise Data & AI Blueprint",
      a:"Governed **medallion** on a cloud warehouse (Snowflake recommended):\n\n• **Bronze** — raw landings from Vista, Procore, Trimble, Egnyte, M365, Salesforce, BIM via API / CDC / webhooks.\n• **Silver** — cleaned, conformed, DQ-checked, lineage-tracked.\n• **Gold** — dimensional models + semantic layer; WIP, margin, productivity defined once for BI and AI.\n\nRow-level security end to end." },
    { q:["estimating","estimate","bid","precon"], cite:"Trimble estimating · Vista actuals",
      a:"AI-assisted estimating (Phase 2) surfaces comparable historical jobs and flags risk from estimate-vs-actual. On the current book, jobs bid above 18% hold margin; the sub-17% bids (ISEC II, Moderna, Takeda) are exactly the ones now at risk — the historical signal is real." },
    { q:["governance","security","rls","row level","privacy","compliance"], cite:"Governance model",
      a:"Governance is built in: row-level security (PMs → their projects, finance → all), column masking on rates/PII, bronze→gold lineage, semantic layer as the single metric truth. For AI: grounding to governed sources + an egress guardrail on external LLMs." },
    { q:["roi","value","save","savings","worth","payback"], cite:"ROI model",
      a:"Conservative first-year impact: **~$3.2M**. ~0.5 pts of margin protected on $215M revenue (≈$1.1M), ~$1.4M in change-order leakage recovered, and ~7 hrs/week × 40 PMs of time returned (≈$0.7M). Platform run-cost is well under $0.5M/yr — a 6×+ return." },
    { q:["boston","new england","market","clients","healthcare","competitor"], cite:"Market · Salesforce",
      a:"TG Gallagher is New England's #1 mechanical contractor, building Boston since 1940. 59% of backlog is healthcare + life sciences — MGB, Boston Children's, Dana-Farber, MIT, Harvard, Vertex, Moderna, Takeda. This platform is the data edge that defends and grows that position." },
    { q:["roadmap","plan","timeline","phase","90 day","30 60 90"], cite:"Roadmap",
      a:"Four phases over 12–18 months: (1) Foundation & quick win — trusted WIP/job-cost view in 90 days; (2) Expand & prove AI; (3) Scale & self-service; (4) Optimize & lead with predictive models. Trust first, one visible win fast, foundation in parallel." },
    { q:["who","candidate","hire","why you","yourself","background","daniel","lawton"], cite:"Candidate briefing",
      a:"Daniel Lawton pairs real construction-operations roots (a family contracting business — estimating, job costing, scheduling, field) with hands-on modern data & AI delivery (shipped production data platforms, RAG systems, generative-AI products, governance-first). Talks cost codes with a PM in the morning, designs the data model in the afternoon, runs the adoption workshop after." },
  ];

  return {
    CANDIDATE, COMPANY, KPIS, TRADE_COLORS, STATUS_COLORS, PROJECTS, MONTHS, TRENDS,
    COST_VARIANCE, LABOR, BACKLOG_SECTOR, MARGIN_BRIDGE, CONNECTORS, GOVERNANCE,
    AI_PILOTS, ROADMAP, MARKET, INSIGHTS, ACTIVITY, COPILOT_KB,
  };
})();
