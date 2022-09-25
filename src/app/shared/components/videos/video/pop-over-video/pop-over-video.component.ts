import { Component, Input, OnInit } from '@angular/core';
import { Video } from 'src/app/search.interface';

@Component({
  selector: 'app-pop-over-video',
  templateUrl: './pop-over-video.component.html',
  styleUrls: ['./pop-over-video.component.scss'],
})
export class PopOverVideoComponent implements OnInit {
  @Input('video') video: Video | null = null;

  constructor() {}

  ngOnInit(): void {}
}
