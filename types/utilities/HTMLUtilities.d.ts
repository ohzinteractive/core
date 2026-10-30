declare class HTMLUtilities {
    static load_images(container: HTMLElement): void;
    static load_videos(container: HTMLElement): void;
    static load_iframes(container: HTMLElement): void;
    static load_elements(container: HTMLElement, selector: string): void;
}
export { HTMLUtilities };
