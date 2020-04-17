/** Sets an alternative image source on the provided image element
 * if the alt isn't already assigned.  Useful for using an alt image
 * in case the requested image fails to load.
 * @param imageElement img DOM element to apply the alt src to.
 * @param altSrc alt image source to apply to the specified img element.
 */
export function setAltSrc(imageElement: HTMLImageElement, altSrc: string) {
    if (imageElement.src !== altSrc) {
        imageElement.src = altSrc;
    }
}
