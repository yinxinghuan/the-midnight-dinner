// The Midnight Dinner — V1 content (single hero + 5 hotspots + 1 ending).
//
// One hero (long candlelit dinner table seen from your seat at the head).
// Five hotspots, one for each age of you sitting around the table.
// Each spot plays a 5-second clip of that age speaking one line.
// After all five visited, the ending video plays automatically.

import type { SpotDef, V1ContentDef } from './types';

const sp = (id: string, video: string, labelKey: string, pinX: number, pinY: number): SpotDef =>
  ({ id, video, labelKey, pinX, pinY });

// Pin coordinates are IMAGE-percent (0-100). Engine maps to viewport-percent
// via `-13 + p × 1.26`. See [[platform-safe-area-13pct]].
//
// Layout (approximate, will be tuned after the hero image is rendered):
//   long table seen from your seat at the head (foreground POV).
//   18: far end of the table (smallest, deepest)
//   25: middle-left along left side
//   32: middle-right along right side
//   40: near-left (closer to camera)
//   50: near-right (closer to camera)

export const CONTENT: V1ContentDef = {
  hero: 'hero.png',
  endingVideo: 'ending.mp4',
  endingPoster: 'ending_poster.png',
  spots: [
    // Layout maps to the 5 objects on the dining-table hero:
    sp('you_18', 'you_18.mp4', 'spot.you_18', 22, 78),  // the notebook (lower-left)
    sp('you_25', 'you_25.mp4', 'spot.you_25', 32, 62),  // the coffee cup
    sp('you_32', 'you_32.mp4', 'spot.you_32', 52, 60),  // the wine glass (center)
    sp('you_40', 'you_40.mp4', 'spot.you_40', 70, 62),  // the cigarette + ashtray
    sp('you_50', 'you_50.mp4', 'spot.you_50', 80, 75),  // the silver locket (lower-right)
  ],
  endingType: 'horror',
  endingTitleKey: 'ending.title',
  endingTaglineKey: 'ending.tagline',
};
