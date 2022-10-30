import { Component, OnInit } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CategoriesService } from '../categories/categories.service';
import { EMPTY_VIDEO } from '../shared/constants/yt';
import { SharedService } from '../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { nl2br, URLify } from 'src/utils/utils';
import { VideosService } from '../shared/services/videos.service';
import { Category, RelatedVideosCategories, Video } from '../search.interface';
import { of, BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(
    private localDB: NgxIndexedDBService,
    private sharedService: SharedService,
    private videosService: VideosService,
    private activatedRoute: ActivatedRoute
  ) {
    this.sharedService.sidebarTriggerBtn.next(false);
  }
  showHideSTBtn$ = this.sharedService.showHideSTBtn$.next(true);
  relatedVideosCategories$: Observable<{
    categories: Observable<Category[]>;
    videos: Observable<Video[]>;
  }> = of({ categories: of([]), videos: of([]) });
  video: any = EMPTY_VIDEO;
  v: string = '';
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams['v'].length > 0) {
      console.log(this.activatedRoute.snapshot.queryParams['v']);
      this.fetchVideoByVideoId(this.activatedRoute.snapshot.queryParams['v']);
    }
  }
  fetchVideoByVideoId(id: string) {
    this.localDB.getByID('videos', id).subscribe((video: any) => {
      if (video) {
        this.video = {
          ...this.video,
          ...video,
          ...{ description: URLify(nl2br(video.description)) },
        };
      } else {
        this.videosService.getVideoByVideoId(id).subscribe((video: Video) => {
          this.video = {
            ...this.video,
            ...video,
            ...{ description: URLify(nl2br(video.description)) },
          };
        });
        this.relatedVideosCategories$ =
          this.videosService.getRelatedVideosToVideoId(id);
      }
    });
  }
}
