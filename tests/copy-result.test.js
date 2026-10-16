const assert = require("node:assert/strict");
const fs = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const html = fs.readFileSync("index.html", "utf8");

function loadFunction(name, globals = {}) {
  const match = html.match(new RegExp(`^function ${name}\\([\\s\\S]*?^\\}`, "m"))
    || html.match(new RegExp(`^async function ${name}\\([\\s\\S]*?^\\}`, "m"));
  assert.ok(match, `Expected ${name} to be defined in index.html`);
  return vm.runInNewContext(`${match[0]}; ${name}`, globals);
}

test("formats the quiz name, completed score, and result title", () => {
  const formatResult = loadFunction("formatResult");
  assert.equal(
    formatResult(8, 10, "Stellar work!"),
    "Space Exploration Quiz\nScore: 8 / 10\nResult: Stellar work!"
  );
});

test("reports successful clipboard writes", async () => {
  const copied = [];
  const formatResult = loadFunction("formatResult");
  const summary = formatResult(10, 10, "Perfect launch!");
  const copyResult = loadFunction("copyResult", {
    navigator: { clipboard: { writeText: async text => copied.push(text) } }
  });
  const status = { textContent: "" };
  const fallback = { hidden: false };

  await copyResult(summary, status, fallback);

  assert.deepEqual(copied, [summary]);
  assert.equal(status.textContent, "Result copied to clipboard.");
  assert.equal(fallback.hidden, true);
});

test("shows a selectable summary when clipboard access is unavailable or rejected", async t => {
  const summary = "Space Exploration Quiz\nScore: 4 / 10\nResult: Lost in space!";
  const cases = [
    ["unavailable", {}],
    ["rejected", { clipboard: { writeText: async () => { throw new Error("denied"); } } }]
  ];

  for (const [name, navigator] of cases) {
    await t.test(name, async () => {
      const copyResult = loadFunction("copyResult", { navigator });
      const status = { textContent: "" };
      const fallback = {
        hidden: true,
        focusCalled: false,
        selectCalled: false,
        focus() { this.focusCalled = true; },
        select() { this.selectCalled = true; }
      };

      await copyResult(summary, status, fallback);

      assert.match(status.textContent, /Unable to copy automatically/);
      assert.equal(fallback.value, summary);
      assert.equal(fallback.hidden, false);
      assert.equal(fallback.focusCalled, true);
      assert.equal(fallback.selectCalled, true);
    });
  }
});

test("each copy attempt uses the summary supplied for that result", async () => {
  const copied = [];
  const copyResult = loadFunction("copyResult", {
    navigator: { clipboard: { writeText: async text => copied.push(text) } }
  });
  const status = { textContent: "" };
  const fallback = { hidden: false };

  await copyResult("Score: 2 / 10\nResult: Lost in space!", status, fallback);
  await copyResult("Score: 9 / 10\nResult: Stellar work!", status, fallback);

  assert.deepEqual(copied, [
    "Score: 2 / 10\nResult: Lost in space!",
    "Score: 9 / 10\nResult: Stellar work!"
  ]);
});
