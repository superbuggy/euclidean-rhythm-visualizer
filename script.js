var pulsesInput, stepsInput, form, clearButton, main;
window.onload = function(){
  pulsesInput = document.getElementById('pulses')
  stepsInput = document.getElementById('steps')
  form = document.getElementById('er-params')
  clearButton = document.getElementById('clear')
  main = document.getElementsByTagName("main")[0]
  form.addEventListener("submit", evt => drawDivs(evt))
  clearButton.addEventListener("click", clearPattern)
}

function drawDivs(evt){
  evt.preventDefault();
  let pulses = pulsesInput.value;
  let steps = stepsInput.value;
  let pattern = generatePattern(pulses, steps);
  for (var i = 0; i < pattern.length; i++) {
    let div = document.createElement('div');
    div.className="beat";
    if (pattern[i]){
      div.className+=" on";
    }else{
      div.className+=" off";
    }
    main.appendChild(div);
  }
  playSequence();
}

function getSequence(){
  let sequence = [];
  let els = document.getElementsByClassName('beat');
  console.log(els);
  for (var i = 0; i < els.length; i++) {
    if (els[i].classList.contains("on")){
      sequence.push(1)
    } else {
      sequence.push(0)
    }
  }
  return sequence;
}

function clearPattern(){
  main.innerHTML=""
  Tone.Transport.stop()
}
