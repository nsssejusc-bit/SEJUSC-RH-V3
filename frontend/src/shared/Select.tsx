import type React from "react";

type Options = {
  label: string;
  value: string;
};

type SelectProps = React.ComponentProps<"select"> & {
  label?: string;
  optionLabel: string;
  options: Options[];
};

export default function Select({
  id,
  label,
  optionLabel,
  options,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <label
        className="flex flex-col gap-1.5 font-medium text-slate-800"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        className="rounded border-2 border-transparent bg-gray-100 p-1.5 text-lg duration-200 ease-in outline-none focus:border-2 focus:border-sky-900"
        name={id}
        id={id}
        {...props}
      >
        <option value="">{optionLabel}</option>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
