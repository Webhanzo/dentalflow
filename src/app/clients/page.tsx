
"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Edit, Save, X, Plus, CalendarPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { clients as initialClients, addClient, updateClient, appointments, addAppointment } from "@/lib/data";
import type { Appointment } from "@/lib/data";

type Client = typeof initialClients[0];
type Treatment = Client['treatment_history'][0];
type Payment = Client['payment_details'][0];

function BookAppointmentDialog({ client, open, onOpenChange, onAppointmentBooked }: { client: Client | null; open: boolean; onOpenChange: (open: boolean) => void; onAppointmentBooked: (app: Appointment) => void}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [procedure, setProcedure] = useState("");

  if (!client) return null;

  const handleBookAppointment = () => {
    if (date && time && procedure) {
        const newAppointment: Appointment = {
            appointment_id: `APP${String(Date.now()).slice(-4)}`,
            client_id: client.client_id,
            dentist_id: 'EMP001', // Placeholder
            date: format(date, 'yyyy-MM-dd'),
            time,
            procedure,
            status: 'scheduled',
        };
        onAppointmentBooked(newAppointment);
        onOpenChange(false);
        // Reset form
        setDate(new Date());
        setTime("");
        setProcedure("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>حجز موعد لـ {client.first_name}</DialogTitle>
                <DialogDescription>
                    اختر التاريخ والوقت والإجراء المطلوب.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">التاريخ</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className="col-span-3 justify-start text-left font-normal"
                            >
                            {date ? format(date, "PPP") : <span>اختر تاريخًا</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">الوقت</Label>
                    <Input id="time" type="time" className="col-span-3" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="procedure" className="text-right">الإجراء</Label>
                    <Input id="procedure" className="col-span-3" value={procedure} onChange={e => setProcedure(e.target.value)} placeholder="مثال: فحص دوري" />
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
                <Button onClick={handleBookAppointment}>تأكيد الحجز</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

function ClientProfileDialog({ client, open, onOpenChange, onClientUpdate, onBookAppointment }: { client: Client | null; open: boolean; onOpenChange: (open: boolean) => void; onClientUpdate: (client: Client) => void; onBookAppointment: () => void; }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableClient, setEditableClient] = useState<Client | null>(null);

  useEffect(() => {
    setEditableClient(client ? JSON.parse(JSON.stringify(client)) : null);
    setIsEditing(false);
  }, [client]);

  if (!client || !editableClient) return null;

  const handleInputChange = (field: string, value: any) => {
    setEditableClient(prev => {
      if (!prev) return null;
      const keys = field.split('.');
      if (keys.length > 1) {
        let nested = { ...prev } as any;
        keys.slice(0, -1).forEach(key => {
          nested = nested[key];
        });
        nested[keys[keys.length - 1]] = value;
        return { ...prev };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleTreatmentChange = (index: number, field: keyof Treatment, value: string) => {
    setEditableClient(prev => {
      if (!prev) return null;
      const newHistory = [...prev.treatment_history];
      newHistory[index] = { ...newHistory[index], [field]: value };
      return { ...prev, treatment_history: newHistory };
    });
  };
  
  const handlePaymentChange = (index: number, field: keyof Payment, value: string | number) => {
    setEditableClient(prev => {
      if (!prev) return null;
      const newPayments = [...prev.payment_details];
      newPayments[index] = { ...newPayments[index], [field]: value };
      return { ...prev, payment_details: newPayments };
    });
  };

  const addTreatmentRow = () => {
    setEditableClient(prev => {
      if (!prev) return null;
      const newHistory: Treatment = { date: new Date().toISOString().split('T')[0], procedure: '', dentist_id: '', notes: ''};
      return { ...prev, treatment_history: [...prev.treatment_history, newHistory] };
    });
  }

  const addPaymentRow = () => {
     setEditableClient(prev => {
      if (!prev) return null;
      const newPayment: Payment = { payment_id: `PAY${String(Date.now()).slice(-4)}`, date: new Date().toISOString().split('T')[0], amount: 0, method: 'cash', status: 'pending'};
      return { ...prev, payment_details: [...prev.payment_details, newPayment] };
    });
  }

  const handleSave = () => {
    if (editableClient) {
      onClientUpdate(editableClient);
      onOpenChange(false);
      setIsEditing(false);
    }
  };

  const InfoField = ({ label, value, name, isEditing }: { label: string; value: ReactNode; name: string; isEditing: boolean }) => (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      {isEditing ? (
        <Input value={value as string} onChange={(e) => handleInputChange(name, e.target.value)} className="mt-1" />
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader className="flex-row items-center justify-between">
            <div>
              <DialogTitle>ملف العميل</DialogTitle>
              <DialogDescription>
                معلومات مفصلة لـ {client.first_name} {client.last_name}.
              </DialogDescription>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm" onClick={onBookAppointment}>
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    حجز موعد
                </Button>
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      إلغاء
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      حفظ
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Button>
                )}
            </div>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="الاسم الأول" value={editableClient.first_name} name="first_name" isEditing={isEditing} />
                <InfoField label="الاسم الأخير" value={editableClient.last_name} name="last_name" isEditing={isEditing} />
                <InfoField label="البريد الإلكتروني" value={editableClient.contact_info.email} name="contact_info.email" isEditing={isEditing} />
                <InfoField label="الهاتف" value={editableClient.contact_info.phone} name="contact_info.phone" isEditing={isEditing} />
                <InfoField label="العنوان" value={editableClient.contact_info.address} name="contact_info.address" isEditing={isEditing} />
                <InfoField label="آخر زيارة" value={editableClient.last_visit} name="last_visit" isEditing={isEditing} />
              </div>
            </CardContent>
          </Card>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">تاريخ العلاج</h3>
              {isEditing && <Button size="sm" variant="outline" onClick={addTreatmentRow}><Plus className="h-4 w-4 ml-2" />إضافة</Button>}
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>الإجراء</TableHead>
                      <TableHead>معرف طبيب الأسنان</TableHead>
                      <TableHead>ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editableClient.treatment_history.map((treatment, index) => (
                      <TableRow key={index}>
                        <TableCell>{isEditing ? <Input value={treatment.date} onChange={(e) => handleTreatmentChange(index, 'date', e.target.value)} /> : treatment.date}</TableCell>
                        <TableCell>{isEditing ? <Input value={treatment.procedure} onChange={(e) => handleTreatmentChange(index, 'procedure', e.target.value)} /> : treatment.procedure}</TableCell>
                        <TableCell>{isEditing ? <Input value={treatment.dentist_id} onChange={(e) => handleTreatmentChange(index, 'dentist_id', e.target.value)} /> : treatment.dentist_id}</TableCell>
                        <TableCell>{isEditing ? <Textarea value={treatment.notes} onChange={(e) => handleTreatmentChange(index, 'notes', e.target.value)} /> : treatment.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">تفاصيل الدفع</h3>
                {isEditing && <Button size="sm" variant="outline" onClick={addPaymentRow}><Plus className="h-4 w-4 ml-2" />إضافة</Button>}
              </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>الطريقة</TableHead>
                      <TableHead>الحالة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editableClient.payment_details.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{isEditing ? <Input value={payment.date} onChange={(e) => handlePaymentChange(index, 'date', e.target.value)} /> : payment.date}</TableCell>
                        <TableCell>{isEditing ? <Input type="number" value={payment.amount} onChange={(e) => handlePaymentChange(index, 'amount', parseFloat(e.target.value))} /> : `$${payment.amount.toFixed(2)}`}</TableCell>
                        <TableCell>{isEditing ? <Input value={payment.method} onChange={(e) => handlePaymentChange(index, 'method', e.target.value)} /> : payment.method}</TableCell>
                        <TableCell>
                          {isEditing ? (
                             <Select value={payment.status} onValueChange={(value) => handlePaymentChange(index, 'status', value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="paid">مدفوع</SelectItem>
                                <SelectItem value="pending">معلق</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className="capitalize" variant={payment.status === 'paid' ? 'default' : 'secondary'}>{payment.status === 'paid' ? 'مدفوع' : 'معلق'}</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);
  const [allAppointments, setAllAppointments] = useState(appointments);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [isBookAppointmentDialogOpen, setIsBookAppointmentDialogOpen] = useState(false);
  
  const [newClient, setNewClient] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const sortedClients = useMemo(() => {
    return [...clients].sort((a, b) => new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime());
  }, [clients]);

  const handleInputChange = (field: string, value: string) => {
    setNewClient(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveClient = () => {
    const newIdNumber = (clients.length > 0 ? Math.max(...clients.map(c => parseInt(c.client_id.replace('CLI', '')))) : 0) + 1;
    const clientToAdd: Client = {
      client_id: `CLI${String(newIdNumber).padStart(3, '0')}`,
      first_name: newClient.first_name,
      last_name: newClient.last_name,
      contact_info: {
        email: newClient.email,
        phone: newClient.phone,
        address: newClient.address,
      },
      last_visit: new Date().toISOString().split('T')[0], // Today's date
      treatment_history: [],
      payment_details: [],
    };
    
    const updatedClients = addClient(clientToAdd);
    setClients(updatedClients);
    
    setIsAddClientDialogOpen(false);
    setNewClient({ first_name: "", last_name: "", email: "", phone: "", address: "" });
  };
  
  const handleClientUpdate = (updatedClientData: Client) => {
    const updatedClients = updateClient(updatedClientData);
    setClients(updatedClients);
  };
  
  const handleAppointmentBooked = (newAppointment: Appointment) => {
    const updatedAppointments = addAppointment(newAppointment);
    setAllAppointments(updatedAppointments);
  };

  const handleViewProfile = (client: Client) => {
    setSelectedClient(client);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">إدارة العملاء</h1>
          <p className="text-muted-foreground">عرض وإدارة ملفات العملاء.</p>
        </div>
        <Button onClick={() => setIsAddClientDialogOpen(true)}>
          <PlusCircle className="ml-2 h-4 w-4" />
          إضافة عميل
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                <TableHead className="hidden md:table-cell">الهاتف</TableHead>
                <TableHead>آخر زيارة</TableHead>
                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedClients.map((client) => (
                <TableRow key={client.client_id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewProfile(client)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://placehold.co/100x100.png?text=${client.first_name[0]}${client.last_name[0]}`} alt={`${client.first_name} ${client.last_name}`} data-ai-hint="person portrait"/>
                        <AvatarFallback>{client.first_name[0]}{client.last_name[0]}</AvatarFallback>
                      </Avatar>
                      {client.first_name} {client.last_name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{client.contact_info.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.contact_info.phone}</TableCell>
                  <TableCell>{client.last_visit}</TableCell>
                  <TableCell>
                    <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleViewProfile(client) }}>
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">فتح القائمة</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <ClientProfileDialog 
        client={selectedClient} 
        open={!!selectedClient} 
        onOpenChange={(open) => { if (!open) setSelectedClient(null) }} 
        onClientUpdate={handleClientUpdate}
        onBookAppointment={() => {
            if (selectedClient) {
              setIsBookAppointmentDialogOpen(true);
            }
        }}
      />

      <BookAppointmentDialog
        client={selectedClient}
        open={isBookAppointmentDialogOpen}
        onOpenChange={setIsBookAppointmentDialogOpen}
        onAppointmentBooked={handleAppointmentBooked}
       />

      <Dialog open={isAddClientDialogOpen} onOpenChange={setIsAddClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة عميل جديد</DialogTitle>
            <DialogDescription>
              املأ التفاصيل أدناه لإضافة عميل جديد.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first-name" className="text-right">الاسم الأول</Label>
              <Input id="first-name" className="col-span-3" value={newClient.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last-name" className="text-right">الاسم الأخير</Label>
              <Input id="last-name" className="col-span-3" value={newClient.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
              <Input id="email" type="email" className="col-span-3" value={newClient.email} onChange={(e) => handleInputChange('email', e.target.value)} />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">الهاتف</Label>
              <Input id="phone" className="col-span-3" value={newClient.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">العنوان</Label>
              <Input id="address" className="col-span-3" value={newClient.address} onChange={(e) => handleInputChange('address', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClientDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" onClick={handleSaveClient}>حفظ العميل</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
