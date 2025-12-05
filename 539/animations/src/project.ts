import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';

import './global.css';

import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/css';

Code.defaultHighlighter = new LezerHighlighter(parser); // https://motioncanvas.io/docs/code#multiple-languages

export default makeProject({
  scenes: [example]
});
