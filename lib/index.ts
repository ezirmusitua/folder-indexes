import * as fs from "fs/promises";
import { FileItem } from "./FileItem";
import { listFiles, saveIndex } from "./fs";
import { eFileType, iFileItem } from "./interface";

export async function buildIndexesIteratively(
  parent: string,
  dir: string,
  max = 99
) {
  let candidates: Array<string[]> = [[parent, dir]];
  async function process_depth(candidate: string[]) {
    const item = await FileItem.create(candidate[0], candidate[1]);
    if (item.type == eFileType.DIRECTORY) {
      const files = await listFiles(item); // ignore hidden files
      item.children = await Promise.all(
        files.map((file) => FileItem.create(item.path, file))
      );
      await saveIndex(item);
      const new_candidates = item.children
        .filter((i: iFileItem) => i.type == eFileType.DIRECTORY)
        .map((i: iFileItem) => [i.parent, i.name]);
      return new_candidates;
    }
    return [];
  }
  for await (const depth of Array.from({ length: max }).map((_, i) => i)) {
    console.log("[INFO] BFS depth ", depth);
    let next_depth_candidate = [];
    for await (const candidate of candidates) {
      const new_candidates = await process_depth(candidate);
      next_depth_candidate = next_depth_candidate.concat(new_candidates);
    }
    if (next_depth_candidate.length == 0) break;
    candidates = next_depth_candidate;
  }
}

export async function buildIndexesRecursively(parent: string, dir: string) {
  const item = await FileItem.create(parent, dir);
  if (!item) return null;
  if (item.type == eFileType.DIRECTORY) {
    let inside_directory = await fs.readdir(item.path);
    inside_directory = inside_directory
      .sort((p, n) => p.localeCompare(n))
      .filter((n) => !n.startsWith(".")); // ignore hidden files
    const children: FileItem[] = [];
    for await (const file of inside_directory) {
      const child = await buildIndexesRecursively(item.path, file);
      if (child) {
        children.push(child);
      }
    }
    item.children = children;
    await saveIndex(item);
  }

  return item;
}
