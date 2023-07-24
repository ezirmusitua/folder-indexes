import * as path from "path";
import * as fs from "fs/promises";
import { iFIndex } from "./interface";

export async function saveIndex(item: iFIndex, indexFilename = ".browse.json") {
  const withEmptyChildren = (item: iFIndex) => ({ ...item, children: [] });
  return fs.writeFile(
    path.join(item.path, indexFilename),
    JSON.stringify(
      { ...item, children: item.children.map(withEmptyChildren) },
      null,
      2
    )
  );
}

export async function listFiles(item: iFIndex) {
  let inside_directory = await fs.readdir(item.path);
  return inside_directory
    .sort((p, n) => p.localeCompare(n))
    .filter((n) => !n.startsWith("."));
}
