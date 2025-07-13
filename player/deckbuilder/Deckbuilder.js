// Unified DeckBuilder.js


class DeckBuilder {
    constructor() {
      this.slidesArray = [];
      this.currentTime = 0;
      this.background = {
        backgroundColor : "#F3E5AB",
        backgroundImage : "/images/taleem.webp",
        backgroundImageOpacity : 0.07,
      } 

 // Declarative slide registry
      this.s = Object.fromEntries(
        [
          "eq",
          "titleSlide",
          "titleAndSubtitle",
          "bulletList",
          "twoColumnText",
          "imageSlide",
          "imageWithTitle",
          "imageWithCaption",
          "imageLeftBulletsRight",
          "imageRightBulletsLeft",
          "table",
          "statistic",
          "donutChart",
          "bigNumber",
          "barChart",
          "quoteSlide",
          "quoteWithImage",
          "cornerWordsSlide",
          "contactSlide",
          "fillImage"
        ].map((type) => [
          type,
          (end, data) => this._add(type, end, data)
        ])
      );
}

// deckbuilder.setBackgroundImage("/images/taleem.webp");
// deckbuilder.setBackgroundColor("#F3E5AB");

  setTheme(themeName) {
    this.theme = themeName;
  }

  setBackgroundImage(url) {
    this.background.backgroundImage = url;
  }
  
  setBackgroundColor(color) {
    this.background.backgroundColor = color;
  }
  
  setBackgroundOpacity(value) {
    this.background.backgroundImageOpacity = value;
  }
  

  addDetails({
    name = "unnamed_deck",
    description = "",
    tags = [],
    status = "draft",
    createdAt = new Date().toISOString(),
    editedAt = new Date().toISOString()
  } = {}) {
    this.details = {
      name,
      description,
      tags,
      status,
      createdAt,
      editedAt
    };
  }
  

  buildEq(data) {
    const lines = [];
    let currentLine = null;

    for (const item of data) {
      if (!item.type.startsWith('sp')) {
        // start a new line
        currentLine = {
          name: 'line',
          type:    item.type,
          content: item.content,
          showAt:  item.showAt,
          spItems: []
        };
        lines.push(currentLine);
      } else if (currentLine) {
        // collect sidebar items
        currentLine.spItems.push({
          type:    item.type,
          content: item.content
        });
      }
    }

    return lines;
  }
  _add(type, end, data) {
    const start = this.currentTime;
    if (end <= start) {
      throw new Error(`Invalid slide timing: end (${end}) must be greater than start (${start})`);
    }
    this.currentTime = end;

    if (type === 'eq') {
      // use our new helper to transform flat EQ data
      const nested = this.buildEq(data);
      this.slidesArray.push({ type, start, end, data: nested });
      return;
    }

    const patchedData = data.map((item) =>
      item.showAt === undefined ? { ...item, showAt: 0 } : item
    );

    this.slidesArray.push({ type, start, end, data: patchedData });
  }
  
    build() {
      if (!this.details) {
        this.addDetails({ name: "unnamed_deck" });
      }
      return {
        ...this.details,
        version: "deck-v1",
        background: this.background ?? null,
        deck: this.slidesArray
      };
    }
    
  }
  
module.exports = DeckBuilder;  