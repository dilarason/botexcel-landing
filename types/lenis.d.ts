declare module "@studio-freight/lenis" {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smooth?: boolean;
    smoothTouch?: boolean;
    direction?: "vertical" | "horizontal";
    gestureDirection?: "vertical" | "horizontal" | "both";
    wrapper?: HTMLElement | null;
    content?: HTMLElement | null;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);

    /**
     * Lenis “scroll” event handler
     */
    on(event: "scroll", handler: (info: { scroll: number; progress: number }) => void): void;

    /**
     * Lenis animation frame update.
     */
    raf(time: number): void;

    /**
     * Manual scroll-to API.
     */
    scrollTo(
      target: number | HTMLElement,
      opts?: {
        offset?: number;
        immediate?: boolean;
        lock?: boolean;
        duration?: number;
        easing?: (t: number) => number;
      }
    ): void;

    stop(): void;
    start(): void;
  }
}
