import { Component, inject } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
})
export class ZipcodeEntryComponent {
  service = inject(LocationService);

  addLocation(zipcode: string) {
    this.service.addLocation(zipcode);
  }
}
