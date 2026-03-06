import React, { useEffect, useState, useMemo } from 'react';
import { PlayCircle, Search, Filter, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUiPath } from '@/lib/uipath';
import { JobsService } from '@uipath/uipath-typescript/services/jobs';
import type { Job } from '@uipath/uipath-typescript/services/jobs';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';
export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
  const fetchJobs = async (isRefresh = false) => {
    if (!jobsService) {
      setError('SDK not initialized. Please check your configuration.');
      setLoading(false);
      return;
    }
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const options: any = {
        $top: 100,
        $orderby: 'StartTime desc'
      };
      if (statusFilter !== 'all') {
        options.$filter = `State eq '${statusFilter}'`;
      }
      const response = await jobsService.getJobs(options);
      if (response?.value) {
        setJobs(response.value);
      }
      if (isRefresh) {
        toast.success('Jobs refreshed successfully');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jobs';
      setError(errorMessage);
      if (isRefresh) {
        toast.error('Failed to refresh jobs');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    if (jobsService) {
      fetchJobs();
      const interval = setInterval(() => fetchJobs(true), 30000);
      return () => clearInterval(interval);
    }
  }, [jobsService, statusFilter]);
  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    return jobs.filter(j => 
      j.Info?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.ReleaseName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);
  const getStatusBadge = (state: string) => {
    const variants: Record<string, { className: string }> = {
      'Successful': { className: 'bg-green-100 text-green-800 border-green-200' },
      'Failed': { className: 'bg-red-100 text-red-800 border-red-200' },
      'Running': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Pending': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Stopped': { className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'Stopping': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'Terminating': { className: 'bg-red-100 text-red-800 border-red-200' },
      'Faulted': { className: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = variants[state] || variants['Pending'];
    return <Badge variant="outline" className={config.className}>{state}</Badge>;
  };
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="border border-gray-200">
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <Card className="p-8 border border-red-200 bg-red-50">
            <div className="text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <h3 className="text-lg font-semibold text-red-900">Unable to Load Jobs</h3>
              <p className="text-sm text-red-800">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => fetchJobs()} 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 hover:bg-red-100"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
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
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-gray-900">Jobs</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredJobs.length} jobs found</p>
              </div>
              <Button
                onClick={() => fetchJobs(true)}
                variant="outline"
                size="sm"
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
          <Card className="p-4 border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-blue-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-gray-300">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Successful">Successful</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Stopped">Stopped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
          <Card className="border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Job Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Started</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Robot</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <PlayCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No jobs found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {statusFilter !== 'all' 
                            ? `No jobs with status "${statusFilter}"` 
                            : 'Jobs will appear here once they start running'
                          }
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job.Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {job.Info || job.ReleaseName || 'Unnamed Job'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {getStatusBadge(job.State || 'Pending')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {job.StartTime ? (
                            <div>
                              <div>{format(new Date(job.StartTime), 'MMM d, HH:mm')}</div>
                              <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(job.StartTime), { addSuffix: true })}</div>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {job.EndTime ? format(new Date(job.EndTime), 'MMM d, HH:mm') : job.State === 'Running' ? 'Running...' : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {job.StartTime && job.EndTime 
                            ? `${Math.round((new Date(job.EndTime).getTime() - new Date(job.StartTime).getTime()) / 1000)}s`
                            : job.StartTime && job.State === 'Running' ? 'Running...' : 'N/A'
                          }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {job.HostMachineName || 'N/A'}
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