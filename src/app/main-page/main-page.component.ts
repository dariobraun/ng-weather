import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { WeatherService } from '../weather.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
})
export class MainPageComponent {
  expiresInSecondsFormControl = new FormControl<number>(0);
  weatherService = inject(WeatherService);

  constructor() {
    this.expiresInSecondsFormControl.setValue(
      this.weatherService.cacheExpiresInSeconds(),
    );
    this.expiresInSecondsFormControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) =>
        this.weatherService.cacheExpiresInSeconds.set(value),
      );
  }
}
