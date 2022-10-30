import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, forkJoin, of, throwError } from 'rxjs';
import {
  mergeMap,
  map,
  shareReplay,
  switchMap,
  tap,
  retry,
} from 'rxjs/operators';
import {
  NCategory,
  NQCategory,
  NQuery,
  Video,
  videoData,
  VideoDataType,
  VideosResponse,
} from 'src/app/search.interface';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { EMPTY_VIDEO, RESULTS, YOUTUBE_CONST } from '../constants/yt';
import { ytDurationToSec } from 'src/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  constructor(private http: HttpClient, private localDB: NgxIndexedDBService) {}
  pageNumber = 0;
  videoId$: Observable<boolean> = of(false);
  nCategory$ = new BehaviorSubject<NCategory>({ cid: 0, page: 0 });
  nQuery$ = new BehaviorSubject<NQuery>({ q: '', page: 0 });
  videoData: videoData = {
    category: { data: [], page: 0 },
    query: { data: [], page: 0 },
  };
  videosData$ = {
    category: new BehaviorSubject<Video[]>([]),
    query: new BehaviorSubject<Video[]>([]),
  };
  nextPageToken: string | null = null;

  categoryId: number = 0;

  query: string = '';

  _setNewHolderData(startFrom: number = 0): any[] {
    return [...Array(RESULTS.LIMIT).keys()].map((vl: any, k: number) => ({
      ...EMPTY_VIDEO,
      id: startFrom + k,
    }));
  }
  emitCategoryChanged(categoryId: number) {
    this.categoryId = categoryId;
    this.nCategory$.next({ cid: categoryId, page: 0 });
  }
  emitQueryChanged(q: string) {
    this.query = q;
    this.nQuery$.next({ q: q, page: 0 });
  }
  emitCategoryNextPage(): void {
    this.videoData.category.page = this.videoData.category.page + 1;
    this.nCategory$.next({
      cid: this.categoryId,
      page: this.videoData.category.page,
    });
  }
  emitQueryNextPage(): void {
    this.nQuery$.next({
      q: this.query,
      page: (this.videoData.query.page = +1),
    });
  }

  getCategorySource(): Observable<Video[]> {
    return this._getSource('category', this.nCategory$);
  }
  getQuerySource(): Observable<Video[]> {
    return this._getSource('query', this.nQuery$);
  }
  _getSource(type: VideoDataType, listener: Observable<any>): Observable<any> {
    return listener.pipe(
      switchMap((nqc: NQCategory) => {
        if (nqc.page > 0) {
          this._setData(
            type,
            this._setNewHolderData(nqc.page * RESULTS.LIMIT),
            'push'
          );
        } else this._setData(type, this._setNewHolderData(0), 'new');
        const searchBy =
          nqc.q && nqc.q.length > 0
            ? { store: 'searchLists', indexName: 'q', key: nqc.q }
            : { store: 'categoryLists', indexName: 'cid', key: nqc.cid };
        return this.localDB
          .getByIndex(searchBy.store, searchBy.indexName, searchBy.key)
          .pipe(
            mergeMap((listData: any) => {
              if (
                listData &&
                listData.videoIds.length >
                  RESULTS.LIMIT * nqc.page + RESULTS.LIMIT
              ) {
                return this.localDB.bulkGet('videos', listData.videoIds).pipe(
                  tap((videos: Video[]) => {
                    console.log(nqc.page, videos);

                    if (nqc.page > 0) {
                      videos = videos.slice(
                        RESULTS.LIMIT * nqc.page,
                        RESULTS.LIMIT + RESULTS.LIMIT * nqc.page
                      );
                      this._setData(type, videos, 'merge');
                    } else {
                      videos = videos.slice(0, RESULTS.LIMIT);
                      this._setData(type, videos, 'merge');
                    }
                  })
                );
              } else {
                return this._getVideos(listData, type, nqc.q, nqc.cid).pipe(
                  tap((videos) => {
                    if (nqc.page > 0) this._setData(type, videos, 'merge');
                    else this._setData(type, videos, 'merge');
                  })
                );
              }
            })
            // take(1)
          );
      }),
      shareReplay(1)
    );
  }

  _setData(type: VideoDataType, videos: Video[], trigger: string) {
    switch (trigger) {
      case 'new':
        this.videoData[type].data = videos;
        break;
      case 'push':
        if (!this.videoData[type].data.find((vd) => vd.videoId === null))
          this.videoData[type].data = this.videoData[type].data.concat(videos);
        break;
      case 'merge':
        let videoIds: any = [];

        this.videoData[type].data = this.videoData[type].data
          .map((video) => {
            return video.videoId
              ? video
              : { ...video, ...(videos.shift() as Video) };
          })
          //remove dupliacate from youtube API repeated videos
          .filter((v) => {
            if (videoIds.includes(v.videoId)) return false;
            else {
              videoIds.push(v.videoId);
              return v;
            }
          });
        break;
    }

    this.videoData[type].data = this.videoData[type].data.map((video) => {
      return {
        ...video,
        ...{
          loader: {
            thumbnail: false,
            channelThumbnail: false,
            content: false,
          },
        },
      };
    });
    this.videosData$[type].next(this.videoData[type].data);
  }
  _getVideos(
    listData: any,
    type: VideoDataType,
    query: string = '',
    categoryId: number = 0
  ): Observable<any> {
    let videoIds = this.videoData[type].data
      .filter((vd) => vd.videoId)
      .map((vd) => vd.videoId);
    const withCategory =
      categoryId > 0 ? `videoCategoryId=${categoryId}` : `q=${query}`;
    const pageToken = this.nextPageToken
      ? `&pageToken=${this.nextPageToken}`
      : '';
    const url = `${YOUTUBE_CONST.API_SEARCH_URL}?${withCategory}&key=${YOUTUBE_CONST.API_TOKEN}&part=snippet&type=video&maxResults=${RESULTS.LIMIT}&regionCode=il${pageToken}`;
    return this.http.get<VideosResponse>(url).pipe(
      tap((res) => console.log('VideosResponsedd', res)),
      map((response: any) => ({
        ...response,
        items: response.items.map((item: any) => {
          this.nextPageToken = response.nextPageToken;
          return {
            videoId: item.id.videoId,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            title: item.snippet.title,
            publishedAt: item.snippet.publishedAt,
            thumbnail: item.snippet.thumbnails.medium.url,
          };
        }),
      })),
      mergeMap((res: VideosResponse) =>
        forkJoin([
          this._getChannelsInfo(res),
          this._getVideoStatisticsInfo(res.items),
        ]).pipe(
          map((r: any) => {
            return res.items.map((re: Video) => {
              videoIds.push(re.videoId);
              return {
                ...re,
                commentCount: parseInt(r[1][re.videoId].commentCount),
                favoriteCount: parseInt(r[1][re.videoId].favoriteCount),
                likeCount: parseInt(r[1][re.videoId].likeCount),
                viewCount: parseInt(r[1][re.videoId].viewCount),
                dislikeCount: parseInt(r[1][re.videoId].dislikeCount),
                duration: parseInt(r[1][re.videoId].duration),
                channelThumbnail: r[0][re.channelId].channelThumbnail,
                subscriberCount: parseInt(r[0][re.channelId].subscriberCount),
                description: r[1][re.videoId].description,
              };
            });
          }),
          /*
            Upsert (insert/update) data to local indexDB
          */
          mergeMap((videos) => {
            return forkJoin(
              this._upsertIndexDBData(
                type,
                videos,
                videoIds,
                query,
                categoryId,
                listData
              )
            ).pipe(
              mergeMap((r: any) => {
                return of(videos);
              })
            );
          })
        )
      ),
      shareReplay(1)
    );
  }
  _upsertIndexDBData(
    type: string,
    videos: Video[],
    videoIds: string[],
    query: string,
    categoryId: number,
    listData: any
  ): Array<Observable<any>> {
    const observables = [];
    const searchBy =
      type == 'query'
        ? { store: 'searchLists', key: { q: query } }
        : {
            store: 'categoryLists',
            key: { cid: categoryId },
          };
    observables.push(
      this.localDB.update(searchBy.store, {
        ...searchBy.key,
        lastPage: this.nextPageToken,
        videoIds: [
          ...new Set([...videoIds, ...videos.map((v) => v.videoId)]),
        ].slice(0, RESULTS.MAX_RESULTS),
      })
    );
    videos.forEach((e) => {
      observables.push(this.localDB.update('videos', e));
    });
    return observables;
  }
  _getChannelsInfo(res: any): Observable<any> {
    const channelIds = [
      ...new Set(res.items.map((r: any) => r.channelId)),
    ].join(',');
    const url = `${YOUTUBE_CONST.API_CHANNEL_INFO_URL}?id=${channelIds}&key=${YOUTUBE_CONST.API_TOKEN}&part=snippet,statistics`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const thumbnails: any = {};
        res.items.forEach((r: any) => {
          const channelById = response.items.find(
            (re: any) => r.channelId === re.id
          );
          thumbnails[r.channelId] = {
            channelThumbnail: channelById.snippet.thumbnails.default.url,
            subscriberCount: channelById.statistics.subscriberCount,
          };
        });
        return thumbnails;
      }),
      shareReplay(1)
    );
  }
  _getVideoStatisticsInfo(res: any): Observable<any> {
    const videoIds = [...new Set(res.map((r: any) => r.videoId))].join(',');
    const url = `${YOUTUBE_CONST.API_VIDEOS_URL}?id=${videoIds}&key=${YOUTUBE_CONST.API_TOKEN}&part=snippet,statistics,contentDetails,player`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const statistics: any = {};
        res.forEach((r: any) => {
          const videoById = response.items.find(
            (re: any) => r.videoId === re.id
          );
          statistics[r.videoId as string] = {
            description: videoById.snippet.description,
            viewCount: videoById.statistics.viewCount,
            duration: ytDurationToSec(videoById.contentDetails.duration),
            favoriteCount: videoById.statistics.favoriteCount,
            dislikeCount: videoById.statistics.dislikeCount,
            likeCount: videoById.statistics.likeCount,
            commentCount: videoById.statistics.commentCount,
          };
        });
        return statistics;
      }),
      shareReplay(1)
    );
  }
}
