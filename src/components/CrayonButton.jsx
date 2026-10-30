import { useMemo } from 'react';
import RoughLayer from './RoughLayer';
import { sketchRect } from '../lib/roughShapes';

/**
 * 手绘感按钮：蜡笔平涂色块 + 稀疏的排线纹理 + 歪歪扭扭的轮廓
 * 三层叠起来才有「真的用蜡笔涂过」的感觉，同时文字依然清楚。
 */
export default function CrayonButton({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  tone = 'yellow',
  className = '',
  seed = 7,
}) {
  const palette = {
    yellow: { fill: '#F8CE55', hatch: '#E2A72E', ink: '#3A3128' },
    red: { fill: '#F49B85', hatch: '#D4705A', ink: '#3A3128' },
    paper: { fill: '#FFFCF2', hatch: '#D8C9AE', ink: '#3A3128' },
  }[tone];

  const draw = useMemo(
    () => (rc, w, h) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      const base = { width: w, height: h, radius: 18, inset: 2, bowing: 1.7 };

      // 1. 蜡笔底色（不分线条，只铺颜色）
      group.appendChild(
        sketchRect(rc, {
          ...base,
          stroke: 'none',
          strokeWidth: 0,
          roughness: 1.2,
          fill: palette.fill,
          fillStyle: 'solid',
          seed,
        }),
      );

      // 2. 稀疏排线，做出蜡笔涂过的纹理
      group.appendChild(
        sketchRect(rc, {
          ...base,
          inset: 4,
          stroke: 'none',
          strokeWidth: 0,
          roughness: 2.2,
          fill: palette.hatch,
          fillStyle: 'hachure',
          hachureGap: 13,
          hachureAngle: -41,
          fillWeight: 1.1,
          seed: seed + 5,
        }),
      );

      // 3. 手绘轮廓
      group.appendChild(
        sketchRect(rc, {
          ...base,
          roughness: 1.7,
          stroke: palette.ink,
          strokeWidth: 2.4,
          seed: seed + 11,
        }),
      );

      return group;
    },
    [palette.fill, palette.hatch, palette.ink, seed],
  );

  return (
    <button
      type={type}
      className={`btn btn--${tone} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      <RoughLayer draw={draw} />
      <span className="btn__label">
        {loading ? (
          <span className="btn__dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        ) : (
          children
        )}
      </span>
    </button>
  );
}
