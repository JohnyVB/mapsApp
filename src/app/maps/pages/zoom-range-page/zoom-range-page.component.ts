import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LngLat, Map, Marker } from "mapbox-gl";

interface markLnglat {
  marker: Marker;
  lnglat: LngLat;
}

@Component({
  selector: 'zoom',
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css'
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef;
  public zoom: number = 10;
  public map?: Map;
  public lngLat: LngLat = new LngLat(-74.5, 40);
  public arrMarkLngLat: markLnglat[] = [];

  public myForm: FormGroup = this.fb.group({
    lng: [this.lngLat.lng, [Validators.required]],
    lat: [this.lngLat.lat, [Validators.required]]
  });


  constructor(private fb: FormBuilder) { }

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });
    this.mapListeners();
  }


  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners() {
    if (!this.map) throw 'Mapa no inicializado';

    this.map.on('zoom', () => this.zoom = this.map!.getZoom());

    this.map.on('zoomend', () => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });

    this.map.on('move', () => {
      this.lngLat = this.map!.getCenter();
      this.myForm.reset(this.lngLat);
    });
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map!.zoomTo(this.zoom);
  }

  onSubmit() {
    if (this.myForm.invalid) return;
    this.map!.flyTo({ center: this.myForm.value, essential: true });
    this.addMarker(this.myForm.value);
  }

  addMarker(lnglat: LngLat, color: string = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16))) {
    if (!this.map) return;
    const marker = new Marker({ color, draggable: true }).setLngLat(lnglat).addTo(this.map);
    this.arrMarkLngLat.push({ marker, lnglat });
  }

  goTo(lnglat: LngLat) {
    this.map!.flyTo({ center: lnglat, essential: true });
  }

  removeItem(itemMarker: markLnglat) {
    this.arrMarkLngLat = this.arrMarkLngLat.filter(item => item !== itemMarker);
    itemMarker.marker.remove();
  }

  // setLocalStorage() {
  //   if (localStorage.getItem(this.keyLocalStorage)) {
  //     localStorage.removeItem(this.keyLocalStorage);
  //     localStorage.setItem(this.keyLocalStorage, stringify(this.arrMarkLngLat));
  //   }
  //   localStorage.setItem(this.keyLocalStorage, stringify(this.arrMarkLngLat));
  // }



}
