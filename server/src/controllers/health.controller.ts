import type { Request, Response } from "express";

export function getHealth(_request: Request, response: Response) {
  response.status(200).json({
    status: "ok",
    service: "Peblo AI Notes Workspace API",
    timestamp: new Date().toISOString(),
  });
}
