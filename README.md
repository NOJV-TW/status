# NOJV Status

https://status.nojv.tw — NOJV 服務狀態頁 + 掛掉時發 Discord 通知。

基於 [UptimeFlare](https://github.com/lyc8503/UptimeFlare),跑在 Cloudflare Workers/Pages 免費層,監控從 Cloudflare edge 發出,與 prod 機器完全隔離。

## 怎麼運作

- 監控與通知設定都在 [`uptime.config.ts`](uptime.config.ts) — 改它、push 到 `main`,GitHub Actions 就會自動重新部署。
- Worker 每分鐘檢查一次;連續 2 次失敗(gracePeriod)才發 Discord 告警,恢復時也會通知。
- 歷史資料存在 Cloudflare D1(`uptimeflare_d1`)。

## 加一個監控

在 `uptime.config.ts` 的 `monitors` 加一項(HTTP 或 TCP_PING),push 即可。`id` 不要改,歷史跟著 `id` 走。

## Secrets

- `CLOUDFLARE_API_TOKEN`(GitHub Actions secret):部署用,需要 Workers Scripts Edit + D1 Edit + Pages Edit。
- `DISCORD_WEBHOOK_URL`(GitHub Actions secret):Discord 通知目標,部署時注入 config 的 `__DISCORD_WEBHOOK_URL__` placeholder — repo 內無機密。

## Custom domain

status.nojv.tw = Cloudflare Pages 專案 `uptimeflare` 的 custom domain + zone 裡一條 proxied CNAME(指向 `uptimeflare-b26.pages.dev`)。
