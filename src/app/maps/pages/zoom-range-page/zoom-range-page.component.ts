import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LngLat, Map, Marker } from "mapbox-gl";
import { PlainMarks, PropsAddMarker, colorsMarks } from '../../interfaces/mark.interface';

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
  public marks: colorsMarks[] = [];
  public keyMarksMap: string = 'marksMap';
  public propsMarker?: PropsAddMarker;

  public myForm: FormGroup = this.fb.group({
    lng: [this.lngLat.lng, [Validators.required]],
    lat: [this.lngLat.lat, [Validators.required]],
    color: ['#563d7c']
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
    this.readLocalStorage();
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
      this.propsMarker = { lng: this.lngLat.lng, lat: this.lngLat.lat, color: this.randomColor }
      this.myForm.reset(this.propsMarker);
    });
  }

  clearMarks() {
    this.marks.forEach(e => {
      e.mark.remove();
    });
    this.marks = [];
    this.saveLocalStorage();
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
    this.addMarker({ ...this.myForm.value })
  }

  get randomColor(): string {
    return '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
  }

  addMarker({ lng, lat, color }: PropsAddMarker) {
    if (!this.map) return;

    const lnglat: LngLat = new LngLat(lng, lat);
    const mark = new Marker({ color, draggable: true }).setLngLat(lnglat).addTo(this.map);
    this.marks.push({ color, mark });
    this.saveLocalStorage();

    mark.on('dragend', () => this.saveLocalStorage());
  }

  goTo(lnglat: LngLat) {
    this.map!.flyTo({ center: lnglat, essential: true });
  }

  removeItem(index: number) {
    this.marks[index].mark.remove();
    this.marks.splice(index, 1);
    this.saveLocalStorage();
  }

  saveLocalStorage() {
    const plainMarks: PlainMarks[] = this.marks.map(({ color, mark }) => ({ color, lnglat: mark.getLngLat() }));
    localStorage.setItem(this.keyMarksMap, JSON.stringify(plainMarks));
  }

  readLocalStorage() {
    const plainMarks: PlainMarks[] = JSON.parse(localStorage.getItem(this.keyMarksMap) ?? '[]');
    plainMarks.forEach(({ color, lnglat }) => this.addMarker({ ...lnglat, color }))
  }
}
