"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { employees } from "@/lib/data";

export default function EmployeesPage() {
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);

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
                        <DropdownMenuItem>تعديل</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">حذف</DropdownMenuItem>
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
              <Input id="first-name" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last-name" className="text-right">الاسم الأخير</Label>
              <Input id="last-name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
              <Input id="email" type="email" className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">الهاتف</Label>
              <Input id="phone" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">الدور</Label>
               <Select>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEmployeeDialogOpen(false)}>إلغاء</Button>
            <Button type="submit">حفظ الموظف</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
