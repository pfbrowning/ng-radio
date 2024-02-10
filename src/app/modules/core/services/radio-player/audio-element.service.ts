import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable, from, NEVER } from 'rxjs';
import IcecastMetadataPlayer from 'icecast-metadata-player';

@Injectable({ providedIn: 'root' })
export class AudioElementService {
  private player: IcecastMetadataPlayer;

  public play(url: string): Observable<void> {
    const proxiedUrl = `http://localhost:3000/listen?url=${url}`;
    this.player = new IcecastMetadataPlayer(proxiedUrl, {
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
