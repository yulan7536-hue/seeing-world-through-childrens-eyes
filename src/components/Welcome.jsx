import { useState } from 'react';
import CrayonButton from './CrayonButton';
import RoughLayer from './RoughLayer';
import { supabase } from '../lib/supabase';
import { sketchRect } from '../lib/roughShapes';

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
      seed: 5,
    }),
  );
  return group;
};

const faceDraw = (rc, w, h) => {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const opts = { stroke: '#3A3128', strokeWidth: 2.2, roughness: 1.4, seed: 71 };
  group.appendChild(
    rc.circle(w / 2, h / 2, Math.min(w, h) * 0.78, {
      ...opts,
      fill: '#FBE6A2',
      fillStyle: 'hachure',
      hachureGap: 4,
      fillWeight: 1.8,
    }),
  );
  group.appendChild(rc.circle(w * 0.38, h * 0.44, 6, { stroke: '#3A3128', strokeWidth: 3, roughness: 0.8, seed: 73 }));
  group.appendChild(rc.circle(w * 0.62, h * 0.44, 6, { stroke: '#3A3128', strokeWidth: 3, roughness: 0.8, seed: 75 }));
  group.appendChild(
    rc.arc(w * 0.5, h * 0.56, w * 0.4, h * 0.34, 0.25, Math.PI - 0.25, false, {
      stroke: '#3A3128',
      strokeWidth: 2.4,
      roughness: 1.3,
      seed: 77,
    }),
  );
  group.appendChild(
    rc.circle(w * 0.26, h * 0.6, 9, {
      stroke: 'none',
      fill: '#F4A79A',
      fillStyle: 'solid',
      strokeWidth: 0,
      seed: 79,
    }),
  );
  group.appendChild(
    rc.circle(w * 0.74, h * 0.6, 9, {
      stroke: 'none',
      fill: '#F4A79A',
      fillStyle: 'solid',
      strokeWidth: 0,
      seed: 81,
    }),
  );
  return group;
};

export default function Welcome({ session }) {
  const [loading, setLoading] = useState(false);
  const email = session?.user?.email ?? '';
  const createdAt = session?.user?.created_at
    ? new Date(session.user.created_at).toLocaleDateString('zh-CN')
    : null;

  async function handleSignOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  }

  return (
    <section className="card card--welcome" aria-labelledby="welcome-title">
      <RoughLayer draw={cardBorder} className="card__border" />

      <div className="avatar">
        <RoughLayer draw={faceDraw} />
      </div>

      <h2 id="welcome-title" className="card__title">
        欢迎来到童眼看世界
      </h2>
      <p className="card__subtitle">你已经成功登录啦，一切都准备好了 🌱</p>

      <dl className="profile">
        <div className="profile__row">
          <dt>账号</dt>
          <dd>{email}</dd>
        </div>
        {createdAt && (
          <div className="profile__row">
            <dt>加入于</dt>
            <dd>{createdAt}</dd>
          </div>
        )}
      </dl>

      <p className="note note--ok">
        下一步可以在这里放「我的观察记录」「我的画册」等内容 ✏️
      </p>

      <CrayonButton tone="paper" onClick={handleSignOut} loading={loading} seed={23}>
        退出登录
      </CrayonButton>
    </section>
  );
}
