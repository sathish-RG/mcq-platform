"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Database, Mail, Shield, Globe } from "lucide-react"

export default function SystemSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    siteName: "MCQ Platform",
    siteDescription: "Advanced Multiple Choice Questions Platform",
    allowRegistration: true,
    requireEmailVerification: true,
    defaultUserRole: "STUDENT",
    maxExamDuration: 180,
    maxQuestionsPerExam: 100,
    enableProctoring: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    backupFrequency: "daily",
    retentionPeriod: "90",
  })

  if (!user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-muted-foreground">Only Super Admins can access system settings.</p>
        </div>
      </div>
    )
  }

  const handleSave = () => {
    // In a real app, this would save to the database
    console.log("Saving settings:", settings)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure platform-wide settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="mr-2 h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exam Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="maxExamDuration">Maximum Exam Duration (minutes)</Label>
                <Input
                  id="maxExamDuration"
                  type="number"
                  value={settings.maxExamDuration}
                  onChange={(e) => setSettings({ ...settings, maxExamDuration: Number.parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="maxQuestionsPerExam">Maximum Questions per Exam</Label>
                <Input
                  id="maxQuestionsPerExam"
                  type="number"
                  value={settings.maxQuestionsPerExam}
                  onChange={(e) => setSettings({ ...settings, maxQuestionsPerExam: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableProctoring"
                  checked={settings.enableProctoring}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableProctoring: checked })}
                />
                <Label htmlFor="enableProctoring">Enable Proctoring Features</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                />
                <Label htmlFor="allowRegistration">Allow User Registration</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
                <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
              </div>
              <div>
                <Label htmlFor="defaultUserRole">Default User Role</Label>
                <Select
                  value={settings.defaultUserRole}
                  onValueChange={(value) => setSettings({ ...settings, defaultUserRole: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={settings.smtpUsername}
                  onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select
                  value={settings.backupFrequency}
                  onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                <Input
                  id="retentionPeriod"
                  type="number"
                  value={settings.retentionPeriod}
                  onChange={(e) => setSettings({ ...settings, retentionPeriod: e.target.value })}
                />
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  <Database className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
