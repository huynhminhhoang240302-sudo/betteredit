export const WIDTH = 960;
export const HEIGHT = 540;

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * clamp(t);
const smooth = (a, b, x) => { const t = clamp((x - a) / Math.max(0.0001, b - a)); return t * t * (3 - 2 * t); };
const ease = t => 1 - Math.pow(1 - clamp(t), 3);
const escapeXml = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));
const TITLE_STOP_WORDS = new Set(["the", "a", "an", "to", "or", "and", "into", "through", "from", "with", "in", "one"]);
const titleWords = value => String(value ?? "").trim().split(/\s+/).filter(word => word && !TITLE_STOP_WORDS.has(word.toLowerCase()));
const variantOf = spec => Number(spec.id.slice(-2));
const reveal = (p, at = 0.18, span = 0.2) => smooth(at, at + span, p);
const disappear = (p, at = 0.76, span = 0.15) => 1 - smooth(at, at + span, p);
const shortTitle = spec => {
  const words = titleWords(spec.name);
  return escapeXml(words.slice(0, 4).join(" ").toUpperCase());
};

const palette = {
  bg: "#11110f", bg2: "#1a1814", paper: "#e7dfd1", ink: "#221f1a", fg: "#f1eadf",
  muted: "#afa28f", accent: "#d98750", amber: "#d3a460", blue: "#7896a6", green: "#809d78", red: "#ad665d", shadow: "#080807",
};

function defs() {
  return `<defs>
    <radialGradient id="glow" cx="50%" cy="46%" r="58%"><stop offset="0" stop-color="${palette.accent}" stop-opacity=".28"/><stop offset="1" stop-color="${palette.bg}" stop-opacity="0"/></radialGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4c52"/><stop offset="1" stop-color="#171a18"/></linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe6d8"/><stop offset="1" stop-color="#cbbdaa"/></linearGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="13" stdDeviation="12" flood-color="#000" flood-opacity=".42"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="smallblur"><feGaussianBlur stdDeviation="3"/></filter>
    <clipPath id="screen"><rect x="0" y="0" width="960" height="540"/></clipPath>
    <clipPath id="portal"><rect x="340" y="55" width="280" height="430" rx="8"/></clipPath>
  </defs>`;
}

function base(extra = "") {
  return `<rect width="960" height="540" fill="${palette.bg}"/><ellipse cx="520" cy="260" rx="420" ry="300" fill="url(#glow)" opacity=".65"/>${extra}`;
}

const radians = degrees => degrees * Math.PI / 180;
const round = value => Number(value.toFixed(3));

function rotatePoint3d(point, yawDeg, pitchDeg, rollDeg) {
  const yaw = radians(yawDeg), pitch = radians(pitchDeg), roll = radians(rollDeg);
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  let x = point.x * cy + point.z * sy;
  let z = -point.x * sy + point.z * cy;
  let y = point.y * cp - z * sp;
  z = point.y * sp + z * cp;
  const rolledX = x * cr - y * sr;
  const rolledY = x * sr + y * cr;
  return { x: rolledX, y: rolledY, z };
}

function projectPoint(point, camera = {}) {
  const focal = camera.focal ?? 760;
  const denominator = Math.max(280, focal + point.z + (camera.z ?? 0));
  const scale = focal / denominator;
  return {
    x: (camera.cx ?? 480) + (point.x - (camera.x ?? 0)) * scale,
    y: (camera.cy ?? 270) + (point.y - (camera.y ?? 0)) * scale,
    scale,
  };
}

function projectedPlane({ cx = 480, cy = 270, w = 420, h = 270, yaw = 0, pitch = 0, roll = 0, z = 0, camera = {} }) {
  const localCorners = [
    { x: -w / 2, y: -h / 2, z: 0 },
    { x: w / 2, y: -h / 2, z: 0 },
    { x: w / 2, y: h / 2, z: 0 },
    { x: -w / 2, y: h / 2, z: 0 },
  ];
  const translatedCamera = { ...camera, cx: cx + (camera.cxOffset ?? 0), cy: cy + (camera.cyOffset ?? 0) };
  const corners = localCorners.map(point => {
    const rotated = rotatePoint3d(point, yaw, pitch, roll);
    rotated.z += z;
    return projectPoint(rotated, translatedCamera);
  });
  const [tl, tr, br, bl] = corners;
  return {
    corners,
    center: { x: (tl.x + tr.x + br.x + bl.x) / 4, y: (tl.y + tr.y + br.y + bl.y) / 4 },
    matrix: {
      a: (tr.x - tl.x) / w,
      b: (tr.y - tl.y) / w,
      c: (bl.x - tl.x) / h,
      d: (bl.y - tl.y) / h,
      e: tl.x,
      f: tl.y,
    },
    w,
    h,
  };
}

function pointsAttribute(corners, dx = 0, dy = 0) {
  return corners.map(point => `${round(point.x + dx)},${round(point.y + dy)}`).join(" ");
}

function matrixAttribute(matrix) {
  return `matrix(${round(matrix.a)} ${round(matrix.b)} ${round(matrix.c)} ${round(matrix.d)} ${round(matrix.e)} ${round(matrix.f)})`;
}

function panelTitle(spec, w, role = "primary") {
  const words = titleWords(spec.name).slice(0,3);
  const totalCharacters = words.join(" ").length;
  const splitAt = totalCharacters > (role === "primary" ? 18 : 14) && words.length > 1 ? Math.ceil(words.length / 2) : words.length;
  const lines = [words.slice(0,splitAt).join(" "), words.slice(splitAt).join(" ")].filter(Boolean);
  const maxCharacters = Math.max(...lines.map(line => line.length), 1);
  const cap = role === "primary" ? 31 : 25;
  const fontSize = Math.max(18, Math.min(cap, (w - 70) / (maxCharacters * .72)));
  return `<g data-text-projection="diegetic_plane">${lines.map((line,index)=>`<text x="35" y="${50+index*(fontSize+8)}" fill="${palette.fg}" font-family="Georgia, 'Times New Roman', serif" font-size="${round(fontSize)}" font-weight="700" letter-spacing="-.25">${escapeXml(line.toUpperCase())}</text>`).join("")}</g>`;
}

