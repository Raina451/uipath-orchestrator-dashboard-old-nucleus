import React from 'react';
import { Bot, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export function RobotsPage() {
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
                <p className="text-sm text-gray-500 mt-1">Robot management and monitoring</p>
              </div>
            </div>
          </div>
          <Card className="p-12 border border-gray-200 bg-white">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <AlertCircle className="w-12 h-12 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Robots API Not Available</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                The Robots service is not currently available in the UiPath TypeScript SDK. 
                Please check back later or use the UiPath Orchestrator web interface to manage robots.
              </p>
              <div className="flex gap-3 justify-center pt-4">
                <Button 
                  onClick={() => window.history.back()} 
                  variant="outline"
                >
                  Go Back
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
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