import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  debounceTime,
  startWith,
  Subject,
  Subscription,
  switchMap,
  take,
} from 'rxjs';
import { LocalService } from 'src/app/shared/services/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedService } from 'src/app/shared/services/shared.service';
import { QueryService } from './query.service';
import { VideosService } from 'src/app/shared/services/videos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private queryService: QueryService,
    private ls: LocalService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private videosService: VideosService
  ) {}
  sidebarBtn = this.sharedService.sidebarTriggerBtn;
  control = new UntypedFormControl('');
  fetchtitles$ = new Subject<void>();
  routerEventSubscription!: Subscription;
  titles$ = this.fetchtitles$.pipe(
    switchMap(() => this.control.valueChanges),
    debounceTime(400),
    switchMap((val) => this.queryService.getVideosTitles(val)),
    startWith(this.ls.isExsist('search') ? this.ls.getData('search') : [])
  );
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['search_query']) {
        this.videosService.emitQueryChanged(params['search_query']);
        this.control.setValue(params['search_query']);
      }
    });
    this.router.events.pipe(take(1)).subscribe((x) => {
      this.routerEventSubscription = this.activatedRoute.queryParams.subscribe(
        (params) => {
          console.log(params);
          if (params['search_query'])
            this.control.setValue(
              this.activatedRoute.snapshot.queryParams['search_query']
            );
        }
      );
    });
  }

  eventToLink(event: MatAutocompleteSelectedEvent) {
    this.router.navigate(['/results'], {
      queryParams: { search_query: event.option.value },
    });
  }
  buttonToLink(event: Event) {
    event.stopPropagation();
    if (this.control.value && this.control.value.length > 0) {
      this.videosService.emitQueryChanged(this.control.value);
      this.router.navigate(['/results'], {
        queryParams: { search_query: this.control.value },
      });
    }
  }
  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }
}
