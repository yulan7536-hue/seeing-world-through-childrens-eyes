import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** 环境变量是否齐全，用于在界面上给出友好提示而不是直接白屏 */
export const isSupabaseConfigured = Boolean(url && key);

export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

/** 把 Supabase 的英文报错翻译成小朋友也看得懂的提示 */
export function friendlyAuthError(error) {
  const raw = `${error?.message ?? ''} ${error?.error_description ?? ''}`.toLowerCase();
  const code = `${error?.code ?? ''} ${error?.error_code ?? ''}`.toLowerCase();

  if (raw.includes('invalid login credentials')) return '邮箱或密码不太对，再试一次吧 🙂';
  if (raw.includes('email not confirmed'))
    return '邮箱还没有验证哦，请先去邮件里点一下确认链接 ✉️';
  if (raw.includes('user already registered') || code.includes('user_already_exists'))
    return '这个邮箱已经注册过啦，直接登录就好 ✨';
  if (raw.includes('password should be at least'))
    return '密码太短了，至少要 6 位字符哦 🔒';
  if (raw.includes('unable to validate email') || raw.includes('invalid email'))
    return '这个邮箱格式好像不太对，检查一下？📮';
  if (raw.includes('rate limit') || raw.includes('too many'))
    return '操作有点频繁，请休息一分钟再来 ⏳';
  if (raw.includes('signup is disabled'))
    return '当前项目关闭了邮箱注册，请到 Supabase 后台开启 📪';
  if (raw.includes('failed to fetch') || raw.includes('networkerror'))
    return '连不上服务器，检查一下网络连接吧 📡';

  return error?.message || '出了点小状况，请稍后再试';
}
