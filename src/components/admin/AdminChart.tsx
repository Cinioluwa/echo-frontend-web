import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AdminChart = () => {
  const data = [
    { month: "Jan", thisYear: 1050, lastYear: 980 },
    { month: "Feb", thisYear: 1320, lastYear: 1150 },
    { month: "Mar", thisYear: 1580, lastYear: 1400 },
    { month: "Apr", thisYear: 2100, lastYear: 1850 },
    { month: "May", thisYear: 2480, lastYear: 2200 },
    { month: "Jun", thisYear: 2750, lastYear: 2600 },
    { month: "Jul", thisYear: 3100, lastYear: 2900 },
    { month: "Aug", thisYear: 3450, lastYear: 3200 },
    { month: "Sep", thisYear: 3800, lastYear: 3500 },
    { month: "Oct", thisYear: 4200, lastYear: 3900 },
    { month: "Nov", thisYear: 4600, lastYear: 4300 },
    { month: "Dec", thisYear: 5200, lastYear: 4800 },
  ];

  return (
    <ResponsiveContainer width={"100%"} height={330}>
      <LineChart data={data}>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #00000010",
            fontSize: "12px",
          }}
        />
        <CartesianGrid vertical={false} stroke="#00000010" />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#00000066" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: "#00000066" }}
        />
        <Line
          type={"monotone"}
          strokeDasharray="5 5"
          dataKey="thisYear"
          name="This year"
          dot={false}
          stroke="#AEC7ED"
        />
        <Line
          type={"monotone"}
          name="Last year"
          dataKey="lastYear"
          stroke="gray"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdminChart;
