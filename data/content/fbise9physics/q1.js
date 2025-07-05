


// EQ slide ending at 60s
const eq = deckbuilder.s.eq(60);

// Add a heading at the start
eq.addLine({
  type: "heading",
  content: "Math Formula Showcase",
  showAt: 0
});
eq.addSp({ type: "heading", content: "A quick review of famous formulas" });
eq.addSp({ type: "text", content: "A quick review of famous formulas" });

// Line 1: mass–energy equivalence
eq.addLine({
  type: "math",
  content: "E = mc^2",
  showAt: 5
});
eq.addSp({ type: "math", content: "E = mc^2" });
eq.addSp({
  type: "image",
  content: "/pivot/box.webp"
});
// Line 2: quadratic formula
eq.addLine({
  type: "math",
  content: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
  showAt: 15
});
eq.addSp({ type: "math", content: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" });

// Insert a descriptive text line
eq.addLine({
  type: "text",
  content: "These equations underpin classical and modern physics.",
  showAt: 25
});
eq.addSp({ type: "text", content: "From relativity to everyday calculations" });

// Line 3: definite integral
eq.addLine({
  type: "math",
  content: "\\int_{0}^{π} \\sin x \\,dx = 2",
  showAt: 30
});
eq.addSp({ type: "math", content: "\\int_{0}^{π} \\sin x \\,dx = 2" });

// Line 4: Basel problem
eq.addLine({
  type: "math",
  content: "\\sum_{n=1}^{∞} \\frac{1}{n^2} = \\frac{π^2}{6}",
  showAt: 40
});
eq.addSp({ type: "math", content: "\\sum_{n=1}^{∞} \\frac{1}{n^2} = \\frac{π^2}{6}" });

// Line 5: limit of sine over x
eq.addLine({
  type: "math",
  content: "\\lim_{x→0} \\frac{\\sin x}{x} = 1",
  showAt: 50
});
eq.addSp({ type: "math", content: "\\lim_{x→0} \\frac{\\sin x}{x} = 1" });

// Add a closing text line
eq.addLine({
  type: "text",
  content: "End of math showcase. Explore further concepts!",
  showAt: 55
});
eq.addSp({ type: "text", content: "Thank you for watching" });

