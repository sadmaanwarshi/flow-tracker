export default function CalendarView({ data }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="font-semibold mb-4">Cycle Calendar</h2>

      <div className="space-y-2">
        {data.map((c) => (
          <div
            key={c.cycleId}
            className="border p-3 rounded-xl"
          >
            <p className="font-medium">
              {c.start} → {c.end}
            </p>
            <p className="text-sm text-gray-500">
              Phases included
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
