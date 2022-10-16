import { state, style, trigger } from '@angular/animations';
import { mergeMap, of, takeUntil, delay } from 'rxjs';
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
export class VideoComponent implements OnInit, OnDestroy {
  YT = YOUTUBE_CONST;
  constructor(private ref: ChangeDetectorRef) {}
  @Input() videoIndex: number = 0;
  @Input() video: Video | null = null;
  @Input('posType') posType = 'vertical';
  showVertical: TemplateRef<any> | undefined;
  timeout: ReturnType<typeof setTimeout> | undefined;
  timeoutPlayer: ReturnType<typeof setTimeout> | undefined;
  triggerAni: string = 'initial';
  private _mouseEnterStream: EventEmitter<Video> = new EventEmitter();
  private _mouseLeaveStream: EventEmitter<Video> = new EventEmitter();

  ngOnInit() {
    this._mouseLeaveStream
      .pipe(
        mergeMap((video: Video) => {
          this._setTrigger();
          return of(video).pipe(delay(170), takeUntil(this._mouseEnterStream));
        })
      )
      .subscribe((video: Video) => {
        this.closePop(video);
      });

    this._mouseEnterStream.subscribe((video) => this.openPop(video!));
  }
  onMouseEnter(video: Video) {
    this._mouseEnterStream.emit(video);
  }

  onMouseLeave(video: Video) {
    this._mouseLeaveStream.emit(video);
  }
  openPop(video: Video): void {
    this._setTrigger();
    video.showPop = true;
    video.showPlayer = true;
    this.ref.detectChanges();
  }
  closePop(video: Video): void {
    video.showPop = false;
    video.showPlayer = false;
    this.ref.detectChanges();
  }
  _setTrigger(): void {
    this.triggerAni = this.triggerAni === 'initial' ? 'final' : 'initial';
  }
  handleMissingImage(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  ngOnDestroy() {
    this._mouseEnterStream.unsubscribe();
    this._mouseLeaveStream.unsubscribe();
  }
}
