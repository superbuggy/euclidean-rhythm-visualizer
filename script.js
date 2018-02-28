const main = document.querySelector('main')
const pulsesInput = document.getElementById('pulses')
const stepsInput = document.getElementById('steps')
const pixelsInput = document.getElementById('pixels')

let currentSequence

stepsInput.addEventListener('input', handleInput)
pulsesInput.addEventListener('input', handleInput)
pixelsInput.addEventListener('input', event => generateStyleSheet(event.target.value))

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
    border: 1px solid rgb(174, 164, 109);
  }
  `
}

function handleInput (event) {
  if (parseInt(pixelsInput.value) < 10) pixelsInput.value = 10
  if (parseInt(stepsInput.value) < parseInt(pulsesInput.value)) stepsInput.value = pulsesInput.value
  drawDivs(event)
}

function drawDivs (event) {
  main.innerHTML = ''
  let pulses = pulsesInput.value
  let steps = stepsInput.value
  let pattern = generatePattern(pulses, steps)
  pattern.forEach(beat => {
    let div = document.createElement('div')
    div.className = beat ? 'on beat' : 'off beat'
    main.appendChild(div)
  })
  playSequence()
}

function getSequenceFromDOM () {
  const beats = document.getElementsByClassName('beat')
  let sequence = [...beats].map(beat => beat.classList.contains('on') ? 1 : 0)
  return sequence
}

function playSequence () {
  console.log('play')
  Tone.Transport.stop()
  if (currentSequence) {
    currentSequence.stop()
    currentSequence.dispose()
  }

  let pulses = pulsesInput.value
  let steps = stepsInput.value
  let pattern = generatePattern(pulses, steps)

  currentSequence = new Tone.Sequence(function (time, note) {
    let noiseSynth = new Tone.NoiseSynth().toMaster()
    console.log(note)
    if (note) {
      noiseSynth.triggerAttackRelease('8n', time)
    }
  }, pattern, '8n')

  currentSequence.start(0)
  Tone.Transport.start()
}
