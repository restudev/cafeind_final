import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface AreaDistributionChartProps {
  data: {
    area: string;
    count: number;
  }[];
}

const AreaDistributionChart: React.FC<AreaDistributionChartProps> = ({ data }) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const series = data.map(item => item.count);
  const labels = data.map(item => item.area);
  const total = series.reduce((sum, value) => sum + value, 0);

  // Color palette matching CafePromotions gradients
  const colors = [
    '#EC4899', // Pink (from-pink-500)
    '#3B82F6', // Blue (from-blue-500)
    '#8B5CF6', // Purple (from-purple-500)
    '#EF4444', // Red (from-red-500)
    '#10B981', // Green (from-green-500)
    '#F59E0B', // Amber
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  // Theme colors matching AvailablePromotionsCard
  const themeColors = {
    primary: {
      light: 'bg-blue-50',
      medium: 'bg-blue-100',
      dark: 'bg-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-200',
      gradient: 'from-blue-50 to-blue-200',
      hover: 'hover:bg-blue-200',
      focus: 'focus:ring-blue-600'
    },
    accent: {
      light: 'bg-gray-50',
      medium: 'bg-gray-100',
      text: 'text-gray-600',
      gradient: 'from-blue-600 to-teal-500'
    }
  };

  const options: ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'Inter, system-ui, sans-serif',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      events: {
        dataPointMouseEnter: function (_event, _chartContext, config) {
          setHoveredSlice(config.dataPointIndex);
        },
        dataPointMouseLeave: function () {
          setHoveredSlice(null);
        },
      },
    },
    colors,
    labels,
    legend: {
      position: 'right',
      horizontalAlign: 'left',
      fontSize: '13px',
      fontWeight: 500,
      markers: {
        size: 10,
        offsetX: -2,
      },
      itemMargin: {
        horizontal: 4,
        vertical: 6,
      },
      formatter: function (seriesName, { seriesIndex, w }) {
        const value = w.globals.series[seriesIndex];
        const percentage = ((value / total) * 100).toFixed(1);
        return `${seriesName} (${percentage}%)`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              offsetY: -8,
            },
            value: {
              show: true,
              fontSize: '28px',
              fontWeight: 700,
              color: themeColors.primary.dark,
              offsetY: 8,
              formatter: function (val) {
                return val.toString();
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Total Cafes',
              fontSize: '14px',
              fontWeight: 500,
              color: themeColors.accent.text,
              formatter: function (w) {
                return w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toString();
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      colors: ['#ffffff'],
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'darken',
        },
      },
    },
    tooltip: {
      enabled: true,
      style: {
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
      },
      y: {
        formatter: function (val) {
          const percentage = ((val / total) * 100).toFixed(1);
          return `${val} cafes (${percentage}%)`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 280,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
    ],
  };

  // Calculate statistics for the summary cards
  const maxArea =
    data.length > 0
      ? data.reduce((max, item) => (item.count > max.count ? item : max), data[0])
      : { area: 'N/A', count: 0 };
  const averageCount = data.length > 0 ? (total / data.length).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
      {/* Header */}
      <div className={`px-6 py-4 border-b border-blue-100 bg-gradient-to-r ${themeColors.primary.gradient}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Cafe Distribution</h3>
            <p className="text-sm text-gray-600 mt-1">Overview of cafes across different areas</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${themeColors.primary.text}`}>{total}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Cafes</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Chart Container */}
        <div className="relative">
          <div className="h-64 md:h-72">
            <ReactApexChart options={options} series={series} type="donut" height="100%" />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-blue-100">
          <div className={`bg-gradient-to-br ${themeColors.primary.gradient} rounded-lg p-4`}>
            <div className={`text-sm font-medium ${themeColors.primary.text}`}>Most Popular Area</div>
            <div className="text-lg font-bold text-blue-900 mt-1">{maxArea.area}</div>
            <div className={`text-sm ${themeColors.primary.text}`}>{maxArea.count} cafes</div>
          </div>
          <div className={`bg-gradient-to-br ${themeColors.primary.gradient} rounded-lg p-4`}>
            <div className={`text-sm font-medium ${themeColors.primary.text}`}>Average per Area</div>
            <div className="text-lg font-bold text-blue-900 mt-1">{averageCount}</div>
            <div className={`text-sm ${themeColors.primary.text}`}>cafes per area</div>
          </div>
        </div>

        {/* Area List for Mobile */}
        <div className="block md:hidden mt-6 pt-6 border-t border-blue-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Areas</h4>
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = ((item.count / total) * 100).toFixed(1);
              return (
                <div
                  key={item.area}
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    hoveredSlice === index ? themeColors.primary.light : themeColors.primary.hover
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm font-medium text-gray-900">{item.area}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{item.count}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDistributionChart;