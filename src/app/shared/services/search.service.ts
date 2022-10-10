import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  delay,
  distinct,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Observable, mergeMap, of, forkJoin, BehaviorSubject } from 'rxjs';
import { LocalService } from './local.service';
import {
  Channel,
  QCid,
  Statistic,
  Video,
  VideosResponse,
} from 'src/app/search.interface';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private RESULTS_LIMIT: number = 100;
  private LIMIT: number = 50;

  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_CHANNEL_URL =
    'https://youtube.googleapis.com/youtube/v3/channels';
  private API_STATISTIC_URL = 'https://www.googleapis.com/youtube/v3/videos';
  private API_TOKEN = 'AIzaSyB7KHp81yAoioCEJInypVjd_adc0ZfAsko';
  // private API_TOKEN = [
  //   'AIzaSyDzgvf6dJM0EHAjkfdjLIKyvgcMnAXP8uM',
  //   'AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE',
  //   'AIzaSyB7KHp81yAoioCEJInypVjd_adc0ZfAsko',
  // ][Math.floor(Math.random() * 3)];
  constructor(
    private http: HttpClient,
    private ls: LocalService,
    private localDB: NgxIndexedDBService
  ) {}

  videoId$: Observable<boolean> = of(false);
  qcid = new BehaviorSubject<QCid>({ q: '', cid: 0, next: false });
  qcid$: Observable<any> = this.qcid.asObservable();
  loading$ = new BehaviorSubject<boolean>(false);
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  videos$: Observable<any> = this.obsArray.asObservable();
  nextPageToken: string | null = null;
  currentCategoryId: number = 0;
  prevCategoryId: number = 0;
  // source$: Observable<Video[]> =
  categoryIdChanged(categoryId: number) {
    this.currentCategoryId = categoryId;
    this.qcid.next({ q: '', cid: categoryId, next: false });
    // this.getSource();
  }
  getVideosByQuery(q: string) {
    this.qcid.next({ q: q, cid: 0, next: false });
  }
  getNextPage(): void {
    this.qcid.next({ q: '', cid: this.currentCategoryId, next: true });
    // // this.getSource().subscribe();
    // if (this.prevCategoryId != this.currentCategoryId) {
    //   this.getSource().pipe(tap((data) => this.obsArray.next(data)));
    //   this.prevCategoryId = this.currentCategoryId;
    // } else {
    //   forkJoin([this.videos$.pipe(take(1)), this.getSource()]).subscribe({
    //     next: (data: Array<Array<Video>>) => {
    //       let newArr: Video[] = [];
    //       newArr = [...data[0], ...data[1]];
    //       this.obsArray.next(newArr);
    //     },
    //   });
    // }
  }

  getSource(): Observable<any> {
    console.log('source');
    let videosIds: string[] = [];
    return this.qcid$.pipe(
      tap(() => {
        this.loading$.next(true);
      }),
      switchMap((qcid) =>
        this.localDB.getByID('lists', qcid.cid).pipe(
          mergeMap((listData: any) => {
            console.log('trigger', listData, qcid);

            if (
              listData &&
              (listData.videoIds.length == this.RESULTS_LIMIT || !qcid.next)
            ) {
              return this.localDB.bulkGet('videos', listData.videoIds).pipe(
                tap((videos: Video[]) => {
                  if (!qcid.next) videos = videos.slice(0, this.LIMIT);
                  this.obsArray.next(videos);
                })
              );
            } else {
              if (listData) videosIds = listData.videoIds;
              return this.getVideos(qcid.q, qcid.cid, videosIds);
            }
          }),
          take(1)
        )
      ),

      shareReplay(1),
      tap(() => {
        this.loading$.next(false);
      })
    );
  }
  getVideosTitles(q: string): Observable<any> {
    return this.localDB.getByID('search', q).pipe(
      mergeMap((listData: any) => {
        if (listData) {
          return of(listData.titles);
        } else {
          const url = `${this.API_URL}?q=${q}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=14&regionCode=il&relevanceLanguage=he`;
          return this.http.get(url).pipe(
            map((response: any) => {
              return response.items.map((item: any) =>
                item.snippet.title
                  .toLowerCase()
                  .match(/[\p{L}]+/gu)
                  .slice(0, 3)
                  .join(' ')
                  .trim()
              );
            }),
            distinct(),
            filter((t: string) => t != ''),
            tap((res) => {
              this.localDB.update('search', { q: q, titles: res });
            }),
            shareReplay(1)
          );
        }
      })
    );
  }
  getVideos(
    query: string = '',
    categoryId: number = 0,
    videosIds: any = []
  ): Observable<any> {
    const widthCategory =
      categoryId > 0 ? `videoCategoryId=${categoryId}` : `q=${query}`;
    const pageToken = this.nextPageToken
      ? `&pageToken=${this.nextPageToken}`
      : '';
    const url = `${this.API_URL}?${widthCategory}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=${this.LIMIT}&regionCode=il${pageToken}`;
    return this.http.get<VideosResponse>(url).pipe(
      map((response: any) => {
        return {
          ...response,
          items: response.items.map((item: any) => {
            this.nextPageToken = response.nextPageToken;
            return {
              videoId: item.id.videoId,
              channelId: item.snippet.channelId,
              channelTitle: item.snippet.channelTitle,
              title: item.snippet.title,
              publishedAt: item.snippet.publishedAt,
              description: item.snippet.description,
              thumbnail: item.snippet.thumbnails.medium.url,
            };
          }),
        };
      }),
      mergeMap((res: VideosResponse) =>
        forkJoin([
          this.getChannelsInfo(res),
          this.getVideoStatisticsInfo(res.items),
        ]).pipe(
          map((r: any) => {
            return res.items.map((re: Video) => {
              videosIds.push(re.videoId);

              return {
                ...re,
                viewCount: r[1][re.videoId].viewCount,
                duration: r[1][re.videoId].duration,
                channelThumbnail: r[0][re.channelId],
              };
            });
          }),
          tap((videos: Video[]) => {
            this.obsArray.next(videos);
            this.localDB
              .update('lists', {
                cid: categoryId,
                lastPage: this.nextPageToken,
                videoIds: [
                  ...new Set([...videosIds, ...videos.map((v) => v.videoId)]),
                ],
              })
              .subscribe();
            videos.forEach((e) => {
              this.localDB.update('videos', e).subscribe();
            });
          })
        )
      ),
      shareReplay(1)
    );
  }

  getChannelsInfo(res: any): Observable<any> {
    const channelIds = [
      ...new Set(res.items.map((r: any) => r.channelId)),
    ].join(',');
    const url = `${this.API_CHANNEL_URL}?id=${channelIds}&key=${this.API_TOKEN}&part=snippet`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const thumbnails: any = {};
        res.items.forEach((r: any) => {
          thumbnails[r.channelId] = response.items.find(
            (re: any) => r.channelId === re.id
          ).snippet.thumbnails.default.url;
        });
        return thumbnails;
      }),
      shareReplay(1)
    );
  }
  getVideoStatisticsInfo(res: any): Observable<any> {
    const videoIds = [...new Set(res.map((r: any) => r.videoId))].join(',');
    const url = `${this.API_STATISTIC_URL}?id=${videoIds}&key=${this.API_TOKEN}&part=statistics,contentDetails`;
    console.log(url);
    return this.http.get(url).pipe(
      map((response: any) => {
        const statistics: any = {};
        res.forEach((r: any) => {
          const videoById = response.items.find(
            (re: any) => r.videoId === re.id
          );
          //convert youtube duration to seconds
          const duration = videoById.contentDetails.duration
            .match(/PT(?:(\d*)H)?(?:(\d*)M)?(?:(\d*)S)?/)
            .slice(1)
            .map((v: []) => (!v ? 0 : v))
            .reverse()
            .reduce(
              (acc: number, v: number, k: number) => (acc += v * 60 ** k),
              0
            );
          statistics[r.videoId as string] = {
            viewCount: videoById.statistics.viewCount,
            duration: duration,
          };
        });
        return statistics;
      }),
      shareReplay(1)
    );
  }
}
