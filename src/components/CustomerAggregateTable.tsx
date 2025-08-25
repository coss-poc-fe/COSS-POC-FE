'use client';

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AggregateData {
  customerName: string; 
  customerApp: string;
  langdetectionLatency: number;
  nmtLatency: number;
  llmLatency: number;
  ttsLatency: number;
  overallPipelineLatency: number;
  nmtUsage: number;
  llmUsage: number;
  ttsUsage: number;
}

interface CustomerAggregateProps {
  aggregates?: AggregateData[]; // Optional
}

const mockData: AggregateData[] = [
  {
    customerName: "AcmeCorp",
    customerApp: "mobile",
    langdetectionLatency: 123.45,
    nmtLatency: 456.78,
    llmLatency: 234.56,
    ttsLatency: 345.67,
    overallPipelineLatency: 789.12,
    nmtUsage: 12.34,
    llmUsage: 23.45,
    ttsUsage: 34.56,
  },
  {
    customerName: "AcmeCorp",
    customerApp: "web",
    langdetectionLatency: 111.11,
    nmtLatency: 222.22,
    llmLatency: 333.33,
    ttsLatency: 444.44,
    overallPipelineLatency: 555.55,
    nmtUsage: 10.0,
    llmUsage: 20.0,
    ttsUsage: 30.0,
  },
];

const CustomerAggregateTable: React.FC<CustomerAggregateProps> = ({
  aggregates = mockData,
}) => {
  const [data, setData] = React.useState<AggregateData[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setData(aggregates), 500);
    return () => clearTimeout(timer);
  }, [aggregates]);

  return (
    <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>App</TableHead>
          <TableHead>Lang Detection Latency</TableHead>
          <TableHead>NMT Latency</TableHead>
          <TableHead>LLM Latency</TableHead>
          <TableHead>TTS Latency</TableHead>
          <TableHead>Overall Latency</TableHead>
          <TableHead>NMT Usage</TableHead>
          <TableHead>LLM Usage</TableHead>
          <TableHead>TTS Usage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{row.customerName}</TableCell>
            <TableCell>{row.customerApp}</TableCell>
            <TableCell>{row.langdetectionLatency}ms</TableCell>
            <TableCell>{row.nmtLatency}ms</TableCell>
            <TableCell>{row.llmLatency}ms</TableCell>
            <TableCell>{row.ttsLatency}ms</TableCell>
            <TableCell>{row.overallPipelineLatency}ms</TableCell>
            <TableCell>{row.nmtUsage}</TableCell>
            <TableCell>{row.llmUsage}</TableCell>
            <TableCell>{row.ttsUsage}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CustomerAggregateTable;
