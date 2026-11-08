// A small generative Indian instrumental: a tanpura drone (Sa–Pa) under a
// bansuri-style melody improvising in Raag Bhupali, with occasional
// swarmandal shimmers. Synthesised live so it never loops audibly and
// ships with no audio files.

const SA = 146.83 // D3
const BHUPALI = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3]
const TANPURA = [SA * 0.75, SA, SA, SA / 2]
const NOTE_LENGTHS = [0.9, 1.2, 1.6, 2.2, 3]
const MOVES = [-2, -1, -1, 0, 1, 1, 2]
const MASTER_LEVEL = 0.75

function degreeToFreq(degree: number) {
  const octave = Math.floor(degree / 5)
  const index = ((degree % 5) + 5) % 5
  return SA * 2 * BHUPALI[index] * 2 ** octave
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

type FluteVoice = {
  osc: OscillatorNode
  overtone: OscillatorNode
  gain: GainNode
  breath: GainNode
  vibrato: GainNode
}

export class AmbientRaga {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private bus: GainNode | null = null
  private flute: FluteVoice | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private suspendTimer: ReturnType<typeof setTimeout> | null = null
  private nextTanpura = 0
  private tanpuraStep = 0
  private nextNote = 0
  private degree = 0
  private phraseLeft = 0
  private fluteSounding = false

  playing = false

  start(): boolean {
    if (typeof window === 'undefined') return false
    if (!this.ctx) {
      const AudioCtor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AudioCtor) return false
      this.ctx = new AudioCtor()
      this.build(this.ctx)
    }
    const ctx = this.ctx
    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer)
      this.suspendTimer = null
    }
    void ctx.resume()

    const now = ctx.currentTime
    const level = this.master!.gain
    level.cancelScheduledValues(now)
    level.setValueAtTime(level.value, now)
    level.linearRampToValueAtTime(MASTER_LEVEL, now + 2.5)

    if (this.flute) {
      this.flute.gain.gain.cancelScheduledValues(now)
      this.flute.gain.gain.setValueAtTime(0, now)
      this.flute.breath.gain.cancelScheduledValues(now)
      this.flute.breath.gain.setValueAtTime(0, now)
      this.fluteSounding = false
      this.phraseLeft = 0
    }

    this.nextTanpura = Math.max(this.nextTanpura, now + 0.1)
    this.nextNote = Math.max(this.nextNote, now + 2)
    if (!this.timer) this.timer = setInterval(() => this.schedule(), 120)
    this.playing = true
    return true
  }

  stop() {
    const ctx = this.ctx
    if (!ctx || !this.master) return
    const now = ctx.currentTime
    const level = this.master.gain
    level.cancelScheduledValues(now)
    level.setValueAtTime(level.value, now)
    level.linearRampToValueAtTime(0, now + 0.8)
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.suspendTimer = setTimeout(() => void ctx.suspend(), 1000)
    this.playing = false
  }

  dispose() {
    if (this.timer) clearInterval(this.timer)
    if (this.suspendTimer) clearTimeout(this.suspendTimer)
    void this.ctx?.close()
    this.ctx = null
    this.playing = false
  }

  private build(ctx: AudioContext) {
    const master = ctx.createGain()
    master.gain.value = 0
    const softener = ctx.createBiquadFilter()
    softener.type = 'lowpass'
    softener.frequency.value = 5200
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -18
    compressor.ratio.value = 3
    master.connect(softener).connect(compressor).connect(ctx.destination)

    const dry = ctx.createGain()
    dry.gain.value = 0.75
    dry.connect(master)

    const reverb = ctx.createConvolver()
    reverb.buffer = this.makeImpulse(ctx, 3.4)
    const wet = ctx.createGain()
    wet.gain.value = 0.5
    reverb.connect(wet).connect(master)

    const bus = ctx.createGain()
    bus.connect(dry)
    bus.connect(reverb)

    this.master = master
    this.bus = bus
    this.flute = this.buildFlute(ctx, bus)
  }

  private buildFlute(ctx: AudioContext, bus: GainNode): FluteVoice {
    const gain = ctx.createGain()
    gain.gain.value = 0
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 2600
    gain.connect(tone).connect(bus)

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = degreeToFreq(0)
    const overtone = ctx.createOscillator()
    overtone.type = 'triangle'
    overtone.frequency.value = degreeToFreq(0)
    const overtoneLevel = ctx.createGain()
    overtoneLevel.gain.value = 0.22
    osc.connect(gain)
    overtone.connect(overtoneLevel).connect(gain)

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 5.2
    const vibrato = ctx.createGain()
    vibrato.gain.value = 0
    lfo.connect(vibrato)
    vibrato.connect(osc.frequency)
    vibrato.connect(overtone.frequency)

    const noise = ctx.createBufferSource()
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    noise.buffer = noiseBuffer
    noise.loop = true
    const breathBand = ctx.createBiquadFilter()
    breathBand.type = 'bandpass'
    breathBand.frequency.value = 1800
    breathBand.Q.value = 0.8
    const breath = ctx.createGain()
    breath.gain.value = 0
    noise.connect(breathBand).connect(breath).connect(bus)

    osc.start()
    overtone.start()
    lfo.start()
    noise.start()

    return { osc, overtone, gain, breath, vibrato }
  }

  private makeImpulse(ctx: AudioContext, seconds: number) {
    const length = Math.floor(ctx.sampleRate * seconds)
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.6
      }
    }
    return impulse
  }

  private schedule() {
    const ctx = this.ctx
    if (!ctx) return
    const horizon = ctx.currentTime + 0.8

    while (this.nextTanpura < horizon) {
      const step = this.tanpuraStep % 4
      this.pluckTanpura(TANPURA[step], this.nextTanpura)
      this.nextTanpura += step === 3 ? 1.9 : 1.15
      this.tanpuraStep++
    }

    while (this.nextNote < horizon) {
      this.nextNote += this.playMelodyStep(this.nextNote)
    }
  }

  private playMelodyStep(time: number): number {
    if (this.phraseLeft <= 0) {
      this.phraseLeft = 4 + Math.floor(Math.random() * 4)
      if (Math.random() < 0.45) this.shimmer(time + 0.4)
      return 2.5 + Math.random() * 2.5
    }

    this.phraseLeft--
    const isLast = this.phraseLeft === 0
    this.degree = Math.min(7, Math.max(-2, this.degree + pick(MOVES)))
    if (isLast) this.degree = pick([0, 3, 5])

    const duration = isLast ? 3.2 : pick(NOTE_LENGTHS)
    this.playFluteNote(time, degreeToFreq(this.degree), duration, isLast)
    return duration
  }

  private playFluteNote(time: number, freq: number, duration: number, isLast: boolean) {
    const flute = this.flute
    if (!flute) return
    const level = 0.11

    flute.osc.frequency.setTargetAtTime(freq, time, 0.06)
    flute.overtone.frequency.setTargetAtTime(freq, time, 0.06)

    if (!this.fluteSounding) {
      flute.gain.gain.setTargetAtTime(level, time, 0.15)
      flute.breath.gain.setTargetAtTime(0.018, time, 0.1)
    } else {
      flute.gain.gain.setTargetAtTime(level * 0.7, time, 0.03)
      flute.gain.gain.setTargetAtTime(level, time + 0.08, 0.1)
    }

    flute.vibrato.gain.setTargetAtTime(0, time, 0.05)
    flute.vibrato.gain.setTargetAtTime(freq * 0.008, time + 0.45, 0.3)
    this.fluteSounding = true

    if (isLast) {
      const release = time + duration - 0.7
      flute.gain.gain.setTargetAtTime(0, release, 0.35)
      flute.breath.gain.setTargetAtTime(0, release, 0.3)
      this.fluteSounding = false
    }
  }

  private pluckTanpura(freq: number, time: number) {
    const ctx = this.ctx
    if (!ctx || !this.bus) return
    const envelope = ctx.createGain()
    envelope.gain.setValueAtTime(0.0001, time)
    envelope.gain.exponentialRampToValueAtTime(0.06, time + 0.02)
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + 4.5)

    const jawari = ctx.createBiquadFilter()
    jawari.type = 'lowpass'
    jawari.Q.value = 6
    jawari.frequency.setValueAtTime(3200, time)
    jawari.frequency.exponentialRampToValueAtTime(480, time + 3.5)
    jawari.connect(envelope).connect(this.bus)

    for (const detune of [1, 1.0025]) {
      const osc = ctx.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.value = freq * detune
      osc.connect(jawari)
      osc.start(time)
      osc.stop(time + 4.6)
      osc.onended = () => osc.disconnect()
    }
  }

  private shimmer(time: number) {
    const ctx = this.ctx
    if (!ctx || !this.bus) return
    for (let i = 0; i < 7; i++) {
      const start = time + i * 0.09
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = degreeToFreq(5 + i)
      const envelope = ctx.createGain()
      envelope.gain.setValueAtTime(0.0001, start)
      envelope.gain.exponentialRampToValueAtTime(0.022, start + 0.01)
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + 1.8)
      osc.connect(envelope).connect(this.bus)
      osc.start(start)
      osc.stop(start + 1.9)
      osc.onended = () => osc.disconnect()
    }
  }
}
