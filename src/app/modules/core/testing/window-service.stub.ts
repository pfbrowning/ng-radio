import { EventEmitter } from '@angular/core';

export class WindowServiceStub {
  public innerWidth = 800;
  public resize = new EventEmitter<void>();
}
