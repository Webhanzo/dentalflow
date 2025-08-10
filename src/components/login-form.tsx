"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="e.g. aisha.khan" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="two_factor_auth" />
          <label
            htmlFor="two_factor_auth"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use two-factor authentication
          </label>
        </div>
        <Link href="/dashboard" className="w-full">
          <Button className="w-full">
            Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
