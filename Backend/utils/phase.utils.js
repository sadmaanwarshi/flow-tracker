export const calculatePhases = (cycleStart, cycleLength) => {
  const start = new Date(cycleStart);

  const addDays = (d) => {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    return date.toISOString().split("T")[0];
  };

  return {
    menstrual: { start: addDays(0), end: addDays(4) },
    follicular: { start: addDays(5), end: addDays(12) },
    ovulation: { date: addDays(cycleLength - 14) },
    luteal: {
      start: addDays(cycleLength - 13),
      end: addDays(cycleLength - 1),
    },
    fertileWindow: {
      start: addDays(cycleLength - 18),
      end: addDays(cycleLength - 13),
    },
  };
};
