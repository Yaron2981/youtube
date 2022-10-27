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
// import * as NGYTPackage from '../../../../../../../package.json';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements AfterViewInit {
  constructor(private ref: ChangeDetectorRef) {
    // this.version = NGYTPackage['dependencies']['ngx-youtube-player'].replace(
    //   '^',
    //   ''
    // );
  }
  @Input() videoId: string = '';
  @ViewChild('ytIframe') ytIframe: any;
  @Input() autoplay: number = 1;
  @Input() mute: string = '1';
  @Input() controls: string = '0';
  @Input() autohide: number = 1;
  @Input() showInfo: number = 0;

  playerVars = {
    cc_lang_pref: 'en',
    autoplay: this.autoplay,
    // mute: this.mute,
    // controls: this.controls,
    // autohide: this.autohide,
    // showInfo: this.showInfo,
  };
  version = '...';
  player!: YT.Player;
  public ytEvent: any;

  onStateChange(event: any) {
    this.ytEvent = event.data;
  }
  savePlayer(player: any) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }
  ngAfterViewInit() {
    // const ytIframe = document.getElementById('yt-iframe');
    // const iframe = document.createElement('iframe');
    // iframe.setAttribute(
    //   'src',
    //   '//www.youtube.com/embed/' +
    //     this.videoId +
    //     `?autoplay=${this.autoplay}&controls=${this.controls}&wmode=opaque&enablejsapi=1&mute=${this.mute}&autohide=${this.autohide}&showInfo=${this.showInfo}`
    // );
    // iframe.setAttribute('frameborder', '0');
    // iframe.classList.add('yt-iframe', 'mat-card-image');
    // if (ytIframe){
    //   ytIframe.appendChild(iframe);
    // }
  }
}
