import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- Animation Hook ---
const useAnimatedCounter = (endValue, duration = 400) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.round(endValue * progress);
      setCount(currentCount);
      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(endValue);
      }
    }, frameRate);
    return () => clearInterval(counter);
  }, [endValue, duration]);
  return count;
};

// --- SVG Icons ---
const DropletsIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 16.3c.5.5 1.2 1 2.2 1.7.9.7 1.8 1 2.8 1 .9 0 1.8-.3 2.8-1 .9-.7 1.7-1.2 2.2-1.7M12 22v-2.2M18.3 5.4A6.4 6.4 0 0 0 12 2a6.4 6.4 0 0 0-6.3 3.4"/><path d="M12 2v7.3"/><path d="m 5.7,14 a 6.4,6.4 0 0 0 12.6,0"/></svg>);
const BellIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>);
const CalendarIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>);
const AlertTriangleIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>);
const PlusCircleIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>);
const ClipboardIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>);
const SendIcon = (props) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>);

// --- Mock Data ---
const inventoryData = [
  { type: 'A+', units: 75 }, { type: 'A-', units: 9 },
  { type: 'B+', units: 60 }, { type: 'B-', units: 15 },
  { type: 'O+', units: 120 }, { type: 'O-', units: 45 },
  { type: 'AB+', units: 35 }, { type: 'AB-', units: 8 },
];
const pendingRequests = [
  { id: "R-7284", patient: "John Doe", type: "A+", units: 2, date: "2024-10-28" },
  { id: "R-7282", patient: "Robert Brown", type: "B+", units: 3, date: "2024-10-27" },
];
const weeklyChartData = [
    { day: 'Mon', donations: 15, requests: 12 }, { day: 'Tue', donations: 18, requests: 20 },
    { day: 'Wed', donations: 25, requests: 15 }, { day: 'Thu', donations: 22, requests: 24 },
    { day: 'Fri', donations: 30, requests: 18 }, { day: 'Sat', donations: 12, requests: 10 },
    { day: 'Sun', donations: 8, requests: 5 },
];

const LOW_STOCK_THRESHOLD = 10;
const STABLE_STOCK_THRESHOLD = 40;
const lowStockAlerts = inventoryData.filter(item => item.units < LOW_STOCK_THRESHOLD);

// --- Chart Helpers ---
const getBloodStatusColor = (units) => {
    if (units < LOW_STOCK_THRESHOLD) return '#EF4444'; // Red
    if (units < STABLE_STOCK_THRESHOLD) return '#FBBF24'; // Yellow
    return '#34D399'; // Green
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="14px" fontWeight="bold">
      {payload.units}
    </text>
  );
};

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const totalUnits = inventoryData.reduce((sum, item) => sum + item.units, 0);
  const totalPendingRequests = pendingRequests.length;
  const totalScheduledDonations = 32;
  const totalAlerts = lowStockAlerts.length;
  
  const animatedTotalUnits = useAnimatedCounter(totalUnits);
  const animatedPendingRequests = useAnimatedCounter(totalPendingRequests);
  const animatedScheduledDonations = useAnimatedCounter(totalScheduledDonations);
  const animatedAlerts = useAnimatedCounter(totalAlerts);
  
  const statsCards = [
    { title: "Total Blood Units", value: animatedTotalUnits, icon: <DropletsIcon className="w-8 h-8"/>, color: "blue", tooltip: "Total units available." },
    { title: "Pending Requests", value: animatedPendingRequests, icon: <BellIcon className="w-8 h-8"/>, color: "yellow", tooltip: "Requests awaiting fulfillment." },
    { title: "Scheduled Donations", value: animatedScheduledDonations, icon: <CalendarIcon className="w-8 h-8"/>, color: "green", tooltip: "Upcoming appointments." },
    { title: "Low Stock Alerts", value: animatedAlerts, icon: <AlertTriangleIcon className="w-8 h-8"/>, color: "red", tooltip: `Blood types below ${LOW_STOCK_THRESHOLD} units.` },
  ];

  const getCardColor = (color) => {
    const colors = { blue: 'bg-blue-100 text-blue-600', yellow: 'bg-yellow-100 text-yellow-600', green: 'bg-green-100 text-green-600', red: 'bg-red-100 text-red-600' };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h2>
            <p className="text-gray-500 mt-1">Here's a summary of your hospital's blood bank activity.</p>
          </div>
          <div className="relative">
            <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 rounded-full hover:bg-gray-200">
                <BellIcon className="w-6 h-6 text-gray-600"/>
                {(totalPendingRequests + totalAlerts > 0) &&
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {totalPendingRequests + totalAlerts}
                    </span>
                }
            </button>
            {notificationsOpen && (
                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-10 animate-fade-in-fast">
                    <div className="p-4 font-semibold border-b">Notifications</div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                        {pendingRequests.map(req => (
                            <div key={req.id} className="px-4 py-2 hover:bg-gray-100">
                                <p className="text-sm font-medium text-gray-800">New Request: {req.units} units of {req.type}</p>
                                <p className="text-xs text-gray-500">For patient {req.patient}</p>
                            </div>
                        ))}
                        {lowStockAlerts.map(alert => (
                             <div key={alert.type} className="px-4 py-2 hover:bg-gray-100">
                                <p className="text-sm font-medium text-red-600">Low Stock: {alert.type}</p>
                                <p className="text-xs text-gray-500">{alert.units} units remaining</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map(card => (
            <div key={card.title} title={card.tooltip} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 flex items-center">
              <div className={`p-4 rounded-full ${getCardColor(card.color)} mr-4`}>{card.icon}</div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Weekly Activity</h3>
              <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                      <BarChart data={weeklyChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="day" tick={{fontSize: 12}}/>
                          <YAxis tick={{fontSize: 12}}/>
                          <Tooltip />
                          <Legend />
                          {/* ✅ Animation disabled */}
                          <Bar dataKey="donations" fill="#34D399" name="Donations" isAnimationActive={false} />
                          <Bar dataKey="requests" fill="#F87171" name="Requests" isAnimationActive={false} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Blood Inventory</h3>
                <div style={{ width: '100%', height: 240 }}>
                    <ResponsiveContainer>
                        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                            {/* ✅ Animation disabled */}
                            <Pie data={inventoryData} dataKey="units" nameKey="type" cx="50%" cy="50%" innerRadius={40} outerRadius={90}
                                 labelLine={false} label={renderCustomizedLabel} isAnimationActive={false}>
                                {inventoryData.map((entry) => <Cell key={`cell-${entry.type}`} fill={getBloodStatusColor(entry.units)} />)}
                            </Pie>
                            <Tooltip formatter={(value, name) => [`${value} units`, name]}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center p-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow-md">
                  <PlusCircleIcon className="w-5 h-5 mr-2"/> Create New Request
                </button>
                 <button className="w-full flex items-center justify-center p-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm hover:shadow-md">
                  <ClipboardIcon className="w-5 h-5 mr-2"/> Record New Donation
                </button>
                 <button className="w-full flex items-center justify-center p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md">
                  <SendIcon className="w-5 h-5 mr-2"/> Send Donor Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}