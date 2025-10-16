// Simple sound effects using Web Audio API
// No external audio files needed - all synthesized!

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 1.0; // 0.0 - 1.0

  constructor() {
    // Load saved volume from localStorage
    const savedVolume = localStorage.getItem('gameVolume');
    if (savedVolume) {
      this.masterVolume = parseFloat(savedVolume);
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new (AudioContextClass as typeof AudioContext)();
    }
    return this.audioContext;
  }

  // Volume control methods
  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume / 100)); // Convert 0-100 to 0-1
    localStorage.setItem('gameVolume', this.masterVolume.toString());
  }

  getVolume(): number {
    return Math.round(this.masterVolume * 100); // Convert 0-1 to 0-100
  }

  private applyVolume(gainNode: GainNode, baseGain: number, time: number) {
    gainNode.gain.setValueAtTime(baseGain * this.masterVolume, time);
  }

  // Play a click sound when placing X or O
  playClick() {
    if (this.masterVolume === 0) return; // Skip if muted
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      this.applyVolume(gainNode, 0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.masterVolume || 0.001, ctx.currentTime + 0.1);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.warn('Could not play click sound:', error);
    }
  }

  // Play a victory sound
  playVictory() {
    if (this.masterVolume === 0) return; // Skip if muted
    
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)

      notes.forEach((freq, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = ctx.currentTime + index * 0.15;
        this.applyVolume(gainNode, 0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01 * this.masterVolume || 0.001, startTime + 0.5);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
      });
    } catch (error) {
      console.warn('Could not play victory sound:', error);
    }
  }

  // Play a defeat sound
  playDefeat() {
    if (this.masterVolume === 0) return; // Skip if muted
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
      oscillator.type = 'sawtooth';

      this.applyVolume(gainNode, 0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.masterVolume || 0.001, ctx.currentTime + 0.5);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch (error) {
      console.warn('Could not play defeat sound:', error);
    }
  }

  // Play a draw sound
  playDraw() {
    if (this.masterVolume === 0) return; // Skip if muted
    
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 440;
      oscillator.type = 'triangle';

      this.applyVolume(gainNode, 0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01 * this.masterVolume || 0.001, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play draw sound:', error);
    }
  }
}

// Singleton instance
export const soundEffects = new SoundEffects();
