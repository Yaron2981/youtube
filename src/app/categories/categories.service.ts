import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  tap,
  switchMap,
} from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IGNORED_CATEGORIES, YOUTUBE_CONST } from '../shared/constants/yt';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient, private localDB: NgxIndexedDBService) {}
  url = `${YOUTUBE_CONST.API_CATEGORIES_URL}?key=${YOUTUBE_CONST.API_TOKEN}&regionCode=il`;
  ignoredCategories = IGNORED_CATEGORIES;
  categories$ = this.getCategories();
  loading$ = new BehaviorSubject<boolean>(false);

  getCategories(): Observable<any> {
    return this.localDB.count('categories').pipe(
      tap(() => this.loading$.next(true)),
      switchMap((counter: any) => {
        return counter > 0
          ? this.localDB.getAll('categories')
          : this.http.get(this.url).pipe(
              tap(() => this.loading$.next(true)),
              map((response: any) => [
                { cid: 0, title: 'All' },
                ...response.items
                  .filter(
                    (rr: any) =>
                      !this.ignoredCategories.includes(parseInt(rr.id))
                  )
                  .map((item: any) => {
                    return {
                      cid: parseInt(item.id),
                      title: item.snippet.title,
                    };
                  }),
              ]),
              tap((res: any) => {
                this.loading$.next(false);
                this.localDB.bulkAdd('categories', res);
              }),
              shareReplay(1)
            );
      }),
      tap(() => this.loading$.next(false))
    );
  }
}
