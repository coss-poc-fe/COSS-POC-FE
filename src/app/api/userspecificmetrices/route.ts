export interface CustomerLatency {
  requestid: string;
  customername: string;
  customerapp: string;
  langdetectionlatency: string;
  nmtlatency: string;
  llmlatency: string;
  ttslatency?: string; // Optional for cust2
  overallpipelinelatency: string;
  timestamp: string;
}
 
 
export const fetchCustomerLatency = async (customerType: string): Promise<CustomerLatency[]> => {
  const url = `/api/customers/${customerType}`; // no "proxy"
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch');
  return response.json();
};
 
 