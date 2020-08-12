import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../models/root-state';

@Injectable({ providedIn: 'root' })
export class PlayerFacadeService {

  constructor(private store: Store<RootState>) {}
}
