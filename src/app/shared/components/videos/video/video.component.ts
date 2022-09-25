import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { Video } from '../../../../search.interface';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoComponent implements OnDestroy {
  constructor(private ref: ChangeDetectorRef) {}
  @Input('video') video: Video | null = null;

  timeout: ReturnType<typeof setTimeout> | undefined;

  onMouseEnter(video: Video) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      video.showPop = true;
      this.ref.detectChanges();
    }, 1500);
  }
  onMouseLeave(video: Video) {
    video.showPop = false;
    this.ref.detectChanges();
    clearTimeout(this.timeout);
  }
  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
}
