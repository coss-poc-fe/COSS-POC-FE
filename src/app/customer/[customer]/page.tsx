'use client'; 

import VoiceQueryInterface from '@/components/VoiceQueryInterface';
import DashboardPanel from '@/components/DashboardPanel';
import { useParams } from 'next/navigation';

export default function CustomerPage() {
  const { customer } = useParams(); // 'customer1' or 'customer2'
  const customerType = customer as 'customer1' | 'customer2';


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex p-1 gap-2">
      
      <div className="w-[650px]">
        <DashboardPanel customerType={customerType} />
      </div>

       <div className="flex-1">
        <VoiceQueryInterface customerType={customerType} />
      </div>
    </main>
  );
}
