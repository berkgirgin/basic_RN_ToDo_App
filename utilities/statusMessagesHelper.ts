type StatusMessage = {
  count: number;
  message: string;
};

// Helper for recently completed wishes
export const getCompletedMessage = (count: number): string => {
  const cappedCount = count >= 3 ? 3 : count;
  const messageObj = recentlyCompletedMessages.find(
    (m) => m.count === cappedCount
  );
  return messageObj ? messageObj.message : "😎 Status unknown…";
};

// Helper for recently added wishes
export const getAddedMessage = (count: number): string => {
  const cappedCount = count >= 3 ? 3 : count;
  const messageObj = recentlyAddedMessages.find((m) => m.count === cappedCount);
  return messageObj ? messageObj.message : "😎 Status unknown…";
};

const recentlyCompletedMessages: StatusMessage[] = [
  {
    count: 0,
    message:
      "Haven’t completed any wishes yet… patience, my dear P.M.D, your love is warming up.",
  },
  {
    count: 1,
    message:
      "One wish fulfilled, stay in position! — your devoted evil man has arrived.",
  },
  {
    count: 2,
    message:
      "Two wishes have been obliterated. Clearly, I’m an American soldier.",
  },
  {
    count: 3,
    message:
      "Three or more wishes conquered. Behold, your personal superhero, unmatched and unstoppable, delivering every desire of yours.",
  },
];

const recentlyAddedMessages: StatusMessage[] = [
  {
    count: 0,
    message:
      "No wishes yet? Smart move, my sexy P.M.D. Calmness suits you beautifully.",
  },
  {
    count: 1,
    message: "A wish has been added. Easy — I like a manageable challenge.",
  },
  {
    count: 2,
    message: "Two wishes noted. Not ideal, but clearly you know I love you.",
  },
  {
    count: 3,
    message:
      "Three or more wishes? Careful… you’re pushing your Romeo to his limits.",
  },
];
