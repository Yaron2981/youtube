import { Component, Input, OnInit } from '@angular/core';
import { Video } from 'src/app/search.interface';
import { YOUTUBE_CONST } from 'src/app/shared/constants/yt';

@Component({
  selector: 'app-related-video-list',
  templateUrl: './related-video-list.component.html',
  styleUrls: ['./related-video-list.component.scss'],
})
export class RelatedVideoListComponent implements OnInit {
  @Input('video') video: Video | null = null;
  YT = YOUTUBE_CONST;
  constructor() {}
  ngOnInit(): void {
    console.log(this.video);
  }
}
