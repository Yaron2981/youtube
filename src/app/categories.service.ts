import { HttpClient } from '@angular/common/http';
import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { filter, map, Observable, of, shareReplay, tap } from 'rxjs';
import { LocalStore } from './local-store';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  url =
    'https://www.googleapis.com/youtube/v3/videoCategories?key=AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE&regionCode=il';
  private ls = new LocalStore();
  ignoredCategories = [18, 21, 28, 30, 31, 33, 38, 39, 40, 41];
  categories$ = this.ls.isValid('categories')
    ? of(this.ls.getData('categories'))
    : this.getCategories();

  getCategories(): Observable<any> {
    return this.http.get(this.url).pipe(
      map((response: any) => [
        { id: 0, title: 'All' },
        ...response.items
          .map((item: any) => {
            return { id: parseInt(item.id), title: item.snippet.title };
          })
          .filter((rr: any) => !this.ignoredCategories.includes(rr.id)),
      ]),
      shareReplay(1),
      tap((res: any) => this.ls.setData('categories', res))
    );
  }
  constructor(private http: HttpClient) {}
}
