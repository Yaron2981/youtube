import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  url =
    'https://www.googleapis.com/youtube/v3/videoCategories?key=AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE&regionCode=il';
  ignoredCategories = [18, 21, 28, 30, 31, 33, 38, 39, 40, 41];
  categories$ = this.getCategories();
  loading$ = new BehaviorSubject<boolean>(false);
  getCategories(): Observable<any> {
    return this.localDB.count('categories').pipe(
      switchMap((counter: any) => {
        return counter > 0
          ? this.localDB.getAll('categories')
          : this.http.get(this.url).pipe(
              tap(() => this.loading$.next(true)),
              map((response: any) => [
                { cid: 0, title: 'All' },
                ...response.items
                  .map((item: any) => {
                    return {
                      cid: parseInt(item.id),
                      title: item.snippet.title,
                    };
                  })
                  .filter((rr: any) => !this.ignoredCategories.includes(rr.id)),
              ]),
              shareReplay(1),
              tap((res: any) => {
                this.loading$.next(false);
                this.localDB.bulkAdd('categories', res);
              })
            );
      })
    );
  }
  constructor(private http: HttpClient, private localDB: NgxIndexedDBService) {}
}
