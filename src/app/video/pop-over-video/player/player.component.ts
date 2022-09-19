import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnDestroy {
  @Input('videoId') videoId: string | null = null;
  @Input('duration') duration: number = 1;

  PBCounter: number = 0;
  interval: ReturnType<typeof setInterval> | undefined;

  ngOnDestroy() {
    this.PBCounter = 0;
    clearInterval(this.interval);
  }
  uploadDone() {
    this.interval = setInterval(() => {
      this.PBCounter += 100 / this.duration;
    }, 1000);
  }
}