function screenTitleOverlay(spec, p, anchor = { x: 480, y: 270 }) {
  if (spec.spatial_composition?.text_projection !== "screen_facing") return "";
  const words = titleWords(spec.name).slice(0,3);
  const characterCount = words.join(" ").length;
  const splitAt = characterCount > 18 && words.length > 1 ? Math.ceil(words.length / 2) : words.length;
  const lines = [words.slice(0,splitAt).join(" "), words.slice(splitAt).join(" ")].filter(Boolean);
  const maxCharacters = Math.max(...lines.map(line => line.length), 1);
  const maxWidth = 420;
  const fontSize = Math.max(25, Math.min(39, maxWidth / (maxCharacters * .72)));
  const x = clamp(anchor.x, 235, 725);
  const y = clamp(anchor.y - 165 - (lines.length - 1) * 8, 82, 128);
  const a = reveal(p,.16,.22);
  return `<g data-text-projection="screen_facing" opacity="${a}" transform="translate(${round(x)} ${round(y)})">${lines.map((line,index)=>`<text x="0" y="${round(index*(fontSize+7))}" fill="${palette.fg}" stroke="${palette.bg}" stroke-width="8" paint-order="stroke fill" stroke-linejoin="round" font-family="Georgia, 'Times New Roman', serif" font-size="${round(fontSize)}" font-weight="700" text-anchor="middle" letter-spacing="-.25">${escapeXml(line.toUpperCase())}</text>`).join("")}</g>`;
}

function panelContent(spec, variant, layer, w, h, p, role = "primary") {
  const group = spec.group_code;
  const accent = [palette.accent, palette.blue, palette.green, palette.amber][(variant + layer) % 4];
  const opacity = role === "primary" ? 1 : .78;
  const margin = 28;
  const head = spec.spatial_composition?.text_projection === "diegetic_plane" && role === "primary"
    ? panelTitle(spec,w,role) : "";
  if (group === "HK" || group === "ST") {
    const portraitX = w * (.68 + ((variant + layer) % 2) * .07);
    return `${head}<ellipse cx="${portraitX}" cy="${h*.56}" rx="${h*.18}" ry="${h*.23}" fill="${accent}" opacity=".48"/><circle cx="${portraitX}" cy="${h*.48}" r="${h*.08}" fill="${palette.paper}" opacity=".82"/><path d="M${portraitX-h*.14} ${h*.8} Q${portraitX} ${h*.56} ${portraitX+h*.14} ${h*.8}Z" fill="${palette.paper}" opacity=".5"/><path d="M${margin} ${h*.84} C${w*.25} ${h*.66} ${w*.34} ${h*.91} ${w*.55} ${h*.73}" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="${opacity}"/>`;
  }
  if (group === "EV" || group === "SP" || group === "BR") {
    const horizon = h * (.55 + ((variant + layer) % 3) * .035);
    return `${head}<circle cx="${w*.74}" cy="${h*.45}" r="${h*.11}" fill="${accent}" opacity=".62"/><path d="M0 ${h*.82} Q${w*.18} ${h*.55} ${w*.38} ${h*.76} Q${w*.61} ${h*.48} ${w} ${h*.76} L${w} ${h} L0 ${h}Z" fill="#26312d"/><path d="M0 ${h*.92} Q${w*.31} ${horizon+.1*h} ${w*.58} ${h*.86} T${w} ${h*.74}" fill="none" stroke="${palette.paper}" stroke-opacity=".34" stroke-width="4"/><circle cx="${mix(w*.13,w*.83,ease(p))}" cy="${horizon+.1*h}" r="11" fill="${accent}"/>`;
  }
  if (group === "FO") {
    const value = 38 + ((variant * 9 + layer * 7) % 57);
    const bars = Array.from({ length: 4 }, (_, i) => `<rect x="${margin}" y="${h-46-i*34}" width="${mix(15,w*(.28+i*.13),reveal(p,.1+i*.05,.24))}" height="18" rx="9" fill="${i===3?accent:palette.blue}" opacity="${.55+i*.12}"/>`).join("");
    return `${head}${bars}<text x="${w*.73}" y="${h*.64}" fill="${palette.paper}" font-family="Georgia, 'Times New Roman', serif" font-size="${Math.min(92,h*.38)}" font-weight="700" text-anchor="middle">${Math.round(value*ease(p))}%</text>`;
  }
  if (group === "EX" || group === "PY") {
    const phase = p * TAU;
    const g1x = w*.34, g2x=w*.61, gy=h*.61;
    return `${head}${gear(g1x,gy,h*.18,phase*.4,"#6b5847")}${gear(g2x,gy,h*.13,-phase*.55,accent)}<path d="M${margin} ${h*.9} C${w*.27} ${h*.74} ${w*.48} ${h*.94} ${w-margin} ${h*.78}" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${w}" stroke-dashoffset="${w*(1-ease(p))}"/>`;
  }
  const left = variant % 2 ? palette.blue : palette.accent;
  return `${head}<circle cx="${w*.28}" cy="${h*.58}" r="${h*.16}" fill="${left}" opacity=".84"/><circle cx="${w*.72}" cy="${h*.58}" r="${h*.16}" fill="${palette.green}" opacity=".84"/><path d="M${w*.43} ${h*.58} C${w*.49} ${h*.42} ${w*.55} ${h*.74} ${w*.61} ${h*.58}" fill="none" stroke="${palette.paper}" stroke-width="7" opacity="${ease(p)}"/>`;
}

function planeSvg(spec, variant, layer, pose, p, role = "primary") {
  const plane = projectedPlane(pose);
  const id = `plane-${spec.id.replace(/[^a-z0-9]/gi, "")}-${layer}`;
  const shadow = pointsAttribute(plane.corners, 13 + layer * 2, 17 + layer * 2);
  const face = pointsAttribute(plane.corners);
  const content = panelContent(spec, variant, layer, plane.w, plane.h, p, role);
  return {
    ...plane,
    svg: `<g opacity="${reveal(p,.04+layer*.035,.18)}"><polygon points="${shadow}" fill="${palette.shadow}" opacity=".58"/><polygon points="${face}" fill="${role === "primary" ? "#201c17" : "#181714"}" stroke="${palette.paper}" stroke-opacity="${role === "primary" ? .4 : .22}" stroke-width="2.4"/><defs><clipPath id="${id}"><polygon points="${face}"/></clipPath></defs><g clip-path="url(#${id})"><g transform="${matrixAttribute(plane.matrix)}">${content}</g></g></g>`,
  };
}

function settleRatio(spec, p) {
  const settle = spec.spatial_composition?.settle_mode || "soft_oblique_hold";
  if (p < .72) return 1;
  const t = smooth(.72, .98, p);
  if (settle === "frontal_for_read") return 1 - t;
  if (settle === "spatial_hold") return mix(1, .72, t);
  return mix(1, .58, t);
}

