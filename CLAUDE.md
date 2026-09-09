# Room — Claude Instructions

## Architecture
Unified hub (คอร์ส + EA) under IntensiveTrader brand — `room.intensivetrader.com` (Thai language). ตั้งแต่ 2026-07-01 EA ทั้งหมดย้ายมาอยู่ room (เว็บหลักไม่มีหน้า /ea แล้ว)

- **Stack:** Astro 6 + MDX + Tailwind CSS 4, static output
- **Content:**
  - Courses = MDX Astro Content Collections (glob loader): `src/content/courses/*.mdx` + `src/content/lessons/{course-slug}/*.mdx`. Course types: `learn` / `learn-tool`. **คอร์สทดสอบ forex-basics ลบแล้ว 2026-07-02 (คง collection/config เผื่ออนาคต) — ตอนนี้ home เหลือ EA อย่างเดียว, build warning "collection empty" = ปกติ ไม่ error**
  - EA = **hardcoded array `eaItems` ใน `src/data/ea.ts`** (ไม่ใช่ collection — มี gdBasket ตัวเดียว; shared โดย index.astro + items.json.ts). แต่ละ EA มีหน้า detail แยกเอง
- **Pages:**
  - `src/pages/index.astro` — home hub: รวม course + EA เป็น list เดียว, โซน **ปักหมุด** (pinned เรียง pinOrder) + โซนทั้งหมด, filter ทั้งหมด/คอร์สเรียน/EA, อ่าน `?filter=ea` auto-กดปุ่ม, inline lesson toggle สำหรับ course
  - `src/pages/ea/gdbasket.astro` — gdBasket detail สไตล์ **github-repo** (repo header + toolbar + file list + README + sidebar). ปุ่มโหลด absolute -> `intensivetrader.com/d/gdbasket`. **rework 2026-07-28:** source of truth ด้าน copy/ลำดับ/สี = `C:/WORKSPACE/.claude/artifacts/gdbasket-full-copy-mockup.html`; หน้า public ใช้ **VELOCE เครื่องยนต์เดียว** (ไม่มี strada+/sport+ เป็นตัวเลือก) และอธิบาย 3 แกน Adaptive Grid Behavior / Market Temperature / PPTS, เครื่องยนต์ 2 บ้าน, Common-TP/Swap/Broker-side Stop, Capital/Rolling Capital, ผลทดสอบ, risk card โทนกลาง, Copy Trade และแถบรหัส XM `KWASATI` พร้อมปุ่มคัดลอก. **การ์ดโบรก/VPS/Copy (2026-07-31):** ยกการ์ด affiliate เป็นชุด 3 ใบ IB(แดง)/VPS(ทอง)/Copy(เขียว) แบบ A (IB เต็มกว้าง + VPS/Copy คู่ล่าง + แถบคำเตือน copytrade ใต้ pair) โซนบน; ชุด minimal 3 การ์ดเดียวกันซ้ำโซนล่างท้าย install + คำเตือน copytrade — สีต่อการ์ดผูก `--hue-r/g/b` ใน global.css (`.aff-card`/`.card-ib/vps/copy`), ปุ่ม CTA `.btn-gold`/`.btn-green`; ลิงก์ const `VPS_AFF`=MT Cloud / `COPYTRADE_URL`=social.tp-redirect(XM). คง popup 'ดูสถิติเต็ม' 7 กลุ่ม + WFA 25 รูปแบบ + survival, Releases sidebar `/ea/gdbasket/changelog`, Trading Journal/Supabase, Myfxbook, download/affiliate links และ dynamic IDs เดิม. Sidebar = About + Trading Journal + Myfxbook + Releases + Quick links + Topics + ผู้พัฒนา.
  - `src/pages/ea/gdbasket/rolling-capital.astro` — **Rolling Capital Planner** (2026-07-23, uncommitted/gated จนกว่า v3.01 web ขึ้น). หน้าคิดเลขวางแผนถอน/ทบทุนของ gdBasket แบบ static แต่คำนวณสดในเบราว์เซอร์ (ไม่มี backend) — user กรอก Capital/ทุนค้ำ(buffer)/เกณฑ์ขึ้นชั้น(step)/% ถอน แล้วเห็นผลจริงย้อนหลัง + คาดการณ์อนาคตทันที
    - **Engine:** `src/lib/rolling-sim.mjs` (`replay()` = cap-first withdrawal ledger พอร์ตตรงจาก `cap_withdrawal_sim.py`, `monthlySeries()` = ผลลัพธ์เดียวกันแต่คืนรายเดือนไว้วาดกราฟ, `bootstrap()` = block bootstrap รายเดือน 1000 เส้นทางคาดการณ์อนาคต) + `src/lib/rolling-chart.mjs` (แปลงผลลัพธ์เป็นพิกัด SVG — sqrt scale, ไม่มี chart library)
    - **Data:** `src/data/gdbasket-rolling-cycles.json` — export จาก `projects/2-EAfactory/ea/gdBasket/research/cap-withdrawal-sim/export_web_cycles.py` (อ่าน CSV ผลทดสอบ VELOCE 72k รัน 20260719, 4,878 รอบ 2023-01-03 → 2026-06-29). **Refresh data:** รัน `export_web_cycles.py` ใหม่เมื่อเปลี่ยน baseline ผลทดสอบ (path/validate guard ในสคริปต์) แล้ว JSON จะถูก overwrite ที่ path นี้ — ต้องรัน `node --test tests/rolling-sim.test.mjs` ใหม่หลัง refresh (เลขเฉลยในเทสจะไม่ตรงถ้าข้อมูลเปลี่ยน ต้องอัปเดตเฉลยตาม baseline ใหม่)
    - **ตัววัดความเสี่ยงที่โชว์บนหน้า** (เคาะ 2026-07-23 — เปลี่ยนจากเดิม): headline = "เฉียดตายแค่ไหน" (`minActiveCapCoverage` — เบาะเหลือต่ำสุดกี่เท่า) + "พอร์ตแดงลึกสุด%" (`maxActiveFundsDdPct` — DD ของเงินในบัญชีจริงล้วน ไม่รวมเงินถอน). **ไม่โชว์** `maxTotalWealthDdPct` (DD ของทรัพย์รวมรวมเงินถอน — เก็บใน engine ไว้เฉยๆ ไม่ลบ แต่มีประโยชน์น้อยเพราะกลบความจริง)
    - **Test:** `tests/rolling-sim.test.mjs` (`node --test`) — ยึด tolerance abs $1 กับเฉลย python ทุกหลัก + sanity `maxActiveFundsDdPct >= maxTotalWealthDdPct` + `monthlySeries()` ต้องได้ผลสรุปตรงกับ `replay()` เป๊ะ
    - **Release gate:** ห้าม push ขึ้น production ก่อน chain อัปเว็บ v3.01 (ชื่อ VELOCE ยังไม่เคยขึ้นเว็บจริง) — ปุ่มโหลดใช้ `DL_LATEST` เดียวกับหน้าแม่เสมอ ห้าม hardcode เวอร์ชัน
  - `src/pages/[slug].astro` — course detail (multi-lesson; single-lesson redirect home)
  - `src/pages/[slug]/[lesson].astro` — lesson page
  - `src/pages/items.json.ts` — list item (คอร์ส+EA) key={type}:{slug} + CORS (vercel.json) ให้ admin เว็บหลักดึงไปทำ pin manager
