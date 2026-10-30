import { useMemo, useState } from 'react';
import RoughLayer from './RoughLayer';
import { sketchRect } from '../lib/roughShapes';

/** 一枚手绘输入框：外框由 rough.js 画出，输入区保持透明 */
export default function CrayonInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  hint,
}) {
  const [revealed, setRevealed] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === 'password';
  const actualType = isPassword && revealed ? 'text' : type;

  const draw = useMemo(
    () => (rc, w, h) =>
      sketchRect(rc, {
        width: w,
        height: h,
        radius: 16,
        inset: 1.5,
        roughness: focused ? 1.9 : 1.2,
        bowing: 1.3,
        stroke: focused ? '#5C9FBF' : '#3A3128',
        strokeWidth: focused ? 2.6 : 2,
        fill: focused ? '#FFFFFF' : '#FFFFFF',
        fillStyle: 'solid',
        seed: id.length * 37 + 11,
      }),
    [focused, id],
  );

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>

      <div className={`field__box ${focused ? 'field__box--focus' : ''}`}>
        <RoughLayer draw={draw} deps={[focused]} />

        <input
          id={id}
          name={id}
          className="field__input"
          type={actualType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          spellCheck="false"
          required
        />

        {isPassword && (
          <button
            type="button"
            className="field__peek"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? '隐藏密码' : '显示密码'}
            tabIndex={-1}
          >
            {revealed ? '🙈' : '👀'}
          </button>
        )}
      </div>

      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
