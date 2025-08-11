
"use client"

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { app } from "@/lib/firebase";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Assuming phone is not in auth, mock for now
    const [newPassword, setNewPassword] = useState("");
    const { toast } = useToast();
    const auth = getAuth(app);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const displayName = user.displayName || "";
            const [first, ...last] = displayName.split(' ');
            setFirstName(first);
            setLastName(last.join(' '));
            setEmail(user.email || "");
            setPhone(user.phoneNumber || "N/A"); // phoneNumber might not be available
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        if (!user) return;
        try {
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`.trim()
            });

            if (email !== user.email) {
                await updateEmail(user, email);
            }
            
            toast({
                title: "تم تحديث الملف الشخصي",
                description: "تم حفظ معلوماتك بنجاح.",
            });
        } catch (error: any) {
            toast({
                title: "خطأ في التحديث",
                description: error.message,
                variant: "destructive",
            });
        }
    };
    
    const handlePasswordUpdate = async () => {
        if (!user || !newPassword) return;
        try {
            await updatePassword(user, newPassword);
            toast({
                title: "تم تحديث كلمة المرور",
                description: "تم تغيير كلمة المرور بنجاح.",
            });
            setNewPassword("");
        } catch (error: any) {
             toast({
                title: "خطأ في تحديث كلمة المرور",
                description: "هذا الإجراء يتطلب تسجيل دخول حديث. يرجى تسجيل الخروج ثم الدخول مرة أخرى.",
                variant: "destructive",
            });
        }
    };

    return (
        <DashboardLayout>
            <h1 className="text-lg font-semibold md:text-2xl">الملف الشخصي</h1>
            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>معلومات شخصية</CardTitle>
                        <CardDescription>قم بتحديث معلوماتك الشخصية هنا.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">الاسم الأول</Label>
                                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">الاسم الأخير</Label>
                                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">رقم الهاتف</Label>
                            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled />
                        </div>
                        <Button onClick={handleProfileUpdate}>حفظ التغييرات</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>تغيير كلمة المرور</CardTitle>
                        <CardDescription>أدخل كلمة مرور جديدة لتحديثها.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <Button onClick={handlePasswordUpdate}>تحديث كلمة المرور</Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

