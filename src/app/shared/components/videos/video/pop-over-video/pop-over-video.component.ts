import { state, style, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Video } from 'src/app/search.interface';

@Component({
  selector: 'app-pop-over-video',
  templateUrl: './pop-over-video.component.html',
  styleUrls: ['./pop-over-video.component.scss'],
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
export class PopOverVideoComponent {
  @Input('video') video: Video | null = null;
}
