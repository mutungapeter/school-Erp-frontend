import { useGetStudentPerformanceQuery } from "@/redux/queries/students/studentsApi";
import React, { PureComponent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../style.css";
import { PiCalendarDotsLight } from "react-icons/pi";

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
import ContentSpinner from "../layouts/contentSpinner";

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
      calendar_year: searchParams.get("calendar_year") || "",
    }),
    [searchParams]
  );
  const [filters, setFilters] = useState(initialFilters);
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.exam_type) {
      params.set("exam_type", filters.exam_type);
    };
    if (filters.calendar_year) {
      params.set("calendar_year", filters.calendar_year);
    };

    router.push(`?${params.toString()}`);
  }, [filters]);

  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
    error: errorLoadingPerformance,
    error,
  } = useGetStudentPerformanceQuery({
    id: studentId,
    term_id: termId, 
    exam_type: filters.exam_type,
    calendar_year: filters.calendar_year
    
  });
  console.log({"studentId":studentId, "termId":termId, "exam_type":filters.exam_type})
  console.log("performanceData",performanceData )
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
      setFilters((prev) => ({ ...prev, [name]: value }));
    
  };
 
  const chartData = performanceData && performanceData[0]?.length > 0
  ? performanceData[0].filter((item: TermData) => 
      filters.exam_type ? item.exam_type === filters.exam_type : true
    ).map((item: TermData) => ({
        term: item.term,
        average_marks: parseFloat(item.mean_marks) || 0,
        exam_type: item.exam_type,
  }))
  : [];
   
  const handleYearChange = (date: Date | null) => {
    const year = date ? date.getFullYear().toString() : "";
    setFilters((prev) => ({ ...prev, calendar_year: year }));
  };
  const chartExamType = chartData.length > 0 ? chartData[0].exam_type : null;
  // const chartTerm = chartData.length > 0 ? chartData[0].term.calendar_year : null;

  // const chartTitle =
  //   chartExamType && chartTerm ? `${chartExamType} Performance - ${chartTerm} `
  //     : "";
  //     console.log("chartTerm",chartTerm)
  console.log("chartData", chartData);
  return (
    <div
      style={{
        // width: '100%',
        height: "500px",
      }}
      className="w-full lg:px-4 md:px-4 px-2 py-3  overflow-x-auto"
    >
      <div className=" py-5 flex  gap-3   flex-col ">
        <h2 className="font-semibold text-black text-sm md:text-sm lg:tex-sm">
          Student Performance Termly
        </h2>
        <div className="flex lg:justify-end md:justify-end ">

        </div>
        <div className="flex md:items-center md:justify-end lg:items-center lg:justify-end  md:flex-row lg:flex-row flex-col gap-3">
          <div className="relative ">
                         
                          <DatePicker
                          name="graduation_year"
                          selected={filters.calendar_year ? new Date(parseInt(filters.calendar_year), 0) : null}
                          onChange={handleYearChange}
                          showYearPicker
                          dateFormat="yyyy"
                          showIcon
                          icon={<PiCalendarDotsLight className="text-gray-currentColor" />}
                          yearDropdownItemNumber={5}
                          placeholderText="YYYY"
                          isClearable
                          className="w-full appearance-none py-3 px-4 text-lg rounded-md border border-1 border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm md:placeholder:text-lg lg:placeholder:text-lg"
                       />
                         
                          </div>
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
      </div>
      <h3 className="text-center font-semibold text-lg text-gray-700 mb-4">
        {chartExamType
          ? `${chartExamType} Performance`
          : ""}
      </h3>
      {isLoadingPerformance ? (
        <ContentSpinner />
      ) : error ? (
        <div className="min-h-[20vh] flex items-center justify-center border border-red-600 rounded-md p-2 shadow-md bg-red-50 ">
          <span className="text-red-600">{(error as any)?.data?.error || "Internal Server Error"}</span>
        </div>
      ):(
        
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
      )}
    </div>
  );
};
export default StudentPerformanceChart;
