import { Station } from './station';

export class NowPlaying {
    public title: string;
    public station: string;
    public genre: string;

    public updateStation(station: Station) {
        this.station = station.title;
        this.genre = station.genre;
        this.title = "placeholder";
    }
}