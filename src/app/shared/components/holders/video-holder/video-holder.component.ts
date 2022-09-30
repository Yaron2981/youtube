import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-holder',
  templateUrl: './video-holder.component.html',
  styleUrls: ['./video-holder.component.scss'],
})
export class VideoHolderComponent implements OnInit {
  @Input('posType') posType = 'vertical';
  constructor() {}

  ngOnInit(): void {}
}
