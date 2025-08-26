'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardPanel from '@/components/DashboardPanel';
import VoiceQueryInterface from '@/components/VoiceQueryInterface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Menu, X, User, Users, ShieldCheck, ChevronRight } from 'lucide-react';

export default function CustomerPage() {
  const { customer } = useParams();
  const param = customer as 'customer1' | 'customer2';
  const customerType = param === 'customer1' ? 'cust1' : 'cust2';

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const userOptions = [
    {
      id: 'customer1',
      title: 'Customer 1',
      description: 'Audio + Text Pipeline',
      icon: User,
      route: '/customer/customer1',
      isActive: param === 'customer1'
    },
    {
      id: 'customer2',
      title: 'Customer 2',
      description: 'Text-only Pipeline',
      icon: Users,
      route: '/customer/customer2',
      isActive: param === 'customer2'
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      description: 'System Management',
      icon: ShieldCheck,
      route: '/admin',
      isActive: false
    }
  ];

  const handleUserSwitch = (route: string) => {
    router.push(route);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
        >
          {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        fixed lg:relative z-40 w-64 lg:w-70 bg-white shadow-md 
        flex flex-col justify-between p-4 lg:p-7 border-r border-slate-200
        h-full
      `}>
        {/* Overlay for mobile */}
        {isMobileSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-white bg-opacity-50 -z-10"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        <div>
          <h1 className="text-lg lg:text-xl font-bold mb-6 lg:mb-9 text-slate-800">CUSTOMER PANEL</h1>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileSidebarOpen(false);
              }}
              className={`text-left p-2 rounded transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-slate-50 text-slate-800 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('chat');
                setIsMobileSidebarOpen(false);
              }}
              className={`text-left p-2 rounded transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-slate-50 text-slate-800 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Chat
            </button>
          </nav>
        </div>

        <div>
          <Button 
            onClick={() => setIsDialogOpen(true)} 
            className="w-full bg-slate-900 hover:bg-slate-700 text-white"
          >
            Switch User
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile header space */}
        <div className="lg:hidden h-16 flex-shrink-0"></div>
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0 p-2 sm:p-4">
          {activeTab === 'dashboard' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-hidden">
                <DashboardPanel customerType={customerType} />
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <VoiceQueryInterface customerType={customerType} />
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Professional Switch User Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-semibold text-slate-900 text-center">
              Switch Account
            </DialogTitle>
            <p className="text-sm text-slate-600 text-center">
              Select an account to continue with different access levels
            </p>
          </DialogHeader>
          
          <div className="space-y-2 mt-6">
            {userOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleUserSwitch(option.route)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200
                    ${option.isActive 
                      ? 'bg-slate-50 border-slate-300 ring-2 ring-slate-200' 
                      : 'hover:bg-slate-100 hover:border-slate-300 border-slate-100'
                    }
                  `}
                  disabled={option.isActive}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-full
                      ${option.isActive ? 'bg-slate-200' : 'bg-slate-100'}
                    `}>
                      <IconComponent className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="text-left">
                      <div className={`font-medium ${option.isActive ? 'text-slate-900' : 'text-slate-800'}`}>
                        {option.title}
                        {option.isActive && <span className="ml-2 text-xs text-slate-500">(Current)</span>}
                      </div>
                      <div className="text-sm text-slate-600">{option.description}</div>
                    </div>
                  </div>
                  {!option.isActive && (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}