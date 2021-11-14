import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-tenk-map',
  templateUrl: './tenk-map.component.html',
  styleUrls: ['./tenk-map.component.css']
})
export class TenkMapComponent implements OnInit {

  view = 'Carto view'
  carto = 'Carto view'
  data = 'Data view'
  xlsx = 'XL view'
  leaflet = 'Leaflet view'
  views: string[] = [this.carto, this.data, this.xlsx, this.leaflet];

  userClick(lat: number, lng: number): void {
    console.log("user clicked on lat: " + lat + " lng: " + lng)
  }

  title = 'ng';

  constructor() { }

  ngOnInit(): void {
  }

}
