import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

const RegionChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Sales by Region
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

  const colors = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0'];

  const pieData = data.map((item, index) => ({
    name: item.region,
    value: item.totalRevenue,
    itemStyle: {
      color: colors[index % colors.length],
    },
  }));

  const barData = data.map(item => ({
    region: item.region,
    revenue: item.totalRevenue,
    sales: item.totalSales,
    customers: item.totalCustomers,
  }));

  const option = {
    title: {
      text: 'Sales Performance by Region',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      data: pieData.map(item => item.name),
    },
    series: [
      {
        name: 'Revenue',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold',
            formatter: '{b}\n${c}',
          },
        },
        labelLine: {
          show: false,
        },
        data: pieData,
      },
    ],
  };

  const barOption = {
    title: {
      text: 'Regional Comparison',
      left: 'center',
      textStyle: {
        fontSize: 14,
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
      data: ['Revenue', 'Sales', 'Customers'],
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
      data: barData.map(item => item.region),
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
        data: barData.map(item => item.revenue),
        itemStyle: {
          color: '#1976d2',
        },
      },
      {
        name: 'Sales',
        type: 'bar',
        yAxisIndex: 1,
        data: barData.map(item => item.sales),
        itemStyle: {
          color: '#4caf50',
        },
      },
      {
        name: 'Customers',
        type: 'line',
        yAxisIndex: 1,
        data: barData.map(item => item.customers),
        itemStyle: {
          color: '#ff9800',
        },
      },
    ],
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Sales by Region
      </Typography>
      <Box sx={{ display: 'flex', height: '300px' }}>
        <Box sx={{ flex: 1 }}>
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
        <Box sx={{ flex: 1, ml: 2 }}>
          <ReactECharts
            option={barOption}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default RegionChart;
