import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-videos-holder',
  templateUrl: './videos-holder.component.html',
  styleUrls: ['./videos-holder.component.scss'],
})
export class VideosHolderComponent implements OnInit {
  @Input('posType') posType: string = 'vertical';
  @Input('videoFlexSize') videoFlexSize: number | null = 100;
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  constructor() {}

  ngOnInit(): void {}
}
