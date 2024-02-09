import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, from, NEVER } from 'rxjs';
import IcecastMetadataPlayer from 'icecast-metadata-player';

@Injectable({ providedIn: 'root' })
export class AudioElementService {
  private player: IcecastMetadataPlayer;

  public play(url: string): Observable<void> {
    this.player = new IcecastMetadataPlayer(url, {
      onMetadata: metadata => {
        console.log('metadata', metadata);
      },
    });
    return from(this.player.play());
  }

  public stop(): Observable<void> {
    return from(this.player.stop());
  }

  public validate = (url: string): Observable<{ success: boolean }> => NEVER;
}
