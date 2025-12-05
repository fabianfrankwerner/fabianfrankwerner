import {makeProject} from '@motion-canvas/core';

import oneOne from './scenes/oneOne?scene';
import twoOne from './scenes/twoOne?scene';

import './global.css';

import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/css';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [twoOne]
});
