/** The pen loop: one authored path in a 200×60 box, used round the hero's marked phrase and
 *  for the case study's pen circles. Stretch it over any rectangle with a transform or
 *  preserveAspectRatio="none", and a non-scaling stroke to keep the line 1.5px.
 *
 *  It starts top-right, runs anticlockwise, comes back round and overshoots past its start
 *  with a short tail. Lopsided (fuller on the right), and tilted about -2° (left side
 *  lower, right side higher). The left side sits closer in (~5px at x-height) since normal
 *  word spacing leaves only ~7px to the "h" of "with" in the hero. */
export const LOOP_PATH =
  'M 170 5 C 128 0, 60 3, 24 8 C 10 11, 9 26, 11 41 C 14 55, 46 60, 100 58 ' +
  'C 152 57, 192 52, 197 34 C 201 18, 193 4, 158 2 C 142 1, 126 2, 110 5'
