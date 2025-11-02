// API Setu service for fetching e-RaktKosh data
// This service integrates with API Setu (api.setu.gov.in) to fetch real-time blood bank data
// Requires API Setu registration and credentials in .env file

import axios from 'axios';

const API_SETU_BASE_URL = process.env.API_SETU_BASE_URL || 'https://api.setu.gov.in';
const API_SETU_API_KEY = process.env.API_SETU_API_KEY;
const API_SETU_ACCESS_TOKEN = process.env.API_SETU_ACCESS_TOKEN;

// Helper to make API Setu requests
const makeApiSetuRequest = async (endpoint, params = {}) => {
  if (!API_SETU_API_KEY && !API_SETU_ACCESS_TOKEN) {
    throw new Error('API Setu credentials not configured');
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(API_SETU_API_KEY && { 'X-API-Key': API_SETU_API_KEY }),
        ...(API_SETU_ACCESS_TOKEN && { 'Authorization': `Bearer ${API_SETU_ACCESS_TOKEN}` })
      },
      params
    };

    const response = await axios.get(`${API_SETU_BASE_URL}${endpoint}`, config);
    return response.data;
  } catch (error) {
    console.error(`API Setu request failed for ${endpoint}:`, error.message);
    throw error;
  }
};

// Fetch blood centres statistics
export const fetchBloodCentresStats = async () => {
  try {
    // Common API Setu endpoints for e-RaktKosh (adjust based on actual API documentation)
    const data = await makeApiSetuRequest('/eraktkosh/blood-bank/statistics');
    return data;
  } catch (error) {
    console.error('Failed to fetch blood centres stats from API Setu:', error.message);
    return null;
  }
};

// Fetch today's blood availability
export const fetchTodaysBloodAvailability = async () => {
  try {
    const data = await makeApiSetuRequest('/eraktkosh/blood-bank/today-availability');
    return data;
  } catch (error) {
    console.error('Failed to fetch today\'s blood availability from API Setu:', error.message);
    return null;
  }
};

// Fetch statewise statistics
export const fetchStatewiseStats = async () => {
  try {
    const data = await makeApiSetuRequest('/eraktkosh/blood-bank/statewise-statistics');
    return data;
  } catch (error) {
    console.error('Failed to fetch statewise stats from API Setu:', error.message);
    return null;
  }
};

// Transform API Setu response to match our dashboard format
export const transformApiSetuStatsData = (apiData) => {
  // Transform the API Setu response to match the expected format
  // This needs to be customized based on the actual API Setu response structure
  if (!apiData) return null;

  return {
    statsData: apiData.statsData || [],
    todaysStatsData: apiData.todaysStatsData || [],
    statewiseBars: apiData.statewiseBars || [],
    statewiseTableData: apiData.statewiseTableData || []
  };
};

// Check if API Setu is configured
export const isApiSetuConfigured = () => {
  return !!(API_SETU_API_KEY || API_SETU_ACCESS_TOKEN);
};

