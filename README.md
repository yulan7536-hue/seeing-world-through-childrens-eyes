# 童眼看世界 · Seeing the World Through Children's Eyes

> *Understanding the World in Children's Eyes*

一个用孩子的眼睛看世界的项目网站。当前已完成 **Supabase 身份验证** 与 **幼儿蜡笔手绘风登录 / 注册页**。

## 技术栈

| 层 | 选择 |
|---|---|
| 构建 | Vite 8 + React 19 |
| 后端 | Supabase（Auth / Postgres / Storage） |
| 手绘图形 | [rough.js](https://roughjs.com/) 逐个绘制卡片、输入框、按钮的不规则边缘 |
| 字体 | 站酷快乐体（ZCOOL KuaiLe，OFL 许可，**已自托管**在 `public/fonts/`） |

## 本地运行

```bash
npm install
npm run dev          # http://127.0.0.1:5173/
```

其他命令：

```bash
npm run build        # 生产构建，输出到 dist/
npm run preview      # 预览构建产物
```

## 环境变量

复制 `.env.example` 为 `.env`，填入 Supabase 项目信息：

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

> `VITE_SUPABASE_URL` **不要**带 `/rest/v1/` 后缀。
> Publishable / anon key 是公开密钥，可以放在前端，真正的权限由 Supabase 的 RLS 策略控制。

## Supabase 后台还需要确认三件事

1. **Authentication → Providers → Email** 已开启（本项目已确认开启）。
2. 默认开启「邮箱验证」（`mailer_autoconfirm = false`），注册后会收到确认邮件，点开才能登录。
   - 如果不想走验证流程，可在 Authentication → Providers → Email 关掉 *Confirm email*。
   - 内置 SMTP 每小时只能发几封，正式使用建议配置自定义 SMTP。
3. **Authentication → URL Configuration** 里把站点地址加进 **Redirect URLs**，例如：
   ```
   http://localhost:5173
   https://你的域名
   ```
   否则确认邮件里的链接会跳回 Supabase 默认的 Site URL。

## 目录结构

```
├── index.html
├── public/
│   ├── favicon.svg
│   └── fonts/zcool/          # 站酷快乐体 93 个 woff2 子集（自托管）
├── src/
│   ├── main.jsx
│   ├── App.jsx               # 会话监听：未登录 → 登录卡；已登录 → 欢迎卡
│   ├── lib/
│   │   ├── supabase.js       # Supabase client + 中文错误映射
│   │   └── roughShapes.js    # rough.js 圆角矩形工具
│   ├── components/
│   │   ├── AuthCard.jsx      # 登录 / 注册表单与真实 Auth 逻辑
│   │   ├── Welcome.jsx       # 登录后的状态页
│   │   ├── CrayonInput.jsx   # 手绘输入框
│   │   ├── CrayonButton.jsx  # 手绘按钮（底色 + 排线 + 轮廓三层）
│   │   ├── RoughLayer.jsx    # rough.js 绘图层，随尺寸自动重绘
│   │   └── Doodles.jsx       # 太阳 / 云 / 风筝 / 星星 / 草地
│   └── styles/
│       ├── fonts.css         # @font-face（指向 public/fonts）
│       └── index.css         # 纸张质感、配色、布局
└── .env.example
```

## 设计说明

- **纸张质感**：米白底 `#FBF5E9` + SVG `feTurbulence` 噪点 + 暖色径向渐变。
- **手绘边缘**：卡片、输入框、按钮全部由 rough.js 在运行时绘制，尺寸变化会重绘，所以缩放窗口时线条会「重新画一遍」。
- **按钮**：三层叠加 —— 蜡笔底色、稀疏排线纹理、手绘轮廓，兼顾蜡笔感和文字可读性。
- **装饰**：太阳、云朵、风筝、星星、草地，均为代码绘制，带轻微漂浮动画，并遵守 `prefers-reduced-motion`。

## 已实现的交互

- 邮箱 + 密码 **注册**（`supabase.auth.signUp`）
- 邮箱 + 密码 **登录**（`supabase.auth.signInWithPassword`）
- 密码显示 / 隐藏
- 未验证邮箱时的提示 + **重新发送验证邮件**（`supabase.auth.resend`）
- 登录状态持久化（刷新后仍保持）+ **退出登录**
- 常见报错的中文提示（密码错误、邮箱未验证、邮箱已注册、请求过频等）
