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
import { SearchService } from '../../shared/services/search.service';
import { LocalService } from 'src/app/shared/services/local.service';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Params, Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private searchService: SearchService,
    private ls: LocalService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  @Input('miniSidebar') miniSidebar = false;
  @Output() miniSideTriggerEvent = new EventEmitter<boolean>();
  control = new UntypedFormControl('');
  fetchtitles$ = new Subject<void>();
  routerEventSubscription!: Subscription;
  titles$ = this.fetchtitles$.pipe(
    switchMap(() => this.control.valueChanges),
    debounceTime(400),
    switchMap((val) => this.searchService.getVideosTitles(val)),
    startWith(this.ls.isExsist('search') ? this.ls.getData('search') : [])
  );
  ngOnInit() {
    this.router.events.pipe(take(1)).subscribe((x) => {
      this.routerEventSubscription = this.activatedRoute.queryParams.subscribe(
        (params) => {
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
      this.router.navigate(['/results'], {
        queryParams: { search_query: this.control.value },
      });
    }
  }
  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }
}
