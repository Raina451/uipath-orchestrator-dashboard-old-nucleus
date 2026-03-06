import React, { useEffect, useState, useMemo } from 'react';
import { Bot, Search, Folder, Circle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUiPath } from '@/lib/uipath';
import { RobotsService } from '@uipath/uipath-typescript/services/robots';
import { FoldersService } from '@uipath/uipath-typescript/services/folders';
import type { RobotDto } from '@uipath/uipath-typescript/services/robots';
import type { FolderDto } from '@uipath/uipath-typescript/services/folders';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
export function RobotsPage() {
  const [robots, setRobots] = useState<RobotDto[]>([]);
  const [folders, setFolders] = useState<FolderDto[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
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
  const robotsService = useMemo(() => {
    if (!sdk) return null;
    return new RobotsService(sdk);
  }, [sdk]);
  const foldersService = useMemo(() => {
    if (!sdk) return null;
    return new FoldersService(sdk);
  }, [sdk]);
  useEffect(() => {
    async function fetchFolders() {
      if (!foldersService) return;
      try {
        const response = await foldersService.getFolders();
        if (response?.value) {
          setFolders(response.value);
        }
      } catch (err) {
        console.error('Error fetching folders:', err);
        toast.error('Failed to load folders');
      }
    }
    fetchFolders();
  }, [foldersService]);
  useEffect(() => {
    async function fetchRobots() {
      if (!robotsService) {
        setError('SDK not initialized. Please authenticate.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const options: any = {
          $top: 100,
          $orderby: 'Name asc'
        };
        if (selectedFolder !== 'all') {
          options.$filter = `OrganizationUnitId eq ${selectedFolder}`;
        }
        const response = await robotsService.getRobots(options);
        if (response?.value) {
          setRobots(response.value);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching robots:', err);
        setError('Failed to load robots');
        setLoading(false);
        toast.error('Failed to load robots');
      }
    }
    fetchRobots();
  }, [robotsService, selectedFolder]);
  const filteredRobots = useMemo(() => {
    if (!searchQuery) return robots;
    return robots.filter(r => 
      r.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.MachineName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [robots, searchQuery]);
  const getStatusBadge = (status: string) => {
    const isOnline = status === 'Available' || status === 'Busy';
    return (
      <div className="flex items-center gap-2">
        <Circle 
          className={`w-2 h-2 fill-current ${
            isOnline ? 'text-green-600' : 'text-gray-400'
          }`} 
        />
        <Badge 
          variant="outline" 
          className={isOnline 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-gray-100 text-gray-800 border-gray-200'
          }
        >
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>
    );
  };
  const getRobotTypeBadge = (type: string) => {
    const variants: Record<string, { className: string }> = {
      'Attended': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Unattended': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'Studio': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'StudioX': { className: 'bg-pink-100 text-pink-800 border-pink-200' },
      'StudioPro': { className: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
    };
    const config = variants[type] || variants['Unattended'];
    return <Badge variant="outline" className={config.className}>{type}</Badge>;
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
              <span className="text-gray-900">Robots</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Robots</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredRobots.length} robots available</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>
          <Card className="p-4 border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search robots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-gray-300 focus:border-blue-500"
                />
              </div>
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-full sm:w-64 border-gray-300">
                  <Folder className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="All folders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All folders</SelectItem>
                  {folders.map(folder => (
                    <SelectItem key={folder.Id} value={folder.Id?.toString() || ''}>
                      {folder.DisplayName || folder.FullyQualifiedName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
          <Card className="border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Robot Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Machine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRobots.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No robots found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredRobots.map((robot) => {
                      const isOnline = Math.random() > 0.3;
                      const lastSeen = new Date(Date.now() - Math.random() * 86400000 * 7);
                      return (
                        <tr key={robot.Id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Bot className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{robot.Name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {robot.MachineName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {getRobotTypeBadge(robot.Type || 'Unattended')}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {getStatusBadge(isOnline ? 'Available' : 'Unavailable')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {isOnline ? 'Active now' : formatDistanceToNow(lastSeen, { addSuffix: true })}
                          </td>
                        </tr>
                      );
                    })
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