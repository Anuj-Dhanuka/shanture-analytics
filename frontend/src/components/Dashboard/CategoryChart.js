import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Sales by Category
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

  const colors = [
    '#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0',
    '#00bcd4', '#8bc34a', '#ffc107', '#e91e63', '#3f51b5'
  ];

  const chartData = data.map((item, index) => ({
    category: item.category,
    revenue: item.totalRevenue,
    sales: item.totalSales,
    quantity: item.totalQuantity,
    products: item.totalProducts,
    color: colors[index % colors.length],
  }));

  const option = {
    title: {
      text: 'Category Performance',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
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
      data: ['Revenue', 'Sales Count', 'Quantity Sold'],
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
      data: chartData.map(item => item.category),
      axisLabel: {
        rotate: 45,
        interval: 0,
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
      },
    ],
    series: [
      {
        name: 'Revenue',
        type: 'bar',
        yAxisIndex: 0,
        data: chartData.map(item => ({
          value: item.revenue,
          itemStyle: { color: item.color },
        })),
        barWidth: '30%',
      },
      {
        name: 'Sales Count',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.map(item => item.sales),
        smooth: true,
        lineStyle: {
          color: '#4caf50',
          width: 3,
        },
        itemStyle: {
          color: '#4caf50',
        },
      },
      {
        name: 'Quantity Sold',
        type: 'bar',
        yAxisIndex: 1,
        data: chartData.map(item => ({
          value: item.quantity,
          itemStyle: { color: '#ff9800' },
        })),
        barWidth: '20%',
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
    ],
  };

  // Donut chart for category distribution
  const donutData = chartData.map(item => ({
    name: item.category,
    value: item.revenue,
    itemStyle: {
      color: item.color,
    },
  }));

  const donutOption = {
    title: {
      text: 'Revenue Distribution',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)',
    },
    series: [
      {
        name: 'Revenue',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '60%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'outside',
          formatter: '{b}\n{d}%',
          fontSize: 10,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '12',
            fontWeight: 'bold',
          },
        },
        data: donutData,
      },
    ],
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Sales by Category
      </Typography>
      <Box sx={{ display: 'flex', height: '300px' }}>
        <Box sx={{ flex: 2 }}>
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
        <Box sx={{ flex: 1, ml: 2 }}>
          <ReactECharts
            option={donutOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoryChart;
