
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { accounting as initialAccounting, employees, clients, addIncome, addExpense } from "@/lib/data";
import type { Income, Expense } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currencyFormatter = new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' });

export default function AccountingPage() {
  const [accounting, setAccounting] = useState(initialAccounting);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  
  const [newIncome, setNewIncome] = useState({ source: "", amount: "", date: new Date().toISOString().split('T')[0]});
  const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: new Date().toISOString().split('T')[0]});


  const aggregateFinancials = (clinicId: string) => {
    const clinic = accounting.clinics.find(c => c.clinic_id === clinicId);
    if (!clinic) return { incomeData: [], expenseData: [], totalIncome: 0, totalExpenses: 0, netProfit: 0, chartData: [] };

    const employeeSalaries = employees
      .filter(e => e.clinic_ids.includes(clinicId))
      .reduce((total, e) => total + e.salary, 0);

    const clientPayments = clients.flatMap(c => c.payment_details)
      .filter(p => p.status === 'paid')
      .reduce((total, p) => total + p.amount, 0);

    const monthlyExpenses = clinic.expenses.by_date.map(exp => ({...exp}));
    monthlyExpenses.push({ date: "رواتب الموظفين", amount: employeeSalaries, category: "رواتب" });

    const monthlyIncome = clinic.income.by_date.map(inc => ({...inc}));
    if (monthlyIncome.length > 0) {
        // For simplicity, adding all client payments to the latest month's income.
        const lastMonthIncomeIndex = monthlyIncome.findIndex(inc => inc.source === "مدفوعات العملاء");
        if(lastMonthIncomeIndex > -1){
            monthlyIncome[lastMonthIncomeIndex].amount = clientPayments;
        } else {
             monthlyIncome.push({ date: "مدفوعات العملاء", amount: clientPayments, source: "مدفوعات العملاء" });
        }
    } else {
         monthlyIncome.push({ date: "مدفوعات العملاء", amount: clientPayments, source: "مدفوعات العملاء" });
    }

    const totalExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = monthlyIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const allDates = [...new Set([...clinic.income.by_date.map(i => i.date), ...clinic.expenses.by_date.map(e => e.date)])].sort();
    
    const chartData = allDates.map(date => {
        const incomeForDate = clinic.income.by_date
            .filter(i => i.date === date)
            .reduce((sum, i) => sum + i.amount, 0);
        
        const expenseForDate = clinic.expenses.by_date
            .filter(e => e.date === date)
            .reduce((sum, e) => sum + e.amount, 0);
        
        let totalIncomeForDate = incomeForDate;
        // Distribute client payments and salaries for chart view
        if(date === "مدفوعات العملاء") totalIncomeForDate += clientPayments;
        
        let totalExpenseForDate = expenseForDate;
        if(date === "رواتب الموظفين") totalExpenseForDate += employeeSalaries;
        else if (date.includes("2024")) { // Distribute salary over months for chart
             totalExpenseForDate += (employeeSalaries / allDates.filter(d => d.includes("2024")).length);
        }

        return {
            date: date,
            "الإيرادات": totalIncomeForDate,
            "النفقات": totalExpenseForDate,
        }
    });

    return {
      incomeData: monthlyIncome,
      expenseData: monthlyExpenses,
      totalIncome,
      totalExpenses,
      netProfit,
      chartData,
    }
  }

  const handleAddIncome = (clinicId: string) => {
    if (newIncome.source && newIncome.amount) {
      const incomeToAdd: Income = {
        date: newIncome.date,
        amount: parseFloat(newIncome.amount),
        source: newIncome.source,
      };
      const updatedAccounting = addIncome(clinicId, incomeToAdd);
      setAccounting(updatedAccounting);
      setIsIncomeDialogOpen(false);
      setNewIncome({ source: "", amount: "", date: new Date().toISOString().split('T')[0]});
    }
  }
  
  const handleAddExpense = (clinicId: string) => {
    if (newExpense.category && newExpense.amount) {
      const expenseToAdd: Expense = {
        date: newExpense.date,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
      };
      const updatedAccounting = addExpense(clinicId, expenseToAdd);
      setAccounting(updatedAccounting);
      setIsExpenseDialogOpen(false);
      setNewExpense({ category: "", amount: "", date: new Date().toISOString().split('T')[0]});
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
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
        {accounting.clinics.map(clinic => {
            const { incomeData, expenseData, totalIncome, totalExpenses, netProfit, chartData } = aggregateFinancials(clinic.clinic_id);
            return (
              <TabsContent key={clinic.clinic_id} value={clinic.clinic_id} className="mt-4">
                 <div className="flex gap-2 mb-4">
                    <Dialog open={isIncomeDialogOpen} onOpenChange={setIsIncomeDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <PlusCircle className="ml-2 h-4 w-4" />
                                إضافة إيراد
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>إضافة إيراد جديد</DialogTitle>
                                <DialogDescription>أدخل تفاصيل الإيراد الجديد.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="income-source" className="text-right">المصدر</Label>
                                    <Input id="income-source" value={newIncome.source} onChange={(e) => setNewIncome({...newIncome, source: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="income-amount" className="text-right">المبلغ</Label>
                                    <Input id="income-amount" type="number" value={newIncome.amount} onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="income-date" className="text-right">التاريخ</Label>
                                    <Input id="income-date" type="date" value={newIncome.date} onChange={(e) => setNewIncome({...newIncome, date: e.target.value})} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsIncomeDialogOpen(false)}>إلغاء</Button>
                                <Button onClick={() => handleAddIncome(clinic.clinic_id)}>حفظ</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                     <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="ml-2 h-4 w-4" />
                                إضافة نفقة
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>إضافة نفقة جديدة</DialogTitle>
                                <DialogDescription>أدخل تفاصيل النفقة الجديدة.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="expense-category" className="text-right">الفئة</Label>
                                    <Input id="expense-category" value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="expense-amount" className="text-right">المبلغ</Label>
                                    <Input id="expense-amount" type="number" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="expense-date" className="text-right">التاريخ</Label>
                                    <Input id="expense-date" type="date" value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>إلغاء</Button>
                                <Button onClick={() => handleAddExpense(clinic.clinic_id)}>حفظ</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
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
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => currencyFormatter.format(value).split(' ')[0] + ' د.أ'}/>
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

    