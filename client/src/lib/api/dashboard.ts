import { api } from "@/lib/api/axios";
import { parseDashboardInsightsResponse } from "@/lib/api/contracts";
import { toApiClientError } from "@/lib/api/errors";

export async function fetchDashboardInsights() {
  try {
    const response = await api.get("/dashboard/insights");
    return parseDashboardInsightsResponse(response.data).insights;
  } catch (error) {
    throw toApiClientError(error, "Unable to load dashboard insights");
  }
}
