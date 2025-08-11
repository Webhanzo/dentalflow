"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { appointments as initialAppointments, clients, updateAppointment } from "@/lib/data";
import type { Appointment, AppointmentStatus } from "@/lib/data";
import { format, isSameDay } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";


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
  
  const handleStatusChange = (appointmentId: string, status: AppointmentStatus) => {
    const updatedAppointments = updateAppointment(appointmentId, status);
    setAppointments(updatedAppointments);
  };
  
  const getStatusVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  }

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
        case 'scheduled': return 'مجدول';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
    }
  }

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
                                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedDayAppointments.map(appointment => (
                                <TableRow key={appointment.appointment_id}>
                                    <TableCell className="font-mono">{appointment.time}</TableCell>
                                    <TableCell>{getClientName(appointment.client_id)}</TableCell>
                                    <TableCell>{appointment.procedure}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(appointment.status)}>
                                            {getStatusText(appointment.status)}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">فتح القائمة</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleStatusChange(appointment.appointment_id, 'completed')}>
                                                    مكتمل
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(appointment.appointment_id, 'cancelled')}>
                                                    ملغي
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleStatusChange(appointment.appointment_id, 'scheduled')}>
                                                    مجدول
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
