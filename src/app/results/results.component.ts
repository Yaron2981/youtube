import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, Subject, takeUntil } from 'rxjs';
import { Video } from '../search.interface';
import { VideosService } from '../shared/services/videos.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  @Input('miniSidebar') miniSidebar = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private videosService: VideosService
  ) {}
  ngUnsubscribe = new Subject<void>();
  paramsSubscription: Subscription | undefined;
  videos$: Observable<Video[]> = this.videosService.videosData$.query;

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['search_query'].length > 0)
      this.videosService.emitVideosByQuery(
        this.activatedRoute.snapshot.queryParams['search_query']
      );
    this.activatedRoute.queryParamMap.subscribe(() => {
      this.videosService
        .getQuerySource()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
