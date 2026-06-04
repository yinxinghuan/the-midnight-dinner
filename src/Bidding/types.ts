// The Midnight Dinner — V1 framework types (replicant-wake pattern).

export type EndingType = 'sensual' | 'horror';

export interface SpotDef {
  id: string;
  video: string;          // filename in /public/videos/
  endFrame: string;       // filename in /public/stills/ — fallback when video errors
  labelKey: string;       // i18n key for the spot's name (used as aria-label)
  subtitleKey: string;    // i18n key for the spoken line shown as UI subtitle
  // Bounding rectangle of the tappable area on the hero (% of container).
  top: number;
  left: number;
  width: number;
  height: number;
  // Center of the visual ripple affordance inside the rectangle (% of bbox).
  affordanceX?: number;
  affordanceY?: number;
}

export interface V1ContentDef {
  hero: string;            // filename in /public/stills/
  endingVideo: string;     // filename in /public/videos/ — plays after all visited
  endingPoster?: string;   // filename in /public/stills/
  spots: SpotDef[];
  endingType: EndingType;
  endingTitleKey: string;
  endingTaglineKey: string;
  endingSubtitleKey?: string;  // optional subtitle for the ending video itself
}

export type Phase =
  | 'idle'              // hero is visible + hotspots + title (if no taps yet)
  | 'playing-clip'      // a hotspot's clip is playing on top of the hero
  | 'holding-subtitle'  // clip ended, subtitle still up, video fading out
  | 'climax-ready'      // all 5 visited, waiting for player to tap "showtime"
  | 'climax-playing'    // ending video is playing
  | 'revelation'        // ending video done, subtitle still up
  | 'done';             // can replay
