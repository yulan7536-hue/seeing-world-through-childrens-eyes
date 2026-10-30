import { useState } from 'react';
import CrayonInput from './CrayonInput';
import CrayonButton from './CrayonButton';
import RoughLayer from './RoughLayer';
import { supabase, friendlyAuthError, isSupabaseConfigured } from '../lib/supabase';
import { sketchRect } from '../lib/roughShapes';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthCard() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pendingEmail, setPendingEmail] = useState('');

  const isSignUp = mode === 'signup';

  function switchMode(next) {
    if (next === mode) return;
    setMode(next);
    setMessage(null);
    setPassword('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);

    if (!isSupabaseConfigured) {
      setMessage({ type: 'error', text: '还没有配置 Supabase 环境变量，先看看 .env 文件吧 🛠️' });
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setMessage({ type: 'error', text: '邮箱格式好像不太对，检查一下？📮' });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: '密码太短了，至少要 6 位字符哦 🔒' });
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;

        if (data.session) {
          setMessage({ type: 'ok', text: '注册成功，已经帮你登录啦 🎉' });
        } else {
          setPendingEmail(email.trim());
          setMessage({
            type: 'ok',
            text: `验证邮件已寄到 ${email.trim()}，点开邮件里的链接就能回来登录啦 ✉️`,
          });
          setPassword('');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setMessage({ type: 'ok', text: '欢迎回来，正在进入童眼看世界 🌈' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: friendlyAuthError(error) });
    } finally {
      setLoading(false);
    }
  }

  async function resendConfirmation() {
    if (!pendingEmail) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      setMessage({ type: 'ok', text: '验证邮件重新寄出啦，记得看看垃圾箱 📮' });
    } catch (error) {
      setMessage({ type: 'error', text: friendlyAuthError(error) });
    } finally {
      setLoading(false);
    }
  }

  const cardBorder = (rc, w, h) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.appendChild(
      sketchRect(rc, {
        width: w,
        height: h,
        radius: 30,
        inset: 2,
        roughness: 1.5,
        bowing: 1.4,
        stroke: '#3A3128',
        strokeWidth: 2.4,
        fill: '#FFFCF2',
        fillStyle: 'solid',
        seed: 3,
      }),
    );
    group.appendChild(
      sketchRect(rc, {
        width: w,
        height: h,
        radius: 24,
        inset: 10,
        roughness: 2.2,
        bowing: 2,
        stroke: '#E6D9C0',
        strokeWidth: 1.2,
        seed: 8,
      }),
    );
    return group;
  };

  return (
    <section className="card" aria-labelledby="auth-title">
      <RoughLayer draw={cardBorder} className="card__border" />

      <div className="tabs" role="tablist" aria-label="登录或注册">
        <button
          type="button"
          role="tab"
          aria-selected={!isSignUp}
          className={`tab ${!isSignUp ? 'tab--active' : ''}`}
          onClick={() => switchMode('signin')}
        >
          登录
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={isSignUp}
          className={`tab ${isSignUp ? 'tab--active' : ''}`}
          onClick={() => switchMode('signup')}
        >
          注册
        </button>
      </div>

      <h2 id="auth-title" className="card__title">
        {isSignUp ? '第一次来吗？' : '欢迎回来！'}
      </h2>
      <p className="card__subtitle">
        {isSignUp ? '用邮箱和密码，开一个属于你的小账号' : '输入邮箱和密码，我们继续看世界'}
      </p>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <CrayonInput
          id="email"
          label="邮箱"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={loading}
        />

        <CrayonInput
          id="password"
          label="密码"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="至少 6 位字符"
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          disabled={loading}
        />

        {message && (
          <p className={`note note--${message.type}`} role="status">
            {message.text}
            {message.type === 'error' &&
              /验证/.test(message.text) &&
              pendingEmail && (
                <button type="button" className="note__link" onClick={resendConfirmation}>
                  重新发送验证邮件
                </button>
              )}
          </p>
        )}

        <CrayonButton
          type="submit"
          tone="yellow"
          loading={loading}
          className="btn--submit"
          seed={isSignUp ? 17 : 13}
        >
          {isSignUp ? '注册并开始探索' : '登录'}
        </CrayonButton>

        <p className="swap">
          {isSignUp ? '已经有账号了？' : '还没有账号？'}
          <button
            type="button"
            className="swap__link"
            onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
          >
            {isSignUp ? '去登录' : '去注册'}
          </button>
        </p>
      </form>
    </section>
  );
}
