import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchFnResponseOptions, fetchFn } from "./fetchFn";
import { set } from "lodash";
import { isSteamDeckMode, retrievePluginVersion } from "../backend/utils";
import { fetchNoCors } from "@decky/api";

export const fetchHhdSettings = createAsyncThunk(
  "hhd/fetchHhdSettings",
  async () => {
    console.log("fetchHhdSettings thunk started");
    try {
      console.log("Attempting to fetch settings...");
      const result = await fetchFn("settings");
      console.log("fetchFn result:", result);

      //@ts-ignore
      const body = result.body as string;
      if (body && typeof body === "string") {
        return JSON.parse(body);
      }

      return body;
    } catch (error) {
      console.error("fetchHhdSettings error:", error);
      throw error;
    }
  }
);

export const fetchHhdSettingsState = createAsyncThunk(
  "hhd/fetchHhdSettingsState",
  async () => {
    const result = await fetchFn("state");
    //@ts-ignore
    const body = result.body as string;
    if (body && typeof body === "string") {
      return JSON.parse(body);
    }

    return body;
  }
);

export const updateHhdState = createAsyncThunk(
  "hhd/updateHhdState",
  async ({ path, value }: { path: string; value: any }) => {
    const postBody = set({}, path, value);

    const options: FetchFnResponseOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    };
    const result = await fetchFn("state", options);

    //@ts-ignore
    const body = result.body as string;
    if (body && typeof body === "string") {
      return JSON.parse(body);
    }

    return body;
  }
);

export const fetchIsSteamDeckMode = createAsyncThunk(
  "hhd/is_steamdeck_mode",
  async () => {
    return await isSteamDeckMode() || false;
  }
);

export const fetchDeckyPluginVersion = createAsyncThunk(
  "hhd/retrieve_plugin_version",
  async () => {
    return retrievePluginVersion() || "";
  }
);

export const fetchLatestPluginVersion = createAsyncThunk(
  "hhd/retrieve_latest_plugin_version",
  async () => {

    const result = await fetchNoCors(
      'https://raw.githubusercontent.com/honjow/hhd-decky/main/package.json',
      { method: 'GET' }
    );

    if (result.status === 200) {
      const bodyJson = await result.json();
      console.log(">>>>>>> bodyJson:", bodyJson);
      return bodyJson["version"];
    }
    return "";
  }
);
