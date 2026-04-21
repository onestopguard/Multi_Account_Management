import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { PublishPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface PlanFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: PublishPlan | null;
  onSave: (data: Partial<PublishPlan>) => void;
}

export function PlanForm({ open, onOpenChange, plan, onSave }: PlanFormProps) {
  const { accounts, platforms } = useAppStore();
  const [formData, setFormData] = useState({
    account_id: 0,
    title: "",
    content: "",
    media_paths: [] as string[],
    scheduled_at: "",
    notes: "",
    status: "pending" as const,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        account_id: plan.account_id,
        title: plan.title,
        content: plan.content || "",
        media_paths: plan.media_paths || [],
        scheduled_at: plan.scheduled_at.slice(0, 16),
        notes: plan.notes || "",
        status: plan.status,
      });
    } else {
      const now = new Date();
      now.setHours(now.getHours() + 1, 0, 0, 0);
      setFormData({
        account_id: 0,
        title: "",
        content: "",
        media_paths: [],
        scheduled_at: now.toISOString().slice(0, 16),
        notes: "",
        status: "pending",
      });
    }
  }, [plan, open]);

  const handleSubmit = () => {
    if (!formData.account_id || !formData.title || !formData.scheduled_at) return;
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{plan ? "编辑计划" : "创建计划"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>目标账号 *</Label>
            <Select
              value={formData.account_id.toString()}
              onValueChange={(v) => setFormData({ ...formData, account_id: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择账号" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => {
                  const platform = platforms.find((p) => p.id === account.platform_id);
                  return (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: platform?.icon_color }}
                        />
                        {platform?.name_cn} - {account.account_name}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>标题 *</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="输入标题"
            />
          </div>
          <div className="space-y-2">
            <Label>内容</Label>
            <textarea
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="输入内容（可选）"
            />
          </div>
          <div className="space-y-2">
            <Label>计划发布时间 *</Label>
            <Input
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>备注</Label>
            <Input
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="可选备注"
            />
          </div>
          {!plan && (
            <div className="space-y-2">
              <Label>状态</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">待发布</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                  <SelectItem value="cancelled">已取消</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.account_id || !formData.title || !formData.scheduled_at}
          >
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}