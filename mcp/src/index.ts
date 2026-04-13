import { createResearchInterface } from "./app";

async function main() {
  try {
    console.log("Starting LogiclemonAI Neon Research Interface...");
    const renderer = await createResearchInterface();
    await renderer.waitForClose();
    console.log("Interface closed. Goodbye!");
  } catch (error) {
    console.error("Failed to start interface:", error);
    process.exit(1);
  }
}

main();
