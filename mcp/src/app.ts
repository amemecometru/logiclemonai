import { createCliRenderer, Box, Text, Input } from "@opentui/core";
import { createHeroSection } from "./components/hero";
import { createCard } from "./components/Card";
import { createButton } from "./components/Button";
import { mcpService } from "./services/mcpService";

// Color scheme constants for LogiclemonAI.com
const COLORS = {
  background: "#000000", // Dark black
  neonYellow: "#ffff00",
  neonLime: "#00ff00",
  neonMagenta: "#ff00ff",
  neonViolet: "#ee82ee",
  white: "#ffffff",
  gray: "#888888"
};

export async function createResearchInterface() {
  const renderer = await createCliRenderer();
  
  // Set root background
  renderer.root.style.backgroundColor = COLORS.background;
  
  // Initialize MCP service
  await mcpService.initialize();
  
  // Main container with flex layout
  const mainContainer = Box({
    width: "100%",
    height: "100%",
    flexDirection: "column",
    gap: 2,
    padding: 2
  });
  
  // Hero section
  const hero = await createHeroSection();
  mainContainer.add(hero);
  
  // Status card
  const statusCard = createCard({
    title: "SYSTEM STATUS",
    content: "MCP Server: Ready • Firecrawl: Online • Composio: Authorized",
    accentColor: "lime",
    height: 5
  });
  mainContainer.add(statusCard);
  
  // Research input card
  const researchCard = createCard({
    title: "DEEP RESEARCH QUERY",
    accentColor: "yellow",
    height: 8
  });
  
  // Input field
  const urlInput = Input({
    placeholder: "Enter URL for deep research...",
    width: 50,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    fg: COLORS.neonLime,
    borderColor: COLORS.neonYellow
  });
  
  // Research button
  const { button: researchButton, onPress: researchButtonOnPress } = createButton({
    content: "START RESEARCH",
    width: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    fg: COLORS.neonYellow,
    borderColor: COLORS.neonYellow,
    onPress: async () => {
      const url = urlInput.value.trim();
      if (!url) {
        showNotification(researchCard, "Please enter a URL", "error");
        return;
      }
      
      // Show loading state
      researchButton.content = "RESEARCHING...";
      researchButton.disabled = true;
      renderer.render(); // Force UI update
      
      try {
        // In a real implementation, you would:
        // 1. Create Stripe Checkout Session (via your backend)
        // 2. Wait for user to complete payment
        // 3. Get session_id from Stripe
        // 4. Call MCP service with that session_id
        
        // For demo, we'll simulate having a payment session ID
        const fakeSessionId = "cs_test_" + Math.random().toString(36).substring(2, 15);
        
        const result = await mcpService.deepResearch(url, {
          extractor: "llm-extraction",
          paymentSessionId: fakeSessionId,
          saveToDrive: true
        });
        
        if (result.error) {
          showNotification(researchCard, `Error: ${result.error}`, "error");
        } else {
          showNotification(researchCard, "Research complete! Results saved to Google Drive.", "success");
          // In a real app, you would update the results card with actual results
          // For now, we'll just show a notification
        }
      } catch (error) {
        showNotification(researchCard, `Error: ${error.message}`, "error");
      } finally {
        // Reset button state
        researchButton.content = "START RESEARCH";
        researchButton.disabled = false;
        renderer.render();
      }
    }
  });
  
  // Helper function to show notifications
  function showNotification(card: Box, message: string, type: "success" | "error") {
    const notification = Box({
      width: "100%",
      height: 2,
      backgroundColor: type === "success" 
        ? "rgba(0, 255, 0, 0.2)" 
        : "rgba(255, 0, 0, 0.2)",
      borderLeft: `3px solid ${type === "success" ? COLORS.neonLime : COLORS.neonYellow}`,
      padding: 1,
      children: [
        Text({
          content: message,
          fg: type === "success" ? COLORS.neonLime : COLORS.neonYellow,
          fontSize: "small"
        })
      ]
    });
    card.add(notification);
    renderer.render(); // Update UI immediately
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      card.remove(notification);
      renderer.render();
    }, 3000);
  }
  
  // Add input and button to research card
  const inputContainer = Box({
    width: "100%",
    height: 4,
    flexDirection: "row",
    gap: 2,
    alignItems: "center"
  });
  inputContainer.add(urlInput);
  inputContainer.add(researchButton);
  
  researchCard.add(inputContainer);
  mainContainer.add(researchCard);
  
  // Results card
  const resultsCard = createCard({
    title: "RECENT RESEARCH RESULTS",
    accentColor: "magenta",
    height: 12
  });
  
  // Simulated results list
  const resultsList = Box({
    width: "100%",
    height: "100%",
    padding: 1,
    flexDirection: "column",
    gap: 1
  });
  
  // Add some sample result items
  const sampleResults = [
    "https://example.com/research-1.md • Saved to Google Drive",
    "https://news.example.com/article.md • Saved to Google Drive", 
    "https://academic.example.com/paper.md • Saved to Google Drive"
  ];
  
  sampleResults.forEach((result, index) => {
    const resultItem = Box({
      width: "100%",
      height: 2,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      borderLeft: `3px solid ${COLORS.neonMagenta}`,
      padding: 1,
      children: [
        Text({
          content: `${index + 1}. ${result}`,
          fg: COLORS.white,
          fontSize: "small"
        })
      ]
    });
    resultsList.add(resultItem);
  });
  
  resultsCard.add(resultsList);
  mainContainer.add(resultsCard);
  
  // Footer with accents
  const footer = Box({
    width: "100%",
    height: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderTop: `1px solid ${COLORS.neonYellow}`,
    padding: 1
  });
  
  footer.add(Text({
    content: "LogiclemonAI.com • Neon Research Interface",
    fg: COLORS.neonLime,
    fontSize: "small"
  }));
  
  footer.add(Text({
    content: "Ctrl+C to Exit",
    fg: COLORS.neonYellow,
    fontSize: "small"
  }));
  
  mainContainer.add(footer);
  
  // Add everything to root
  renderer.root.add(mainContainer);
  
  // Handle cleanup on exit
  process.on('SIGINT', async () => {
    await mcpService.shutdown();
    process.exit(0);
  });
  
  return renderer;
}

// Export for use in other files
export { COLORS };
