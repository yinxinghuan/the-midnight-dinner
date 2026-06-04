// The Midnight Dinner — V1 content. One hero + 5 hotspots + 1 ending.
//
// Layout follows replicant-wake's pattern: each hotspot is a RECTANGULAR
// tap area (top/left/width/height in %) that covers an object on the hero
// image. A pulsing ripple affordance sits inside the rectangle to draw the
// eye to that object. Tapping the rectangle plays that age's clip.

import type { SpotDef, V1ContentDef } from './types';

const sp = (
  id: string,
  video: string,
  labelKey: string,
  subtitleKey: string,
  top: number, left: number, width: number, height: number,
): SpotDef => ({
  id, video,
  endFrame: `${id}.png`,
  labelKey, subtitleKey,
  top, left, width, height,
  affordanceX: 50, affordanceY: 50,
});

// Rectangles map to the 5 objects on the dining-table hero:
//   notebook    lower-left
//   coffee      mid-left
//   wine        center
//   cigarette   mid-right
//   locket      lower-right

export const CONTENT: V1ContentDef = {
  hero: 'hero.png',
  endingVideo: 'ending.mp4',
  endingPoster: 'ending_poster.png',
  spots: [
    sp('you_18', 'you_18.mp4', 'spot.you_18', 'subtitle.you_18',
       70, 6,  30, 26),   // notebook (lower-left)
    sp('you_25', 'you_25.mp4', 'spot.you_25', 'subtitle.you_25',
       54, 22, 22, 22),   // coffee cup
    sp('you_32', 'you_32.mp4', 'spot.you_32', 'subtitle.you_32',
       52, 42, 20, 28),   // wine glass (center)
    sp('you_40', 'you_40.mp4', 'spot.you_40', 'subtitle.you_40',
       54, 62, 22, 22),   // cigarette in ashtray
    sp('you_50', 'you_50.mp4', 'spot.you_50', 'subtitle.you_50',
       66, 78, 28, 22),   // silver locket (lower-right)
  ],
  endingType: 'horror',
  endingTitleKey: 'ending.title',
  endingTaglineKey: 'ending.tagline',
  endingSubtitleKey: 'ending.subtitle',
};
