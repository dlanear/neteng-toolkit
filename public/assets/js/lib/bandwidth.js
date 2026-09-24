// Bandwidth calculator: file size <-> transfer time <-> required bandwidth.
// All internal math is done in bits to avoid rounding mismatches.

const SIZE_UNITS_TO_BITS = {
  // Decimal (network/storage-marketing convention: 1 KB = 1000 bytes)
  KB: 8 * 1000,
  MB: 8 * 1000 ** 2,
  GB: 8 * 1000 ** 3,
  TB: 8 * 1000 ** 4,
};

const RATE_UNITS_TO_BPS = {
  bps: 1,
  Kbps: 1000,
  Mbps: 1000 ** 2,
  Gbps: 1000 ** 3,
};

export function sizeToBits(size, unit) {
  const factor = SIZE_UNITS_TO_BITS[unit];
  if (!factor) throw new Error(`Unknown file size unit: ${unit}`);
  if (!(size > 0)) throw new Error('File size must be greater than 0.');
  return size * factor;
}

export function rateToBps(rate, unit) {
  const factor = RATE_UNITS_TO_BPS[unit];
  if (!factor) throw new Error(`Unknown bandwidth unit: ${unit}`);
  if (!(rate > 0)) throw new Error('Bandwidth must be greater than 0.');
  return rate * factor;
}

export function calculateTransferTime(size, sizeUnit, rate, rateUnit) {
  const bits = sizeToBits(size, sizeUnit);
  const bps = rateToBps(rate, rateUnit);
  const seconds = bits / bps;
  return {
    seconds,
    bits,
    bytes: bits / 8,
    bps,
    humanTime: formatDuration(seconds),
  };
}

// Reverse mode: given file size + desired transfer time (seconds), find required bandwidth.
export function calculateRequiredBandwidth(size, sizeUnit, seconds) {
  if (!(seconds > 0)) throw new Error('Transfer time must be greater than 0.');
  const bits = sizeToBits(size, sizeUnit);
  const bps = bits / seconds;
  return {
    bps,
    kbps: bps / 1000,
    mbps: bps / 1000 ** 2,
    gbps: bps / 1000 ** 3,
  };
}

export function formatDuration(totalSeconds) {
  if (!isFinite(totalSeconds)) return '—';
  if (totalSeconds < 1) return `${(totalSeconds * 1000).toFixed(0)} ms`;
  const s = Math.floor(totalSeconds % 60);
  const m = Math.floor((totalSeconds / 60) % 60);
  const h = Math.floor((totalSeconds / 3600) % 24);
  const d = Math.floor(totalSeconds / 86400);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  if (s || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}
