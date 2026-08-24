import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/image-utils";

type Props = {
  src?: string;
  alt: string;
  /** Wrapper classes — control the aspect/size from the parent. */
  className?: string;
  imgClassName?: string;
  icon?: LucideIcon;
  iconClassName?: string;
};

/** Image with a graceful icon placeholder for missing/broken sources. */
export function EntityImage({ src, alt, className, imgClassName, icon: Icon = ImageOff, iconClassName }: Props) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const resolvedSrc = resolveImageUrl(src);
  const show = !!resolvedSrc && !broken;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {show ? (
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          onError={() => setBroken(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <Icon className={cn("h-1/3 w-1/3 min-h-4 min-w-4", iconClassName)} />
        </div>
      )}
    </div>
  );
}
