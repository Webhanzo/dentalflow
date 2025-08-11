
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { getAccounting, getEmployees, getClients, addIncome, addExpense, getClinics, addClinic, deleteClinic } from "@/lib/data";
import type { Income, Expense, Clinic, Accounting, Client, Employee } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter as DialogFooterComponent, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currencyFormatter = new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' });

function AccountingTabContent({ clinic }: { clinic: Clinic }) {
    const [accounting, setAccounting] = useState<Accounting | undefined>(undefined);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
    const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
    
    const [newIncome, setNewIncome] = useState({ source: "", amount: "", date: new Date().toISOString().split('T')[0]});
    const [newExpense, setNewExpense] = useState({ category: "", amount: "", date: new Date().toISOString().split('T')[0]});

    useEffect(() => {
        setAccounting(getAccounting(clinic.clinic_id));
        setEmployees(getEmployees(clinic.clinic_id));
        setClients(getClients(clinic.clinic_id));
    }, [clinic]);

    if (!accounting) {
        return <div>جاري تحميل البيانات المالية...</div>;
    }

    const aggregateFinancials = () => {
        const employeeSalaries = employees.reduce((total, e) => total + e.salary, 0);

        const clientPaymentsPaid = clients
            .flatMap(c => c.payment_details)
            .filter(p => p.status === 'paid')
            .reduce((total, p) => total + p.amount, 0);
            
        const clientPaymentsPending = clients
            .flatMap(c => c.payment_details)
            .filter(p => p.status === 'pending')
            .reduce((total, p) => total + p.amount, 0);

        const monthlyExpenses = accounting.expenses.by_date.map(exp => ({...exp}));
        const totalManualExpenses = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        monthlyExpenses.push({ date: "رواتب الموظفين", amount: employeeSalaries, category: "رواتب" });

        const monthlyIncome = accounting.income.by_date.map(inc => ({...inc}));
        let totalManualIncome = monthlyIncome.reduce((sum, inc) => sum + inc.amount, 0);
        
        const clientPaymentIncomeIndex = monthlyIncome.findIndex(inc => inc.source === "مدفوعات العملاء");
        if(clientPaymentIncomeIndex > -1) {
            monthlyIncome[clientPaymentIncomeIndex].amount = clientPaymentsPaid;
            totalManualIncome = monthlyIncome.filter(inc => inc.source !== "مدفوعات العملاء").reduce((sum, inc) => sum + inc.amount, 0);
        } else {
            monthlyIncome.push({ date: "مدفوعات العملاء", amount: clientPaymentsPaid, source: "مدفوعات العملاء" });
        }

        const totalExpenses = totalManualExpenses + employeeSalaries;
        const totalIncome = totalManualIncome + clientPaymentsPaid;
        const netProfit = totalIncome - totalExpenses;

        const allDates = [...new Set([...accounting.income.by_date.map(i => i.date), ...accounting.expenses.by_date.map(e => e.date)])].sort();
        
        const chartData = allDates.map(date => {
            const incomeForDate = accounting.income.by_date
                .filter(i => i.date === date)
                .reduce((sum, i) => sum + i.amount, 0);
            
            const expenseForDate = accounting.expenses.by_date
                .filter(e => e.date === date)
                .reduce((sum, e) => sum + e.amount, 0);
            
            return {
                date: date,
                "الإيرادات": incomeForDate,
                "النفقات": expenseForDate,
            }
        });

        const cashFlowFromOperations = netProfit; 
        const cashFlow = {
            fromOperations: cashFlowFromOperations,
            netChangeInCash: cashFlowFromOperations, 
        };

        const assets = {
            cash: accounting.financials.assets.cash + cashFlow.netChangeInCash,
            accounts_receivable: clientPaymentsPending,
            equipment: accounting.financials.assets.equipment,
        }
        const totalAssets = assets.cash + assets.accounts_receivable + assets.equipment;

        const liabilities = {
            accounts_payable: accounting.financials.liabilities.accounts_payable,
        };
        const totalLiabilities = liabilities.accounts_payable;
        
        const equity = {
        owner_investment: accounting.financials.equity.owner_investment,
        retained_earnings: netProfit,
        }
        const totalEquity = equity.owner_investment + equity.retained_earnings;

        const balanceSheet = {
            assets,
            liabilities,
            equity,
            totalAssets,
            totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
        }

        return {
        incomeData: monthlyIncome,
        expenseData: monthlyExpenses,
        totalIncome,
        totalExpenses,
        netProfit,
        chartData,
        cashFlow,
        balanceSheet,
        }
    }

    const handleAddIncome = () => {
        if (newIncome.source && newIncome.amount) {
            const incomeToAdd: Income = {
                date: newIncome.date,
                amount: parseFloat(newIncome.amount),
                source: newIncome.source,
            };
            const updatedAccounting = addIncome(clinic.clinic_id, incomeToAdd);
            setAccounting(updatedAccounting);
            setIsIncomeDialogOpen(false);
            setNewIncome({ source: "", amount: "", date: new Date().toISOString().split('T')[0]});
        }
    }
    
    const handleAddExpense = () => {
        if (newExpense.category && newExpense.amount) {
            const expenseToAdd: Expense = {
                date: newExpense.date,
                amount: parseFloat(newExpense.amount),
                category: newExpense.category,
            };
            const updatedAccounting = addExpense(clinic.clinic_id, expenseToAdd);
            setAccounting(updatedAccounting);
            setIsExpenseDialogOpen(false);
            setNewExpense({ category: "", amount: "", date: new Date().toISOString().split('T')[0]});
        }
    }

    const { incomeData, expenseData, totalIncome, totalExpenses, netProfit, chartData, cashFlow, balanceSheet } = aggregateFinancials();
    
    return (
        <div className="mt-4">
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
                        <DialogFooterComponent>
                            <Button variant="outline" onClick={() => setIsIncomeDialogOpen(false)}>إلغاء</Button>
                            <Button onClick={handleAddIncome}>حفظ</Button>
                        </DialogFooterComponent>
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
                        <DialogFooterComponent>
                            <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>إلغاء</Button>
                            <Button onClick={handleAddExpense}>حفظ</Button>
                        </DialogFooterComponent>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader><CardTitle>إجمالي الإيرادات</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold text-green-600">{currencyFormatter.format(totalIncome)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>إجمالي النفقات</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold text-red-600">{currencyFormatter.format(totalExpenses)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>صافي الربح</CardTitle></CardHeader>
                    <CardContent><p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{currencyFormatter.format(netProfit)}</p></CardContent>
                </Card>
            </div>
             <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-7">
                    <CardHeader><CardTitle>{clinic.name} - ملخص مالي</CardTitle></CardHeader>
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
                            <TableHeader><TableRow><TableHead>التاريخ/المصدر</TableHead><TableHead className="text-right">المبلغ</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {incomeData.map((item, index) => (
                                    <TableRow key={index}><TableCell>{item.date || item.source}</TableCell><TableCell className="text-right">{currencyFormatter.format(item.amount)}</TableCell></TableRow>
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
                            <TableHeader><TableRow><TableHead>الفئة</TableHead><TableHead className="text-right">المبلغ</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {expenseData.map((item, index) => (
                                    <TableRow key={index}><TableCell>{item.date || item.category}</TableCell><TableCell className="text-right">{currencyFormatter.format(item.amount)}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>قائمة التدفق النقدي</CardTitle>
                        <CardDescription>ملخص التدفقات النقدية الداخلة والخارجة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell>صافي الربح</TableCell><TableCell className="text-right">{currencyFormatter.format(netProfit)}</TableCell></TableRow>
                                <TableRow><TableCell>التدفق النقدي من الأنشطة التشغيلية</TableCell><TableCell className="text-right">{currencyFormatter.format(cashFlow.fromOperations)}</TableCell></TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow className="font-bold"><TableHead>صافي التغير في النقد</TableHead><TableHead className="text-right">{currencyFormatter.format(cashFlow.netChangeInCash)}</TableHead></TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>قائمة المركز المالي</CardTitle>
                        <CardDescription>لمحة عن أصول الشركة وخصومها وحقوق الملكية</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h4 className="font-semibold mb-2">الأصول</h4>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell>النقد</TableCell><TableCell className="text-right">{currencyFormatter.format(balanceSheet.assets.cash)}</TableCell></TableRow>
                                <TableRow><TableCell>حسابات القبض (العملاء)</TableCell><TableCell className="text-right">{currencyFormatter.format(balanceSheet.assets.accounts_receivable)}</TableCell></TableRow>
                                <TableRow><TableCell>المعدات</TableCell><TableCell className="text-right">{currencyFormatter.format(balanceSheet.assets.equipment)}</TableCell></TableRow>
                            </TableBody>
                            <TableFooter><TableRow className="font-bold"><TableHead>مجموع الأصول</TableHead><TableHead className="text-right">{currencyFormatter.format(balanceSheet.totalAssets)}</TableHead></TableRow></TableFooter>
                        </Table>
                        <h4 className="font-semibold mt-4 mb-2">الخصوم وحقوق الملكية</h4>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell>حسابات الدفع (الموردون)</TableCell><TableCell className="text-right">{currencyFormatter.format(balanceSheet.liabilities.accounts_payable)}</TableCell></TableRow>
                                <TableRow><TableCell>استثمار المالك</TableCell><TableCell className="text-right">{currencyFormatter.format(balanceSheet.equity.owner_investment)}</TableCell></TableRow>
                                <TableRow><TableCell>الأرباح المحتجزة</TableCell><TableCell className="text-right">{currencyFormatter.format(balanceSheet.equity.retained_earnings)}</TableCell></TableRow>
                            </TableBody>
                            <TableFooter><TableRow className="font-bold"><TableHead>مجموع الخصوم وحقوق الملكية</TableHead><TableHead className="text-right">{currencyFormatter.format(balanceSheet.totalLiabilitiesAndEquity)}</TableHead></TableRow></TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function AccountingPage() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [activeClinic, setActiveClinic] = useState<string>('');
    
    useEffect(() => {
        const allClinics = getClinics();
        setClinics(allClinics);
        if (allClinics.length > 0) {
            setActiveClinic(allClinics[0].clinic_id);
        }
    }, []);

    if (clinics.length === 0) {
        return (
          <DashboardLayout>
            <div className="text-center">
                <h2 className="text-2xl font-bold">لا توجد عيادات</h2>
                <p className="text-muted-foreground">ابدأ بإضافة عيادتك الأولى من لوحة التحكم.</p>
            </div>
          </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">نظرة عامة على المحاسبة</h1>
            </div>

            <Tabs defaultValue={activeClinic} onValueChange={setActiveClinic} value={activeClinic} className="w-full">
                <TabsList>
                    {clinics.map(clinic => (
                        <TabsTrigger key={clinic.clinic_id} value={clinic.clinic_id}>
                            {clinic.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {clinics.map(clinic => (
                    <TabsContent key={clinic.clinic_id} value={clinic.clinic_id}>
                        <AccountingTabContent clinic={clinic} />
                    </TabsContent>
                ))}
            </Tabs>
        </DashboardLayout>
    );
}

