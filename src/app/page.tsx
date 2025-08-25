// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, Users, Settings } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const cards = [
    {
      title: 'Customer 1',
      description: 'Chat with AI assistant',
      icon: <User className="w-12 h-12 text-white" />,
      color: 'bg-indigo-100 hover:bg-indigo-200',
      iconBg: 'bg-indigo-300',
      route: '/customer/customer1'
    },
    {
      title: 'Customer 2',
      description: 'Chat with AI assistant',
      icon: <Users className="w-12 h-12 text-white" />,
      color: 'bg-green-100 hover:bg-green-200',
      iconBg: 'bg-green-300',
      route: '/customer/customer2'
    },
    {
      title: 'Adopter Admin',
      description: 'View dashboard and analytics',
      icon: <Settings className="w-12 h-12 text-white" />,
      color: 'bg-yellow-100 hover:bg-yellow-200',
      iconBg: 'bg-yellow-300',
      route: '/admin'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-4xl p-8 shadow-lg border-gray-200">
        <CardHeader className="text-center mb-8">
          <CardTitle className="text-3xl text-gray-800 font-bold">Select Your Role</CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Choose a role to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <Card
                key={card.title}
                className={`cursor-pointer transition-transform duration-300 ${card.color} border border-gray-200`}
                onClick={() => router.push(card.route)}
              >
                <CardContent className="flex flex-col items-center justify-center gap-4 h-64">
                  {/* Icon */}
                  <div className={`p-4 rounded-full ${card.iconBg} bg-opacity-70 flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  {/* Title */}
                  <CardTitle className="text-gray-800 text-xl text-center">
                    {card.title}
                  </CardTitle>
                  {/* Description */}
                  <CardDescription className="text-gray-600 text-center">
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
