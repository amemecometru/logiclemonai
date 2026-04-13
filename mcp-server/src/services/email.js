// Email verification service

const FREE_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
];

const RISKY_PATTERNS = ["test", "fake", "temp", "disposable", "trash", "noreply", "no-reply"];

export function verifyEmail(email) {
  if (!email || typeof email !== "string") {
    return {
      valid: false,
      deliverable: false,
      risk: "high",
      score: 0,
    };
  }

  const parts = email.split("@");
  if (parts.length !== 2) {
    return {
      valid: false,
      deliverable: false,
      risk: "high",
      score: 0,
    };
  }

  const domain = parts[1].toLowerCase();
  const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = basicPattern.test(email);

  // Check for free email domains
  const isFree = FREE_DOMAINS.some((d) => domain.includes(d));

  // Check for risky patterns
  const isRisky = RISKY_PATTERNS.some((pattern) => domain.includes(pattern));

  let score = 0;
  if (valid) score += 0.4;
  if (!isRisky) score += 0.3;
  if (!isFree) score += 0.3; // Business emails are more reliable

  let risk = "low";
  if (isRisky) risk = "high";
  else if (isFree) risk = "medium";

  const deliverable = valid && !isRisky;

  return {
    valid,
    deliverable,
    risk,
    score: Math.round(score * 100) / 100,
    recommendation: deliverable ? "Safe to use for outreach" : "Verify manually before use",
  };
}
