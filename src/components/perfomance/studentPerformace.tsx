import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

interface TermData {
  term: string;
  mean_marks: string;
}

interface StudentPerformanceChartProps {
  performanceData: TermData[][];
}

const StudentPerformanceChart = ({
  performanceData,
}: StudentPerformanceChartProps) => {
  const chartData =
    performanceData && performanceData[0]?.length > 0
      ? performanceData[0].map((item: TermData) => ({
          term: item.term,
          average_marks: parseFloat(item.mean_marks) || 0,
        }))
      : [];
  console.log("chartData", chartData);
  return (
    <div
      style={{
        // width: '100%',
        height: "300px",
      }}
      className="w-full lg:px-4 md:px-4 px-2 py-3  overflow-x-auto"
    >
      <div className=" py-5">
        <h2 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">
          Student Performance Termly
        </h2>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          width={500}
          height={200}
          data={chartData}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="term"
           axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
            tickMargin={10}
          />
          <YAxis 
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
           tickLine={false}  
           tickMargin={20}
          domain={[0, 100]}  
          />
          <Line
            type="monotone"
            dataKey="average_marks"
            stroke="#66BB6A"
            strokeWidth={5}
          />
          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            iconType="square"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
export default StudentPerformanceChart;
