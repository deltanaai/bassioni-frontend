'use client';
import React from 'react';
import Chart from 'react-apexcharts';

export default function OrderTrendChart() {
  const options = {
    chart: {
      type: 'area',
      height: '100%',
      fontFamily: 'Tajawal, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    colors: ['#3B82F6'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: [
        '1 يونيو', '2 يونيو', '3 يونيو', '4 يونيو', 
        '5 يونيو', '6 يونيو', '7 يونيو', '8 يونيو',
        '9 يونيو', '10 يونيو', '11 يونيو', '12 يونيو',
        '13 يونيو', '14 يونيو', '15 يونيو', '16 يونيو',
        '17 يونيو', '18 يونيو', '19 يونيو', '20 يونيو',
        '21 يونيو', '22 يونيو', '23 يونيو', '24 يونيو',
        '25 يونيو', '26 يونيو', '27 يونيو', '28 يونيو',
        '29 يونيو', '30 يونيو'
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
      },
      x: {
        format: 'dd MMM yyyy'
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
    markers: {
      size: 5,
      colors: ['#3B82F6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    }
  };

  const series = [{
    name: 'الطلبات',
    data: [12, 19, 8, 15, 14, 18, 22, 17, 25, 20, 16, 24, 19, 22, 27, 23, 19, 25, 28, 24, 27, 30, 32, 28, 31, 29, 33, 36, 32, 35]
  }];

  return (
    <div className="h-full">
      <Chart 
        options={options} 
        series={series} 
        type="area" 
        height="100%" 
      />
    </div>
  );
}