function spatialAngles(spec, p, multiplier = 1, opposite = false) {
  const spatial = spec.spatial_composition;
  const entry = ease(smooth(.04,.32,p));
  const settle = settleRatio(spec,p);
  const direction = opposite ? -1 : 1;
  const yawTarget = (spatial?.yaw_deg || 0) * multiplier * direction;
  const pitchTarget = (spatial?.pitch_deg || 0) * multiplier;
  const rollTarget = (spatial?.roll_deg || 0) * multiplier * direction;
  return {
    yaw: mix(yawTarget * 1.42 + (yawTarget >= 0 ? 4 : -4), yawTarget, entry) * settle,
    pitch: mix(pitchTarget * 1.25, pitchTarget, entry) * settle,
    roll: mix(rollTarget * 1.35, rollTarget, entry) * settle,
  };
}

function connectorSvg(from, to, p, variant) {
  const bend = (variant % 2 ? -1 : 1) * 68;
  const mid = (from.x + to.x) / 2;
  const path = `M${round(from.x)} ${round(from.y)} C${round(mid)} ${round(from.y+bend)} ${round(mid)} ${round(to.y-bend)} ${round(to.x)} ${round(to.y)}`;
  const q = ease(smooth(.28,.78,p));
  const tokenX = mix(from.x,to.x,q);
  const tokenY = mix(from.y,to.y,q) + Math.sin(q*Math.PI)*bend*.52;
  return `<g opacity="${reveal(p,.22,.18)}"><path d="${path}" fill="none" stroke="${palette.accent}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${round(1-q)}"/><circle cx="${round(tokenX)}" cy="${round(tokenY)}" r="10" fill="${palette.paper}"/></g>`;
}

function renderSpatialScene(spec,p,v) {
  const spatial = spec.spatial_composition;
  const mode = spatial?.mode || "frontal";
  const q = ease(smooth(.03,.9,p));
  const direction = (spatial?.yaw_deg || (v%2? -1:1)) < 0 ? -1 : 1;
  const cameraDrift = (q-.5) * (mode === "corridor" ? 150 : mode === "orbital" ? 90 : 34) * direction;
  const camera = { x: cameraDrift, y: mode === "corridor" ? mix(34,-18,q) : 0, z: mode === "corridor" ? mix(180,-70,q) : 0, focal: mix(700,800,q) };
  const floor = `<ellipse cx="480" cy="425" rx="390" ry="72" fill="#050504" opacity=".55" transform="rotate(${direction*2} 480 425)"/>`;
  if (mode === "yaw_left" || mode === "yaw_right" || mode === "tilt_plane") {
    const a = spatialAngles(spec,p);
    const primary = planeSvg(spec,v,0,{cx:470+mix(direction*70,0,q),cy:265,w:470,h:300,...a,z:0,camera},p,"primary");
    const farAngles = spatialAngles(spec,p,.64,true);
    const far = planeSvg(spec,v,1,{cx:direction<0?760:200,cy:235,w:260,h:176,...farAngles,z:135,camera},p,"secondary");
    return base(`${floor}${far.svg}${primary.svg}${screenTitleOverlay(spec,p,primary.center)}`);
  }
  if (mode === "depth_stack") {
    const planes = [];
    let primaryAnchor = {x:480,y:260};
    for (let i=3;i>=0;i--) {
      const a = spatialAngles(spec,p,1-i*.08);
      const offset = i*46*direction;
      const plane = planeSvg(spec,v,i,{cx:480+offset+mix(direction*100,0,q),cy:260-i*18,w:420-i*20,h:270-i*12,...a,z:i*92,camera},p,i===0?"primary":"secondary");
      if (i===0) primaryAnchor=plane.center;
      planes.push(plane.svg);
    }
    return base(`${floor}${planes.join("")}${screenTitleOverlay(spec,p,primaryAnchor)}`);
  }
  if (mode === "oblique_split") {
    const leftAngles = spatialAngles(spec,p,.92,false);
    const rightAngles = spatialAngles(spec,p,.92,true);
    const left = planeSvg(spec,v,0,{cx:285+mix(-90,0,q),cy:270,w:360,h:275,...leftAngles,z:20,camera},p,"primary");
    const right = planeSvg(spec,v,1,{cx:700+mix(100,0,q),cy:245,w:330,h:245,...rightAngles,z:75,camera},p,"secondary");
    const from = {x:left.center.x+direction*84,y:left.center.y+18};
    const to = {x:right.center.x-direction*80,y:right.center.y+10};
    return base(`${floor}${right.svg}${left.svg}${connectorSvg(from,to,p,v)}${screenTitleOverlay(spec,p,left.center)}`);
  }
  if (mode === "corridor") {
    const planes = [];
    let primaryAnchor = {x:480,y:252};
    for (let i=4;i>=0;i--) {
      const z = i*128-90*q;
      const lane = i%2 ? -1 : 1;
      const yaw = (lane*direction)*(13+i*1.2)*settleRatio(spec,p);
      const pitch = -4*settleRatio(spec,p);
      const roll = lane*1.2*settleRatio(spec,p);
      const cx = 480 + lane*(205+i*19) + mix(direction*120,0,q);
      const cy = 252-i*10;
      const plane = planeSvg(spec,v,i,{cx,cy,w:310,h:220,yaw,pitch,roll,z,camera},p,i===0?"primary":"secondary");
      if (i===0) primaryAnchor=plane.center;
      planes.push(plane.svg);
    }
    const occluderX = direction<0 ? 0 : 900;
    const occluder = `<path d="M${occluderX} -40 L${occluderX+(direction<0?105:-105)} -40 L${occluderX+(direction<0?55:-55)} 580 L${occluderX} 580Z" fill="#070706" opacity="${.34+.25*Math.sin(q*Math.PI)}"/>`;
    return base(`${floor}${planes.join("")}${occluder}${screenTitleOverlay(spec,p,primaryAnchor)}`);
  }
  if (mode === "orbital") {
    const theta = mix(-.8,.75,q)*direction;
    const items = [];
    let primaryAnchor = {x:480,y:270};
    for(let i=0;i<4;i++){
      const angle=theta+i*TAU/4;
      const z=100+Math.sin(angle)*150;
      const cx=480+Math.cos(angle)*265;
      const cy=270+Math.sin(angle)*62;
      const yaw=-Math.cos(angle)*18;
      const plane = planeSvg(spec,v,i,{cx,cy,w:300,h:205,yaw,pitch:-5,roll:Math.sin(angle)*2,z,camera},p,i===0?"primary":"secondary");
      if (i===0) primaryAnchor=plane.center;
      items.push({z, plane});
    }
    items.sort((a,b)=>b.z-a.z);
    return base(`${floor}${items.map(item=>item.plane.svg).join("")}<ellipse cx="480" cy="270" rx="38" ry="38" fill="${palette.accent}" opacity="${reveal(p,.38,.2)}"/>${screenTitleOverlay(spec,p,primaryAnchor)}`);
  }
  return null;
}

