import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/appStore";
import { Account } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
  onSave: (data: Partial<Account>) => void;
}

export function AccountForm({ open, onOpenChange, account, onSave }: AccountFormProps) {
  const { platforms } = useAppStore();
  const [formData, setFormData] = useState({
    platform_id: 0,
    account_name: "",
    account_url: "",
    account_id: "",
    username: "",
    notes: "",
    status: "active" as const,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        platform_id: account.platform_id,
        account_name: account.account_name,
        account_url: account.account_url || "",
        account_id: account.account_id || "",
        username: account.username || "",
        notes: account.notes || "",
        status: account.status,
      });
    } else {
      setFormData({
        platform_id: 0,
        account_name: "",
        account_url: "",
        account_id: "",
        username: "",
        notes: "",
        status: "active",
      });
    }
  }, [account, open]);

  const handleSubmit = () => {
    if (!formData.platform_id || !formData.account_name) return;
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{account ? "编辑账号" : "添加账号"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>平台</Label>
            <Select
              value={formData.platform_id.toString()}
              onValueChange={(v) => setFormData({ ...formData, platform_id: parseInt(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择平台" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: platform.icon_color }}
                      />
                      {platform.name_cn}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>账号名称 *</Label>
            <Input
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              placeholder="输入账号名称"
            />
          </div>
          <div className="space-y-2">
            <Label>账号链接</Label>
            <Input
              value={formData.account_url}
              onChange={(e) => setFormData({ ...formData, account_url: e.target.value })}
              placeholder="https://..."
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
                <SelectItem value="active">正常</SelectItem>
                <SelectItem value="suspended">暂停</SelectItem>
                <SelectItem value="disabled">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.platform_id || !formData.account_name}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}