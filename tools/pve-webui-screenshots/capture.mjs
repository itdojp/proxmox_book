import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

function usage() {
  const msg = `
Usage:
  PVE_BASE_URL="https://<ip>:8006" PVE_USERNAME="root@pam" PVE_PASSWORD="..." PVE_INSECURE=1 \\
    node tools/pve-webui-screenshots/capture.mjs

Required env:
  PVE_BASE_URL   e.g. https://192.168.10.11:8006
  PVE_USERNAME   e.g. root@pam
  PVE_PASSWORD   password (do not commit)
  (or) PVE_PASSWORD_FILE path to a file containing the password

Optional env:
  PVE_INSECURE=1 allow self-signed cert (lab only)
  PVE_CAPTURE_CH4=1 capture Create VM wizard screenshots (Chapter 4)
  PVE_CAPTURE_EXTENDED=1 capture additional safe UI pages/dialogs/wizards (ch5/ch6/ch7/ch8)
  PVE_CAPTURE_VM_ASSETS=1 capture VM/backup-related screenshots (creates a demo VM and runs a backup; lab only)
  PVE_DEMO_VMID=100 demo VMID (optional)
  PVE_DEMO_VM_NAME=vm-ubuntu01 demo VM name (optional)
`;
  process.stderr.write(msg.trimStart());
  process.stderr.write("\n");
}

function mustEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

async function resolvePassword() {
  if (process.env.PVE_PASSWORD) return process.env.PVE_PASSWORD;
  const passwordFile = process.env.PVE_PASSWORD_FILE;
  if (passwordFile) {
    const raw = await fs.readFile(passwordFile, { encoding: "utf8" });
    return raw.replace(/\r?\n$/, "");
  }
  throw new Error("Missing env var: PVE_PASSWORD (or PVE_PASSWORD_FILE)");
}

function repoRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return path.resolve(here, "../..");
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ];
  for (const candidate of candidates) {
    try {
      execSync(`test -x ${candidate}`);
      return candidate;
    } catch {
      // ignore
    }
  }
  try {
    return execSync("which google-chrome", { encoding: "utf8" }).trim();
  } catch {
    // ignore
  }
  throw new Error(
    "Google Chrome not found. Set CHROME_PATH or install Chrome/Chromium."
  );
}

async function ensureDir(filepath) {
  await fs.mkdir(path.dirname(filepath), { recursive: true });
}

async function saveScreenshot({ page, outPath }) {
  await ensureDir(outPath);
  await page.screenshot({ path: outPath, fullPage: true });
}

async function dismissMessageBoxes(page) {
  const box = page.locator("css=.x-message-box").first();
  try {
    await box.waitFor({ state: "visible", timeout: 1500 });
  } catch {
    return;
  }

  // Most common: “No valid subscription” on labs without enterprise subscription.
  try {
    await box.locator('css=.x-btn:has-text("OK")').first().click({ timeout: 5000 });
  } catch {
    // Some confirmations use Yes/No.
    try {
      await box.locator('css=.x-btn:has-text("Yes")').first().click({ timeout: 3000 });
    } catch {
      // Fallback to clicking the close icon if present.
      try {
        await box
          .locator('css=.x-tool-close, css=.x-window-header-close')
          .first()
          .click({ timeout: 3000 });
      } catch {
        // ignore
      }
    }
  }

  try {
    await box.waitFor({ state: "hidden", timeout: 10000 });
  } catch {
    // ignore
  }
}

async function fetchJson({ url, method = "GET", headers = {}, body }) {
  const response = await fetch(url, { method, headers, body });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} for ${url}\n${text}`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON from ${url}:\n${text}`);
  }
}

async function getTicket({ baseUrl, username, password, otp }) {
  const params = new URLSearchParams();
  params.set("username", username);
  params.set("password", password);
  if (otp) params.set("otp", otp);

  const url = new URL("/api2/json/access/ticket", baseUrl);
  const json = await fetchJson({
    url: url.toString(),
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });
  const ticket = json?.data?.ticket;
  const csrf = json?.data?.CSRFPreventionToken;
  if (!ticket) throw new Error("No ticket in response from /access/ticket");
  if (!csrf) throw new Error("No CSRFPreventionToken in response from /access/ticket");
  return { ticket, csrf };
}

async function apiGet({ baseUrl, ticket, path }) {
  const url = new URL(`/api2/json${path}`, baseUrl);
  const json = await fetchJson({
    url: url.toString(),
    headers: { cookie: `PVEAuthCookie=${ticket}` }
  });
  return json?.data;
}

async function apiPostForm({ baseUrl, ticket, csrf, path, params }) {
  const url = new URL(`/api2/json${path}`, baseUrl);
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value === undefined || value === null) continue;
    const v = String(value);
    if (!v) continue;
    body.set(key, v);
  }
  const json = await fetchJson({
    url: url.toString(),
    method: "POST",
    headers: {
      cookie: `PVEAuthCookie=${ticket}`,
      CSRFPreventionToken: csrf,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: body.toString()
  });
  return json?.data;
}

async function waitForTaskDone({ baseUrl, ticket, node, upid, timeoutMs = 10 * 60 * 1000 }) {
  const startedAt = Date.now();
  const encodedUpid = encodeURIComponent(String(upid || ""));
  if (!node || !encodedUpid) throw new Error("waitForTaskDone: node/upid required");

  while (Date.now() - startedAt < timeoutMs) {
    const status = await apiGet({
      baseUrl,
      ticket,
      path: `/nodes/${encodeURIComponent(node)}/tasks/${encodedUpid}/status`
    });
    if (status?.status === "stopped") return status;
    await new Promise((r) => setTimeout(r, 2500));
  }

  throw new Error(`Timeout waiting for task: ${upid}`);
}

