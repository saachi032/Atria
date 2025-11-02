// Service to generate/simulate real-time blood bank data
// This simulates real-time variations based on static data
// Can be replaced with actual API calls when available

import { statsData, todaysStatsData, statewiseBars, statewiseTableData } from './baseBloodData.js';

// Helper function to add random variation (±5% to ±15%)
const addVariation = (value, minVariation = 0.05, maxVariation = 0.15) => {
  const variation = minVariation + Math.random() * (maxVariation - minVariation);
  const isPositive = Math.random() > 0.5;
  const change = value * variation * (isPositive ? 1 : -1);
  return Math.max(0, Math.round(value + change));
};

// Generate real-time stats data with variations
export const getRealTimeStatsData = () => {
  return statsData.map((stat) => {
    const newPieData = stat.pieData.map((item) => ({
      ...item,
      value: addVariation(item.value, 0.03, 0.12)
    }));

    const newGroups = stat.groups.map((group) => ({
      ...group,
      value: addVariation(group.value, 0.03, 0.12)
    }));

    const newTotal = newGroups.reduce((sum, group) => sum + group.value, 0);

    return {
      ...stat,
      total: newTotal,
      pieData: newPieData,
      groups: newGroups
    };
  });
};

// Generate real-time today's stats data
export const getRealTimeTodaysStatsData = () => {
  return todaysStatsData.map((stat) => {
    const newBarData = stat.barData.map((item) => ({
      ...item,
      [stat.dataKey]: addVariation(item[stat.dataKey], 0.05, 0.20)
    }));

    const newTotal = newBarData.reduce((sum, item) => sum + item[stat.dataKey], 0);

    return {
      ...stat,
      total: newTotal,
      barData: newBarData
    };
  });
};

// Generate real-time statewise bars data
export const getRealTimeStatewiseBars = () => {
  return statewiseBars.map((bar) => {
    const newBarData = bar.barData.map((item) => ({
      ...item,
      [bar.dataKey]: addVariation(item[bar.dataKey], 0.02, 0.10)
    }));

    return {
      ...bar,
      barData: newBarData
    };
  });
};

// Generate real-time statewise table data
export const getRealTimeStatewiseTableData = () => {
  return statewiseTableData.map((row) => ({
    ...row,
    bloodCentres: addVariation(row.bloodCentres, 0.02, 0.08),
    activeBloodCentres: addVariation(row.activeBloodCentres, 0.02, 0.08),
    licensedBloodCentres: addVariation(row.licensedBloodCentres, 0.02, 0.08),
    bsu: addVariation(row.bsu, 0.02, 0.08)
  }));
};

// Main function to get all real-time data
export const getAllRealTimeData = () => {
  return {
    statsData: getRealTimeStatsData(),
    todaysStatsData: getRealTimeTodaysStatsData(),
    statewiseBars: getRealTimeStatewiseBars(),
    statewiseTableData: getRealTimeStatewiseTableData(),
    timestamp: new Date().toISOString()
  };
};

