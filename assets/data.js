/* =============================================================================
   TG Gallagher — Data & AI Platform (Prototype)
   Mock enterprise data for a $250–300M mechanical contractor.
   All figures are illustrative and generated for demonstration only.
   ========================================================================== */

window.TGG = (function () {
  "use strict";

  /* ---- Candidate / contact (edit these) --------------------------------- */
  const CANDIDATE = {
    name: "Daniel Lawton",
    role: "Head of Data Architecture & AI",
    email: "lawtondj@gmail.com",
    phone: "", // add if you want it shown
    location: "South Shore, Massachusetts",
    linkedin: "", // add your LinkedIn handle to show it
    tagline:
      "A construction-aware data leader who has already built and shipped modern data platforms and AI products — not just theorized about them.",
  };

  /* ---- Company reference (public info) ---------------------------------- */
  const COMPANY = {
    name: "TG Gallagher",
    founded: 1940,
    address: "309 Waverley Oaks Road, Suite 200, Waltham, MA",
    trades: ["HVAC", "Plumbing", "Fire Protection", "Refrigeration", "Fabrication", "Service"],
    sectors: ["Healthcare", "Higher Education", "Life Sciences", "Biotech", "Industrial", "Commercial"],
  };

  /* ---- Executive KPIs (headline tiles) ---------------------------------- */
  const KPIS = [
    { key: "backlog",  label: "Signed Backlog",        value: 412.6, unit: "$M", delta: +6.2, good: true,  spark: [318,330,341,355,360,372,381,390,398,404,409,412.6] },
    { key: "revenue",  label: "Revenue YTD",           value: 214.8, unit: "$M", delta: +11.4, good: true, spark: [12,31,52,74,96,118,139,159,178,192,205,214.8] },
    { key: "margin",   label: "Projected Gross Margin",value: 18.7,  unit: "%",  delta: +1.3, good: true,  spark: [16.1,16.4,16.9,17.2,17.0,17.5,17.9,18.1,18.0,18.3,18.5,18.7] },
    { key: "wip",      label: "Under-billed WIP",      value: 9.42,  unit: "$M", delta: -2.1, good: true,  spark: [14.2,13.6,13.1,12.4,11.8,11.9,11.2,10.7,10.3,9.9,9.6,9.42] },
    { key: "cochange", label: "Open Change Orders",    value: 5.85,  unit: "$M", delta: -14.0, good: true, spark: [9.1,8.7,8.9,8.2,7.6,7.8,7.1,6.9,6.6,6.3,6.0,5.85] },
    { key: "prod",     label: "Field Productivity Idx",value: 1.06,  unit: "×",  delta: +4.0, good: true,  spark: [0.94,0.95,0.97,0.98,0.99,1.00,1.01,1.02,1.03,1.04,1.05,1.06] },
  ];

  /* ---- Trade categorical palette (validated on navy surface) ------------ */
  const TRADE_COLORS = {
    "HVAC": "#3987e5",
    "Plumbing": "#199e70",
    "Fire Protection": "#d95926",
    "Refrigeration": "#9085e9",
    "Fabrication": "#c98500",
    "Service": "#57b0e0",
  };
  const STATUS_COLORS = {
    "On Track": "#0ca30c",
    "Watch": "#fab219",
    "At Risk": "#ec835a",
    "Critical": "#d03b3b",
  };

  /* ---- Portfolio of active projects ------------------------------------- */
  const PROJECTS = [
    { id:"P-2041", name:"Mass General Brigham — Cancer Center Fit-Out", sector:"Healthcare",     pm:"D. Alves",   value:38.4, pctComplete:62, margin:19.2, marginBid:18.0, status:"On Track", ctc:11.9, schedVar:+2,  lead:"HVAC" },
    { id:"P-2039", name:"MIT.nano — Cleanroom Expansion",              sector:"Life Sciences",  pm:"R. Okafor",  value:52.1, pctComplete:41, margin:21.5, marginBid:20.0, status:"On Track", ctc:26.4, schedVar:+1,  lead:"HVAC" },
    { id:"P-2044", name:"Moderna Norwood — Fill/Finish Suite",         sector:"Biotech",        pm:"S. Kelly",   value:29.7, pctComplete:78, margin:14.1, marginBid:17.5, status:"At Risk", ctc:5.8,  schedVar:-9,  lead:"Plumbing" },
    { id:"P-2036", name:"Boston Children's — Central Utility Plant",   sector:"Healthcare",     pm:"M. Tran",    value:44.9, pctComplete:55, margin:17.8, marginBid:17.0, status:"Watch",   ctc:18.2, schedVar:-3,  lead:"HVAC" },
    { id:"P-2048", name:"Harvard SEC — Allston Research Labs",         sector:"Higher Education",pm:"J. Byrne",  value:33.2, pctComplete:28, margin:20.1, marginBid:19.5, status:"On Track", ctc:22.1, schedVar:0,   lead:"Fire Protection" },
    { id:"P-2031", name:"Vertex Seaport — Phase III Labs",             sector:"Biotech",        pm:"A. Rivera",  value:61.5, pctComplete:69, margin:16.4, marginBid:16.0, status:"Watch",   ctc:16.9, schedVar:-2,  lead:"HVAC" },
    { id:"P-2045", name:"Beth Israel Deaconess — Inpatient Tower",     sector:"Healthcare",     pm:"D. Alves",   value:57.8, pctComplete:34, margin:18.9, marginBid:18.5, status:"On Track", ctc:35.1, schedVar:+3,  lead:"Plumbing" },
    { id:"P-2029", name:"Northeastern — ISEC II",                      sector:"Higher Education",pm:"R. Okafor", value:26.3, pctComplete:88, margin:11.7, marginBid:16.5, status:"Critical",ctc:2.9,  schedVar:-12, lead:"Refrigeration" },
    { id:"P-2050", name:"Dana-Farber — Longwood Expansion",           sector:"Healthcare",     pm:"S. Kelly",   value:41.0, pctComplete:12, margin:19.8, marginBid:19.0, status:"On Track", ctc:34.9, schedVar:+1,  lead:"HVAC" },
    { id:"P-2033", name:"Takeda Cambridge — Process Utilities",        sector:"Life Sciences",  pm:"M. Tran",    value:19.6, pctComplete:71, margin:15.2, marginBid:17.0, status:"Watch",   ctc:5.1,  schedVar:-4,  lead:"Plumbing" },
  ];

  /* ---- 12-month trend series (WIP $M, Cash $M, Margin %) ----------------- */
  const MONTHS = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const TRENDS = {
    wip:    [14.2,13.6,13.1,12.4,11.8,11.9,11.2,10.7,10.3,9.9,9.6,9.42],
    cash:   [22.1,20.8,24.6,26.1,23.9,27.4,29.8,28.2,31.6,33.9,35.1,38.4],
    margin: [16.1,16.4,16.9,17.2,17.0,17.5,17.9,18.1,18.0,18.3,18.5,18.7],
  };

  /* ---- Cost-code variance (favorable + / unfavorable −, % vs estimate) --- */
  const COST_VARIANCE = [
    { code:"23 05 — Common HVAC",         variance:+3.1 },
    { code:"23 07 — HVAC Insulation",     variance:+1.4 },
    { code:"23 31 — Ductwork / Sheet Mtl",variance:-2.2 },
    { code:"22 11 — Domestic Water",      variance:+0.8 },
    { code:"22 13 — Sanitary Waste",      variance:-1.1 },
    { code:"21 13 — Fire Suppression",    variance:+2.6 },
    { code:"23 64 — Chilled Water Plant", variance:-4.7 },
    { code:"23 09 — Controls / BAS",      variance:+1.9 },
  ];

  /* ---- Labor productivity by trade (earned/burned ratio) ----------------- */
  const LABOR = [
    { trade:"HVAC",           ratio:1.08 },
    { trade:"Plumbing",       ratio:1.02 },
    { trade:"Fire Protection",ratio:1.11 },
    { trade:"Refrigeration",  ratio:0.94 },
    { trade:"Fabrication",    ratio:1.15 },
    { trade:"Service",        ratio:1.03 },
  ];

  /* ---- Backlog by sector ($M) ------------------------------------------- */
  const BACKLOG_SECTOR = [
    { sector:"Healthcare",       value:148.2 },
    { sector:"Life Sciences",    value:96.4 },
    { sector:"Biotech",          value:71.9 },
    { sector:"Higher Education", value:63.1 },
    { sector:"Industrial",       value:20.7 },
    { sector:"Commercial",       value:12.3 },
  ];

  /* ---- Source-system connectors (integration inventory) ------------------ */
  const CONNECTORS = [
    { name:"Viewpoint Vista",        kind:"ERP · Job Cost / GL",       status:"connected",  latency:"4 min",  records:"2.1M", mode:"CDC + API" },
    { name:"Procore",                kind:"Project Management",        status:"connected",  latency:"90 sec", records:"884K", mode:"REST + Webhooks" },
    { name:"Trimble Construction One",kind:"Field / Estimating",       status:"connected",  latency:"6 min",  records:"512K", mode:"REST API" },
    { name:"Egnyte",                 kind:"Document Storage",          status:"connected",  latency:"12 min", records:"1.4M", mode:"API + Events" },
    { name:"SharePoint / M365",      kind:"Docs / Collaboration",      status:"connected",  latency:"8 min",  records:"760K", mode:"Graph API" },
    { name:"Salesforce",             kind:"CRM · Pipeline",            status:"connected",  latency:"5 min",  records:"96K",  mode:"REST API" },
    { name:"HRIS / Payroll",         kind:"Labor / Timecards",         status:"syncing",    latency:"—",      records:"148K", mode:"SFTP + API" },
    { name:"Autodesk / BIM 360",     kind:"BIM · Models",              status:"connected",  latency:"20 min", records:"340K", mode:"Forge API" },
    { name:"Fabrication Shop (MSUITE)",kind:"Fab Throughput",          status:"planned",    latency:"—",      records:"—",    mode:"API (Phase 2)" },
    { name:"FP&A (Planful)",         kind:"Financial Planning",        status:"planned",    latency:"—",      records:"—",    mode:"API (Phase 2)" },
  ];

  /* ---- Governance policies ---------------------------------------------- */
  const GOVERNANCE = [
    { policy:"Row-Level Security — PMs see only assigned projects", on:true },
    { policy:"Finance role — full portfolio visibility",           on:true },
    { policy:"Column masking — labor rates & SSNs",                on:true },
    { policy:"Data lineage tracking (bronze → gold)",              on:true },
    { policy:"Semantic layer as single metric source of truth",    on:true },
    { policy:"AI: responses grounded to governed sources only",    on:true },
    { policy:"AI: external LLM data-egress guardrail",             on:true },
    { policy:"Data-quality checks on silver ingestion",           on:true },
  ];

  /* ---- AI use-case pilots ----------------------------------------------- */
  const AI_PILOTS = [
    { name:"Project Copilot (RAG)", desc:"NL Q&A over specs, submittals, RFIs & contracts — source-cited.", metric:"−7 hrs/wk searching · faster RFI turnaround", phase:"Live pilot", roi:"High" },
    { name:"AI-Assisted Estimating", desc:"Surfaces comparable past jobs + risk flags from historical actuals.", metric:"Bid-vs-actual variance ↓ · precon cycle time ↓", phase:"Phase 2", roi:"High" },
    { name:"Margin-Risk Alerts", desc:"Flags projects trending to overrun before period close.", metric:"At-risk jobs flagged 3–6 wks earlier", phase:"Live pilot", roi:"High" },
    { name:"Field Productivity Insights", desc:"Turns timecard + field data into crew productivity by trade/phase.", metric:"Labor productivity visibility by crew", phase:"Phase 3", roi:"Medium" },
  ];

  /* ---- Roadmap phases ---------------------------------------------------- */
  const ROADMAP = [
    { phase:"Phase 1 · 0–3 mo",  title:"Foundation & Quick Win",  items:["Source-system inventory & assessment","Platform decision (Snowflake / Databricks)","First ingestions → bronze","Semantic layer v0","Ship trusted WIP / job-cost view","Project Copilot pilot"], milestone:"First governed executive dashboard live" },
    { phase:"Phase 2 · 3–6 mo",  title:"Expand & Prove AI",       items:["Procore / Trimble + estimating integration","AI-assisted estimating pilot","Margin-risk alerting","Governance operational (lineage, DQ, RLS)","First training workshops"], milestone:"2–3 AI pilots with named metrics" },
    { phase:"Phase 3 · 6–12 mo", title:"Scale & Self-Service",    items:["HRIS / BIM / fabrication integration","Self-service analytics rollout","Copilots expanded company-wide","MDM & governance maturity","Build / grow the data team"], milestone:"Self-service adoption + AI in daily use" },
    { phase:"Phase 4 · 12–18 mo",title:"Optimize & Lead",         items:["Warehouse cost / performance optimization","Predictive margin & schedule-risk models","Enterprise AI platform","Multi-year reinvestment roadmap"], milestone:"Data & AI as a measurable P&L advantage" },
  ];

  /* ---- Command palette actions (populated by app.js) --------------------- */
  const COMMANDS = []; // filled at runtime

  /* ---- AI copilot knowledge base (simulated grounded answers) ------------ */
  const COPILOT_KB = [
    {
      q: ["at risk","risk","overrun","behind","trouble","flag"],
      a: "3 projects are flagged for margin risk right now:\n\n• **Northeastern ISEC II** — Critical. Projected margin has slipped to 11.7% vs a 16.5% bid (−4.8 pts), schedule −12 days. Driver: chilled-water plant cost code 23 64 running −4.7% to estimate.\n• **Moderna Norwood Fill/Finish** — At Risk. Margin 14.1% vs 17.5% bid, schedule −9 days.\n• **Takeda Process Utilities** — Watch. Margin 15.2% vs 17.0% bid.\n\nSource: Vista job cost + Procore schedule, refreshed 4 min ago.",
      cite: "Vista · Procore"
    },
    {
      q: ["margin","gross margin","profit"],
      a: "Portfolio projected gross margin is **18.7%**, up 1.3 pts over 12 months and 0.9 pts above the blended bid margin. Healthcare and Life Sciences are carrying the book; the drag is Northeastern ISEC II and Moderna Norwood. Cost code 23 64 (Chilled Water Plant) is the single largest unfavorable variance at −4.7%.",
      cite: "Semantic layer · gold.margin_by_project"
    },
    {
      q: ["wip","work in progress","under-billed","overbilled","billing"],
      a: "Under-billed WIP is **$9.42M**, down from $14.2M a year ago — the tightening billing cadence is working. Largest under-billed positions: Beth Israel Inpatient Tower and Dana-Farber Longwood (both early-stage). I can generate the full WIP schedule by project on request.",
      cite: "Vista · gold.wip_schedule"
    },
    {
      q: ["backlog","pipeline","book"],
      a: "Signed backlog is **$412.6M**, +6.2% MoM. By sector: Healthcare $148.2M, Life Sciences $96.4M, Biotech $71.9M, Higher Ed $63.1M, Industrial $20.7M, Commercial $12.3M. Healthcare + Life Sciences = 59% of the book.",
      cite: "Salesforce · Vista"
    },
    {
      q: ["change order","co ","cos","pending"],
      a: "Open change orders total **$5.85M**, down 14% MoM as the approval workflow tightened. Oldest un-executed CO is 41 days on Boston Children's Central Utility Plant. Faster CO execution is one of the highest-ROI process wins on the roadmap.",
      cite: "Procore · gold.change_orders"
    },
    {
      q: ["productivity","labor","crew","field","trade"],
      a: "Field productivity index is **1.06×** earned/burned, +4% YoY. By trade: Fabrication 1.15×, Fire Protection 1.11×, HVAC 1.08×, Service 1.03×, Plumbing 1.02×, Refrigeration 0.94×. Refrigeration is the one trade burning ahead of earned hours — concentrated on Northeastern ISEC II.",
      cite: "HRIS timecards · Trimble field"
    },
    {
      q: ["architecture","medallion","semantic","platform","stack","snowflake","databricks"],
      a: "The target architecture is a governed **medallion** on a cloud warehouse (Snowflake recommended for time-to-value):\n\n• **Bronze** — raw landings from Vista, Procore, Trimble, Egnyte, M365, Salesforce, BIM via API / CDC / webhooks.\n• **Silver** — cleaned, conformed, DQ-checked, lineage-tracked.\n• **Gold** — dimensional models + a semantic layer where WIP, margin, and productivity are defined once and consumed by BI *and* AI.\n\nRow-level security governs it end to end. See the Blueprint tab for the interactive diagram.",
      cite: "Enterprise Data & AI Blueprint"
    },
    {
      q: ["estimating","estimate","bid","precon"],
      a: "AI-assisted estimating is Phase 2. It surfaces comparable historical jobs and flags risk by learning from estimate-vs-actual across the closed-job set. On the current book, jobs bid above 18% are holding margin; the sub-17% bids (ISEC II, Moderna, Takeda) are exactly the ones now at risk — evidence the historical signal is real.",
      cite: "Trimble estimating · Vista actuals"
    },
    {
      q: ["governance","security","rls","row level","privacy","compliance"],
      a: "Governance is built in, not bolted on: row-level security (PMs see only their projects, finance sees all), column masking on labor rates and PII, full bronze→gold lineage, and a semantic layer as the single source of metric truth. For AI specifically: responses are grounded only to governed sources, with an egress guardrail controlling what data reaches external LLMs.",
      cite: "Governance model"
    },
    {
      q: ["roadmap","plan","timeline","phase","90 day","30 60 90"],
      a: "The 12–18 month roadmap runs in four phases: **(1)** Foundation & quick win — ship a trusted WIP/job-cost view in 90 days; **(2)** Expand & prove AI; **(3)** Scale & self-service; **(4)** Optimize & lead with predictive models. The principle: trust first, one visible executive win fast, foundation built in parallel. See the Roadmap tab.",
      cite: "Roadmap"
    },
    {
      q: ["who","candidate","hire","why you","yourself","background"],
      a: "The candidate pairs real construction-operations roots (a family contracting business — estimating, job costing, scheduling, field) with hands-on modern data & AI delivery (shipped production data platforms, RAG systems, generative-AI products, governance-first). The rare combination: someone who can talk cost codes with a PM in the morning and design the data model in the afternoon — then run the workshop that gets the field to use it.",
      cite: "Candidate briefing"
    },
  ];

  return {
    CANDIDATE, COMPANY, KPIS, TRADE_COLORS, STATUS_COLORS, PROJECTS,
    MONTHS, TRENDS, COST_VARIANCE, LABOR, BACKLOG_SECTOR, CONNECTORS,
    GOVERNANCE, AI_PILOTS, ROADMAP, COMMANDS, COPILOT_KB,
  };
})();
