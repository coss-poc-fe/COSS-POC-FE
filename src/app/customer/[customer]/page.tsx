'use client';
 
import VoiceQueryInterface from '@/components/VoiceQueryInterface';
import DashboardPanel from '@/components/DashboardPanel';
import { useParams, useRouter } from 'next/navigation';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
 
export default function CustomerPage() {
  const { customer } = useParams();
  const param = customer as 'customer1' | 'customer2';
  const customerType = param === 'customer1' ? 'cust1' : 'cust2';
 
  const router = useRouter();
 
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col p-2 gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">CUSTOMER DASHBOARD</h1>
        <DropdownMenu
          triggerLabel="Switch User"
          items={[
            { label: "Customer 1", onClick: () => router.push("/customer/customer1") },
            { label: "Customer 2", onClick: () => router.push("/customer/customer2") },
            { label: "Admin", onClick: () => router.push("/admin") },
          ]}
        />
      </div>
 
      <div className="flex flex-1 gap-2">
        <div className="w-[650px]">
          <DashboardPanel customerType={customerType} />
        </div>
 
        <div className="flex-1">
          <VoiceQueryInterface customerType={customerType} />
        </div>
      </div>
    </main>
  );
}
 
 