import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LngLat, Map, Marker } from "mapbox-gl";

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

  OnSubmit() {
    if (this.myForm.invalid) return;
    console.log(this.myForm.value);
    this.map!.setCenter(this.myForm.value);
    new Marker().setLngLat(this.myForm.value).addTo(this.map!);
  }

}
