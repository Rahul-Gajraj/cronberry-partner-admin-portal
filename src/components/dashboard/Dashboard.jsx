import React, { useEffect, useState } from "react";
import { format, parseISO, isWithinInterval } from "date-fns";
import { CalendarClock } from "lucide-react";
import confetti from "canvas-confetti";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function formatNumber(num) {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString()}`;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

const mockCustomers = [
  {
    id: 1,
    customerName: "Rahul Verma",
    partnerName: "Ananya Gupta",
    plan: "Pro Annual",
    status: "Active",
    totalPaid: 120000,
    renewalDate: "2025-04-18",
  },
  {
    id: 2,
    customerName: "Sneha Kapoor",
    partnerName: "Ravi Kumar",
    plan: "Starter Monthly",
    status: "Inactive",
    totalPaid: 10000,
    renewalDate: "2025-04-25",
  },
  {
    id: 3,
    customerName: "Pooja Singh",
    partnerName: "Ananya Gupta",
    plan: "Pro Monthly",
    status: "Active",
    totalPaid: 30000,
    renewalDate: "2025-05-01",
  },
  {
    id: 4,
    customerName: "Amit Roy",
    partnerName: "Ravi Kumar",
    plan: "Enterprise",
    status: "Suspended",
    totalPaid: 115000,
    renewalDate: "2025-04-22",
  },
  {
    id: 5,
    customerName: "Tina Malhotra",
    partnerName: "Karan Mehta",
    plan: "Pro Annual",
    status: "Active",
    totalPaid: 50000,
    renewalDate: "2025-04-15",
  },
  {
    id: 6,
    customerName: "Manish Jain",
    partnerName: "Ananya Gupta",
    plan: "Starter",
    status: "Inactive",
    totalPaid: 80000,
    renewalDate: "2025-05-03",
  },
];

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 30)),
  });
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCustomers([...mockCustomers]);
    if (!localStorage.getItem("seenDashboard")) {
      setTimeout(() => confetti({ particleCount: 150, spread: 70 }), 500);
      localStorage.setItem("seenDashboard", "true");
    }
  }, []);

  let renderLabel = function (entry) {
    return entry.name;
  };

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPaid, 0);
  const activeCustomers = customers.filter((c) => c.status === "Active").length;
  const averageRevenue = totalRevenue / customers.length;
  const thisMonthRevenue = customers
    .filter((c) => parseISO(c.renewalDate).getMonth() === new Date().getMonth())
    .reduce((sum, c) => sum + c.totalPaid, 0);
  const lastMonthRevenue = customers
    .filter(
      (c) => parseISO(c.renewalDate).getMonth() === new Date().getMonth() - 1
    )
    .reduce((sum, c) => sum + c.totalPaid, 0);
  const revenueComparison =
    ((thisMonthRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) * 100;
  const planFrequency = customers.reduce((acc, c) => {
    acc[c.plan] = (acc[c.plan] || 0) + 1;
    return acc;
  }, {});
  const mostPopularPlan =
    Object.entries(planFrequency).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  const renewalRate =
    (customers.filter((c) => parseISO(c.renewalDate) < new Date()).length /
      customers.length) *
    100;
  const filteredRenewals = customers.filter((c) =>
    isWithinInterval(parseISO(c.renewalDate), {
      start: range.from,
      end: range.to,
    })
  );
  const paginatedRenewals = filteredRenewals.slice(
    (page - 1) * limit,
    page * limit
  );

  const partnerData = Object.values(
    customers.reduce((acc, c) => {
      if (!acc[c.partnerName])
        acc[c.partnerName] = { name: c.partnerName, revenue: 0 };
      acc[c.partnerName].revenue += c.totalPaid;
      return acc;
    }, {})
  );

  const chartData = Object.entries(planFrequency).map(([name, value], i) => ({
    name,
    value,
    color: COLORS[i % COLORS.length],
  }));

  const cardColors = [
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-red-50",
    "bg-indigo-50",
    "bg-purple-50",
  ];
  const cards = [
    { label: "Total Customers", value: customers.length },
    { label: "Active Customers", value: activeCustomers },
    { label: "Total Revenue", value: formatNumber(totalRevenue) },
    { label: "Avg Revenue per Customer", value: formatNumber(averageRevenue) },
    { label: "Most Popular Plan", value: mostPopularPlan },
    {
      label: "Revenue Change (MoM)",
      value: `${revenueComparison.toFixed(1)}%`,
    },
    { label: "Renewal Rate", value: `${renewalRate.toFixed(1)}%` },
    {
      label: "Customers Pending Renewal",
      value: customers.filter((c) => c.status !== "Active").length,
    },
  ];

  return (
    <div className="p-6 mx-auto space-y-10 w-full overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl shadow border ${
              cardColors[i % cardColors.length]
            }`}
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <h2 className="text-xl font-bold text-gray-800">{card.value}</h2>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarClock size={18} /> Upcoming Renewals
          </h2>
          <div className="flex gap-2">
            <label className="text-sm">
              From:{" "}
              <input
                type="date"
                className="ml-1 border rounded p-1"
                value={format(range.from, "yyyy-MM-dd")}
                onChange={(e) =>
                  setRange({ ...range, from: new Date(e.target.value) })
                }
              />
            </label>
            <label className="text-sm">
              To:{" "}
              <input
                type="date"
                className="ml-1 border rounded p-1"
                value={format(range.to, "yyyy-MM-dd")}
                onChange={(e) =>
                  setRange({ ...range, to: new Date(e.target.value) })
                }
              />
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border mt-2">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Partner</th>
                <th className="text-left p-2">Plan</th>
                <th className="text-left p-2">Renewal Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRenewals.map((c) => (
                <tr
                  key={c.id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/conversions?customerId=${c.id}`)
                  }
                >
                  <td className="p-2">{c.customerName}</td>
                  <td className="p-2">{c.partnerName}</td>
                  <td className="p-2">{c.plan}</td>
                  <td className="p-2">{c.renewalDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="flex items-center gap-3">
              <select
                className="border rounded p-1 text-sm"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
              <p>
                Showing {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, filteredRenewals.length)} of{" "}
                {filteredRenewals.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={page * limit >= filteredRenewals.length}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Partner Leaderboard</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={partnerData}
              layout="vertical"
              margin={{ left: 40 }}
            >
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label={renderLabel}
                labelLine={false}
              >
                {chartData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={customers.map((c) => ({
              date: c.renewalDate,
              amount: c.totalPaid,
            }))}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#16a34a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
