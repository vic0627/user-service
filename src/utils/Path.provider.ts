export default class Path {
  get #dot() {
    return ".";
  }

  get #slash() {
    return "/";
  }

  get #dbSlash() {
    return "//";
  }

  get #http() {
    return "http://";
  }

  get #https() {
    return "https://";
  }

  #dotStart(path: string, position?: number) {
    return path.startsWith(this.#dot, position);
  }

  #dotEnd(path: string, position?: number) {
    return path.endsWith(this.#dot, position);
  }

  #slashStart(path: string, position?: number) {
    return path.startsWith(this.#slash, position);
  }

  #slashEnd(path: string, position?: number) {
    return path.endsWith(this.#slash, position);
  }

  trimStart(path: string) {
    while (this.#slashStart(path) || this.#dotStart(path)) {
      path = path.slice(1);
    }

    return path;
  }

  trimEnd(path: string) {
    while (this.#slashEnd(path) || this.#dotEnd(path)) {
      path = path.slice(0, -1);
    }

    return path;
  }

  trim(path: string) {
    path = this.trimStart(path);

    return this.trimEnd(path);
  }

  /** @todo 分割路徑 */
  split(...paths: string[]) {
    return paths.map((path, idx) => {
      if (!idx) {
        const root = path.startsWith(this.#dbSlash) || path.startsWith(this.#http) || path.startsWith(this.#https);

        return this.trimEnd(path);
      }

      return this.trim(path);
    });
  }

  join(...paths: string[]) {
    paths = paths.map((path, idx) => {
      if (!idx) {
        return this.trimEnd(path);
      }

      return this.trim(path);
    });

    return paths.join(this.#slash);
  }
}
