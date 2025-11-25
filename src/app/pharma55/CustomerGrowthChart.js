'use client';
import React from 'react';
import Chart from 'react-apexcharts';

export default function CustomerGrowthChart() {
  const options = {
    chart: {
      type: 'bar',
      height: '100%',
      fontFamily: 'Tajawal, sans-serif',
      stacked: true,
      toolbar: {
        show: true
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#10B981', '#3B82F6'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '60%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        'يناير', 'فبراير', 'مارس', 'أبريل', 
        'مايو', 'يونيو', 'يوليو', 'أغسطس',
        'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        },
        formatter: function (val) {
          return val.toFixed(0);
        }
      }
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: 'Tajawal, sans-serif'
      }
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontFamily: 'Tajawal, sans-serif',
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
    },
    fill: {
      opacity: 1
    }
  };

  const series = [{
    name: 'عملاء جدد',
    data: [15, 22, 18, 25, 30, 28, 35, 32, 38, 42, 45, 50]
  }, {
    name: 'عملاء متكررون',
    data: [35, 42, 38, 45, 50, 48, 55, 52, 58, 62, 65, 70]
  }];

  return (
    <div className="h-full">
      <Chart 
        options={options} 
        series={series} 
        type="bar" 
        height="100%" 
      />
    </div>
  );
}