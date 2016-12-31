// var loop = new Tone.Loop(function(time){
//     synth.triggerAttackRelease("C2", "8n", time);
// }, "4n");
function playSequence(sequence){

  let seqLeng = sequence.length

  let noiseSynth = new Tone.NoiseSynth().toMaster();

  let total = 0;
  var seq = new Tone.Sequence(function(time, note){
    if (total){
      total += time;

    } else {
      total += time;
    }
    // console.log(note, time, total-time);
    if (note){
      noiseSynth.triggerAttackRelease("1n", time);
    }
  }, sequence, "8n");
  seq.start(0);
  Tone.Transport.start();
}
