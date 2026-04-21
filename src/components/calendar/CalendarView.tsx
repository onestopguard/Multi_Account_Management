import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay
} from "date-fns";
import { PLATFORM_COLORS, STATUS_COLORS } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";

interface CalendarViewProps {
  onSelectPlan: (planId: number) => void;
}

export function CalendarView({ onSelectPlan }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { plans, accounts, platforms } = useAppStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPlansForDay = (day: Date) => {
    return plans.filter((plan) => {
      const planDate = new Date(plan.scheduled_at);
      return isSameDay(planDate, day);
    });
  };

  const getAccount = (accountId: number) => accounts.find((a) => a.id === accountId);
  const getPlatform = (platformId: number) => platforms.find((p) => p.id === platformId);

  const firstDayOfWeek = getDay(monthStart);

  return (
    <div className="flex-1 flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "yyyy年M月", { locale: zhCN })}
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            今天
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px]" />
        ))}
        {days.map((day) => {
          const dayPlans = getPlansForDay(day);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[100px] border rounded-md p-1",
                isCurrentDay ? "bg-primary/5 border-primary" : "bg-card"
              )}
            >
              <div className={cn(
                "text-sm font-medium p-1",
                isCurrentDay ? "text-primary" : "text-muted-foreground"
              )}>
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayPlans.slice(0, 3).map((plan) => {
                  const account = getAccount(plan.account_id);
                  const platform = account ? getPlatform(account.platform_id) : null;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => onSelectPlan(plan.id)}
                      className="w-full text-left text-xs truncate px-1 py-0.5 rounded"
                      style={{
                        backgroundColor: (platform ? PLATFORM_COLORS[platform.id] : "#888") + "20",
                        color: platform ? PLATFORM_COLORS[platform.id] : "#888",
                      }}
                    >
                      {plan.title}
                    </button>
                  );
                })}
                {dayPlans.length > 3 && (
                  <button className="text-xs text-muted-foreground">
                    +{dayPlans.length - 3} 更多
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}