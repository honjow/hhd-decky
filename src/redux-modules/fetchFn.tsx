import { fetchNoCors } from "@decky/api";
import { retrieveHhdToken, retrieveHttpPort } from "../backend/utils";

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
    console.log("fetchFn called with url:", url);
    const authHeaders = await getAuthHeaders();
    const port = await getPortNum();

    console.log("Port:", port, "Auth headers:", authHeaders);

    if (!options) {
      options = {
        method: "GET",
      };
    }

    options.headers = options?.headers
      ? { ...options.headers, ...authHeaders }
      : authHeaders;

    const fullUrl = `http://127.0.0.1:${port}/api/v1/${url}`;
    console.log("Making request to:", fullUrl);

    const response = await fetchNoCors(
      fullUrl,
      options
    );

    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("fetchFn error:", error);
    throw error;
  }
};
