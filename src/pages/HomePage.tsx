import React from 'react';
import { Activity, Package, ListChecks, Bot, PlayCircle, Key } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
export function HomePage() {
  const navigate = useNavigate();
  const metrics = {
    totalProcesses: 12,
    activeJobs: 3,
    queueItems: 45,
    robotsOnline: 8,
    totalAssets: 24
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Orchestrator Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Overview of your UiPath automation environment</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Processes</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.totalProcesses}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0 w-full justify-start"
                onClick={() => navigate('/processes')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.activeJobs}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <PlayCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0 w-full justify-start"
                onClick={() => navigate('/jobs')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Queue Items</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.queueItems}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <ListChecks className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0 w-full justify-start"
                onClick={() => navigate('/queues')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Robots Online</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.robotsOnline}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bot className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0 w-full justify-start"
                onClick={() => navigate('/robots')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Assets</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-2">{metrics.totalAssets}</p>
                </div>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Key className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0 w-full justify-start"
                onClick={() => navigate('/assets')}
              >
                View all →
              </Button>
            </Card>
          </div>
          <Card className="border border-gray-200 bg-white">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                </div>
              </div>
            </div>
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Activity monitoring coming soon</p>
              <p className="text-xs text-gray-400 mt-1">
                Real-time job execution data will be available when the Jobs API is integrated
              </p>
            </div>
          </Card>
          <footer className="text-center text-sm text-gray-500 pt-8">
            © Powered by UiPath
          </footer>
        </div>
      </div>
    </div>
  );
}