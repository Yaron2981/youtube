import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, shareReplay, tap } from 'rxjs/operators';
import { Observable, mergeMap, of, combineLatest } from 'rxjs';
import { Video } from './search.interface';
import { LocalStore } from './local-store';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_CHANNEL_URL =
    'https://youtube.googleapis.com/youtube/v3/channels';
  private API_TOKEN = 'AIzaSyAihzHStyDE_PYGqEGNQjXTdmvDb2LCgdE';
  private ls = new LocalStore();
  constructor(private http: HttpClient) {}
  videoId$: Observable<boolean> = of(false);

  source$: Observable<Video[]> = this.ls.isValid(this.API_URL)
    ? of(this.ls.getData(this.API_URL))
    : this.getVideos().pipe(
        mergeMap((res) =>
          this.getChannels(res)
            .pipe(
              map((response) => {
                return res.map((r: any) => {
                  const items = response.items;
                  let channelThumbnail = items.find(
                    (re: any) => r.channelId === re.id
                  ).snippet.thumbnails.default.url;
                  return {
                    ...r,
                    channelThumbnail: channelThumbnail,
                  };
                });
              })
            )
            .pipe(tap((data) => this.ls.setData(this.API_URL, data)))
        )
      );

  getVideos(query: string = ''): Observable<any> {
    const url = `${this.API_URL}?q=${query}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=16`;
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
            youtubeUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
          };
        })
      ),
      shareReplay(1)
    );
  }

  getChannels(res: any): Observable<any> {
    console.log(res);
    const channelIds = res.map((r: any) => r.channelId).join(',');
    const url = `${this.API_CHANNEL_URL}?id=${channelIds}&key=${this.API_TOKEN}&part=snippet`;
    return this.http.get(url).pipe(shareReplay(1));
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
