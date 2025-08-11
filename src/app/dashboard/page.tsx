
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, Users, Calendar, AlertCircle } from "lucide-react";
import { getClinics, getDashboardData } from "@/lib/data";
import type { Clinic, Client, Accounting, Appointment } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const currencyFormatter = new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' });

function DashboardTabContent({ clinic }: { clinic: Clinic }) {
  const [data, setData] = useState<{ clients: Client[], accounting?: Accounting, appointments: Appointment[] } | null>(null);

  useEffect(() => {
    const fetchedData = getDashboardData(clinic.clinic_id);
    setData(fetchedData);
  }, [clinic]);

  if (!data || !data.accounting) {
    return <div>جاري التحميل...</div>;
  }

  const { clients, accounting, appointments } = data;

  const monthlyRevenue = accounting.income.by_date.reduce((total, item) => total + item.amount, 0) / (accounting.income.by_date.length || 1);
  const pendingPayments = clients.flatMap(c => c.payment_details).filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const pendingClientsCount = new Set(clients.filter(c => c.payment_details.some(p => p.status === 'pending')).map(c => c.client_id)).size;
  const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length;
  
  const chartData = accounting.income.by_date.map(item => ({ name: item.date, revenue: item.amount }));

  return (
    <div className="space-y-4">
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
            <div className="text-2xl font-bold">{todayAppointments}</div>
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
            <CardDescription>إيرادات {clinic.name} في آخر 5 أشهر.</CardDescription>
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
    </div>
  )
}

export default function DashboardPage() {
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
        <div>لا توجد عيادات. يرجى إضافة عيادة من قسم المحاسبة.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">لوحة التحكم</h1>
      </div>
      <Tabs defaultValue={activeClinic} onValueChange={setActiveClinic} className="w-full">
        <TabsList>
          {clinics.map(clinic => (
            <TabsTrigger key={clinic.clinic_id} value={clinic.clinic_id}>
              {clinic.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {clinics.map(clinic => (
          <TabsContent key={clinic.clinic_id} value={clinic.clinic_id} className="mt-4">
            <DashboardTabContent clinic={clinic} />
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
}
