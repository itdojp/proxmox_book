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
  if (!ticket) throw new Error("No ticket in response from /access/ticket");
  return ticket;
}

async function apiGet({ baseUrl, ticket, path }) {
  const url = new URL(`/api2/json${path}`, baseUrl);
  const json = await fetchJson({
    url: url.toString(),
    headers: { cookie: `PVEAuthCookie=${ticket}` }
  });
  return json?.data;
}

function buildTextReplacements({ baseUrl, firstNode }) {
  let host = "";
  let hostWithPort = "";
  try {
    const u = new URL(baseUrl);
    host = u.hostname;
    hostWithPort = u.host;
  } catch {
    // ignore
  }
  const replacements = [
    // Replace “real” values with the canonical examples used in the manuscript/images README.
    [host, "192.168.10.11"],
    [hostWithPort, "192.168.10.11:8006"],
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
        .replace(/\b(enx|wlx)[0-9a-f]{12}\b/g, "$1001122334455")
        // Raw MAC addresses
        .replace(/\b([0-9a-f]{2}:){5}[0-9a-f]{2}\b/g, "00:11:22:33:44:55");
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
    ...candidates.map((n) => `text=${n}`),
    ...candidates.map((n) => `css=.x-tree-node-text:has-text("${n}")`),
    ...candidates.map((n) => `css=.x-tree-node-anchor:has-text("${n}")`)
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

function splitUserAndRealm(username) {
  const match = String(username || "").match(/^(?<user>[^@]+)@(?<realm>[^@]+)$/);
  if (match?.groups?.user && match?.groups?.realm) return match.groups;
  return { user: String(username || ""), realm: "" };
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
  try {
    await safeClickWithin(wizard, ['css=.x-btn-inner:has-text("Cancel")', "text=Cancel"]);
  } catch {
    // Some environments show a close icon only.
    await safeClickWithin(wizard, ["css=.x-tool-close", "css=.x-window-header-close"]);
  }
  await dismissMessageBoxes(page);
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

  if (insecure) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    process.stderr.write(
      "WARNING: PVE_INSECURE=1 set; TLS verification disabled (lab only).\n"
    );
  }

  const root = repoRoot();
  const imagesRoot = path.join(root, "images");

  const chromePath = resolveChromePath();
  const ticket = await getTicket({ baseUrl, username, password, otp });
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
