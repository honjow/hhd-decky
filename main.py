import os

# The decky plugin module is located at decky-loader/plugin
# For easy intellisense checkout the decky-loader code one directory up
# or add the `decky-loader/plugin` path to `python.analysis.extraPaths` in `.vscode/settings.json`
import decky_plugin
import plugin_settings
import plugin_update
import steam_info
import yaml

PLUGIN_USER = os.environ["DECKY_USER"]
# HHD_TOKEN_PATH = f"/home/{PLUGIN_USER}/.config/hhd/token"
HHD_TOKEN_PATH_LIST = [
    "/tmp/hhd/token",
    "/etc/hhd/token",
    f"/home/{PLUGIN_USER}/.config/hhd/token",
]
# HHD_STATE_PATH = f"/home/{PLUGIN_USER}/.config/hhd/state.yml"
HHD_STATE_PATH_LIST = [
    "/etc/hhd/state.yml",
    f"/home/{PLUGIN_USER}/.config/hhd/state.yml",
]
DEFAULT_PORT = 5335


class Plugin:
    async def _main(self):
        decky_plugin.logger.info("Loading plugin")

    async def _unload(self):
        decky_plugin.logger.info("Unloading plugin")
        pass

    # checks if steam is running as -steamdeck
    async def is_steamdeck_mode(self):
        return steam_info.is_steamdeck_mode()

    async def log_to_backend(self, info):
        decky_plugin.logger.info(info)

    async def retrieve_plugin_version(self):
        return f"{decky_plugin.DECKY_PLUGIN_VERSION}"

    async def retrieve_http_port(self):
        try:
            decky_plugin.logger.info(f"retrieving http_port from {HHD_STATE_PATH_LIST}")

            for path in HHD_STATE_PATH_LIST:
                if os.path.exists(path):
                    hhd_state = open(path, "r").read()
                yaml_object = yaml.safe_load(hhd_state)
                port = yaml_object.get("hhd").get("http").get("port")
                decky_plugin.logger.info(f"http_port {port}")
                if port == "default":
                    return DEFAULT_PORT
                return port or DEFAULT_PORT
            return False
        except Exception as e:
            decky_plugin.logger.error(
                f"failure retrieving hhd state {e}", exc_info=True
            )
            return False

    async def retrieve_hhd_token(self):
        try:
            decky_plugin.logger.debug(f"retrieving token from {HHD_TOKEN_PATH_LIST}")
            for path in HHD_TOKEN_PATH_LIST:
                if os.path.exists(path):
                    decky_plugin.logger.info(f"token path {path}")
                    token = open(path, "r").read()
                    decky_plugin.logger.info(f"token {token}")
                    return token
            return False
        except Exception as e:
            decky_plugin.logger.error(f"failure retrieving token {e}", exc_info=True)
            return False

    async def get_settings(self):
        try:
            return plugin_settings.get_settings()
        except Exception as e:
            decky_plugin.logger.error(f"failure retrieving settings {e}", exc_info=True)
            return False

    async def set_setting(self, name, value):
        try:
            plugin_settings.set_setting(name, value)
            return True
        except Exception as e:
            decky_plugin.logger.error(
                f"failure saving setting {name}={value} {e}", exc_info=True
            )
            return False

    async def ota_update(self):
        # trigger ota update
        try:
            decky_plugin.logger.info("ota update main.py")
            plugin_update.ota_update()
        except Exception as e:
            decky_plugin.logger.error(f"failure ota update {e}", exc_info=True)
