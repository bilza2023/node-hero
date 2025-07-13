import { metaV1Schema } from './schema/metaV1Schema.js';

/**
 * MetaGenerator builds a meta-v1 object for a given deck-v1 input
 */
export class MetaGenerator {
  /**
   * @param {{ version: string; slides: Array<{ start: number; end: number; data: Array<{ showAt: number; name: string; }>; }>; }} deck
   */
  constructor(deck) {
    if (!deck || deck.version !== 'deck-v1' || !Array.isArray(deck.slides)) {
      throw new Error('Invalid deck-v1 object');
    }
    this.deck = deck;
  }

  /**
   * Generate the default meta-v1 object from the deck
   * @returns {{ version: 'meta-v1'; entries: Array<{ label: string; end: number; items: number[]; images?: string[]; }>; }}
   */
  generate() {
    const entries = this.deck.slides.map((slide, idx) => {
      const label = this._inferLabel(slide, idx);
      const end = slide.end;
      const items = this._collectShowAts(slide);
      return { label, end, items };
    });

    const meta = { version: 'meta-v1', entries };

    // Validate against schema
    const result = metaV1Schema.safeParse(meta);
    if (!result.success) {
      console.error('MetaGenerator validation error:', result.error.format());
      throw new Error('Generated meta-v1 did not pass schema validation');
    }

    return result.data;
  }

  /**
   * Infer a label for a slide, defaulting to "slide_XXX"
   * @param {object} slide
   * @param {number} idx
   */
  _inferLabel(slide, idx) {
    // Try to find a title or first text content as label
    const titleItem = slide.data.find(item => item.name === 'title' || item.name === 'quoteLine');
    if (titleItem && typeof titleItem.content === 'string') {
      // sanitize label: lowercase, replace spaces with underscore
      return titleItem.content
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    }
    // fallback to index-based label
    return `slide_${String(idx).padStart(3, '0')}`;
  }

  /**
   * Collect, dedupe, and sort showAt times from slide data
   * @param {object} slide
   */
  _collectShowAts(slide) {
    const times = slide.data
      .map(item => item.showAt)
      .filter(t => typeof t === 'number');
    const unique = Array.from(new Set(times));
    return unique.sort((a, b) => a - b);
  }

  /**
   * Apply an existing meta object to a deck, returning a new combined structure
   * @param {{ version: string; entries: Array<{ label: string; end: number; items: number[]; images?: string[]; }>; }} meta
   */
  apply(meta) {
    if (!meta || meta.version !== 'meta-v1' || !Array.isArray(meta.entries)) {
      throw new Error('Invalid meta-v1 object');
    }
    const deck = { ...this.deck };
    // You can enhance deck.slides with metadata here if needed
    // e.g., attach images or labels to slides
    return deck;
  }
}
