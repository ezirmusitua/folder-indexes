const path = require("path");
const { buildIndexesRecursively } = require("../dist");

async function test() {
  console.time("TestRecursively");
  const parent = path.join(process.cwd(), ".artifacts");
  await buildIndexesRecursively(parent, "sample");
  console.timeEnd("TestRecursively");
}

test();
