const rhythmDisplay = document.querySelector('.rhythm-display')
const pulsesInput = document.getElementById('pulses')
const stepsInput = document.getElementById('steps')
const pixelsInput = document.getElementById('pixels')
const playButton = document.getElementById('playButton') // think globally, act locally
const stopButton = document.getElementById('stopButton') // think globally, act locally
const bpmSlider = document.querySelector('input[name="bpm"]')
const volumeSlider = document.querySelector('input[name="volume"]')

Tone.Master.volume.value = -10
let currentSequence

stepsInput.addEventListener('input', handleInput)
pulsesInput.addEventListener('input', handleInput)
pixelsInput.addEventListener('input', event => generateStyleSheet(event.target.value))
playButton.addEventListener('click', e => playSequence())
stopButton.addEventListener('click', e => stopSequence())

volumeSlider.addEventListener('input', e => {
  const volumeEmojis = ['🔇', '🔈', '🔉', '🔊'].reverse()
  const RANGE = e.target.max - e.target.min
  const decibels = parseInt(e.target.value)
  const indexesBetweenEmojis = RANGE / volumeEmojis.length
  const emojiIndex = Math.floor((-decibels + 12) / indexesBetweenEmojis)
  document.querySelector('label[for="volume"] > span').innerHTML = volumeEmojis[emojiIndex] || volumeEmojis[3]
  Tone.Master.volume.value = decibels
})

bpmSlider.addEventListener('input', e => {
  const displayedBpm = e.target.value.length === 3 ? e.target.value : `&nbsp;${e.target.value}`
  document.querySelector('label[for="bpm"] > span').innerHTML = displayedBpm
  Tone.Transport.bpm.value = e.target.value
})

generateStyleSheet()
drawDivs()

function generateStyleSheet (pixels) {
  const styleTag = document.querySelector('style')
  if (styleTag) document.head.removeChild(styleTag)
  const sheet = document.createElement('style')
  sheet.innerHTML = makeRule(pixels)
  document.head.appendChild(sheet)
}

function makeRule (pixels = 48) {
  return `
  .beat {
    min-width: ${pixels}px;
    max-width: ${pixels}px;
    min-height: ${pixels}px;
    max-height: ${pixels}px;
    box-sizing: border-box;
    border-radius: ${pixels / 4}px;
    border: ${Math.ceil(pixels / 12)}px solid rgba(216, 173, 1, .2);
  }
  `
}

function handleInput (event) {
  const MAX = 512
  const AT_LEAST_PIXELS = 10
  if (parseInt(pixelsInput.value) < AT_LEAST_PIXELS) pixelsInput.value = AT_LEAST_PIXELS
  if (parseInt(pulsesInput.value) > MAX) pulsesInput.value = MAX
  if (parseInt(stepsInput.value) > MAX) stepsInput.value = MAX
  if (parseInt(stepsInput.value) < 1) stepsInput.value = 1
  if (parseInt(pulsesInput.value) < 1) pulsesInput.value = 1
  playSequence()
  drawDivs()
}

function drawDivs () {
  rhythmDisplay.innerHTML = ''
  let pulses = pulsesInput.value
  let steps = stepsInput.value
  let pattern = generatePattern(pulses, steps)
  let triangle = document.createElement('div')
  triangle.className = 'rhythm-display-triangle'
  rhythmDisplay.appendChild(triangle)
  pattern.forEach(beat => {
    let div = document.createElement('div')
    div.className = beat ? 'on beat' : 'off beat'
    rhythmDisplay.appendChild(div)
  })
}

function getSequenceFromDOM () {
  const beats = document.getElementsByClassName('beat')
  let sequence = [...beats].map(beat => beat.classList.contains('on') ? 1 : 0)
  return sequence
}

function playSequence () {
  if (currentSequence) {
    currentSequence.stop()
    currentSequence.dispose()
  }

  let pulses = pulsesInput.value
  let steps = stepsInput.value
  let pattern = generatePattern(pulses, steps)

  generateToneSequence(pattern)
  currentSequence.start(0)
  Tone.Transport.start()
}

function generateToneSequence (pattern) {
  currentSequence = new Tone.Sequence(function (time, note) {
    const index = parseInt(currentSequence.progress * currentSequence.length)
    lightUp(index)
    let noiseSynth = new Tone.NoiseSynth().toMaster()
    if (note) noiseSynth.triggerAttackRelease('8n', time)
  }, pattern, '8n')
}

function stopSequence () {
  Tone.Transport.stop()
  const beats = [...document.querySelectorAll('.beat')]
  beats.forEach(beat => beat.classList.remove('active'))
}

function lightUp (index) {
  const beats = document.querySelectorAll('.beat')
  const rotatedLastIndex = index - 1 === -1 ? beats.length - 1 : index - 1
  beats[index].classList.add('active')
  beats[rotatedLastIndex].classList.remove('active')
}
