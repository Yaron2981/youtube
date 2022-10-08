// import { Injectable } from '@angular/core';

// import { Observable, Observer, ReplaySubject, Subject } from 'rxjs';
// import { take } from 'rxjs/operators';

// const VERSION = 2;

// // good tutorial: https://code.tutsplus.com/tutorials/working-with-indexeddb--net-34673
// // reference: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

// @Injectable({
//   providedIn: 'root',
// })
// export class LocalDBService {
//   db: Subject<IDBDatabase> = new ReplaySubject<IDBDatabase>(1);

//   constructor() {
//     // window['SLOCALDB'] = this;

//     if (!window.indexedDB) {
//       this.db.next(undefined!);
//       this.db.complete();
//     } else {
//       console.log(`localdb - requesting open of 'swbuddy' version ${VERSION}`);

//       const openRequest = indexedDB.open('youtube', VERSION);
//       openRequest.onerror = (err) => {
//         console.error('localdb - open has error:', err);

//         this.db.error(err);
//         this.db.complete();
//       };

//       openRequest.onupgradeneeded = function (e: any) {
//         console.log('localdb - upgrade needed!');

//         // create object stores for 'rawLogin' and 'rawVisit'
//         const db: IDBDatabase = e.target.result;
//         if (!db.objectStoreNames.contains('categories')) {
//           db.createObjectStore('categories');
//         }

//         if (!db.objectStoreNames.contains('videos')) {
//           const objectStore = db.createObjectStore('videos');
//           objectStore.createIndex('videoId', 'videoId', { unique: true });
//         }

//         // for testing any type of object setup
//         if (!db.objectStoreNames.contains('list')) {
//           db.createObjectStore('lists');
//         }
//         if (!db.objectStoreNames.contains('search')) {
//           db.createObjectStore('search');
//         }
//       };

//       openRequest.onsuccess = (e: any) => {
//         console.log('localdb - open success!', e.target.result);

//         const db: IDBDatabase = e.target.result;
//         this.db.next(db);
//       };
//     }
//   }

//   get(storeName: string, key: any): Observable<any> {
//     console.log('localdb.query()');
//     return new Observable((observer: Observer<any>) => {
//       try {
//         console.log('localdb.query() - subscribed!');
//         this.db.pipe(take(1)).subscribe((db) => {
//           console.log('localdb.query() got db:', db);
//           if (!db) {
//             observer.error('IndexDB not supported!');
//             return;
//           }

//           const txn = db.transaction([storeName], 'readonly');
//           const store = txn.objectStore(storeName);
//           const req = store.get(key);
//           req.onerror = function (e: any) {
//             observer.error(e.target.error);
//             return;
//           };
//           req.onsuccess = function (e: any) {
//             observer.next(e.target.result);
//             observer.complete();
//           };
//         });
//       } catch (err) {
//         observer.error(err);
//       }
//     });
//   }

//   put(storeName: string, key: any, value: any): Observable<any> {
//     return new Observable((observer: Observer<any>) => {
//       try {
//         this.db.pipe(take(1)).subscribe((db) => {
//           if (!db) {
//             observer.error('IndexDB not supported!');
//             return;
//           }

//           const txn = db.transaction([storeName], 'readwrite');
//           const store = txn.objectStore(storeName);
//           const req = store.put(value, key);
//           req.onerror = function (e: any) {
//             console.log('store error event:', e);
//             observer.error(e.target.error);
//             return;
//           };
//           req.onsuccess = function (e: any) {
//             console.log('store success:', e);
//             observer.next(e.target.result);
//             observer.complete();
//           };
//         });
//       } catch (err) {
//         observer.error(err);
//       }
//     });
//   }

//   delete(storeName: string, key: any): Observable<any> {
//     console.log('localdb.delete()');
//     return new Observable((observer: Observer<any>) => {
//       try {
//         console.log('localdb.delete() - subscribed!');
//         this.db.pipe(take(1)).subscribe((db) => {
//           console.log('localdb.delete() got db:', db);
//           if (!db) {
//             observer.error('IndexDB not supported!');
//             return;
//           }

//           const txn = db.transaction([storeName], 'readwrite');
//           const store = txn.objectStore(storeName);
//           const req = store.delete(key);
//           req.onerror = function (e: any) {
//             observer.error(e.target.error);
//             return;
//           };
//           req.onsuccess = function (e: any) {
//             observer.next(e.target.result);
//             observer.complete();
//           };
//         });
//       } catch (err) {
//         observer.error(err);
//       }
//     });
//   }

//   query(storeName: string): Observable<any> {
//     console.log('localdb.query()');
//     return new Observable((observer: Observer<any>) => {
//       try {
//         console.log('localdb.query() - subscribed!');
//         this.db.pipe(take(1)).subscribe((db) => {
//           console.log('localdb.query() got db:', db);
//           if (!db) {
//             observer.error('IndexDB not supported!');
//             return;
//           }

//           const txn = db.transaction([storeName], 'readonly');
//           const store = txn.objectStore(storeName);
//           const req = store.openCursor();
//           req.onerror = function (e: any) {
//             observer.error(e.target.error);
//             return;
//           };
//           req.onsuccess = function (e: any) {
//             const cursor = e.target.result;
//             if (cursor) {
//               observer.next({ key: cursor.key, value: cursor.value });
//               cursor.continue();
//             } else {
//               observer.complete();
//             }
//           };
//         });
//       } catch (err) {
//         observer.error(err);
//       }
//     });
//   }
// }
