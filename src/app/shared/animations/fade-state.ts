import { state, style, trigger } from '@angular/animations';

export const FADE_STATE_ANIMATION = [
  trigger('fade', [
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
  ]),
];
