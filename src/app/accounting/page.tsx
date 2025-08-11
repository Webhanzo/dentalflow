"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { accounting, employees, clients } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' });

// Aggregate data for a more realistic dashboard
const aggregateFinancials = (clinicId: string) => {
  const clinic = accounting.clinics.find(c => c.clinic_id === clinicId);
  if (!clinic) return { incomeData: [], expenseData: [], totalIncome: 0, totalExpenses: 0, netProfit: 0 };

  const employeeSalaries = employees
    .filter(e => e.clinic_ids.includes(clinicId))
    .reduce((total, e) => total + e.salary, 0);

  const clientPayments = clients.flatMap(c => c.payment_details)
    .filter(p => p.status === 'paid')
    .reduce((total, p) => total + p.amount, 0);

  // For demonstration, we'll merge static data with dynamic data
  // In a real app, this would come entirely from dynamic sources
  const monthlyExpenses = clinic.expenses.by_date.map(exp => ({...exp}));
  monthlyExpenses.push({ date: "رواتب الموظفين", amount: employeeSalaries, category: "رواتب" });

  const monthlyIncome = clinic.income.by_date.map(inc => ({...inc}));
  // Assume client payments are for the last month for chart simplicity
  if (monthlyIncome.length > 0) {
      monthlyIncome[monthlyIncome.length -1].amount += clientPayments;
  }


  const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = monthlyIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const chartData = clinic.income.by_date.map((inc, i) => ({
      date: inc.date,
      "الإيرادات": inc.amount + (i === clinic.income.by_date.length - 1 ? clientPayments : 0),
      "النفقات": (clinic.expenses.by_date[i]?.amount || 0) + (employeeSalaries / clinic.income.by_date.length) // Distribute salary for chart
  }));


  return {
    incomeData: monthlyIncome,
    expenseData: monthlyExpenses,
    totalIncome,
    totalExpenses,
    netProfit,
    chartData,
  }
}

export default function AccountingPage() {

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">نظرة عامة على المحاسبة</h1>
        <div className="flex gap-2">
            <Button variant="outline">
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة إيراد
            </Button>
            <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة نفقة
            </Button>
        </div>
      </div>

      <Tabs defaultValue={accounting.clinics[0].clinic_id} className="w-full">
        <TabsList>
          {accounting.clinics.map(clinic => (
            <TabsTrigger key={clinic.clinic_id} value={clinic.clinic_id}>
              {clinic.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {accounting.clinics.map(clinic => {
            const { incomeData, expenseData, totalIncome, totalExpenses, netProfit, chartData } = aggregateFinancials(clinic.clinic_id);
            return (
              <TabsContent key={clinic.clinic_id} value={clinic.clinic_id} className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>إجمالي الإيرادات</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">{currencyFormatter.format(totalIncome)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>إجمالي النفقات</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-red-600">{currencyFormatter.format(totalExpenses)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>صافي الربح</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{currencyFormatter.format(netProfit)}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-7">
                    <CardHeader>
                      <CardTitle>{clinic.name} - ملخص مالي</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => currencyFormatter.format(value).split(' ')[0] + ' ألف'}/>
                          <Tooltip formatter={(value: number) => currencyFormatter.format(value)} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }} />
                          <Legend />
                          <Line type="monotone" dataKey="الإيرادات" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="النفقات" stroke="hsl(var(--chart-2))" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>تفاصيل الإيرادات</CardTitle>
                      <CardDescription>الإجمالي: {currencyFormatter.format(totalIncome)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>التاريخ/المصدر</TableHead>
                            <TableHead className="text-right">المبلغ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {incomeData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.date || item.source}</TableCell>
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
                      <CardDescription>الإجمالي: {currencyFormatter.format(totalExpenses)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الفئة</TableHead>
                            <TableHead className="text-right">المبلغ</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenseData.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.date || item.category}</TableCell>
                              <TableCell className="text-right">{currencyFormatter.format(item.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                </div>
              </TabsContent>
            )
        })}
      </Tabs>
    </DashboardLayout>
  );
}
