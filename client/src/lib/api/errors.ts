import { isAxiosError } from "axios";

type ErrorResponsePayload = {
  message?: string;
  error?: {
    message?: string;
  };
};

export class ApiClientError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
  }
}

export function getApiErrorMessage(error: unknown, fallbackMessage = "Request failed") {
  if (isAxiosError<ErrorResponsePayload>(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message ||
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function toApiClientError(error: unknown, fallbackMessage = "Request failed") {
  if (error instanceof ApiClientError) {
    return error;
  }

  if (isAxiosError<ErrorResponsePayload>(error)) {
    return new ApiClientError(
      getApiErrorMessage(error, fallbackMessage),
      error.response?.status,
    );
  }

  return new ApiClientError(getApiErrorMessage(error, fallbackMessage));
}
