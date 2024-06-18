import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WeatherService } from '../weather.service';
import { Router } from '@angular/router';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentConditionsComponent {
  protected weatherService = inject(WeatherService);
  private router = inject(Router);
  private locationService = inject(LocationService);
  protected currentConditionsByZip$ =
    this.weatherService.getCurrentConditions();

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }

  removeLocation = (index: number) => {
    this.locationService.removeLocation(index);
  };
}
