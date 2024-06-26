import { inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { CachingService } from './caching.service';

const CONDITIONS = 'conditions';
const FORECAST = 'forecasts';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL =
    'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  http = inject(HttpClient);
  locationService = inject(LocationService);
  cachingService = inject(CachingService);

  cacheExpiresInSeconds = signal<number>(60 * 60 * 2);

  private currentConditions = toObservable(
    this.locationService.getLocations(),
  ).pipe(
    switchMap((locations) => {
      return forkJoin(
        locations.map((zip) => this.requestCurrentConditions(zip)),
      );
    }),
  );

  requestCurrentConditions(zipcode: string): Observable<ConditionsAndZip> {
    const cachedData = this.cachingService.getCachedData<ConditionsAndZip>(
      CONDITIONS + zipcode,
    );
    return cachedData
      ? of(cachedData)
      : this.http
          .get<CurrentConditions>(
            `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`,
          )
          .pipe(
            map((data) => ({ data, zip: zipcode })),
            tap((data) => {
              this.cachingService.cacheData<ConditionsAndZip>(
                CONDITIONS + data.zip,
                data,
                this.cacheExpiresInSeconds(),
              );
            }),
            catchError(() => of(null)),
          );
  }

  getCurrentConditions(): Observable<ConditionsAndZip[]> {
    return this.currentConditions;
  }

  getForecast(zipcode: string): Observable<Forecast> {
    const cachedData = this.cachingService.getCachedData<Forecast>(
      FORECAST + zipcode,
    );
    return cachedData
      ? of(cachedData)
      : this.http
          .get<Forecast>(
            `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`,
          )
          .pipe(
            tap((data) => {
              this.cachingService.cacheData<Forecast>(
                FORECAST + zipcode,
                data,
                this.cacheExpiresInSeconds(),
              );
            }),
          );
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }
}
