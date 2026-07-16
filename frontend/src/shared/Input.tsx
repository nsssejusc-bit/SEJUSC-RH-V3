type InputProps = Omit<React.ComponentProps<"input">, "id" | "name"> & {
  id: string;
  label?: string;
};

export default function Input({ id, label, ...props }: InputProps) {
  return (
    <div>
      <label className="flex flex-col gap-1.5 font-medium text-slate-800">
        {label}
        <input
          type="text"
          id={id}
          name={id}
          className="rounded border-2 border-transparent bg-gray-100 p-1.5 text-lg duration-200 ease-in outline-none focus:border-2 focus:border-sky-900"
          {...props}
        />
      </label>
    </div>
  );
}
