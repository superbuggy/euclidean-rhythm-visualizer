// Bjorklund algorithm from https://gist.github.com/withakay/1286731

/*
An implementation of the Bjorklund algorithm in JavaScript
Inspired by the paper 'The Euclidean Algorithm Generates Traditional Musical Rhythms'
by Godfried Toussaint

This is a port of the original algorithm by E. Bjorklund which I
found in the paper 'The Theory of Rep-Rate Pattern Generation in the SNS Timing Systems' by
E. Bjorklund.
Jack Rutherford
*/

function generatePattern (pulses, steps) { // renamed from the original
  steps = Math.round(steps)
  pulses = Math.round(pulses)

  if (pulses > steps || pulses === 0 || steps === 0) {
    return []
  }

  let pattern = []
  let counts = []
  let remainders = []
  let divisor = steps - pulses
  remainders.push(pulses)
  let level = 0

  while (true) {
    counts.push(Math.floor(divisor / remainders[level]))
    remainders.push(divisor % remainders[level])
    divisor = remainders[level]
    level += 1
    if (remainders[level] <= 1) {
      break
    }
  }

  counts.push(divisor)

  let r = 0
  const build = function (level) {
    r += 1
    if (level > -1) {
      for (var i = 0; i < counts[level]; i++) {
        build(level - 1)
      }
      if (remainders[level] !== 0) {
        build(level - 2)
      }
    } else if (level === -1) {
      pattern.push(0)
    } else if (level === -2) {
      pattern.push(1)
    }
  }

  build(level)
  return pattern.reverse()
}
