import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white dark:group-[.toaster]:bg-slate-800 group-[.toaster]:text-slate-900 dark:group-[.toaster]:text-white group-[.toaster]:border-gray-200 dark:group-[.toaster]:border-slate-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-600 dark:group-[.toast]:text-slate-400",
          actionButton: "group-[.toast]:bg-blue-600 group-[.toast]:text-white hover:group-[.toast]:bg-blue-700",
          cancelButton: "group-[.toast]:bg-slate-100 dark:group-[.toast]:bg-slate-700 group-[.toast]:text-slate-900 dark:group-[.toast]:text-slate-100",
          error: "group-[.toast]:!bg-white dark:group-[.toast]:!bg-slate-800 group-[.toast]:!text-slate-900 dark:group-[.toast]:!text-white group-[.toast]:!border-red-200 dark:group-[.toast]:!border-red-900/30",
          success: "group-[.toast]:!bg-white dark:group-[.toast]:!bg-slate-800 group-[.toast]:!text-slate-900 dark:group-[.toast]:!text-white group-[.toast]:!border-green-200 dark:group-[.toast]:!border-green-900/30",
          warning: "group-[.toast]:!bg-white dark:group-[.toast]:!bg-slate-800 group-[.toast]:!text-slate-900 dark:group-[.toast]:!text-white group-[.toast]:!border-orange-200 dark:group-[.toast]:!border-orange-900/30",
          info: "group-[.toast]:!bg-white dark:group-[.toast]:!bg-slate-800 group-[.toast]:!text-slate-900 dark:group-[.toast]:!text-white group-[.toast]:!border-blue-200 dark:group-[.toast]:!border-blue-900/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
