import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  mergeMap,
  distinct,
  filter,
  map,
  shareReplay,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { YOUTUBE_CONST } from '../../shared/constants/yt';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  private API_TOKEN = 'AIzaSyB7KHp81yAoioCEJInypVjd_adc0ZfAsko';

  constructor(private http: HttpClient, private localDB: NgxIndexedDBService) {}

  getVideosTitles(q: string): Observable<any> {
    q = q.trim();
    return of(q).pipe(
      debounceTime(200),
      distinctUntilChanged((curr: string, prev: string) => {
        return curr.toLowerCase() === prev.toLowerCase();
      }),
      switchMap((text: string) => {
        return this.localDB.getByID('search', text).pipe(
          mergeMap((listData: any) => {
            if (listData) {
              return of(listData.titles);
            } else {
              const url = `${YOUTUBE_CONST.API_SEARCH_URL}?q=${q}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=14&regionCode=il&relevanceLanguage=he`;
              return this.http.get(url).pipe(
                map((response: any) => {
                  let x = [
                    ...new Set(
                      response.items.map((item: any) =>
                        item.snippet.title
                          .toLowerCase()
                          .match(/[\p{L}]+/gu)
                          .slice(0, 3)
                          .join(' ')
                          .trim()
                      )
                    ),
                  ];
                  console.log(x);
                  return x;
                }),
                distinct(),
                filter((t: any) => t != ''),
                tap((res: string[]) => {
                  this.localDB
                    .update('search', { q: q, titles: res })
                    .subscribe();
                }),
                shareReplay(1)
              );
            }
          })
        );
      })
    );
  }
}
