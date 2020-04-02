import { Injectable, EventEmitter } from '@angular/core';

@Injectable({providedIn: 'root'})
export class WindowService {
  constructor() {
    window.onresize = () => this.resize.emit();
  }

  public resize = new EventEmitter<void>();

  public get innerWidth(): number {
    return window.innerWidth;
  }
}
