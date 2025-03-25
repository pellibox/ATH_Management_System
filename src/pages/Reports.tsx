
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', courtUsage: 65, revenue: 4000, bookings: 240 },
  { name: 'Feb', courtUsage: 59, revenue: 3000, bookings: 198 },
  { name: 'Mar', courtUsage: 80, revenue: 5000, bookings: 320 },
  { name: 'Apr', courtUsage: 81, revenue: 5100, bookings: 318 },
  { name: 'May', courtUsage: 76, revenue: 4800, bookings: 301 },
  { name: 'Jun', courtUsage: 85, revenue: 6000, bookings: 350 },
];

export default function Reports() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Trigger animations after mount
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className={`mb-8 opacity-0 transform translate-y-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : ""
      }`}>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Review performance metrics and business analytics</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-soft animate-on-scroll">
          <h3 className="font-semibold mb-4">Total Revenue</h3>
          <p className="text-3xl font-bold">€27,900</p>
          <p className="text-sm text-green-600 mt-2">+14% from last month</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-soft animate-on-scroll">
          <h3 className="font-semibold mb-4">Court Utilization</h3>
          <p className="text-3xl font-bold">78%</p>
          <p className="text-sm text-green-600 mt-2">+5% from last month</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-soft animate-on-scroll">
          <h3 className="font-semibold mb-4">Active Students</h3>
          <p className="text-3xl font-bold">214</p>
          <p className="text-sm text-green-600 mt-2">+12 from last month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-6 mb-8 animate-on-scroll">
        <h2 className="text-xl font-semibold mb-6">Performance Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="courtUsage" name="Court Usage %" fill="#0EA5E9" />
              <Bar yAxisId="right" dataKey="bookings" name="Total Bookings" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-on-scroll">
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold mb-4">Popular Court Types</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Clay Courts</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-ath-clay h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Hard Courts</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-ath-hard h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Grass Courts</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-ath-grass h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Central Court</span>
                <span className="text-sm font-medium">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-ath-central h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold mb-4">Top Programs by Revenue</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ath-blue-light flex items-center justify-center text-ath-blue mr-3">
                  <span className="font-semibold">1</span>
                </div>
                <div>
                  <p className="font-medium">Advanced Training</p>
                  <p className="text-sm text-gray-500">12 sessions/week</p>
                </div>
              </div>
              <p className="font-semibold">€8,450</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ath-blue-light flex items-center justify-center text-ath-blue mr-3">
                  <span className="font-semibold">2</span>
                </div>
                <div>
                  <p className="font-medium">Private Lessons</p>
                  <p className="text-sm text-gray-500">45 sessions/week</p>
                </div>
              </div>
              <p className="font-semibold">€7,200</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ath-blue-light flex items-center justify-center text-ath-blue mr-3">
                  <span className="font-semibold">3</span>
                </div>
                <div>
                  <p className="font-medium">Junior Academy</p>
                  <p className="text-sm text-gray-500">20 sessions/week</p>
                </div>
              </div>
              <p className="font-semibold">€6,800</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-ath-blue-light flex items-center justify-center text-ath-blue mr-3">
                  <span className="font-semibold">4</span>
                </div>
                <div>
                  <p className="font-medium">Adult Group Classes</p>
                  <p className="text-sm text-gray-500">18 sessions/week</p>
                </div>
              </div>
              <p className="font-semibold">€5,450</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
