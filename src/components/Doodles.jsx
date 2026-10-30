import { useMemo } from 'react';
import RoughLayer from './RoughLayer';

const INK = '#3A3128';

function Sun() {
  const draw = useMemo(
    () => (rc, w, h) => {
      const g = rc.generator;
      const node = g.g ? null : null; // 占位，保持 API 一致性
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.26;

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.appendChild(
        rc.circle(cx, cy, r * 2, {
          roughness: 1.4,
          stroke: '#E8A93C',
          strokeWidth: 2.4,
          fill: '#F9D36B',
          fillStyle: 'hachure',
          hachureGap: 4,
          fillWeight: 2,
          seed: 21,
        }),
      );

      const rays = 10;
      for (let i = 0; i < rays; i += 1) {
        const a = (Math.PI * 2 * i) / rays + 0.18;
        const inner = r + 6;
        const outer = r + (i % 2 === 0 ? 18 : 13);
        group.appendChild(
          rc.line(
            cx + Math.cos(a) * inner,
            cy + Math.sin(a) * inner,
            cx + Math.cos(a) * outer,
            cy + Math.sin(a) * outer,
            { stroke: '#E8A93C', strokeWidth: 2.2, roughness: 1.2, seed: 30 + i },
          ),
        );
      }
      void node;
      return group;
    },
    [],
  );

  return (
    <div className="doodle doodle--sun">
      <RoughLayer draw={draw} />
    </div>
  );
}

function Cloud() {
  const draw = useMemo(
    () => (rc, w, h) => {
      const baseY = h * 0.82;
      const path = [
        `M ${w * 0.16} ${baseY}`,
        `C ${w * 0.01} ${baseY}, ${w * 0.02} ${h * 0.38}, ${w * 0.18} ${h * 0.4}`,
        `C ${w * 0.2} ${h * 0.12}, ${w * 0.44} ${h * 0.06}, ${w * 0.5} ${h * 0.3}`,
        `C ${w * 0.58} ${h * 0.02}, ${w * 0.86} ${h * 0.1}, ${w * 0.83} ${h * 0.42}`,
        `C ${w * 0.97} ${h * 0.44}, ${w * 0.97} ${baseY}, ${w * 0.84} ${baseY}`,
        'Z',
      ].join(' ');

      return rc.path(path, {
        stroke: '#7FB1CC',
        strokeWidth: 2.2,
        roughness: 1.1,
        bowing: 1.2,
        fill: '#FDFCF6',
        fillStyle: 'solid',
        fillWeight: 1,
        seed: 11,
      });
    },
    [],
  );

  return (
    <div className="doodle doodle--cloud">
      <RoughLayer draw={draw} />
    </div>
  );
}

function Kite() {
  const draw = useMemo(
    () => (rc, w) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const cx = w * 0.5;
      const top = 8;
      const bottom = w * 0.95;
      const left = w * 0.14;
      const right = w * 0.86;
      const mid = (top + bottom) / 2;

      group.appendChild(
        rc.polygon(
          [
            [cx, top],
            [right, mid],
            [cx, bottom],
            [left, mid],
          ],
          {
            stroke: '#D96A55',
            strokeWidth: 2.2,
            roughness: 1.4,
            fill: '#F6B199',
            fillStyle: 'zigzag',
            fillWeight: 1.4,
            hachureGap: 7,
            seed: 41,
          },
        ),
      );
      group.appendChild(
        rc.line(cx, top, cx, bottom, { stroke: INK, strokeWidth: 1.4, roughness: 1.2, seed: 43 }),
      );
      group.appendChild(
        rc.curve(
          [
            [cx, bottom],
            [cx + 14, bottom + 26],
            [cx - 10, bottom + 44],
            [cx + 8, bottom + 62],
          ],
          { stroke: INK, strokeWidth: 1.6, roughness: 1.6, seed: 45 },
        ),
      );
      return group;
    },
    [],
  );

  return (
    <div className="doodle doodle--kite">
      <RoughLayer draw={draw} />
    </div>
  );
}

function LittleStar() {
  const draw = useMemo(
    () => (rc, w) => {
      const points = [];
      const cx = w / 2;
      const cy = w / 2;
      const outer = w * 0.42;
      const inner = outer * 0.42;
      for (let i = 0; i < 10; i += 1) {
        const r = i % 2 === 0 ? outer : inner;
        const a = (Math.PI / 5) * i - Math.PI / 2;
        points.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
      return rc.polygon(points, {
        stroke: '#C9A227',
        strokeWidth: 1.8,
        roughness: 1.3,
        fill: '#F4D670',
        fillStyle: 'solid',
        fillWeight: 1,
        seed: 61,
      });
    },
    [],
  );

  return (
    <div className="doodle doodle--star">
      <RoughLayer draw={draw} />
    </div>
  );
}

/** 页面四周的蜡笔涂鸦装饰 */
export default function Doodles() {
  return (
    <div className="doodles" aria-hidden="true">
      <Sun />
      <Cloud />
      <Kite />
      <LittleStar />
      <div className="doodle doodle--grass">
        <svg viewBox="0 0 600 60" preserveAspectRatio="none">
          <path
            d="M0 60 L0 44 Q30 28 60 44 Q95 24 130 44 Q165 30 200 44 Q235 22 270 44 Q305 30 340 44 Q375 24 410 44 Q445 30 480 44 Q515 22 550 44 Q575 32 600 44 L600 60 Z"
            fill="#BFD9A6"
            opacity="0.55"
          />
        </svg>
      </div>
    </div>
  );
}