function buildTextReplacements({ baseUrl, firstNode }) {
  let host = "";
  let hostWithPort = "";
  let ipv4Prefix = "";
  try {
    const u = new URL(baseUrl);
    host = u.hostname;
    hostWithPort = u.host;
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
      ipv4Prefix = `${host.split(".").slice(0, 3).join(".")}.`;
    }
  } catch {
    // ignore
  }
  const replacements = [
    // Replace “real” values with the canonical examples used in the manuscript/images README.
    [host, "192.168.10.11"],
    [hostWithPort, "192.168.10.11:8006"],
    // Also rewrite the /24 prefix so gateways etc. are sanitized too (e.g., 192.168.220.1 -> 192.168.10.1).
    [ipv4Prefix, "192.168.10."],
    [String(firstNode || ""), "pve1"]
  ];
  return replacements.filter(([from]) => from);
}

async function redactForScreenshot(page, replacements) {
  await page.evaluate((pairs) => {
    const replacements = Array.isArray(pairs) ? pairs : [];
    const replaceAll = (text) => {
      let out = text;
      for (const [from, to] of replacements) {
        if (!from || !to) continue;
        out = out.split(from).join(to);
      }
      // Best-effort redaction for device identifiers that would otherwise leak lab-specific info.
      out = out
        // Interface names embedding MACs (e.g., enx00e05d105b64, wlx001122334455)
        .replace(/\b(enx|wlx)[0-9a-f]{12}\b/gi, "$1001122334455")
        // Raw MAC addresses
        .replace(/\b([0-9a-f]{2}:){5}[0-9a-f]{2}\b/gi, "00:11:22:33:44:55");
      return out;
    };

    const root = document.body || document.documentElement;
    if (!root) return;

    // Replace in the document title (sometimes rendered in visible chrome).
    try {
      document.title = replaceAll(document.title || "");
    } catch {
      // ignore
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    for (const n of nodes) {
      const v = n.nodeValue;
      if (v) n.nodeValue = replaceAll(v);
    }

    // Replace in input/textarea values (visible in forms).
    const formEls = root.querySelectorAll("input, textarea");
    for (const el of formEls) {
      try {
        // Hidden inputs are not visible in screenshots, and mutating them can break actions (e.g., form submits).
        if (String(el.type || "").toLowerCase() === "hidden") continue;
        if (typeof el.value === "string" && el.value) {
          const next = replaceAll(el.value);
          if (next !== el.value) el.value = next;
          // Keep attribute in sync for screenshots/serialization edge cases.
          try {
            el.setAttribute("value", el.value);
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    }

    // Best-effort: also sanitize common attributes that may be shown in UI tooltips.
    const attrNames = [
      "placeholder",
      "title",
      "aria-label",
      "aria-describedby",
      "data-qtip",
      "data-qtitle",
      "data-qclass",
      "alt"
    ];
    const allEls = root.querySelectorAll("*");
    for (const el of allEls) {
      for (const name of attrNames) {
        try {
          const raw = el.getAttribute(name);
          if (!raw) continue;
          const next = replaceAll(raw);
          if (next !== raw) el.setAttribute(name, next);
        } catch {
          // ignore
        }
      }
    }
  }, replacements);
}

async function safeClick(page, selectors) {
  const timeoutMs = 6000;
  await dismissMessageBoxes(page);
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      await locator.waitFor({ state: "visible", timeout: timeoutMs });
      await locator.click({ timeout: timeoutMs });
      return;
    } catch {
      // try next
    }
  }
  throw new Error(`Click failed. Tried selectors: ${selectors.join(", ")}`);
}

async function safeClickWithin(container, selectors) {
  const timeoutMs = 6000;
  const page = container.page();
  await dismissMessageBoxes(page);
  for (const selector of selectors) {
    const locator = container.locator(selector).first();
    try {
      await locator.waitFor({ state: "visible", timeout: timeoutMs });
      await locator.click({ timeout: timeoutMs });
      return;
    } catch {
      // try next
    }
  }
  throw new Error(`Click failed. Tried selectors: ${selectors.join(", ")}`);
}

async function expandTreeSelection(page, { attempts = 2 } = {}) {
  // Best-effort: ExtJS tree nodes generally expand with ArrowRight when focused.
  for (let i = 0; i < attempts; i++) {
    try {
      await page.keyboard.press("ArrowRight");
    } catch {
      // ignore
    }
    await page.waitForTimeout(150);
  }
}

async function waitAnyText(page, texts) {
  for (const text of texts) {
    try {
      await page.locator(`text=${text}`).first().waitFor({ timeout: 5000 });
      return;
    } catch {
      // try next
    }
  }
  // no-op: some environments/locales may differ
}

async function gotoDatacenter(page) {
  await safeClick(page, [
    "text=Datacenter",
    'css=.x-tree-node-text:has-text("Datacenter")'
  ]);
}

async function gotoNode(page, nodeName) {
  if (!nodeName) return;
  // NOTE: We may redact the real node name in the DOM (e.g., pve01 -> pve1).
  // Try both to keep navigation working while still producing sanitized screenshots.
  const candidates = Array.from(new Set([nodeName, "pve1"].filter(Boolean)));
  await safeClick(page, [
    ...candidates.map((n) => `css=.x-tree-node-text:has-text("${n}")`),
    ...candidates.map((n) => `css=.x-tree-node-anchor:has-text("${n}")`),
    // Fallback (less strict; may match outside the tree).
    ...candidates.map((n) => `text=${n}`)
  ]);
}

async function gotoSection(page, label) {
  // Datacenter/node sub-navigation is rendered as a treelist in PVE 9.x.
  await safeClick(page, [
    `css=.x-treelist-item-text:has-text("${label}")`,
    `css=.x-treelist-item:has-text("${label}")`,
    `text=${label}`
  ]);
}

async function gotoVm(page, { vmid, name }) {
  const candidates = Array.from(new Set([String(vmid || ""), String(name || "")].filter(Boolean)));
  if (candidates.length === 0) throw new Error("gotoVm: vmid or name required");
  const vmidStr = vmid ? String(vmid) : "";
  const nameStr = name ? String(name) : "";
  // Match a full label like "100 (vm-ubuntu01)" without requiring exact formatting.
  const fullLabel =
    vmidStr && nameStr ? new RegExp(`\\b${vmidStr}\\b[\\s\\S]*\\b${escapeRegex(nameStr)}\\b`) : null;
  const selectors = [
    ...candidates.map((v) => `css=.x-tree-node-text:has-text("${v}")`),
    ...candidates.map((v) => `css=.x-tree-node-anchor:has-text("${v}")`),
    // Some views render tree rows as grid cells.
    ...candidates.map((v) => `css=.x-grid-cell-inner:has-text("${v}")`),
    ...(vmidStr ? [`css=.x-tree-node-text:has-text("${vmidStr}")`] : []),
    ...(nameStr ? [`css=.x-tree-node-text:has-text("${nameStr}")`] : []),
    ...candidates.map((v) => `text=${v}`)
  ];

  // Prefer the left navigation tree (Server View). This is more stable than generic tree views elsewhere.
  const tree = page.locator("css=.x-tree-view").first();
  try {
    await tree.waitFor({ state: "visible", timeout: 15000 });
    if (fullLabel) {
      try {
        await tree.locator(`css=.x-tree-node-text`).filter({ hasText: fullLabel }).first().click({
          timeout: 6000
        });
        return;
      } catch {
        // fall back to selector-based clicking
      }
    }
    await safeClickWithin(tree, selectors);
  } catch {
    // Fallback to page-wide search if the tree view locator differs across versions.
    await safeClick(page, selectors);
  }
}

async function waitForVmInTree(page, { vmid, timeoutMs = 30000 }) {
  const label = String(vmid || "");
  if (!label) throw new Error("waitForVmInTree: vmid required");
  const tree = page.locator("css=.x-tree-view").first();
  try {
    await tree.waitFor({ state: "visible", timeout: Math.min(timeoutMs, 15000) });
    await tree
      .locator(`css=.x-tree-node-text:has-text("${label}")`)
      .first()
      .waitFor({ state: "visible", timeout: timeoutMs });
  } catch {
    await page
      .locator(`css=.x-tree-node-text:has-text("${label}")`)
      .first()
      .waitFor({ state: "visible", timeout: timeoutMs });
  }
}

function splitUserAndRealm(username) {
  const match = String(username || "").match(/^(?<user>[^@]+)@(?<realm>[^@]+)$/);
  if (match?.groups?.user && match?.groups?.realm) return match.groups;
  return { user: String(username || ""), realm: "" };
}

async function ensureDemoVm({
  page,
  baseUrl,
  ticket,
  imagesRoot,
  replacements,
  preferredVmid = "100",
  demoName = "vm-ubuntu01"
}) {
  const resources = await apiGet({ baseUrl, ticket, path: "/cluster/resources?type=vm" });
  const preferredResource = Array.isArray(resources)
    ? resources.find((r) => String(r?.vmid ?? "") === String(preferredVmid))
    : null;
  const usedVmids = new Set(
    Array.isArray(resources) ? resources.map((r) => String(r?.vmid ?? "")).filter(Boolean) : []
  );

  let vmid = String(preferredVmid || "100");
  if (usedVmids.has(vmid) && String(preferredResource?.name || "") !== String(demoName || "")) {
    // Pick the next free ID to avoid modifying an unknown existing VM.
    const start = Number(vmid);
    for (let i = 0; i < 100; i++) {
      const candidate = String(start + i + 1);
      if (!usedVmids.has(candidate)) {
        vmid = candidate;
        break;
      }
    }
  }

  const findVmResource = (rows) => {
    if (!Array.isArray(rows)) return null;
    return rows.find((r) => String(r?.vmid ?? "") === String(vmid));
  };

  const pollVmResource = async (timeoutMs = 60000) => {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
      const rows = await apiGet({ baseUrl, ticket, path: "/cluster/resources?type=vm" });
      const found = findVmResource(rows);
      if (found) return found;
      await new Promise((r) => setTimeout(r, 2500));
    }
    return null;
  };

  if (!usedVmids.has(vmid)) {
    const debugPrefix = path.join(imagesRoot, "_debug", "demo-vm");

    try {
      await gotoDatacenter(page);
      await safeClick(page, [
        'css=.x-btn-inner:has-text("Create VM")',
        'css=.x-btn:has-text("Create VM")',
        "text=Create VM"
      ]);

      const wizard = page
        .locator("css=.x-window")
        .filter({ hasText: "Create" })
        .last();
      await wizard.waitFor({ state: "visible", timeout: 20000 });

      const tryFill = async (selectors, value) => {
        for (const selector of selectors) {
          try {
            const input = wizard.locator(selector).first();
            await input.waitFor({ state: "visible", timeout: 2000 });
            await input.fill(String(value));
            return true;
          } catch {
            // try next
          }
        }
        return false;
      };

      await tryFill(['input[name="vmid"]', 'input[name="vmID"]'], vmid);
      await tryFill(['input[name="name"]', 'input[name="vmname"]', 'input[name="hostname"]'], demoName);

      const clickTab = async (label) => {
        await safeClickWithin(wizard, [
          `css=.x-tab-inner:has-text("${label}")`,
          `css=.x-tab:has-text("${label}")`,
          `text=${label}`
        ]);
      };

      const selectNoMedia = async () => {
        const selectors = [
          'css=.x-form-cb-label:has-text("Do not use any media")',
          'css=.x-form-radio-label:has-text("Do not use any media")',
          "text=Do not use any media"
        ];
        for (const selector of selectors) {
          try {
            const el = wizard.locator(selector).first();
            await el.waitFor({ state: "visible", timeout: 5000 });
            await el.click({ timeout: 5000 });
            return;
          } catch {
            // try next
          }
        }
        throw new Error('Could not select "Do not use any media" on OS step.');
      };

      // Go to OS step and select "Do not use any media" to avoid ISO dependencies.
      try {
        await clickTab("OS");
      } catch {
        await safeClickWithin(wizard, ['css=.x-btn-inner:has-text("Next")', "text=Next"]);
      }
      await page.waitForTimeout(600);
      await selectNoMedia();

      // Jump to Confirm if possible (fallback to Next-based navigation).
      try {
        await clickTab("Confirm");
      } catch {
        for (let i = 0; i < 10; i++) {
          try {
            await safeClickWithin(wizard, ['css=.x-btn-inner:has-text("Next")', "text=Next"]);
          } catch {
            break;
          }
          await page.waitForTimeout(500);
          try {
            await clickTab("Confirm");
            break;
          } catch {
            // keep trying
          }
        }
      }

      await page.waitForTimeout(600);

      try {
        await safeClickWithin(wizard, [
          'css=.x-btn-inner:has-text("Finish")',
          "text=Finish",
          'css=.x-btn-inner:has-text("Create")',
          "text=Create",
          'css=.x-btn-inner:has-text("OK")',
          "text=OK"
        ]);
      } catch (error) {
        const debugPath = `${debugPrefix}-finish-click-failed.png`;
        await saveScreenshot({ page, outPath: debugPath });
        throw new Error(
          `Failed to click Finish/Create on demo VM wizard (debug: ${debugPath})\n${String(
            error?.message || error
          )}`
        );
      }

      await dismissMessageBoxes(page);
      try {
        await wizard.waitFor({ state: "hidden", timeout: 60000 });
      } catch {
        // If creation fails, keep a debug screenshot.
        const debugPath = `${debugPrefix}-create-did-not-complete.png`;
        await saveScreenshot({ page, outPath: debugPath });
        throw new Error(`Demo VM creation did not complete (debug: ${debugPath})`);
      }
    } catch (error) {
      const debugPath = `${debugPrefix}-exception.png`;
      try {
        await saveScreenshot({ page, outPath: debugPath });
      } catch {
        // ignore
      }
      // Best-effort cleanup (avoid leaving the wizard open for subsequent steps).
      try {
        await closeTopMostWindow(page);
      } catch {
        // ignore
      }
      throw error;
    }
  }

  // Resolve actual name/node (for existing VMs and newly-created ones).
  const vmResource = findVmResource(resources) || (await pollVmResource(60000));
  const actualName = String(vmResource?.name || demoName);
  const actualNode = String(vmResource?.node || "");

  // Ensure the VM is visible in the server tree for later navigation.
  await gotoDatacenter(page);
  await expandTreeSelection(page);
  if (actualNode) {
    await gotoNode(page, actualNode);
    await expandTreeSelection(page);
  }
  await waitForVmInTree(page, { vmid, timeoutMs: 60000 });

  return { vmid, name: actualName, node: actualNode };
}

async function captureCreateVmWizard({ page, imagesRoot, replacements }) {
  const outDir = path.join(imagesRoot, "part1/ch4");

  await safeClick(page, [
    'css=.x-btn-inner:has-text("Create VM")',
    'css=.x-btn:has-text("Create VM")',
    "text=Create VM"
  ]);

  const wizardTitleCandidates = ["Create: Virtual Machine", "Create VM", "Virtual Machine"];
  await waitAnyText(page, wizardTitleCandidates);

  const wizard = page
    .locator("css=.x-window")
    .filter({ hasText: "Create" })
    .last();
  try {
    await wizard.waitFor({ state: "visible", timeout: 20000 });
  } catch (error) {
    const debugPath = path.join(imagesRoot, "_debug", "create-vm-wizard-not-visible.png");
    await saveScreenshot({ page, outPath: debugPath });
    throw new Error(
      `Create VM wizard did not appear. Saved debug screenshot at ${debugPath}\n${String(
        error?.message || error
      )}`
    );
  }

  const steps = [
    { label: "General", out: "01-create-vm-wizard-general.png" },
    { label: "OS", out: "02-create-vm-wizard-os.png" },
    { label: "System", out: "03-create-vm-wizard-system.png" },
    { label: "Disks", out: "04-create-vm-wizard-disks.png" },
    { label: "CPU", out: "05-create-vm-wizard-cpu.png" },
    { label: "Memory", out: "06-create-vm-wizard-memory.png" },
    { label: "Network", out: "07-create-vm-wizard-network.png" }
  ];

  const bestEffortFillName = async () => {
    const candidates = [
      'input[name="name"]',
      'input[name="vmname"]',
      'input[name="hostname"]'
    ];
    for (const selector of candidates) {
      const input = wizard.locator(selector).first();
      try {
        await input.waitFor({ state: "visible", timeout: 500 });
        await input.fill("vm-ubuntu01");
        return;
      } catch {
        // try next
      }
    }
  };

  const bestEffortSelectNoMedia = async () => {
    const selectors = [
      'css=.x-form-cb-label:has-text("Do not use any media")',
      'css=.x-form-radio-label:has-text("Do not use any media")',
      "text=Do not use any media"
    ];
    for (const selector of selectors) {
      try {
        await wizard.locator(selector).first().click({ timeout: 800 });
        return;
      } catch {
        // try next
      }
    }
  };

  let currentIndex = 0; // assume wizard opens at "General"
  for (let targetIndex = 0; targetIndex < steps.length; targetIndex++) {
    const step = steps[targetIndex];

    // Prefer direct tab navigation (fast + avoids required-field gating).
    try {
      await safeClickWithin(wizard, [
        `css=.x-tab-inner:has-text("${step.label}")`,
        `css=.x-tab:has-text("${step.label}")`,
        `text=${step.label}`
      ]);
      currentIndex = targetIndex;
    } catch {
      // Fall back to Next-based navigation (may require filling mandatory fields).
      while (currentIndex < targetIndex) {
        const current = steps[currentIndex]?.label || "";
        if (current === "General") await bestEffortFillName();
        if (current === "OS") await bestEffortSelectNoMedia();
        await safeClickWithin(wizard, ['css=.x-btn-inner:has-text("Next")', "text=Next"]);
        currentIndex += 1;
        await page.waitForTimeout(400);
      }
    }

    await page.waitForTimeout(600);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({ page, outPath: path.join(outDir, step.out) });
  }

  // Close wizard without creating a VM.
  await safeClickWithin(wizard, [
    // Some environments show a close icon only (no Cancel button).
    "css=.x-tool-close",
    "css=.x-window-header-close",
    // Fallback: Cancel if present.
    'css=.x-btn-inner:has-text("Cancel")',
    "text=Cancel"
  ]);
  await dismissMessageBoxes(page);
  try {
    await wizard.waitFor({ state: "hidden", timeout: 15000 });
  } catch {
    // ignore
  }
}

async function closeTopMostWindow(page) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await dismissMessageBoxes(page);

    // ExtJS windows are appended late; "last" is usually top-most.
    const win = page.locator("css=.x-window").last();
    try {
      await win.waitFor({ state: "visible", timeout: 800 });
    } catch {
      return;
    }

    const clickCandidates = [
      // Prefer explicit buttons when available.
      'css=.x-btn-inner:has-text("Cancel")',
      'css=.x-btn-inner:has-text("Close")',
      'css=.x-btn-inner:has-text("OK")',
      // Fallback: close icon.
      "css=.x-tool-close",
      "css=.x-window-header-close"
    ];

    let clicked = false;
    for (const selector of clickCandidates) {
      try {
        await win.locator(selector).first().click({ timeout: 1200 });
        clicked = true;
        break;
      } catch {
        // try next
      }
    }

    if (!clicked) {
      // Last resort: ESC often closes the focused modal.
      try {
        await page.keyboard.press("Escape");
      } catch {
        // ignore
      }
    }

    await dismissMessageBoxes(page);

    try {
      await win.waitFor({ state: "hidden", timeout: 5000 });
      return;
    } catch {
      // still open; try again
    }
  }
}

