import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Video } from 'src/app/search.interface';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideosComponent {
  @Input('videos') videos$: Observable<Video[]> = new BehaviorSubject<Video[]>(
    []
  );
  @Input('miniSidebar') miniSidebar = false;
}
