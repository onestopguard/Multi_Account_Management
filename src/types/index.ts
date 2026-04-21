export interface Platform {
  id: number;
  name_cn: string;
  name_en: string;
  icon_color: string;
  website_url: string;
}

export interface Account {
  id: number;
  platform_id: number;
  account_name: string;
  account_url: string;
  account_id: string;
  username: string;
  password_encrypted: string;
  notes: string;
  status: 'active' | 'suspended' | 'disabled';
  created_at: string;
  updated_at: string;
}

export interface PublishPlan {
  id: number;
  account_id: number;
  title: string;
  content: string;
  media_paths: string[];
  scheduled_at: string;
  status: 'pending' | 'published' | 'missed' | 'cancelled';
  published_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: number;
  plan_id: number;
  remind_at: string;
  is_sent: boolean;
  created_at: string;
}

export interface Settings {
  key: string;
  value: string;
}

export type PlanStatus = 'pending' | 'published' | 'missed' | 'cancelled';
export type AccountStatus = 'active' | 'suspended' | 'disabled';

export interface AccountWithPlatform extends Account {
  platform: Platform;
}

export interface PlanWithAccount extends PublishPlan {
  account: AccountWithPlatform;
}