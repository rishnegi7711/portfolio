// Dev-only: records a short, muted loop of Applyd's own animations from the live demo, for
// the case study. Not part of the site build. Needs Google Chrome at the macOS default path.
// Read-only: it logs in with the public demo account and only looks.
//
//   bun scripts/record-applyd.ts
//   DUMP_FRAMES=<dir> bun scripts/record-applyd.ts   # also writes some raw frames there
//
// Writes applyd-motion.webm, applyd-motion.mp4 and applyd-motion-poster.webp to
// public/job-tracker/. No ffmpeg: Chrome records the frames itself. The sequence is
//   board (light, settled) → reload it (the cards settle into their columns) → open an
//   application (its interview timeline draws in) → switch to dark → back to the board
//   → light again, so the last frame matches the first and the loop has no visible jump.
//
// How it works: CDP's screencast sends a JPEG each time the page changes. A second step
// replays those frames onto a canvas at their original timing while a MediaRecorder
// records the canvas stream. So encoding takes as long as the clip itself.
import { join, resolve } from 'node:path'
import { boardReady, demo, openDemo } from './lib/applyd-demo'

const outDir = resolve(import.meta.dir, '../public/job-tracker')
const WIDTH = 1000 // px; the viewport is 1437×776, and 1000×540 keeps its 1.85 shape
const HEIGHT = 540

const { send, evaluate, waitFor, on, setTheme, openApplication, close } = await openDemo({
  deviceScaleFactor: 1,
  reducedMotion: false, // the point is to film the animations
})

// Start from the settled light board.
await setTheme('light')
await Bun.sleep(1500)

// Frames arrive as { data (base64 JPEG), metadata.timestamp (seconds) }. Each one must be
// acknowledged, or Chrome stops sending.
const frames: { t: number; jpeg: string }[] = []
on('Page.screencastFrame', (params) => {
  frames.push({ t: params.metadata.timestamp, jpeg: params.data })
  send('Page.screencastFrameAck', { sessionId: params.sessionId })
})
await send('Page.startScreencast', { format: 'jpeg', quality: 85, maxWidth: WIDTH, maxHeight: HEIGHT })

await Bun.sleep(700) // the settled light board
await send('Page.navigate', { url: demo + '/' }) // a fresh load: the cards settle into their columns
await waitFor(boardReady, 'the board after reload')
await Bun.sleep(1700)
await openApplication('Fernleaf Studio') // the interview timeline draws itself in
await Bun.sleep(2200)
await setTheme('dark')
await Bun.sleep(1100)
await evaluate('history.back()')
await waitFor(boardReady, 'the board again')
await Bun.sleep(900)
await setTheme('light')
await Bun.sleep(1200) // longer than the theme crossfade, so the last frame is fully settled

const end = Date.now() / 1000 // the same epoch clock as the frame timestamps
await send('Page.stopScreencast')
console.log(`recorded ${frames.length} frames over ${(end - frames[0].t).toFixed(1)}s`)
if (process.env.DUMP_FRAMES) {
  // Debugging aid: every 12th raw frame, to see what the screencast really caught.
  for (let i = 0; i < frames.length; i += 12) {
    await Bun.write(join(process.env.DUMP_FRAMES, `frame-${String(i).padStart(3, '0')}.jpg`), Buffer.from(frames[i].jpeg, 'base64'))
  }
  console.log('frame times (s from start):', frames.map((f) => (f.t - frames[0].t).toFixed(1)).join(' '))
}

// Replay in a blank page, so the app's own scripts can't interfere. Focus emulation stops
// Chrome throttling a headless page it thinks is in the background.
await send('Emulation.setFocusEmulationEnabled', { enabled: true })
await send('Page.navigate', { url: 'about:blank' })
const CHUNK = 20
await evaluate('window.frames_ = []')
for (let i = 0; i < frames.length; i += CHUNK) {
  await evaluate(`window.frames_.push(...${JSON.stringify(frames.slice(i, i + CHUNK))})`)
}
const duration = end - frames[0].t

/** Plays the frames onto a canvas at their original times while recording it. Returns the
 *  recording as base64, or null if Chrome can't record that format. */
async function encode(mimeType: string): Promise<string | null> {
  return evaluate(`(async () => {
    if (!MediaRecorder.isTypeSupported(${JSON.stringify(mimeType)})) return null
    const frames = window.frames_
    const bitmaps = await Promise.all(
      frames.map((f) => fetch('data:image/jpeg;base64,' + f.jpeg).then((r) => r.blob()).then(createImageBitmap)),
    )
    const canvas = document.createElement('canvas')
    canvas.width = ${WIDTH}
    canvas.height = ${HEIGHT}
    document.body.append(canvas) // a canvas outside the page may not be captured
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmaps[0], 0, 0, ${WIDTH}, ${HEIGHT})
    // captureStream(0): no automatic frames, so each draw below asks for exactly one.
    const stream = canvas.captureStream(0)
    const track = stream.getVideoTracks()[0]
    track.requestFrame()
    const recorder = new MediaRecorder(stream, { mimeType: ${JSON.stringify(mimeType)}, videoBitsPerSecond: 2_500_000 })
    const chunks = []
    recorder.ondataavailable = (e) => chunks.push(e.data)
    const stopped = new Promise((resolve) => (recorder.onstop = resolve))
    recorder.start()
    const start = performance.now()
    const first = frames[0].t
    let next = 0
    await new Promise((resolve) => {
      const tick = () => {
        const elapsed = (performance.now() - start) / 1000
        while (next < frames.length && frames[next].t - first <= elapsed) {
          ctx.drawImage(bitmaps[next], 0, 0, ${WIDTH}, ${HEIGHT})
          next++
          track.requestFrame()
        }
        if (elapsed >= ${duration}) return resolve()
        setTimeout(tick, 8)
      }
      tick()
    })
    // A still stretch draws nothing, so ask for one last frame to hold the final state.
    track.requestFrame()
    recorder.stop()
    await stopped
    const buffer = new Uint8Array(await new Blob(chunks).arrayBuffer())
    let binary = ''
    for (let i = 0; i < buffer.length; i += 0x8000) binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000))
    return btoa(binary)
  })()`)
}

for (const [file, mimeType] of [
  ['applyd-motion.webm', 'video/webm;codecs=vp9'],
  ['applyd-motion.mp4', 'video/mp4;codecs=avc1.42E01E'],
] as const) {
  const data = await encode(mimeType)
  if (!data) {
    console.log(`skipped ${file}: this Chrome can't record ${mimeType}`)
    continue
  }
  const bytes = Buffer.from(data, 'base64')
  await Bun.write(join(outDir, file), bytes)
  console.log(`saved ${file} (${(bytes.length / 1024).toFixed(0)} KB)`)
}

// The poster is the first frame: also what reduced motion shows instead of the video.
const poster = await evaluate(`(async () => {
  const bitmap = await fetch('data:image/jpeg;base64,' + window.frames_[0].jpeg).then((r) => r.blob()).then(createImageBitmap)
  const canvas = document.createElement('canvas')
  canvas.width = ${WIDTH}
  canvas.height = ${HEIGHT}
  canvas.getContext('2d').drawImage(bitmap, 0, 0, ${WIDTH}, ${HEIGHT})
  return canvas.toDataURL('image/webp', 0.85).split(',')[1]
})()`)
await Bun.write(join(outDir, 'applyd-motion-poster.webp'), Buffer.from(poster, 'base64'))
console.log('saved applyd-motion-poster.webp')

await close()
