
class Color {
  #name = "noname";
  #red = 0;
  #green = 0;
  #blue = 0;
  #alpha = 0;

  constructor(...args) {
    const parsed = Color.#parseInput(args);
    if (parsed.name !== undefined)
      this.#name = parsed.name;
    if (parsed.r !== undefined) {
      this.#red = parsed.r;
      this.#green = parsed.g;
      this.#blue = parsed.b;
    }
    if (parsed.a !== undefined)
      this.#alpha = parsed.a;
  }

  get colorName() { return this.#name; }
  get red() { return this.#red; }
  get green() { return this.#green; }
  get blue() { return this.#blue; }
  get alpha() { return this.#alpha; }
  get opacity() { return this.#alpha / 255; }
  get rgb() { return [this.red, this.green, this.blue]; }
  get rgba() { return [this.red, this.green, this.blue, this.opacity]; }
  get hexRgb() { return ColorHelper.channels2hex(this.rgb); }
  get hexRgba() { return ColorHelper.channels2hex([this.red, this.green, this.blue, this.alpha]); }

  toString() {
    return `R:${this.#red} G:${this.#green} B:${this.#blue} A:${this.#alpha} | Name:${this.#name}`;
  }

  static #parseInput(args) {
    const isHex = v => typeof v === "string" && ColorHelper.isHexColor(v);
    const isName = v => typeof v === "string" && !isHex(v);
    const isChannels = v => Array.isArray(v) && (v.length === 3 || v.length === 4);

    let name;
    let r, g, b, a;
    for (const arg of args) {
      if (isName(arg)) name = arg;
      else if (isHex(arg)) {
        const ch = ColorHelper.hex2rgba(arg);
        [r,g,b] = ch;
        a = ch[3] * 255;
      }
      else if (isChannels(arg)) {
        [r,g,b] = arg;
        a = arg.length === 4 ? arg[3] : 255;
      }
      else if (typeof arg === "number") {
        if (r === undefined) r = arg;
        else if (g === undefined) g = arg;
        else if (b === undefined) b = arg;
        else if (a === undefined) a = arg;
      }
    }
    return {name,r,g,b,a};
  }
}
