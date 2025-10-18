import { getCompletedMessage, getAddedMessage } from "../statusMessagesHelper";

describe("statusMessagesHelper", () => {
  describe("getCompletedMessage works", () => {
    test("caps at 3 for counts >=3", () => {
      const cappedMessage = getCompletedMessage(3);
      [4, 6, 10, 18].forEach((n) => {
        expect(getCompletedMessage(n)).toBe(cappedMessage);
      });
    });

    test("returns fallback for negative counts", () => {
      expect(getCompletedMessage(-1)).toBe("Status unknown…");
      expect(getCompletedMessage(-2)).toBe("Status unknown…");
    });
  });

  describe("getAddedMessage works", () => {
    test("caps at 3 for counts >=3", () => {
      const cappedMessage = getAddedMessage(3);
      [4, 6, 10, 18].forEach((n) => {
        expect(getAddedMessage(n)).toBe(cappedMessage);
      });
    });

    test("returns fallback for negative counts", () => {
      expect(getAddedMessage(-1)).toBe("Status unknown…");
      expect(getAddedMessage(-2)).toBe("Status unknown…");
    });
  });
});
