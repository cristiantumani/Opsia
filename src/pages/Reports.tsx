import React, { useState, useEffect, useRef } from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import { useDemo } from '../contexts/DemoContext';
import MonthlyOverview from '../components/MonthlyOverview';
import CategoryBreakdown from '../components/CategoryBreakdown';
import SpendingPace from '../components/SpendingPace';
import BudgetPerformance from '../components/BudgetPerformance';

export default function Reports() {
  const { isDemoMode } = useDemo();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 1-12

  // In demo mode, default to 2025 since demo data is from Feb 2025 - Jan 2026
  const defaultYear = isDemoMode ? 2025 : currentYear;
  // In demo mode, default to June to show data from middle of the year
  const defaultMonth = isDemoMode ? 6 : currentMonth;

  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate year options (current year and 5 years back)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Manual refresh function
  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Auto-refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh data when user returns to the page
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Generate month options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-dark-50 mb-2">
                Financial Reports
              </h1>
              <p className="text-dark-400">
                Visualize your financial data and track your progress
              </p>
            </div>

            {/* Year Selector & Refresh Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh all reports"
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <Calendar className="text-dark-400" size={20} />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-dark-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reports Sections */}
        <div className="space-y-8">
          {/* Annual Overview */}
          <section>
            <h2 className="text-xl font-semibold text-dark-50 mb-4">Annual Overview</h2>
            <MonthlyOverview key={`monthly-${refreshKey}`} year={selectedYear} />
          </section>

          {/* Category Breakdown */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark-50">Category Breakdown</h2>
              <div className="flex items-center gap-2">
                <Calendar className="text-dark-400" size={20} />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="bg-dark-800 border border-dark-600 rounded-lg px-4 py-2 text-dark-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {monthOptions.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <CategoryBreakdown key={`category-${refreshKey}`} year={selectedYear} month={selectedMonth} />
          </section>

          {/* Spending Pace */}
          <section>
            <SpendingPace key={`pace-${refreshKey}`} year={selectedYear} month={selectedMonth} />
          </section>

          {/* Budget Performance */}
          <section>
            <BudgetPerformance key={`budget-${refreshKey}`} year={selectedYear} month={selectedMonth} />
          </section>
        </div>
      </div>
    </div>
  );
}
