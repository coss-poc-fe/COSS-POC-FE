// lib/api.ts
import { ApiRequestsData, RequestsData } from "@/components/RequestsOverviewTable";
import { ApiDataProcessed, DataProcessed } from "@/components/DataProcessedTable";

/**
 * Fetch requests data from the API
 */
export async function fetchRequestsData(): Promise<RequestsData | null> {
  try {
    const response = await fetch("/api/metrics/requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.status}`);
    }

    const apiData: ApiRequestsData = await response.json();
    
    // Transform API data to component format
    const transformedData: RequestsData = {
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
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching requests data:", error);
    return null;
  }
}

/**
 * Fetch data processed from the API
 */
export async function fetchDataProcessedData(): Promise<DataProcessed | null> {
  try {
    const response = await fetch("/api/metrics/data_processed", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data processed: ${response.status}`);
    }

    const apiData: ApiDataProcessed = await response.json();
    
    // Transform API data to component format
    const transformedData: DataProcessed = {
      totals: {
        nmt: apiData.totals.NMT_chars,
        llm: apiData.totals.LLM_tokens,
        tts: apiData.totals.TTS_chars,
        backNmt: apiData.totals.backNMT_chars,
      },
      byCustomer: Object.fromEntries(
        Object.entries(apiData.byCustomer).map(([customer, data]) => [
          customer,
          {
            nmt: data.NMT_chars,
            llm: data.LLM_tokens,
            tts: data.TTS_chars,
            backNmt: data.backNMT_chars,
          },
        ])
      ),
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching data processed:", error);
    return null;
  }
}

/**
 * Fetch data directly from external API (for testing)
 */
export async function fetchDirectRequestsData(): Promise<RequestsData | null> {
  try {
    const response = await fetch("https://coss-ai4x.vercel.app/metrics/requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch requests: ${response.status}`);
    }

    const apiData: ApiRequestsData = await response.json();
    
    const transformedData: RequestsData = {
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
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching direct requests data:", error);
    return null;
  }
}

/**
 * Fetch data processed directly from external API (for testing)
 */
export async function fetchDirectDataProcessedData(): Promise<DataProcessed | null> {
  try {
    const response = await fetch("https://coss-ai4x.vercel.app/metrics/data_processed", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data processed: ${response.status}`);
    }

    const apiData: ApiDataProcessed = await response.json();
    
    const transformedData: DataProcessed = {
      totals: {
        nmt: apiData.totals.NMT_chars,
        llm: apiData.totals.LLM_tokens,
        tts: apiData.totals.TTS_chars,
        backNmt: apiData.totals.backNMT_chars,
      },
      byCustomer: Object.fromEntries(
        Object.entries(apiData.byCustomer).map(([customer, data]) => [
          customer,
          {
            nmt: data.NMT_chars,
            llm: data.LLM_tokens,
            tts: data.TTS_chars,
            backNmt: data.backNMT_chars,
          },
        ])
      ),
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching direct data processed:", error);
    return null;
  }
}