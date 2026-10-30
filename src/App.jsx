import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import AuthCard from './components/AuthCard';
import Welcome from './components/Welcome';
import Doodles from './components/Doodles';

export default function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!alive) return;
        setSession(data.session ?? null);
        setReady(true);
      })
      .catch(() => {
        if (alive) setReady(true);
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="page">
      <Doodles />

      <main className="stage">
        <header className="brand">
          <p className="brand__kicker">records of a child&rsquo;s eye</p>
          <h1 className="brand__title">童眼看世界</h1>
          <p className="brand__sub">Understanding the World in Children&rsquo;s Eyes</p>
          <svg className="brand__squiggle" viewBox="0 0 260 14" aria-hidden="true">
            <path
              d="M4 9 C42 2, 74 12, 108 7 S172 2, 200 8 S244 6, 256 4"
              fill="none"
              stroke="#E4634F"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </header>

        {!ready ? (
          <div className="card card--loading" aria-live="polite">
            <span className="blink">正在准备画纸…</span>
          </div>
        ) : session ? (
          <Welcome session={session} />
        ) : (
          <AuthCard />
        )}

        {!isSupabaseConfigured && (
          <p className="config-warning">
            还没找到 Supabase 配置，请检查项目根目录的 <code>.env</code> 文件。
          </p>
        )}

        <footer className="foot">
          <span>涂涂画画 · 慢慢长大</span>
          <span className="foot__dot" aria-hidden="true">
            ·
          </span>
          <span>© {new Date().getFullYear()} 童眼看世界</span>
        </footer>
      </main>
    </div>
  );
}
