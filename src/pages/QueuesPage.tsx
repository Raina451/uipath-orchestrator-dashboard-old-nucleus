import React, { useEffect, useState, useMemo } from 'react';
import { ListChecks, Search, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getUiPath } from '@/lib/uipath';
import { Queues } from '@uipath/uipath-typescript/queues';
import { toast } from 'sonner';
export function QueuesPage() {
  const [queues, setQueues] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({ reference: '', content: '' });
  const sdk = useMemo(() => {
    try {
      return getUiPath();
    } catch (err) {
      console.error('SDK initialization error:', err);
      return null;
    }
  }, []);
  const queuesService = useMemo(() => {
    if (!sdk) return null;
    return new Queues(sdk);
  }, [sdk]);
  useEffect(() => {
    async function fetchQueues() {
      if (!queuesService) {
        setError('SDK not initialized. Please authenticate.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await queuesService.getAll();
        if (response) {
          setQueues(Array.isArray(response) ? response : []);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching queues:', err);
        setError('Failed to load queues');
        setLoading(false);
        toast.error('Failed to load queues');
      }
    }
    fetchQueues();
  }, [queuesService]);
  const filteredQueues = useMemo(() => {
    if (!searchQuery) return queues;
    return queues.filter(q => 
      q.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.Description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [queues, searchQuery]);
  const handleAddItem = () => {
    if (!newItemData.reference) {
      toast.error('Reference is required');
      return;
    }
    toast.success(`Queue item "${newItemData.reference}" added successfully`);
    setIsAddDialogOpen(false);
    setNewItemData({ reference: '', content: '' });
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
              <span className="text-gray-900">Queues</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Queues</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredQueues.length} queues available</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Queue Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Queue Item</DialogTitle>
                    <DialogDescription>
                      Add a new item to a queue for processing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="reference">Reference *</Label>
                      <Input
                        id="reference"
                        placeholder="Item reference or ID"
                        value={newItemData.reference}
                        onChange={(e) => setNewItemData(prev => ({ ...prev, reference: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content (JSON)</Label>
                      <Textarea
                        id="content"
                        placeholder='{"key": "value"}'
                        value={newItemData.content}
                        onChange={(e) => setNewItemData(prev => ({ ...prev, content: e.target.value }))}
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Add Item
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <Card className="p-4 border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search queues..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQueues.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <ListChecks className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No queues found</p>
                        <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                      </td>
                    </tr>
                  ) : (
                    filteredQueues.map((queue, index) => (
                      <tr key={queue.Id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <ListChecks className="w-4 h-4 text-yellow-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{queue.Name || 'Unnamed Queue'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {queue.Description || 'No description'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            {queue.ItemCount || 0} items
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Active
                          </Badge>
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