"use client";

import { useState } from "react";
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
import { employees as initialEmployees, addEmployee, deleteEmployee, updateEmployee } from "@/lib/data";

type Employee = (typeof initialEmployees)[0];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isEditEmployeeDialogOpen, setIsEditEmployeeDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    salary: "",
  });

  const handleInputChange = (field: string, value: string) => {
    if(selectedEmployee) {
      const current_employee = {
        ...selectedEmployee,
        [field]: value,
        contact_info: {...selectedEmployee.contact_info}
      };
      if (field === 'email' || field === 'phone') {
        current_employee.contact_info = {...current_employee.contact_info, [field]: value}
      }
      setSelectedEmployee(current_employee)
    } else {
       setNewEmployee(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveEmployee = () => {
    const newIdNumber = (employees.length > 0 ? Math.max(...employees.map(e => parseInt(e.employee_id.replace('EMP', '')))) : 0) + 1;
    const employeeToAdd: Employee = {
      employee_id: `EMP${String(newIdNumber).padStart(3, '0')}`,
      first_name: newEmployee.first_name,
      last_name: newEmployee.last_name,
      role: newEmployee.role as Employee['role'],
      salary: parseInt(newEmployee.salary),
      contact_info: {
        email: newEmployee.email,
        phone: newEmployee.phone,
      },
      clinic_ids: ["C01"], // Default value
      avatar: "https://placehold.co/100x100.png",
    };
    
    const updatedEmployees = addEmployee(employeeToAdd);
    setEmployees(updatedEmployees);
    
    setIsAddEmployeeDialogOpen(false);
    setNewEmployee({ first_name: "", last_name: "", email: "", phone: "", role: "", salary: "" });
  };
  
  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(JSON.parse(JSON.stringify(employee)));
    setIsEditEmployeeDialogOpen(true);
  }

  const handleUpdateEmployee = () => {
    if(selectedEmployee) {
      const updatedEmployees = updateEmployee(selectedEmployee);
      setEmployees(updatedEmployees);
      setIsEditEmployeeDialogOpen(false);
      setSelectedEmployee(null);
    }
  }

  const handleDeleteEmployee = (employeeId: string) => {
    const updatedEmployees = deleteEmployee(employeeId);
    setEmployees(updatedEmployees);
  }


  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">إدارة الموظفين</h1>
          <p className="text-muted-foreground">إدارة الموظفين في عيادتك.</p>
        </div>
        <Button onClick={() => setIsAddEmployeeDialogOpen(true)}>
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
                <TableHead className="hidden md:table-cell">الهاتف</TableHead>
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
                      <div>
                        {employee.first_name} {employee.last_name}
                        <div className="flex gap-1 mt-1">
                          {employee.clinic_ids.map(id => <Badge key={id} variant="secondary">{id}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.contact_info.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{employee.contact_info.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {employee.role === 'dentist' && 'طبيب أسنان'}
                      {employee.role === 'hygienist' && 'أخصائي صحة أسنان'}
                      {employee.role === 'receptionist' && 'موظف استقبال'}
                      {employee.role === 'admin' && 'مدير'}
                    </Badge>
                  </TableCell>
                   <TableCell>${employee.salary.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">فتح القائمة</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditClick(employee)}>تعديل</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start p-2 h-auto font-normal text-destructive focus:text-destructive hover:text-destructive focus:bg-destructive/10">حذف</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                هذا الإجراء لا يمكن التراجع عنه. سيؤدي هذا إلى حذف الموظف بشكل دائم.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEmployee(employee.employee_id)}>
                                نعم، حذف الموظف
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
      
      <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة موظف جديد</DialogTitle>
            <DialogDescription>
              املأ التفاصيل أدناه لإضافة موظف جديد إلى فريقك.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first-name" className="text-right">الاسم الأول</Label>
              <Input id="first-name" className="col-span-3" value={newEmployee.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last-name" className="text-right">الاسم الأخير</Label>
              <Input id="last-name" className="col-span-3" value={newEmployee.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
              <Input id="email" type="email" className="col-span-3" value={newEmployee.email} onChange={(e) => handleInputChange('email', e.target.value)} />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">الهاتف</Label>
              <Input id="phone" className="col-span-3" value={newEmployee.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">الدور</Label>
               <Select onValueChange={(value) => handleInputChange('role', value)} value={newEmployee.role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر دورًا" />
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
                <Input id="salary" type="number" className="col-span-3" value={newEmployee.salary} onChange={(e) => handleInputChange('salary', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" onClick={handleSaveEmployee}>حفظ الموظف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditEmployeeDialogOpen} onOpenChange={setIsEditEmployeeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل الموظف</DialogTitle>
            <DialogDescription>
              تحديث تفاصيل الموظف.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-first-name" className="text-right">الاسم الأول</Label>
                <Input id="edit-first-name" className="col-span-3" value={selectedEmployee.first_name} onChange={(e) => handleInputChange('first_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-last-name" className="text-right">الاسم الأخير</Label>
                <Input id="edit-last-name" className="col-span-3" value={selectedEmployee.last_name} onChange={(e) => handleInputChange('last_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">البريد الإلكتروني</Label>
                <Input id="edit-email" type="email" className="col-span-3" value={selectedEmployee.contact_info.email} onChange={(e) => handleInputChange('email', e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">الهاتف</Label>
                <Input id="edit-phone" className="col-span-3" value={selectedEmployee.contact_info.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">الدور</Label>
                <Select onValueChange={(value) => handleInputChange('role', value)} value={selectedEmployee.role}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر دورًا" />
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
                <Label htmlFor="edit-salary" className="text-right">الراتب</Label>
                <Input id="edit-salary" type="number" className="col-span-3" value={selectedEmployee.salary} onChange={(e) => handleInputChange('salary', e.target.value)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditEmployeeDialogOpen(false); setSelectedEmployee(null); }}>إلغاء</Button>
            <Button type="submit" onClick={handleUpdateEmployee}>حفظ التغييرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
