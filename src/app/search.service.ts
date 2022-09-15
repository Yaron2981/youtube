import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Video } from './search.interface';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  private API_TOKEN = 'AIzaSyDzgvf6dJM0EHAjkfdjLIKyvgcMnAXP8uM';

  constructor(private http: HttpClient) {}

  getVideos(query: string = ''): Observable<Video[]> {
    const url = `${this.API_URL}?q=${query}&key=${this.API_TOKEN}&part=snippet&type=video&maxResults=10`;
    console.log(url);
    return this.http.get(url).pipe(
      map((response: any) =>
        response.items.map((item: any) => {
          console.log(item);
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
          };
        })
      )
    );
  }
}
