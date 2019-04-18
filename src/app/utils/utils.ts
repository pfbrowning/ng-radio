export class Utils {
    /** Sets an alternative image source on the provided image element
     * if the alt isn't already assigned.  Useful for using an alt image
     * in case the requested image fails to load. */
    public static SetAltImage(img: HTMLImageElement, altSrc: string) {
        if (img.src !== altSrc) {
            img.src = altSrc;
        }
    }
}
