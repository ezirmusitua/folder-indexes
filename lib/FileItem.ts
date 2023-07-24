import * as fs from "fs/promises";
import * as mime from "mime-types";
import * as path from "path";
import { eFileType, iFileItem } from "./interface";
import { IdAllocator } from "./utilities";

export class FileItem implements iFileItem {
  id: string;
  name: string;
  parent: string;
  path: string;
  type: eFileType;
  mime: string;
  children: iFileItem[] = [];

  static async create(parent: string, filename: string) {
    const filepath = path.join(parent, filename);
    try {
      const file_item = new FileItem();
      const stat = await fs.stat(filepath);
      file_item.id = new IdAllocator().get();
      file_item.name = path.basename(filepath);
      file_item.parent = parent;
      file_item.path = path.join(parent, path.basename(filepath));
      file_item.type = stat.isDirectory()
        ? eFileType.DIRECTORY
        : eFileType.FILE;
      file_item.mime = mime.lookup(filepath) || "";
      return file_item;
    } catch (e) {
      console.log("[ERROR] build file item failed ", e);
      return null;
    }
  }
}
