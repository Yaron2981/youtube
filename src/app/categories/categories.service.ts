import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay, tap } from 'rxjs';
import { LocalService } from '../shared/services/local.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  url =
    'https://www.googleapis.com/youtube/v3/videoCategories?key=AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE&regionCode=il';
  ignoredCategories = [18, 21, 28, 30, 31, 33, 38, 39, 40, 41];
  categories$ = this.ls.isExsist('categories')
    ? of(this.ls.getData('categories'))
    : this.getCategories();
  loading$ = new BehaviorSubject<boolean>(false);

  getCategories(): Observable<any> {
    return this.http.get(this.url).pipe(
      tap(() => this.loading$.next(true)),
      map((response: any) => [
        { id: 0, title: 'All' },
        ...response.items
          .map((item: any) => {
            return { id: parseInt(item.id), title: item.snippet.title };
          })
          .filter((rr: any) => !this.ignoredCategories.includes(rr.id)),
      ]),
      shareReplay(1),
      tap((res: any) => {
        tap(() => this.loading$.next(false)),
          this.ls.setData('categories', res);
      })
    );
  }
  constructor(private http: HttpClient, private ls: LocalService) {}
}
