import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const FADE_STATE = trigger('fade', [
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
export const FADE_VIDEO_IMAGE_STATE_ANIMATION = trigger('fadeAnimation', [
  state(
    'false',
    style({
      opacity: '1',
    })
  ),
  state(
    'true',
    style({
      opacity: '0',
    })
  ),
  transition('false=>true', animate('0.350s ease-in')),
]);
export const SCALE_BY_RIMAINDER_ANIMATION = trigger('smallToBig', [
  state(
    'initial',
    style({
      opacity: '0',
      display: 'none',
      transform: 'scale(1) translate({{remainder}}px, 0px)',
    }),
    { params: { remainder: '0' } }
  ),
  state(
    'final',
    style({
      opacity: '1',
      display: 'block',
      transform: 'scale(1.08) translate({{remainder}}px, 0px)',
    }),
    { params: { remainder: '0' } }
  ),
  transition('final=>initial', [
    style({ display: 'none' }),
    animate('170ms ease-out'),
  ]),
  transition('initial=>final', [
    style({ display: 'block' }),
    animate('0.250s  1.4s ease-in'),
  ]),
]);
