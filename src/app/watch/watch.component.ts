import { Component, OnInit } from '@angular/core';
// import { LocalDBService } from '../shared/services/local-db.service';
import { filter } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { EMPTY_VIDEO } from '../shared/constants/yt';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss'],
})
export class WatchComponent implements OnInit {
  constructor(
    private localDB: NgxIndexedDBService,
    private categoriesService: CategoriesService
  ) {}
  categories$ = this.categoriesService.categories$;
  categoriesLoading$ = this.categoriesService.loading$;
  video: Video = EMPTY_VIDEO;
  ngOnInit(): void {
    this.localDB.getByID('videos', '0Ax7Cmjbc9A').subscribe((video: any) => {
      this.video = video;
      console.log(video);
    });
  }
}
