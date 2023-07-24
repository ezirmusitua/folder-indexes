export class IdAllocator {
  private _current = 0;

  static instance: IdAllocator = null as any;

  constructor() {
    if (IdAllocator.instance) return IdAllocator.instance;
    IdAllocator.instance = this;
    return this;
  }

  get() {
    this._current += 1;
    return this._current + "";
  }
}