- **ปักหมุด (จาก admin):** home ดึง `site_settings.content_pins` (Supabase REST, env PUBLIC_SUPABASE_URL/ANON_KEY) มาจัดโซนปักหมุด+ติดป้าย; fetch fail = คง frontmatter (pinned/pinOrder) เดิม. eaItems อยู่ `src/data/ea.ts` (shared index + items.json)
- **Components:** `src/components/` — **Navbar** (โคลนเว็บหลัก glass-dark: หน้าแรก/Room/Trading Journal + login, cross-subdomain absolute URL), BrokerCTA, CourseCard, LessonNav. (`TopBar.astro` = legacy เลิกใช้ ยังไม่ลบ)
- **Layouts:** `src/layouts/Layout.astro` — Navbar + slot
- **Content config:** `src/content.config.ts` — courses (+ pinned/pinOrder) + lessons
- **Styling:** `src/styles/global.css` — Tailwind dark theme + Inter/Noto Sans Thai + **port จากเว็บหลัก:** Press Start 2P (`.pixel`) + `.pixel-shadow` + `.glass-dark`
- **Deploy:** static build -> Vercel (own repo `kwasati/ROOM` -> room subdomain auto-deploy). submodule ของ WORKSPACE ที่ `projects/7-ROOM`. **Vercel env `MYFXBOOK_EMAIL/PASSWORD` set แล้ว (myfxbook card)**
- **SEO:** `public/robots.txt` (allow all + AI bots) + `@astrojs/sitemap` (`site: room.intensivetrader.com`). favicon = `/favicon.png` (วงกลมโปร่งใส) — ดู memory `reference_room_gdbasket_web`
- **Build:** `npm run build` (astro build)

