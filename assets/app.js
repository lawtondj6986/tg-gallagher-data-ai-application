/* =============================================================================
   TG Gallagher — Enterprise Data & AI Platform · APP (v2 "MILSPEC")
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  "use strict";
  const D = window.TGG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (n, d = 1) => Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const money = (m) => (m >= 1 ? "$" + fmt(m, m < 10 ? 2 : 1) + "M" : "$" + Math.round(m * 1000) + "K");

  /* ===================================================== CHARTS (SVG) */
  function lineArea(labels, series, opt = {}) {
    // series: [{values,color,area,name}]
    const { unit = "", h = 190 } = opt;
    const w = 560, pl = 44, pr = 16, pt = 16, pb = 26;
    const all = series.flatMap((s) => s.values);
    const mn = Math.min(...all), mx = Math.max(...all);
    const lo = mn - (mx - mn) * 0.22, hi = mx + (mx - mn) * 0.2;
    const x = (i) => pl + (i / (labels.length - 1)) * (w - pl - pr);
    const y = (v) => pt + (1 - (v - lo) / (hi - lo || 1)) * (h - pt - pb);
    let grid = "", ax = "";
    for (let g = 0; g <= 3; g++) {
      const gv = lo + (g / 3) * (hi - lo), gy = y(gv);
      grid += `<line x1="${pl}" y1="${gy}" x2="${w - pr}" y2="${gy}" stroke="var(--c-line-2)" stroke-width="1"/>`;
      ax += `<text x="${pl - 8}" y="${gy + 4}" text-anchor="end" font-size="10" fill="var(--c-ink-3)">${fmt(gv, gv < 20 ? 1 : 0)}</text>`;
    }
    let xl = "";
    labels.forEach((l, i) => { if (i % 2 === 0 || i === labels.length - 1) xl += `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" font-size="10" fill="var(--c-ink-3)">${l}</text>`; });
    let body = "", gid = "g" + Math.round(x(1) * y(hi));
    series.forEach((s, si) => {
      const pts = s.values.map((v, i) => [x(i), y(v)]);
      const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
      if (s.area) {
        const id = gid + si;
        body += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".28"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs>`;
        body += `<path d="${line} L ${x(labels.length - 1)} ${h - pb} L ${pl} ${h - pb} Z" fill="url(#${id})"/>`;
      }
      body += `<path d="${line}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.values.forEach((v, i) => { body += `<circle class="dot" cx="${x(i)}" cy="${y(v)}" r="9" fill="transparent" data-tip="<b>${labels[i]}</b> ${s.name ? "· " + esc(s.name) : ""} · ${fmt(v)}${unit}"/><circle cx="${x(i)}" cy="${y(v)}" r="2.6" fill="${s.color}"/>`; });
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet">${grid}${ax}${body}${xl}</svg>`;
  }

  function hBars(items, opt = {}) {
    const { unit = "" } = opt;
    const rowH = 34, pad = 8, labelW = 150, valW = 60;
    const H = items.length * rowH + pad * 2, w = 560, barMax = w - labelW - valW - 12;
    const max = Math.max(...items.map((d) => d.value));
    let rows = "";
    items.forEach((d, i) => {
      const yy = pad + i * rowH + rowH / 2, bw = Math.max(3, (d.value / max) * barMax), col = d.color || "#3987e5";
      rows += `<text x="${labelW - 12}" y="${yy + 4}" text-anchor="end" font-size="12" fill="var(--c-ink-2)">${esc(d.label)}</text>
        <rect class="bar" x="${labelW}" y="${yy - 9}" width="${bw}" height="18" rx="4" fill="${col}" data-tip="<b>${esc(d.label)}</b> · ${fmt(d.value)}${unit}"/>
        <text x="${labelW + bw + 8}" y="${yy + 4}" font-size="12" font-weight="700" fill="var(--c-ink)">${fmt(d.value)}${unit}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${H}" width="100%">${rows}</svg>`;
  }

  function divBars(items, opt = {}) {
    const { unit = "%" } = opt;
    const rowH = 33, pad = 8, labelW = 200, H = items.length * rowH + pad * 2, w = 560;
    const zone = w - labelW - 20, mid = labelW + zone / 2, max = Math.max(...items.map((d) => Math.abs(d.value))) || 1;
    let rows = `<line x1="${mid}" y1="${pad}" x2="${mid}" y2="${H - pad}" stroke="var(--c-line)" stroke-width="1"/>`;
    items.forEach((d, i) => {
      const yy = pad + i * rowH + rowH / 2, bw = (Math.abs(d.value) / max) * (zone / 2 - 6), pos = d.value >= 0;
      const col = pos ? "#0ca30c" : "#d03b3b", bx = pos ? mid : mid - bw;
      rows += `<text x="${labelW - 12}" y="${yy + 4}" text-anchor="end" font-size="11.5" fill="var(--c-ink-2)">${esc(d.label)}</text>
        <rect class="bar" x="${bx}" y="${yy - 8}" width="${Math.max(2, bw)}" height="16" rx="3" fill="${col}" data-tip="<b>${esc(d.label)}</b> · ${pos ? "+" : ""}${fmt(d.value)}${unit}"/>
        <text x="${pos ? mid + bw + 7 : mid - bw - 7}" y="${yy + 4}" text-anchor="${pos ? "start" : "end"}" font-size="11.5" font-weight="700" fill="${col}">${pos ? "+" : ""}${fmt(d.value)}${unit}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${H}" width="100%">${rows}</svg>`;
  }

  // margin waterfall / bridge
  function waterfall(items) {
    const w = 560, h = 240, pl = 40, pb = 58, pt = 14, n = items.length;
    const colW = (w - pl - 16) / n * 0.62, gap = (w - pl - 16) / n;
    const vals = items.map((d) => d.value);
    let cum = 0; const tops = [];
    items.forEach((d) => { if (d.type === "base" || d.type === "total") { tops.push([0, d.value]); cum = d.value; } else { tops.push([cum, cum + d.value]); cum += d.value; } });
    const maxV = Math.max(...tops.flat()) * 1.08, y = (v) => pt + (1 - v / maxV) * (h - pt - pb);
    let body = "";
    items.forEach((d, i) => {
      const x = pl + i * gap + (gap - colW) / 2, y0 = y(Math.max(tops[i][0], tops[i][1])), y1 = y(Math.min(tops[i][0], tops[i][1]));
      const col = d.type === "base" ? "#57b0e0" : d.type === "total" ? "#17b6c7" : d.value >= 0 ? "#0ca30c" : "#d03b3b";
      body += `<rect class="bar" x="${x}" y="${y0}" width="${colW}" height="${Math.max(3, y1 - y0)}" rx="3" fill="${col}" data-tip="<b>${esc(d.label)}</b> · ${d.type === "pos" || d.type === "neg" ? (d.value >= 0 ? "+" : "") : ""}${fmt(d.value)}%"/>`;
      body += `<text x="${x + colW / 2}" y="${y0 - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--c-ink)">${d.type === "pos" ? "+" : ""}${fmt(d.value)}</text>`;
      const words = d.label.split(" "), l1 = words.slice(0, 2).join(" "), l2 = words.slice(2).join(" ");
      body += `<text x="${x + colW / 2}" y="${h - pb + 18}" text-anchor="middle" font-size="9.5" fill="var(--c-ink-3)">${esc(l1)}</text>`;
      if (l2) body += `<text x="${x + colW / 2}" y="${h - pb + 30}" text-anchor="middle" font-size="9.5" fill="var(--c-ink-3)">${esc(l2)}</text>`;
      if (i < n - 1) body += `<line x1="${x + colW}" y1="${y(tops[i][1])}" x2="${pl + (i + 1) * gap + (gap - colW) / 2}" y2="${y(tops[i][1])}" stroke="var(--c-line)" stroke-dasharray="2 2"/>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%">${body}</svg>`;
  }

  // earned-value S-curve for a project
  function evmCurve(p) {
    const w = 520, h = 200, pl = 34, pb = 26, pt = 12, N = 12;
    const s = (t) => 1 / (1 + Math.exp(-8 * (t - 0.5))); // sigmoid 0..1
    const now = Math.round((p.pctComplete / 100) * (N - 1));
    const planned = [], earned = [], actual = [];
    const cpi = p.margin / p.marginBid; // >1 good
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      planned.push(s(t) * 100);
      if (i <= now) { const e = (s(t) / s(now / (N - 1))) * p.pctComplete; earned.push(e); actual.push(e / cpi); }
    }
    const labels = D.MONTHS;
    const x = (i) => pl + (i / (N - 1)) * (w - pl - 14), y = (v) => pt + (1 - v / 110) * (h - pt - pb);
    const path = (arr, col, dash) => { const d = arr.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" "); return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2.2" ${dash ? 'stroke-dasharray="4 3"' : ""}/>`; };
    let grid = "";
    [0, 25, 50, 75, 100].forEach((g) => { grid += `<line x1="${pl}" y1="${y(g)}" x2="${w - 14}" y2="${y(g)}" stroke="var(--c-line-2)"/><text x="${pl - 6}" y="${y(g) + 3}" text-anchor="end" font-size="9" fill="var(--c-ink-3)">${g}</text>`; });
    let xl = ""; labels.forEach((l, i) => { if (i % 3 === 0) xl += `<text x="${x(i)}" y="${h - 8}" text-anchor="middle" font-size="9" fill="var(--c-ink-3)">${l}</text>`; });
    const nowX = x(now);
    return `<svg viewBox="0 0 ${w} ${h}" width="100%">${grid}
      <line x1="${nowX}" y1="${pt}" x2="${nowX}" y2="${h - pb}" stroke="var(--cy-2)" stroke-dasharray="2 3" opacity=".6"/>
      ${path(planned, "#57b0e0", true)}${path(earned, "#17b6c7", false)}${path(actual, p.margin < p.marginBid ? "#d03b3b" : "#0ca30c", false)}${xl}</svg>
      <div style="display:flex;gap:16px;font-size:11px;color:var(--c-ink-3);margin-top:6px">
        <span><i style="color:#57b0e0">▬</i> Planned value</span><span><i style="color:#17b6c7">▬</i> Earned value</span><span><i style="color:${p.margin < p.marginBid ? "#d03b3b" : "#0ca30c"}">▬</i> Actual cost</span></div>`;
  }

  // productivity/composition heatmap (projects × trades)
  function heatmap() {
    const trades = ["HVAC", "Plumbing", "Fire Protection", "Refrigeration", "Service"];
    const rows = D.PROJECTS.slice(0, 8);
    const shade = (v) => { const t = Math.min(1, v / 60); return `rgba(23,182,199,${(0.12 + t * 0.8).toFixed(2)})`; };
    let head = `<div class="heat__row"><div></div>${trades.map((t) => `<div class="heat__head">${t.split(" ")[0]}</div>`).join("")}</div>`;
    let body = rows.map((p) => `<div class="heat__row"><div class="heat__lbl">${esc(p.short)}</div>${trades.map((t) => { const v = p.mix[t] || 0; return `<div class="heat__cell cell" style="background:${shade(v)}" data-tip="<b>${esc(p.short)}</b> · ${esc(t)} · ${v}% of scope">${v ? v : ""}</div>`; }).join("")}</div>`).join("");
    return `<div class="heat">${head}${body}</div>`;
  }

  function sparkline(data, color = "#35d0e0") {
    const w = 74, h = 26, mn = Math.min(...data), mx = Math.max(...data);
    const x = (i) => (i / (data.length - 1)) * w, y = (v) => h - ((v - mn) / (mx - mn || 1)) * (h - 4) - 2;
    return `<svg class="kpi__spark" viewBox="0 0 ${w} ${h}"><path d="${data.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ")}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  // opportunity quadrant (attractiveness × fit, bubble = $M)
  function bubbleQuadrant(items, dark) {
    const w = 520, h = 340, pl = 46, pb = 42, pt = 18, pr = 20;
    const ax = dark ? "var(--c-ink-3)" : "var(--ink-3)", lab = dark ? "#eaf2fb" : "#0c1622", grid = dark ? "var(--c-line)" : "var(--line-2)";
    const x = (v) => pl + (v / 100) * (w - pl - pr), y = (v) => pt + (1 - v / 100) * (h - pt - pb);
    const maxS = Math.max(...items.map((d) => d.size)), r = (s) => 12 + Math.sqrt(s / maxS) * 28;
    let g = `<rect x="${x(50)}" y="${pt}" width="${w - pr - x(50)}" height="${y(50) - pt}" fill="rgba(23,182,199,.06)"/>`;
    g += `<line x1="${x(50)}" y1="${pt}" x2="${x(50)}" y2="${h - pb}" stroke="${grid}" stroke-dasharray="3 3"/><line x1="${pl}" y1="${y(50)}" x2="${w - pr}" y2="${y(50)}" stroke="${grid}" stroke-dasharray="3 3"/>`;
    g += `<text x="${x(74)}" y="${y(94)}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--cy)">◇ SWEET SPOT</text>`;
    g += `<text x="${(pl + w - pr) / 2}" y="${h - 6}" text-anchor="middle" font-size="10.5" fill="${ax}">TG capability / fit →</text>`;
    g += `<text x="13" y="${(pt + h - pb) / 2}" text-anchor="middle" font-size="10.5" fill="${ax}" transform="rotate(-90 13 ${(pt + h - pb) / 2})">Market attractiveness →</text>`;
    items.forEach((d) => {
      const cx = x(d.fit), cy = y(d.attract), rr = r(d.size);
      g += `<circle class="dot" cx="${cx}" cy="${cy}" r="${rr}" fill="rgba(23,182,199,.2)" stroke="var(--cy)" stroke-width="1.5" data-tip="<b>${esc(d.name)}</b> · $${fmt(d.size, 0)}M · ${d.growth}"/><text x="${cx}" y="${cy + 3}" text-anchor="middle" font-size="10" font-weight="700" fill="${lab}">$${fmt(d.size, 0)}M</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%">${g}</svg>`;
  }

  function pipelineTable(dark) {
    const tbl = dark ? "c-table" : "pipe", sub = dark ? "var(--c-ink-3)" : "var(--ink-3)";
    const tc = (a) => a === "Pursue" ? "pursue" : a === "Strategic" ? "strategic" : "watch";
    const rows = D.PIPELINE.map((p) => `<tr><td class="name">${esc(p.name)}<br><small style="color:${sub}">${p.sector}</small></td>
      <td class="tabnum">$${fmt(p.value, 0)}M</td>
      <td><span class="winbar" style="background:${dark ? "var(--c-surface-3)" : "var(--paper-3)"}"><i style="width:${p.win}%"></i></span><span class="tabnum">${p.win}%</span></td>
      <td class="tabnum">${fmt(p.margin, 1)}%</td><td><span class="tag ${tc(p.action)}">${p.action}</span></td></tr>`).join("");
    return `<table class="${tbl}"><thead><tr><th>Pursuit</th><th>Value</th><th>AI win prob.</th><th>Margin</th><th>Call</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  const statusClass = (s) => ({ "On Track": "ok", "Watch": "warn", "At Risk": "serious", "Critical": "crit" }[s] || "ok");
  const sevIco = { critical: "▲", serious: "◆", warning: "●", good: "✓" };

  /* ---- tooltip ---- */
  const tip = $("#chartTip");
  document.addEventListener("mousemove", (e) => {
    const t = e.target.closest ? e.target.closest("[data-tip]") : null;
    if (!t) { tip.hidden = true; return; }
    tip.innerHTML = t.getAttribute("data-tip"); tip.hidden = false;
    tip.style.left = Math.min(e.clientX + 14, window.innerWidth - tip.offsetWidth - 12) + "px";
    tip.style.top = e.clientY - 12 + "px";
  });

  function countUp(node, target, unit, dec) {
    const start = performance.now(), dur = 900;
    (function step(t) { const k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      node.innerHTML = fmt(target * e, dec) + (unit ? `<span class="u">${unit}</span>` : ""); if (k < 1) requestAnimationFrame(step); })(start);
  }

  /* ===================================================== MARKETING SITE */
  function renderSite() {
    const c = D.CANDIDATE;
    $("#heroStats").innerHTML = [
      { v: "$412.6M", l: "Signed backlog, live" }, { v: "18.7%", l: "Projected gross margin" },
      { v: "10", l: "Source systems modeled" }, { v: "$3.2M", l: "Modeled year-1 ROI" },
    ].map((s) => `<div class="hstat"><div class="hstat__v">${s.v}</div><div class="hstat__l">${s.l}</div></div>`).join("");

    $("#marketHead").textContent = D.MARKET.headline;
    $("#marketStats").innerHTML = D.MARKET.stats.map((s) => `<div class="mstat"><div class="mstat__v">${s.v}<span class="u">${s.u}</span></div><div class="mstat__l">${s.l}</div></div>`).join("");
    $("#marketLogos").innerHTML = D.MARKET.clients.map((n) => `<span>${n}</span>`).join("");

    $("#valueCards").innerHTML = [
      { i: "◱", t: "One source of truth", p: "A governed semantic layer defines WIP, job cost, and margin once — BI, executives, and AI all read the same trusted number." },
      { i: "✦", t: "AI that pays for itself", p: "A copilot over specs and project data, AI-assisted estimating, and margin-risk alerts — each tied to hours saved or margin protected." },
      { i: "◈", t: "Governed & secure", p: "Row-level security, lineage, and data-quality built in from day one — PMs see their projects, finance sees all, AI stays grounded." },
    ].map((v) => `<div class="vcard"><div class="vcard__icon">${v.i}</div><h3>${v.t}</h3><p>${v.p}</p></div>`).join("");

    renderBlueprint();
    renderROI();
    renderGrowth();

    $("#pilotsGrid").innerHTML = D.AI_PILOTS.map((p) => `<div class="pilot"><div class="pilot__top"><h3>${p.name}</h3><span class="pilot__phase">${p.phase}</span></div><p>${p.desc}</p><div class="pilot__metric">${p.metric}</div></div>`).join("");
    $("#roadmapGrid").innerHTML = D.ROADMAP.map((r) => `<div class="rm"><div class="rm__phase">${r.phase}</div><h3>${r.title}</h3><ul>${r.items.map((i) => `<li>${i}</li>`).join("")}</ul><div class="rm__milestone">Milestone · <span>${r.milestone}</span></div></div>`).join("");

    $("#candName").textContent = c.name;
    $("#candTag").textContent = c.tagline;
    $("#candDiff").innerHTML = [
      "Real construction operations roots — estimating, job costing, scheduling, field",
      "Shipped production data platforms & AI/RAG products end-to-end",
      "Governance-, privacy-, and security-first by default",
      "Executive translator: turns data strategy into stories leadership funds",
      "Local to Massachusetts — present, available, invested",
    ].map((d) => `<li>${d}</li>`).join("");
    const chips = [`<span class="chip">✉ <a href="mailto:${c.email}">${c.email}</a></span>`];
    if (c.phone) chips.push(`<span class="chip">☎ ${c.phone}</span>`);
    if (c.location) chips.push(`<span class="chip">◎ ${c.location}</span>`);
    if (c.linkedin) chips.push(`<span class="chip">in ${c.linkedin}</span>`);
    $("#candContact").innerHTML = chips.join("");
    $("#footContact").textContent = `${c.name} · ${c.email}`;
  }

  const BP = {
    src:{t:"Source systems",d:"Vista (ERP / job cost), Procore, Trimble Construction One, estimating, scheduling, HRIS/payroll, Egnyte, SharePoint/M365, Salesforce, and BIM/fabrication — each authoritative, none connected today. We land them all."},
    ing:{t:"Ingestion layer",d:"REST & GraphQL APIs, change-data-capture, webhooks, and event-driven flows orchestrated with dbt + Airflow. Near-real-time where it matters (Procore ~90s), batch where it doesn't."},
    bronze:{t:"Bronze — raw landings",d:"Immutable, append-only copies of every source exactly as received. The auditable system of record and the replay point for everything downstream."},
    silver:{t:"Silver — conformed & clean",d:"Deduplicated, standardized, quality-checked. Conformed dimensions (project, cost code, phase, vendor, employee) and full bronze→gold lineage. Where trust is manufactured."},
    gold:{t:"Gold — semantic layer",d:"Business-ready dimensional models plus the semantic layer: WIP, cost-to-complete, projected margin, change-order value, and labor productivity defined once and consumed everywhere."},
    bi:{t:"BI & self-service",d:"Power BI / Tableau executive dashboards and governed self-service analytics — every metric traceable to its definition. No more spreadsheet reconciliation."},
    ai:{t:"AI & copilots",d:"RAG over specs and documents, AI-assisted estimating, and margin-risk alerts — all reading the same governed gold layer, grounded and secured with row-level access."},
    gov:{t:"Governance (everywhere)",d:"Metadata, lineage, data-quality, master data management, and row-level security wrap the entire stack. For AI: grounding to governed sources and an external-LLM egress guardrail."},
  };
  function renderBlueprint() {
    $("#blueprint-diagram").innerHTML = `
      <div class="bp-col"><div class="bp-col__label">Sources</div>
        <div class="bp-node" data-bp="src"><b>10 systems</b><small>ERP · PM · estimating · BIM · HR</small></div>
        <div class="bp-node" data-bp="ing"><b>Ingestion</b><small>API · CDC · webhooks · events</small></div></div>
      <div class="bp-col bp-medallion">
        <div class="bp-tier bronze" data-bp="bronze"><b>Bronze</b><small>Raw, immutable landings</small></div>
        <div class="bp-tier silver" data-bp="silver"><b>Silver</b><small>Conformed · clean · lineage · DQ</small></div>
        <div class="bp-tier gold" data-bp="gold"><b>Gold + Semantic Layer</b><small>WIP · margin · productivity — defined once</small></div>
        <div class="bp-govern" data-bp="gov">◈ Governance · lineage · MDM · row-level security</div></div>
      <div class="bp-col"><div class="bp-col__label">Consumption</div>
        <div class="bp-node" data-bp="bi"><b>BI &amp; self-service</b><small>Power BI · Tableau · exec dashboards</small></div>
        <div class="bp-node" data-bp="ai"><b>AI &amp; copilots</b><small>RAG · estimating · alerts</small></div></div>`;
    setBP("gold");
    $$("#blueprint-diagram [data-bp]").forEach((n) => n.addEventListener("click", () => setBP(n.getAttribute("data-bp"))));
  }
  function setBP(k) {
    $("#blueprintDetail").innerHTML = `<h4>${BP[k].t}</h4><p>${BP[k].d}</p>`;
    $$("#blueprint-diagram [data-bp]").forEach((n) => n.classList.toggle("is-active", n.getAttribute("data-bp") === k));
  }

  /* ---- ROI calculator ---- */
  const ROI = { rev: 215, pms: 40, margin: 18 };
  function renderROI() {
    $("#roi-calc").innerHTML = `
      <div class="roi__panel">
        <h3>Your assumptions</h3>
        <div class="roi__field"><label>Annual revenue <b id="rl-rev">$215M</b></label><input type="range" id="r-rev" min="150" max="400" step="5" value="215"></div>
        <div class="roi__field"><label>PMs &amp; estimators <b id="rl-pms">40</b></label><input type="range" id="r-pms" min="10" max="80" step="1" value="40"></div>
        <div class="roi__field"><label>Avg project margin <b id="rl-margin">18%</b></label><input type="range" id="r-margin" min="12" max="24" step="1" value="18"></div>
        <div class="roi__note">Drivers: ~0.5 pt of margin protected via earlier risk detection, ~0.5% of revenue in change-order leakage recovered, and ~7 hrs/week returned per PM at a $75/hr loaded rate. Platform run-cost modeled at $0.45M/yr. Deliberately conservative.</div>
      </div>
      <div class="roi__out">
        <div class="roi__big">Modeled year-1 impact</div>
        <div class="roi__hero" id="roi-total">$3.2M</div>
        <div class="roi__sub" id="roi-mult">≈ 7× return on platform investment</div>
        <div class="roi__lines" id="roi-lines"></div>
      </div>`;
    ["rev", "pms", "margin"].forEach((k) => $("#r-" + k).addEventListener("input", (e) => { ROI[k] = +e.target.value; computeROI(); }));
    computeROI();
  }
  function computeROI() {
    $("#rl-rev").textContent = "$" + ROI.rev + "M"; $("#rl-pms").textContent = ROI.pms; $("#rl-margin").textContent = ROI.margin + "%";
    const marginProt = ROI.rev * 0.005;                       // 0.5 pt protected
    const coRecovery = ROI.rev * 0.005;                       // 0.5% of revenue (conservative)
    const timeSaved = (ROI.pms * 7 * 48 * 75) / 1e6;          // hrs saved → $M
    const cost = 0.45;
    const total = marginProt + coRecovery + timeSaved;
    const mult = total / cost;
    $("#roi-total").textContent = "$" + fmt(total, 1) + "M";
    $("#roi-mult").textContent = `≈ ${mult.toFixed(1)}× return · net ${money(total - cost)} after run-cost`;
    $("#roi-lines").innerHTML = [
      ["Margin protected (earlier risk detection)", marginProt],
      ["Change-order leakage recovered", coRecovery],
      ["PM / estimator time returned", timeSaved],
      ["Platform run-cost", -cost],
    ].map(([l, v]) => `<div class="roi__line"><span>${l}</span><b style="color:${v < 0 ? "#f6a7a7" : "#fff"}">${v < 0 ? "−" : "+"}${money(Math.abs(v))}</b></div>`).join("");
  }

  /* ---- growth (marketing) ---- */
  function renderGrowth() {
    const t = D.MARKET_TAM, maxV = t.lines[0].value;
    $("#growthTam").innerHTML = t.lines.map((l) => `<div class="tam-row"><div class="tam-meta"><span>${esc(l.label)}</span><b>$${fmt(l.value, l.value < 1 ? 2 : 1)}B</b></div><div class="tam-bar ${l.kind}" style="width:${Math.max(7, (l.value / maxV) * 100)}%">${l.kind === "now" ? "TG · " + t.sharePct + "% share" : ""}</div></div>`).join("");
    $("#growthQuadrant").innerHTML = bubbleQuadrant(D.GROWTH, false) +
      `<div style="margin-top:12px;display:grid;gap:6px">${D.GROWTH.slice(0, 4).map((d) => `<div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-2)"><span>${esc(d.name)}</span><b style="color:var(--cy-deep)">$${fmt(d.size, 0)}M · ${d.growth}</b></div>`).join("")}</div>`;
    $("#growthPipeline").innerHTML = pipelineTable(false);
  }

  /* ===================================================== CONSOLE PANELS */
  let projFilter = "all", projSort = { key: "value", dir: -1 };

  function renderExec() {
    const kpis = D.KPIS.map((k) => {
      const up = k.delta >= 0, arrow = up ? "▲" : "▼", dec = (k.unit === "%" || k.unit === "×") ? (k.value < 2 ? 2 : 1) : 1;
      return `<div class="kpi" data-kpi="${k.key}"><div class="kpi__label">${k.label}</div>
        <div class="kpi__val" data-count="${k.value}" data-unit="${k.unit}" data-dec="${dec}"></div>
        <div class="kpi__delta ${up ? "up" : "down"}">${arrow} ${fmt(Math.abs(k.delta), 1)}% vs prior</div>
        ${sparkline(k.spark, up ? "#0ca30c" : "#35d0e0")}</div>`;
    }).join("");
    const risk = D.PROJECTS.filter((p) => p.status === "At Risk" || p.status === "Critical").sort((a, b) => (a.margin - a.marginBid) - (b.margin - b.marginBid));
    const insights = D.INSIGHTS.slice(0, 3).map((n) => `<div class="insight ${n.sev}"><div class="insight__ico">${sevIco[n.sev]}</div><div class="insight__body"><b>${esc(n.title)}</b><p>${esc(n.body)}</p><span class="insight__cite">◆ ${esc(n.cite)}</span></div></div>`).join("");

    $("#panel-exec").innerHTML = `
      <div class="c-grid kpi-row">${kpis}</div>
      <div class="c-grid two-col" style="margin-top:16px">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Cash &amp; margin trend</span><span class="c-card__sub">12 months</span></div>
          ${lineArea(D.MONTHS, [{ values: D.TRENDS.cash, color: "#17b6c7", area: true, name: "Cash $M" }], { unit: "M" })}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Projected gross margin</span><span class="c-card__sub">12 months · %</span></div>
          ${lineArea(D.MONTHS, [{ values: D.TRENDS.margin, color: "#3987e5", area: false, name: "Margin" }], { unit: "%" })}</div>
      </div>
      <div class="c-grid wide-narrow" style="margin-top:16px">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Signed backlog by sector</span><span class="c-card__sub">$412.6M</span></div>
          ${hBars(D.BACKLOG_SECTOR.map((s) => ({ label: s.sector, value: s.value, color: "#3987e5" })), { unit: "M" })}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Live activity</span><span class="c-card__sub">event stream</span></div>
          <div class="feed" id="feed">${feedRows()}</div></div>
      </div>
      <div class="c-card" style="margin-top:16px"><div class="c-card__head"><span class="c-card__title">✦ Top AI insights</span><span class="c-card__sub">auto-surfaced · ${D.INSIGHTS.length} total</span></div>${insights}</div>`;
    $$("#panel-exec [data-count]").forEach((n) => countUp(n, +n.dataset.count, n.dataset.unit, +n.dataset.dec));
  }
  const feedRows = () => D.ACTIVITY.map((a) => `<div class="feed__row"><span class="feed__t">${a.t}</span><span class="feed__src">${a.src}</span><span class="feed__msg">${esc(a.msg)}</span></div>`).join("");

  function renderInsights() {
    $("#panel-insights").innerHTML = `
      <p class="panel-lede">The platform's AI continuously scans governed data and surfaces what needs attention — each finding grounded in a source system, ranked by severity. This is margin-risk alerting (AI use-case #3), running live.</p>
      ${D.INSIGHTS.map((n) => `<div class="insight ${n.sev}"><div class="insight__ico">${sevIco[n.sev]}</div><div class="insight__body"><b>${esc(n.title)}</b><p>${esc(n.body)}</p><span class="insight__cite">◆ ${esc(n.cite)}</span></div></div>`).join("")}
      <div class="callout">Ask the copilot to explain any of these — every alert traces to Vista job cost, Procore schedule, or the semantic layer. No black boxes.</div>`;
  }

  function renderProjects() {
    let rows = D.PROJECTS.slice();
    if (projFilter !== "all") rows = rows.filter((p) => projFilter === "risk" ? (p.status === "At Risk" || p.status === "Critical") : statusClass(p.status) === projFilter);
    rows.sort((a, b) => { const k = projSort.key, av = a[k], bv = b[k]; return typeof av === "string" ? projSort.dir * av.localeCompare(bv) : projSort.dir * (av - bv); });
    const body = rows.map((p) => { const dl = p.margin - p.marginBid; return `<tr class="clickable" data-proj="${p.id}">
      <td class="name">${p.name}<br><small style="color:var(--c-ink-3)">${p.id} · ${p.sector} · PM ${p.pm}</small></td>
      <td class="tabnum">$${fmt(p.value)}M</td>
      <td><div class="mini-bar"><i style="width:${p.pctComplete}%; background:${D.TRADE_COLORS[p.lead]}"></i></div><small class="tabnum" style="color:var(--c-ink-3)">${p.pctComplete}%</small></td>
      <td class="tabnum">${fmt(p.margin)}%</td>
      <td class="tabnum" style="color:${dl >= 0 ? "var(--ok)" : "var(--crit)"};font-weight:700">${dl >= 0 ? "+" : ""}${fmt(dl)}</td>
      <td class="tabnum" style="color:${p.schedVar >= 0 ? "var(--ok)" : "var(--crit)"}">${p.schedVar > 0 ? "+" : ""}${p.schedVar}d</td>
      <td><span class="pill ${statusClass(p.status)}">${p.status}</span></td></tr>`; }).join("");
    const segs = [["all", "All"], ["risk", "At risk"], ["ok", "On track"], ["warn", "Watch"]];
    $("#panel-projects").innerHTML = `
      <p class="panel-lede">Live portfolio. <b style="color:var(--c-ink)">Click any project</b> to drill into its earned-value curve, trade mix, and change orders. Margin Δ (projected vs bid) is the earliest signal of a job drifting.</p>
      <div class="filters"><div class="seg">${segs.map(([k, l]) => `<button data-pf="${k}" class="${projFilter === k ? "is-active" : ""}">${l}</button>`).join("")}</div>
        <span class="c-card__sub" style="margin-left:auto">${rows.length} projects · $${fmt(rows.reduce((s, p) => s + p.value, 0), 0)}M contract value</span></div>
      <div class="c-card" style="padding:4px 4px 8px"><table class="c-table"><thead><tr>
        <th data-sort="name">Project</th><th data-sort="value">Contract</th><th data-sort="pctComplete">Complete</th>
        <th data-sort="margin">Margin</th><th data-sort="marginBid">Δ vs bid</th><th data-sort="schedVar">Schedule</th><th data-sort="status">Status</th>
      </tr></thead><tbody>${body}</tbody></table></div>`;
    $$("#panel-projects [data-pf]").forEach((b) => b.addEventListener("click", () => { projFilter = b.dataset.pf; renderProjects(); }));
    $$("#panel-projects th[data-sort]").forEach((th) => th.addEventListener("click", () => { const k = th.dataset.sort; projSort.dir = projSort.key === k ? -projSort.dir : -1; projSort.key = k; renderProjects(); }));
    $$("#panel-projects [data-proj]").forEach((tr) => tr.addEventListener("click", () => openProject(tr.dataset.proj)));
  }

  function openProject(id) {
    const p = D.PROJECTS.find((x) => x.id === id); if (!p) return;
    const dl = p.margin - p.marginBid;
    const aiSummary = p.status === "Critical" || p.status === "At Risk"
      ? `Copilot: <b>${p.short}</b> is trending below bid margin (${fmt(p.margin)}% vs ${fmt(p.marginBid)}%). The gap is driven by ${p.lead === "Refrigeration" ? "chilled-water plant cost-code overruns and" : ""} schedule slippage of ${Math.abs(p.schedVar)} days with ${p.cos.count} open change orders worth $${fmt(p.cos.value)}M. Recommend a change-order execution sprint and a productivity review on ${p.lead}.`
      : `Copilot: <b>${p.short}</b> is healthy — margin ${fmt(p.margin)}% is ${dl >= 0 ? "above" : "near"} the ${fmt(p.marginBid)}% bid, schedule ${p.schedVar >= 0 ? "ahead" : "near plan"}. ${p.cos.count} change orders ($${fmt(p.cos.value)}M) tracking normally. No action required.`;
    $("#modalBox").innerHTML = `
      <div class="modal__head"><div><h3>${esc(p.name)}</h3><small>${p.id} · ${p.sector} · PM ${p.pm} · lead trade ${p.lead}</small></div>
        <button class="modal__close" data-close-modal>✕</button></div>
      <div class="modal__body">
        <div class="modal__kpis">
          <div class="modal__kpi"><div class="l">Contract</div><div class="v">$${fmt(p.value)}M</div></div>
          <div class="modal__kpi"><div class="l">Complete</div><div class="v">${p.pctComplete}%</div></div>
          <div class="modal__kpi"><div class="l">Proj. margin</div><div class="v" style="color:${dl >= 0 ? "var(--ok)" : "var(--crit)"}">${fmt(p.margin)}%</div></div>
          <div class="modal__kpi"><div class="l">Schedule</div><div class="v" style="color:${p.schedVar >= 0 ? "var(--ok)" : "var(--crit)"}">${p.schedVar > 0 ? "+" : ""}${p.schedVar}d</div></div>
        </div>
        <div class="c-card" style="margin-bottom:14px"><div class="c-card__head"><span class="c-card__title">Earned-value curve</span><span class="c-card__sub">planned vs earned vs actual cost</span></div>${evmCurve(p)}</div>
        <div class="c-grid two-col">
          <div class="c-card"><div class="c-card__head"><span class="c-card__title">Trade mix</span><span class="c-card__sub">% of scope</span></div>
            ${hBars(Object.entries(p.mix).map(([t, v]) => ({ label: t, value: v, color: D.TRADE_COLORS[t] })), { unit: "%" })}</div>
          <div class="c-card"><div class="c-card__head"><span class="c-card__title">Change orders</span><span class="c-card__sub">${p.cos.count} open · $${fmt(p.cos.value)}M</span></div>
            <div style="font-size:13px;color:var(--c-ink-2);line-height:1.7">
              <div class="toggle-row"><span>Open change orders</span><b style="color:var(--c-ink)">${p.cos.count}</b></div>
              <div class="toggle-row"><span>Value in play</span><b style="color:var(--cy-2)">$${fmt(p.cos.value)}M</b></div>
              <div class="toggle-row"><span>Cost-to-complete</span><b style="color:var(--c-ink)">$${fmt(p.ctc)}M</b></div>
              <div class="toggle-row"><span>Status</span><span class="pill ${statusClass(p.status)}">${p.status}</span></div></div></div>
        </div>
        <div class="callout" style="margin-top:14px">✦ ${aiSummary}</div>
      </div>`;
    $("#modal").hidden = false;
    $$("#modal [data-close-modal]").forEach((n) => n.addEventListener("click", closeModal));
  }
  function closeModal() { $("#modal").hidden = true; }

  function renderJobcost() {
    const wip = D.PROJECTS.map((p) => ({ label: p.short, value: +(p.ctc * (1 - p.pctComplete / 100) * 0.6).toFixed(1), color: "#17b6c7" })).sort((a, b) => b.value - a.value).slice(0, 7);
    $("#panel-jobcost").innerHTML = `
      <p class="panel-lede">Job cost, WIP, and productivity — assembled in seconds instead of the days it takes to reconcile spreadsheets today.</p>
      <div class="c-grid two-col">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Cost-code variance vs estimate</span><span class="c-card__sub">favorable + / unfavorable −</span></div>${divBars(D.COST_VARIANCE)}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Labor productivity by trade</span><span class="c-card__sub">earned / burned</span></div>${hBars(D.LABOR.map((l) => ({ label: l.trade, value: l.ratio, color: D.TRADE_COLORS[l.trade] })), { unit: "×" })}</div>
      </div>
      <div class="c-card" style="margin-top:16px"><div class="c-card__head"><span class="c-card__title">Margin bridge · bid → projected</span><span class="c-card__sub">what's moving the number</span></div>${waterfall(D.MARGIN_BRIDGE)}</div>
      <div class="c-grid two-col" style="margin-top:16px">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Under-billed WIP by project</span><span class="c-card__sub">$M</span></div>${hBars(wip, { unit: "M" })}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Scope concentration by trade</span><span class="c-card__sub">% of each job</span></div>${heatmap()}</div>
      </div>
      <div class="callout"><b>Cost code 23 64 (Chilled Water Plant)</b> is the largest unfavorable variance at −4.7%, concentrated on Northeastern ISEC II — the same job flagged Critical. The field-to-office signal this platform surfaces automatically.</div>`;
  }

  function renderGrowthRadar() {
    const t = D.MARKET_TAM;
    $("#panel-growth").innerHTML = `
      <p class="panel-lede">Growth intelligence — the same governed data, pointed forward. Market sizing, an AI-scored pipeline, and a whitespace map that turns data into TG Gallagher's next $1B of addressable work.</p>
      <div class="c-grid" style="grid-template-columns:repeat(3,1fr)">
        <div class="kpi"><div class="kpi__label">New England market · TAM</div><div class="kpi__val">$${fmt(t.tam, 0)}<span class="u">B</span></div></div>
        <div class="kpi"><div class="kpi__label">Serviceable · SAM</div><div class="kpi__val">$${fmt(t.sam, 1)}<span class="u">B</span></div></div>
        <div class="kpi"><div class="kpi__label">TG share of serviceable</div><div class="kpi__val">${fmt(t.sharePct, 1)}<span class="u">%</span></div></div>
      </div>
      <div class="c-grid two-col" style="margin-top:16px">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Opportunity whitespace</span><span class="c-card__sub">attractiveness × fit · bubble = $M</span></div>${bubbleQuadrant(D.GROWTH, true)}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">AI-scored pipeline</span><span class="c-card__sub">win prob × margin</span></div>${pipelineTable(true)}</div>
      </div>
      <div class="callout"><b>Over $1.1B of adjacent whitespace</b> — data-center cooling (+18%/yr), decarbonization retrofits (+15%/yr), and recurring life-science service. The AI pipeline flags <b>Eli Lilly Devens</b> (68% win, 19% margin) as the top pursuit. This is how data stops being a scorekeeper and starts driving growth.</div>`;
  }

  function renderSources() {
    const live = D.CONNECTORS.filter((c) => c.status === "connected").length;
    $("#panel-sources").innerHTML = `
      <p class="panel-lede">Enterprise source-system inventory — the integration strategy across ERP, PM, estimating, HR, docs, CRM, and BIM. ${live} of ${D.CONNECTORS.length} systems flowing into the platform.</p>
      <div class="conn-grid">${D.CONNECTORS.map((c) => `<div class="conn"><span class="conn__dot ${c.status}"></span><div class="conn__body"><b>${c.name}</b><small>${c.kind} · ${c.mode}</small></div><div class="conn__meta"><b>${c.status === "connected" ? "● live" : c.status === "syncing" ? "◐ syncing" : "○ planned"}</b><br>${c.latency !== "—" ? "lag " + c.latency + " · " : ""}${c.records} rows</div></div>`).join("")}</div>
      <div class="callout">Every connector lands to <b>bronze</b> via its native pattern (CDC for Vista, webhooks for Procore, Graph API for M365). Adding a source is a repeatable, days-not-months exercise — the hard part, understanding the data, is already done.</div>`;
  }

  function renderGovernance() {
    $("#panel-governance").innerHTML = `
      <p class="panel-lede">Governance as an enabler, not a gate. Row-level security, lineage, data quality, and responsible-AI guardrails — the framework that lets leadership trust the numbers and adopt AI safely.</p>
      <div class="c-grid two-col">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Active policies</span><span class="c-card__sub">click to simulate</span></div>${D.GOVERNANCE.map((g, i) => `<div class="toggle-row"><span>${g.policy}</span><div class="tgl ${g.on ? "on" : ""}" data-gov="${i}"></div></div>`).join("")}</div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Responsible-AI posture</span></div>
          <div class="toggle-row"><span>Grounding — answers cite governed sources only</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Model monitoring &amp; audit log</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>External-LLM data-egress guardrail</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>PII / labor-rate column masking</span><div class="tgl on"></div></div>
          <div class="callout" style="margin-top:14px">Same discipline I built into a privacy-first RAG product from day one — grounding and access control are what make an AI copilot trustworthy enough to adopt.</div></div></div>`;
    $$("#panel-governance [data-gov]").forEach((t) => t.addEventListener("click", () => { t.classList.toggle("on"); toast(t.classList.contains("on") ? "Policy enabled" : "Policy disabled", D.GOVERNANCE[+t.dataset.gov].policy); }));
  }

  function renderSettings() {
    $("#panel-settings").innerHTML = `
      <p class="panel-lede">Admin control panel — platform, warehouse, AI, and team access. The levers that keep the platform tuned and cost-managed for the long run.</p>
      <div class="c-grid two-col">
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">Warehouse</span></div>
          <div class="toggle-row"><span>Platform</span><b style="color:var(--cy-2)">Snowflake · medallion</b></div>
          <div class="toggle-row"><span>Auto-suspend compute (cost control)</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Query result cache</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Monthly credit budget</span><b style="color:var(--c-ink)">$4,200 / mo</b></div></div>
        <div class="c-card"><div class="c-card__head"><span class="c-card__title">AI configuration</span></div>
          <div class="toggle-row"><span>Copilot model</span><b style="color:var(--cy-2)">Claude · enterprise</b></div>
          <div class="toggle-row"><span>RAG over specs &amp; documents</span><div class="tgl on"></div></div>
          <div class="toggle-row"><span>Vector index refresh</span><b style="color:var(--c-ink)">nightly</b></div>
          <div class="toggle-row"><span>Row-level security in AI responses</span><div class="tgl on"></div></div></div></div>
      <div class="c-card" style="margin-top:16px"><div class="c-card__head"><span class="c-card__title">Team &amp; roles</span><span class="c-card__sub">proposed org</span></div>
        <table class="c-table"><thead><tr><th>Role</th><th>Function</th><th>Access</th><th>Phase</th></tr></thead><tbody>
        ${[["Head of Data Architecture & AI","Strategy · architecture · exec advisory","Full","Now"],["Data Engineer","Pipelines · ingestion · dbt","Full","Phase 1"],["Analytics Engineer","Semantic layer · models","Governed","Phase 2"],["BI Developer","Dashboards · self-service","Governed","Phase 2"],["AI Engineer","RAG · copilots · agents","Governed","Phase 3"]].map((r) => `<tr><td class="name">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td><span class="pill ok">${r[3]}</span></td></tr>`).join("")}
        </tbody></table></div>`;
  }

  function renderCopilotPanel() {
    $("#panel-copilot").innerHTML = `
      <p class="panel-lede">Project Copilot — a retrieval-augmented assistant grounded to governed data. Ask about the portfolio in plain English; every answer cites its source. AI use-case #1, running live.</p>
      <div class="callout" style="margin-bottom:18px">The floating copilot (bottom-right) is open across the platform. Try <b>“what's at risk?”</b>, <b>“explain the architecture”</b>, or <b>“what's the ROI?”</b></div>
      <div class="c-grid two-col">${D.AI_PILOTS.map((p) => `<div class="c-card"><div class="c-card__head"><span class="c-card__title">${p.name}</span><span class="pill ${p.phase === "Live pilot" ? "ok" : "warn"}">${p.phase}</span></div><p style="color:var(--c-ink-2);font-size:13.5px;margin:0 0 10px">${p.desc}</p><div class="pilot__metric" style="color:var(--c-ink);border-top:1px solid var(--c-line);padding-top:10px">◆ ${p.metric}</div></div>`).join("")}</div>`;
  }

  const PANELS = { exec: renderExec, insights: renderInsights, projects: renderProjects, jobcost: renderJobcost, growth: renderGrowthRadar, copilot: renderCopilotPanel, sources: renderSources, governance: renderGovernance, settings: renderSettings };
  const TITLES = { exec: "Executive Overview", insights: "AI Insights", projects: "Projects", jobcost: "Job Cost & WIP", growth: "Growth Radar", copilot: "AI Copilot", sources: "Data Sources", governance: "Governance", settings: "Control Panel" };
  let currentPanel = "exec";
  function showPanel(key) {
    currentPanel = key; PANELS[key]();
    $$(".panel").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === key));
    $$("#consoleNav button").forEach((b) => b.classList.toggle("is-active", b.dataset.panel === key));
    $("#panelTitle").textContent = TITLES[key];
    $(".console__scroll").scrollTop = 0; $(".console__side").classList.remove("open");
  }

  /* ===================================================== BOOT + VIEW SWITCH */
  const BOOT_LINES = ["Authenticating · admin@tggallagher", "Connecting Snowflake medallion warehouse", "Vista · Procore · Trimble · 10 sources online", "Loading semantic layer · 40 governed metrics", "Row-level security · verified", "Vector store · 340K docs indexed", "Project Copilot · ready"];
  function boot(then) {
    const b = $("#boot"), bar = $("#bootBar"), log = $("#bootLog");
    b.hidden = false; bar.style.width = "0%"; log.innerHTML = "";
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) { log.innerHTML += `<div class="ok">▸ ${BOOT_LINES[i]} <b>✓</b></div>`; bar.style.width = Math.round(((i + 1) / BOOT_LINES.length) * 100) + "%"; i++; }
      else { clearInterval(iv); setTimeout(() => { b.hidden = true; then(); }, 300); }
    }, 190);
  }

  let liveTimer = null, clockTimer = null;
  function enterConsole(panel, skipBoot) {
    const go = () => {
      document.documentElement.setAttribute("data-view", "console");
      document.body.setAttribute("data-view", "console");
      $("#siteView").hidden = true; $("#consoleView").hidden = false; $("#copilotFab").hidden = false;
      showPanel(panel || "exec"); startLive();
      setTimeout(() => toast("Command Center online", "10 sources synced · 5 AI insights active"), 200);
    };
    if (skipBoot) go(); else boot(go);
  }
  function exitConsole() {
    document.documentElement.setAttribute("data-view", "site"); document.body.setAttribute("data-view", "site");
    $("#consoleView").hidden = true; $("#siteView").hidden = false; $("#copilotFab").hidden = true;
    stopLive(); closeCopilot();
  }

  function startLive() {
    stopLive();
    const clock = () => { const d = new Date(); $("#clock").textContent = d.toLocaleTimeString("en-US", { hour12: false }) + " EDT"; };
    clock(); clockTimer = setInterval(clock, 1000);
    let n = 4;
    liveTimer = setInterval(() => {
      if (currentPanel !== "exec") return;
      // flash a KPI + nudge value
      const kpis = $$("#panel-exec [data-kpi]"); if (!kpis.length) return;
      const el = kpis[Math.floor((Date.now() / 5000) % kpis.length)];
      el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
      // prepend an activity line
      const feed = $("#feed");
      if (feed) {
        const msgs = ["Procore webhook · daily log synced", "Vista · WIP recalculated", "Copilot · spec query answered · 1.6s", "Trimble · field hours ingested", "Egnyte · 4 submittals indexed"];
        const t = new Date(); const stamp = t.toLocaleTimeString("en-US", { hour12: false }).slice(0, 5);
        const row = document.createElement("div"); row.className = "feed__row"; row.style.animation = "slide .3s ease";
        row.innerHTML = `<span class="feed__t">${stamp}</span><span class="feed__src">Live</span><span class="feed__msg">${msgs[n % msgs.length]}</span>`;
        feed.prepend(row); while (feed.children.length > 8) feed.lastChild.remove(); n++;
      }
      const sync = $("#syncLabel"); if (sync) sync.textContent = "Live · synced just now";
    }, 5000);
  }
  function stopLive() { if (liveTimer) clearInterval(liveTimer); if (clockTimer) clearInterval(clockTimer); liveTimer = clockTimer = null; }

  /* ===================================================== TOASTS */
  function toast(title, sub) {
    const t = document.createElement("div"); t.className = "toast";
    t.innerHTML = `<b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}`;
    $("#toasts").appendChild(t);
    setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-16px)"; t.style.transition = ".3s"; }, 3200);
    setTimeout(() => t.remove(), 3600);
  }

  /* ===================================================== COMMAND PALETTE */
  const COMMANDS = [
    { ic: "▤", label: "Executive Overview", hint: "console", run: () => { ensureConsole(); showPanel("exec"); } },
    { ic: "✦", label: "AI Insights", hint: "console", run: () => { ensureConsole(); showPanel("insights"); } },
    { ic: "▦", label: "Projects", hint: "console", run: () => { ensureConsole(); showPanel("projects"); } },
    { ic: "▨", label: "Job Cost & WIP", hint: "console", run: () => { ensureConsole(); showPanel("jobcost"); } },
    { ic: "⇄", label: "Data Sources", hint: "console", run: () => { ensureConsole(); showPanel("sources"); } },
    { ic: "◈", label: "Governance", hint: "console", run: () => { ensureConsole(); showPanel("governance"); } },
    { ic: "⚙", label: "Control Panel", hint: "console", run: () => { ensureConsole(); showPanel("settings"); } },
    { ic: "✦", label: "Open AI Copilot", hint: "ai", run: () => openCopilot() },
    { ic: "⚑", label: "Flag at-risk projects", hint: "action", run: () => { ensureConsole(); projFilter = "risk"; showPanel("projects"); toast("3 projects flagged", "Northeastern ISEC II · Moderna Norwood · Takeda"); } },
    { ic: "▣", label: "Generate WIP report", hint: "action", run: () => { ensureConsole(); showPanel("jobcost"); toast("WIP report generated", "Under-billed WIP $9.42M · by project"); } },
    { ic: "$", label: "Show the ROI model", hint: "action", run: () => { if (document.body.getAttribute("data-view") === "console") exitConsole(); location.hash = "#roi"; $("#roi").scrollIntoView({ behavior: "smooth" }); } },
    { ic: "▶", label: "Play the Board Brief keynote", hint: "present", run: () => openPresent() },
    { ic: "◎", label: "Growth Radar · whitespace & pipeline", hint: "console", run: () => { ensureConsole(); showPanel("growth"); } },
    { ic: "❋", label: "Ask copilot: what's at risk?", hint: "ai", run: () => { openCopilot(); setTimeout(() => sendCopilot("what's at risk?"), 250); } },
    { ic: "◱", label: "Enter Command Center", hint: "view", run: () => enterConsole("exec", true) },
    { ic: "←", label: "Back to candidate briefing", hint: "view", run: () => exitConsole() },
    { ic: "⤓", label: "Print executive brief", hint: "action", run: () => window.print() },
  ];
  let palSel = 0, palItems = COMMANDS;
  function ensureConsole() { if (document.body.getAttribute("data-view") !== "console") enterConsole(null, true); }
  function openPalette() { $("#palette").hidden = false; $("#paletteInput").value = ""; palItems = COMMANDS; palSel = 0; renderPalette(); setTimeout(() => $("#paletteInput").focus(), 30); }
  function closePalette() { $("#palette").hidden = true; }
  function renderPalette() {
    $("#paletteList").innerHTML = palItems.map((c, i) => `<li class="${i === palSel ? "sel" : ""}" data-i="${i}"><span class="ic">${c.ic}</span>${c.label}<small>${c.hint}</small></li>`).join("") || `<li style="color:var(--c-ink-3)">No matching command</li>`;
    $$("#paletteList li[data-i]").forEach((li) => li.addEventListener("click", () => runPal(+li.dataset.i)));
  }
  function runPal(i) { const c = palItems[i]; if (!c) return; closePalette(); c.run(); }
  $("#paletteInput") && $("#paletteInput").addEventListener("input", (e) => { const q = e.target.value.toLowerCase().trim(); palItems = COMMANDS.filter((c) => (c.label + " " + c.hint).toLowerCase().includes(q)); palSel = 0; renderPalette(); });

  /* ===================================================== AI COPILOT */
  const stream = () => $("#copilotStream");
  let seeded = false;
  function openCopilot() {
    $("#copilotDock").hidden = false; $("#copilotFab").hidden = true;
    if (!seeded) { seeded = true; botSay("Hi — I'm the Project Copilot, grounded to TG Gallagher's governed data: job cost, WIP, margin, schedule, ROI, and the architecture. What would you like to know?", ""); chips(["What's at risk?", "How's margin?", "What's the ROI?", "Explain the architecture"]); }
    setTimeout(() => $("#copilotText").focus(), 60);
  }
  function closeCopilot() { $("#copilotDock").hidden = true; if (document.body.getAttribute("data-view") === "console") $("#copilotFab").hidden = false; }
  function chips(list) { $("#copilotChips").innerHTML = list.map((c) => `<button>${esc(c)}</button>`).join(""); $$("#copilotChips button").forEach((b) => b.addEventListener("click", () => sendCopilot(b.textContent))); }
  function userSay(t) { const m = document.createElement("div"); m.className = "msg user"; m.textContent = t; stream().appendChild(m); stream().scrollTop = stream().scrollHeight; }
  function botSay(t, cite) { const m = document.createElement("div"); m.className = "msg bot"; m.innerHTML = esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") + (cite ? `<span class="msg__cite">◆ source · ${esc(cite)}</span>` : ""); stream().appendChild(m); stream().scrollTop = stream().scrollHeight; }
  function typing() { const m = document.createElement("div"); m.className = "msg bot typing"; m.innerHTML = "<i></i><i></i><i></i>"; stream().appendChild(m); stream().scrollTop = stream().scrollHeight; return m; }
  function answerFor(text) { const q = text.toLowerCase(); for (const kb of D.COPILOT_KB) if (kb.q.some((k) => q.includes(k.trim()))) return kb; return { a: "I can answer questions grounded in TG Gallagher's data: try at-risk projects, margin, WIP, backlog, change orders, productivity, the architecture, estimating, governance, ROI, or the roadmap.", cite: "" }; }
  async function askAPI(text) {
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 12000);
    try { const r = await fetch("/api/copilot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text }), signal: ctrl.signal }); clearTimeout(timer); if (!r.ok) return null; const j = await r.json(); return j && j.answer ? { a: j.answer, cite: j.cite || "Claude · live" } : null; } catch (_) { clearTimeout(timer); return null; }
  }
  async function sendCopilot(text) {
    if (!text || !text.trim()) return;
    userSay(text); $("#copilotChips").innerHTML = "";
    const ty = typing(); const min = new Promise((r) => setTimeout(r, 600));
    const live = await askAPI(text); await min; ty.remove();
    const ans = live || answerFor(text); botSay(ans.a, ans.cite);
    chips(["What's at risk?", "What's the ROI?", "Explain the architecture", "The roadmap"]);
  }

  /* ===================================================== BOARD BRIEF */
  const PRES = D.PRESENTATION;
  let presIdx = 0, presTimer = null, presPlaying = true;
  function openPresent() {
    $("#present").hidden = false; presIdx = 0; presPlaying = true; $("#presPlay").textContent = "⏸";
    $("#presDots").innerHTML = PRES.map((_, i) => `<span data-ps="${i}"></span>`).join("");
    $$("#presDots [data-ps]").forEach((d) => d.addEventListener("click", () => gotoPres(+d.dataset.ps)));
    renderPres(); startPresTimer();
  }
  function closePresent() { $("#present").hidden = true; stopPresTimer(); }
  function renderPres() {
    const s = PRES[presIdx], acc = s.accent === "amber" ? "amber" : s.accent === "green" ? "green" : "";
    $("#presentStage").innerHTML = `<div class="pslide">
      <div class="pslide__eyebrow">${esc(s.eyebrow)}</div>
      <div class="pslide__title">${esc(s.title)}</div>
      ${s.metric ? `<div class="pslide__metric ${acc}">${esc(s.metric)}</div><div class="pslide__mlabel">${esc(s.metricLabel)}</div>` : ""}
      <div class="pslide__body">${esc(s.body)}</div>
      ${s.cta ? `<div class="pslide__cta"><button class="btn btn--primary btn--lg" id="presEnter">Enter the live Command Center →</button><button class="btn btn--outline btn--lg" id="presDone">Replay ↻</button></div>` : ""}
    </div>`;
    $$("#presDots span").forEach((d, i) => d.classList.toggle("on", i === presIdx));
    $("#presBar").style.width = ((presIdx + 1) / PRES.length * 100) + "%";
    const pe = $("#presEnter"); if (pe) pe.addEventListener("click", () => { closePresent(); enterConsole("exec"); });
    const pd = $("#presDone"); if (pd) pd.addEventListener("click", () => gotoPres(0));
  }
  function gotoPres(i) { presIdx = (i + PRES.length) % PRES.length; renderPres(); if (presPlaying) startPresTimer(); }
  function startPresTimer() { stopPresTimer(); if (!presPlaying) return; presTimer = setInterval(() => { if (presIdx >= PRES.length - 1) { stopPresTimer(); presPlaying = false; $("#presPlay").textContent = "↻"; } else gotoPres(presIdx + 1); }, 6200); }
  function stopPresTimer() { if (presTimer) clearInterval(presTimer); presTimer = null; }
  function togglePres() {
    if (presIdx >= PRES.length - 1 && !presPlaying) { presPlaying = true; $("#presPlay").textContent = "⏸"; gotoPres(0); return; }
    presPlaying = !presPlaying; $("#presPlay").textContent = presPlaying ? "⏸" : "▶"; if (presPlaying) startPresTimer(); else stopPresTimer();
  }

  /* ===================================================== WIRE-UP */
  function bind() {
    $("#enterConsole").addEventListener("click", () => enterConsole("exec"));
    $("#heroEnter").addEventListener("click", () => enterConsole("exec"));
    $("#footEnter").addEventListener("click", () => enterConsole("exec"));
    $("#sideExit").addEventListener("click", exitConsole);
    $("#heroCopilot").addEventListener("click", openCopilot);
    $("#copilotFab").addEventListener("click", openCopilot);
    $("#copilotClose").addEventListener("click", closeCopilot);
    $("#printBrief").addEventListener("click", () => window.print());
    $("#presentBtn").addEventListener("click", openPresent);
    $("#presPrev").addEventListener("click", () => gotoPres(presIdx - 1));
    $("#presNext").addEventListener("click", () => gotoPres(presIdx + 1));
    $("#presPlay").addEventListener("click", togglePres);
    $("#presExit").addEventListener("click", closePresent);
    $$("#consoleNav button").forEach((b) => b.addEventListener("click", () => showPanel(b.dataset.panel)));
    $("#genReport").addEventListener("click", () => toast("Report generated", "Executive pack · WIP, margin, backlog, insights"));
    $("#consolePalette").addEventListener("click", openPalette);
    $("#openPalette").addEventListener("click", openPalette);
    $$("[data-close-palette]").forEach((n) => n.addEventListener("click", closePalette));
    $$("[data-close-modal]").forEach((n) => n.addEventListener("click", closeModal));
    $("#modal") && $("#modal").addEventListener("click", (e) => { if (e.target.classList.contains("modal__scrim")) closeModal(); });
    $("#copilotForm").addEventListener("submit", (e) => { e.preventDefault(); const v = $("#copilotText").value; $("#copilotText").value = ""; sendCopilot(v); });

    const secs = $$("#siteView section[id]");
    window.addEventListener("scroll", () => { let cur = ""; secs.forEach((s) => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; }); $$("#siteLinks a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + cur)); });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#palette").hidden ? openPalette() : closePalette(); return; }
      if (!$("#present").hidden) {
        if (e.key === "Escape") closePresent();
        else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); gotoPres(presIdx + 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); gotoPres(presIdx - 1); }
        return;
      }
      if (!$("#palette").hidden) {
        if (e.key === "Escape") closePalette();
        else if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palItems.length - 1, palSel + 1); renderPalette(); }
        else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(0, palSel - 1); renderPalette(); }
        else if (e.key === "Enter") { e.preventDefault(); runPal(palSel); }
      } else if (e.key === "Escape") { if (!$("#modal").hidden) closeModal(); else if (!$("#copilotDock").hidden) closeCopilot(); }
    });

    // scroll reveal
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
      $$("[data-reveal]").forEach((el) => io.observe(el));
    } else $$("[data-reveal]").forEach((el) => el.classList.add("in"));
  }

  /* ---- go ---- */
  renderSite();
  bind();
  requestAnimationFrame(() => $$(".hero [data-reveal]").forEach((el, i) => setTimeout(() => el.classList.add("in"), 80 * i)));
  if (/present|brief|keynote/i.test(location.hash)) openPresent();
  else if (/console|command/i.test(location.hash)) enterConsole("exec", true);
})();
