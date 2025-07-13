
import { z } from 'zod';

// Base shared slide structure
const baseSlide = z.object({
  start: z.number(),
  end: z.number()
});

// 1 TITLE SLIDE
const titleSlide = baseSlide.extend({
  type: z.literal("titleSlide"),
  data: z.array(
    z.object({
      name: z.literal("title"),
      content: z.string(),
      showAt: z.number()
    })
  )
});

// 2 TITLE AND SUBTITLE
const titleAndSubtitle = baseSlide.extend({
  type: z.literal("titleAndSubtitle"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("title"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("subtitle"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 3 BULLET LIST
const bulletList = baseSlide.extend({
  type: z.literal("bulletList"),
  data: z.array(
    z.object({
      name: z.literal("bullet"),
      content: z.string(),
      showAt: z.number()
    })
  )
});

// 4 TWO COLUMN TEXT
const twoColumnText = baseSlide.extend({
  type: z.literal("twoColumnText"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("title"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("left"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("right"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 5 IMAGE SLIDE
const imageSlide = baseSlide.extend({
  type: z.literal("imageSlide"),
  data: z.array(
    z.object({ name: z.literal("image"), content: z.string(), showAt: z.number() })
  )
});

// 6 IMAGE WITH TITLE
const imageWithTitle = baseSlide.extend({
  type: z.literal("imageWithTitle"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("image"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("title"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 7 IMAGE WITH CAPTION
const imageWithCaption = baseSlide.extend({
  type: z.literal("imageWithCaption"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("image"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("caption"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 8 IMAGE LEFT BULLETS RIGHT
const imageLeftBulletsRight = baseSlide.extend({
  type: z.literal("imageLeftBulletsRight"),
  data: z.array(
    z.object({
      name: z.union([z.literal("image"), z.literal("bullet")]),
      content: z.string(),
      showAt: z.number()
    })
  )
});

// 9 IMAGE RIGHT BULLETS LEFT
const imageRightBulletsLeft = baseSlide.extend({
  type: z.literal("imageRightBulletsLeft"),
  data: z.array(
    z.object({
      name: z.union([z.literal("image"), z.literal("bullet")]),
      content: z.string(),
      showAt: z.number()
    })
  )
});

// 10 TABLE
const table = baseSlide.extend({
  type: z.literal("table"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("headers"), content: z.array(z.string()), showAt: z.number() }),
      z.object({ name: z.literal("rows"), content: z.array(z.array(z.string())), showAt: z.number() })
    ])
  )
});

// 11 STATISTIC
const statistic = baseSlide.extend({
  type: z.literal("statistic"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("number"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("label"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 12 DONUT CHART
const donutChart = baseSlide.extend({
  type: z.literal("donutChart"),
  data: z.array(
    z.object({
      name: z.union([z.literal("percent"), z.literal("label"), z.literal("color")]),
      content: z.string(),
      showAt: z.number()
    })
  )
});

// 13 BIG NUMBER
const bigNumber = baseSlide.extend({
  type: z.literal("bigNumber"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("number"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("label"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 14 BAR CHART
const barChart = baseSlide.extend({
  type: z.literal("barChart"),
  data: z.array(
    z.object({
      name: z.literal("bar"),
      label: z.string(),
      value: z.number(),
      showAt: z.number()
    })
  )
});

// 15 QUOTE SLIDE
const quoteSlide = baseSlide.extend({
  type: z.literal("quoteSlide"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("quoteLine"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("author"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 16 QUOTE WITH IMAGE
const quoteWithImage = baseSlide.extend({
  type: z.literal("quoteWithImage"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("quoteLine"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("author"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("image"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 17 CORNER WORDS SLIDE
const cornerWordsSlide = baseSlide.extend({
  type: z.literal("cornerWordsSlide"),
  data: z.array(
    z.object({
      name: z.literal("card"),
      icon: z.string(),
      label: z.string(),
      showAt: z.number()
    })
  )
});

// 18 CONTACT SLIDE
const contactSlide = baseSlide.extend({
  type: z.literal("contactSlide"),
  data: z.array(
    z.union([
      z.object({ name: z.literal("headline"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("email"), content: z.string(), showAt: z.number() }),
      z.object({ name: z.literal("phone"), content: z.string(), showAt: z.number() })
    ])
  )
});

// 19 Eq : eq schema
// 19. EQ SLIDE
const eqSlide = baseSlide.extend({
  type: z.literal("eq"),
  data: z.array(
    z.object({
      name:    z.literal("line"),
      type:    z.union([
                  z.literal("heading"),
                  z.literal("text"),
                  z.literal("math")
               ]),
      content: z.string(),
      showAt:  z.number(),
      spItems: z.array(
        z.object({
          type:    z.union([
                      z.literal("spHeading"),
                      z.literal("spText"),
                      z.literal("spMath"),
                      z.literal("spImage")
                   ]),
          content: z.string()
        })
      ).optional()
    })
  )
});

const fillImage = baseSlide.extend({
  type: z.literal("fillImage"),
  data: z.array(
    z.object({
      name: z.literal("image"),
      content: z.string(),
      showAt: z.number()
    })
  )
});

//////////////===> Final Deck Object
export const zodDeckV1 = z.object({
    name:        z.string().optional(),
    description: z.string().optional(),
    tags:        z.array(z.string()).optional(),
    status:      z.enum(['draft','ready','published','archived']).optional(),
    createdAt:   z.string().datetime().optional(),
    editedAt:    z.string().datetime().optional(),
    version:     z.literal("deck-v1"),
    background: z
    .object({
      backgroundColor: z.string().optional(),
      backgroundImage: z.string().optional(),
      backgroundImageOpacity: z.number().optional()
    })
    .optional(),
    deck:        z.array(
      z.discriminatedUnion("type", [
        eqSlide,
        fillImage,
        titleSlide,
        titleAndSubtitle,
        bulletList,
        twoColumnText,
        imageSlide,
        imageWithTitle,
        imageWithCaption,
        imageLeftBulletsRight,
        imageRightBulletsLeft,
        table,
        statistic,
        donutChart,
        bigNumber,
        barChart,
        quoteSlide,
        quoteWithImage,
        cornerWordsSlide,
        contactSlide
      ])
    )
  });  
