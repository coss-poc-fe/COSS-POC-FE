'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardPanel from '@/components/DashboardPanel';
import VoiceQueryInterface from '@/components/VoiceQueryInterface';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function CustomerPage() {
  const { customer } = useParams();
  const param = customer as 'customer1' | 'customer2';
  const customerType = param === 'customer1' ? 'cust1' : 'cust2';

  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <main className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-70 bg-white shadow-md flex flex-col justify-between p-7 border-r border-slate-200">
        <div>
          <h1 className="text-xl font-bold mb-9 text-black-800">Customer Panel</h1>
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`text-left p-2 rounded transition-colors ${
                activeTab === 'dashboard' 
                  ? 'bg-black-50 text-black-800 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`text-left p-2 rounded transition-colors ${
                activeTab === 'chat' 
                  ? 'bg-black-50 text-black-800 font-semibold' 
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
            className="w-full bg-black hover:bg-black-700 text-white"
          >
            Switch User
          </Button>
        </div>
      </aside>
      
      <section className="flex-1 p-4 flex flex-col gap-4">
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-4 h-233 w-full">
            <div className="w-full h-full bg-white rounded-3xl shadow-sm border border-slate-200 p-4">
              <DashboardPanel customerType={customerType} />
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex-1 w-full">
            <div className="w-400 h-230 bg-white rounded-3xl shadow-sm border border-slate-200 p-4">
              <VoiceQueryInterface customerType={customerType} />
            </div>
          </div>
        )}
      </section>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-lg shadow-lg border border-slate-200 p-6 max-w-sm w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold mb-4 text-slate-800">Switch User</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <button 
              onClick={() => {
                router.push('/customer/customer1');
                setIsDialogOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Customer 1
            </button>
            <button 
              onClick={() => {
                router.push('/customer/customer2');
                setIsDialogOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Customer 2
            </button>
            <button 
              onClick={() => {
                router.push('/admin');
                setIsDialogOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Admin
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}