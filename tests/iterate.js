const path = require("path");
const { buildIndexesIteratively } = require("../dist");

async function test() {
  console.time("TestIteratively");
  const parent = path.join(process.cwd(), ".artifacts");
  await buildIndexesIteratively(parent, "sample");
  console.timeEnd("TestIteratively");
}

test();
