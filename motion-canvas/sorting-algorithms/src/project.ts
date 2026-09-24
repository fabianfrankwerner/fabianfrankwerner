import {makeProject} from '@canvas-commons/core';

import intro from './scenes/intro?scene';
import bubble from './scenes/bubbleSort?scene';
import selection from './scenes/selectionSort?scene';
import insertion from './scenes/insertionSort?scene';
import merge from './scenes/mergeSort?scene';
import quick from './scenes/quickSort?scene';
import heap from './scenes/heapSort?scene';
import comparison from './scenes/comparison?scene';
import outro from './scenes/outro?scene';

export default makeProject({
  scenes: [intro, bubble, selection, insertion, merge, quick, heap, comparison, outro],
});