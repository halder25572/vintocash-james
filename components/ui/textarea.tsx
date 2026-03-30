import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[90px] w-full rounded-lg border-[1.5px] border-input bg-white px-3.5 py-2.5 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:border-brand focus-visible:ring-[3px] focus-visible:ring-brand/10 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
