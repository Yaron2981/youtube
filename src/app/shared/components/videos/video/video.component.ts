import { Component, Input, OnDestroy } from '@angular/core';
import { Video } from '../../../../search.interface';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnDestroy {
  @Input('video') video: Video | null = null;

  timeout: ReturnType<typeof setTimeout> | undefined;

  onMouseEnter(video: Video) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      video.showPop = true;
    }, 1500);
  }
  onMouseLeave(video: Video) {
    video.showPop = false;
    clearTimeout(this.timeout);
  }
  ngOnDestroy() {
    clearTimeout(this.timeout);
  }
}
