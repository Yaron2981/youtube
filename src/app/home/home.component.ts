import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CategoriesService } from '../categories/categories.service';
import { Video } from '../search.interface';
import { SearchService } from '../shared/services/search.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(
    private searchService: SearchService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}
  items = Array.from({ length: 100 }).map((_, i) => `Item #${i}`);

  @Input('miniSidebar') miniSidebar = false;
  categories$ = this.categoriesService.categories$;
  videos$: Observable<Video[]> = of([]);
  loading$ = this.searchService.loading$;

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.searchService.qcid.next({ q: '', cid: 0 });
    this.videos$ = this.searchService.videos$;
    this.ref.detectChanges();
  }
  nextPage(trigger: boolean) {
    this.searchService.getNextPage();
    this.ref.detectChanges();
  }
}
