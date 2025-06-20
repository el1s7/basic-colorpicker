export function isValidRgbOrRgba(str) {
  const modernRegex = /^rgb\(\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s*\/\s*(0|1|0?\.\d+|\d{1,3}%))?\s*\)$/;
  const legacyRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(0|1|0?\.\d+))?\s*\)$/;

  let match;

  if ((match = str.match(modernRegex))) {
    const [ , r, g, b, a ] = match;
    if ([r, g, b].some(n => +n < 0 || +n > 255)) return false;
    if (a !== undefined) {
      if (a.endsWith('%')) {
        const percent = parseFloat(a);
        return percent >= 0 && percent <= 100;
      } else {
        const alpha = parseFloat(a);
        return alpha >= 0 && alpha <= 1;
      }
    }
    return true;
  }

  if ((match = str.match(legacyRegex))) {
    const [ , r, g, b, a ] = match;
    if ([r, g, b].some(n => +n < 0 || +n > 255)) return false;
    if (a !== undefined) {
      const alpha = parseFloat(a);
      return alpha >= 0 && alpha <= 1;
    }
    return true;
  }

  return false;
}