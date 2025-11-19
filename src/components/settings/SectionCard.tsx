import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

interface SectionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary";
    className?: string;
  };
  children: ReactNode;
}

export default function SectionCard({
  title,
  description,
  icon: Icon,
  gradientFrom,
  gradientTo,
  badge,
  children,
}: SectionCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardHeader
        className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} pb-12 text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <p
                className={`text-sm ${
                  gradientFrom.includes("blue")
                    ? "text-blue-100"
                    : "text-indigo-100"
                }`}
              >
                {description}
              </p>
            </div>
          </div>
          {badge && (
            <Badge
              variant={badge.variant || "secondary"}
              className={
                badge.className || "bg-white/20 text-white backdrop-blur-sm"
              }
            >
              {badge.text}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
