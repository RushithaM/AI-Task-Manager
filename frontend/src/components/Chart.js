import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PieController,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import './Chart.css';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PieController,
  BarController,
  LineController,
  BarElement,
  PointElement,
  LineElement
);

function Chart({ tasks }) {
  const [chartData, setChartData] = useState(null);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    console.log('Chart component mounted');
    return () => console.log('Chart component unmounted');
  }, []);

  useEffect(() => {
    console.log('Tasks received in Chart:', tasks);
    if (tasks && tasks.length > 0) {
      try {
        const priorityData = {
          labels: ['P0', 'P1', 'P2'],
          datasets: [{
            data: [
              tasks.filter(task => task.priority === 'P0').length,
              tasks.filter(task => task.priority === 'P1').length,
              tasks.filter(task => task.priority === 'P2').length
            ],
            backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
            hoverOffset: 4
          }]
        };

        const spData = {
          labels: tasks.map(task => task.title ? task.title.substring(0, 10) + '...' : 'Unnamed Task'),
          datasets: [
            {
              label: 'Assigned SP',
              data: tasks.map(task => task.sp_assigned || 0),
              backgroundColor: '#3b82f6',
            },
            {
              label: 'Actual SP',
              data: tasks.map(task => task.sp_actual || 0),
              backgroundColor: '#8b5cf6',
            }
          ]
        };

        const sortedTasks = [...tasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        const completionData = {
          labels: sortedTasks.map(task => new Date(task.due_date).toLocaleDateString()),
          datasets: [{
            label: 'Completed Tasks',
            data: sortedTasks.map((_, index) => sortedTasks.slice(0, index + 1).filter(task => task.status === 'Completed').length),
            borderColor: '#10b981',
            tension: 0.1
          }]
        };

        setChartData({ priorityData, spData, completionData });
        console.log('Chart data prepared successfully');
      } catch (error) {
        console.error('Error preparing chart data:', error);
      }
    } else {
      console.log('No tasks available for charts');
    }
  }, [tasks]);

  if (!chartData) {
    return <div>Loading charts... (Tasks available: {tasks ? tasks.length : 0})</div>;
  }

  return (
    <div className="charts-container" ref={chartContainerRef}>
      <div className="chart-wrapper">
        <h3>Priority Distribution</h3>
        <Pie data={chartData.priorityData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <div className="chart-wrapper">
        <h3>SP Comparison</h3>
        <Bar data={chartData.spData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <div className="chart-wrapper">
        <h3>Completion Trends</h3>
        <Line data={chartData.completionData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
}

export default Chart;

