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
  ) {
    this.getNextPage();
  }
  videoIds = [
    'jGeX8jSHiTU',
    'gtbUB1XPW_o',
    'BHJZQ70JQNQ',
    'dz6rcaUaVsQ',
    'dKBvBA-4gFo',
    'Hg1dgrIA2Ck',
    'Sj-M9Rj_Ijo',
    'oSFSMlX-190',
    'cbibjU9O4ME',
    '3xQY_HuJUx8',
    '7cWjBCl2daU',
    '6khvyAE6y54',
    'peHWvDzPonQ',
    'bWM8IwiusJ4',
    'Dx1GJic6hAs',
    '-vPhCtCHDs0',
    'Cx25dyEnO8Y',
    'tEwvUu1dBTs',
    '5odH45KGUWE',
    'bTUV1EsJOoU',
    'RNmhPcTCinU',
    'WxUCJbYNraI',
    'CBTZTWctPo8',
    'JycoC01UD1c',
  ];
  videoId$: Observable<boolean> = of(false);
  qcid = new BehaviorSubject<QCid>({ q: '', cid: 0 });
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
    this.qcid.next({ q: '', cid: categoryId });
    // this.getSource();
  }
  getVideosByQuery(q: string) {
    this.qcid.next({ q: q, cid: 0 });
  }
  getNextPage(): void {
    // this.getSource().subscribe();
    if (this.prevCategoryId != this.currentCategoryId) {
      this.getSource().subscribe((data) => this.obsArray.next(data));
      this.prevCategoryId = this.currentCategoryId;
    } else {
      forkJoin([this.videos$.pipe(take(1)), this.getSource()]).subscribe({
        next: (data: Array<Array<Video>>) => {
          let newArr: Video[] = [];
          newArr = [...data[0], ...data[1]];
          this.obsArray.next(newArr);
        },
      });
    }
  }

  getSource(): Observable<any> {
    let videosIds: string[] = [];
    return this.qcid$.pipe(
      tap(() => {
        console.log('trigger');
        this.loading$.next(true);
      }),
      switchMap((qcid) =>
        this.localDB.count('lists', qcid.cid).pipe(
          mergeMap((counter: number) => {
            if (counter > 0) {
              return this.localDB
                .getByID('lists', qcid.cid)
                .pipe(
                  mergeMap((res: any) =>
                    this.localDB
                      .bulkGet('videos', res.videoIds)
                      .pipe(
                        tap((videos: Video[]) => this.obsArray.next(videos))
                      )
                  )
                );
            } else
              return this.getVideos(qcid.q, qcid.cid).pipe(
                mergeMap((res: VideosResponse) =>
                  forkJoin([
                    this.getChannels(res),
                    this.getVideoStatistics(res.items),
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
                      console.log(qcid.cid, videosIds);
                      this.localDB
                        .update('lists', {
                          cid: qcid.cid,
                          videoIds: videosIds,
                        })
                        .subscribe();
                      videos.forEach((e) => {
                        this.localDB.update('videos', e).subscribe();
                      });
                    })
                  )
                )
              );
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
    const url = `${this.API_URL}?q=${q}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=14&regionCode=il&relevanceLanguage=he`;
    return this.http.get(url).pipe(
      map((response: any) =>
        response.items.map((item: any) =>
          item.snippet.title
            .toLowerCase()
            .match(/[\p{L}]+/gu)
            .slice(0, 3)
            .join(' ')
            .trim()
        )
      ),
      distinct(),
      filter((t: string) => t != ''),
      tap((res) => this.ls.setData('search', res)),
      shareReplay(1)
    );
  }
  getVideos(query: string = '', categoryId: number = 0): Observable<any> {
    const affix =
      categoryId > 0 ? `videoCategoryId=${categoryId}` : `q=${query}`;
    const pageToken = this.nextPageToken
      ? `&pageToken=${this.nextPageToken}`
      : '';
    const url = `${this.API_URL}?${affix}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=24&regionCode=il${pageToken}`;
    return this.http.get<VideosResponse>(url).pipe(
      map((response: VideosResponse) => {
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
              showPop: false,
              showPlayer: false,
            };
          }),
        };
      }),
      shareReplay(1)
    );
  }

  getChannels(res: any): Observable<any> {
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
  getVideoStatistics(res: any): Observable<any> {
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
          statistics[r.videoId] = {
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
