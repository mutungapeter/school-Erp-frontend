import { useGetStudentPerformanceQuery } from "@/redux/queries/students/studentsApi";
import React, { PureComponent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

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
import { BsChevronDown } from "react-icons/bs";

interface TermData {
  term: string;
  mean_marks: string;
  exam_type:string;
}
interface StudentPerformanceChartProps {
  studentId: number;
  termId: string; 
}
interface StudentPerformanceProps {
  performanceData: TermData[][];
}

const StudentPerformanceChart = ({ studentId, termId }: StudentPerformanceChartProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialFilters = useMemo(
    () => ({
      exam_type: searchParams.get("exam_type") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.exam_type) {
      params.set("exam_type", filters.exam_type);
    }

    router.push(`?${params.toString()}`);
  }, [filters]);

  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
    error: errorLoadingPerformance,
  } = useGetStudentPerformanceQuery({
    id: studentId,
    term_id: termId, 
    exam_type: filters.exam_type
    
  });
  console.log("performanceData",performanceData )
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
      setFilters((prev) => ({ ...prev, [name]: value }));
    
  };
  // const chartData =
  //   performanceData && performanceData[0]?.length > 0
  //     ? performanceData[0].map((item: TermData) => ({
  //         term: item.term,
  //         average_marks: parseFloat(item.mean_marks) || 0,
  //         exam_type: item.exam_type,
  //       }))
  //     : [];
  const chartData = performanceData && performanceData[0]?.length > 0
  ? performanceData[0].filter((item: TermData) => 
      filters.exam_type ? item.exam_type === filters.exam_type : true
    ).map((item: TermData) => ({
        term: item.term,
        average_marks: parseFloat(item.mean_marks) || 0,
        exam_type: item.exam_type,
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
      <div className=" py-5 flex lg:flex-row md:flex-row gap-3 md:gap-0 lg:gap-0  flex-col md:items-center md:justify-between lg:items-center lg:justify-between">
        <h2 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">
          Student Performance Termly
        </h2>
        <div className="relative w-full lg:w-55 md:w-55 xl:w-55  ">
                    <select
                      name="exam_type"
                      id="exam_type"
                      value={filters.exam_type || ""}
                      onChange={handleFilterChange}
                      className="w-full lg:w-55 md:w-55 xl:w-55 
                      text-sm md:text-lg lg:text-lg appearance-none py-2 px-4 font-normal rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-sm lg:placeholder:text-sm"
                    >
                      <option value="">--- Exam Type ---</option>
                      <option value="Midterm">Midterm</option>
                      <option value="Endterm">Endterm</option>
                    </select>
                    <BsChevronDown
                      color="gray"
                      size={20}
                      className="absolute top-[50%] right-4 transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
                    />
                  </div>
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
