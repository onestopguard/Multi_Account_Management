import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Database, Info } from "lucide-react";
import { useState, useEffect } from "react";

export function SettingsView() {
  const { settings, setSetting, getSetting } = useAppStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("15");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const notif = getSetting("notifications_enabled");
    const reminder = getSetting("reminder_minutes");
    const dark = getSetting("dark_mode");
    
    if (notif !== undefined) setNotificationsEnabled(notif === "true");
    if (reminder !== undefined) setReminderTime(reminder);
    if (dark !== undefined) setDarkMode(dark === "true");
  }, [settings]);

  const handleNotificationsChange = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    setSetting("notifications_enabled", enabled.toString());
  };

  const handleReminderTimeChange = (value: string) => {
    setReminderTime(value);
    setSetting("reminder_minutes", value);
  };

  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
    setSetting("dark_mode", enabled.toString());
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6">设置</h2>
      
      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              通知设置
            </CardTitle>
            <CardDescription>管理应用通知和提醒</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>启用通知</Label>
                <p className="text-sm text-muted-foreground">接收发布计划提醒</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>默认提醒时间</Label>
                <p className="text-sm text-muted-foreground">计划发布前多久提醒</p>
              </div>
              <Select value={reminderTime} onValueChange={handleReminderTimeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15分钟前</SelectItem>
                  <SelectItem value="30">30分钟前</SelectItem>
                  <SelectItem value="60">1小时前</SelectItem>
                  <SelectItem value="120">2小时前</SelectItem>
                  <SelectItem value="1440">1天前</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              外观设置
            </CardTitle>
            <CardDescription>自定义应用外观</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>深色模式</Label>
                <p className="text-sm text-muted-foreground">使用深色主题</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={handleDarkModeChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              数据管理
            </CardTitle>
            <CardDescription>备份和恢复数据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button variant="outline">
                导出数据
              </Button>
              <Button variant="outline">
                导入数据
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              关于
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">账号管家公司</span>
              </p>
              <p className="text-sm text-muted-foreground">版本 1.0.0</p>
              <p className="text-sm text-muted-foreground">
                多平台社交媒体账号管理与发布计划工具
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}