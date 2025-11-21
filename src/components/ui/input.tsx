import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-base text-slate-900 dark:text-white ring-offset-white dark:ring-offset-slate-900 file:border-0 file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white file:text-sm file:font-medium file:px-4 file:py-2 file:rounded file:mr-4 file:cursor-pointer placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
