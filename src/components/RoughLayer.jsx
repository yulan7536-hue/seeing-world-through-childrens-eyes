import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import rough from 'roughjs';

/**
 * 用 rough.js 在容器上画手绘线条的图层。
 * draw(rc, width, height) 返回一个 SVG 节点。
 * 容器尺寸变化时会自动重绘。
 */
export default function RoughLayer({ draw, className = '', deps = [] }) {
  const svgRef = useRef(null);

  const repaint = useCallback(() => {
    const svg = svgRef.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;

    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;

    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const node = draw(rc, width, height);
    if (node) svg.appendChild(node);
  }, [draw]);

  useLayoutEffect(() => {
    repaint();
  }, [repaint, ...deps]);

  useEffect(() => {
    const host = svgRef.current?.parentElement;
    if (!host || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => repaint());
    observer.observe(host);
    return () => observer.disconnect();
  }, [repaint]);

  return <svg ref={svgRef} className={`rough-layer ${className}`.trim()} aria-hidden="true" />;
}
