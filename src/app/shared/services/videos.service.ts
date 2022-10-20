import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  BehaviorSubject,
  forkJoin,
  of,
  zip,
  combineLatest,
  startWith,
} from 'rxjs';
import {
  mergeMap,
  map,
  shareReplay,
  switchMap,
  take,
  tap,
  delay,
} from 'rxjs/operators';
import {
  NCategory,
  NQCategory,
  NQuery,
  Video,
  VideoDataType,
  VideoLoader,
  VideosResponse,
} from 'src/app/search.interface';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { EMPTY_VIDEO, RESULTS, YOUTUBE_CONST } from '../constants/yt';
import { chunk } from 'src/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  videosLoader: any = [...Array(RESULTS.LIMIT).keys()].map(
    (vl: any) => EMPTY_VIDEO
  );
  constructor(private http: HttpClient, private localDB: NgxIndexedDBService) {}
  pageNumber = 0;
  videoId$: Observable<boolean> = of(false);

  nCategory$ = new BehaviorSubject<NCategory>({ cid: 0, page: 0 });

  nQuery$ = new BehaviorSubject<NQuery>({ q: '', page: 0 });

  // generateData$:Observable<{type:string,data:Video[],trigger:string}> = new BehaviorSubject({type:'new',data:this.videosLoader,trigger:'new'}).pipe(sw)

  loading$ = {
    category: new BehaviorSubject<boolean>(false),
    query: new BehaviorSubject<boolean>(false),
  };
  videoData: {
    category: Video[];
    query: Video[];
  } = {
    category: [],
    query: [],
  };
  videosData$ = {
    category: new BehaviorSubject<Video[]>([]),
    query: new BehaviorSubject<Video[]>([]),
  };

  nextPageToken: string | null = null;
  currentCategoryId: number = 0;
  prevCategoryId: number = 0;
  _setNewHolderData(startFrom: number = 0): any[] {
    return [...Array(RESULTS.LIMIT).keys()].map((vl: any, k: number) => ({
      ...EMPTY_VIDEO,
      id: startFrom + k,
    }));
  }
  emitCategoryChanged(categoryId: number) {
    this.currentCategoryId = categoryId;
    this.nCategory$.next({ cid: categoryId, page: 0 });
  }
  emitVideosByQuery(q: string) {
    this.nQuery$.next({ q: q, page: 0 });
  }
  emitCategoryNextPage(): void {
    this.pageNumber = this.pageNumber + 1;
    this.nCategory$.next({
      cid: this.currentCategoryId,
      page: this.pageNumber,
    });
  }
  getCategorySource(): Observable<Video[]> {
    return this._getSource('category', this.nCategory$);
  }
  getQuerySource(): Observable<Video[]> {
    return this._getSource('query', this.nQuery$);
  }
  _getSource(type: VideoDataType, listener: Observable<any>): Observable<any> {
    let videoIds: string[] = [];
    return listener.pipe(
      tap(() => {
        this.loading$[type].next(true);
      }),
      switchMap((nqc: NQCategory) => {
        console.log(nqc);
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
            delay(3000),
            mergeMap((listData: any) => {
              if (
                listData &&
                listData.videoIds.length >=
                  RESULTS.LIMIT * nqc.page + RESULTS.LIMIT
              ) {
                return this.localDB.bulkGet('videos', listData.videoIds).pipe(
                  tap((videos: Video[]) => {
                    if (nqc.page > 0) {
                      videos = videos.slice(
                        0,
                        RESULTS.LIMIT * nqc.page + RESULTS.LIMIT
                      );

                      this._setData(type, videos, 'merge');
                    } else {
                      videos = videos.slice(0, RESULTS.LIMIT);
                      this._setData(type, videos, 'merge');
                    }
                  })
                );
              } else {
                if (listData) videoIds = listData.videoIds;
                return this._getVideos(type, nqc.q, nqc.cid, videoIds).pipe(
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
      shareReplay(1),
      tap(() => {
        this.loading$[type].next(false);
      })
    );
  }

  _setData(type: VideoDataType, videos: Video[], trigger: string) {
    switch (trigger) {
      case 'new':
        this.videoData[type] = videos;
        break;
      case 'push':
        if (!this.videoData[type].find((vd) => vd.videoId === null))
          this.videoData[type] = this.videoData[type].concat(videos);
        break;
      case 'merge':
        this.videoData[type] = this.videoData[type].map((video, index) => {
          const svideo = videos.shift() as Video;
          if (video.videoId === null) {
            console.log('video', video);
            console.log('videoshift', svideo);
          }
          return video.videoId === null ? { ...video, ...svideo } : video;
        });

        break;
    }
    this.videoData[type] = this.videoData[type].map((video) => {
      return {
        ...video,
        ...{
          loader: {
            thumbnail: trigger === 'merge' ? false : true,
            channelThumbnail: trigger === 'merge' ? false : true,
            content: false,
          },
        },
      };
    });
    this.videosData$[type].next(this.videoData[type]);
  }
  _getVideos(
    type: VideoDataType,
    query: string = '',
    categoryId: number = 0,
    videoIds: any = []
  ): Observable<any> {
    const widthCategory =
      categoryId > 0 ? `videoCategoryId=${categoryId}` : `q=${query}`;
    const pageToken = this.nextPageToken
      ? `&pageToken=${this.nextPageToken}`
      : '';
    const url = `${YOUTUBE_CONST.API_SEARCH_URL}?${widthCategory}&key=${YOUTUBE_CONST.API_TOKEN}&part=snippet&type=video&maxResults=${RESULTS.LIMIT}&regionCode=il${pageToken}`;
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
          this._getChannelsInfo(res),
          this._getVideoStatisticsInfo(res.items),
        ]).pipe(
          map((r: any) => {
            return res.items.map((re: Video) => {
              videoIds.push(re.videoId);
              return {
                ...re,
                commentCount: r[1][re.videoId].commentCount,
                favoriteCount: r[1][re.videoId].favoriteCount,
                likeCount: r[1][re.videoId].likeCount,
                viewCount: r[1][re.videoId].viewCount,
                duration: r[1][re.videoId].duration,
                channelThumbnail: r[0][re.channelId],
              };
            });
          }),
          /*
            Upsert (insert/update) data to indexDB
          */
          mergeMap((videos) => {
            return forkJoin(
              this._upsertIndexDBData(
                type,
                videos,
                videoIds,
                query,
                categoryId,
                this.nextPageToken
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
    videoIds: [],
    query: string,
    categoryId: number,
    lastPage: string | null
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
        lastPage: lastPage,
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
    const url = `${YOUTUBE_CONST.API_CHANNEL_INFO_URL}?id=${channelIds}&key=${YOUTUBE_CONST.API_TOKEN}&part=snippet`;
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
  _getVideoStatisticsInfo(res: any): Observable<any> {
    const videoIds = [...new Set(res.map((r: any) => r.videoId))].join(',');
    const url = `${YOUTUBE_CONST.API_STATISTIC_INFO_URL}?id=${videoIds}&key=${YOUTUBE_CONST.API_TOKEN}&part=statistics,contentDetails,player`;
    return this.http.get(url).pipe(
      map((response: any) => {
        console.log(response);
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
