import { Injectable, Signal, signal } from '@angular/core';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {
  private locations = signal<string[]>([]);

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      try {
        this.locations.update(() => JSON.parse(locString));
      } catch (e) {
        console.error(e);
      }
    }
  }

  addLocation(zipcode: string) {
    this.locations.update((locations) =>
      !locations.includes(zipcode) ? [...locations, zipcode] : locations,
    );
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
  }

  removeLocation(zipcode: string, event: MouseEvent) {
    event.stopPropagation();
    this.locations.update((locations) =>
      locations.filter((loc) => loc !== zipcode),
    );
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
  }

  getLocations(): Signal<string[]> {
    return this.locations.asReadonly();
  }
}