function person(x, y, s = 1, opacity = 1, facing = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s * facing} ${s})" opacity="${opacity}" fill="#171511" stroke="${palette.paper}" stroke-opacity=".22" stroke-width="2">
    <circle cx="0" cy="-92" r="31"/><path d="M-42 -57 Q0 -78 42 -57 L61 74 L34 144 L17 66 L10 160 L-13 160 L-19 66 L-38 144 L-62 74Z"/>
    <path d="M38 -32 Q76 -9 100 12" fill="none" stroke="${palette.paper}" stroke-width="18" stroke-linecap="round"/>
  </g>`;
}

function landscape(camera = 0, accent = palette.accent) {
  const shift = camera * 70;
  return `<g transform="translate(${-shift} 0) scale(${1 + camera * .08})">
    <rect x="-100" y="0" width="1160" height="540" fill="url(#sky)"/>
    <circle cx="710" cy="130" r="62" fill="${accent}" opacity=".48"/>
    <path d="M-80 350 Q120 206 300 330 Q478 160 650 322 Q800 224 1050 356 L1050 580 L-80 580Z" fill="#202a27"/>
    <path d="M-80 414 Q190 307 388 405 Q610 286 1050 420 L1050 580 L-80 580Z" fill="#141b18"/>
    <path d="M-40 480 C170 454 240 398 430 431 S720 468 1020 390" fill="none" stroke="${palette.paper}" stroke-opacity=".28" stroke-width="3"/>
  </g>`;
}

function label(text, x = 480, y = 476, opacity = 1, size = 30, anchor = "middle", fill = palette.fg) {
  return `<text x="${x}" y="${y}" fill="${fill}" opacity="${opacity}" font-family="Georgia, 'Times New Roman', serif" font-size="${size}" font-weight="700" text-anchor="${anchor}" letter-spacing="-.5">${escapeXml(text)}</text>`;
}

function titleBlock(text, p, variant = 1, y = 290) {
  const a = reveal(p, .16, .28);
  const scale = mix(.88, 1, ease(a));
  const lines = String(text).split(/\s+/);
  const split = Math.ceil(lines.length / 2);
  const first = escapeXml(lines.slice(0, split).join(" "));
  const second = escapeXml(lines.slice(split).join(" "));
  if (variant % 3 === 1) return `<g transform="translate(480 ${y}) scale(${scale})" opacity="${a}">${label(first,0,-10,1,62)}${second ? label(second,0,60,1,62) : ""}</g>`;
  if (variant % 3 === 2) return `<g opacity="${a}">${label(first,95,y-24,1,68,"start")}${second ? label(second,95,y+52,1,68,"start",palette.accent) : ""}</g>`;
  return `<g opacity="${a}" transform="translate(${mix(80,0,a)} 0)">${label(first,480,y-20,1,58)}${second ? label(second,480,y+44,1,42, "middle", palette.muted) : ""}</g>`;
}

function mediaWindow(x, y, w, h, p = 1, kind = 0) {
  const inner = kind % 3 === 0
    ? `<rect x="${x+18}" y="${y+18}" width="${w-36}" height="${h-36}" fill="#253330"/><circle cx="${x+w*.67}" cy="${y+h*.35}" r="${Math.min(w,h)*.13}" fill="${palette.accent}" opacity=".55"/><path d="M${x+18} ${y+h*.74} Q${x+w*.28} ${y+h*.38} ${x+w*.5} ${y+h*.7} Q${x+w*.75} ${y+h*.35} ${x+w-18} ${y+h*.7} L${x+w-18} ${y+h-18} L${x+18} ${y+h-18}Z" fill="#141b18"/>`
    : kind % 3 === 1
      ? `<rect x="${x+18}" y="${y+18}" width="${w-36}" height="${h-36}" fill="#d7cbbb"/><rect x="${x+42}" y="${y+52}" width="${w*.42}" height="${h*.08}" rx="4" fill="#40392f"/><rect x="${x+42}" y="${y+90}" width="${w*.65}" height="8" rx="4" fill="#776d5f"/><rect x="${x+42}" y="${y+116}" width="${w*.56}" height="8" rx="4" fill="#9a8f80"/><rect x="${x+42}" y="${y+156}" width="${w*.64}" height="${h*.28}" rx="4" fill="#ab9e8b"/>`
      : `<rect x="${x+18}" y="${y+18}" width="${w-36}" height="${h-36}" fill="#27221c"/><circle cx="${x+w/2}" cy="${y+h*.38}" r="${Math.min(w,h)*.18}" fill="#c7b399"/><path d="M${x+w*.25} ${y+h*.86} Q${x+w*.5} ${y+h*.52} ${x+w*.75} ${y+h*.86}Z" fill="#8f7962"/>`;
  return `<g opacity="${p}" filter="url(#shadow)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#0d0c0a" stroke="${palette.paper}" stroke-opacity=".28" stroke-width="2"/>${inner}</g>`;
}

function documentPage(p, focus = 0, scroll = 0) {
  const y = 60 - scroll * 90;
  const lines = Array.from({ length: 9 }, (_, i) => `<rect x="325" y="${y+105+i*28}" width="${i%3===2?255:315}" height="8" rx="4" fill="#5c5348" opacity="${focus === i ? 1 : .48}"/>`).join("");
  return `<g transform="translate(0 ${mix(38,0,ease(p))})" opacity="${p}" filter="url(#shadow)"><rect x="280" y="${y}" width="400" height="515" rx="8" fill="url(#paper)"/><rect x="325" y="${y+45}" width="270" height="22" rx="4" fill="#332e27"/>${lines}<rect x="325" y="${y+375}" width="310" height="90" rx="5" fill="#a9957f"/></g>`;
}

function gear(cx, cy, r, angle = 0, fill = "#665747") {
  const teeth = 12;
  let d = "";
  for (let i = 0; i < teeth * 2; i++) {
    const a = angle + i * Math.PI / teeth;
    const rr = i % 2 ? r * .82 : r;
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `<path d="${d}Z" fill="${fill}" stroke="${palette.paper}" stroke-opacity=".38" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r*.28}" fill="${palette.bg}" stroke="${palette.accent}" stroke-width="3"/>`;
}

