import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Account, Platform, PublishPlan, Settings } from '@/types';
import { PLATFORMS } from '@/lib/constants';

interface AppState {
  // Data
  accounts: Account[];
  platforms: Platform[];
  plans: PublishPlan[];
  settings: Settings[];
  
  // UI State
  selectedPlatform: number | null;
  selectedAccount: number | null;
  searchQuery: string;
  planStatusFilter: string | null;
  
  // Actions
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: number, data: Partial<Account>) => void;
  deleteAccount: (id: number) => void;
  
  setPlans: (plans: PublishPlan[]) => void;
  addPlan: (plan: PublishPlan) => void;
  updatePlan: (id: number, data: Partial<PublishPlan>) => void;
  deletePlan: (id: number) => void;
  
  setSetting: (key: string, value: string) => void;
  getSetting: (key: string) => string | undefined;
  
  setSelectedPlatform: (id: number | null) => void;
  setSelectedAccount: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  setPlanStatusFilter: (status: string | null) => void;
  
  // Initialize
  initialize: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial data
      accounts: [],
      platforms: PLATFORMS,
      plans: [],
      settings: [],
      
      // Initial UI state
      selectedPlatform: null,
      selectedAccount: null,
      searchQuery: '',
      planStatusFilter: null,
      
      // Account actions
      setAccounts: (accounts) => set({ accounts }),
      addAccount: (account) => set((state) => ({ 
        accounts: [...state.accounts, account] 
      }))),
      updateAccount: (id, data) => set((state) => ({ 
        accounts: state.accounts.map((a) => 
          a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a
        ) 
      })),
      deleteAccount: (id) => set((state) => ({ 
        accounts: state.accounts.filter((a) => a.id !== id) 
      })),
      
      // Plan actions
      setPlans: (plans) => set({ plans }),
      addPlan: (plan) => set((state) => ({ 
        plans: [...state.plans, plan] 
      })),
      updatePlan: (id, data) => set((state) => ({ 
        plans: state.plans.map((p) => 
          p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
        ) 
      })),
      deletePlan: (id) => set((state) => ({ 
        plans: state.plans.filter((p) => p.id !== id) 
      })),
      
      // Settings actions
      setSetting: (key, value) => set((state) => {
        const existing = state.settings.findIndex((s) => s.key === key);
        if (existing >= 0) {
          const newSettings = [...state.settings];
          newSettings[existing] = { key, value };
          return { settings: newSettings };
        }
        return { settings: [...state.settings, { key, value }] };
      }),
      getSetting: (key) => get().settings.find((s) => s.key === key)?.value,
      
      // UI actions
      setSelectedPlatform: (id) => set({ selectedPlatform: id }),
      setSelectedAccount: (id) => set({ selectedAccount: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPlanStatusFilter: (status) => set({ planStatusFilter: status }),
      
      // Initialize
      initialize: () => {
        const state = get();
        if (state.platforms.length === 0) {
          set({ platforms: PLATFORMS });
        }
      },
    }),
    {
      name: 'account-manager-storage',
      partialize: (state) => ({
        accounts: state.accounts,
        plans: state.plans,
        settings: state.settings,
      }),
    }
  )
);