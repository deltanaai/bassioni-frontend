'use client';
import React from 'react';
import Chart from 'react-apexcharts';

export default function RevenueChart() {
  const options = {
    chart: {
      type: 'donut',
      height: '100%',
      fontFamily: 'Tajawal, sans-serif',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'],
    labels: ['مسكنات', 'فيتامينات', 'مضادات حيوية', 'أدوية سكري', 'مستحضرات جلدية'],
    legend: {
      position: 'right',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Tajawal, sans-serif',
      markers: {
        width: 12,
        height: 12,
        radius: 12
      },
      itemMargin: {
        horizontal: 8,
        vertical: 4
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'Tajawal, sans-serif',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'إجمالي المبيعات',
              color: '#6B7280',
              fontSize: '16px',
              fontFamily: 'Tajawal, sans-serif',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' ر.س';
              }
            },
            value: {
              color: '#111827',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Tajawal, sans-serif'
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: 'Tajawal, sans-serif'
      },
      y: {
        formatter: function (val) {
          return val + ' ر.س';
        }
      }
    }
  };

  const series = [12500, 9800, 7600, 6500, 6300];

  return (
    <div className="h-full">
      <Chart 
        options={options} 
        series={series} 
        type="donut" 
        height="100%" 
      />
    </div>
  );
}