import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';

const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Revenue Trend
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 300,
            color: 'text.secondary',
          }}
        >
          No data available for the selected period
        </Box>
      </Paper>
    );
  }

  const chartData = data.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    revenue: item.totalRevenue,
    sales: item.totalSales,
    customers: item.totalCustomers,
  }));

  const option = {
    title: {
      text: 'Daily Sales Performance',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
      formatter: function (params) {
        let result = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach(param => {
          result += `${param.marker} ${param.seriesName}: `;
          if (param.seriesName === 'Revenue') {
            result += `$${param.value.toLocaleString()}`;
          } else {
            result += param.value.toLocaleString();
          }
          result += '<br/>';
        });
        return result;
      },
    },
    legend: {
      data: ['Revenue', 'Sales Count', 'Customers'],
      top: 30,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.map(item => item.date),
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Revenue ($)',
        position: 'left',
        axisLabel: {
          formatter: '${value}',
        },
      },
      {
        type: 'value',
        name: 'Count',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: 'Revenue',
        type: 'line',
        yAxisIndex: 0,
        data: chartData.map(item => item.revenue),
        smooth: true,
        lineStyle: {
          color: '#1976d2',
          width: 3,
        },
        itemStyle: {
          color: '#1976d2',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(25, 118, 210, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(25, 118, 210, 0.05)',
              },
            ],
          },
        },
      },
      {
        name: 'Sales Count',
        type: 'bar',
        yAxisIndex: 1,
        data: chartData.map(item => item.sales),
        itemStyle: {
          color: '#4caf50',
        },
        barWidth: '20%',
      },
      {
        name: 'Customers',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.map(item => item.customers),
        smooth: true,
        lineStyle: {
          color: '#ff9800',
          width: 2,
        },
        itemStyle: {
          color: '#ff9800',
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
        height: 30,
        bottom: 10,
      },
    ],
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Revenue Trend
      </Typography>
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </Paper>
  );
};

export default RevenueChart;
