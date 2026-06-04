// The Midnight Dinner — V1 i18n (en / zh).

type Locale = 'zh' | 'en';

const STORAGE_KEY = 'midnight_dinner_locale';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  try {
    const override = window.localStorage.getItem(STORAGE_KEY);
    if (override === 'zh' || override === 'en') return override;
  } catch {}
  const nav = (typeof navigator !== 'undefined' ? navigator.language : 'en') || 'en';
  return nav.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

const LOCALE: Locale = detectLocale();

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    'spot.you_18': 'the notebook',
    'spot.you_25': 'the coffee',
    'spot.you_32': 'the wine',
    'spot.you_40': 'the cigarette',
    'spot.you_50': 'the locket',

    // ── Title card (idle, before first tap) ────────────────────────────────
    'title.overline':  '// midnight, the head of the table',
    'title.main':      'the midnight dinner',
    'title.sub':       '[  she is at the far end  //  you brought yourself  ]',
    'hint.firstTap':   'tap an object —',
    'cue.climax':      'she stands',

    // ── Subtitles (UI overlay, NOT baked into video) ───────────────────────
    'subtitle.you_18': "I thought we'd be braver than this.",
    'subtitle.you_25': "I never told them what you did to me that summer.",
    'subtitle.you_32': "You were happy for ten months. You don't remember which ten.",
    'subtitle.you_40': "I don't recognize you.",
    'subtitle.you_50': "I've been waiting here a long time.",

    'ending.title':   'she was always going to be you',
    'ending.tagline': 'The silhouette stood up. She walked the length of the table. By the time she reached you she was you at fifty, and she was smiling.',

    'ui.replay':         'sit down again',
    'ui.ending_label':   'ending',
    'ui.sensual_label':  'sensual',
    'ui.horror_label':   'wrong',
    'ui.brand_sig':      'alteru · after dark',
    'ui.progress':       '{n}/5',

    'intro.title':   'the midnight dinner',
    'intro.hint':    "Midnight. A private dining room behind red drapes. A shadow sits at the far end of the table. Five objects sit on your half. Tap each — each one belongs to a different age of you, and that age will rise to speak. When all five have spoken, the shadow stands up.",
    'intro.cta':     'sit down',
  },

  zh: {
    'spot.you_18': '笔记本',
    'spot.you_25': '咖啡',
    'spot.you_32': '红酒',
    'spot.you_40': '香烟',
    'spot.you_50': '银锁',

    'title.overline':  '// 午夜, 桌头',
    'title.main':      '午夜的晚餐',
    'title.sub':       '[  她在远端  //  你带来了你自己  ]',
    'hint.firstTap':   '点一件东西 —',
    'cue.climax':      '她站起来了',

    'subtitle.you_18': '我以为我们会勇敢一些。',
    'subtitle.you_25': '那个夏天你对我做的事, 我一直没告诉过别人。',
    'subtitle.you_32': '你那时开心过十个月。你都不记得是哪十个月。',
    'subtitle.you_40': '我不认识你。',
    'subtitle.you_50': '我在这里等了很久。',

    'ending.title':   '她一直都会是你',
    'ending.tagline': '剪影站了起来。她沿着长桌走过来。走到你面前的时候, 已经是五十岁的你, 在笑。',

    'ui.replay':         '再坐一次',
    'ui.ending_label':   '结局',
    'ui.sensual_label':  '感官',
    'ui.horror_label':   '不对劲',
    'ui.brand_sig':      'alteru · after dark',
    'ui.progress':       '{n}/5',

    'intro.title':   '午夜的晚餐',
    'intro.hint':    '午夜。红绒幕私人餐厅。一个剪影坐在长桌远端。你这一头桌面上散着五样东西。每样东西属于不同年龄的你 — 点开, 那个年龄会起来说话。五个都说完, 远端的剪影就站起来。',
    'intro.cta':     '坐下',
  },
};

export function t(key: string, vars?: Record<string, string | number>): string {
  let s = STRINGS[LOCALE][key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}

export function locale(): Locale { return LOCALE; }
