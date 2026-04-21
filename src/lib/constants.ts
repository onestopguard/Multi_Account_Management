import { Platform } from '@/types';

export const PLATFORMS: Platform[] = [
  { id: 1, name_cn: '抖音', name_en: 'Douyin', icon_color: '#FE2C55', website_url: 'https://www.douyin.com' },
  { id: 2, name_cn: '小红书', name_en: 'Redbook', icon_color: '#FF2442', website_url: 'https://www.xiaohongshu.com' },
  { id: 3, name_cn: '微信视频号', name_en: 'Video Account', icon_color: '#07C160', website_url: 'https://channels.weixin.qq.com' },
  { id: 4, name_cn: 'B站', name_en: 'Bilibili', icon_color: '#00A1D6', website_url: 'https://www.bilibili.com' },
  { id: 5, name_cn: '微博', name_en: 'Weibo', icon_color: '#E6162D', website_url: 'https://weibo.com' },
  { id: 6, name_cn: '得物', name_en: 'Dewu', icon_color: '#CDE900', website_url: 'https://www.dewu.com' },
  { id: 7, name_cn: '什么值得买', name_en: 'Smzdm', icon_color: '#FF4500', website_url: 'https://www.smzdm.com' },
  { id: 8, name_cn: '快手', name_en: 'Kuaishou', icon_color: '#FF4906', website_url: 'https://www.kuaishou.com' },
  { id: 9, name_cn: '美图', name_en: 'Meitu', icon_color: '#FF2D68', website_url: 'https://www.meitu.com' },
  { id: 10, name_cn: 'Soul', name_en: 'Soul', icon_color: '#FF5C2D', website_url: 'https://www.soulapp.cn' },
];

export const PLATFORM_COLORS: Record<number, string> = PLATFORMS.reduce((acc, p) => {
  acc[p.id] = p.icon_color;
  return acc;
}, {} as Record<number, string>);

export const STATUS_COLORS = {
  pending: '#FF9500',
  published: '#34C759',
  missed: '#FF3B30',
  cancelled: '#8E8E93',
} as const;

export const ACCOUNT_STATUS_COLORS = {
  active: '#34C759',
  suspended: '#FF9500',
  disabled: '#8E8E93',
} as const;

export const DEFAULT_REMINDER_MINUTES = 15;

export const REMINDER_OPTIONS = [
  { label: '15分钟前', value: 15 },
  { label: '30分钟前', value: 30 },
  { label: '1小时前', value: 60 },
  { label: '2小时前', value: 120 },
  { label: '1天前', value: 1440 },
] as const;