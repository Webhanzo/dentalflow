
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { getEmployees, addEmployee, deleteEmployee, updateEmployee, getClinics } from "@/lib/data";
import type { Employee, Clinic } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

const currencyFormatter = new Intl.NumberFormat('ar-JO', { style: 'currency', currency: 'JOD' });

function EmployeeDialog({ open, onOpenChange, onSave, employee, allClinics }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (employee: Employee) => void, employee: Employee | null, allClinics: Clinic[] }) {
    const [formData, setFormData] = useState<Omit<Employee, 'employee_id' | 'avatar'> | null>(null);

    useEffect(() => {
        if (employee) {
            setFormData({ ...employee });
        } else {
            setFormData({
                first_name: "", last_name: "", email: "", phone: "", role: "dentist", salary: 0, clinic_ids: [], contact_info: { email: "", phone: "" }
            });
        }
    }, [employee]);

    if (!formData) return null;

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => {
            if (!prev) return null;
            const current_employee = { ...prev, [field]: value };
             if (field === 'email' || field === 'phone') {
                current_employee.contact_info = {...current_employee.contact_info, [field]: value}
            }
            return current_employee;
        });
    };

    const handleClinicChange = (clinicId: string, checked: boolean) => {
        setFormData(prev => {
            if (!prev) return null;
            const newClinicIds = checked
                ? [...prev.clinic_ids, clinicId]
                : prev.clinic_ids.filter(id => id !== clinicId);
            return { ...prev, clinic_ids: newClinicIds };
        });
    };

    const handleSave = () => {
        if (formData) {
            const employeeToSave: Employee = {
                ...formData,
                employee_id: employee ? employee.employee_id : `EMP${String(Date.now()).slice(-4)}`,
                avatar: employee ? employee.avatar : `https://placehold.co/100x100.png`
            };
            onSave(employeeToSave);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{employee ? 'تعديل الموظف' : 'إضافة موظف جديد'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="first-name" className="text-right">الاسم الأول</Label>
                        <Input id="first-name" className="col-span-3" value={formData.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="last-name" className="text-right">الاسم الأخير</Label>
                        <Input id="last-name" className="col-span-3" value={formData.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
                        <Input id="email" type="email" className="col-span-3" value={formData.contact_info.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">الهاتف</Label>
                        <Input id="phone" className="col-span-3" value={formData.contact_info.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">الدور</Label>
                        <Select onValueChange={(value) => handleInputChange('role', value)} value={formData.role}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dentist">طبيب أسنان</SelectItem>
                                <SelectItem value="hygienist">أخصائي صحة أسنان</SelectItem>
                                <SelectItem value="receptionist">موظف استقبال</SelectItem>
                                <SelectItem value="admin">مدير</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salary" className="text-right">الراتب</Label>
                        <Input id="salary" type="number" className="col-span-3" value={formData.salary} onChange={(e) => handleInputChange('salary', parseFloat(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">العيادات</Label>
                        <div className="col-span-3 grid grid-cols-2 gap-2">
                            {allClinics.map(clinic => (
                                <div key={clinic.clinic_id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`clinic-${clinic.clinic_id}`}
                                        checked={formData.clinic_ids.includes(clinic.clinic_id)}
                                        onCheckedChange={(checked) => handleClinicChange(clinic.clinic_id, !!checked)}
                                    />
                                    <label htmlFor={`clinic-${clinic.clinic_id}`} className="text-sm font-medium leading-none">
                                        {clinic.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
                    <Button type="submit" onClick={handleSave}>حفظ</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function EmployeesTabContent({ clinic, allClinics }: { clinic: Clinic, allClinics: Clinic[] }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        setEmployees(getEmployees(clinic.clinic_id));
    }, [clinic]);

    const handleAddClick = () => {
        setSelectedEmployee(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsDialogOpen(true);
    };

    const handleDeleteEmployee = (employeeId: string) => {
        setEmployees(deleteEmployee(employeeId).filter(e => e.clinic_ids.includes(clinic.clinic_id)));
    };

    const handleSaveEmployee = (employee: Employee) => {
        if (selectedEmployee) {
            setEmployees(updateEmployee(employee).filter(e => e.clinic_ids.includes(clinic.clinic_id)));
        } else {
            const maxId = getEmployees().reduce((max, e) => Math.max(max, parseInt(e.employee_id.replace('EMP', ''))), 0);
            const newId = `EMP${String(maxId + 1).padStart(3, '0')}`;
            setEmployees(addEmployee({ ...employee, employee_id: newId }).filter(e => e.clinic_ids.includes(clinic.clinic_id)));
        }
        setIsDialogOpen(false);
        setSelectedEmployee(null);
    };
    
    return (
        <div className="mt-4">
             <div className="flex items-center justify-end mb-4">
                <Button onClick={handleAddClick}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    إضافة موظف
                </Button>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الاسم</TableHead>
                                <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                                <TableHead>الدور</TableHead>
                                <TableHead>الراتب</TableHead>
                                <TableHead><span className="sr-only">الإجراءات</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.employee_id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={employee.avatar} alt={`${employee.first_name} ${employee.last_name}`} data-ai-hint="person portrait" />
                                                <AvatarFallback>{employee.first_name[0]}{employee.last_name[0]}</AvatarFallback>
                                            </Avatar>
                                            {employee.first_name} {employee.last_name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{employee.contact_info.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                            {employee.role === 'dentist' && 'طبيب أسنان'}
                                            {employee.role === 'hygienist' && 'أخصائي صحة أسنان'}
                                            {employee.role === 'receptionist' && 'موظف استقبال'}
                                            {employee.role === 'admin' && 'مدير'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{currencyFormatter.format(employee.salary)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(employee)}>تعديل</DropdownMenuItem>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" className="w-full justify-start p-2 h-auto font-normal text-destructive focus:text-destructive hover:text-destructive focus:bg-destructive/10">حذف</Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                هذا الإجراء لا يمكن التراجع عنه.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDeleteEmployee(employee.employee_id)}>
                                                                حذف
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

            {isDialogOpen && (
                <EmployeeDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    onSave={handleSaveEmployee}
                    employee={selectedEmployee}
                    allClinics={allClinics}
                />
            )}
        </div>
    );
}

export default function EmployeesPage() {
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">إدارة الموظفين</h1>
                    <p className="text-muted-foreground">إدارة الموظفين في عيادتك.</p>
                </div>
            </div>

            <Tabs defaultValue={activeClinic} onValueChange={setActiveClinic} className="w-full">
                <TabsList>
                    {clinics.map((clinic) => (
                        <TabsTrigger key={clinic.clinic_id} value={clinic.clinic_id}>
                            {clinic.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {clinics.map((clinic) => (
                    <TabsContent key={clinic.clinic_id} value={clinic.clinic_id}>
                        <EmployeesTabContent clinic={clinic} allClinics={clinics} />
                    </TabsContent>
                ))}
            </Tabs>
        </DashboardLayout>
    );
}
