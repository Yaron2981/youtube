import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { SearchService } from '../shared/services/search.service';
import { media } from '../shared/helpers/media';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private searchService: SearchService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private categoriesService: CategoriesService,
    private sharedService: SharedService
  ) {}
  items = Array.from({ length: 100 }).map((_, i) => `Item #${i}`);

  @Input('miniSidebar') miniSidebar = false;
  categories$ = this.categoriesService.categories$;
  videos$: Observable<Video[]> = of([]);
  videosLoading$ = this.searchService.loading$;
  categoriesLoading$ = this.categoriesService.loading$;
  mediaVideoSize: number = 0;
  killMeObservable: Subscription = new Subscription();
  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.killMeObservable = this.searchService.getSource().subscribe();
    // this.searchService.qcid.next({ q: '', cid: 0, next: false });
    this.videos$ = this.searchService.videos$;
    this.ref.detectChanges();
    // this.sharedService
    //   .videCellsPerRowByQuery()
    //   .subscribe((x: any) => console.log(x));
  }

  nextPage(trigger: boolean) {
    this.searchService.getNextPage();
    this.ref.detectChanges();
  }
  ngOnDestroy() {
    if (this.killMeObservable) this.killMeObservable.unsubscribe();
  }
}
