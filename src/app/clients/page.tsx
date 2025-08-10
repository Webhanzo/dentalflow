"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { clients } from "@/lib/data";

type Client = typeof clients[0];

function ClientProfileDialog({ client, open, onOpenChange }: { client: Client | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  if (!client) return null;

  const InfoField = ({ label, value }: { label: string; value: ReactNode }) => (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>ملف العميل</DialogTitle>
          <DialogDescription>
            معلومات مفصلة لـ {client.first_name} {client.last_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoField label="الاسم الكامل" value={`${client.first_name} ${client.last_name}`} />
                <InfoField label="البريد الإلكتروني" value={client.contact_info.email} />
                <InfoField label="الهاتف" value={client.contact_info.phone} />
                <InfoField label="العنوان" value={client.contact_info.address} />
              </div>
            </CardContent>
          </Card>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">تاريخ العلاج</h3>
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
                    {client.treatment_history.map((treatment, index) => (
                      <TableRow key={index}>
                        <TableCell>{treatment.date}</TableCell>
                        <TableCell>{treatment.procedure}</TableCell>
                        <TableCell>{treatment.dentist_id}</TableCell>
                        <TableCell>{treatment.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">تفاصيل الدفع</h3>
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
                    {client.payment_details.map((payment, index) => (
                      <TableRow key={index}>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell><Badge className="capitalize" variant={payment.status === 'paid' ? 'default' : 'secondary'}>{payment.status === 'paid' ? 'مدفوع' : 'معلق'}</Badge></TableCell>
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
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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
        <Button>
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
              {clients.map((client) => (
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
      />
    </DashboardLayout>
  );
}
