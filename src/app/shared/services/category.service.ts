import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, of } from 'rxjs';
import {
  mergeMap,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { LocalService } from './local.service';
import { NCategory, Video, VideosResponse } from 'src/app/search.interface';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private RESULTS_LIMIT: number = 100;
  private LIMIT: number = 50;

  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_CHANNEL_URL =
    'https://youtube.googleapis.com/youtube/v3/channels';
  private API_STATISTIC_URL = 'https://www.googleapis.com/youtube/v3/videos';
  private API_TOKEN = 'AIzaSyB7KHp81yAoioCEJInypVjd_adc0ZfAsko';

  constructor(
    private http: HttpClient,
    private ls: LocalService,
    private localDB: NgxIndexedDBService
  ) {}

  videoId$: Observable<boolean> = of(false);
  nCategory = new BehaviorSubject<NCategory>({ cid: 0, next: false });
  nCategory$: Observable<any> = this.nCategory.asObservable();
  loading$ = new BehaviorSubject<boolean>(false);
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  videos$: Observable<any> = this.obsArray.asObservable();
  nextPageToken: string | null = null;
  currentCategoryId: number = 0;
  prevCategoryId: number = 0;
  categoryIdChanged(categoryId: number) {
    this.currentCategoryId = categoryId;
    this.nCategory.next({ cid: categoryId, next: false });
  }
  getVideosByQuery(q: string) {
    this.nCategory.next({ cid: 0, next: false });
  }
  getNextPage(): void {
    this.nCategory.next({ cid: this.currentCategoryId, next: true });
  }

  getSource(): Observable<any> {
    let videosIds: string[] = [];
    return this.nCategory$.pipe(
      tap(() => {
        this.loading$.next(true);
      }),
      switchMap((nCategory: NCategory) => {
        return this.localDB
          .getByIndex('categoryLists', 'cid', nCategory.cid)
          .pipe(
            mergeMap((listData: any) => {
              if (!nCategory.next) this.obsArray.next([]);
              if (
                listData &&
                (listData.videoIds.length == this.RESULTS_LIMIT ||
                  !nCategory.next)
              ) {
                return this.localDB.bulkGet('videos', listData.videoIds).pipe(
                  tap((videos: Video[]) => {
                    if (!nCategory.next) videos = videos.slice(0, this.LIMIT);
                    this.obsArray.next(videos);
                  })
                );
              } else {
                if (listData) videosIds = listData.videoIds;
                return this.getVideos(nCategory.cid, videosIds);
              }
            }),
            take(1)
          );
      }),

      shareReplay(1),
      tap(() => {
        this.loading$.next(false);
      })
    );
  }
  getVideos(categoryId: number = 0, videosIds: any = []): Observable<any> {
    const widthCategory = categoryId > 0 ? `videoCategoryId=${categoryId}` : ``;
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
              .update('categoryLists', {
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
