"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";
import { accounting } from "@/lib/data";

const currencyFormatter = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' });

export default function AccountingPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">نظرة عامة على المحاسبة</h1>
      </div>

      <Tabs defaultValue={accounting.clinics[0].clinic_id} className="w-full">
        <TabsList>
          {accounting.clinics.map(clinic => (
            <TabsTrigger key={clinic.clinic_id} value={clinic.clinic_id}>
              {clinic.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {accounting.clinics.map(clinic => (
          <TabsContent key={clinic.clinic_id} value={clinic.clinic_id} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader>
                  <CardTitle>{clinic.name} - ملخص مالي</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={clinic.income.by_date.map((inc, i) => ({
                        date: inc.date,
                        income: inc.amount,
                        expenses: clinic.expenses.by_date[i]?.amount || 0
                      }))}
                    >
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => currencyFormatter.format(value).slice(0, -3)+' ألف'}/>
                      <Tooltip formatter={(value: number) => currencyFormatter.format(value)} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="income" name="الإيرادات" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="expenses" name="النفقات" stroke="hsl(var(--chart-2))" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>تفاصيل الإيرادات</CardTitle>
                  <CardDescription>الإجمالي: {currencyFormatter.format(clinic.income.total)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>المصدر</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinic.income.by_date.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.source}</TableCell>
                          <TableCell className="text-right">{currencyFormatter.format(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>تفاصيل النفقات</CardTitle>
                  <CardDescription>الإجمالي: {currencyFormatter.format(clinic.expenses.total)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الفئة</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinic.expenses.by_date.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{currencyFormatter.format(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

            </div>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
}
