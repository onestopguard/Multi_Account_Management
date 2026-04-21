import { cn } from "@/lib/utils";
import { 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  LayoutDashboard
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "accounts", label: "账号管理", icon: Users },
  { id: "plans", label: "发布计划", icon: Calendar },
  { id: "calendar", label: "日历视图", icon: LayoutDashboard },
  { id: "stats", label: "数据统计", icon: BarChart3 },
  { id: "settings", label: "设置", icon: Settings },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 border-r bg-card h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold">账号管家公司</h1>
        <p className="text-xs text-muted-foreground">多平台账号管理</p>
      </div>
      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t text-xs text-muted-foreground">
        v1.0.0
      </div>
    </aside>
  );
}