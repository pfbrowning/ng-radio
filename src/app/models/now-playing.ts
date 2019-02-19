import { Station } from './station';
import { Metadata } from './metadata';

export class NowPlaying {
    public title: string;
    public station: string;
    public genre: string;
    public bitrate: string;
    public iconUrl: string;

    public updateStation(station: Station) {
        this.station = station.title;
        this.genre = station.genre;
        this.iconUrl = station.iconUrl;
    }

    public updateMetadata(metadata: Metadata) {
        this.title = metadata.title;
        this.bitrate = metadata.bitrate;
        /* If we don't already have a stored station title and one
        was provided in the metadata, then use the metadata version. */
        if(this.station == null && metadata.stationTitle != null) {
            this.station = metadata.stationTitle;
        }
        /* Similarly, assign genre if it was returned in
        the metadata and doesn't already exist. */
        if(this.genre == null && metadata.genre != null) {
            this.genre = metadata.genre;
        }
    }
}