/* =============================================================================
   TG Gallagher — Data & AI Platform · application logic
   Vanilla JS, no dependencies. Renders the marketing site + command center,
   command palette, and AI copilot.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.TGG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (n, d = 1) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  /* ---------------------------------------------------------------- charts */
  // one-axis line/area chart (single series)
  function lineArea(labels, values, opt = {}) {
    const { color = "#17b6c7", unit = "", area = true, h = 190 } = opt;
    const w = 560, pl = 44, pr = 16, pt = 16, pb = 26;
    const min = Math.min(...values), max = Math.max(...values);
    const lo = min - (max - min) * 0.25, hi = max + (max - min) * 0.2;
    const x = (i) => pl + (i / (labels.length - 1)) * (w - pl - pr);
    const y = (v) => pt + (1 - (v - lo) / (hi - lo || 1)) * (h - pt - pb);
    const pts = values.map((v, i) => [x(i), y(v)]);
    const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
    const areaP = `${line} L ${x(labels.length - 1)} ${h - pb} L ${pl} ${h - pb} Z`;
    let grid = "", ax = "";
    for (let g = 0; g <= 3; g++) {
      const gv = lo + (g / 3) * (hi - lo), gy = y(gv);
      grid += `<line x1="${pl}" y1="${gy}" x2="${w - pr}" y2="${gy}" stroke="var(--c-line-2)" stroke-width="1"/>`;
      ax += `<text x="${pl - 8}" y="${gy + 4}" text-anchor="end" font-size="10" fill="var(--c-ink-3)">${fmt(gv, gv < 20 ? 1 : 0)}</text>`;
    }
    let xl = "", dots = "";
    labels.forEach((l, i) => {
      if (i % 2 === 0 || i === labels.length - 1)
        xl += `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" font-size="10" fill="var(--c-ink-3)">${l}</text>`;
      dots += `<circle class="dot" cx="${x(i)}" cy="${y(values[i])}" r="9" fill="transparent"
        data-tip="<b>${l}</b> · ${fmt(values[i])}${unit}"/>
        <circle cx="${x(i)}" cy="${y(values[i])}" r="3" fill="${color}"/>`;
    });
    const gid = "g" + Math.random().toString(36).slice(2, 7);
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
      </linearGradient></defs>
      ${grid}${ax}
      ${area ? `<path d="${areaP}" fill="url(#${gid})"/>` : ""}
      <path d="${line}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      ${dots}${xl}</svg>`;
  }

  // horizontal categorical bars (single measure)
  function hBars(items, opt = {}) {
    const { unit = "", h = null } = opt;
    const rowH = 34, pad = 8, labelW = 150, valW = 60;
    const H = h || items.length * rowH + pad * 2;
    const w = 560, barX = labelW, barMax = w - labelW - valW - 12;
    const max = Math.max(...items.map((d) => d.value));
    let rows = "";
    items.forEach((d, i) => {
      const yy = pad + i * rowH + rowH / 2;
      const bw = Math.max(3, (d.value / max) * barMax);
      const col = d.color || "#3987e5";
      rows += `<text x="${labelW - 12}" y="${yy + 4}" text-anchor="end" font-size="12" fill="var(--c-ink-2)">${esc(d.label)}</text>
        <rect class="bar" x="${barX}" y="${yy - 9}" width="${bw}" height="18" rx="4" fill="${col}"
          data-tip="<b>${esc(d.label)}</b> · ${fmt(d.value)}${unit}"/>
        <text x="${barX + bw + 8}" y="${yy + 4}" font-size="12" font-weight="700" fill="var(--c-ink)">${fmt(d.value)}${unit}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${H}" width="100%">${rows}</svg>`;
  }

  // diverging bars around zero (favorable + / unfavorable -)
  function divBars(items, opt = {}) {
    const { unit = "%" } = opt;
    const rowH = 33, pad = 8, labelW = 200;
    const H = items.length * rowH + pad * 2, w = 560;
    const zone = w - labelW - 20, mid = labelW + zone / 2;
    const max = Math.max(...items.map((d) => Math.abs(d.value))) || 1;
    let rows = `<line x1="${mid}" y1="${pad}" x2="${mid}" y2="${H - pad}" stroke="var(--c-line)" stroke-width="1"/>`;
    items.forEach((d, i) => {
      const yy = pad + i * rowH + rowH / 2;
      const bw = (Math.abs(d.value) / max) * (zone / 2 - 6);
      const pos = d.value >= 0;
      const col = pos ? "#0ca30c" : "#d03b3b";
      const bx = pos ? mid : mid - bw;
      rows += `<text x="${labelW - 12}" y="${yy + 4}" text-anchor="end" font-size="11.5" fill="var(--c-ink-2)">${esc(d.label)}</text>
        <rect class="bar" x="${bx}" y="${yy - 8}" width="${Math.max(2, bw)}" height="16" rx="3" fill="${col}"
          data-tip="<b>${esc(d.label)}</b> · ${pos ? "+" : ""}${fmt(d.value)}${unit}"/>
        <text x="${pos ? mid + bw + 7 : mid - bw - 7}" y="${yy + 4}" text-anchor="${pos ? "start" : "end"}"
          font-size="11.5" font-weight="700" fill="${col}">${pos ? "+" : ""}${fmt(d.value)}${unit}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${H}" width="100%">${rows}</svg>`;
  }

  function sparkline(data, color = "#35d0e0") {
    const w = 74, h = 26, min = Math.min(...data), max = Math.max(...data);
    const x = (i) => (i / (data.length - 1)) * w;
    const y = (v) => h - ((v - min) / (max - min || 1)) * (h - 4) - 2;
    const p = data.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ");
    return `<svg class="kpi__spark" viewBox="0 0 ${w} ${h}"><path d="${p}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  const statusClass = (s) => ({ "On Track": "ok", "Watch": "warn", "At Risk": "serious", "Critical": "crit" }[s] || "ok");

  /* ---- shared chart tooltip (event delegation) -------------------------- */
  const tip = $("#chartTip");
  document.addEventListener("mousemove", (e) => {
    const t = e.target.closest ? e.target.closest("[data-tip]") : null;
    if (!t) { tip.hidden = true; return; }
    tip.innerHTML = t.getAttribute("data-tip");
    tip.hidden = false;
    const tw = tip.offsetWidth;
    tip.style.left = Math.min(e.clientX + 14, window.innerWidth - tw - 12) + "px";
    tip.style.top = e.clientY - 12 + "px";
  });

  /* ---------------------------------------------- animated number counters */
  function countUp(node, target, unit, dec) {
    const start = performance.now(), dur = 900;
    function step(t) {
      const k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      node.innerHTML = fmt(target * e, dec) + (unit ? `<span class="u">${unit}</span>` : "");
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ================================================= MARKETING SITE render */
  function renderSite() {
    const c = D.CANDIDATE;
    // hero stats
    const hs = [
      { v: "412.6", u: "$M", l: "Signed backlog, live" },
      { v: "18.7", u: "%", l: "Projected gross margin" },
      { v: "10", u: "", l: "Source systems modeled" },
      { v: "4", u: "", l: "AI pilots, tied to metrics" },
    ];
    $("#heroStats").innerHTML = hs.map((s) =>
      `<div class="hstat"><div class="hstat__v">${s.v}<span class="u">${s.u}</span></div><div class="hstat__l">${s.l}</div></div>`).join("");

    // value cards
    const vals = [
      { i: "◱", t: "One source of truth", p: "A governed semantic layer defines WIP, job cost, and margin once — so BI, executives, and AI all read the same trusted number." },
      { i: "✦", t: "AI that pays for itself", p: "A copilot over specs and project data, AI-assisted estimating, and margin-risk alerts — each tied to hours saved or margin protected." },
      { i: "◈", t: "Governed & secure", p: "Row-level security, lineage, and data-quality checks built in from day one — PMs see their projects, finance sees all, AI stays grounded." },
    ];
    $("#valueCards").innerHTML = vals.map((v) =>
      `<div class="vcard"><div class="vcard__icon">${v.i}</div><h3>${v.t}</h3><p>${v.p}</p></div>`).join("");

    // blueprint
    renderBlueprint();

    // pilots
    $("#pilotsGrid").innerHTML = D.AI_PILOTS.map((p) =>
      `<div class="pilot"><div class="pilot__top"><h3>${p.name}</h3><span class="pilot__phase">${p.phase}</span></div>
        <p>${p.desc}</p><div class="pilot__metric">${p.metric}</div></div>`).join("");

    // roadmap
    $("#roadmapGrid").innerHTML = D.ROADMAP.map((r) =>
      `<div class="rm"><div class="rm__phase">${r.phase}</div><h3>${r.title}</h3>
        <ul>${r.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        <div class="rm__milestone">Milestone · <span>${r.milestone}</span></div></div>`).join("");

    // candidate
    $("#candName").textContent = c.name;
    $("#candTag").textContent = c.tagline;
    const diffs = [
      "Real construction operations roots — estimating, job costing, scheduling, field",
      "Shipped production data platforms & AI/RAG products end-to-end",
      "Governance-, privacy-, and security-first by default",
      "Executive translator: turns data strategy into stories leadership funds",
      "Local to Massachusetts — present, available, invested",
    ];
    $("#candDiff").innerHTML = diffs.map((d) => `<li>${d}</li>`).join("");
    $("#candContact").innerHTML =
      `<span class="chip">✉ <a href="mailto:${c.email}">${c.email}</a></span>
       <span class="chip">☎ ${c.phone}</span>
       <span class="chip">◎ ${c.location}</span>
       <span class="chip">in ${c.linkedin}</span>`;
    $("#footContact").textContent = `${c.name} · ${c.email}`;
  }

  const BP = {
    "src": { t: "Source systems", d: "Vista (ERP / job cost), Procore, Trimble Construction One, estimating, scheduling, HRIS/payroll, Egnyte, SharePoint/M365, Salesforce, and BIM/fabrication — each authoritative, none connected today. We land them all." },
    "ing": { t: "Ingestion layer", d: "REST & GraphQL APIs, change-data-capture, webhooks, and event-driven flows orchestrated with dbt + Airflow. Near-real-time where it matters (Procore ~90s), batch where it doesn't." },
    "bronze": { t: "Bronze — raw landings", d: "Immutable, append-only copies of every source exactly as received. Nothing is transformed here; it's the auditable system of record and the replay point for everything downstream." },
    "silver": { t: "Silver — conformed & clean", d: "Deduplicated, standardized, and quality-checked. Conformed dimensions (project, cost code, phase, vendor, employee) and full bronze→gold lineage. This is where trust is manufactured." },
    "gold": { t: "Gold — semantic layer", d: "Business-ready dimensional models plus the semantic layer: WIP, cost-to-complete, projected margin, change-order value, and labor productivity defined once and consumed everywhere." },
    "bi": { t: "BI & self-service", d: "Power BI / Tableau executive dashboards and governed self-service analytics — every metric traceable to its definition. No more spreadsheet reconciliation." },
    "ai": { t: "AI & copilots", d: "RAG over specs and documents, AI-assisted estimating, and margin-risk alerts — all reading from the same governed gold layer, grounded and secured with row-level access." },
    "gov": { t: "Governance (everywhere)", d: "Metadata, lineage, data-quality, master data management, and row-level security wrap the entire stack. For AI: grounding to governed sources and an external-LLM egress guardrail." },
  };
  function renderBlueprint() {
    $("#blueprint-diagram").innerHTML = `
      <div class="bp-col">
        <div class="bp-col__label">Sources</div>
        <div class="bp-node" data-bp="src"><b>10 systems</b><small>ERP · PM · estimating · BIM · HR</small></div>
        <div class="bp-node" data-bp="ing"><b>Ingestion</b><small>API · CDC · webhooks · events</small></div>
      </div>
      <div class="bp-col bp-medallion">
        <div class="bp-tier bronze" data-bp="bronze"><b>Bronze</b><small>Raw, immutable landings</small></div>
        <div class="bp-tier silver" data-bp="silver"><b>Silver</b><small>Conformed · clean · lineage · DQ</small></div>
        <div class="bp-tier gold" data-bp="gold"><b>Gold + Semantic Layer</b><small>WIP · margin · productivity — defined once</small></div>
        <div class="bp-govern" data-bp="gov">◈ Governance · lineage · MDM · row-level security</div>
      </div>
      <div class="bp-col">
        <div class="bp-col__label">Consumption</div>
        <div class="bp-node" data-bp="bi"><b>BI &amp; self-service</b><small>Power BI · Tableau · exec dashboards</small></div>
        <div class="bp-node" data-bp="ai"><b>AI &amp; copilots</b><small>RAG · estimating · alerts</small></div>
      </div>`;
    setBlueprintDetail("gold");
    $$("#blueprint-diagram [data-bp]").forEach((n) =>
      n.addEventListener("click", () => setBlueprintDetail(n.getAttribute("data-bp"))));
  }
  function setBlueprintDetail(key) {
    const b = BP[key];
    $("#blueprintDetail").innerHTML = `<h4>${b.t}</h4><p>${b.d}</p>`;
    $$("#blueprint-diagram [data-bp]").forEach((n) => n.classList.toggle("is-active", n.getAttribute("data-bp") === key));
  }

  /* ==================================================== CONSOLE PANELS */
  let projFilter = "all", projSort = { key: "value", dir: -1 };

  function renderExec() {
    const kpis = D.KPIS.map((k) => {
      const up = k.delta >= 0;
      const good = k.good ? (up ? "up" : "down") : up ? "down" : "up";
      const arrow = up ? "▲" : "▼";
      return `<div class="kpi"><div class="kpi__label">${k.label}</div>
        <div class="kpi__val" data-count="${k.value}" data-unit="${k.unit}" data-dec="${k.unit === "%" || k.unit === "×" ? (k.value < 2 ? 2 : 1) : 1}"></div>
        <div class="kpi__delta ${good === "up" ? "up" : "down"}">${arrow} ${fmt(Math.abs(k.delta), 1)}% vs prior</div>
        ${sparkline(k.spark, good === "up" ? "#0ca30c" : "#35d0e0")}</div>`;
    }).join("");

    const risk = D.PROJECTS.filter((p) => p.status === "At Risk" || p.status === "Critical")
      .sort((a, b) => (a.margin - a.marginBid) - (b.margin - b.marginBid));
    const riskRows = risk.map((p) =>
      `<div class="toggle-row"><span><b style="color:var(--c-ink)">${p.name.split("—")[0].trim()}</b><br>
        <small style="color:var(--c-ink-3)">margin ${fmt(p.margin)}% vs ${fmt(p.marginBid)}% bid · sched ${p.schedVar}d</small></span>
        <span class="pill ${statusClass(p.status)}">${p.status}</span></div>`).join("");

    $("#panel-exec").innerHTML = `
      <div class="c-grid kpi-row">${kpis}</div>
      <div class="c-grid two-col" style="margin-top:16px">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Cash position</span><span class="c-card__sub">12 months · $M</span></div>${lineArea(D.MONTHS, D.TRENDS.cash, { color: "#17b6c7", unit: "M" })}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Projected gross margin</span><span class="c-card__sub">12 months · %</span></div>${lineArea(D.MONTHS, D.TRENDS.margin, { color: "#3987e5", unit: "%", area: false })}</div>
      </div>
      <div class="c-grid wide-narrow" style="margin-top:16px">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Signed backlog by sector</span><span class="c-card__sub">$412.6M total</span></div>
          ${hBars(D.BACKLOG_SECTOR.map((s) => ({ label: s.sector, value: s.value, color: "#3987e5" })), { unit: "M" })}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Margin-risk radar</span><span class="c-card__sub">${risk.length} flagged</span></div>
          ${riskRows}
          <div class="callout">The copilot can explain any flag. Try <b>“what's at risk?”</b></div></div>
      </div>`;
    $$("#panel-exec [data-count]").forEach((n) => countUp(n, +n.dataset.count, n.dataset.unit, +n.dataset.dec));
  }

  function renderProjects() {
    let rows = D.PROJECTS.slice();
    if (projFilter !== "all") rows = rows.filter((p) => statusClass(p.status) === projFilter || (projFilter === "risk" && (p.status === "At Risk" || p.status === "Critical")));
    rows.sort((a, b) => {
      const k = projSort.key; let av = a[k], bv = b[k];
      if (typeof av === "string") return projSort.dir * av.localeCompare(bv);
      return projSort.dir * (av - bv);
    });
    const body = rows.map((p) => {
      const delta = p.margin - p.marginBid;
      return `<tr>
        <td class="name">${p.name}<br><small style="color:var(--c-ink-3)">${p.id} · ${p.sector} · PM ${p.pm}</small></td>
        <td class="tabnum">$${fmt(p.value)}M</td>
        <td><div class="mini-bar"><i style="width:${p.pctComplete}%; background:${D.TRADE_COLORS[p.lead]}"></i></div><small class="tabnum" style="color:var(--c-ink-3)">${p.pctComplete}%</small></td>
        <td class="tabnum">${fmt(p.margin)}%</td>
        <td class="tabnum" style="color:${delta >= 0 ? "var(--ok)" : "var(--crit)"}; font-weight:700">${delta >= 0 ? "+" : ""}${fmt(delta)}</td>
        <td class="tabnum" style="color:${p.schedVar >= 0 ? "var(--ok)" : "var(--crit)"}">${p.schedVar > 0 ? "+" : ""}${p.schedVar}d</td>
        <td><span class="pill ${statusClass(p.status)}">${p.status}</span></td></tr>`;
    }).join("");
    const segs = [["all", "All"], ["risk", "At risk"], ["ok", "On track"], ["warn", "Watch"]];
    $("#panel-projects").innerHTML = `
      <p class="panel-lede">Live portfolio of active projects. Sort any column; filter by health. Margin Δ is projected vs bid margin — the earliest signal of a job drifting.</p>
      <div class="filters"><div class="seg">${segs.map(([k, l]) => `<button data-pf="${k}" class="${projFilter === k ? "is-active" : ""}">${l}</button>`).join("")}</div>
        <span class="c-card__sub" style="margin-left:auto">${rows.length} projects · $${fmt(rows.reduce((s, p) => s + p.value, 0), 0)}M contract value</span></div>
      <div class="c-card" style="padding:4px 4px 8px">
        <table class="c-table"><thead><tr>
          <th data-sort="name">Project</th><th data-sort="value">Contract</th><th data-sort="pctComplete">Complete</th>
          <th data-sort="margin">Margin</th><th data-sort="marginBid">Δ vs bid</th><th data-sort="schedVar">Schedule</th><th data-sort="status">Status</th>
        </tr></thead><tbody>${body}</tbody></table></div>`;
    $$("#panel-projects [data-pf]").forEach((b) => b.addEventListener("click", () => { projFilter = b.dataset.pf; renderProjects(); }));
    $$("#panel-projects th[data-sort]").forEach((th) => th.addEventListener("click", () => {
      const k = th.dataset.sort; projSort.dir = projSort.key === k ? -projSort.dir : -1; projSort.key = k; renderProjects();
    }));
  }

  function renderJobcost() {
    const wipByProj = D.PROJECTS.map((p) => ({ label: p.name.split("—")[0].trim(), value: +(p.ctc * (1 - p.pctComplete / 100) * 0.6).toFixed(1), color: "#17b6c7" }))
      .sort((a, b) => b.value - a.value).slice(0, 7);
    $("#panel-jobcost").innerHTML = `
      <p class="panel-lede">Job cost, WIP, and productivity — the numbers the CFO and project executives wait on today, assembled here in seconds instead of days.</p>
      <div class="c-grid two-col">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Cost-code variance vs estimate</span><span class="c-card__sub">favorable + / unfavorable −</span></div>${divBars(D.COST_VARIANCE)}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Labor productivity by trade</span><span class="c-card__sub">earned / burned</span></div>
          ${hBars(D.LABOR.map((l) => ({ label: l.trade, value: l.ratio, color: D.TRADE_COLORS[l.trade] })), { unit: "×" })}</div>
      </div>
      <div class="c-card" style="margin-top:16px"><div class="c-card__head"><span class="c-card__title">Estimated under-billed WIP by project</span><span class="c-card__sub">$M</span></div>${hBars(wipByProj, { unit: "M" })}</div>
      <div class="callout"><b>Cost code 23 64 (Chilled Water Plant)</b> is the largest unfavorable variance at −4.7%, concentrated on Northeastern ISEC II — the same job flagged Critical. That's the field-to-office signal this platform surfaces automatically.</div>`;
  }

  function renderSources() {
    const conn = D.CONNECTORS.map((c) =>
      `<div class="conn"><span class="conn__dot ${c.status}"></span>
        <div class="conn__body"><b>${c.name}</b><small>${c.kind} · ${c.mode}</small></div>
        <div class="conn__meta"><b>${c.status === "connected" ? "● live" : c.status === "syncing" ? "◐ syncing" : "○ planned"}</b><br>${c.latency !== "—" ? "lag " + c.latency + " · " : ""}${c.records} rows</div></div>`).join("");
    const live = D.CONNECTORS.filter((c) => c.status === "connected").length;
    $("#panel-sources").innerHTML = `
      <p class="panel-lede">Enterprise source-system inventory — the integration strategy across ERP, PM, estimating, HR, docs, CRM, and BIM. ${live} of ${D.CONNECTORS.length} systems flowing into the platform.</p>
      <div class="conn-grid">${conn}</div>
      <div class="callout">Every connector lands to <b>bronze</b> via its native pattern (CDC for Vista, webhooks for Procore, Graph API for M365). Adding a new source is a repeatable, days-not-months exercise — the hard part, understanding the data, is already done.</div>`;
  }

  function renderGovernance() {
    const rows = D.GOVERNANCE.map((g, i) =>
      `<div class="toggle-row"><span>${g.policy}</span><div class="tgl ${g.on ? "on" : ""}" data-gov="${i}"></div></div>`).join("");
    $("#panel-governance").innerHTML = `
      <p class="panel-lede">Governance as an enabler, not a gate. Row-level security, lineage, data quality, and responsible-AI guardrails — the framework that lets leadership trust the numbers and adopt AI safely.</p>
      <div class="c-grid two-col">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Active policies</span><span class="c-card__sub">click to simulate</span></div>${rows}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Responsible-AI posture</span></div>
          <div class="toggle-row"><span>Grounding — answers cite governed sources only</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Model monitoring &amp; audit log</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>External-LLM data-egress guardrail</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>PII / labor-rate column masking</span><div class="tgl on"></div></div>
          <div class="callout" style="margin-top:14px">Same discipline I built into a privacy-first RAG product from day one — grounding and access control are what make an AI copilot trustworthy enough to adopt.</div></div>
      </div>`;
    $$("#panel-governance [data-gov]").forEach((t) => t.addEventListener("click", () => {
      t.classList.toggle("on");
      const on = t.classList.contains("on");
      toast(on ? "Policy enabled" : "Policy disabled", D.GOVERNANCE[+t.dataset.gov].policy);
    }));
  }

  function renderSettings() {
    $("#panel-settings").innerHTML = `
      <p class="panel-lede">Admin control panel. Platform configuration, warehouse, AI, and team access — the levers that keep the platform tuned and cost-managed for the long run.</p>
      <div class="c-grid two-col">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Warehouse</span></div>
          <div class="toggle-row"><span>Platform</span><b style="color:var(--cy-2)">Snowflake · medallion</b></div>
          <div class="toggle-row"><span>Auto-suspend compute (cost control)</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Query result cache</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Monthly credit budget</span><b style="color:var(--c-ink)">$4,200 / mo</b></div>
        </div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">AI configuration</span></div>
          <div class="toggle-row"><span>Copilot model</span><b style="color:var(--cy-2)">Claude · enterprise</b></div>
          <div class="toggle-row"><span>RAG over specs &amp; documents</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Vector index refresh</span><b style="color:var(--c-ink)">nightly</b></div>
          <div class="toggle-row"><span>Row-level security in AI responses</span><div class="tgl on"></div></div>
        </div>
      </div>
      <div class="c-card" style="margin-top:16px"><div class="c-card__head"><span class="c-card__title">Team &amp; roles</span><span class="c-card__sub">proposed org</span></div>
        <table class="c-table"><thead><tr><th>Role</th><th>Function</th><th>Access</th><th>Phase</th></tr></thead><tbody>
          ${[["Head of Data Architecture & AI", "Strategy · architecture · exec advisory", "Full", "Now"],
            ["Data Engineer", "Pipelines · ingestion · dbt", "Full", "Phase 1"],
            ["Analytics Engineer", "Semantic layer · models", "Governed", "Phase 2"],
            ["BI Developer", "Dashboards · self-service", "Governed", "Phase 2"],
            ["AI Engineer", "RAG · copilots · agents", "Governed", "Phase 3"]]
            .map((r) => `<tr><td class="name">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><span class="pill ok">${r[3]}</span></td></tr>`).join("")}
        </tbody></table></div>`;
  }

  function renderCopilotPanel() {
    $("#panel-copilot").innerHTML = `
      <p class="panel-lede">Project Copilot — a retrieval-augmented assistant grounded to governed data. Ask about the portfolio in plain English; every answer cites its source. This is AI use-case #1, running live.</p>
      <div class="callout" style="margin-bottom:18px">The floating copilot (bottom-right) is open across the whole platform. Try: <b>“what's at risk?”</b>, <b>“explain the architecture”</b>, or <b>“how's margin trending?”</b></div>
      <div class="c-grid two-col">
        ${D.AI_PILOTS.map((p) => `<div class="c-card"><div class="c-card__head"><span class="c-card__title">${p.name}</span><span class="pill ${p.phase === "Live pilot" ? "ok" : "warn"}">${p.phase}</span></div>
          <p style="color:var(--c-ink-2); font-size:13.5px; margin:0 0 10px">${p.desc}</p>
          <div class="pilot__metric" style="color:var(--c-ink); border-top:1px solid var(--c-line); padding-top:10px">◆ ${p.metric}</div></div>`).join("")}
      </div>`;
  }

  const PANELS = { exec: renderExec, projects: renderProjects, jobcost: renderJobcost, copilot: renderCopilotPanel, sources: renderSources, governance: renderGovernance, settings: renderSettings };
  const PANEL_TITLES = { exec: "Executive Overview", projects: "Projects", jobcost: "Job Cost & WIP", copilot: "AI Copilot", sources: "Data Sources", governance: "Governance", settings: "Control Panel" };
  let currentPanel = "exec";
  function showPanel(key) {
    currentPanel = key;
    PANELS[key]();
    $$(".panel").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === key));
    $$("#consoleNav button").forEach((b) => b.classList.toggle("is-active", b.dataset.panel === key));
    $("#panelTitle").textContent = PANEL_TITLES[key];
    $(".console__scroll").scrollTop = 0;
    $(".console__side").classList.remove("open");
  }

  /* ==================================================== VIEW SWITCHING */
  function enterConsole(panel) {
    document.documentElement.setAttribute("data-view", "console");
    document.body.setAttribute("data-view", "console");
    $("#siteView").hidden = true;
    $("#consoleView").hidden = false;
    $("#copilotFab").hidden = false;
    showPanel(panel || "exec");
    setTimeout(() => toast("Command Center online", "10 sources synced · 4 pilots active"), 400);
  }
  function exitConsole() {
    document.documentElement.setAttribute("data-view", "site");
    document.body.setAttribute("data-view", "site");
    $("#consoleView").hidden = true;
    $("#siteView").hidden = false;
    $("#copilotFab").hidden = true;
    closeCopilot();
  }

  /* ==================================================== TOASTS */
  function toast(title, sub) {
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}`;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-16px)"; t.style.transition = ".3s"; }, 3200);
    setTimeout(() => t.remove(), 3600);
  }

  /* ==================================================== COMMAND PALETTE */
  const COMMANDS = [
    { ic: "▤", label: "Executive Overview", hint: "console", run: () => { ensureConsole(); showPanel("exec"); } },
    { ic: "▦", label: "Projects", hint: "console", run: () => { ensureConsole(); showPanel("projects"); } },
    { ic: "▨", label: "Job Cost & WIP", hint: "console", run: () => { ensureConsole(); showPanel("jobcost"); } },
    { ic: "⇄", label: "Data Sources", hint: "console", run: () => { ensureConsole(); showPanel("sources"); } },
    { ic: "◈", label: "Governance", hint: "console", run: () => { ensureConsole(); showPanel("governance"); } },
    { ic: "⚙", label: "Control Panel", hint: "console", run: () => { ensureConsole(); showPanel("settings"); } },
    { ic: "✦", label: "Open AI Copilot", hint: "ai", run: () => { openCopilot(); } },
    { ic: "⚑", label: "Flag at-risk projects", hint: "action", run: () => { ensureConsole(); projFilter = "risk"; showPanel("projects"); toast("3 projects flagged", "Northeastern ISEC II · Moderna Norwood · Takeda"); } },
    { ic: "▣", label: "Generate WIP report", hint: "action", run: () => { ensureConsole(); showPanel("jobcost"); toast("WIP report generated", "Under-billed WIP $9.42M · by project"); } },
    { ic: "❋", label: "Ask copilot: how's margin?", hint: "ai", run: () => { openCopilot(); setTimeout(() => sendCopilot("how's margin trending?"), 250); } },
    { ic: "◱", label: "Enter Command Center", hint: "view", run: () => enterConsole("exec") },
    { ic: "←", label: "Back to candidate briefing", hint: "view", run: () => exitConsole() },
  ];
  let palSel = 0, palItems = COMMANDS;
  function ensureConsole() { if (document.body.getAttribute("data-view") !== "console") enterConsole(); }
  function openPalette() {
    $("#palette").hidden = false;
    $("#paletteInput").value = ""; palItems = COMMANDS; palSel = 0; renderPalette();
    setTimeout(() => $("#paletteInput").focus(), 30);
  }
  function closePalette() { $("#palette").hidden = true; }
  function renderPalette() {
    $("#paletteList").innerHTML = palItems.map((c, i) =>
      `<li class="${i === palSel ? "sel" : ""}" data-i="${i}"><span class="ic">${c.ic}</span>${c.label}<small>${c.hint}</small></li>`).join("")
      || `<li style="color:var(--c-ink-3); cursor:default">No matching command</li>`;
    $$("#paletteList li[data-i]").forEach((li) => li.addEventListener("click", () => runPal(+li.dataset.i)));
  }
  function runPal(i) { const c = palItems[i]; if (!c) return; closePalette(); c.run(); }
  $("#paletteInput") && $("#paletteInput").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    palItems = COMMANDS.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(q));
    palSel = 0; renderPalette();
  });

  /* ==================================================== AI COPILOT */
  const stream = () => $("#copilotStream");
  let copilotSeeded = false;
  function openCopilot() {
    $("#copilotDock").hidden = false;
    $("#copilotFab").hidden = true;
    if (!copilotSeeded) {
      copilotSeeded = true;
      botSay("Hi — I'm the Project Copilot. I'm grounded to TG Gallagher's governed data: job cost, WIP, margin, schedule, and the platform architecture. What would you like to know?", "");
      renderChips(["What's at risk?", "How's margin?", "Explain the architecture", "Backlog by sector"]);
    }
    setTimeout(() => $("#copilotText").focus(), 60);
  }
  function closeCopilot() {
    $("#copilotDock").hidden = true;
    if (document.body.getAttribute("data-view") === "console") $("#copilotFab").hidden = false;
  }
  function renderChips(list) {
    $("#copilotChips").innerHTML = list.map((c) => `<button>${esc(c)}</button>`).join("");
    $$("#copilotChips button").forEach((b) => b.addEventListener("click", () => sendCopilot(b.textContent)));
  }
  function userSay(t) {
    const m = document.createElement("div"); m.className = "msg user"; m.textContent = t;
    stream().appendChild(m); stream().scrollTop = stream().scrollHeight;
  }
  function botSay(t, cite) {
    const m = document.createElement("div"); m.className = "msg bot";
    m.innerHTML = mdBold(esc(t)) + (cite ? `<span class="msg__cite">◆ source · ${esc(cite)}</span>` : "");
    stream().appendChild(m); stream().scrollTop = stream().scrollHeight;
  }
  function mdBold(s) { return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "\n"); }
  function typing() {
    const m = document.createElement("div"); m.className = "msg bot typing"; m.id = "typing";
    m.innerHTML = "<i></i><i></i><i></i>";
    stream().appendChild(m); stream().scrollTop = stream().scrollHeight; return m;
  }
  function answerFor(text) {
    const q = text.toLowerCase();
    for (const kb of D.COPILOT_KB) if (kb.q.some((k) => q.includes(k.trim()))) return kb;
    return { a: "I can answer questions grounded in TG Gallagher's data: try asking about at-risk projects, margin, WIP, backlog, change orders, field productivity, the architecture, estimating, governance, or the roadmap.", cite: "" };
  }
  // If deployed to Vercel WITH an API key, /api/copilot answers for real.
  // Everywhere else this 404s / errors and we fall back to grounded canned answers.
  async function askAPI(text) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    try {
      const r = await fetch("/api/copilot", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }), signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!r.ok) return null;
      const j = await r.json();
      return j && j.answer ? { a: j.answer, cite: j.cite || "Claude · live" } : null;
    } catch (_) { clearTimeout(timer); return null; }
  }

  async function sendCopilot(text) {
    if (!text || !text.trim()) return;
    userSay(text); $("#copilotChips").innerHTML = "";
    const ty = typing();
    const min = new Promise((res) => setTimeout(res, 620));
    const live = await askAPI(text);
    await min;
    ty.remove();
    const ans = live || answerFor(text);
    botSay(ans.a, ans.cite);
    renderChips(["What's at risk?", "How's margin?", "Explain the architecture", "The roadmap"]);
  }

  /* ==================================================== WIRE-UP */
  function bind() {
    // nav / hero CTAs
    $("#enterConsole").addEventListener("click", () => enterConsole("exec"));
    $("#heroEnter").addEventListener("click", () => enterConsole("exec"));
    $("#footEnter").addEventListener("click", () => enterConsole("exec"));
    $("#exitConsole").addEventListener("click", exitConsole);
    $("#sideExit").addEventListener("click", exitConsole);
    $("#heroCopilot").addEventListener("click", openCopilot);
    $("#openCopilotNav").addEventListener("click", openCopilot);
    $("#copilotFab").addEventListener("click", openCopilot);
    $("#copilotClose").addEventListener("click", closeCopilot);

    // console nav
    $$("#consoleNav button").forEach((b) => b.addEventListener("click", () => showPanel(b.dataset.panel)));
    $("#genReport").addEventListener("click", () => toast("Report generated", "Executive pack · WIP, margin, backlog exported"));
    $("#consolePalette").addEventListener("click", openPalette);

    // palette
    $("#openPalette").addEventListener("click", openPalette);
    $$("[data-close-palette]").forEach((n) => n.addEventListener("click", closePalette));

    // copilot form
    $("#copilotForm").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#copilotText").value; $("#copilotText").value = ""; sendCopilot(v); });

    // smooth-scroll active nav highlight
    const secs = $$("#siteView section[id]");
    window.addEventListener("scroll", () => {
      let cur = "";
      secs.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
      $$("#siteLinks a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur));
    });

    // keyboard
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#palette").hidden ? openPalette() : closePalette(); return; }
      if (!$("#palette").hidden) {
        if (e.key === "Escape") closePalette();
        else if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); renderPalette(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(0, palSel - 1); renderPalette(); }
        else if (e.key === "Enter") { e.preventDefault(); runPal(palSel); }
      } else if (e.key === "Escape" && !$("#copilotDock").hidden) closeCopilot();
    });
  }

  /* ---- go ---- */
  renderSite();
  bind();
  if (/console|command/i.test(location.hash)) enterConsole("exec");
})();
