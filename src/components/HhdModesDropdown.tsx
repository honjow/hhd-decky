import { DropdownItem } from "decky-frontend-lib";
import { FC } from "react";

type DropdownProps = {
  modes: { [value: string]: any };
  defaultValue: string;
  selectedValue: string;
  title: string;
  depth: number;
  state: any;
  statePath: string;
  hint?: string;
  renderChild: any;
};

const HhdModesDropdown: FC<DropdownProps> = ({
  modes,
  defaultValue,
  selectedValue,
  title,
  hint,
  depth,
  state,
  statePath,
  renderChild,
}) => {
  const dropdownOptions = Object.entries(modes).map(([value, { title }]) => {
    return {
      data: value,
      label: title,
      value,
    };
  });

  const currentMode = modes[selectedValue];
  const { type } = currentMode;

  const children = Object.entries(currentMode.children);

  return (
    <>
      <DropdownItem
        label={title}
        description={hint}
        rgOptions={dropdownOptions.map((o) => {
          return {
            data: o.data,
            label: o.label,
            value: o.value,
          };
        })}
        selectedOption={
          dropdownOptions.find((o) => {
            return o.data === selectedValue;
          })?.data || defaultValue
        }
        onChange={
          () => {}
          //     ({ data: seconds }) => {
          //     setPollRate(seconds * 1000);
          //   }
        }
      />
      {children &&
        children.length > 0 &&
        children.map(([childName, child], idx) => {
          return renderChild({
            childName,
            child,
            childOrder: idx,
            depth: depth + 1,
            parentType: type,
            state,
            statePath: `${statePath}.${selectedValue}.${childName}`,
          });
        })}
    </>
  );
};

export default HhdModesDropdown;
