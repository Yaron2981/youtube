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
export const SCALE_ANIMATION = trigger('smallToBig', [
  state(
    'initial',
    style({
      opacity: '0',
      transform: 'scale(1)',
    })
  ),
  state(
    'final',
    style({
      opacity: '1',
      transform: 'scale(1.08)',
    })
  ),
  transition('final=>initial', animate('170ms ease-out')),
  transition('initial=>final', animate('0.250s  1.4s ease-in')),
]);
