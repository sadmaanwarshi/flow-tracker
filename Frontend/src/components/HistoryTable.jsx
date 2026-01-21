import { formatDate } from "../utils/dateFormat";

export default function HistoryTable({ data }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Cycle History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-left">
              <th className="pl-4">Start Date</th>
              <th>End Date</th>
              <th>Cycle Length</th>
              <th>Period Length</th>
            </tr>
          </thead>

          <tbody>
            {data.map((c, i) => (
              <tr
                key={i}
                className="bg-gray-50 rounded-xl text-gray-700"
              >
                <td className="pl-4 py-3 font-medium rounded-l-xl">
                  {formatDate(c.cycle_start)}
                </td>

                <td className="py-3">
                  {formatDate(c.cycle_end)}
                </td>

                <td className="py-3">
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    {c.cycle_length} days
                  </span>
                </td>

                <td className="py-3 rounded-r-xl">
                  <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                    {c.period_length} days
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">
          No cycle history available yet.
        </p>
      )}
    </div>
  );
}
