import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const FADE_STATE_ANIMATION = trigger('fade', [
  state(
    'false',
    style({
      opacity: '0',
    })
  ),
  state(
    'true',
    style({
      opacity: '1',
    })
  ),
]);
export const SMALL_TO_BIG_STATE_ANIMATION = trigger('smallToBig', [
  state(
    'initial',
    style({
      position: 'absolute !important',
      transform: 'scale(0)',
    })
  ),
  state(
    'final',
    style({
      position: 'absolute !important',

      transform: 'scale(1.15)',
    })
  ),
  transition('final=>initial', animate('200ms')),
  transition('initial=>final', animate('125ms')),
]);
