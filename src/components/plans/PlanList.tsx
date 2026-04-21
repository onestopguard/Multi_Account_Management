import { useAppStore } from "@/stores/appStore";
import { PublishPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Rocket, ExternalLink, Copy } from "lucide-react";
import { formatDateTime, getStatusText, cn } from "@/lib/utils";
import { STATUS_COLORS, PLATFORM_COLORS } from "@/lib/constants";

interface PlanListProps {
  onEdit: (plan: PublishPlan) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  onPublish: (plan: PublishPlan) => void;
}

export function PlanList({ onEdit, onDelete, onAdd, onPublish }: PlanListProps) {
  const { plans, accounts, platforms, planStatusFilter, setPlanStatusFilter } = useAppStore();

  const filteredPlans = plans
    .filter((plan) => {
      if (planStatusFilter && planStatusFilter !== "all" && plan.status !== planStatusFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());

  const getAccount = (accountId: number) => accounts.find((a) => a.id === accountId);
  const getPlatform = (platformId: number) => platforms.find((p) => p.id === platformId);

  const handlePublish = (plan: PublishPlan) => {
    onPublish(plan);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-card flex items-center gap-4">
        <Select value={planStatusFilter || "all"} onValueChange={setPlanStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="全部状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="pending">待发布</SelectItem>
            <SelectItem value="published">已发布</SelectItem>
            <SelectItem value="missed">已错过</SelectItem>
            <SelectItem value="cancelled">已取消</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          创建计划
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>暂无发布计划</p>
            <Button variant="link" onClick={onAdd}>
              创建第一个计划
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPlans.map((plan) => {
              const account = getAccount(plan.account_id);
              const platform = account ? getPlatform(account.platform_id) : null;
              const platformColor = platform ? PLATFORM_COLORS[platform.id] : "#888";
              const statusColor = STATUS_COLORS[plan.status];

              return (
                <div
                  key={plan.id}
                  className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-1 self-stretch rounded-full"
                      style={{ backgroundColor: platformColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{plan.title}</h3>
                        <Badge
                          style={{
                            backgroundColor: statusColor + "20",
                            color: statusColor,
                          }}
                        >
                          {getStatusText(plan.status)}
                        </Badge>
                      </div>
                      {platform && account && (
                        <p className="text-sm text-muted-foreground">
                          {platform.name_cn} · {account.account_name}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        计划时间：{formatDateTime(plan.scheduled_at)}
                      </p>
                      {plan.content && (
                        <p className="text-sm mt-2 line-clamp-2">{plan.content}</p>
                      )}
                      {plan.media_paths && plan.media_paths.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          附件：{plan.media_paths.length} 个文件
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        {plan.status === "pending" && (
                          <Button size="sm" onClick={() => handlePublish(plan)}>
                            <Rocket className="h-4 w-4" />
                            一键发布
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}