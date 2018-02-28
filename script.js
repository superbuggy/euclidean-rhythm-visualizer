const main = document.querySelector('main')
const pulsesInput = document.getElementById('pulses')
const stepsInput = document.getElementById('steps')
const pixelsInput = document.getElementById('pixels')

stepsInput.addEventListener('input', handleInput)
pulsesInput.addEventListener('input', handleInput)
pixelsInput.addEventListener('input', event => generateStyleSheet(event.target.value))

generateStyleSheet()
drawDivs()

function generateStyleSheet (pixels = 48) {
  const styleTag = document.querySelector('style')
  if (styleTag) document.head.removeChild(styleTag)
  const sheet = document.createElement('style')
  sheet.innerHTML = makeRule(pixels)
  document.head.appendChild(sheet)
}

function makeRule (pixels) {
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
  console.log(pixelsInput.value.constructor, stepsInput.value.constructor)
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
  let sequence = getSequenceFromDOM()
  let noiseSynth = new Tone.NoiseSynth().toMaster()

  var seq = new Tone.Sequence(function (time, note) {
    // console.log(note, time)
    if (note) {
      noiseSynth.triggerAttackRelease('8n', time)
    }
  }, sequence, '8n')
  console.log(sequence)
  console.log(Tone.Transport)
  console.log(Tone.hackyEventId)
  Tone.hackyEventId = Tone.Transport.schedule(function (time) {
      // invoked when the Transport starts
    Tone.Transport.clear(Tone.hackyEventId)
    seq.stop()
    seq.start(0)
  }, 0)
  Tone.Transport.start()
}
