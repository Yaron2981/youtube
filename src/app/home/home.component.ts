import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { VideosService } from '../shared/services/videos.service';

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
    private categoriesService: CategoriesService
  ) {}

  @Input('miniSidebar') miniSidebar = false;
  ngUnsubscribe = new Subject<void>();
  categories$ = this.categoriesService.categories$;
  videos$: Observable<Video[]> = this.videosService.videosData$.category;
  videosLoading$ = this.videosService.loading$.category;
  categoriesLoading$ = this.categoriesService.loading$;
  mediaVideoSize: number = 0;

  ngOnInit() {
    console.log('init');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.videosService
      .getCategorySource()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();

    this.ref.detectChanges();
  }

  nextPage() {
    this.videosService.emitCategoryNextPage();
    this.ref.detectChanges();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
