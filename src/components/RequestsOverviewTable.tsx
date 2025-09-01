"use client";
import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// Backend API response structure
export interface ApiRequestsByService {
  NMT: number;
  LLM: number;
  TTS: number;
  backNMT: number;
}

export interface ApiCustomerRequest {
  total: number;
  by_service: ApiRequestsByService;
}

export interface ApiRequestsData {
  total_requests: number;
  requests_by_service: ApiRequestsByService;
  requests_by_customer: Record<string, ApiCustomerRequest>;
}

// Component-friendly interface
export interface RequestsByService {
  nmt: number;
  llm: number;
  tts: number;
  backNmt: number;
}

export interface CustomerRequest {
  totalRequests: number;
  requestsByService: RequestsByService;
}

export interface RequestsData {
  totalRequests: number;
  requestsByService: RequestsByService;
  requestsByCustomer: Record<string, CustomerRequest>;
}

interface RequestsOverviewProps {
  data: RequestsData | null;
}

// Mock data
const mockRequestsData: RequestsData = {
  totalRequests: 12500,
  requestsByService: {
    nmt: 4200,
    llm: 5800,
    tts: 1800,
    backNmt: 700,
  },
  requestsByCustomer: {
    cust1: {
      totalRequests: 7500,
      requestsByService: {
        nmt: 2800,
        llm: 3200,
        tts: 1100,
        backNmt: 400,
      },
    },
    cust2: {
      totalRequests: 5000,
      requestsByService: {
        nmt: 1400,
        llm: 2600,
        tts: 700,
        backNmt: 300,
      },
    },
  },
};

// Transform backend data to component format
const transformApiData = (apiData: ApiRequestsData): RequestsData => ({
  totalRequests: apiData.total_requests,
  requestsByService: {
    nmt: apiData.requests_by_service.NMT,
    llm: apiData.requests_by_service.LLM,
    tts: apiData.requests_by_service.TTS,
    backNmt: apiData.requests_by_service.backNMT,
  },
  requestsByCustomer: Object.fromEntries(
    Object.entries(apiData.requests_by_customer).map(([customer, data]) => [
      customer,
      {
        totalRequests: data.total,
        requestsByService: {
          nmt: data.by_service.NMT,
          llm: data.by_service.LLM,
          tts: data.by_service.TTS,
          backNmt: data.by_service.backNMT,
        },
      },
    ])
  ),
});

const RequestsOverviewTable: React.FC<RequestsOverviewProps> = ({ data }) => {
  // Use mock data if no data provided
  const displayData = data || mockRequestsData;

  // Chart data
  const chartData = Object.entries(displayData.requestsByCustomer || {}).map(
    ([customer, values]) => ({
      name: customer,
      total: values.totalRequests,
      nmt: values.requestsByService.nmt,
      llm: values.requestsByService.llm,
      tts: values.requestsByService.tts,
      backNmt: values.requestsByService.backNmt,
    })
  );

  return (
    <div className="flex-1 bg-white rounded-lg lg:rounded-3xl shadow-sm border border-slate-200 p-2 sm:p-4 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Requests Overview</h2>
      
      <div className="flex flex-col gap-6 h-full">
        {/* Summary Card */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total System Requests: {displayData.totalRequests.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-blue-600">{displayData.requestsByService.nmt.toLocaleString()}</div>
                <div className="text-slate-600">NMT</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600">{displayData.requestsByService.llm.toLocaleString()}</div>
                <div className="text-slate-600">LLM</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-yellow-600">{displayData.requestsByService.tts.toLocaleString()}</div>
                <div className="text-slate-600">TTS</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{displayData.requestsByService.backNmt.toLocaleString()}</div>
                <div className="text-slate-600">BackNMT</div>
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
                <TableHead>Total</TableHead>
                <TableHead>NMT</TableHead>
                <TableHead>LLM</TableHead>
                <TableHead>TTS</TableHead>
                <TableHead>BackNMT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(displayData.requestsByCustomer).map(
                ([customer, values], idx) => (
                  <TableRow key={customer} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                    <TableCell className="font-medium">{customer}</TableCell>
                    <TableCell>{values.totalRequests.toLocaleString()}</TableCell>
                    <TableCell>{values.requestsByService.nmt.toLocaleString()}</TableCell>
                    <TableCell>{values.requestsByService.llm.toLocaleString()}</TableCell>
                    <TableCell>{values.requestsByService.tts.toLocaleString()}</TableCell>
                    <TableCell>{values.requestsByService.backNmt.toLocaleString()}</TableCell>
                  </TableRow>
                )
              )}
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
              <Bar dataKey="nmt" fill="#8884d8" name="NMT" />
              <Bar dataKey="llm" fill="#82ca9d" name="LLM" />
              <Bar dataKey="tts" fill="#ffc658" name="TTS" />
              <Bar dataKey="backNmt" fill="#ff8042" name="BackNMT" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RequestsOverviewTable;