import React, { useEffect, useState, useMemo } from 'react';
import { Package, Search, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getUiPath } from '@/lib/uipath';
import { Processes } from '@uipath/uipath-typescript/processes';
import { toast } from 'sonner';
export function ProcessesPage() {
  const [processes, setProcesses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
  const processesService = useMemo(() => {
    if (!sdk) return null;
    return new Processes(sdk);
  }, [sdk]);
  useEffect(() => {
    async function fetchProcesses() {
      if (!processesService) {
        setError('SDK not initialized. Please authenticate.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await processesService.getAll();
        if (response) {
          setProcesses(Array.isArray(response) ? response : []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching processes:', err);
        setError('Failed to load processes');
        setLoading(false);
        toast.error('Failed to load processes');
      }
    }
    fetchProcesses();
  }, [processesService]);
  const filteredProcesses = useMemo(() => {
    if (!searchQuery) return processes;
    return processes.filter(p => 
      p.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [processes, searchQuery]);
  const handleStartJob = (processKey: string, processName: string) => {
    toast.info(`Starting job for ${processName}...`);
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
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-gray-900">Processes</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Processes</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredProcesses.length} processes available</p>
              </div>
            </div>
          </div>
          <Card className="p-4 border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search processes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>
          </Card>
          <Card className="border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Version</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProcesses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No processes found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProcesses.map((process, index) => (
                      <tr key={process.Key || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{process.Name || 'Unnamed Process'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {process.ProcessVersion || process.Version || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {process.Description || 'No description'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleStartJob(process.Key || '', process.Name || '')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Start Job
                          </Button>
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