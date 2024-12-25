"use client";
import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


const data = [
  { name: "Lesson Completion", value: 85, fill: "#4CAF50" },  
  { name: "Student Feedback", value: 75, fill: "#2196F3" },
  { name: "Assignments Graded", value: 90, fill: "#FAE27C" }, 
  { name: "Student Engagement", value: 80, fill: "#FFC107" }, 
];

const TeacherPerformance = () => {
  return (
    <div className="bg-white p-3 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Teacher Performance</h1>
        <Image src="/icons/moreDark.png" alt="" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}  
            outerRadius={80}  
            fill="#8884d8"
           
            label={({ name, value }) => {
              
              const fontSize = value > 80 ? "10px" : "10px";
              return `${name}: ${value}%`;  
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    
      
    </div>
  );
};

export default TeacherPerformance;
