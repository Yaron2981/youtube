import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Observable, mergeMap, of, forkJoin, BehaviorSubject } from 'rxjs';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_CHANNEL_URL =
    'https://youtube.googleapis.com/youtube/v3/channels';
  private API_STATISTIC_URL = 'https://www.googleapis.com/youtube/v3/videos';
  private API_TOKEN = 'AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE';
  constructor(private http: HttpClient, private ls: LocalService) {}
  videoId$: Observable<boolean> = of(false);
  qcid = new BehaviorSubject<{
    q: string;
    cid: number;
  }>({
    q: '',
    cid: 0,
  });
  qcid$ = this.qcid.asObservable();
  // source$: Observable<Video[]> =
  categoryIdChanged(categoryId: number) {
    this.qcid.next({ q: '', cid: categoryId });
  }
  getVideosByQuery(q: string) {
    this.qcid.next({ q: q, cid: 0 });
  }
  getSource() {
    return this.qcid$.pipe(
      // distinctUntilChanged(),
      switchMap((qcid) =>
        this.ls.isExsist(qcid.q + qcid.cid)
          ? of(this.ls.getData(qcid.q + qcid.cid))
          : this.getVideos(qcid.q, qcid.cid).pipe(
              mergeMap((res: any) =>
                forkJoin([
                  this.getChannels(res),
                  this.getVideoStatistics(res),
                ]).pipe(
                  map((r: any) => {
                    return res.map((re: any) => {
                      return {
                        ...re,
                        viewCount: r[1][re.videoId].viewCount,
                        duration: r[1][re.videoId].duration,
                        channelThumbnail: r[0][re.channelId],
                      };
                    });
                  }),
                  tap((data: any) => this.ls.setData(qcid.q + qcid.cid, data))
                )
              )
            )
      )
    );
  }
  getVideosTitles(q: string): Observable<any> {
    const url = `${this.API_URL}?q=${q}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=14&regionCode=il`;
    return this.http.get(url).pipe(
      map((response: any) =>
        response.items.map((item: any) =>
          item.snippet.title
            .toLowerCase()
            .replace(/[\W_]+/gu, ' ')
            .split(' ')
            .slice(0, 3)
            .join(' ')
        )
      ),
      tap((res) => this.ls.setData('search', res)),
      shareReplay(1)
    );
  }
  getVideos(query: string, categoryId: number): Observable<any> {
    const affix =
      categoryId > 0 ? `videoCategoryId=${categoryId}` : `q=${query}`;
    const url = `${this.API_URL}?${affix}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=16`;
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
