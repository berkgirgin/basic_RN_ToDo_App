type StatusMessage = {
  count: number;
  message: string;
};

// Helper for recently completed wishes
export const getCompletedMessage = (count: number): string => {
  const cappedCount = count >= 5 ? 5 : count;
  const messageObj = recentlyCompletedMessages.find(
    (m) => m.count === cappedCount
  );
  return messageObj ? messageObj.message : "😎 Status unknown…";
};

// Helper for recently added wishes
export const getAddedMessage = (count: number): string => {
  const cappedCount = count >= 5 ? 5 : count;
  const messageObj = recentlyAddedMessages.find((m) => m.count === cappedCount);
  return messageObj ? messageObj.message : "😎 Status unknown…";
};

const recentlyCompletedMessages = [
  {
    count: 0,
    message:
      "😴 Zero wishes completed… but don’t worry, I’m just warming up. Patience, my queen.",
  },
  {
    count: 1,
    message:
      "💥 1 wish down. Bow down — your boyfriend is officially unstoppable.",
  },
  {
    count: 2,
    message:
      "🦾 2 wishes crushed. Honestly, I should be on a billboard: “Legend in Action.”",
  },
  {
    count: 3,
    message:
      "🏎️ 3 wishes fulfilled. I’m moving faster than your heart can keep up.",
  },
  {
    count: 4,
    message:
      "🔥 4 wishes granted. Warning: excessive boyfriend excellence detected.",
  },
  {
    count: 5,
    message:
      "🚀 5+ wishes obliterated. I’m basically a one-man superhero franchise.",
  },
];

const recentlyAddedMessages = [
  {
    count: 0,
    message:
      "✨ No wishes yet? Smart move. I’m too powerful to handle too many.",
  },
  {
    count: 1,
    message:
      "😎 1 wish added. Easy — I like it when a challenge is manageable.",
  },
  {
    count: 2,
    message: "🕶️ 2 wishes? Bold. But I’m still winning at this game.",
  },
  {
    count: 3,
    message: "🏆 3 wishes noted. Careful, I might start breaking records.",
  },
  {
    count: 4,
    message:
      "🔥 4 wishes… now we’re flirting with overkill. Are you ready for me?",
  },
  {
    count: 5,
    message:
      "🤯 5+ wishes?! Slow down, mortal. I can’t be held responsible for my own excellence.",
  },
];
