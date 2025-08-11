
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getLabs, getLabCases, addLab, updateLab, deleteLab, addLabCase, updateLabCase, getClinics, getClients } from "@/lib/data";
import type { Lab, LabCase, LabCaseStatus, Clinic, Client } from "@/lib/data";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


function LabDialog({ open, onOpenChange, onSave, lab }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (lab: Omit<Lab, 'lab_id'>) => void; lab: Lab | null }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (lab) {
            setName(lab.name);
            setPhone(lab.phone);
        } else {
            setName('');
            setPhone('');
        }
    }, [lab]);

    const handleSave = () => {
        if (name && phone) {
            onSave({ name, phone });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{lab ? 'تعديل المختبر' : 'إضافة مختبر جديد'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lab-name" className="text-right">اسم المختبر</Label>
                        <Input id="lab-name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lab-phone" className="text-right">رقم الهاتف</Label>
                        <Input id="lab-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
                    <Button onClick={handleSave}>حفظ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function LabCaseDialog({ open, onOpenChange, onSave, labCase, labs, clients, clinicId, onOpenChangeInParent }: { open: boolean; onOpenChange: (open: boolean) => void; onSave: (labCase: Omit<LabCase, 'case_id'> | LabCase) => void; labCase: LabCase | null; labs: Lab[]; clients: Client[]; clinicId: string; onOpenChangeInParent: (value: boolean) => void; }) {
    const [formData, setFormData] = useState<Omit<LabCase, 'case_id'>>({
        lab_id: '',
        client_name: '',
        notes: '',
        date_sent: format(new Date(), 'yyyy-MM-dd'),
        date_due: format(new Date(), 'yyyy-MM-dd'),
        status: 'sent',
        clinic_id: clinicId,
    });

    useEffect(() => {
        if (labCase) {
            setFormData(labCase);
        } else {
            setFormData({
                lab_id: labs[0]?.lab_id || '',
                client_name: '',
                notes: '',
                date_sent: format(new Date(), 'yyyy-MM-dd'),
                date_due: format(new Date(), 'yyyy-MM-dd'),
                status: 'sent',
                clinic_id: clinicId,
            });
        }
    }, [labCase, labs, clinicId]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChangeInParent}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{labCase ? 'تعديل حالة المختبر' : 'إضافة حالة مختبر جديدة'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lab-id" className="text-right">المختبر</Label>
                        <Select value={formData.lab_id} onValueChange={(value) => handleInputChange('lab_id', value)}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="اختر مختبراً" /></SelectTrigger>
                            <SelectContent>
                                {labs.map(lab => <SelectItem key={lab.lab_id} value={lab.lab_id}>{lab.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="client-name" className="text-right">اسم العميل</Label>
                         <Select value={formData.client_name} onValueChange={(value) => handleInputChange('client_name', value)}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="اختر عميلاً" /></SelectTrigger>
                            <SelectContent>
                                {clients.map(client => <SelectItem key={client.client_id} value={`${client.first_name} ${client.last_name}`}>{client.first_name} {client.last_name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date-sent" className="text-right">تاريخ الإرسال</Label>
                        <Input id="date-sent" type="date" value={formData.date_sent} onChange={(e) => handleInputChange('date_sent', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date-due" className="text-right">تاريخ التسليم</Label>
                        <Input id="date-due" type="date" value={formData.date_due} onChange={(e) => handleInputChange('date_due', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">الحالة</Label>
                        <Select value={formData.status} onValueChange={(value: LabCaseStatus) => handleInputChange('status', value)}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sent">تم الإرسال</SelectItem>
                                <SelectItem value="in_progress">قيد التنفيذ</SelectItem>
                                <SelectItem value="completed">مكتمل</SelectItem>
                                <SelectItem value="received">تم الاستلام</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="notes" className="text-right pt-2">ملاحظات</Label>
                        <Textarea id="notes" value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChangeInParent(false)}>إلغاء</Button>
                    <Button onClick={handleSave}>حفظ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function LabsTabContent({ clinic }: { clinic: Clinic }) {
    const [labs, setLabs] = useState<Lab[]>([]);
    const [labCases, setLabCases] = useState<LabCase[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    
    const [isLabDialogOpen, setIsLabDialogOpen] = useState(false);
    const [isCaseDialogOpen, setIsCaseDialogOpen] = useState(false);
    const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
    const [selectedCase, setSelectedCase] = useState<LabCase | null>(null);

    useEffect(() => {
        refreshData();
    }, [clinic]);

    const refreshData = () => {
        setLabs(getLabs());
        setLabCases(getLabCases(clinic.clinic_id));
        setClients(getClients(clinic.clinic_id));
    };

    const handleSaveLab = (labData: Omit<Lab, 'lab_id'>) => {
        if (selectedLab) {
            updateLab({ ...labData, lab_id: selectedLab.lab_id });
        } else {
            addLab(labData);
        }
        refreshData();
        setIsLabDialogOpen(false);
        setSelectedLab(null);
    };

    const handleDeleteLab = (labId: string) => {
        deleteLab(labId);
        refreshData();
    };

    const handleSaveCase = (caseData: Omit<LabCase, 'case_id'> | LabCase) => {
        updateLabCase(caseData);
        refreshData();
        setIsCaseDialogOpen(false);
        setSelectedCase(null);
    };

    const getStatusVariant = (status: LabCaseStatus) => {
        switch (status) {
            case 'sent': return 'secondary';
            case 'in_progress': return 'default';
            case 'completed': return 'outline';
            case 'received': return 'default';
            default: return 'outline';
        }
    };

    const getStatusText = (status: LabCaseStatus) => {
        switch (status) {
            case 'sent': return 'تم الإرسال';
            case 'in_progress': return 'قيد التنفيذ';
            case 'completed': return 'مكتمل';
            case 'received': return 'تم الاستلام';
        }
    }
     return (
        <div className="mt-4">
             <div className="flex items-center justify-end mb-4 gap-2">
                 <Button onClick={() => { setSelectedLab(null); setIsLabDialogOpen(true); }}>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إضافة مختبر
                    </Button>
                     <Button variant="outline" onClick={() => { setSelectedCase(null); setIsCaseDialogOpen(true); }}>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إضافة حالة
                    </Button>
                </div>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>قائمة المختبرات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>اسم المختبر</TableHead>
                                    <TableHead>رقم الهاتف</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labs.map((lab) => (
                                    <TableRow key={lab.lab_id}>
                                        <TableCell className="font-medium">{lab.name}</TableCell>
                                        <TableCell>{lab.phone}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => { setSelectedLab(lab); setIsLabDialogOpen(true); }}>
                                                        <Edit className="ml-2 h-4 w-4" /> تعديل
                                                    </DropdownMenuItem>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                                                <Trash2 className="ml-2 h-4 w-4" /> حذف
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    هذا الإجراء سيحذف المختبر وجميع الحالات المرتبطة به.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteLab(lab.lab_id)}>
                                                                    نعم، حذف
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>حالات المختبر</CardTitle>
                        <CardDescription>جميع الحالات المرسلة إلى المختبرات من {clinic.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>المختبر</TableHead>
                                    <TableHead>اسم العميل</TableHead>
                                    <TableHead>تاريخ الإرسال</TableHead>
                                    <TableHead>تاريخ التسليم</TableHead>
                                    <TableHead>الحالة</TableHead>
                                    <TableHead>ملاحظات</TableHead>
                                    <TableHead className="text-left">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {labCases.map((labCase) => (
                                    <TableRow key={labCase.case_id}>
                                        <TableCell>{labs.find(l => l.lab_id === labCase.lab_id)?.name || 'N/A'}</TableCell>
                                        <TableCell>{labCase.client_name}</TableCell>
                                        <TableCell>{labCase.date_sent}</TableCell>
                                        <TableCell>{labCase.date_due}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(labCase.status)} className={labCase.status === 'in_progress' ? `bg-blue-500 text-white` : labCase.status === 'completed' ? `bg-green-500 text-white`: ''}>{getStatusText(labCase.status)}</Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">{labCase.notes}</TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm" onClick={() => { setSelectedCase(labCase); setIsCaseDialogOpen(true); }}>
                                                تعديل
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
             {isLabDialogOpen && (
                <LabDialog 
                    open={isLabDialogOpen} 
                    onOpenChange={setIsLabDialogOpen} 
                    onSave={handleSaveLab} 
                    lab={selectedLab} 
                />
            )}
            {isCaseDialogOpen && (
                <LabCaseDialog 
                    open={isCaseDialogOpen}
                    onOpenChange={() => {}}
                    onOpenChangeInParent={setIsCaseDialogOpen}
                    onSave={handleSaveCase} 
                    labCase={selectedCase} 
                    labs={labs}
                    clients={clients}
                    clinicId={clinic.clinic_id}
                />
            )}
        </div>
     )
}


export default function LabsPage() {
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
                <div>لا توجد عيادات. يرجى إضافة عيادة من لوحة التحكم.</div>
            </DashboardLayout>
        );
    }
    
    return (
        <DashboardLayout>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">إدارة المختبرات</h1>
                    <p className="text-muted-foreground">تتبع الحالات المرسلة إلى مختبرات الأسنان.</p>
                </div>
            </div>

            <Tabs defaultValue={activeClinic} onValueChange={setActiveClinic} value={activeClinic} className="w-full">
                <TabsList>
                    {clinics.map((clinic) => (
                        <TabsTrigger key={clinic.clinic_id} value={clinic.clinic_id}>
                            {clinic.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {clinics.map((clinic) => (
                    <TabsContent key={clinic.clinic_id} value={clinic.clinic_id}>
                        <LabsTabContent clinic={clinic} />
                    </TabsContent>
                ))}
            </Tabs>
        </DashboardLayout>
    );
}

