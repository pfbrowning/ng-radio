export class Utils {
    public static SetAltImage(img: HTMLImageElement, altSrc: string) {
        if (img.src !== altSrc) {
            img.src = altSrc;
        }
    }
}
