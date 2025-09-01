"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Backend API response structure
export interface ApiServiceTotals {
  NMT_chars: number;
  LLM_tokens: number;
  TTS_chars: number;
  backNMT_chars: number;
}

export interface ApiDataProcessed {
  totals: ApiServiceTotals;
  byCustomer: Record<string, ApiServiceTotals>;
}

// Component-friendly interface
export interface ServiceTotals {
  nmt: number;
  llm: number;
  tts: number;
  backNmt: number;
}

export interface DataProcessed {
  totals: ServiceTotals;
  byCustomer: Record<string, ServiceTotals>;
}

interface DataProcessedProps {
  data: DataProcessed | null;
}

// --- Mock Data for fallback ---
const mockData: DataProcessed = {
  totals: {
    nmt: 1500,
    llm: 1200,
    tts: 800,
    backNmt: 400,
  },
  byCustomer: {
    cust1: { nmt: 800, llm: 600, tts: 400, backNmt: 200 },
    cust2: { nmt: 700, llm: 600, tts: 400, backNmt: 200 },
  },
};

const DataProcessedTable: React.FC<DataProcessedProps> = ({ data }) => {
  // Use mock data if no data provided
  const displayData = data || mockData;

  const chartData = Object.entries(displayData.byCustomer).map(([customer, values]) => ({
    name: customer,
    nmt: values.nmt,
    llm: values.llm,
    tts: values.tts,
    backNmt: values.backNmt,
  }));

  return (
    <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Data Processed</h2>
      
      <div className="flex flex-col gap-6 h-full">
        {/* Summary Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Data Processed (chars/tokens)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{displayData.totals.nmt.toLocaleString()}</div>
                <div className="text-slate-600">NMT1 (chars)</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{displayData.totals.llm.toLocaleString()}</div>
                <div className="text-slate-600">LLM (tokens)</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{displayData.totals.backNmt.toLocaleString()}</div>
                <div className="text-slate-600">NMT2 (chars)</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">{displayData.totals.tts.toLocaleString()}</div>
                <div className="text-slate-600">TTS (chars)</div>
              </div>
              
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-muted">
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>NMT1 (chars)</TableHead>
                <TableHead>LLM (tokens)</TableHead>
                <TableHead>NMT2 (chars)</TableHead>
                <TableHead>TTS (chars)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(displayData.byCustomer).map(([customer, values], idx) => (
                <TableRow key={customer} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                  <TableCell className="font-medium">{customer}</TableCell>
                  <TableCell>{values.nmt.toLocaleString()}</TableCell>
                  <TableCell>{values.llm.toLocaleString()}</TableCell>
                  <TableCell>{values.backNmt.toLocaleString()}</TableCell>
                  <TableCell>{values.tts.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Chart */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="nmt" fill="#3b82f6" name="NMT1" />
              <Bar dataKey="llm" fill="#10b981" name="LLM" />
              <Bar dataKey="tts" fill="#f59e0b" name="TTS" />
              <Bar dataKey="backNmt" fill="#ef4444" name="NMT2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataProcessedTable;