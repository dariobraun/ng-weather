import { Component, inject, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ActivatedRoute } from '@angular/router';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
})
export class ForecastsListComponent implements OnInit {
  protected weatherService = inject(WeatherService);
  route = inject(ActivatedRoute);

  zipcode: string;
  forecast: Forecast;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.zipcode = params['zipcode'];
      this.weatherService
        .getForecast(this.zipcode)
        .subscribe((data) => (this.forecast = data));
    });
  }
}
