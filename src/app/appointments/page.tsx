"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { appointments as initialAppointments, clients } from "@/lib/data";
import type { Appointment } from "@/lib/data";
import { format, isSameDay } from "date-fns";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const selectedDayAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), selectedDate)
    ).sort((a,b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.client_id === clientId);
    return client ? `${client.first_name} ${client.last_name}` : "عميل غير معروف";
  };
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">إدارة المواعيد</h1>
          <p className="text-muted-foreground">عرض وإدارة مواعيد العيادة.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
           <Card>
            <CardContent className="p-0">
               <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                dir="rtl"
                modifiers={{
                    hasAppointment: appointments.map(a => new Date(a.date))
                }}
                modifiersStyles={{
                    hasAppointment: {
                        color: 'hsl(var(--primary-foreground))',
                        backgroundColor: 'hsl(var(--primary))'
                    }
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>مواعيد {selectedDate ? format(selectedDate, "PPP") : "اليوم"}</CardTitle>
                    <CardDescription>
                        {selectedDayAppointments.length > 0 
                            ? `لديك ${selectedDayAppointments.length} مواعيد لهذا اليوم.` 
                            : "لا توجد مواعيد مجدولة لهذا اليوم."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الوقت</TableHead>
                                <TableHead>العميل</TableHead>
                                <TableHead>الإجراء</TableHead>
                                <TableHead>الحالة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedDayAppointments.map(appointment => (
                                <TableRow key={appointment.appointment_id}>
                                    <TableCell className="font-mono">{appointment.time}</TableCell>
                                    <TableCell>{getClientName(appointment.client_id)}</TableCell>
                                    <TableCell>{appointment.procedure}</TableCell>
                                    <TableCell>
                                        <Badge variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}>
                                            {appointment.status === 'scheduled' && 'مجدول'}
                                            {appointment.status === 'completed' && 'مكتمل'}
                                            {appointment.status === 'cancelled' && 'ملغي'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
