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
      store: 'lists',
      storeConfig: { keyPath: 'cid', autoIncrement: false },
      storeSchema: [
        { name: 'cid', keypath: 'cid', options: { unique: true } },
        {
          name: 'videoIds',
          keypath: 'videoIds',
          options: { unique: false },
        },
      ],
    },
  ],
};
