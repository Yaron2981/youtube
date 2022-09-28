import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable } from 'rxjs';
import { Video } from 'src/app/search.interface';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosComponent implements OnInit, AfterViewInit {
  @Input('videos') videos$: Observable<Video[]> = new BehaviorSubject<Video[]>(
    []
  );
  @Input('miniSidebar') miniSidebar = false;
  @Input('posType') posType = 'vertical';
  videoFlexSize: number | undefined;

  ngOnInit() {
    this.videoFlexSize =
      this.posType == 'horizontal' ? 80 : this.miniSidebar ? 18.5 : 22.5;
  }
  ngAfterViewInit() {
    const content: HTMLElement | null = document.querySelector('.items');
    let scroll$ = fromEvent(content!, 'scroll')
      .pipe(
        map(() => {
          return content!.scrollTop;
        })
      )
      .subscribe((x) => console.log('ddd', x));
  }
}
