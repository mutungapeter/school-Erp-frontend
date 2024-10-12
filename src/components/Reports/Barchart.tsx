import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts'
interface Props{
  data:any;
}
const CustomBarChart = ({ data }:Props) => {
  console.log("data bar", data);
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid data provided to CustomBarChart:', data);
    return null; // Or some fallback UI
  }


  return (
    <BarChart width={500} height={200} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar isAnimationActive={false} dataKey="pv" fill="#8884d8" />
      <Bar isAnimationActive={false} dataKey="uv" fill="#82ca9d" />
    </BarChart>
  )
}

export default CustomBarChart