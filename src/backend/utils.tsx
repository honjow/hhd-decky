import { callable } from "@decky/api";
import { Router } from "@decky/ui";

// log_to_backend
export const logToBackend = callable<[string], void>("log_to_backend");

// ota_update
export const otaUpdate = callable<[], void>("ota_update");

// is_steamdeck_mode
export const isSteamDeckMode = callable<[], boolean>("is_steamdeck_mode");

// retrieve_plugin_version
export const retrievePluginVersion = callable<[], string>("retrieve_plugin_version");


// get_hhd_settings
export const getHhdSettings = callable<[], any>("get_hhd_settings");

// get_hhd_settings_state
export const getHhdSettingsState = callable<[], any>("get_hhd_settings_state");

// retrieve_http_port
export const retrieveHttpPort = callable<[], number>("retrieve_http_port");

// retrieve_hhd_token
export const retrieveHhdToken = callable<[], string>("retrieve_hhd_token");



export const getLogInfo = () => (info: any) => {
  if (typeof info !== "string") {
    info = JSON.stringify(info);
  }
  logToBackend(info);
};

export const extractCurrentGameDisplayName = () =>
  `${Router.MainRunningApp?.display_name || "default"}`;

export const extractCurrentGameId = () =>
  `${Router.MainRunningApp?.appid || "default"}`;

export const extractCurrentGameInfo = () => {
  const displayName = extractCurrentGameDisplayName();
  const currentGameId = extractCurrentGameId();

  return { displayName, currentGameId };
};

