import { Component, OnInit } from '@angular/core';
import { AnyplaceService } from '../services/anyplace.service';
import { tileLayer, latLng, marker, MarkerOptions, DivIcon, LatLng, imageOverlay, latLngBounds, Layer } from 'leaflet';
import { category } from '../model/category';
import { objectHistory } from '../model/objectHistory';
import { floorCoordinates } from '../model/floorCoordinates';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private anyplaceService: AnyplaceService) { }

  categories: Array<category> = new Array<category>();
  selectedCatList: Array<string>;
  selectedItem: string;
  options: any;
  blnCategorySelected: boolean = false;
  defaultZoom: number = 10;
  maxZoom: number = 21;
  mapCenter: LatLng = latLng(46.879966, -121.726909)
  markerLayers: Array<Layer> = [];
  floorLayer: any;
  showFloorLayer: boolean = false;

  ngOnInit() {

    this.anyplaceService.getAllCategories()
      .subscribe((response: any) => {
        if (response && response.message) {
          JSON.parse(response.message).categories.forEach(element => {
            this.categories.push(new category(Object.keys(element).toString(), Object.values(element)));
          });
        }
      });

    this.options = {
      layers: [
        tileLayer('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', { maxZoom: this.maxZoom, attribution: '...' })
      ],
      zoomControl: false,
    };
  }

  categorySelectionChange(selectedCategory: any) {
    if (selectedCategory.target.value) {
      this.selectedCatList = this.categories.find(x => x.name === selectedCategory.target.value).items;
      this.selectedItem = '';
      this.defaultZoom = 10;
      this.blnCategorySelected = true;
    }
  }

  objectSelectionChange(value: any) {
    let objectHistory: Array<objectHistory> = [];

    if (value) {
      this.anyplaceService.getSelectedItemHistory(value)
        .subscribe((response: any) => {
          if (response && response.message) {
            JSON.parse(response.message).lHistory.forEach((element: any) => {
              let object: objectHistory = element;
              objectHistory.push(object);
            });
            let sortedItems = objectHistory.sort((a: any, b: any) =>
              new Date(formatDate(b.timestamp, 'medium', 'en-US')).getTime() - new Date(formatDate(a.timestamp, 'medium', 'en-US')).getTime()
            );

            this.getLayerDetails(sortedItems);
          }
        });
    }
  }

  getLayerDetails(objectHistory: Array<objectHistory>) {

    let floorCoordinates: floorCoordinates;
    if (objectHistory.length > 0) {

      this.anyplaceService.getFloorCoordinates(objectHistory[0].buid)
        .subscribe((data: any) => {

          if (data && data.floors) {
            floorCoordinates = data.floors.find(x => x.floor_number === objectHistory[0].floor.toString());

            if (localStorage.getItem(objectHistory[0].buid + ';' + objectHistory[0].floor)) {

              this.setLayers(floorCoordinates, localStorage.getItem(objectHistory[0].buid + ';' + objectHistory[0].floor), objectHistory);

            } else {
              this.anyplaceService.getFloorPlan(objectHistory[0].buid, objectHistory[0].floor)
                .subscribe((imageBase64: any) => {

                  if (imageBase64) {
                    localStorage.setItem(objectHistory[0].buid + ';' + objectHistory[0].floor, imageBase64);
                    this.setLayers(floorCoordinates, imageBase64, objectHistory);
                  }

                });
            }
          }

        });
    }
  }

  setLayers(floorCoordinates: floorCoordinates, imageBase64: string, objectHistory: Array<objectHistory>) {
    let imageBounds = latLngBounds(latLng(floorCoordinates.bottom_left_lat, floorCoordinates.bottom_left_lng),
      latLng(floorCoordinates.top_right_lat, floorCoordinates.top_right_lng));

    this.floorLayer = imageOverlay('data:image/png;base64,' + imageBase64, imageBounds);

    this.setMapProperties(this.maxZoom, latLng(floorCoordinates.top_right_lat, floorCoordinates.bottom_left_lng))
    this.showFloorLayer = true;

    objectHistory.forEach((item: objectHistory) => {
      this.markerLayers.push(marker([item.coordinates_lat, item.coordinates_lon], this.getMarkerOptions('blue')));
    });
  }

  setMapProperties(zoom: number, center: LatLng) {
    this.defaultZoom = zoom;
    this.mapCenter = center;
  }

  getMarkerOptions(color: string, title?: string): MarkerOptions {
    // const myCustomColour = '#583470'
    let markerHtmlStyles = `
      background-color: ${color};
      width: 3rem;
      height: 3rem;
      display: block;
      left: -1.5rem;
      top: -1.5rem;
      position: relative;
      border-radius: 3rem 3rem 0;
      transform: rotate(45deg);
      border: 1px solid #FFFFFF`

    let markerOptions: MarkerOptions = {
      title: title,
      icon: new DivIcon({
        className: 'my-custom-pin',
        iconAnchor: [0, 24],
        iconSize: [-6, 0],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
      })
    }
    return markerOptions;
  }
}





// objectHistory.forEach((item) => {
//   item.timestamp = Date.parse(formatDate(item.timestamp, 'medium', 'en-US'))
// });

// if (value) {
//   switch (value.target.selectedIndex) {
//     case 1:
//       let imageBounds = latLngBounds(latLng(40.712216, -74.22655), latLng(60.773941, -34.12544));
//       this.layer = imageOverlay(this.sampleBase64_1, imageBounds)
//       this.layers = [
//         marker([18.595515, 73.709299]),
//         marker([45.595515, 73.709299]),
//         marker([46.879966, -121.726909])
//       ];
//       this.mapCenter = latLng(40.712216, -74.22655);
//       this.showLayer = true;
//       this.defaultZoom = this.maxZoom;
//       break;
//     case 2:
//       this.layers = [
//         marker([28.595515, 53.709299]),
//         marker([25.595515, 45.709299]),
//         marker([56.879966, 81.726909])
//       ];
//       break;
//     case 3:
//       let bounds = latLngBounds(latLng(12.978681933783395, 77.66057220608845), latLng(12.979111039018068, 77.66085869011206));
//       this.layer = imageOverlay(this.sampleBase64_2, bounds)
//       this.mapCenter = latLng(12.978681933783395, 77.66057220608845);

//       this.showLayer = true;
//       this.defaultZoom = this.maxZoom;
//       this.layers = [
//         marker([12.978681933783395, 77.66057220608845]),
//         marker([12.978771039018068, 77.66065869011206]),
//         marker([12.972331039013068, 77.66065870000206])
//       ];
//       break;
//     default:
//       // this.layers = [
//       //   marker([18.595515, 73.709299]),
//       //   marker([45.595515, 73.709299]),
//       //   marker([46.879966, -121.726909])
//       // ];
//       this.defaultZoom = 20;
//   }
// }