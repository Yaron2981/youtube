import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-player',
  template: `<div id="yt-iframe"></div>`,
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements AfterViewInit {
  constructor(private ref: ChangeDetectorRef) {}
  @Input('videoId') videoId: string | null = null;
  @Input('posType') posType = 'vertical';
  @ViewChild('ytIframe') ytIframe: any;

  ngAfterViewInit() {
    const ytIframe = document.getElementById('yt-iframe');
    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'src',
      '//www.youtube.com/embed/' +
        this.videoId +
        '?autoplay=1&controls=0&wmode=opaque&enablejsapi=1&mute=1&autohide=1&showInfo=0'
    );

    iframe.setAttribute('frameborder', '0');
    iframe.classList.add('yt-iframe', 'mat-card-image');
    if (ytIframe) ytIframe.appendChild(iframe);
  }
}
