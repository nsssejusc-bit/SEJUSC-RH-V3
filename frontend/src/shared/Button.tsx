type ButtonProps = React.ComponentProps<"button">;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="cursor-pointer rounded-lg bg-sky-900 px-10 py-2 font-bold tracking-wider text-slate-100 uppercase duration-200 ease-in hover:bg-sky-950"
      {...props}
    >
      {children}
    </button>
  );
}
