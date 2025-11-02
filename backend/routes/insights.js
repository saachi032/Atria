// API route for real-time insights data
import express from 'express';
import {
  getAllRealTimeData,
  getRealTimeStatsData,
  getRealTimeTodaysStatsData,
  getRealTimeStatewiseBars,
  getRealTimeStatewiseTableData
} from '../api/bloodDataService.js';

const router = express.Router();

// GET /api/insights - Get all real-time insights data
router.get('/', async (req, res) => {
  try {
    const data = await getAllRealTimeData();
    res.json(data);
  } catch (error) {
    console.error('Error fetching real-time insights data:', error);
    res.status(500).json({ error: 'Failed to fetch real-time data' });
  }
});

// GET /api/insights/stats - Get stats data only
router.get('/stats', async (req, res) => {
  try {
    const data = await getRealTimeStatsData();
    res.json({ statsData: data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching stats data:', error);
    res.status(500).json({ error: 'Failed to fetch stats data' });
  }
});

// GET /api/insights/todays-stats - Get today's stats only
router.get('/todays-stats', async (req, res) => {
  try {
    const data = await getRealTimeTodaysStatsData();
    res.json({ todaysStatsData: data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Error fetching today\'s stats data:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s stats data' });
  }
});

// GET /api/insights/statewise - Get statewise data only
router.get('/statewise', async (req, res) => {
  try {
    const data = {
      statewiseBars: await getRealTimeStatewiseBars(),
      statewiseTableData: await getRealTimeStatewiseTableData(),
      timestamp: new Date().toISOString()
    };
    res.json(data);
  } catch (error) {
    console.error('Error fetching statewise data:', error);
    res.status(500).json({ error: 'Failed to fetch statewise data' });
  }
});

export default router;

