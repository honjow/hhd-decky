import { VFC } from "react";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
import { PanelSection, ToggleField } from "decky-frontend-lib";
import HhdSlider from "./HhdSlider";
import { get } from "lodash";

interface HhdContainer extends SettingsType {
  renderChild?: any;
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  state: any;
  // e.g. path in settings file to set/get value,
  // such as lodash.get(settings, 'children.gyro')
  fullPath?: string;
}

const HhdContainer: VFC<HhdContainer> = ({
  type,
  title,
  childName,
  hint,
  parentType,
  fullPath,
  children,
  options,
  renderChild,
  depth = 0,
  state,
  default: defaultValue,
}) => {
  const renderChildren = () => {
    if (children)
      return Object.entries(children).map(([childName, child], idx) => {
        return renderChild({
          childName,
          child,
          childOrder: idx,
          depth: depth + 1,
          parentType: type,
          state,
          fullPath: fullPath ? `${fullPath}.${childName}` : `${childName}`,
        });
      });
    return;
  };

  if (depth === 0 && type === "container") {
    // root container type
    return (
      <PanelSection title={title}>
        {renderChild && typeof renderChild === "function" && renderChildren()}
      </PanelSection>
    );
  }
  if (type === "mode" && childName === "xinput") {
    // specially handle xinput child

    return null;
  }

  if (type === "bool") {
    // toggle component
    const checked = get(state, `${fullPath}`, defaultValue);
    return (
      <ToggleField
        label={title}
        checked={Boolean(checked)}
        // noop for now
        onChange={() => {}}
      />
    );
  }

  if (type === "discrete" && options) {
    // slider component
    const value = get(state, `${fullPath}`, defaultValue);

    return <HhdSlider defaultValue={value} options={options} title={title} />;
  }

  if (type === "multiple" && options) {
    // dropdown component
  }

  return null;
};

export const renderChild = ({
  childName,
  child,
  childOrder,
  parentType,
  fullPath,
  state,
  depth,
}: {
  childName: string;
  child: SettingsType;
  parentType: SettingType;
  childOrder: number;
  fullPath: string;
  state: any;
  depth: number;
}) => {
  return (
    <HhdContainer
      key={childOrder}
      childName={childName}
      renderChild={renderChild}
      depth={depth}
      parentType={parentType}
      fullPath={fullPath}
      state={state}
      {...child}
    />
  );
};

export default HhdContainer;
