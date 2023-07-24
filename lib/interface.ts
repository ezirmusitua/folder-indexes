export enum eFileType {
  FILE = "file",
  DIRECTORY = "directory",
}

export interface iFIndex {
  path: string;
  children: iFIndex[];
}

export interface iFileItem extends iFIndex {
  id: string;
  name: string;
  parent: string;
  type: eFileType;
  mime: string;
  children: iFileItem[];
}
