import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ScreenSizeService {
  private screenWidth: number;

  constructor() {
    this.screenWidth = window.innerWidth;
    window.onresize = () => this.screenWidth = window.innerWidth;
  }

  public get smallScreen(): boolean {
    return this.screenWidth < 800;
  }
}