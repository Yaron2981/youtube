import { DBConfig } from 'ngx-indexed-db';

export const dbConfig: DBConfig = {
  name: 'youtube',
  version: 3,
  objectStoresMeta: [
    {
      store: 'videos',
      storeConfig: { keyPath: 'videoId', autoIncrement: false },
      storeSchema: [
        { name: 'channelId', keypath: 'channelId', options: { unique: false } },
        {
          name: 'channelThumbnail',
          keypath: 'channelThumbnail',
          options: { unique: false },
        },
        {
          name: 'channelTitle',
          keypath: 'channelTitle',
          options: { unique: false },
        },
        { name: 'title', keypath: 'title', options: { unique: false } },
        {
          name: 'description',
          keypath: 'description',
          options: { unique: false },
        },
        { name: 'duration', keypath: 'duration', options: { unique: false } },
        { name: 'showPop', keypath: 'showPop', options: { unique: false } },
        {
          name: 'showPlayer',
          keypath: 'showPlayer',
          options: { unique: false },
        },
        { name: 'thumbnail', keypath: 'thumbnail', options: { unique: false } },
        { name: 'videoId', keypath: 'videoId', options: { unique: true } },
        { name: 'viewCount', keypath: 'viewCount', options: { unique: false } },
        {
          name: 'commentCount',
          keypath: 'commentCount',
          options: { unique: false },
        },
        {
          name: 'subscriberCount',
          keypath: 'subscriberCount',
          options: { unique: false },
        },
        {
          name: 'favoriteCount',
          keypath: 'favoriteCount',
          options: { unique: false },
        },
        { name: 'likeCount', keypath: 'likeCount', options: { unique: false } },
        {
          name: 'dislikeCount',
          keypath: 'dislikeCount',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'categories',
      storeConfig: { keyPath: 'cid', autoIncrement: false },
      storeSchema: [
        { name: 'cid', keypath: 'cid', options: { unique: true } },
        {
          name: 'title',
          keypath: 'title',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'search',
      storeConfig: { keyPath: 'q', autoIncrement: false },
      storeSchema: [
        { name: 'q', keypath: 'q', options: { unique: true } },
        {
          name: 'titles',
          keypath: 'titles',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'categoryLists',
      storeConfig: { keyPath: 'cid', autoIncrement: false },
      storeSchema: [
        { name: 'cid', keypath: 'cid', options: { unique: true } },
        { name: 'lastPage', keypath: 'lastPage', options: { unique: false } },
        {
          name: 'videoIds',
          keypath: 'videoIds',
          options: { unique: false },
        },
      ],
    },
    {
      store: 'searchLists',
      storeConfig: { keyPath: 'q', autoIncrement: false },
      storeSchema: [
        { name: 'lastPage', keypath: 'lastPage', options: { unique: false } },
        { name: 'q', keypath: 'q', options: { unique: true } },
        {
          name: 'videoIds',
          keypath: 'videoIds',
          options: { unique: false },
        },
      ],
    },
  ],
};
