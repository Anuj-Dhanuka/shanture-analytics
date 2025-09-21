import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

const PaymentMethodChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Payment Methods
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
    name: item.paymentMethod,
    value: item.totalAmount,
    count: item.count,
    averageAmount: item.averageAmount,
    itemStyle: {
      color: colors[index % colors.length],
    },
  }));

  const option = {
    title: {
      text: 'Payment Method Distribution',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        const data = params.data;
        return `
          <strong>${data.name}</strong><br/>
          Total Amount: $${data.value.toLocaleString()}<br/>
          Transactions: ${data.count.toLocaleString()}<br/>
          Average: $${data.averageAmount.toLocaleString()}
        `;
      },
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      data: pieData.map(item => item.name),
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Payment Methods',
        type: 'pie',
        radius: ['30%', '70%'],
        center: ['60%', '50%'],
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
          fontSize: 11,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '14',
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: true,
        },
        data: pieData,
      },
    ],
  };

  // Bar chart for transaction counts
  const barData = data.map(item => ({
    method: item.paymentMethod,
    count: item.count,
    totalAmount: item.totalAmount,
    averageAmount: item.averageAmount,
  }));

  const barOption = {
    title: {
      text: 'Transaction Analysis',
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
          if (param.seriesName === 'Total Amount') {
            result += `$${param.value.toLocaleString()}`;
          } else if (param.seriesName === 'Average Amount') {
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
      data: ['Transaction Count', 'Total Amount', 'Average Amount'],
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
      data: barData.map(item => item.method),
      axisLabel: {
        rotate: 45,
        interval: 0,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Count',
        position: 'left',
      },
      {
        type: 'value',
        name: 'Amount ($)',
        position: 'right',
        axisLabel: {
          formatter: '${value}',
        },
      },
    ],
    series: [
      {
        name: 'Transaction Count',
        type: 'bar',
        yAxisIndex: 0,
        data: barData.map(item => item.count),
        itemStyle: {
          color: '#4caf50',
        },
      },
      {
        name: 'Total Amount',
        type: 'line',
        yAxisIndex: 1,
        data: barData.map(item => item.totalAmount),
        smooth: true,
        lineStyle: {
          color: '#1976d2',
          width: 3,
        },
        itemStyle: {
          color: '#1976d2',
        },
      },
      {
        name: 'Average Amount',
        type: 'line',
        yAxisIndex: 1,
        data: barData.map(item => item.averageAmount),
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
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        Payment Methods
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

export default PaymentMethodChart;
