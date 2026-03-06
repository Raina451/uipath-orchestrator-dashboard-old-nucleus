import React, { useEffect, useState, useMemo } from 'react';
import { Key, Search, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getUiPath } from '@/lib/uipath';
import { Assets } from '@uipath/uipath-typescript/assets';
import { toast } from 'sonner';
export function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleValues, setVisibleValues] = useState<Set<number>>(new Set());
  const sdk = useMemo(() => {
    try {
      return getUiPath();
    } catch (err) {
      console.error('SDK initialization error:', err);
      return null;
    }
  }, []);
  const assetsService = useMemo(() => {
    if (!sdk) return null;
    return new Assets(sdk);
  }, [sdk]);
  useEffect(() => {
    async function fetchAssets() {
      if (!assetsService) {
        setError('SDK not initialized. Please authenticate.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await assetsService.getAll();
        if (response) {
          setAssets(Array.isArray(response) ? response : []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching assets:', err);
        setError('Failed to load assets');
        setLoading(false);
        toast.error('Failed to load assets');
      }
    }
    fetchAssets();
  }, [assetsService]);
  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;
    return assets.filter(a => 
      a.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [assets, searchQuery]);
  const toggleValueVisibility = (assetId: number) => {
    setVisibleValues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assetId)) {
        newSet.delete(assetId);
      } else {
        newSet.add(assetId);
      }
      return newSet;
    });
  };
  const getAssetTypeBadge = (type: string) => {
    const variants: Record<string, { className: string }> = {
      'Text': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Bool': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'Integer': { className: 'bg-green-100 text-green-800 border-green-200' },
      'Credential': { className: 'bg-red-100 text-red-800 border-red-200' },
      'WindowsCredential': { className: 'bg-red-100 text-red-800 border-red-200' }
    };
    const config = variants[type] || variants['Text'];
    return <Badge variant="outline" className={config.className}>{type}</Badge>;
  };
  const isCredentialType = (type: string) => {
    return type === 'Credential' || type === 'WindowsCredential';
  };
  const getDisplayValue = (asset: any) => {
    if (!asset.Id) return 'N/A';
    if (isCredentialType(asset.ValueType || '')) {
      return visibleValues.has(asset.Id) ? asset.StringValue || '••••••••' : '••••••••';
    }
    return asset.StringValue || asset.IntValue?.toString() || asset.BoolValue?.toString() || 'N/A';
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
              <span className="text-gray-900">Assets</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Assets</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredAssets.length} assets available</p>
              </div>
            </div>
          </div>
          <Card className="p-4 border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search assets..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Key className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No assets found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset, index) => (
                      <tr key={asset.Id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Key className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{asset.Name || 'Unnamed Asset'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {getAssetTypeBadge(asset.ValueType || 'Text')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                          {getDisplayValue(asset)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {asset.Description || 'No description'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {asset.Id && isCredentialType(asset.ValueType || '') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleValueVisibility(asset.Id)}
                            >
                              {visibleValues.has(asset.Id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          )}
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