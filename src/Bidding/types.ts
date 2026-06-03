// The Midnight Dinner — V1 framework types.
//
// V1 = single hero scene with N hotspots, each hotspot plays one short clip,
// after all hotspots visited the one ending video plays automatically.
// No decision tree, no branching, no choice buttons.

export type EndingType = 'sensual' | 'horror';

export interface SpotDef {
  id: string;
  video: string;         // filename in /public/videos/
  labelKey: string;      // i18n key for the visible hotspot label / chip
  // Hotspot pin position on the hero image (image-percent 0-100). Engine
  // maps to viewport-percent via `-13 + p × 1.26` (see [[platform-safe-area-13pct]]).
  pinX: number;
  pinY: number;
}

export interface V1ContentDef {
  hero: string;          // filename in /public/stills/ — the static hero scene
  endingVideo: string;   // filename in /public/videos/ — plays after all spots
  endingPoster?: string; // filename in /public/stills/ — optional poster for ending
  spots: SpotDef[];      // N (default 5) hotspots
  endingType: EndingType;
  endingTitleKey: string;
  endingTaglineKey: string;
}

export type Phase = 'intro' | 'hero' | 'playing-clip' | 'ending' | 'ending-card';
