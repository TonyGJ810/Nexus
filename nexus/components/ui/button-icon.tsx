import { Button } from "./button";
import { cn } from "@/lib/utils";

export function ButtonIcon({
  size = "default",
  className,
  ...props
}: React.ComponentProps<typeof Button> & { size?: "default" | "sm" }) {
  return (
    <Button
      className={cn(size === "sm" && "h-8 w-8 p-0", className)}
      {...props}
    />
  );
}
