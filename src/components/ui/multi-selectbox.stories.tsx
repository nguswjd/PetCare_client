import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MultiSelectBox } from "./multi-selectbox";

const meta: Meta<typeof MultiSelectBox> = {
  title: "UI/MultiSelectBox",
  component: MultiSelectBox,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: { control: "boolean" },
    selectedValues: { control: "object" },
  },
  args: {
    placeholder: "품종을 선택하세요",
    label: "품종",
    options: [
      { value: "option1", label: "옵션 1" },
      { value: "option2", label: "옵션 2" },
      { value: "option3", label: "옵션 3" },
      { value: "option4", label: "옵션 4" },
    ],
    selectedValues: [],
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const RenderWithState = (args: any) => {
  const [selected, setSelected] = useState<string[]>(args.selectedValues || []);

  useEffect(() => {
    setSelected(args.selectedValues || []);
  }, [args.selectedValues]);

  const handleToggle = (value: string) => {
    const newValues = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    setSelected(newValues);
  };

  return (
    <div className="w-[300px]">
      <MultiSelectBox
        {...args}
        selectedValues={selected}
        onChange={handleToggle}
      />
    </div>
  );
};

export const Primary: Story = {
  render: RenderWithState,
};
