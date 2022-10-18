import { state, style, trigger } from '@angular/animations';
import { mergeMap, of, takeUntil, delay, debounceTime } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { AnyARecord } from 'dns';
import { EventEmitter } from '@angular/core';
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
export class VideoComponent {
  YT = YOUTUBE_CONST;
  constructor(private ref: ChangeDetectorRef) {}
  @Input() videoIndex: number = 0;
  @Input() video: Video | null = null;
  @Input() videosInRow: number = 4;
  @Input('posType') posType = 'vertical';
  showVertical: TemplateRef<any> | undefined;
  timeout: ReturnType<typeof setTimeout> | undefined;
  timeoutPlayer: ReturnType<typeof setTimeout> | undefined;
  triggerAni: string = 'initial';
  remainder: number = 50;

  onMouseEnter(e: Event, video: Video): void {
    this._setTrigger();
  }
  onMouseLeave(e: Event, video: Video): void {
    this._setTrigger();
  }
  _setTrigger(): void {
    this.triggerAni = this.triggerAni === 'initial' ? 'final' : 'initial';
    this.ref.detectChanges();
  }
  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  ngAfterViewInit() {
    /*
      fix pop-over window position. For e.g if got 4/5 videos in a row do remainder of 4/5 and if got 1 so pos window to right else 0 pos to left all the rest in the middle "transform: 'translate(4/5 %, -45%)'"
    */
    this.remainder =
      (this.videoIndex + 1) % this.videosInRow == 0
        ? -40
        : (this.videoIndex + 1) % this.videosInRow == 1
        ? 0
        : -20;
    this.ref.detectChanges();
  }
}
