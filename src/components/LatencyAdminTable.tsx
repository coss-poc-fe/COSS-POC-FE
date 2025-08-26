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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Shadcn Select

export interface LatencyData {
  requestId: string;
  customerName: string;
  customerApp: string;
  langdetectionLatency: number;
  nmtLatency: number;
  llmLatency: number;
  ttsLatency: number;
  overallPipelineLatency: number;
  timestamp: string;
}

interface LatencyAdminTableProps {
  data: LatencyData[];
  caption?: string;
}

const msToSec = (val: string | number | null) => {
  if (!val) return 0;
  const num = typeof val === "string" ? parseFloat(val.replace("ms", "")) : val;
  return (num / 1000).toFixed(3); // Keep 3 decimal places
};

export default function LatencyAdminTable({ data, caption }: LatencyAdminTableProps) {
  const [selectedCustomer, setSelectedCustomer] = React.useState<string>("all");

  // Get unique customer names
  const customerNames = React.useMemo(
    () => ["all", ...Array.from(new Set(data.map((d) => d.customerName)))],
    [data]
  );

  // Filter data based on selected customer
  const filteredData =
    selectedCustomer === "all"
      ? data
      : data.filter((row) => row.customerName === selectedCustomer);

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Filter by Customer:</span>
        <Select
          value={selectedCustomer}
          onValueChange={setSelectedCustomer}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customerNames.map((name) => (
              <SelectItem key={name} value={name}>
                {name === "all" ? "All Customers" : name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Request ID</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Lang Detection</TableHead>
            <TableHead>NMT (s)</TableHead>
            <TableHead>LLM (s)</TableHead>
            <TableHead>TTS (s)</TableHead>
            <TableHead className="text-right">Overall Latency (s)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow key={row.requestId}>
              <TableCell className="font-medium">{row.requestId}</TableCell>
              <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
              <TableCell>{row.customerName}</TableCell>
              <TableCell>{msToSec(row.langdetectionLatency)}</TableCell>
              <TableCell>{msToSec(row.nmtLatency)}</TableCell>
              <TableCell>{msToSec(row.llmLatency)}</TableCell>
              <TableCell>{msToSec(row.ttsLatency)}</TableCell>
              <TableCell className="text-right">{msToSec(row.overallPipelineLatency)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
