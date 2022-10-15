import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  fromEvent,
  forkJoin,
  startWith,
  distinctUntilChanged,
  debounceTime,
  map,
  mergeMap,
  combineLatest,
  take,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SharedService {
  errorMsg: BehaviorSubject<any> = new BehaviorSubject(null);
  errorMsg$ = this.errorMsg.asObservable();

  sidebarTriggerBtn: BehaviorSubject<boolean> = new BehaviorSubject(true);
  sidebarTriggerBtn$ = this.sidebarTriggerBtn.asObservable();

  menuTriggerBtn: BehaviorSubject<boolean> = new BehaviorSubject(true);
  menuTriggerBtn$ = this.sidebarTriggerBtn.asObservable();

  resizedWindowWidth$ = this.resizedScreenWidth();

  resizedScreenWidth(): Observable<any> {
    return fromEvent(window, 'resize').pipe(
      map((event) => (event.target as Window).innerWidth),
      startWith(window.innerWidth),
      debounceTime(200),
      distinctUntilChanged()
    );
  }
  numberOfCellsByWindowSize(): Observable<number> {
    return combineLatest([
      this.resizedScreenWidth(),
      this.menuTriggerBtn$,
    ]).pipe(
      mergeMap(([width, trigger]: any) => {
        console.log([width, trigger]);
        this.menuTriggerBtn.next(width <= 1300 ? false : true);
        let nOfv = 4;
        if (width > 2130 && !trigger) nOfv = 6;
        else if (width >= 2300 && trigger) nOfv = 6;
        else if (width <= 2300 && width >= 1980 && trigger) nOfv = 5;
        else if (width <= 2300 && width >= 1800 && !trigger) nOfv = 5;
        else if (width <= 1799 && width >= 1142) nOfv = 4;
        else if (width <= 1141 && width >= 866) nOfv = 3;
        else if (width <= 865 && width >= 486) nOfv = 2;
        else if (width <= 485) nOfv = 1;
        console.log(nOfv);

        return of(nOfv);
      })
    );
  }
}
