import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { PLATFORM_COLORS } from "@/lib/constants";

export function StatsView() {
  const { accounts, plans, platforms } = useAppStore();

  const totalAccounts = accounts.length;
  const totalPlans = plans.length;
  const publishedPlans = plans.filter((p) => p.status === "published").length;
  const pendingPlans = plans.filter((p) => p.status === "pending").length;
  const missedPlans = plans.filter((p) => p.status === "missed").length;

  const accountsByPlatform = platforms.map((platform) => ({
    platform,
    count: accounts.filter((a) => a.platform_id === platform.id).length,
  })).filter((p) => p.count > 0);

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6">数据统计</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总账号数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总计划数</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{publishedPlans}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待发布</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{pendingPlans}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>账号分布</CardTitle>
          </CardHeader>
          <CardContent>
            {accountsByPlatform.length === 0 ? (
              <p className="text-muted-foreground">暂无账号数据</p>
            ) : (
              <div className="space-y-4">
                {accountsByPlatform.map(({ platform, count }) => {
                  const percentage = totalAccounts > 0 ? (count / totalAccounts) * 100 : 0;
                  return (
                    <div key={platform.id} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: platform.icon_color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{platform.name_cn}</span>
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: platform.icon_color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>发布状态</CardTitle>
          </CardHeader>
          <CardContent>
            {totalPlans === 0 ? (
              <p className="text-muted-foreground">暂无计划数据</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">已发布</span>
                      <span className="text-sm text-muted-foreground">{publishedPlans}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${(publishedPlans / totalPlans) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-orange-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">待发布</span>
                      <span className="text-sm text-muted-foreground">{pendingPlans}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full bg-orange-500"
                        style={{ width: `${(pendingPlans / totalPlans) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">已错过</span>
                      <span className="text-sm text-muted-foreground">{missedPlans}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 mt-1">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(missedPlans / totalPlans) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}