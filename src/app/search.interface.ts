export interface Video {
  id: number;
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  publishedAt: Date;
  description: string;
  thumbnail: string;
  channelThumbnail: string;
  showPop?: boolean;
  showPlayer?: boolean;
  channelName: string;
  viewCount: number;
  commentCount: number;
  favoriteCount: number;
  dislikeCount: number;
  likeCount: number;
  duration: number;
  loader: VideoLoader;
}
export interface VideoLoader {
  thumbnail: boolean;
  channelThumbnail: boolean;
  content: boolean;
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
export interface NQuery {
  q: string;
  page: number;
}
export interface NCategory {
  cid: number;
  page: number;
}
export interface NQCategory {
  q: string;
  cid: number;
  page: number;
}
export type VideoDataType = 'category' | 'query';
export interface videoData {
  category: { data: Video[]; page: number };
  query: { data: Video[]; page: number };
}
