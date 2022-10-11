import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  of,
  fromEvent,
  mergeMap,
  combineLatest,
  startWith,
  distinctUntilChanged,
  debounceTime,
  map,
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
      debounceTime(200),
      distinctUntilChanged(),
      map((event) => (event.target as Window).innerWidth),
      startWith(window.innerWidth)
    );
  }

  // mergeMap((width: any) => {
  //   console.log(width,trigger);
  //   this.menuTriggerBtn.next(width <= 1300 ? false : true);
  //   let nOfv = 0;
  //   if (width > 2010 && !trigger) nOfv = 6;
  //   else if (width >= 2090 && trigger) nOfv = 6;
  //   else if (width >= 1800 && !trigger) nOfv = 5;
  //   else if (width <= 1799 && width >= 1142) nOfv = 4;
  //   else if (width <= 1141 && width >= 866) nOfv = 3;
  //   else if (width <= 865 && width >= 486) nOfv = 2;
  //   else if (width <= 485) nOfv = 1;
  //   return of({ nOfv: nOfv, width: width });
  // })
}
