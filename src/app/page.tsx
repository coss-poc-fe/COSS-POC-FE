import VoiceQueryInterface from '@/components/VoiceQueryInterface';
import DashboardPanel from '@/components/DashboardPanel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex p-6 gap-6">
      
     

      
      <div className="w-[650px]">
        <DashboardPanel />
      </div>

       <div className="flex-1">
        <VoiceQueryInterface />
      </div>
    </main>
  );
}
