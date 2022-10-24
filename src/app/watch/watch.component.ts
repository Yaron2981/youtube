import { Component, OnInit } from '@angular/core';
// import { LocalDBService } from '../shared/services/local-db.service';
import { filter } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { EMPTY_VIDEO } from '../shared/constants/yt';
import { SharedService } from '../shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { nl2br, URLify } from 'src/utils/utils';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(
    private localDB: NgxIndexedDBService,
    private categoriesService: CategoriesService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute
  ) {
    this.sharedService.sidebarTriggerBtn.next(false);
  }
  showHideSTBtn$ = this.sharedService.showHideSTBtn$.next(true);
  categories$ = this.categoriesService.categories$;
  categoriesLoading$ = this.categoriesService.loading$;
  video: any = EMPTY_VIDEO;
  v: string = '';
  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams['v'].length > 0) {
      console.log(this.activatedRoute.snapshot.queryParams['v']);
      this.fetchVideoByVideoId(this.activatedRoute.snapshot.queryParams['v']);
    }
    // this.activatedRoute.queryParamMap.subscribe((params) => {
    // });
  }
  fetchVideoByVideoId(id: string) {
    this.localDB.getByID('videos', id).subscribe((video: any) => {
      this.video = {
        ...this.video,
        ...video,
        ...{ description: URLify(nl2br(video.description)) },
      };
      console.log(video);
    });
  }
}
