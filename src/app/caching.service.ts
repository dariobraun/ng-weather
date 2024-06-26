import { Injectable } from '@angular/core';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { CachedData } from './model/cached-data';

const CONDITIONS = 'conditions';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  getCachedConditionData(zip: string): ConditionsAndZip | null {
    try {
      const cachedData: CachedData<ConditionsAndZip> = JSON.parse(
        localStorage.getItem(CONDITIONS + zip),
      );
      const expirationDate = new Date(cachedData.timestamp);
      expirationDate.setSeconds(expirationDate.getSeconds() + 30);
      if (cachedData && expirationDate.getTime() > new Date().getTime()) {
        return cachedData.data;
      }
    } catch {
      return null;
    }
  }

  cacheConditionData(data: ConditionsAndZip) {
    localStorage.setItem(
      CONDITIONS + data.zip,
      JSON.stringify({ data, timestamp: new Date().getTime() }),
    );
  }
}
