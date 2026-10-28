/**
 * Singleton Web Audio Graph Engine
 * Manages 3-band BiquadFilter equalizer, AnalyserNode, and Crossfade GainNodes.
 */

export const EQUALIZER_PRESETS = {
  flat: { name: 'Flat', low: 0, mid: 0, high: 0 },
  bass_boost: { name: 'Bass Boost', low: 7, mid: 0, high: -2 },
  electronic: { name: 'Electronic', low: 5, mid: 1, high: 4 },
  vocal: { name: 'Vocal', low: -3, mid: 5, high: 2 },
  rock: { name: 'Rock', low: 5, mid: -1, high: 4 },
};

let audioCtx = null;
let sourceNode = null;
let lowFilter = null;
let midFilter = null;
let highFilter = null;
let analyserNode = null;
let primaryGain = null;
let activeCrossfade = null;

export function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function initWebAudio(audioElement) {
  if (!audioElement || typeof window === 'undefined') return null;
  const ctx = getAudioContext();
  if (!ctx) return null;

  try {
    if (!sourceNode) {
      sourceNode = ctx.createMediaElementSource(audioElement);

      // Low Shelf Filter (Bass - 320Hz)
      lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowshelf';
      lowFilter.frequency.value = 320;

      // Peaking Filter (Mid - 1000Hz, Q: 0.5)
      midFilter = ctx.createBiquadFilter();
      midFilter.type = 'peaking';
      midFilter.frequency.value = 1000;
      midFilter.Q.value = 0.5;

      // High Shelf Filter (Treble - 3200Hz)
      highFilter = ctx.createBiquadFilter();
      highFilter.type = 'highshelf';
      highFilter.frequency.value = 3200;

      // Analyser Node for visualizers
      analyserNode = ctx.createAnalyser();
      analyserNode.fftSize = 64;

      // Master output gain
      primaryGain = ctx.createGain();
      primaryGain.gain.value = 1;

      // Graph: Source -> Low -> Mid -> High -> Analyser -> PrimaryGain -> Destination
      sourceNode.connect(lowFilter);
      lowFilter.connect(midFilter);
      midFilter.connect(highFilter);
      highFilter.connect(analyserNode);
      analyserNode.connect(primaryGain);
      primaryGain.connect(ctx.destination);
    }
  } catch (err) {
    console.warn('Web Audio initialization bypassed:', err);
  }

  return { ctx, analyser: analyserNode };
}

/**
 * Updates 3-band Equalizer gains smoothly to prevent popping / zipper clicks
 */
export function setEqualizerGains({ low = 0, mid = 0, high = 0 }) {
  const ctx = getAudioContext();
  if (!ctx || !lowFilter || !midFilter || !highFilter) return;

  const rampTime = ctx.currentTime + 0.05;
  lowFilter.gain.linearRampToValueAtTime(low, rampTime);
  midFilter.gain.linearRampToValueAtTime(mid, rampTime);
  highFilter.gain.linearRampToValueAtTime(high, rampTime);
}

export function getAnalyser() {
  return analyserNode;
}

/**
 * Smoothly crossfades between an outgoing track and the incoming track.
 * Detaches and cleans up outgoing elements as soon as gain reaches 0.
 */
export function executeCrossfade({ outgoingUrl, outgoingTime, duration = 2 }) {
  const ctx = getAudioContext();
  if (!ctx || duration <= 0 || !outgoingUrl) return null;

  cancelActiveCrossfade();

  try {
    const outgoingAudio = new Audio(outgoingUrl);
    outgoingAudio.currentTime = Math.max(0, outgoingTime);
    outgoingAudio.play().catch(() => {});

    const outgoingSource = ctx.createMediaElementSource(outgoingAudio);
    const outgoingGain = ctx.createGain();

    outgoingSource.connect(outgoingGain);
    outgoingGain.connect(ctx.destination);

    // Ramp outgoing track to 0 over crossfade duration
    outgoingGain.gain.setValueAtTime(1.0, ctx.currentTime);
    outgoingGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);

    const timeoutId = setTimeout(() => {
      cleanupCrossfadeNode(outgoingAudio, outgoingSource, outgoingGain);
      activeCrossfade = null;
    }, duration * 1000 + 100);

    activeCrossfade = { outgoingAudio, outgoingSource, outgoingGain, timeoutId };
  } catch (err) {
    console.warn('Crossfade skipped:', err);
  }
}

function cleanupCrossfadeNode(audio, source, gain) {
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute('src');
    audio.load();
    source.disconnect();
    gain.disconnect();
  } catch {}
}

export function cancelActiveCrossfade() {
  if (activeCrossfade) {
    clearTimeout(activeCrossfade.timeoutId);
    cleanupCrossfadeNode(
      activeCrossfade.outgoingAudio,
      activeCrossfade.outgoingSource,
      activeCrossfade.outgoingGain
    );
    activeCrossfade = null;
  }
}
