import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const Invoice = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto w-full">
        <Card className="border bg-white shadow-sm">
          {/* Header */}
          <CardHeader className="pb-2 text-center">
            <CardTitle className="text-xl font-semibold">
              Purchase Invoice
            </CardTitle>
            <p className="text-muted-foreground text-sm">فاتورة شراء</p>
          </CardHeader>

          <Separator />

          {/* Top Grid Info */}
          <CardContent className="mt-4 space-y-8">
            <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-4">
              {[
                { en: "Date", ar: "التاريخ", value: "25/02/2025" },
                { en: "Inv. No.", ar: "رقم الفاتورة", value: "NC996" },
                { en: "ID", ar: "الرقم التسلسلي", value: "2325" },
                {
                  en: "Supplier",
                  ar: "المورد",
                  value: "شركة عقيلة الطبية بالصحة",
                },
                {
                  en: "Supplier VAT No.",
                  ar: "الرقم الضريبي للمورد",
                  value: "3100775900003",
                },
                {
                  en: "Store",
                  ar: "الصيدلية",
                  value: "Hayaty Care 2 Pharmacy",
                },
                { en: "User", ar: "المستخدم", value: "عمر حمدان" },
                {
                  en: "Note",
                  ar: "ملاحظات",
                  value:
                    "لم يتم استلام صنف بقيمة 825 ريال كترجيع، لم يتم إبلاغ الصيدلية من قبل المندوب حسين",
                },
              ].map((item) => (
                <div
                  key={item.en}
                  className="flex flex-col items-center justify-center rounded-md border bg-gray-50 py-3"
                >
                  <span className="text-xs text-gray-500">{item.en}</span>
                  <span className="text-xs text-gray-500">{item.ar}</span>
                  <span className="mt-1 text-center text-sm font-medium text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    {[
                      { en: "Code", ar: "الكود" },
                      { en: "Item Name", ar: "اسم الصنف" },
                      { en: "Exp. Date", ar: "تاريخ الانتهاء" },
                      { en: "Price", ar: "السعر" },
                      { en: "Qty.", ar: "الكمية" },
                      { en: "Free Qty", ar: "كمية مجانية" },
                      { en: "Total", ar: "الإجمالي" },
                      { en: "Discount #1", ar: "خصم 1" },
                      { en: "Discount #2", ar: "خصم 2" },
                      { en: "Net", ar: "الصافي" },
                      { en: "VAT", ar: "الضريبة" },
                      { en: "Net + VAT", ar: "الصافي + الضريبة" },
                    ].map((h) => (
                      <TableHead
                        key={h.en}
                        className="text-center text-xs font-semibold"
                      >
                        <div className="flex flex-col items-center">
                          <span>{h.en}</span>
                          <span className="font-normal text-gray-500">
                            {h.ar}
                          </span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                <TableBody className="text-sm">
                  <TableRow className="text-center">
                    <TableCell>M1892</TableCell>
                    <TableCell>MOTOVA PLUS #30 TAB</TableCell>
                    <TableCell>30/01/2026</TableCell>
                    <TableCell>265.00</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>5300.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>4609.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>4609.00</TableCell>
                  </TableRow>

                  <TableRow className="text-center">
                    <TableCell>Med54</TableCell>
                    <TableCell>
                      MOTOVA C ADVANCE FEMALE FORMULA #30 SACHET
                    </TableCell>
                    <TableCell>30/05/2027</TableCell>
                    <TableCell>300.00</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>5.00</TableCell>
                    <TableCell>6000.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>5217.50</TableCell>
                    <TableCell>782.63</TableCell>
                    <TableCell>6000.13</TableCell>
                  </TableRow>

                  {/* Totals Row */}
                  <TableRow className="bg-gray-50 text-center font-semibold">
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell>40</TableCell>
                    <TableCell>5.00</TableCell>
                    <TableCell>11300.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>0.00</TableCell>
                    <TableCell>9826.50</TableCell>
                    <TableCell>782.63</TableCell>
                    <TableCell>10609.13</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Invoice;
