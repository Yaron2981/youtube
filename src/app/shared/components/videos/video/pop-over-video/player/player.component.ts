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
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements AfterViewInit {
  constructor(private ref: ChangeDetectorRef) {}
  @Input() videoId: string = '';
  @ViewChild('ytIframe') ytIframe: any;
  @Input() autoplay: string = '1';
  @Input() mute: string = '1';
  @Input() controls: string = '0';
  @Input() autohide: string = '0';
  @Input() showInfo: string = '0';

  ngAfterViewInit() {
    const ytIframe = document.getElementById('yt-iframe');
    const iframe = document.createElement('iframe');
    iframe.setAttribute(
      'src',
      '//www.youtube.com/embed/' +
        this.videoId +
        `?autoplay=${this.autoplay}&controls=${this.controls}&wmode=opaque&enablejsapi=1&mute=${this.mute}&autohide=${this.autohide}&showInfo=${this.showInfo}`
    );
    iframe.setAttribute('frameborder', '0');
    iframe.classList.add('yt-iframe', 'mat-card-image');
    if (ytIframe) {
      ytIframe.appendChild(iframe);
    }
  }
}
