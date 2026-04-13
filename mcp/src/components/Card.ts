import { Box, Text } from "@opentui/core";

interface CardProps {
  title?: string;
  content?: string;
  accentColor?: "yellow" | "lime" | "magenta" | "violet";
  width?: string | number;
  height?: string | number;
}

export function createCard(props: CardProps = {}) {
  const {
    title = "",
    content = "",
    accentColor = "yellow",
    width = "100%",
    height = "auto"
  } = props;

  // Define accent colors
  const colors: Record<string, string> = {
    yellow: "#ffff00",
    lime: "#00ff00",
    magenta: "#ff00ff",
    violet: "#ee82ee"
  };

  const accent = colors[accentColor] || colors.yellow;

  // Glass-morph dark container with simulated blur effect
  const card = Box({
    width,
    height,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark base for glass effect
    border: `1px solid ${accent}`, // Thin border with accent color
    borderRadius: 3,
    overflow: "hidden"
  });

  // Optional title bar
  if (title) {
    const titleBar = Box({
      width: "100%",
      height: 3,
      backgroundColor: `rgba(0, 0, 0, 0.5)`, // Semi-transparent dark
      borderBottom: `1px solid ${accent}`,
      children: [
        Text({
          content: title,
          fg: accent,
          textAlign: "center",
          fontWeight: "bold"
        })
      ]
    });
    card.add(titleBar);
  }

  // Content area
  if (content) {
    const contentBox = Box({
      width: "100%",
      height: content === "" ? 1 : "auto",
      backgroundColor: "rgba(0, 0, 0, 0.2)", // Even darker for content depth
      padding: 1,
      children: [
        Text({
          content: content,
          fg: "#ffffff", // White text for readability on dark bg
          textAlign: "left"
        })
      ]
    });
    card.add(contentBox);
  }

  // Accent corner element (simulating floating accent)
  const accentCorner = Box({
    width: 3,
    height: 3,
    backgroundColor: accent,
    right: 0,
    bottom: 0
  });
  card.add(accentCorner);

  return card;
}
