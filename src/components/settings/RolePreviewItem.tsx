import { Users } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import RoleDetailsAccordion from "./RoleDetailsAccordion";

interface RolePreviewItemProps {
  role: CompanyRole;
}

export default function RolePreviewItem({ role }: RolePreviewItemProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value={`role-${role.id}`} className="border-none">
        <AccordionTrigger className="rounded-lg border border-gray-200 bg-gradient-to-r from-indigo-50/50 to-white p-4 transition-all hover:border-indigo-300 hover:no-underline hover:shadow-md data-[state=open]:border-indigo-400 data-[state=open]:shadow-lg">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-indigo-100 p-2">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-right">
                <h4 className="font-semibold text-gray-900 capitalize">
                  {role.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {role.permissions?.length || 0} صلاحية
                </p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-2 pb-4">
          <RoleDetailsAccordion permissions={role.permissions || []} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
