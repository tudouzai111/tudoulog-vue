import{c as n,L as e,a as l}from"./vendor-DhL4pvXe.js";const o={class:"markdown-body"},i={__name:"AGENTS",setup(p,{expose:a}){return a({frontmatter:{}}),(c,s)=>(l(),n("div",o,[...s[0]||(s[0]=[e(`<h1>src/articles/ Knowledge Base</h1><h2>OVERVIEW</h2><p>Markdown article source files. <code>vite-plugin-vue-markdown</code> transforms these into Vue components at build time.</p><h2>STRUCTURE</h2><pre class="shiki one-dark-pro" style="background-color:#282c34;" tabindex="0"><code class="language-"><span class="line"><span style="color:#abb2bf;">articles/</span></span>
<span class="line"><span style="color:#abb2bf;">├── blog-markdown-system.md  # 博客Markdown系统设计</span></span>
<span class="line"><span style="color:#abb2bf;">├── clash.md                 # Clash配置教程</span></span>
<span class="line"><span style="color:#abb2bf;">├── cloudflare.md            # CloudFlare部署HTML</span></span>
<span class="line"><span style="color:#abb2bf;">├── flutter.md               # Flutter学习笔记</span></span>
<span class="line"><span style="color:#abb2bf;">├── hello.md                 # 第一篇博客（入门介绍）</span></span>
<span class="line"><span style="color:#abb2bf;">├── music-study.md           # 乐理学习笔记</span></span>
<span class="line"><span style="color:#abb2bf;">├── oklch.md                 # OKLCH色彩空间</span></span>
<span class="line"><span style="color:#abb2bf;">├── opencode-web.md          # OpenCode Web配置</span></span>
<span class="line"><span style="color:#abb2bf;">├── opencode-windows-install.md  # OpenCode Windows安装</span></span>
<span class="line"><span style="color:#abb2bf;">├── ruanjian-list.md         # 软件推荐列表</span></span>
<span class="line"><span style="color:#abb2bf;">├── springboot-config.md     # SpringBoot配置</span></span>
<span class="line"><span style="color:#abb2bf;">├── suan-fa.md               # 算法笔记</span></span>
<span class="line"><span style="color:#abb2bf;">├── tag-component-theme.md   # 标签组件主题</span></span>
<span class="line"><span style="color:#abb2bf;">├── toc-component.md         # 目录组件实现</span></span>
<span class="line"><span style="color:#abb2bf;">├── vue-transitions.md       # Vue过渡动画</span></span>
<span class="line"><span style="color:#abb2bf;">└── win11bug.md              # Win11 Bug记录</span></span>
<span class="line"><span style="color:#abb2bf;"></span></span></code></pre><h2>WHERE TO LOOK</h2><table><thead><tr><th>Task</th><th>Location</th></tr></thead><tbody><tr><td>Add new article</td><td>Create <code>article-slug.md</code> here</td></tr><tr><td>Article discovery</td><td><code>src/utils/articleList.ts</code> (auto-globbed)</td></tr><tr><td>Markdown config</td><td><code>vite.config.ts</code> (Shiki theme, link renderer)</td></tr></tbody></table><h2>REQUIRED FRONTMATTER</h2><pre class="shiki one-dark-pro" style="background-color:#282c34;" tabindex="0"><code class="language-markdown"><span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"><span style="color:#E06C75;">title</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;文章标题&#39;</span></span>
<span class="line"><span style="color:#E06C75;">date</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;2026-02-22&#39;</span></span>
<span class="line"><span style="color:#E06C75;">tags</span><span style="color:#ABB2BF;">: [</span><span style="color:#98C379;">&#39;Vue&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;Markdown&#39;</span><span style="color:#ABB2BF;">, </span><span style="color:#98C379;">&#39;博客&#39;</span><span style="color:#ABB2BF;">]</span></span>
<span class="line"><span style="color:#E06C75;">excerpt</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;文章摘要&#39;</span></span>
<span class="line"><span style="color:#E06C75;">coverImage</span><span style="color:#ABB2BF;">: </span><span style="color:#98C379;">&#39;coverImage.png&#39;</span><span style="color:#ABB2BF;">  </span><span style="color:#7F848E;font-style:italic;"># filename only — code prepends baseUrl + &#39;img/cover/&#39;</span></span>
<span class="line"><span style="color:#ABB2BF;">---</span></span>
<span class="line"></span></code></pre><h2>CONVENTIONS</h2><ul><li>Filename = article ID (e.g., <code>hello.md</code> → id <code>hello</code>)</li><li>Date format: <code>YYYY-MM-DD</code></li><li>Tags: string array</li><li>Articles sorted by date descending (newest first)</li></ul><h2>ANTI-PATTERNS</h2><ul><li>Do NOT omit frontmatter (title, date required)</li><li>Do NOT use spaces or special characters in filenames</li><li>Do NOT place non-article markdown here</li><li>Article content is CC BY-NC 4.0 licensed (see LICENSE-CC-BY-NC.md)</li></ul>`,13)])]))}};export{i as default};
