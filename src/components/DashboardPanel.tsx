'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  {
    requestId: 'REQ001',
    nmt: 0.120,
    llm: 1.250,
    tts: 0.450,
    total: 1.820
  },
  {
    requestId: 'REQ002',
    nmt: 0.150,
    llm: 1.100,
    tts: 0.400,
    total: 1.650
  },
  {
    requestId: 'REQ003',
    nmt: 0.130,
    llm: 1.300,
    tts: 0.480,
    total: 1.910
  },
  {
    requestId: 'REQ004',
    nmt: 0.120,
    llm: 1.250,
    tts: 0.450,
    total: 1.820
  },
  {
    requestId: 'REQ005',
    nmt: 0.150,
    llm: 1.100,
    tts: 0.400,
    total: 1.650
  },
  {
    requestId: 'REQ006',
    nmt: 0.130,
    llm: 1.300,
    tts: 0.480,
    total: 1.910
  },
  {
    requestId: 'REQ007',
    nmt: 0.130,
    llm: 1.300,
    tts: 0.480,
    total: 1.910
  },
  {
    requestId: 'REQ008',
    
    nmt: 0.120,
    llm: 1.250,
    tts: 0.450,
    total: 1.820
  },
];

export default function CustomerLatencyDashboard({ customerType = 'customer1' }) {
  // Filter data according to customer type
  const filteredData = sampleData.map((row) => {
    if (customerType === 'customer2') {
      return { ...row, tts: undefined, total: row.nmt + row.llm };
    }
    return row;
  });

  return (
   <div className="h-full flex flex-col gap-3 mt-1">
  {/* Latency Data Table */}
  <Card className="h-[440px] bg-white border-none rounded-none">
    <CardHeader>
      <CardTitle className="text-lg text-gray-800">Latency Data</CardTitle>
    </CardHeader>
    <CardContent className="h-full overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            
            
            <TableHead>NMT Latency (s)</TableHead>
            <TableHead>LLM Latency (s)</TableHead>
            {customerType === 'customer1' && <TableHead>TTS Latency (s)</TableHead>}
            <TableHead>Total Response (s)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow key={row.requestId}>
              <TableCell>{row.requestId}</TableCell>
             
              <TableCell>{row.nmt.toFixed(3)}</TableCell>
              <TableCell>{row.llm.toFixed(3)}</TableCell>
              {customerType === 'customer1' && <TableCell>{row.tts?.toFixed(3)}</TableCell>}
              <TableCell>{row.total.toFixed(3)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>

  {/* Latency Visualization Chart */}
  <Card className="h-[440px] bg-white border-none rounded-none">
    <CardHeader>
      <CardTitle className="text-lg text-gray-800">Latency Visualization</CardTitle>
    </CardHeader>
    <CardContent className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="requestId" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="nmt" stackId="a" fill="#8884d8" />
          <Bar dataKey="llm" stackId="a" fill="#82ca9d" />
          {customerType === 'customer1' && <Bar dataKey="tts" stackId="a" fill="#ffc658" />}
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</div>
  );
}
