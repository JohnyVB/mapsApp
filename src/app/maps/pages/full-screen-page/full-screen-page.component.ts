import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl';

@Component({
  selector: 'full-screen',
  templateUrl: './full-screen-page.component.html',
  styleUrl: './full-screen-page.component.css'
})

export class FullScreenPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef;

  public map?: Map;

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'Elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

}
