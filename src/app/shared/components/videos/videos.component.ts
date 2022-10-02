import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable, of } from 'rxjs';
import { Video } from 'src/app/search.interface';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosComponent implements OnInit, AfterViewInit {
  @Input('videos') videos$: Observable<Video[]> = new BehaviorSubject<Video[]>(
    []
  );

  @Input('miniSidebar') miniSidebar = false;
  @Input('posType') posType: string = 'vertical';
  @Input('loading') loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  videoFlexSize: number | null =
    this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;

  ngOnInit() {
    this.videoFlexSize =
      this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;
  }
  ngAfterViewInit() {
    let scroll$ = fromEvent(
      document.querySelector('.items')!,
      'scroll'
    ).subscribe((x) => console.log('ddd', x));
  }
}
