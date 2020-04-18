import { Injectable, EventEmitter } from '@angular/core';

@Injectable({providedIn: 'root'})
export class WindowService {
  constructor() {
    window.onresize = () => this.resize.emit();
    window.onfocus = () => this.focus.emit();
    window.onblur = () => this.blur.emit();
  }

  public resize = new EventEmitter<void>();
  public focus = new EventEmitter<void>();
  public blur = new EventEmitter<void>();

  public get innerWidth(): number {
    return window.innerWidth;
  }
}
