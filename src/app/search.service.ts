import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, shareReplay, tap } from 'rxjs/operators';
import {
  Observable,
  mergeMap,
  of,
  combineLatest,
  forkJoin,
  ConnectableObservable,
} from 'rxjs';
import { Video } from './search.interface';
import { LocalStore } from './local-store';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_CHANNEL_URL =
    'https://youtube.googleapis.com/youtube/v3/channels';
  private API_STATISTIC_URL = 'https://www.googleapis.com/youtube/v3/videos';
  private API_TOKEN = 'AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE';
  private ls = new LocalStore();
  private SEARCH_PREFIX = 'q:';
  constructor(private http: HttpClient) {}
  videoId$: Observable<boolean> = of(false);

  source$: Observable<Video[]> = this.ls.isValid(this.API_URL)
    ? of(this.ls.getData(this.SEARCH_PREFIX))
    : this.getVideos().pipe(
        mergeMap((res: any) =>
          forkJoin([this.getChannels(res), this.getVideoStatistics(res)]).pipe(
            map((r: any) => {
              return res.map((re: any) => {
                return {
                  ...re,
                  viewCount: r[1][re.videoId],
                  channelThumbnail: r[0][re.channelId],
                };
              });
            }),
            tap((data: any) => this.ls.setData(this.SEARCH_PREFIX, data))
          )
        )
      );

  getVideos(query: string = ''): Observable<any> {
    const url = `${this.API_URL}?q=${query}&key=${this.API_TOKEN}&part=snippet&type=video&type=channel&maxResults=16`;
    console.log(url);
    return this.http.get(url).pipe(
      map((response: any) =>
        response.items.map((item: any) => {
          return {
            videoId: item.id.videoId,
            videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            channelId: item.snippet.channelId,
            channelUrl: `https://www.youtube.com/channel/${item.snippet.channelId}`,
            channelTitle: item.snippet.channelTitle,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            showPop: false,
          };
        })
      ),
      shareReplay(1)
    );
  }

  getChannels(res: any): Observable<any> {
    const channelIds = [...new Set(res.map((r: any) => r.channelId))].join(',');
    const url = `${this.API_CHANNEL_URL}?id=${channelIds}&key=${this.API_TOKEN}&part=snippet`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const thumbnails: any = {};
        res.forEach((r: any) => {
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
    const url = `${this.API_STATISTIC_URL}?id=${videoIds}&key=${this.API_TOKEN}&part=statistics`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const statistics: any = {};
        res.forEach((r: any) => {
          statistics[r.videoId] = response.items.find(
            (re: any) => r.videoId === re.id
          ).statistics.viewCount;
        });
        return statistics;
      }),
      shareReplay(1)
    );
  }

  updateShowPop(videoId: string, status: boolean) {
    console.log('update:' + videoId);
    return this.source$.pipe(
      map((video: any) => {
        video.showPop = video.videoId === videoId ? status : false;
        return video;
      })
    );
  }
}
