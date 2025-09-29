// everything uses YYYY-MM-DD format

type DateHelper = {
  getCurrentDate: () => string;
  daysBetween: (startDate: string, endDate: string) => number;
  dateDaysAgo: (daysAgo: number) => string;
};

function DateHelper(): DateHelper {
  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  function daysBetween(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffInMs = end.getTime() - start.getTime(); // difference in milliseconds
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // convert ms to days

    return diffInDays;
  }

  function dateDaysAgo(daysAgo: number) {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo); // subtract X days
    return today.toISOString().slice(0, 10); // YYYY-MM-DD
  }

  return { getCurrentDate, daysBetween, dateDaysAgo };
}

export { DateHelper };
