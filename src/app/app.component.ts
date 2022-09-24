import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of, pipe, Subject } from 'rxjs';
import { startWith, map, switchMap, debounceTime, tap } from 'rxjs/operators';
import { LocalStore } from './local-store';
import { Video } from './search.interface';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private searchService: SearchService) {}
  PBCounter: number = 0;
  showFiller: boolean = true;
  drawer: boolean = true;
  control = new UntypedFormControl('');
  filteredStreets: Observable<string[]> | null = null;
  videos$: Observable<Video[]> = this.searchService.getSource();
  private ls = new LocalStore();
  fetchtitles$ = new Subject<void>();

  titles$ = this.fetchtitles$.pipe(
    switchMap(() => this.control.valueChanges),
    debounceTime(400),
    switchMap((val) => this.searchService.getVideosTitles(val)),
    startWith(this.ls.isValid('search') ? this.ls.getData('search') : []),

    tap((res) => console.log(res))
  );
  public fetchTitles() {
    console.log('ddd');
    this.fetchtitles$.next();
  }
}
