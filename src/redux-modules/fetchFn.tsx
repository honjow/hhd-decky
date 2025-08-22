import { fetchNoCors } from "@decky/api";
import { retrieveHhdToken, retrieveHttpPort } from "../backend/utils";
import { log, error } from "../utils";

const getPortNum = async () => {
  return await retrieveHttpPort() || 5335;
};

const getAuthHeaders = async () => {

  const headers: { [key: string]: string } = {};
  const authResult = await retrieveHhdToken();
  if (authResult) {
    // Trim whitespace from token
    const cleanToken = String(authResult).trim();
    const token = `Bearer ${cleanToken}`;
    headers["Authorization"] = token;
  }
  return headers;
};

export type FetchFnResponseOptions = {
  method: "GET" | "POST";
  headers?: { [key: string]: string };
  body?: any;
};

export const fetchFn = async (
  url: string,
  options?: FetchFnResponseOptions
) => {
  try {
    log("fetchFn called with url:", url);
    const authHeaders = await getAuthHeaders();
    const port = await getPortNum();

    log("Port:", port, "Auth headers:", authHeaders);

    if (!options) {
      options = {
        method: "GET",
      };
    }

    options.headers = options?.headers
      ? { ...options.headers, ...authHeaders }
      : authHeaders;

    const fullUrl = `http://127.0.0.1:${port}/api/v1/${url}`;
    log("Making request to:", fullUrl);

    const response = await fetchNoCors(
      fullUrl,
      options
    );

    if (response.status === 200) {
      const bodyJson = await response.json();
      log(">>>>>>> bodyJson:", bodyJson);
      return bodyJson;
    }
    return `Error: fetchFn ${url} failed with status ${response.status}`;

  } catch (e) {
    error("fetchFn error:", e);
    throw error;
  }
};
