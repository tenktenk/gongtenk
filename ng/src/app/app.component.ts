import { Component } from '@angular/core';

import * as gongtenk from 'gongtenk'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {

  view = 'Carto view'
  carto = 'Carto view'
  data = 'Data view'
  leaflet = 'Leaflet view'
  views: string[] = [this.carto, this.data, this.leaflet];

  userClick(lat: number, lng: number): void {
    console.log("user clicked on lat: " + lat + " lng: " + lng)
  }

  title = 'ng';
}
