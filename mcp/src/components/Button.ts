import { Box, Text } from "@opentui/core";

interface ButtonProps {
  content: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  fg?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export function createButton(props: ButtonProps) {
  const {
    content = "",
    width = "auto",
    height = "auto",
    backgroundColor = "rgba(0, 0, 0, 0.3)",
    fg = "#ffff00",
    borderColor = "#ffff00",
    borderWidth = 1,
    borderRadius = 2,
    onPress,
    disabled = false
  } = props;

  // Button container
  const button = Box({
    width,
    height,
    backgroundColor: disabled 
      ? "rgba(0, 0, 0, 0.2)" 
      : backgroundColor,
    border: `${borderWidth}px solid ${disabled ? "#555555" : borderColor}`,
    borderRadius,
    // Simple hover/press simulation - in a real app, you'd add mouse event listeners
    // For now, we'll rely on the onPress handler being called externally
  });

  // Button text
  const buttonText = Text({
    content: content,
    fg: disabled ? "#888888" : fg,
    textAlign: "center"
  });

  button.add(buttonText);
  
  // In a real implementation, you would attach mouse event listeners here
  // For demo purposes, we'll just return the button and note that onPress
  // needs to be handled by the parent component
  
  return { button, onPress };
}
