import { DateHelper } from "../dateHelper";

const dateHelper = DateHelper();

// fixed date for consistent tests
const MOCK_TODAY = "2024-10-15T12:00:00.000Z"; // ISO format

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(MOCK_TODAY));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("dateHelper", () => {
  test("returns current date in YYYY-MM-DD format", () => {
    expect(dateHelper.getCurrentDate()).toBe("2024-10-15");
  });

  test("calculates correctly days between two days", () => {
    expect(dateHelper.daysBetween("2024-10-10", "2024-10-15")).toBe(5);
    expect(dateHelper.daysBetween("2024-10-15", "2024-10-10")).toBe(-5); // negative allowed
    expect(dateHelper.daysBetween("2024-02-28", "2024-03-01")).toBe(2); // leap year check
  });

  test("calculates correct date for X days ago", () => {
    expect(dateHelper.dateDaysAgo(1)).toBe("2024-10-14");
    expect(dateHelper.dateDaysAgo(7)).toBe("2024-10-08");
  });
});
