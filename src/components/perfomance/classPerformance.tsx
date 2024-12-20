"use client";
import { useGetAllClassesQuery, useGetClassesQuery } from "@/redux/queries/classes/classesApi";
import { ClassLevel } from "@/src/definitions/classlevels";
import { useGetClassPerformanceQuery } from "@/redux/queries/perfomance/classPerformaceApi";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useGetTermsQuery } from "@/redux/queries/terms/termsApi";
import { BsChevronDown } from "react-icons/bs";
import ContentSpinner from "./contentSpinner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#924900"];
type DataItem = {
  mean_grade: string;
  no_of_students: number;
  percentage?: number;
};
const ClassPerformance: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(null);

  const initialFilters = useMemo(
    () => ({
      class_level_id: searchParams.get("class_level_id") || "",
      term_id: searchParams.get("term_id") || "",
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.class_level_id)
      params.set("class_level_id", filters.class_level_id);
    if (filters.term_id) params.set("term_id", filters.term_id);

    router.push(`?${params.toString()}`);
  }, [filters]);

  const queryParams = useMemo(
    () => ({
      ...filters,
    }),
    [filters]
  );
  const {
    isLoading: loadingClassPerformance,
    data: classPerformanceData,
    refetch,
    error,
  } = useGetClassPerformanceQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const {
    isLoading: loadingClasses,
    data: classesData,
    refetch: refetchClasses,
  } = useGetAllClassesQuery({}, { refetchOnMountOrArgChange: true });
  const {
    isLoading: loadingTerms,
    data: termsData,
    refetch: refetchTerms,
  } = useGetTermsQuery({}, { refetchOnMountOrArgChange: true });
  const handleFilterChange = (
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if(name === "class_level_id"){
      setSelectedClassLevel(value ? parseInt(value, 10) : null);
      setFilters((prev) => ({ ...prev, class_level_id: value, term_id: "" }));
    }else{

      setFilters((prev) => ({ ...prev, [name]: value }));
    }
  };
  const filteredTerms = termsData?.filter(
    (term: any) => term.class_level.id === selectedClassLevel
  );
  console.log("perfomance", classPerformanceData);

  const filteredPerformanceData: DataItem[] =
    classPerformanceData?.filter(
      (item: any) => item.mean_grade && item.no_of_students > 0
    ) ?? [];

  const totalStudents = filteredPerformanceData.reduce(
    (sum: number, entry: DataItem) => sum + entry.no_of_students,
    0
  );

  const dataWithPercentages = filteredPerformanceData.map((entry: DataItem) => {
    const basePercentage = (entry.no_of_students / totalStudents) * 100;
    return {
      ...entry,
      percentage: parseFloat(basePercentage.toFixed(1)),
    };
  });

  const totalPercentage = dataWithPercentages.reduce(
    (sum: number, entry: DataItem) => sum + (entry.percentage ?? 0),
    0
  );
  if (dataWithPercentages.length > 0) {
    dataWithPercentages[dataWithPercentages.length - 1].percentage +=
      parseFloat((100 - totalPercentage).toFixed(1));
  }

  return (
    <div className="space-y-1">
      <div
        className="flex flex-col   space-y-3 md:space-y-0 lg:space-y-0
      md:justify-end lg:justify-end mt-2 lg:p-0 lg:flex-row md:flex-row
      md:items-center lg:items-center md:space-x-2 space-x-0  md:px-3
       px-1 lg:px-3  lg:space-x-5"
      >
        <div className="relative w-full lg:w-40 md:w-32 xl:w-48 ">
          <select
            name="class_level_id"
            value={filters.class_level_id || ""}
            onChange={handleFilterChange}
            className="w-full  lg:w-40 md:w-40 xl:w-48 
             appearance-none p-2 text-md lg:text-md md:text-md
             rounded-md border border-1 border-gray-400
              focus:outline-none focus:border-[#1E9FF2] 
              focus:bg-white placeholder:text-sm 
              md:placeholder:text-sm lg:placeholder:text-sm"
          >
            <option value="">Class</option>
            {classesData?.map((classLevel: ClassLevel) => (
              <option key={classLevel.id} value={classLevel.id}>
                {classLevel.form_level.name} {classLevel?.stream?.name} - {classLevel.calendar_year}
              </option>
            ))}
          </select>
          <BsChevronDown
            color="gray"
            size={16}
            className="absolute top-[50%] right-4  transform 
            -translate-y-1/2 text-[#1F4772] pointer-events-none"
          />
        </div>
        <div className="relative w-full lg:w-32 md:w-32 xl:w-32  ">
          <select
            name="term_id"
            value={filters.term_id || ""}
            onChange={handleFilterChange}
            className="w-full lg:w-32 md:w-32 xl:w-32
              p-2 text-md lg:text-md md:text-md  
               appearance-none   rounded-md border border-1
                border-gray-400 focus:outline-none focus:border-[#1E9FF2] 
                focus:bg-white placeholder:text-sm 
              md:placeholder:text-sm lg:placeholder:text-sm"
          >
            <option value="">Term</option>
            {filteredTerms?.map((term: any) => (
              <option key={term.id} value={term.id}>
                {term.term}
              </option>
            ))}
          </select>
          <BsChevronDown
            color="gray"
            size={16}
            className="absolute top-[50%] right-4  transform -translate-y-1/2 text-[#1F4772] pointer-events-none"
          />
        </div>
      </div>
      {loadingClassPerformance ? (
        <ContentSpinner />
      ) : error ? (
        <div className="min-h-[20vh] flex items-center justify-center">
          <span>{(error as any)?.data?.error || "Internal Server Error"}</span>
        </div>
      ) : filteredPerformanceData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataWithPercentages}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                dataKey="no_of_students"
                nameKey="mean_grade"
                label={({ mean_grade, percentage }) =>
                  `${mean_grade}- ${percentage}%`
                }
              >
                {dataWithPercentages.map((entry: DataItem, index: number) =>
                  entry.no_of_students > 0 ? (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ) : null
                )}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any, { payload }: any) => [
                  `${value} students (${payload.percentage}%)`,
                  `Grade ${name}`,
                ]}
              />
              <Legend
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
                iconType="square"
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-5">
            <h2>Overall Class Mean</h2>
            <h2>
              {classPerformanceData?.[0]?.class_overall_mean_mark || "N/A"}
            </h2>
          </div>
        </>
      ) : (
        <div>No valid data to display on the chart</div>
      )}
    </div>
  );
};

export default ClassPerformance;
