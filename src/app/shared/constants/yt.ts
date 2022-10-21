export const YOUTUBE_CONST = {
  VIDEO_PATH: 'https://www.youtube.com/watch?v=',
  API_TOKEN: 'AIzaSyB7KHp81yAoioCEJInypVjd_adc0ZfAsko',
  API_SEARCH_URL: 'https://www.googleapis.com/youtube/v3/search',
  API_CHANNEL_INFO_URL: 'https://youtube.googleapis.com/youtube/v3/channels',
  API_STATISTIC_INFO_URL: 'https://www.googleapis.com/youtube/v3/videos',
  API_CATEGORIES_URL: 'https://www.googleapis.com/youtube/v3/videoCategories',
};
export const IGNORED_CATEGORIES = [18, 21, 28, 30, 31, 33, 38, 39, 40, 41, 18];
export const RESULTS = {
  MAX_SERVER_RESULTS: 100,
  MAX_RESULTS: 100,
  LIMIT: 24,
};
export const EMPTY_VIDEO = {
  videoId: null,
  channelId: null,
  channelTitle: null,
  title: null,
  publishedAt: null,
  description: null,
  thumbnail: null,
  channelThumbnail: null,
  showPop: null,
  showPlayer: null,
  channelName: null,
  viewCount: null,
  duration: null,
  loader: {
    thumbnail: true,
    channelThumbnail: true,
    content: true,
  },
};
