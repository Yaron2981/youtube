import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Observable, of, Subscription, take } from 'rxjs';
import { Video } from '../search.interface';
import { SearchService } from '../shared/services/search.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  @Input('miniSidebar') miniSidebar = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
    private router: Router
  ) {}
  paramsSubscription: Subscription | undefined;
  videos$: Observable<Video[]> = of([]);
  loading$ = this.searchService.loading$;

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(() => {
      this.searchService.getVideosByQuery(
        this.activatedRoute.snapshot.queryParams['search_query']
      );
      this.videos$ = this.searchService.getSource();
    });
  }
}
