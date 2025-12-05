import {makeProject} from '@motion-canvas/core';

import oneOne from './scenes/oneOne?scene';
import twoOne from './scenes/twoOne?scene';
import oneTwo from './scenes/oneTwo?scene';
import oneThree from './scenes/oneThree?scene';
import twoThree from './scenes/twoThree?scene';
import oneFour from './scenes/oneFour?scene';

import './global.css';

import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/css';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: 
    [
    //oneOne, 
    //twoOne,
    //oneTwo,
    //oneThree,
    //twoThree,
    oneFour,
    ]
});
