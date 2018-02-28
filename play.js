function playSequence () {
  let sequence = getSequence()
  let seqLeng = sequence.length

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
