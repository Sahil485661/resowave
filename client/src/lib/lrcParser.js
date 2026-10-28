/**
 * Parses standard LRC (LyRiCs) formatted text into sorted timestamped lines.
 * Supported format: [mm:ss.xx] or [mm:ss.xxx] Lyric text
 * @param {string} lrcString
 * @returns {Array<{ time: number, text: string }>}
 */
export function parseLrc(lrcString) {
  if (!lrcString || typeof lrcString !== 'string') return [];

  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g;
  const lines = lrcString.split(/\r?\n/);
  const result = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let match;
    let text = trimmed.replace(timeRegex, '').trim();

    // Reset regex cursor for match loop
    timeRegex.lastIndex = 0;
    while ((match = timeRegex.exec(trimmed)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = match[3]
        ? parseInt(match[3].padEnd(3, '0'), 10)
        : 0;

      const totalSeconds = minutes * 60 + seconds + milliseconds / 1000;
      if (text) {
        result.push({ time: totalSeconds, text });
      }
    }
  }

  return result.sort((a, b) => a.time - b.time);
}
