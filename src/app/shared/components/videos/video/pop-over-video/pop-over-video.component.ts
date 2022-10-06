import { state, style, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Video } from 'src/app/search.interface';
import { FADE_STATE_ANIMATION } from 'src/app/shared/animations/fade-state';
import { YOUTUBE_CONST } from 'src/app/shared/constants/yt';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-pop-over-video',
  templateUrl: './pop-over-video.component.html',
  styleUrls: ['./pop-over-video.component.scss'],
  animations: FADE_STATE_ANIMATION,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopOverVideoComponent implements AfterViewInit {
  constructor(
    private sharedService: SharedService,
    private ref: ChangeDetectorRef
  ) {}
  @Input() video: Video | null = null;
  @Input() videoIndex: number = 0;
  YT = YOUTUBE_CONST;
  subscription: Subscription | undefined;
  remainder: number = 0;
  popPos: number = -50;
  ngAfterViewInit() {
    /*
      fix pop-over window position. If got 4||5 videos in a row do remainder of 4||5 and if got 1 so pos window to right else 0 pos to left all the rest in the middle "transform: 'translate(4||5 %, -45%)'"
    */
    this.subscription = this.sharedService.sidebarTriggerBtn$.subscribe(
      (sb) => {
        const rim = sb ? 4 : 5;
        this.remainder =
          (this.videoIndex + 1) % rim == 0
            ? -53
            : (this.videoIndex + 1) % rim == 1
            ? -47
            : -50;
        this.ref.detectChanges();
      }
    );
  }
  ngOnDestroy() {
    this.subscription!.unsubscribe();
  }
}
