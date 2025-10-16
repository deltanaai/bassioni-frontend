import { RequestError } from "../http-errors";
import logger from "../logger";
import { getAuthToken } from "../token";

interface FetchOptions extends RequestInit {
  timeout?: number; // in milliseconds
  auth?: boolean; // whether to include auth token or not
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 10000,
    headers: customHeaders = {},
    auth = false,
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const token = auth ? await getAuthToken() : null;
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      // throw new RequestError(
      //   response.status,
      //   `HTTP error! status: ${(await response.json()).message}`
      // );
      return {
        success: false,
        error: (await response.json()).message || "An error occurred",
      };
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknown error");
    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out after ${timeout}ms`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    clearTimeout(id);

    if (err instanceof RequestError) throw err;
    if ((err as Error).name === "AbortError") {
      throw new RequestError(408, "Request timed out");
    }

    throw new RequestError(
      500,
      (err as Error).message || "Unknown network error"
    );
  }
}
