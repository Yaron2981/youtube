import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Video } from 'src/app/search.interface';
import {
  FADE_STATE_ANIMATION,
  SCALE_BY_RIMAINDER_ANIMATION,
} from 'src/app/shared/animations/fade-state';
import { YOUTUBE_CONST } from 'src/app/shared/constants/yt';

@Component({
  selector: 'app-pop-over-video',
  templateUrl: './pop-over-video.component.html',
  styleUrls: ['./pop-over-video.component.scss'],
  animations: [FADE_STATE_ANIMATION, SCALE_BY_RIMAINDER_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopOverVideoComponent {
  constructor() {}

  @Input() video: Video | null = null;
  @Input() videoIndex: number = 0;
  @Input() remainder: number = 0;
  @Input('triggerAnimation') currentState: string = 'initial';
  YT = YOUTUBE_CONST;
}
