import { Component, inject } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent {
  protected weatherService = inject(WeatherService);
  route = inject(ActivatedRoute);

  forecast = this.route.params.pipe(
    filter((params) => params['zipcode']),
    switchMap((params) => {
      return this.weatherService.getForecast(params['zipcode']);
    }),
  );
}
