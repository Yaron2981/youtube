import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { VideosService } from '../shared/services/videos.service';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private videosService: VideosService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private categoriesService: CategoriesService,
    private sharedService: SharedService
  ) {}

  @Input('miniSidebar') miniSidebar = false;
  ngUnsubscribe = new Subject<void>();
  categories$ = this.categoriesService.categories$;
  videos$: Observable<Video[]> = this.videosService.videosData$.category;
  categoriesLoading$ = this.categoriesService.loading$;
  mediaVideoSize: number = 0;
  currentvideosLoading: boolean = false;
  allowScrolling: boolean = true;
  videosInRow: number = 4;
  ngOnInit() {
    this.sharedService.numberOfCellsByWindowSize().subscribe((vir) => {
      this.videosInRow = vir;
      this.ref.detectChanges();
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.videosService
      .getCategorySource()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  nextPage() {
    console.log('before return');
    if (this.currentvideosLoading) return;
    console.log('after return');
    this.videosService.emitCategoryNextPage();
    this.ref.detectChanges();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
