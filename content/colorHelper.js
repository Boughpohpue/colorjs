class ColorHelper {
  static isHexColor(s) {
    return s.match(/^#?([A-F0-9]{3,4}|[A-F0-9]{6}|[A-F0-9]{8})$/i) !== null;
  }
  static isValidChannelValue(n) {
    return typeof(n) === "number" && n >= 0 && n <= 255;
  }
  static isAlphaValue(n) {
    return typeof(n) === "number" && n >= 0.0 && n <= 1.0;
  }
	static channels2hex(channels) {
		if (!channels || !Array.isArray(channels)
		|| channels.length < 3 || channels.length > 4)
			throw new Error("Invalid argument format!");
		return `#${channels.map((ch) => ColorHelper.#dec2hex(ch)).join("")}`;
	}
	static rgb2hex(r, g, b) {
		return ColorHelper.channels2hex([r, g, b]);
	}
	static rgba2hex(r, g, b, a) {
		return ColorHelper.channels2hex([r, g, b, a * 255]);
	}
  static hex2rgb(hex) {
		return ColorHelper.hex2rgba(hex).slice(0, 3);
	}
	static hex2rgba(hex) {
    if (!ColorHelper.isHexColor(hex)) throw new Error("Provided parameter has invalid format!");
		hex = ColorHelper.normalizeHex(hex).substring(1);
		let channels = [];
		for (var x = 0; x <= hex.length - 1; x += 2)
			channels.push(parseInt(hex.substring(x, x + 2), 16));
    channels[3] = channels[3] / 255;
		return channels;
	}
	static calculateColorTransitRgb(hexFrom, hexTo, transit) {
		const rgbFrom = ColorHelper.hex2rgb(hexFrom);
		const rgbTo = ColorHelper.hex2rgb(hexTo);
		const channels = [];
		channels.push(ColorHelper.calculateChannelTransit(rgbFrom[0], rgbTo[0], transit));
		channels.push(ColorHelper.calculateChannelTransit(rgbFrom[1], rgbTo[1], transit));
		channels.push(ColorHelper.calculateChannelTransit(rgbFrom[2], rgbTo[2], transit));
		return chanels;
	}
	static calculateColorTransitRgba(hexFrom, hexTo, percent) {
		const rgbaFrom = ColorHelper.hex2rgba(hexFrom);
		const rgbaTo = ColorHelper.hex2rgba(hexTo);
		const channels = [];
		channels.push(ColorHelper.calculateChannelTransit(rgbaFrom[0], rgbaTo[0], transit));
		channels.push(ColorHelper.calculateChannelTransit(rgbaFrom[1], rgbaTo[1], transit));
		channels.push(ColorHelper.calculateChannelTransit(rgbaFrom[2], rgbaTo[2], transit));
		channels.push(ColorHelper.calculateChannelTransit(rgbaFrom[3], rgbaTo[3], transit));
		return channels;
	}
	static calculateRgbTransitHex(hexFrom, hexTo, transit) {
		return ColorHelper.channels2hex(calculateColorTransitRgb(hexFrom, hexTo, transit));
	}
	static calculateRgbaTransitHex(hexFrom, hexTo, percent) {
		return ColorHelper.channels2hex(calculateColorTransitRgba(hexFrom, hexTo, transit));
	}
	static calculateChannelTransit(channelFrom, channelTo, transit) {
		channelFrom = ColorHelper.#validateChannelValue(channelFrom);
		channelTo = ColorHelper.#validateChannelValue(channelTo);
		return channelFrom < channelTo
			? channelFrom + Math.round(Math.floor((channelTo - channelFrom) * transit))
			: channelFrom - Math.round(Math.floor((channelFrom - channelTo) * transit));
	}
  static getContrastColor(hex) {
    [r,g,b] = ColorHelper.hex2rgb(hex);
    const luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    return luminance > 140 ? "#000000" : "#FFFFFF";
  }
  static invertHsl(h, s, l) {
    return [(h + 180) % 360, s, 1 - l];
  }
  static rgb2hsl(r, g, b) {
    const max = Math.max(r,g,b);
    const min = Math.min(r,g,b);
    let h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r: h=(g-b)/d+(g<b?6:0); break;
        case g: h=(b-r)/d+2; break;
        case b: h=(r-g)/d+4; break;
      }
      h/=6;
    }
    return [h*360, s, l];
  }

  static hsl2rgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60)       [r,g,b] = [c,x,0];
    else if (h < 120) [r,g,b] = [x,c,0];
    else if (h < 180) [r,g,b] = [0,c,x];
    else if (h < 240) [r,g,b] = [0,x,c];
    else if (h < 300) [r,g,b] = [x,0,c];
    else              [r,g,b] = [c,0,x];
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  }
  static hsl2rgb2(h, s, l) {
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4))
    ];
  }
  static normalizeHex(hex) {
    hex = hex.startsWith('#') ? hex.substring(1) : hex;
    if (hex.length === 3 || hex.length === 4)
      hex = hex.split("").map((h) => `${h}${h}`).join("");
    if (hex.length === 6)
      hex = `${hex}ff`;
    return `#${hex}`;
  }
	static #dec2hex(dec) {
		return dec.toString(16).padStart(2, "0");
	}
	static #hex2dec(hex) {
		return parseInt(hex, 16);
	}
  static #validateChannelValue(val) {
    return Math.max(Math.min(val, 255), 0);
  }
}