function machine(p, variant = 1, exploded = 0, active = 1) {
  const phase = p * TAU;
  const spread = exploded * 105;
  const pulse = active ? .55 + .45 * Math.sin(phase * 1.5) : .3;
  return `<g filter="url(#shadow)">
    <rect x="200" y="118" width="560" height="310" rx="42" fill="#312a23" stroke="${palette.paper}" stroke-opacity=".34" stroke-width="3" opacity="${1-exploded*.35}"/>
    <g transform="translate(${-spread} 0)">${gear(340,280,76,phase*.35,"#5f5041")}</g>
    <g transform="translate(${spread} 0)">${gear(505,280,58,-phase*.47,"#78624d")}</g>
    <g transform="translate(${spread*1.35} 0)">${gear(637,280,42,phase*.64,"#594b3e")}</g>
    <path d="M245 380 L245 210 L315 210" fill="none" stroke="${palette.accent}" stroke-width="10" stroke-linecap="round" opacity="${pulse}"/>
    <rect x="675" y="230" width="55" height="100" rx="10" fill="${active?palette.green:palette.red}" opacity="${.55+.35*active}"/>
    <circle cx="705" cy="280" r="12" fill="${palette.paper}" opacity="${pulse}"/>
  </g>`;
}

function routeScene(p, variant = 1, reverse = false) {
  const q = reverse ? 1 - p : p;
  const a = reveal(p, .05, .18);
  const length = 700;
  const dash = length * (1 - ease(q));
  const x = 150 + ease(q) * 660;
  const y = 345 - Math.sin(ease(q) * Math.PI) * (variant % 2 ? 150 : 80);
  return `<g opacity="${a}">
    <path d="M95 385 Q250 110 470 325 T875 180" fill="none" stroke="#303a35" stroke-width="42" stroke-linecap="round"/>
    <path d="M95 385 Q250 110 470 325 T875 180" fill="none" stroke="${palette.accent}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${length}" stroke-dashoffset="${dash}"/>
    <circle cx="95" cy="385" r="15" fill="${palette.paper}"/><circle cx="875" cy="180" r="20" fill="${palette.green}"/>
    <g transform="translate(${x} ${y}) rotate(${variant%3===0?20:0})"><path d="M0 -15 L18 15 L0 8 L-18 15Z" fill="${palette.paper}"/></g>
  </g>`;
}

function worldGrid(count = 5, p = 1, anomaly = -1) {
  const cells = [];
  for (let i = 0; i < count; i++) {
    const x = 170 + i * (620 / Math.max(1, count - 1));
    const y = 275 + Math.sin(i * 1.3) * 40;
    const special = i === anomaly;
    cells.push(`<g transform="translate(${x} ${y}) scale(${mix(.6,1,reveal(p,.12+i*.04,.18))})" opacity="${reveal(p,.08+i*.035,.16)}"><circle r="${special?40:29}" fill="${special?palette.accent:palette.blue}"/><circle r="${special?18:10}" fill="${palette.bg}"/></g>`);
  }
  return cells.join("");
}

