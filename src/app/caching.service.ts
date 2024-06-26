import { Injectable } from '@angular/core';
import { CachedData } from './model/cached-data';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  getCachedData<T>(key: string): T | null {
    try {
      const cachedData: CachedData<T> = JSON.parse(localStorage.getItem(key));
      const expirationDate = new Date(cachedData.timestamp);
      if (cachedData && expirationDate.getTime() > new Date().getTime()) {
        return cachedData.data;
      }
      throw Error('no cached data or data already expired');
    } catch {
      return null;
    }
  }

  cacheData<T>(key: string, data: T, expiresInSeconds: number = 60 * 60 * 2) {
    const expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + expiresInSeconds);
    localStorage.setItem(
      key,
      JSON.stringify({ data, timestamp: expirationDate.getTime() }),
    );
  }
}
