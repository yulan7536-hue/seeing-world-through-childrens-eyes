/**
 * 手绘形状工具：rough.js 自带的 rectangle 只有直角，
 * 这里用带圆角的 path 让边角更圆润、更像蜡笔画的。
 */

export function roundedRectPath(width, height, radius) {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  const w = width;
  const h = height;
  return [
    `M ${r} 0`,
    `L ${w - r} 0`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `L ${w} ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    `L ${r} ${h}`,
    `A ${r} ${r} 0 0 1 0 ${h - r}`,
    `L 0 ${r}`,
    `A ${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ');
}

/**
 * 在 rough.js 画布上画一个圆角矩形
 * @param {object} rc rough.svg(svg) 返回的实例
 * @param {object} opts 宽高、圆角与 rough 样式
 */
export function sketchRect(rc, opts) {
  const {
    width,
    height,
    radius = 16,
    inset = 0,
    strokeWidth = 2,
    roughness = 1.5,
    bowing = 1.4,
    stroke = '#3A3128',
    fill,
    fillStyle = 'solid',
    fillWeight = 1.6,
    hachureGap = 6,
    hachureAngle = -41,
    seed = 1,
  } = opts;

  const w = Math.max(1, width - inset * 2);
  const h = Math.max(1, height - inset * 2);

  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('transform', `translate(${inset} ${inset})`);

  group.appendChild(
    rc.path(roundedRectPath(w, h, radius), {
      stroke,
      strokeWidth,
      roughness,
      bowing,
      fill,
      fillStyle,
      fillWeight,
      hachureGap,
      hachureAngle,
      seed,
    }),
  );

  return group;
}
