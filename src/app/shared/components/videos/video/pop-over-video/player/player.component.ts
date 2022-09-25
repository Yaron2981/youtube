import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnDestroy {
  constructor(private ref: ChangeDetectorRef) {}
  @Input('videoId') videoId: string | null = null;
  @Input('duration') duration: number = 1;

  PBCounter: number = 0;
  interval: ReturnType<typeof setInterval> | undefined;
  curSec: number = 0;

  ngOnDestroy() {
    this.PBCounter = 0;
    clearInterval(this.interval);
    this.ref.detectChanges();
  }
  uploadDone() {
    if (this.interval) {
      clearInterval(this.interval);
      this.ref.detectChanges();
    }
    this.interval = setInterval(() => {
      this.PBCounter += 100 / this.duration;
      if (this.PBCounter >= this.duration) clearInterval(this.interval);
      this.ref.detectChanges();
    }, 1000);
  }
}
