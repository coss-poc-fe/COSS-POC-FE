"use client";

import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";


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
  data: RequestsData;
}

const RequestsOverviewTable: React.FC<RequestsOverviewProps> = ({ data }) => {
  if (!data) return <p>No data available</p>;

  // Chart data
  const chartData = Object.entries(data.requestsByCustomer || {}).map(
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
    <div className="flex flex-col w-full h-screen p-4 gap-6">
      <Card className="shadow-lg rounded-2xl flex flex-col h-full">
        <CardHeader>
          <CardTitle>Requests Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Table */}
          <div className="overflow-auto flex-1 border rounded-md">
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
                {Object.entries(data.requestsByCustomer).map(
                  ([customer, values], idx) => (
                    <TableRow key={customer} className={idx % 2 === 0 ? "bg-muted/30" : ""}>
                      <TableCell>{customer}</TableCell>
                      <TableCell>{values.totalRequests}</TableCell>
                      <TableCell>{values.requestsByService.nmt}</TableCell>
                      <TableCell>{values.requestsByService.llm}</TableCell>
                      <TableCell>{values.requestsByService.tts}</TableCell>
                      <TableCell>{values.requestsByService.backNmt}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestsOverviewTable;
