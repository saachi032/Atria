// Service to generate/simulate real-time blood bank data
// This service tries to fetch from API Setu first, then falls back to simulated data
// To use API Setu, configure API_SETU_API_KEY or API_SETU_ACCESS_TOKEN in .env file

import { statsData, todaysStatsData, statewiseBars, statewiseTableData } from './baseBloodData.js';
import {
  fetchBloodCentresStats,
  fetchTodaysBloodAvailability,
  fetchStatewiseStats,
  transformApiSetuStatsData,
  isApiSetuConfigured
} from './apiSetuService.js';

// Helper function to add random variation (±5% to ±15%)
const addVariation = (value, minVariation = 0.05, maxVariation = 0.15) => {
  const variation = minVariation + Math.random() * (maxVariation - minVariation);
  const isPositive = Math.random() > 0.5;
  const change = value * variation * (isPositive ? 1 : -1);
  return Math.max(0, Math.round(value + change));
};

// Generate real-time stats data with variations (fallback function)
const getSimulatedStatsData = () => {
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

// Generate real-time stats data - tries API Setu first, then falls back to simulation
export const getRealTimeStatsData = async () => {
  try {
    if (isApiSetuConfigured()) {
      const apiData = await fetchBloodCentresStats();
      if (apiData) {
        const transformed = transformApiSetuStatsData(apiData);
        if (transformed && transformed.statsData) {
          return transformed.statsData;
        }
      }
    }
  } catch (error) {
    console.warn('API Setu fetch failed, using simulated data:', error.message);
  }
  
  // Fallback to simulated data
  return getSimulatedStatsData();
};

// Generate real-time today's stats data (fallback function)
const getSimulatedTodaysStatsData = () => {
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

// Generate real-time today's stats data - tries API Setu first, then falls back to simulation
export const getRealTimeTodaysStatsData = async () => {
  try {
    if (isApiSetuConfigured()) {
      const apiData = await fetchTodaysBloodAvailability();
      if (apiData) {
        const transformed = transformApiSetuStatsData(apiData);
        if (transformed && transformed.todaysStatsData) {
          return transformed.todaysStatsData;
        }
      }
    }
  } catch (error) {
    console.warn('API Setu fetch failed, using simulated data:', error.message);
  }
  
  // Fallback to simulated data
  return getSimulatedTodaysStatsData();
};

// Generate real-time statewise bars data (fallback function)
const getSimulatedStatewiseBars = () => {
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

// Generate real-time statewise table data (fallback function)
const getSimulatedStatewiseTableData = () => {
  return statewiseTableData.map((row) => ({
    ...row,
    bloodCentres: addVariation(row.bloodCentres, 0.02, 0.08),
    activeBloodCentres: addVariation(row.activeBloodCentres, 0.02, 0.08),
    licensedBloodCentres: addVariation(row.licensedBloodCentres, 0.02, 0.08),
    bsu: addVariation(row.bsu, 0.02, 0.08)
  }));
};

// Generate real-time statewise bars data - tries API Setu first, then falls back to simulation
export const getRealTimeStatewiseBars = async () => {
  try {
    if (isApiSetuConfigured()) {
      const apiData = await fetchStatewiseStats();
      if (apiData) {
        const transformed = transformApiSetuStatsData(apiData);
        if (transformed && transformed.statewiseBars) {
          return transformed.statewiseBars;
        }
      }
    }
  } catch (error) {
    console.warn('API Setu fetch failed, using simulated data:', error.message);
  }
  
  // Fallback to simulated data
  return getSimulatedStatewiseBars();
};

// Generate real-time statewise table data - tries API Setu first, then falls back to simulation
export const getRealTimeStatewiseTableData = async () => {
  try {
    if (isApiSetuConfigured()) {
      const apiData = await fetchStatewiseStats();
      if (apiData) {
        const transformed = transformApiSetuStatsData(apiData);
        if (transformed && transformed.statewiseTableData) {
          return transformed.statewiseTableData;
        }
      }
    }
  } catch (error) {
    console.warn('API Setu fetch failed, using simulated data:', error.message);
  }
  
  // Fallback to simulated data
  return getSimulatedStatewiseTableData();
};

// Main function to get all real-time data - tries API Setu first, then falls back to simulation
export const getAllRealTimeData = async () => {
  try {
    if (isApiSetuConfigured()) {
      // Try to fetch all data from API Setu
      const [statsResult, todaysResult, statewiseResult] = await Promise.allSettled([
        fetchBloodCentresStats(),
        fetchTodaysBloodAvailability(),
        fetchStatewiseStats()
      ]);

      const apiData = {
        statsData: statsResult.status === 'fulfilled' && statsResult.value ? transformApiSetuStatsData(statsResult.value)?.statsData : null,
        todaysStatsData: todaysResult.status === 'fulfilled' && todaysResult.value ? transformApiSetuStatsData(todaysResult.value)?.todaysStatsData : null,
        statewiseBars: statewiseResult.status === 'fulfilled' && statewiseResult.value ? transformApiSetuStatsData(statewiseResult.value)?.statewiseBars : null,
        statewiseTableData: statewiseResult.status === 'fulfilled' && statewiseResult.value ? transformApiSetuStatsData(statewiseResult.value)?.statewiseTableData : null
      };

      // If we got any real data, use it; otherwise fall back
      if (apiData.statsData || apiData.todaysStatsData || apiData.statewiseBars) {
        return {
          statsData: apiData.statsData || getSimulatedStatsData(),
          todaysStatsData: apiData.todaysStatsData || getSimulatedTodaysStatsData(),
          statewiseBars: apiData.statewiseBars || getSimulatedStatewiseBars(),
          statewiseTableData: apiData.statewiseTableData || getSimulatedStatewiseTableData(),
          timestamp: new Date().toISOString(),
          source: 'api-setu'
        };
      }
    }
  } catch (error) {
    console.warn('API Setu fetch failed, using simulated data:', error.message);
  }

  // Fallback to simulated data
  return {
    statsData: getSimulatedStatsData(),
    todaysStatsData: getSimulatedTodaysStatsData(),
    statewiseBars: getSimulatedStatewiseBars(),
    statewiseTableData: getSimulatedStatewiseTableData(),
    timestamp: new Date().toISOString(),
    source: 'simulated'
  };
};

