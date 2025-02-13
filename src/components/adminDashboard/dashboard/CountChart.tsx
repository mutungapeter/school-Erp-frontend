"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
interface Props{
  students:any;
}


const CountChart = ({students }:Props) => {
  const totalStudents = students?.length || 0;

 
  const boys = students?.filter((student:any) => student.gender === 'Male')?.length || 0;
  const girls = students?.filter((student:any) => student.gender === 'Female')?.length || 0;;
  const boysPercentage = totalStudents === 0 ? 0 : ((boys / totalStudents) * 100).toFixed(0);
  const girlsPercentage = totalStudents === 0 ? 0 : ((girls / totalStudents) * 100).toFixed(0);
const data = [
  {
    name: "Total",
    count: totalStudents,
    fill: "white", 
  },
  {
    name: "Girls",
    count: girls,
    fill: "#4CAF50", 
  },
  {
    name: "Boys",
    count: boys,
    fill: "#2196F3",
  },
];

  return (
    <div className="bg-white border rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/icons/moreDark.png" alt="" width={20} height={20} />
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/icons/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-green-500 rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-500">Boys ({boysPercentage}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-blue-500 rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-500">Girls ({girlsPercentage}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
