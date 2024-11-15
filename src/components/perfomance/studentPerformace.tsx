// import React from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// interface TermData {
//   term: string;
//   mean_marks: string;
// }

// interface StudentPerformanceChartProps {
//   performanceData: TermData[];
// }

// const StudentPerformanceChart: React.FC<StudentPerformanceChartProps> = ({ performanceData }) => {
//     console.log("performanceData in chart", performanceData)
//   const termData = performanceData?.map((term) => ({
//     term: term.term,
//     mean_marks: parseFloat(term.mean_marks),
//   }));

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={termData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
//         <Line type="monotone" dataKey="mean_marks" stroke="#8884d8" />
//         <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
//         <XAxis dataKey="term" />
//         <YAxis label={{ value: "Mean Marks", angle: -90, position: "insideLeft" }} />
//         <Tooltip />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default StudentPerformanceChart;
import React, { PureComponent } from 'react';
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
} from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
interface TermData {
  term: string;
  mean_marks: string;
}

interface StudentPerformanceChartProps {
  performanceData: TermData[][];
}

const StudentPerformanceChart = ({ performanceData }: StudentPerformanceChartProps) => {
  const chartData = performanceData && performanceData[0]?.length > 0 
  ? performanceData[0].map((item: TermData) => ({
      term: item.term,
      overall_average_marks: parseFloat(item.mean_marks), 
    }))
  : [];
console.log("chartData", chartData); 
    return (
      <div style={{ 
        // width: '100%',
         height: '300px' }} 
      className="w-full lg:px-4 md:px-4 px-2 py-3  overflow-x-auto">
        
<div className=" py-5">
<h2 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">Student Performance Termly</h2>
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="term"   />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="overall_average_marks" stroke="#82ca9d" fill="#82ca9d" />
          
          </LineChart>
        </ResponsiveContainer>
     
      </div>
    );
 
}
export default StudentPerformanceChart
