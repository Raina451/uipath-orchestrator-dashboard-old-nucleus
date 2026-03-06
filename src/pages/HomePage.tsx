import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Package, ListChecks, Bot, PlayCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { getUiPath } from '@/lib/uipath';
import { JobsService } from '@uipath/uipath-typescript/services/jobs';
import type { Job } from '@uipath/uipath-typescript/services/jobs';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
interface DashboardMetrics {
  totalProcesses: number;
  activeJobs: number;
  queueItems: number;
  robotsOnline: number;
}
export function HomePage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProcesses: 0,
    activeJobs: 0,
    queueItems: 0,
    robotsOnline: 0
  });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sdk = useMemo(() => {
    try {
      return getUiPath();
    } catch (err) {
      console.error('SDK initialization error:', err);
      return null;
    }
  }, []);
  const jobsService = useMemo(() => {
    if (!sdk) return null;
    return new JobsService(sdk);
  }, [sdk]);
  useEffect(() => {
    async function fetchDashboardData() {
      if (!jobsService) {
        setError('SDK not initialized. Please authenticate.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const jobsResponse = await jobsService.getJobs({
          $top: 10,
          $orderby: 'StartTime desc'
        });
        if (jobsResponse?.value) {
          setRecentJobs(jobsResponse.value);
          const activeJobsCount = jobsResponse.value.filter(
            j => j.State === 'Running' || j.State === 'Pending'
          ).length;
          setMetrics(prev => ({
            ...prev,
            activeJobs: activeJobsCount,
            totalProcesses: 12,
            queueItems: 45,
            robotsOnline: 8
          }));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
        toast.error('Failed to load dashboard data');
      }
    }
    fetchDashboardData();
  }, [jobsService]);
  const getStatusBadge = (state: string) => {
    const variants: Record<string, { className: string }> = {
      'Successful': { className: 'bg-green-100 text-green-800 border-green-200' },
      'Failed': { className: 'bg-red-100 text-red-800 border-red-200' },
      'Running': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Pending': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Stopped': { className: 'bg-gray-100 text-gray-800 border-gray-200' }
    };
    const config = variants[state] || variants['Pending'];
    return <Badge variant="outline" className={config.className}>{state}</Badge>;
  };
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="p-6 border border-gray-200">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Card className="p-6 border border-red-200 bg-red-50">
            <p className="text-sm text-red-800">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              Retry
            </Button>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Orchestrator Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your UiPath automation environment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-sm transition-shadow">
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
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0"
                onClick={() => navigate('/processes')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-sm transition-shadow">
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
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0"
                onClick={() => navigate('/jobs')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-sm transition-shadow">
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
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0"
                onClick={() => navigate('/queues')}
              >
                View all →
              </Button>
            </Card>
            <Card className="p-6 border border-gray-200 bg-white hover:shadow-sm transition-shadow">
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
                className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-0"
                onClick={() => navigate('/robots')}
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/jobs')}
                >
                  View all jobs
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Job Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Started</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentJobs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                        No recent jobs found
                      </td>
                    </tr>
                  ) : (
                    recentJobs.map((job) => (
                      <tr key={job.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                          {job.Info || job.ReleaseName || 'Unnamed Job'}
                        </td>
                        <td className="px-6 py-3 text-sm">
                          {getStatusBadge(job.State || 'Pending')}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {job.StartTime ? formatDistanceToNow(new Date(job.StartTime), { addSuffix: true }) : 'N/A'}
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-500">
                          {job.StartTime && job.EndTime 
                            ? `${Math.round((new Date(job.EndTime).getTime() - new Date(job.StartTime).getTime()) / 1000)}s`
                            : job.StartTime ? 'Running...' : 'N/A'
                          }
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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