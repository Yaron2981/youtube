import { Component, OnInit } from '@angular/core';
// import { LocalDBService } from '../shared/services/local-db.service';
import { filter } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { EMPTY_VIDEO } from '../shared/constants/yt';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(
    private localDB: NgxIndexedDBService,
    private categoriesService: CategoriesService,
    private sharedService: SharedService
  ) {
    this.sharedService.sidebarTriggerBtn.next(false);
  }
  showHideSTBtn$ = this.sharedService.showHideSTBtn$.next(true);
  categories$ = this.categoriesService.categories$;
  categoriesLoading$ = this.categoriesService.loading$;
  video: any = EMPTY_VIDEO;
  ngOnInit(): void {
    this.localDB.getByID('videos', '1NjTWvl8x-U').subscribe((video: any) => {
      this.video = video;
      console.log(video);
    });
  }
}
