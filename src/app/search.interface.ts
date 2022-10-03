export interface Video {
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  publishedAt: Date;
  description: string;
  thumbnail: string;
  channelThumbnail: string;
  showPop: boolean;
  showPlayer: boolean;
  channelName: string;
  viewCount: number;
  duration: number;
}
export interface Channel {
  channelThumbnail: string;
}
export interface Statistic {
  viewCount: number;
  duration: number;
}
export interface VideosResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  regionCode: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Video[];
}
//https://blog.logrocket.com/build-a-youtube-video-search-app-with-angular-and-rxjs/