async function optionalStep({ page, imagesRoot, name, fn }) {
  try {
    await fn();
  } catch (error) {
    const debugPath = path.join(imagesRoot, "_debug", `${name}.png`);
    try {
      await saveScreenshot({ page, outPath: debugPath });
    } catch {
      // ignore
    }
    // Best-effort cleanup so subsequent steps can continue (e.g., close mis-clicked modal wizards).
    try {
      await closeTopMostWindow(page);
    } catch {
      // ignore
    }
    try {
      await dismissMessageBoxes(page);
    } catch {
      // ignore
    }
    process.stderr.write(
      `WARN: skipped optional step "${name}": ${String(error?.message || error)} (debug: ${debugPath})\n`
    );
  }
}

async function loginViaUi(page, { username, password }) {
  const { user, realm } = splitUserAndRealm(username);

  // Wait for login dialog.
  await page.locator("text=Proxmox VE Login").first().waitFor({ timeout: 45000 });
  await page.locator('input[name="username"]').fill(user);
  await page.locator('input[name="password"]').fill(password);

  // Realm is a combo box; default is PAM in most labs. Only try to override when explicit.
  if (realm && realm !== "pam") {
    const realmInput = page.locator('input[name="realm"]');
    await realmInput.click();
    await realmInput.fill(realm);
    await realmInput.press("Enter");
  }

  await safeClick(page, ['css=.x-btn-inner:has-text("Login")', "text=Login"]);

  // The window should disappear on success.
  await page
    .locator("text=Proxmox VE Login")
    .first()
    .waitFor({ state: "hidden", timeout: 45000 });

  // Basic UI landmarks.
  await waitAnyText(page, ["Datacenter", "Server View", "Search"]);

  // Dismiss post-login warnings (e.g., subscription notice) that block clicks.
  await dismissMessageBoxes(page);
}

