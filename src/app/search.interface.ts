export interface Video {
  videoId: string;
  videoUrl: string;
  channelId: string;
  channelUrl: string;
  channelTitle: string;
  title: string;
  publishedAt: Date;
  description: string;
  thumbnail: string;
  channelThumbnail?: string;
  showPop?: boolean;
  channelName?: string;
  viewCount?: number;
}
//https://blog.logrocket.com/build-a-youtube-video-search-app-with-angular-and-rxjs/