## Rules
- Content is Thai language — keep all UI text in Thai
- Dark theme only — colors ผ่าน CSS custom properties (dark-card, dark-border, primary, secondary, green ฯลฯ)
- **Press Start 2P ไม่มี glyph ไทย** — `.pixel` ใช้เฉพาะข้อความอังกฤษ/ตัวเลข (โลโก้ gdBasket) เท่านั้น; heading ไทยใช้ bold ปกติ
- Navbar ต้องเนียนเหมือนเว็บหลัก (glass-dark + logo + เมนู absolute URL) — room เป็น subdomain แต่ให้รู้สึกเป็นเว็บเดียว
- เพิ่มคอร์ส = สร้าง course MDX + lesson MDX (pinned:true + pinOrder ถ้าอยากปักหมุด). เพิ่ม EA = เพิ่ม object ใน `eaItems` + สร้างหน้า `src/pages/ea/{slug}.astro`
- **XM affiliate** = ลิงก์ `affs.click/jih0m` + รหัส `KWASATI` วางที่ gdBasket (การ์ด+about+install) + **footer ทุกหน้า** (ใน `Layout.astro`). โทนเพื่อนบอกเพื่อน + disclaimer "ไม่ใช่คำแนะนำการลงทุน" + `rel=sponsored` ทุกจุด (กันข้อหาแนะนำการลงทุน). _(component `BrokerCTA.astro` เดิม = end-of-lesson course — ไม่ใช้แล้ว course ลบ)_
- **อัปเดต gdBasket (version/คำโปรย) ต้องแก้ให้ครบทุกจุด** — version string + copy กระจายหลายไฟล์ อัปที่เดียวไม่พอ (เคยตกหล่น: การ์ด home ค้าง v2.00 หลังหน้า detail ไป v2.01 แล้ว, 2026-07-11):
  1. `src/data/ea.ts` — การ์ด home hub (`description` + `version`) ← **คนละไฟล์กับหน้า detail ตกหล่นบ่อยสุด**
  2. `src/pages/ea/gdbasket.astro` — หน้า detail: version badge หลายจุด (repo header / toolbar / commit bar) + `og:title`/`description` + `ogImageWidth/Height` (tag Layout) + เนื้อหา (source of truth copy = `C:/WORKSPACE/.claude/artifacts/gdbasket-full-copy-mockup.html` — ห้าม logic ภายในหลุด เช่น ATR/EMA)
  3. `src/pages/ea/gdbasket/changelog.astro` — changelog route (hardcode releases — เพิ่ม block รุ่นใหม่บนสุด; ย้ายจาก static `public/gdbasket-changelog.html` 2026-07-23 + redirect 301 vercel.json). **hardcode 8 รุ่น publish อยู่ตอนนี้ (10 ก.ย. 2026):** v3.11 / v3.10 / v3.092 / v2.02 / v2.01 / v2.00 / v1.37 / v1.18 — v3.02/v3.05/v3.06/v3.07/v3.08/v3.09/v3.091 ปิดดาวน์โหลดแล้วตามมติเจ้าของ (เนื้อหาประวัติยังอยู่ครบใน changelog.astro แค่ไม่มีปุ่มโหลด)
  4. `public/gdbasket-og.png` — FB share thumbnail 1200x630 (แก้ถ้าเปลี่ยน version/จุดขาย) → หลัง deploy กด Scrape Again ที่ FB Sharing Debugger
  5. download link const ต้นไฟล์ `gdbasket.astro` (`DL_LATEST`/`DL_V200` ฯลฯ) — ถ้าเปลี่ยนไฟล์แจก
  6. บรรทัด `Pages` ใน Architecture ด้านบน (ระบุ latest version/changelog) — sync ตามให้ตรงจริง
