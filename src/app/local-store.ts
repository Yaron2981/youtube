export class LocalStore {
  constructor() {}
  isValid(key: string) {
    return localStorage.getItem(key);
  }
  setData(key: string, localdata: {} | []) {
    localStorage.setItem(key, JSON.stringify(localdata));
  }

  getData(key: string) {
    return JSON.parse(localStorage.getItem(key) as string);
  }

  clearStorage() {
    localStorage.clear();
  }
}
