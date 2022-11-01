import { Component, Input, OnInit } from '@angular/core';
import { Video } from 'src/app/search.interface';
import { FADE_VIDEO_IMAGE_STATE_ANIMATION } from 'src/app/shared/animations/fade-state';
import { YOUTUBE_CONST } from 'src/app/shared/constants/yt';

@Component({
  selector: 'app-related-video-list',
  templateUrl: './related-video-list.component.html',
  styleUrls: ['./related-video-list.component.scss'],
  animations: [FADE_VIDEO_IMAGE_STATE_ANIMATION],
})
export class RelatedVideoListComponent implements OnInit {
  @Input('video') video: Video | null = null;
  YT = YOUTUBE_CONST;
  constructor() {}
  ngOnInit(): void {
    console.log(this.video);
  }
}