async function ensureWorkspaceReady({ page, imagesRoot, label = "Summary" }) {
  const readyLocator = page
    .locator(`css=.x-treelist-item-text:has-text("${label}")`)
    .first();
  try {
    await readyLocator.waitFor({ state: "visible", timeout: 45000 });
  } catch (error) {
    const debugPath = path.join(imagesRoot, "_debug", "workspace-not-ready.png");
    await saveScreenshot({ page, outPath: debugPath });
    throw new Error(
      `Workspace not ready (missing treelist item: ${label}). Saved debug screenshot at ${debugPath}\n${String(
        error?.message || error
      )}`
    );
  }
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    usage();
    process.exit(0);
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright-core"));
  } catch (error) {
    process.stderr.write(
      "ERROR: playwright-core is not installed. Run:\n\n    npm --prefix tools/pve-webui-screenshots install\n\n"
    );
    process.stderr.write(String(error?.message || error));
    process.stderr.write("\n");
    usage();
    process.exit(1);
  }

  const baseUrl = mustEnv("PVE_BASE_URL");
  const username = mustEnv("PVE_USERNAME");
  const password = await resolvePassword();
  const insecure = process.env.PVE_INSECURE === "1";
  const otp = process.env.PVE_OTP || "";
  const captureCh4 = process.env.PVE_CAPTURE_CH4 === "1";
  const captureExtended = process.env.PVE_CAPTURE_EXTENDED === "1";
  const captureVmAssets = process.env.PVE_CAPTURE_VM_ASSETS === "1";
  let preferredDemoVmid = process.env.PVE_DEMO_VMID || "100";
  const demoVmName = process.env.PVE_DEMO_VM_NAME || "vm-ubuntu01";

  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    process.stderr.write(
      "WARNING: PVE_INSECURE=1 set; TLS verification disabled (lab only).\n"
    );
  }

  const root = repoRoot();
  const imagesRoot = path.join(root, "images");

  const chromePath = resolveChromePath();
  const auth = await getTicket({ baseUrl, username, password, otp });
  const ticket = auth.ticket;
  const csrf = auth.csrf;

  // Defensive cleanup: previous runs may have left multiple demo VMs behind.
  // If multiple VMs share the same demo name, prefer reusing the highest VMID to avoid ambiguity in UI selection.
  if (captureVmAssets && !process.env.PVE_DEMO_VMID) {
    try {
      const existingResources = await apiGet({
        baseUrl,
        ticket,
        path: "/cluster/resources?type=vm"
      });
      const sameNameVmids = Array.isArray(existingResources)
        ? existingResources
            .filter((r) => String(r?.name || "") === String(demoVmName || ""))
            .map((r) => Number(r?.vmid))
            .filter((n) => Number.isFinite(n))
            .sort((a, b) => b - a)
        : [];
      if (sameNameVmids.length >= 2) {
        const chosen = String(sameNameVmids[0]);
        preferredDemoVmid = chosen;
        process.stderr.write(
          `WARN: multiple demo VMs named "${demoVmName}" exist; auto-selecting VMID ${chosen}. Consider setting PVE_DEMO_VMID explicitly.\n`
        );
      }
    } catch {
      // ignore
    }
  }
  const nodes = await apiGet({ baseUrl, ticket, path: "/nodes" });
  const firstNode = Array.isArray(nodes) && nodes.length > 0 ? nodes[0].node : "";
  const replacements = buildTextReplacements({ baseUrl, firstNode });

  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ["--no-sandbox"]
  });

  try {
    const context = await browser.newContext({
      ignoreHTTPSErrors: true,
      viewport: { width: 1440, height: 900 }
    });

    const page = await context.newPage();

    // 1) Login page (before auth)
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await waitAnyText(page, ["Login", "Username", "Realm"]);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part1/ch3/10-webui-first-login.png")
    });

    // 2) Login via UI (avoids fragile cookie-only auth differences across environments)
    await loginViaUi(page, { username, password });
    await waitAnyText(page, ["Datacenter", "Search", "Server View"]);

    // Ensure the workspace is fully rendered (the left treelist shows up after initial load).
    await gotoDatacenter(page);
    await ensureWorkspaceReady({ page, imagesRoot, label: "Summary" });

    // Chapter 3: dashboard (node summary)
    await gotoNode(page, firstNode);
    await ensureWorkspaceReady({ page, imagesRoot, label: "Summary" });
    await gotoSection(page, "Summary");
    await waitAnyText(page, ["CPU usage", "Memory usage", "Rootfs"]);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part1/ch3/11-webui-dashboard-node-summary.png")
    });

    if (captureCh4) {
      await captureCreateVmWizard({ page, imagesRoot, replacements });
    }

    // 3) Datacenter -> Storage list (Chapter 5)
    await gotoDatacenter(page);
    await page.waitForTimeout(1500);
    try {
      await gotoSection(page, "Storage");
    } catch (error) {
      const debugPath = path.join(imagesRoot, "_debug", "datacenter-before-storage-click.png");
      await saveScreenshot({ page, outPath: debugPath });
      throw new Error(
        `Failed to open Datacenter -> Storage. Saved debug screenshot at ${debugPath}\n${String(
          error?.message || error
        )}`
      );
    }
    await waitAnyText(page, ["Storage", "Content"]);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part2/ch5/01-datacenter-storage-list.png")
    });

    // 4) Node -> Network list (Chapter 6)
    await gotoNode(page, firstNode);
    await page.waitForTimeout(1500);
    await gotoSection(page, "Network");
    await waitAnyText(page, ["Network", "Interface", "Bridge"]);
    // Wait for grid rows to populate so redaction catches interface names / CIDR values.
    await page.locator("css=.x-grid-item").first().waitFor({ timeout: 30000 });
    await page.waitForTimeout(1000);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part2/ch6/01-node-network-list.png")
    });

    if (captureExtended) {
      // Chapter 5: Node -> Disks -> LVM-Thin (safe read-only view)
      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch5-lvmthin",
        fn: async () => {
          await gotoNode(page, firstNode);
          await page.waitForTimeout(1200);
          try {
            await gotoSection(page, "Disks");
          } catch {
            // ignore; some layouts show Disks as a group only
          }
          await gotoSection(page, "LVM-Thin");
          await waitAnyText(page, ["LVM-Thin", "thinpool", "LV Name"]);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part2/ch5/02-node-local-lvm-lvmthin.png")
          });
        }
      });

      // Chapter 6: vmbr0 settings dialog (safe; do not apply)
      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch6-vmbr0-edit",
        fn: async () => {
          await gotoNode(page, firstNode);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Network");
          await page.locator("css=.x-grid-item").first().waitFor({ timeout: 30000 });
          await safeClick(page, [
            'css=.x-grid-item:has-text("vmbr0")',
            'css=.x-grid-cell:has-text("vmbr0")'
          ]);
          await safeClick(page, ['css=.x-btn-inner:has-text("Edit")', "text=Edit"]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part2/ch6/02-vmbr0-settings.png")
          });
          await closeTopMostWindow(page);
        }
      });

      // Chapter 6: bond/vlan dialogs (safe; do not apply)
      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch6-bond-dialog",
        fn: async () => {
          // Guard against leftover modal dialogs from previous steps.
          await closeTopMostWindow(page);
          await gotoNode(page, firstNode);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Network");
          await page.locator("css=.x-grid-item").first().waitFor({ timeout: 30000 });
          // Use exact match to avoid clicking "Create VM" in the global header.
          await safeClick(page, ['text="Create"', 'css=.x-btn-inner:text-is("Create")']);
          await safeClick(page, [
            'css=.x-menu-item-text:text-is("Linux Bond")',
            'css=.x-menu-item-text:text-is("Bond")',
            'css=.x-menu-item-text:has-text("Linux Bond")',
            'css=.x-menu-item-text:has-text("Bond")'
          ]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part2/ch6/03-bond-settings.png")
          });
          await closeTopMostWindow(page);
        }
      });

      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch6-vlan-dialog",
        fn: async () => {
          // Guard against leftover modal dialogs from previous steps.
          await closeTopMostWindow(page);
          await gotoNode(page, firstNode);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Network");
          await page.locator("css=.x-grid-item").first().waitFor({ timeout: 30000 });
          // Use exact match to avoid clicking "Create VM" in the global header.
          await safeClick(page, ['text="Create"', 'css=.x-btn-inner:text-is("Create")']);
          await safeClick(page, [
            'css=.x-menu-item-text:text-is("Linux VLAN")',
            'css=.x-menu-item-text:text-is("VLAN")',
            'css=.x-menu-item-text:has-text("Linux VLAN")',
            'css=.x-menu-item-text:has-text("VLAN")'
          ]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part2/ch6/04-vlan-subif-settings.png")
          });
          await closeTopMostWindow(page);
        }
      });

      // Chapter 7: Datacenter -> Cluster (empty / no cluster defined)
      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch7-cluster-empty",
        fn: async () => {
          await gotoDatacenter(page);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Cluster");
          await waitAnyText(page, ["Cluster", "Create Cluster", "no cluster"]);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch7/01-datacenter-cluster-empty.png")
          });
        }
      });

      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch7-create-cluster-wizard",
        fn: async () => {
          await gotoDatacenter(page);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Cluster");
          await safeClick(page, ['css=.x-btn-inner:has-text("Create Cluster")', "text=Create Cluster"]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch7/02-create-cluster-wizard.png")
          });
          await closeTopMostWindow(page);
        }
      });

      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch7-join-cluster-wizard",
        fn: async () => {
          await gotoDatacenter(page);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Cluster");
          await safeClick(page, ['css=.x-btn-inner:has-text("Join Cluster")', "text=Join Cluster"]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch7/03-join-cluster-wizard.png")
          });
          await closeTopMostWindow(page);
        }
      });

      // Chapter 8: Datacenter -> Backup jobs list + create wizard
      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch8-backup-jobs",
        fn: async () => {
          await gotoDatacenter(page);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Backup");
          await waitAnyText(page, ["Backup", "Backup Jobs", "Job"]);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch8/01-datacenter-backup-jobs.png")
          });
        }
      });

      await optionalStep({
        page,
        imagesRoot,
        name: "extended-ch8-create-backup-job-wizard",
        fn: async () => {
          await gotoDatacenter(page);
          await page.waitForTimeout(1200);
          await gotoSection(page, "Backup");
          await safeClick(page, ['css=.x-btn-inner:has-text("Add")', "text=Add"]);
          await waitAnyText(page, ["Create", "Backup Job"]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch8/02-create-backup-job-wizard.png")
          });
          await closeTopMostWindow(page);
        }
      });
    }

    if (captureVmAssets) {
      const demoVm = await ensureDemoVm({
        page,
        baseUrl,
        ticket,
        imagesRoot,
        replacements,
        preferredVmid: preferredDemoVmid,
        demoName: demoVmName
      });

      // Chapter 4: VM console (with the Summary tab visible in the UI)
      await optionalStep({
        page,
        imagesRoot,
        name: "vm-ch4-summary-and-console",
        fn: async () => {
          if (demoVm.node) {
            await gotoNode(page, demoVm.node);
            await expandTreeSelection(page);
          }
          await gotoVm(page, demoVm);
          await ensureWorkspaceReady({ page, imagesRoot, label: "Summary" });
          // Start the VM so the console shows something (even a boot error is enough for UI illustration).
          try {
            await safeClick(page, ['css=.x-btn-inner:text-is("Start")', 'text="Start"']);
          } catch {
            // ignore (may already be running)
          }
          await page.waitForTimeout(1200);
          await gotoSection(page, "Console");
          await page.waitForTimeout(1500);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part1/ch4/08-vm-summary-and-console.png")
          });
        }
      });

      // Chapter 4: snapshots (dialog + list)
      await optionalStep({
        page,
        imagesRoot,
        name: "vm-ch4-snapshot-dialog",
        fn: async () => {
          if (demoVm.node) {
            await gotoNode(page, demoVm.node);
            await expandTreeSelection(page);
          }
          await gotoVm(page, demoVm);
          await ensureWorkspaceReady({ page, imagesRoot, label: "Summary" });
          await gotoSection(page, "Snapshots");
          await page.waitForTimeout(1200);
          await safeClick(page, ['css=.x-btn-inner:has-text("Take Snapshot")', "text=Take Snapshot"]);
          await page.waitForTimeout(800);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part1/ch4/09-snapshot-dialog-and-list.png")
          });
          await closeTopMostWindow(page);
        }
      });

      // Chapter 6: VM NIC VLAN ID (hardware dialog)
      await optionalStep({
        page,
        imagesRoot,
        name: "vm-ch6-vlan-tag",
        fn: async () => {
          if (demoVm.node) {
            await gotoNode(page, demoVm.node);
            await expandTreeSelection(page);
          }
          await gotoVm(page, demoVm);
          await ensureWorkspaceReady({ page, imagesRoot, label: "Summary" });
          await gotoSection(page, "Hardware");
          await page.locator("css=.x-grid-item").first().waitFor({ timeout: 30000 });
          await safeClick(page, ['css=.x-grid-item:has-text("net0")', 'css=.x-grid-cell:has-text("net0")']);
          await safeClick(page, ['css=.x-btn-inner:text-is("Edit")', 'text="Edit"']);
          const win = page.locator("css=.x-window").last();
          await win.waitFor({ state: "visible", timeout: 20000 });
          // Best-effort: fill VLAN tag field (do not save).
          for (const selector of ['input[name="tag"]', 'input[name="vlan"]', 'input[name="vlan_tag"]']) {
            try {
              const input = win.locator(selector).first();
              await input.waitFor({ state: "visible", timeout: 800 });
              await input.fill("20");
              break;
            } catch {
              // try next
            }
          }
          await page.waitForTimeout(500);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part2/ch6/05-vm-nic-vlan-id.png")
          });
          await closeTopMostWindow(page);
        }
      });

      // Chapter 8: run a manual backup via API, then capture task history and restore dialog.
      await optionalStep({
        page,
        imagesRoot,
        name: "vm-ch8-manual-backup-and-restore",
        fn: async () => {
          const upid = await apiPostForm({
            baseUrl,
            ticket,
            csrf,
            path: `/nodes/${encodeURIComponent(firstNode)}/vzdump`,
            params: {
              vmid: demoVm.vmid,
              storage: "local",
              // Use snapshot mode so the backup does not depend on guest OS shutdown.
              mode: "snapshot",
              compress: "zstd"
            }
          });

          await waitForTaskDone({ baseUrl, ticket, node: firstNode, upid, timeoutMs: 10 * 60 * 1000 });

          // Capture task history with a backup task visible.
          await gotoDatacenter(page);
          await page.waitForTimeout(1500);
          await gotoSection(page, "Summary");
          await waitAnyText(page, ["Search:", "Type"]);
          try {
            await safeClick(page, ['css=.x-tab-inner:has-text("Tasks")', "text=Tasks"]);
          } catch {
            // ignore
          }
          await page.waitForTimeout(1200);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch8/03-manual-backup-task-log.png")
          });

          // Open restore dialog from the storage's backup list.
          await gotoNode(page, firstNode);
          await expandTreeSelection(page);
          // Select storage "local" in the server tree.
          await safeClick(page, [
            'css=.x-tree-node-text:text-is("local")',
            'css=.x-tree-node-text:has-text("local (")',
            'css=.x-tree-node-text:has-text("local")'
          ]);
          await page.waitForTimeout(1200);

          // PVE 9.x exposes "Backups" as a section for storages. Prefer it; fall back to older "Content" tab if present.
          try {
            await gotoSection(page, "Backups");
          } catch {
            try {
              await safeClick(page, ['css=.x-tab-inner:has-text("Backups")', "text=Backups"]);
            } catch {
              await safeClick(page, ['css=.x-tab-inner:has-text("Content")', "text=Content"]);
            }
          }
          await page.locator("css=.x-grid-item").first().waitFor({ timeout: 30000 });
          // Select the newest vzdump backup row (if present).
          await safeClick(page, [
            `css=.x-grid-item:has-text("vzdump-qemu-${demoVm.vmid}")`,
            'css=.x-grid-item:has-text("vzdump-qemu-")'
          ]);
          await safeClick(page, ['css=.x-btn-inner:has-text("Restore")', "text=Restore"]);
          await page.waitForTimeout(900);
          await redactForScreenshot(page, replacements);
          await saveScreenshot({
            page,
            outPath: path.join(imagesRoot, "part3/ch8/04-restore-dialog.png")
          });
          await closeTopMostWindow(page);
        }
      });
    }

    // 5) Node dashboard graphs (Chapter 9)
    await gotoNode(page, firstNode);
    await page.waitForTimeout(1500);
    await gotoSection(page, "Summary");
    await waitAnyText(page, ["CPU usage", "Memory usage", "Rootfs"]);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part4/ch9/03-node-dashboard-resource-graphs.png")
    });

    // 6) Node syslog (Chapter 9)
    await gotoNode(page, firstNode);
    await page.waitForTimeout(1500);
    // Label is "System Log" in current UI, but keep "Syslog" as a fallback.
    try {
      await gotoSection(page, "System Log");
    } catch {
      await gotoSection(page, "Syslog");
    }
    await waitAnyText(page, ["System Log", "Syslog"]);
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part4/ch9/01-node-syslog.png")
    });

    // 7) Datacenter task history (Chapter 9)
    await gotoDatacenter(page);
    await page.waitForTimeout(1500);
    await gotoSection(page, "Summary");
    await waitAnyText(page, ["Search:", "Type"]);
    // Ensure the bottom "Tasks" tab is selected.
    try {
      await safeClick(page, ['css=.x-tab-inner:has-text("Tasks")', "text=Tasks"]);
    } catch {
      // ignore; it is often selected by default
    }
    await redactForScreenshot(page, replacements);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part4/ch9/02-task-history.png")
    });

    process.stdout.write(
      "Done: saved login/dashboard + storage/network + ops screenshots.\n"
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  process.stderr.write(String(error?.stack || error));
  process.stderr.write("\n");
  usage();
  process.exit(1);
});
