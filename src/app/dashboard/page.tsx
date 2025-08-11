"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, Users, Calendar, AlertCircle } from "lucide-react";
import { clients, accounting } from "@/lib/data";

const currencyFormatter = new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' });
const chartData = accounting.clinics[0].income.by_date.map(item => ({ name: item.date, revenue: item.amount }));

export default function DashboardPage() {
  const monthlyRevenue = accounting.clinics[0].income.by_date.reduce((total, item) => total + item.amount, 0) / accounting.clinics[0].income.by_date.length;
  const pendingPayments = clients.flatMap(c => c.payment_details).filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const pendingClientsCount = new Set(clients.filter(c => c.payment_details.some(p => p.status === 'pending')).map(c => c.client_id)).size;
  
  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">لوحة التحكم</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المرضى</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">+2 منذ الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مواعيد اليوم</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 عن أمس</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencyFormatter.format(monthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">+12.5% عن الشهر الماضي</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المدفوعات المعلقة</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currencyFormatter.format(pendingPayments)}</div>
            <p className="text-xs text-muted-foreground">{pendingClientsCount} عميل برصيد مستحق</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>نظرة عامة على إيرادات العيادة</CardTitle>
            <CardDescription>إيرادات عيادة الشارع الرئيسي في آخر 5 أشهر.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => currencyFormatter.format(value).split(' ')[0]}
                  />
                   <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                    }}
                    formatter={(value: number) => currencyFormatter.format(value)}
                    />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>نشاط المرضى الأخير</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>الإجراء</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.slice(0, 5).flatMap(client => (
                  client.treatment_history.slice(0, 1).map((treatment, index) => (
                    <TableRow key={`${client.client_id}-${index}`}>
                      <TableCell>
                        <div className="font-medium">{client.first_name} {client.last_name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{client.contact_info.email}</div>
                      </TableCell>
                      <TableCell>{treatment.procedure}</TableCell>
                       <TableCell>
                        <Badge variant={client.payment_details.find(p => p.status === 'paid') ? 'default' : 'secondary'} className={client.payment_details.find(p => p.status === 'paid') ? 'bg-primary/20 text-primary-foreground' : ''}>
                          {client.payment_details.find(p => p.status === 'paid') ? 'مدفوع' : 'معلق'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
