import { useState, useEffect } from "react";
import { useAppStore } from "./stores/appStore";
import { Sidebar } from "./components/layout/Sidebar";
import { AccountList } from "./components/accounts/AccountList";
import { AccountForm } from "./components/accounts/AccountForm";
import { PlanList } from "./components/plans/PlanList";
import { PlanForm } from "./components/plans/PlanForm";
import { CalendarView } from "./components/calendar/CalendarView";
import { StatsView } from "./components/stats/StatsView";
import { SettingsView } from "./components/settings/SettingsView";
import { Account, PublishPlan } from "./types";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-shell";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";

function App() {
  const [activePage, setActivePage] = useState("accounts");
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [planFormOpen, setPlanFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PublishPlan | null>(null);
  
  const { 
    initialize,
    addAccount, 
    updateAccount, 
    deleteAccount, 
    addPlan, 
    updatePlan, 
    deletePlan,
    accounts,
    platforms,
    getSetting
  } = useAppStore();

  useEffect(() => {
    initialize();
  }, []);

  const handleSaveAccount = (data: Partial<Account>) => {
    const now = new Date().toISOString();
    if (editingAccount) {
      updateAccount(editingAccount.id, data);
    } else {
      const newAccount: Account = {
        id: Date.now(),
        platform_id: data.platform_id!,
        account_name: data.account_name!,
        account_url: data.account_url || "",
        account_id: data.account_id || "",
        username: data.username || "",
        password_encrypted: "",
        notes: data.notes || "",
        status: data.status || "active",
        created_at: now,
        updated_at: now,
      };
      addAccount(newAccount);
    }
    setEditingAccount(null);
  };

  const handleSavePlan = (data: Partial<PublishPlan>) => {
    const now = new Date().toISOString();
    if (editingPlan) {
      updatePlan(editingPlan.id, data);
    } else {
      const newPlan: PublishPlan = {
        id: Date.now(),
        account_id: data.account_id!,
        title: data.title!,
        content: data.content || "",
        media_paths: data.media_paths || [],
        scheduled_at: new Date(data.scheduled_at!).toISOString(),
        status: data.status || "pending",
        published_at: null,
        notes: data.notes || "",
        created_at: now,
        updated_at: now,
      };
      addPlan(newPlan);
    }
    setEditingPlan(null);
  };

  const handlePublish = async (plan: PublishPlan) => {
    const account = accounts.find((a) => a.id === plan.account_id);
    if (!account) return;

    const platform = platforms.find((p) => p.id === account.platform_id);
    if (!platform) return;

    try {
      // Open platform in browser
      if (platform.website_url) {
        await open(platform.website_url);
      }
      
      // Copy content to clipboard
      if (plan.content || plan.title) {
        const textToCopy = `${plan.title}\n\n${plan.content || ""}`.trim();
        await writeText(textToCopy);
      }
    } catch (e) {
      console.error("Publish failed:", e);
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setAccountFormOpen(true);
  };

  const handleEditPlan = (plan: PublishPlan) => {
    setEditingPlan(plan);
    setPlanFormOpen(true);
  };

  const renderContent = () => {
    switch (activePage) {
      case "accounts":
        return (
          <AccountList
            onEdit={handleEditAccount}
            onDelete={deleteAccount}
            onAdd={() => {
              setEditingAccount(null);
              setAccountFormOpen(true);
            }}
          />
        );
      case "plans":
        return (
          <PlanList
            onEdit={handleEditPlan}
            onDelete={deletePlan}
            onAdd={() => {
              setEditingPlan(null);
              setPlanFormOpen(true);
            }}
            onPublish={handlePublish}
          />
        );
      case "calendar":
        return <CalendarView onSelectPlan={(id) => {
          setEditingPlan(plans.find(p => p.id === id) || null);
          setPlanFormOpen(true);
        }} />;
      case "stats":
        return <StatsView />;
      case "settings":
        return <SettingsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>

      <AccountForm
        open={accountFormOpen}
        onOpenChange={(open) => {
          setAccountFormOpen(open);
          if (!open) setEditingAccount(null);
        }}
        account={editingAccount}
        onSave={handleSaveAccount}
      />

      <PlanForm
        open={planFormOpen}
        onOpenChange={(open) => {
          setPlanFormOpen(open);
          if (!open) setEditingPlan(null);
        }}
        plan={editingPlan}
        onSave={handleSavePlan}
      />
    </div>
  );
}

export default App;