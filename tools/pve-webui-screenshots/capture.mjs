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

Optional env:
  PVE_INSECURE=1 allow self-signed cert (lab only)
`;
  process.stderr.write(msg.trimStart());
  process.stderr.write("\n");
}

function mustEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
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

async function safeClick(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      await locator.waitFor({ state: "visible", timeout: 1500 });
      await locator.click({ timeout: 1500 });
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
  const password = mustEnv("PVE_PASSWORD");
  const insecure = process.env.PVE_INSECURE === "1";
  const otp = process.env.PVE_OTP || "";

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

    // 1) Login page (no auth)
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await waitAnyText(page, ["Login", "Username", "Realm"]);
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part1/ch3/10-webui-first-login.png")
    });

    // 2) Dashboard (auth via ticket cookie)
    await context.addCookies([{ name: "PVEAuthCookie", value: ticket, url: baseUrl }]);
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await waitAnyText(page, ["Datacenter", "Search", "Server View"]);

    if (firstNode) {
      await safeClick(page, [
        `text=${firstNode}`,
        `css=.x-tree-node-text:has-text("${firstNode}")`,
        `css=.x-tree-node-anchor:has-text("${firstNode}")`
      ]);
    }
    await saveScreenshot({
      page,
      outPath: path.join(imagesRoot, "part1/ch3/11-webui-dashboard-node-summary.png")
    });

    process.stdout.write("Done (partial): saved login + dashboard screenshots.\n");
    process.stdout.write(
      "Next: extend selectors/flows for wizard/network/backup/cluster screenshots as needed.\n"
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
