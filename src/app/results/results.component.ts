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
  constructor(
    private activatedRoute: ActivatedRoute,
    private videosService: VideosService
  ) {}
  ngUnsubscribe = new Subject<void>();
  paramsSubscription: Subscription | undefined;
  videos$: Observable<Video[]> = this.videosService.videosData$.query;
  q: string | null = null;
  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['search_query'].length > 0) {
      this.q = this.activatedRoute.snapshot.queryParams['search_query'];
      this.videosService.emitQueryChanged(this.q!);
    }
    this.activatedRoute.queryParamMap.subscribe(() => {
      this.videosService
        .getQuerySource()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe();
    });
  }
  nextPage() {
    if (this.q && this.q!.length > 0) this.videosService.emitQueryNextPage();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