function soundWaves(p, x = 480, y = 275) {
  return Array.from({length:5},(_,i)=>{const r=35+i*32;return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${palette.accent}" stroke-width="5" opacity="${clamp(reveal(p,.08+i*.055,.12)-smooth(.6,.95,p)*.7)}"/>`}).join("");
}

function renderHK(spec,p,v){
  if(spec.family_id==="HK01"){
    const cut=v===1?.34:v===6?.42:.2+(v%4)*.08; const seen=smooth(cut,cut+.035,p); const returnBlack=v===7?smooth(.78,.94,p):0;
    const title=titleBlock("PROOF",p,v,450); return `<rect width="960" height="540" fill="#090908"/><g opacity="${seen*(1-returnBlack)}">${base(`${landscape(.1+.25*seen)}${machine(p,v,0,1)}${title}`)}</g>`;
  }
  if(spec.family_id==="HK02"){
    const pull=ease(smooth(.18,.84,p)); return base(`<g transform="scale(${mix(1.5,1,pull)}) translate(${mix(-190,0,pull)} 0)">${landscape(pull*.45)}${person(310,365,1.15,1,v%2?-1:1)}</g>${v===4?`<rect x="325" y="70" width="310" height="385" rx="160" fill="none" stroke="${palette.paper}" stroke-width="8" opacity="${reveal(p,.2,.2)}"/>`:""}${label("ONE WITNESS · A WIDER WORLD",480,455,reveal(p,.54,.22),28)}`);
  }
  if(spec.family_id==="HK03"){
    const flip=ease(smooth(.36,.72,p)); const anomaly=v%5; return base(`${worldGrid(6,p,anomaly)}${v===3?`<g transform="translate(${mix(0,-180,flip)} 0)">${worldGrid(6,1,-1)}</g>`:""}${label(flip>.55?"BUT THE PATTERN BREAKS":"THE EXPECTED PATTERN",480,470,reveal(p,.1,.18),34,"middle",flip>.55?palette.accent:palette.fg)}`);
  }
  const q=Math.floor(clamp(p)*3); return base(`<g>${q>=0?mediaWindow(70,110,250,315,1,0):""}${q>=1?mediaWindow(355,80,250,360,1,1):""}${q>=2?mediaWindow(640,120,250,290,1,2):""}</g>${label(q<1?"PLACE":q<2?"PROCESS":"CONSEQUENCE",480,455,1,36,"middle",q===2?palette.accent:palette.fg)}`);
}

function renderST(spec,p,v){
  if(spec.family_id==="ST01") return base(`${landscape(.06*p)}<rect width="960" height="540" fill="${palette.bg}" opacity="${.42-.25*p}"/>${titleBlock(shortTitle(spec),p,v,270)}`);
  if(spec.family_id==="ST02"){
    const a=reveal(p,.12,.25), tilt=mix(v===7?-10:0,0,ease(p));
    return base(`<g transform="translate(480 270) rotate(${tilt}) translate(-480 -270)" opacity="${a}">${mediaWindow(340,55,280,430,1,v)}${person(500,392,.9,1,v%2?-1:1)}</g>${v===8?`<g transform="translate(${mix(500,690,ease(p))} 392)">${person(0,0,.9,reveal(p,.45,.2),1)}</g>`:""}${label("A SELECTED PORTRAIT WORLD",480,455,a,26)}`);
  }
  const a=reveal(p,.1,.18), numeral=v%3===0?"III":v%3===1?"I":"II";
  return base(`<g opacity="${a}" transform="translate(0 ${mix(22,0,ease(a))})">${label(numeral,480,220,1,145,"middle",palette.accent)}${label(shortTitle(spec),480,335,reveal(p,.28,.22),48)}</g>`);
}

function renderEV(spec,p,v){
  if(spec.family_id==="EV01"){
    const cut=.46+(v%3)*.025; const b=smooth(cut,cut+.015,p);
    return base(`<g opacity="${1-b}">${mediaWindow(70,70,820,400,1,v)}<circle cx="480" cy="270" r="62" fill="${palette.accent}"/></g><g opacity="${b}">${landscape(.14)}<circle cx="480" cy="270" r="62" fill="${palette.paper}" opacity=".78"/></g>`);
  }
  if(spec.family_id==="EV02"){
    const z=ease(p); return base(`<g transform="translate(${mix(-120,0,z)} ${mix(-95,0,z)}) scale(${mix(2.6,1,z)})">${landscape(.12*z)}<circle cx="330" cy="330" r="34" fill="${palette.accent}"/></g>${label(z>.68?"THE WHOLE PLACE":"A SINGLE CLUE",480,455,1,30)}`);
  }
  if(spec.family_id==="EV03"){
    const tilt=mix(0,18,ease(p)); return base(`<g transform="translate(480 270) skewX(${tilt}) translate(-480 -270)" opacity="${reveal(p,.05,.2)}">${routeScene(p,v,v===4)}</g>${label("ORIENT · TRACE · ARRIVE",480,455,reveal(p,.45,.2),29)}`);
  }
  const q=Math.floor(clamp(p)*3); return base(`${mediaWindow(35,95,280,345,q===0?1:.28,0)}${mediaWindow(340,70,280,395,q===1?1:.28,1)}${mediaWindow(645,105,280,325,q>=2?1:.28,2)}${label(q===0?"OBSERVE":q===1?"MEASURE":"LIVE THE EFFECT",480,455,1,34,"middle",q>=2?palette.accent:palette.fg)}`);
}

function renderFO(spec,p,v){
  if(spec.family_id==="FO01"){
    const a=reveal(p,.18,.24), word=["CAUSE","SCALE","PROOF","CHANGE"][v%4];
    return base(`${landscape(.03*p)}<rect width="960" height="540" fill="${palette.bg}" opacity="${.55+.18*smooth(.2,.65,p)}"/>${label(word,480,300,a,118,"middle",v%2?palette.accent:palette.fg)}${v===4?`<line x1="330" y1="332" x2="${mix(330,630,a)}" y2="332" stroke="${palette.accent}" stroke-width="8"/>`:""}`);
  }
  if(spec.family_id==="FO02"){
    const a=ease(p), n=Math.round((v%2?73:42)*a); const bars=Array.from({length:7},(_,i)=>`<rect x="160" y="${395-i*41}" width="${mix(0,70+i*67,smooth(i*.06,.45+i*.05,p))}" height="24" rx="12" fill="${i===6?palette.accent:palette.blue}" opacity="${.6+i*.05}"/>`).join("");
    return base(`${bars}${label(String(n)+(v===7?"–"+(n+12):"%"),750,285,reveal(p,.34,.2),128,"middle",palette.fg)}${label(v===8?"OF THE WHOLE, NOT ALONE":"MEASURED IN CONTEXT",750,360,reveal(p,.5,.2),25)}`);
  }
  const focus=v%8, scroll=v===3?ease(p):0; return base(`${documentPage(reveal(p,.05,.18),focus,scroll)}<rect width="960" height="540" fill="${palette.bg}" opacity="${.18*smooth(.2,.6,p)}"/><rect x="305" y="${165+(focus%6)*28-scroll*90}" width="350" height="28" rx="7" fill="none" stroke="${palette.accent}" stroke-width="5" opacity="${reveal(p,.45,.16)}"/>`);
}

function renderSP(spec,p,v){
  if(spec.family_id==="SP01"){
    const q=ease(p), cards=[]; for(let i=0;i<4;i++){const x=180+i*150+mix(i*50,0,q),y=105+i*42,sc=1-i*.08;cards.push(`<g transform="translate(${x} ${y}) scale(${sc})" opacity="${reveal(p,.08+i*.06,.2)}">${mediaWindow(0,0,330,245,1,i+v)}</g>`)} return base(cards.reverse().join("")+label("EVIDENCE IN DEPTH",480,455,reveal(p,.5,.18),31));
  }
  if(spec.family_id==="SP02"){
    const q=ease(p); return base(`<g transform="translate(${mix(-50,0,q)} 0) scale(${mix(1.14,1.03,q)})">${landscape(.12*q)}</g><g transform="translate(${mix(90,0,q)} 0)">${person(500,395,1.08,1,v%2?-1:1)}</g><path d="M0 420 Q170 330 315 440 L315 540 L0 540Z" fill="#080807" opacity=".75" transform="translate(${mix(0,-100,q)} 0)"/>${label("DEPTH REVEALS CONTEXT",480,455,reveal(p,.46,.2),29)}`);
  }
  const q=ease(p), tile=v%2?1-q:q; return base(`<g transform="translate(${mix(0,-220,q)} ${mix(0,-90,q)}) scale(${mix(1,1.9,q)})">${mediaWindow(105,80,230,170,1,0)}${mediaWindow(365,55,230,205,1,1)}${mediaWindow(625,85,230,170,1,2)}${mediaWindow(365,295,230,170,1,v)}</g><rect x="${mix(365,0,q)}" y="${mix(55,0,q)}" width="${mix(230,960,q)}" height="${mix(205,540,q)}" fill="none" stroke="${palette.accent}" stroke-width="${mix(4,0,q)}" opacity="${tile}"/>`);
}

function renderEX(spec,p,v){
  if(spec.family_id==="EX01"){
    const dive=smooth(.18,.55,p), restore=smooth(.72,.96,p); const z=mix(1,mix(2.1,1,restore),dive); return base(`<g transform="translate(480 270) scale(${z}) translate(-480 -270)">${machine(p,v,0,1)}<circle cx="505" cy="280" r="${mix(0,92,dive*(1-restore))}" fill="none" stroke="${palette.accent}" stroke-width="8"/></g>${label(restore>.55?"WHOLE SYSTEM":dive>.55?"ONE WORKING PART":"ORIENT THE WHOLE",480,455,1,29)}`);
  }
  if(spec.family_id==="EX02"){
    const ex=ease(smooth(.22,.72,p)); return base(`${machine(p,v,v===1?.4:ex,1)}${v===5?`<rect x="${mix(200,720,ex)}" y="95" width="8" height="360" fill="${palette.accent}" opacity=".8"/>`:""}${label(ex>.6?"INTERIOR RELATION":"OUTER SHELL",480,455,1,30)}`);
  }
  if(spec.family_id==="EX03"){
    const q=ease(p), a=smooth(.08,.3,p), b=smooth(.3,.62,p), c=smooth(.6,.9,p); const branch=v===5||v===8; return base(`<g opacity="${a}"><circle cx="145" cy="270" r="55" fill="${palette.accent}"/>${label("INPUT",145,278,1,23)}</g><path d="M200 270 ${branch?"C330 270 350 160 475 160 M200 270 C330 270 350 380 475 380 M475 160 C620 160 620 270 750 270 M475 380 C620 380 620 270 750 270":"C350 270 360 270 475 270 S620 270 750 270"}" fill="none" stroke="${palette.blue}" stroke-width="18" stroke-linecap="round" opacity=".45"/><path d="M200 270 ${branch?"C330 270 350 160 475 160":"C350 270 360 270 475 270 S620 270 750 270"}" fill="none" stroke="${palette.accent}" stroke-width="7" stroke-dasharray="620" stroke-dashoffset="${620*(1-b)}"/><g opacity="${c}"><rect x="750" y="205" width="130" height="130" rx="28" fill="${palette.green}"/>${label("RESULT",815,278,1,22)}</g>${v===7?`<rect x="365" y="435" width="${mix(0,290,q)}" height="22" rx="11" fill="${palette.accent}"/><line x1="575" y1="420" x2="575" y2="475" stroke="${palette.paper}" stroke-width="4"/>`:""}`);
  }
  if(spec.family_id==="EX04") return base(`${routeScene(p,v,v===4)}${label(v===2?"CHOOSE ONE BRANCH":v===3?"BOTTLENECK":"TRACE THE CONSEQUENCE",480,455,reveal(p,.42,.2),29)}`);
  const state=Math.min(2,Math.floor(p*3)); const active=state>0; return base(`${machine(p,v,0,active)}${state===0?worldGrid(6,p,-1):state===1?worldGrid(6,1,v%6):""}${label(state===0?"BEFORE":state===1?"INTERVENTION":"WORKING STATE",480,455,1,32,"middle",state===2?palette.green:palette.fg)}`);
}

function renderAR(spec,p,v){
  if(spec.family_id==="AR01"){
    const q=ease(p); return base(`<rect x="60" y="65" width="400" height="410" rx="18" fill="#1a1e1b"/><rect x="500" y="65" width="400" height="410" rx="18" fill="#211b18"/>${gear(265,255,85,q*TAU,palette.blue)}${gear(695,255,85,q*TAU*(v%2?-.55:1.4),palette.accent)}<rect x="170" y="380" width="${mix(0,190,q)}" height="18" rx="9" fill="${palette.blue}"/><rect x="600" y="380" width="${mix(0,v%2?110:240,q)}" height="18" rx="9" fill="${palette.accent}"/>${label("MATCHED START",265,445,1,24)}${label("DIVERGENT RESULT",695,445,1,24)}`);
  }
  if(spec.family_id==="AR02"){
    const pivot=smooth(.42,.65,p); return base(`${landscape(.04*p)}<rect width="960" height="540" fill="${palette.bg}" opacity=".55"/>${label(pivot<.5?"THE OBVIOUS ANSWER":"THE HIDDEN DRIVER",480,275,1,64,"middle",pivot<.5?palette.fg:palette.accent)}<g opacity="${pivot}">${machine(p,v,0,1)}</g>`);
  }
  const fixed=smooth(.36,.82,p); return base(`<path d="M120 270 H405" stroke="${palette.red}" stroke-width="32" stroke-linecap="round"/><rect x="405" y="225" width="110" height="90" rx="18" fill="${palette.red}" transform="translate(0 ${mix(0,-140,fixed)})"/><path d="M515 270 H850" stroke="${palette.green}" stroke-width="32" stroke-linecap="round" opacity="${.3+.7*fixed}"/><circle cx="${mix(130,825,fixed)}" cy="270" r="18" fill="${palette.paper}"/>${label(fixed>.6?"FLOW RESTORED":"BLOCKED SYSTEM",480,450,1,42,"middle",fixed>.6?palette.green:palette.red)}`);
}

function renderBR(spec,p,v){
  const cut=.5;
  if(spec.family_id==="BR01"){
    const b=smooth(cut,cut+.02,p), angle=p*TAU; const shapes=[`<circle cx="480" cy="270" r="100" fill="${palette.accent}"/>`,`<rect x="360" y="190" width="240" height="160" rx="16" fill="${palette.blue}"/>`,`<line x1="110" y1="270" x2="850" y2="270" stroke="${palette.paper}" stroke-width="18"/>`,`<g transform="rotate(${angle*20} 480 270)">${gear(480,270,105,angle,palette.accent)}</g>`,`<path d="M365 390 V245 A115 115 0 0 1 595 245 V390Z" fill="${palette.blue}"/>`,`<rect x="435" y="90" width="90" height="360" fill="${palette.accent}"/>`]; return base(`<g opacity="${1-b}">${shapes[v-1]}</g><g opacity="${b}">${landscape(.06)}<g opacity=".85">${shapes[v-1]}</g></g>`);
  }
  if(spec.family_id==="BR02"){
    const b=smooth(cut,cut+.02,p), x=[480,655,480,300,moveX(p),560][v-1]||480, y=[270,215,120,270,270,280][v-1]||270; return base(`<g opacity="${1-b}">${mediaWindow(70,70,820,400,1,0)}<circle cx="${x}" cy="${y}" r="32" fill="${palette.accent}"/></g><g opacity="${b}">${landscape(.04)}<circle cx="${x}" cy="${y}" r="32" fill="${palette.paper}"/></g>`);
  }
  if(spec.family_id==="BR03"){
    const cover=1-Math.abs(p-.5)*2, x=mix(-260,1220,ease(p)); return base(`<g opacity="${p<.5?1:0}">${landscape(.02)}</g><g opacity="${p>=.5?1:0}">${machine(p,v,0,1)}</g><rect x="${x}" y="-40" width="260" height="620" rx="40" fill="${v===4?"#050505":"#17130f"}" opacity="${clamp(cover*2)}"/>`);
  }
  const b=smooth(cut,cut+.02,p), waveAt=v<=2?.25:.7; return base(`<g opacity="${1-b}">${mediaWindow(70,80,390,380,1,0)}</g><g opacity="${b}">${mediaWindow(500,80,390,380,1,2)}</g>${soundWaves(smooth(waveAt,waveAt+.22,p),v%2?360:620,270)}${label(v<=2?"SOUND ARRIVES BEFORE PICTURE":"SOUND CONTINUES AFTER CUT",480,455,1,27)}`);
}

function moveX(p){return 160+ease(p)*640;}

function renderPY(spec,p,v){
  if(spec.family_id==="PY01"){
    const join=ease(p); return base(`<g transform="translate(${mix(-150,0,join)} 0)">${gear(340,270,76,p*TAU,palette.blue)}</g><g transform="translate(${mix(150,0,join)} 0)">${gear(505,270,58,-p*TAU,palette.accent)}</g><g transform="translate(${mix(210,0,join)} 0)">${gear(637,270,42,p*TAU,palette.green)}</g><rect x="200" y="118" width="560" height="310" rx="42" fill="none" stroke="${palette.paper}" stroke-opacity="${join*.45}" stroke-width="4"/>${label("THE WHOLE, UNDERSTOOD",480,455,reveal(p,.6,.18),35)}`);
  }
  if(spec.family_id==="PY02"){
    const q=ease(p); return base(`${mediaWindow(65,90,240,180,reveal(p,.05,.18),0)}${mediaWindow(360,70,240,180,reveal(p,.2,.18),1)}${mediaWindow(655,90,240,180,reveal(p,.35,.18),2)}<path d="M185 300 Q480 ${mix(500,315,q)} 775 300" fill="none" stroke="${palette.accent}" stroke-width="8" stroke-dasharray="650" stroke-dashoffset="${650*(1-q)}"/>${label("WHAT THE JOURNEY PROVED",480,455,reveal(p,.52,.2),38)}`);
  }
  const pull=ease(p); return base(`<g transform="translate(480 270) scale(${mix(1.55,1,pull)}) translate(-480 -270)">${landscape(.15*pull)}${machine(p,v,0,1)}${v===2?mediaWindow(690,320,160,120,1,1):""}</g><rect width="960" height="540" fill="${palette.bg}" opacity="${v===3?smooth(.86,1,p):0}"/>${label(v===2?"THE ANSWER LIVES IN THE WORLD":v===3?"THE FINAL ACTION COMPLETES":"ONE CONCLUSION",480,455,reveal(p,.55,.2)*disappear(p,.9,.1),32)}`);
}

export function posterProgress(spec) {
  const spatialMode = spec.spatial_composition?.mode;
  if (spatialMode && spatialMode !== "frontal") {
    if (spatialMode === "corridor" || spatialMode === "orbital") return .58;
    if (spec.spatial_composition?.settle_mode === "frontal_for_read") return .62;
    return .66;
  }
  const family = spec.family_id;
  if (["EV01","BR01","BR02","BR03","BR04"].includes(family)) return .72;
  if (["EX01","PY01","PY03"].includes(family)) return .88;
  return .78;
}

export function renderSvgFrame(spec, progress) {
  const p = clamp(progress);
  const v = variantOf(spec);
  const spatialMode = spec.spatial_composition?.mode || "frontal";
  if (spatialMode !== "frontal") {
    const spatialBody = renderSpatialScene(spec,p,v);
    const expectedProjection = spec.spatial_composition?.text_projection || "screen_facing";
    const expectedMarker = `data-text-projection="${expectedProjection}"`;
    const alternateProjection = expectedProjection === "screen_facing" ? "diegetic_plane" : "screen_facing";
    const expectedCount = spatialBody.split(expectedMarker).length - 1;
    if (expectedCount !== 1 || spatialBody.includes(`data-text-projection="${alternateProjection}"`)) {
      throw new Error(`${spec.id}: rendered text projection does not match ${expectedProjection}`);
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${defs()}<g clip-path="url(#screen)">${spatialBody}</g></svg>`;
  }
  let body;
  if (spec.group_code === "HK") body = renderHK(spec,p,v);
  else if (spec.group_code === "ST") body = renderST(spec,p,v);
  else if (spec.group_code === "EV") body = renderEV(spec,p,v);
  else if (spec.group_code === "FO") body = renderFO(spec,p,v);
  else if (spec.group_code === "SP") body = renderSP(spec,p,v);
  else if (spec.group_code === "EX") body = renderEX(spec,p,v);
  else if (spec.group_code === "AR") body = renderAR(spec,p,v);
  else if (spec.group_code === "BR") body = renderBR(spec,p,v);
  else body = renderPY(spec,p,v);
  const variation = semanticVariantLayer(spec, p, v);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">${defs()}<g clip-path="url(#screen)">${body}${variation}</g></svg>`;
}

export function cameraDiagnostics(spec, progress = .62) {
  const p = clamp(progress);
  const spatial = spec.spatial_composition || { mode: "frontal", yaw_deg: 0, pitch_deg: 0, roll_deg: 0, depth_layers: 1 };
  const angles = spatialAngles(spec,p);
  return {
    template_id: spec.id,
    mode: spatial.mode,
    settle_mode: spatial.settle_mode || "frontal_for_read",
    yaw_deg: round(angles.yaw),
    pitch_deg: round(angles.pitch),
    roll_deg: round(angles.roll),
    depth_layers: spatial.depth_layers || 1,
    text_projection: spatial.text_projection || "screen_facing",
    non_frontal: spatial.mode !== "frontal",
  };
}

function semanticVariantLayer(spec, p, v) {
  const a = reveal(p, .38 + (v % 3) * .035, .18);
  const anchor = spec.continuity?.exit?.focal_anchor || [.5,.5];
  const cx = clamp(anchor[0], .16, .84) * WIDTH;
  const cy = clamp(anchor[1], .18, .78) * HEIGHT;
  const topology = v % 4;
  if (topology === 0) {
    const travel = ease(p);
    return `<g opacity="${a}"><circle cx="${mix(190,cx,travel)}" cy="${mix(365,cy,travel)}" r="13" fill="${palette.accent}"/><circle cx="${cx}" cy="${cy}" r="38" fill="none" stroke="${palette.paper}" stroke-opacity=".42" stroke-width="4"/></g>`;
  }
  if (topology === 1) {
    const spread = mix(0,76,ease(p));
    return `<g opacity="${a}"><rect x="${cx-54-spread}" y="${cy-34}" width="108" height="68" rx="9" fill="none" stroke="${palette.blue}" stroke-width="4"/><rect x="${cx-54+spread}" y="${cy-34}" width="108" height="68" rx="9" fill="none" stroke="${palette.accent}" stroke-width="4"/></g>`;
  }
  if (topology === 2) {
    const fill = ease(p);
    return `<g opacity="${a}"><rect x="${cx-105}" y="${cy-13}" width="210" height="26" rx="13" fill="#3a332b"/><rect x="${cx-105}" y="${cy-13}" width="${210*fill}" height="26" rx="13" fill="${palette.green}"/><circle cx="${cx-105+210*fill}" cy="${cy}" r="19" fill="${palette.paper}"/></g>`;
  }
  const open = ease(p);
  return `<g opacity="${a}"><path d="M${cx} ${cy+84} L${cx} ${cy} L${cx-98} ${cy-72}" fill="none" stroke="${palette.blue}" stroke-width="7" stroke-linecap="round"/><path d="M${cx} ${cy} L${cx+98} ${cy-72}" fill="none" stroke="${palette.accent}" stroke-width="7" stroke-linecap="round" stroke-dasharray="150" stroke-dashoffset="${150*(1-open)}"/><circle cx="${cx}" cy="${cy}" r="18" fill="${palette.paper}"/></g>`;
}
