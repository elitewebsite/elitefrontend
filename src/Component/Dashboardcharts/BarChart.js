import React from 'react'
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto";
const BarChart = ({ chartdata }) => {
    return (
        <Bar data={chartdata} className="mt-12 p-5" />
    )
}

export default BarChart