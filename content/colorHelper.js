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
    if (!ColorHelper.isHex(hex)) throw new Error("Provided parameter has invalid format!");
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
		channels.push(ColorHelper.calculateChannel(rgbFrom[0], rgbTo[0], transit));
		channels.push(ColorHelper.calculateChannel(rgbFrom[1], rgbTo[1], transit));
		channels.push(ColorHelper.calculateChannel(rgbFrom[2], rgbTo[2], transit));
		return chanels;
	}
	static calculateColorTransitRgba(hexFrom, hexTo, percent) {
		const rgbaFrom = ColorHelper.hex2rgba(hexFrom);
		const rgbaTo = ColorHelper.hex2rgba(hexTo);
		const channels = [];
		channels.push(ColorHelper.calculateChannel(rgbaFrom[0], rgbaTo[0], transit));
		channels.push(ColorHelper.calculateChannel(rgbaFrom[1], rgbaTo[1], transit));
		channels.push(ColorHelper.calculateChannel(rgbaFrom[2], rgbaTo[2], transit));
		channels.push(ColorHelper.calculateChannel(rgbaFrom[3], rgbaTo[3], transit));
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
