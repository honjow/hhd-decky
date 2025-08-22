import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  staticClasses,
  ToggleField,
  Field,
  ButtonItem,
} from "@decky/ui";
import { useEffect, useState, FC } from "react";
import { FaGamepad } from "react-icons/fa";
import {
  registerForAppLifetimeNotifications,
  suspendEventListener,
} from "./steamListeners";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, store } from "./redux-modules/store";
import {
  selectHhdUiVersion,
} from "./redux-modules/hhdSlice";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchIsSteamDeckMode,
} from "./redux-modules/hhdAsyncThunks";
import { HhdState, OtaUpdates, ErrorBoundary } from "./components";
import { log } from "./utils";


const Content: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: any) => state.hhd.loading.settings);
  const error = useSelector((state: any) => state.hhd.error);

  useEffect(() => {
    log("About to dispatch fetchHhdSettings");
    log("fetchHhdSettings:", fetchHhdSettings);
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
    dispatch(fetchIsSteamDeckMode());
  }, []);

  // Show error state
  if (loading === "failed" || error) {
    return (
      <>
        <OneTimeHddOverlayNotification />
        <PanelSection title="Settings Error">
          <Field disabled label="Error">
            {error || "Authentication failed"}
          </Field>
          <PanelSectionRow>
            <ButtonItem
              onClick={() => {
                dispatch(fetchHhdSettings());
                dispatch(fetchHhdSettingsState());
                dispatch(fetchIsSteamDeckMode());
              }}
              layout="below"
              bottomSeparator="none"
            >
              Refresh
            </ButtonItem>
          </PanelSectionRow>
        </PanelSection>
      </>
    );
  }

  return (
    <>
      <OneTimeHddOverlayNotification />
      <HhdState />
    </>
  );
};

const AppContainer: FC = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary title="App">
        <Content />
      </ErrorBoundary>
      <ErrorBoundary title="OTA Updates">
        <OtaUpdates />
      </ErrorBoundary>
    </Provider>
  );
};

const ONE_TIME_NOTIFICATION_KEY = "hhd-decky-ONE_TIME_NOTIFICATION_KEY";

function OneTimeHddOverlayNotification() {
  const hasVersionUi = useSelector(selectHhdUiVersion);
  const [checked, setChecked] = useState(
    window.localStorage.getItem(ONE_TIME_NOTIFICATION_KEY) === "true" || false
  );

  if (!Boolean(hasVersionUi)) {
    return null;
  }

  const onChange = (change: boolean) => {
    window.localStorage.setItem(ONE_TIME_NOTIFICATION_KEY, `${change}`);
    setChecked(change);
  };

  if (checked) {
    return null;
  }

  return (
    <PanelSection>
      <PanelSectionRow>
        <ToggleField
          label={"Notice: New hhd overlay now available!"}
          description={
            "Double tap or hold the QAM/Side Menu button to open the new overlay. Click this toggle to dismiss the notice"
          }
          checked={checked}
          onChange={onChange}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => {

  // fetches data from hhd backend even if React component tree isn't mounted
  store.dispatch(fetchHhdSettings());
  store.dispatch(fetchHhdSettingsState());
  store.dispatch(fetchIsSteamDeckMode());

  // listen to steam for changes, this runs outside of react
  const unregister = registerForAppLifetimeNotifications();
  const unsubscribeToSuspendEvent = suspendEventListener();

  return {
    title: <div className={staticClasses.Title}>Handheld Daemon</div>,
    content: <AppContainer />,
    icon: <FaGamepad />,
    onDismount() {
      unregister();
      if (unsubscribeToSuspendEvent) {
        unsubscribeToSuspendEvent();
      }
    },
  };
});
