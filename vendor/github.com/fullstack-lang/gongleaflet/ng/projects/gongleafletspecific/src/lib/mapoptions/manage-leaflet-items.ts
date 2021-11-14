import { Type } from '@angular/core';
import * as gongleaflet from 'gongleaflet';

import * as L from 'leaflet';
import { map } from 'rxjs/operators';

// return the mapOptions that is passed to the 
// creation of the map
export function visualMapToLeafletMapOptions(vMap: gongleaflet.MapOptionsDB): L.MapOptions {

  let mapOptions: L.MapOptions = {}

  mapOptions.layers = [
    L.tileLayer(vMap.UrlTemplate, {
      maxZoom: vMap.MaxZoom,
      attribution: vMap.Attribution,
    }),
  ]
  mapOptions.zoom = vMap.ZoomLevel,
    mapOptions.center = L.latLng(vMap.Lat, vMap.Lng)
  mapOptions.zoomControl = vMap.ZoomControl
  mapOptions.attributionControl = vMap.AttributionControl
  mapOptions.zoomSnap = vMap.ZoomSnap

  return mapOptions
}

// newIcon return a new leaflet DivIcon
//
// Represents a lightweight icon for markers that uses a simple 
// <div> element instead of an image. 
// Inherits from Icon but ignores the iconUrl and shadow options.

export function newIcon(
  id: number | string,
  className: string,
  svg: string,
  size: number,
  color: string,
  label?: string,
  opacity?: number
) {

  let divIconOptions: L.DivIconOptions = {}

  let content = '';
  if (!opacity) {
    opacity = 0.8;
  }
  if (label) {
    content = `
          <div class="pin__content" style="color: ${color}; opacity:${opacity}">
            <h3 id="${id}--label">${label}</h3>
          </div>
        `;
  }
  const html = `
  <div id="${id}--icon-marker">
    <div class="pin" id="${id}--icon" style="color: ${color}; opacity:0.8"/>
      ${svg?.length > 30 ? svg : `<img src='assets/icons/${svg}.svg'/>`}
    </div>
    ${content}
  </div>`;

  divIconOptions.html = html
  divIconOptions.iconSize = [size, size]
  divIconOptions.shadowSize = [0, 0] // size of the shadow
  divIconOptions.shadowAnchor = [0, 0] // the same for the shadow
  divIconOptions.popupAnchor = [-3, -76] // point from which the popup should open relative to the iconAnchor
  divIconOptions.className = className // css class

  return L.divIcon(divIconOptions);
};

export function rotateIcon(targetID: string | number, orientation: number) {
  let target = document.getElementById(`${targetID}--icon`);
  if (target) {
    target.style.transform = `rotate(${orientation}deg)`;
  }
};

export function setIconLabel(targetID: string | number, newLabel: string) {
  let target = document.getElementById(`${targetID}--label`);
  if (target) {
    target.innerHTML = newLabel;
  }
};

// add a leaflet marker with an icon
export function newMarkerWithIcon(lat: number, lng: number, icon: L.DivIcon): L.Marker {

  let markerOptions: L.MarkerOptions = {}
  markerOptions.icon = icon

  return L.marker([lat, lng], { icon });
};

export function newCircle(circle: gongleaflet.CircleDB): L.Circle {
  return L.circle([circle.Lat, circle.Lng], {
    className: 'layer-' + circle.LayerGroupID.Int64,
    radius: circle.Radius * 1000,
    color: getColor(circle.ColorEnum),
    opacity: 0.2,
    dashArray: getDashStyle(circle.DashStyleEnum),
    dashOffset: '0',
    fill: false,
  });
};

export function newLine(newLineData: gongleaflet.VLineDB): L.Polyline {
  return new L.Polyline([])
    .setLatLngs([
      L.latLng(newLineData.StartLat, newLineData.StartLng),
      L.latLng(newLineData.EndLat, newLineData.EndLng),
    ])
    .setStyle({
      className: 'layer-' + newLineData.LayerGroupID.Int64,
      weight: 2,
      dashArray: getDashStyle(newLineData.DashStyleEnum),
      opacity: 0.5,
      color: getColor(newLineData.ColorEnum),
    });
};

export function getColor(visualColorEnum: string): string {
  var color = 'grey';
  switch (visualColorEnum) {
    case gongleaflet.ColorEnum.RED:
      color = 'red';
      break;
    case gongleaflet.ColorEnum.GREY:
      color = 'grey';
      break;
    case gongleaflet.ColorEnum.GREEN:
      color = 'green';
      break;
    case gongleaflet.ColorEnum.BLUE:
      color = 'blue';
      break;
    case gongleaflet.ColorEnum.LIGHT_BROWN_8D6E63:
      color = '#8D6E63';
      break;
  }
  return color;
};


export function getDashStyle(dashStyleEnumValue: string): string {
  const types = {
    FIVE_TWENTY: '5 20',
    FIVE_TEN: '5 10',
  };
  return types[dashStyleEnumValue as keyof typeof types];
};

export function setVisibilityHTMLElement(
  htmlElement: HTMLElement | any,
  visible: boolean
) {
  if (!htmlElement) {
    return;
  }
  try {
    htmlElement.style.display = visible ? '' : 'none';
  } catch {
    htmlElement.setAttribute('display', visible ? '' : 'none');
  }
}