import type { Request, Response } from "express";
import { getDashboardInsights } from "../services/dashboard.service";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";

function requireUserId(request: Request) {
  const userId = request.user?._id;

  if (!userId) {
    throw new ApiError(401, "Authentication required");
  }

  return String(userId);
}

export const getDashboardInsightsHandler = asyncHandler(
  async (request: Request, response: Response) => {
    const userId = requireUserId(request);
    const insights = await getDashboardInsights(userId);

    response.status(200).json({
      status: "success",
      insights,
    });
  },
);
