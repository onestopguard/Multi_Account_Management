import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { Account } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, ExternalLink } from "lucide-react";
import { PLATFORM_COLORS, ACCOUNT_STATUS_COLORS } from "@/lib/constants";
import { getStatusText } from "@/lib/utils";

interface AccountListProps {
  onEdit: (account: Account) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export function AccountList({ onEdit, onDelete, onAdd }: AccountListProps) {
  const { accounts, platforms, selectedPlatform, setSelectedPlatform, searchQuery, setSearchQuery } = useAppStore();
  const [platformFilter, setPlatformFilter] = useState<string>("all");

  const filteredAccounts = accounts.filter((account) => {
    if (platformFilter !== "all" && account.platform_id !== parseInt(platformFilter)) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        account.account_name.toLowerCase().includes(query) ||
        account.account_url?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getPlatform = (platformId: number) => platforms.find((p) => p.id === platformId);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-card flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索账号..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="全部平台" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部平台</SelectItem>
            {platforms.map((platform) => (
              <SelectItem key={platform.id} value={platform.id.toString()}>
                {platform.name_cn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          添加账号
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>暂无账号</p>
            <Button variant="link" onClick={onAdd}>
              添加第一个账号
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredAccounts.map((account) => {
              const platform = getPlatform(account.platform_id);
              return (
                <div
                  key={account.id}
                  className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: platform?.icon_color || "#888" }}
                    >
                      {platform?.name_cn[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{account.account_name}</h3>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: ACCOUNT_STATUS_COLORS[account.status] }}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {platform?.name_cn}
                      </p>
                      {account.account_url && (
                        <a
                          href={account.account_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          访问
                        </a>
                      )}
                    </div>
                  </div>
                  {account.notes && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {account.notes}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2">
                    <Badge
                      variant={
                        account.status === "active"
                          ? "success"
                          : account.status === "suspended"
                          ? "warning"
                          : "secondary"
                      }
                    >
                      {getStatusText(account.status)}
                    </Badge>
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => onEdit(account)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(account.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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