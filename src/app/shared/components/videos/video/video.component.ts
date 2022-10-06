import { state, style, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  TemplateRef,
} from '@angular/core';
import { Video } from '../../../../search.interface';
import { YOUTUBE_CONST } from '../../../constants/yt';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
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
  ],
})
export class VideoComponent implements OnDestroy {
  YT = YOUTUBE_CONST;
  constructor(private ref: ChangeDetectorRef) {}
  @Input() videoIndex: number = 0;
  @Input() video: Video | null = null;
  @Input('posType') posType = 'vertical';
  showVertical: TemplateRef<any> | undefined;
  timeout: ReturnType<typeof setTimeout> | undefined;
  timeoutPlayer: ReturnType<typeof setTimeout> | undefined;

  onMouseEnter(video: Video) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      video.showPop = true;
      this.ref.detectChanges();
    }, 1500);
    this.timeoutPlayer = setTimeout(() => {
      video.showPlayer = true;
      this.ref.detectChanges();
    }, 0);
  }
  onMouseLeave(video: Video) {
    video.showPop = false;
    video.showPlayer = false;
    this.ref.detectChanges();
    clearTimeout(this.timeout);
    clearTimeout(this.timeoutPlayer);
  }
  ngOnDestroy() {
    clearTimeout(this.timeoutPlayer);
    clearTimeout(this.timeout);
  }
}
