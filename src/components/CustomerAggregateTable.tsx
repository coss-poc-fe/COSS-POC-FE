'use client';

import * as React from "react";
import {
  Table,
  TableBody,
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
  customerName: string; // we'll pass customerName dynamically
}

const CustomerAggregateTable: React.FC<CustomerAggregateProps> = ({ customerName }) => {
  const [data, setData] = React.useState<AggregateData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAggregates = async () => {
      try {
        const res = await fetch("/api/customer_aggregates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ customerName }),
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const result = await res.json();
        setData(result.aggregates || []);
      } catch (err) {
        console.error("Error fetching aggregates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAggregates();
  }, [customerName]);

  if (loading) return <p>Loading...</p>;

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
            <TableCell>{customerName}</TableCell>
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
