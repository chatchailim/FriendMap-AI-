# FriendMap AI — System Requirements & Design Specification v2.0
**Photo People Mapper & Interactive Name Balloon Framework**  
*Document Version: 2.0.0 (Production Framework Baseline)*  
*Target Project: FriendMap AI / OneVault Person Registry*  
*Reference Image: `32980304_10214774071859417_974758122205741056_n.jpg`*

---

## 1. บทสรุปผู้บริหารและวิสัยทัศน์โครงการ (Executive Summary & Vision)

### 1.1 ที่มาและปัญหา (Problem Statement)
ในการถ่ายภาพหมู่ (Group Photography) เช่น งานคืนสู่เหย้าศิษย์เก่า, การอบรมสัมมนา, หรือภาพกิจกรรมองค์กร มักมีผู้เข้าร่วมตั้งแต่ 20 ถึง 100+ คน เรียงซ้อนกันหลายระดับความลึก (Standing, Kneeling, Seated) เมื่อเวลาผ่านไป ปัญหาที่เกิดขึ้นอย่างหลีกเลี่ยงไม่ได้คือ:
1. **การลืมชื่อและตัวตน (Identity Oblivion):** สมาชิกไม่สามารถจดจำได้ว่าบุคคลในภาพคือใคร ชื่อเล่นอะไร หรือสังกัดกลุ่มใด
2. **การทำลายภาพต้นฉบับ (Destructive Watermarking):** การพิมพ์ชื่อทับลงบนภาพถ่ายแบบถาวรทำให้ภาพต้นฉบับเสียหาย บดบังใบหน้าบุคคล และไม่สามารถแก้ไขเมื่อสะกดชื่อผิด
3. **การขาดข้อมูลบริบทและความสัมพันธ์ (Lack of Rich Context):** ภาพถ่ายทั่วไปไม่สามารถเก็บข้อมูลติดต่อ (เบอร์โทร, LINE ID, อีเมล) หรือบันทึกประวัติความทรงจำร่วมกันได้

### 1.2 ปรัชญาการออกแบบหลัก (Core Architecture Philosophy)
FriendMap AI ถูกออกแบบบนสถาปัตยกรรม **"Non-Destructive Metadata Overlay"** โดยแยกชั้นข้อมูลออกเป็น 3 เลเยอร์อิสระจากกัน:
* **Layer 1: Immutable Photo Layer** — ภาพถ่ายต้นฉบับจะคงสภาพเดิม 100% ไม่ถูกดัดแปลงหรือบีบอัดทำลายพิกเซล
* **Layer 2: Normalized Coordinate Layer** — พิกัดศีรษะและตำแหน่งป้ายชื่อจัดเก็บในรูปแบบสัดส่วนสัมพัทธ์ `0.00000 – 1.00000` (Normalized) ทำให้ทนทานต่อการย่อ-ขยายหน้าจอ, การ Responsive, และการเปลี่ยนความละเอียดภาพ
* **Layer 3: Interactive Balloon & Registry Layer** — ชั้นเรนเดอร์เวกเตอร์ SVG และ Canvas ที่สามารถลากป้ายชื่อ, คำนวณเส้นชี้หลบใบหน้าอัตโนมัติ, และเชื่อมโยงสู่สมุดทะเบียนประวัติบุคคล (OneVault Directory)

---

## 2. ผู้มีส่วนเกี่ยวข้องและเมทริกซ์บทบาท (Stakeholders & RACI Matrix)

| บทบาท (Role) | ผู้รับผิดชอบหลัก | หน้าที่และความรับผิดชอบหลัก | RACI Level |
|---|---|---|:---:|
| **Product Owner (PO) / Event Lead** | ประธานรุ่น / ผู้จัดการชุมชน | กำหนดทิศทางผลิตภัณฑ์, ตรวจรับฟีเจอร์, อนุมัติการเผยแพร่ข้อมูล | **Accountable (A)** |
| **System Architect & Tech Lead** | Senior Software Engineer | ออกแบบโครงสร้างระบบ, สถาปัตยกรรมข้อมูล, กำหนดมาตรฐาน Framework | **Responsible (R)** |
| **AI / ML Computer Vision Engineer** | AI Platform Engineer | พัฒนา Pipeline ตรวจจับศีรษะอัตโนมัติ (Gemini 3.8 Flash Vision API) | **Responsible (R)** |
| **Frontend / UX-UI Engineer** | Senior Frontend Engineer | พัฒนาระบบ Canvas/SVG, Gesture Zoom-Pan, Collision-Free Layout Algorithm | **Responsible (R)** |
| **Data Reviewer (Human-in-the-Loop)** | คณะทำงาน / ผู้ตรวจทานภาพ | ตรวจสอบความถูกต้องของตำแหน่งศีรษะ, กรอกชื่อและประวัติบุคคล | **Consulted (C)** |
| **Privacy & Compliance Officer** | ฝ่ายกฎหมาย / PDPA Auditor | ตรวจสอบนโยบายความยินยอม, ตรวจสอบการ Masking ข้อมูลติดต่อส่วนบุคคล | **Consulted (C)** |
| **End User / Photo Viewer** | สมาชิกในภาพ / บุคคลทั่วไป | เปิดดูภาพ, ค้นหาเพื่อนในภาพ, ดาวน์โหลดภาพพร้อมป้ายชื่อ | **Informed (I)** |

---

## 3. ผังกระบวนการดำเนินงาน (End-to-End Operational Workflow)

```
[ขั้นตอนที่ 1: Ingestion]
   ├── แนบภาพถ่ายหมู่ (File Picker / Drag & Drop / Clipboard Paste)
   └── ดึงค่า Exif และ Metadata (ขนาดภาพ, สัดส่วน, วันที่)
            │
            ▼
[ขั้นตอนที่ 2: AI Assistance (Optional)]
   ├── ส่งภาพประมวลผลผ่าน Gemini 3.8 Flash API (/api/detect-heads)
   └── สร้าง Candidate Head Bounding Boxes เข้าสู่ Review Queue
            │
            ▼
[ขั้นตอนที่ 3: Human Verification & Registry]
   ├── ผู้ใช้ตรวจทานจุดศีรษะ (เลื่อนจุด / เพิ่มจุดใหม่ / ลบจุดผิดพลาด)
   ├── กรอกชื่อ-นามสกุล, ชื่อเล่น, กลุ่ม/แถว, และข้อมูลติดต่อ
   └── แนบรูปถ่ายใบหน้าบุคคล (Portrait Avatar) เพื่อเป็นโพรไฟล์
            │
            ▼
[ขั้นตอนที่ 4: Collision-Free Auto-Layout]
   ├── สร้างรัศมีความปลอดภัยรอบใบหน้า (Protected Face Halos)
   ├── ประเมินพื้นที่ว่าง 8 ทิศทางรอบศีรษะ (Compass 8-Way Raycasting)
   └── ล็อกตำแหน่งป้าย (Lock Placement) หรือลากปรับแต่งเอง
            │
            ▼
[ขั้นตอนที่ 5: Multi-Format Export & Sharing]
   ├── Photo Metadata JSON (.metadata.json) สำหรับเก็บถาวรและเปิดงานซ้ำ
   ├── เอกสาร Markdown (.md) สำหรับระบบ Documentation & Obsidian
   ├── รายงานทางการ PDF (A4 Print-Ready) สั่งพิมพ์ผ่านเบราว์เซอร์
   └── ภาพถ่ายความละเอียดสูงพร้อมป้าย (Annotated PNG) สำหรับแชร์
```

---

## 4. ข้อกำหนดฟังก์ชันการทำงาน (Functional Requirements: FR)

### FR-01: การแนบและประมวลผลภาพถ่ายต้นฉบับ (Multi-Source Photo Ingestion)
* **FR-01.1:** รองรับการแนบภาพ 4 วิธี ได้แก่ การคลิกเลือกไฟล์ (File Browser), การลากและวางทั้งหน้าจอ (Global Drag & Drop), การวางภาพจากคลิปบอร์ด (`Ctrl+V` / `Cmd+V`), และการถ่ายสดจากกล้อง
* **FR-01.2:** ไม่บีบอัดทำลายภาพต้นฉบับ คำนวณความละเอียดจริง (`naturalWidth`, `naturalHeight`) และสัดส่วนภาพ (`aspectRatio`) ทันทีที่โหลด
* **FR-01.3:** แสดงแถบสถานะข้อมูลภาพ (ขนาดพิกเซล, ขนาดไฟล์ KB/MB, ชื่อไฟล์เดิม)

### FR-02: ระบบพิกัดมาตรฐานสัมพัทธ์ (Normalized Coordinate Engine)
* **FR-02.1:** พิกัดตำแหน่งศีรษะถูกจัดเก็บเป็น $x, y \in [0.0, 1.0]$ โดย $(0,0)$ คือมุมซ้ายบน และ $(1,1)$ คือมุมขวาล่าง
* **FR-02.2:** ตำแหน่งป้ายชื่อจัดเก็บเป็นค่าความเยื้อง (Offset) $dx, dy$ สัมพันธ์กับจุดศูนย์กลางศีรษะ
* **FR-02.3:** เมื่อปรับขนาดหน้าจอ (Resize), ซูมภาพ (Zoom), หรือเลื่อนภาพ (Pan) ตำแหน่งป้ายและเส้นชี้ต้องเกาะติดบุคคลเดิมโดยไม่คลาดเคลื่อน

### FR-03: การตรวจจับศีรษะด้วย AI (AI-Assisted Head Candidate Detection)
* **FR-03.1:** เชื่อมต่อกับ Backend Service ผ่านโมเดล `gemini-3.8-flash` เพื่อตรวจจับพิกัดศีรษะบุคคลในภาพ
* **FR-03.2:** แยกแยะระดับความลึกของแถวเบื้องต้น (`front_seated`, `middle_standing`, `back_standing`)
* **FR-03.3:** ส่งออกคำอธิบายลักษณะเบื้องต้น (Visual Clue) เพื่อช่วยให้ผู้ใช้ระบุตัวตนได้ง่ายขึ้น เช่น "เสื้อโปโลเทา", "แว่นตา", "สูทน้ำเงิน"
* **FR-03.4:** **Anti-Hallucination Policy:** ระบบจะไม่เดาหรือผูกชื่อบุคคลจริงโดยอัตโนมัติ ป้องกันการละเมิดสิทธิส่วนบุคคล

### FR-04: ระบบป้ายชื่อบอลลูนและเส้นชี้ (Balloon & Leader Line System)
* **FR-04.1:** เรนเดอร์เส้นชี้แบบเวกเตอร์ SVG ความละเอียดสูง รองรับรูปแบบเส้นตรง (Solid), เส้นโค้ง (Curved Bezier), และเส้นประ (Dashed)
* **FR-04.2:** ป้ายบอลลูนสามารถลากได้อย่างอิสระรอบศีรษะด้วย Pointer Capture
* **FR-04.3:** มีแป้นควบคุมทิศทางมาตรฐาน 8 ทิศ (NW, N, NE, W, E, SW, S, SE) พร้อมแถบเลื่อนปรับระยะห่างเส้นชี้
* **FR-04.4:** รองรับการล็อกตำแหน่งป้าย (`locked: true`) เพื่อไม่ให้อัลกอริทึมจัดป้ายอัตโนมัติมาทับการแก้ไขของผู้ใช้

### FR-05: อัลกอริทึมจัดป้ายอัตโนมัติหลบใบหน้า (Collision-Free Layout Algorithm)
* **FR-05.1:** กำหนดเขตห้ามทับ (Face Exclusion Zone) รอบจุดศีรษะของทุกคนด้วยรัศมีปลอดภัย $R_{\text{safety}} = r \times 1.3$
* **FR-05.2:** ประเมินตำแหน่งป้าย 8 ทิศทาง ที่ระดับระยะห่าง 5 ระดับ (40 Candidate Placements ต่อคน)
* **FR-05.3:** ฟังก์ชันคำนวณคะแนนลงโทษ (Penalty Scoring):
  $$E = W_{\text{face}} \cdot \text{Overlap}_{\text{face}} + W_{\text{line-face}} \cdot \text{Cross}_{\text{face}} + W_{\text{label}} \cdot \text{Overlap}_{\text{label}} + W_{\text{cross}} \cdot \text{Cross}_{\text{line}} + W_{\text{dist}} \cdot \text{Dist}$$
* **FR-05.4:** บอลลูนที่ผู้ใช้ล็อกไว้ (`locked = true`) จะถูกคำนวณเป็นสิ่งกีดขวางแบบคงที่ก่อนเสมอ

### FR-06: โหมดการทำงาน 2 สถานะ (Dual Operating Modes)
* **FR-06.1 Editor Mode (โหมดจัดวาง):**
  * เพิ่มจุดบุคคลด้วย `Shift + Click` หรือปุ่ม "เพิ่มจุด"
  * เลื่อนจุดศีรษะและลากปรับทิศทางป้ายชื่อ
  * กรอกและแก้ไขข้อมูลบุคคลอย่างละเอียด
  * ปรับแต่งธีมป้าย ขนาดตัวอักษร และสีเส้นชี้
* **FR-06.2 Viewer Mode (โหมดนำเสนอ):**
  * ล็อกการแก้ไขพิกัด เพื่อป้องกันการเคลื่อนของป้ายโดยไม่ได้ตั้งใจ
  * คลิกหรือชี้ป้ายชื่อเพื่อแสดงการ์ดประวัติบุคคล
  * ค้นหาและไฮไลต์บุคคลในภาพได้อย่างรวดเร็ว

### FR-07: สมุดทะเบียนและระบบค้นหา (Directory & Search Drawer)
* **FR-07.1:** ค้นหาบุคคลแบบ Real-time ด้วยชื่อ, ชื่อเล่น, รหัสบุคคล (เช่น `P001`), หรือคำอธิบายลักษณะ
* **FR-07.2:** กรองบุคคลตามสถานะการตรวจทาน (`ทั้งหมด`, `รอตรวจ`, `ตรวจแล้ว`) และตามกลุ่มแถว
* **FR-07.3:** คลิกรายการในสมุดรายชื่อเพื่อโฟกัสและไฮไลต์บุคคลบนภาพทันที

### FR-08: การแนบรูปภาพบุคคลรายคน (Per-Person Portrait Attachment)
* **FR-08.1:** ผู้ใช้สามารถแนบภาพถ่ายใบหน้า/ภาพเดี่ยวให้แก่บุคคลแต่ละคนได้
* **FR-08.2:** แสดงรูปโพรไฟล์ควบคู่กับชื่อเล่นและข้อมูลติดต่อในสมุดรายชื่อและหน้าต่างโปรไฟล์

### FR-09: การล้างข้อมูลและเริ่มต้นใหม่ (Canvas Lifecycle & Clear Engine)
* **FR-09.1:** ตัวเลือก **"ล้างเฉพาะจุดบุคคล"**: ล้างจุดและรายชื่อออกทั้งหมด แต่คงภาพปัจจุบันไว้ เพื่อเริ่มต้นระบุจุดใหม่ได้ทันที
* **FR-09.2:** ตัวเลือก **"ล้างภาพและจุดทั้งหมด"**: ล้างกระดานให้ว่างเปล่า 100% พร้อมแสดงพื้นที่ต้อนรับสำหรับแนบภาพใหม่
* **FR-09.3:** ตัวเลือก **"โหลดตัวอย่าง 31 คน"**: เรียกคืนข้อมูลตัวอย่างมาตรฐาน 31 คนกลับมาได้ในคลิกเดียว

### FR-10: ระบบส่งออกข้อมูลหลายรูปแบบ (Multi-Format Export Engine)
* **FR-10.1 Photo Metadata JSON (`*.json` / `*.metadata.json`):** บันทึกข้อมูลภาพ, ค่าสถิติ, ข้อมูลบุคคลครบถ้วน โดยตั้งชื่อไฟล์ตรงกับภาพต้นฉบับ เช่น `32980304_10214774071859417_974758122205741056_n.json`
* **FR-10.2 Markdown Report (`*.md`):** สร้างเอกสาร Markdown พร้อมตารางรายชื่อบุคคลและรายละเอียดรายคน
* **FR-10.3 Printable PDF (`*.pdf`):** รายงานทางการขนาด A4 พร้อมสถิติ KPI, ตารางรายชื่อ, และจัดหน้ากระดาษแบบ Print-Ready
* **FR-10.4 Annotated Image (`*.png`):** เรนเดอร์ภาพถ่ายจริงพร้อมป้ายชื่อและเส้นชี้ลง Canvas ความละเอียดสูงสำหรับแชร์

### FR-11: นโยบายปกป้องความเป็นส่วนตัว (PDPA & Privacy-by-Default)
* **FR-11.1 Private-by-Default:** ซ่อนเบอร์โทรศัพท์และ LINE ID เป็นค่าเริ่มต้นในการแสดงผลโหมด Viewer
* **FR-11.2 Export Sanitization:** มีตัวเลือก Masking ข้อมูลติดต่อส่วนบุคคลออกจากไฟล์ JSON, Markdown, และ PDF สำหรับการแชร์สาธารณะ

---

## 5. ข้อกำหนดด้านคุณภาพที่ไม่ใช่ฟังก์ชัน (Non-Functional Requirements: NFR)

* **NFR-01 Performance & Responsiveness:** การลากป้ายบอลลูนต้องเรนเดอร์ที่ 60 FPS โดยไม่มีอาการหน่วง (Latency $\le 16\text{ms}$)
* **NFR-02 Zero Layout Drift:** การซูมหรือย่อภาพต้องรักษาความแม่นยำของจุดชี้ศีรษะที่ค่าความผิดพลาด $< 0.1\text{px}$
* **NFR-03 High-Resolution Canvas Export:** การส่งออกภาพ PNG ต้องคงความละเอียดพิกเซลของภาพต้นฉบับเดิม (รองรับภาพขนาด $4\text{K}+$)
* **NFR-04 Zero Broken Dependencies:** ไม่มี External Asset Link ที่เปราะบาง ใช้ Local Fonts และ Inline SVG Fallback
* **NFR-05 Browser Compatibility:** รองรับเบราว์เซอร์มาตรฐาน (Chrome, Edge, Safari, Firefox) บน Desktop, แท็บเล็ต และมือถือ

---

## 6. สเปกการออกแบบ UX/UI (UX/UI Design Specification)

### 6.1 กฎการออกแบบ Universal Design Constitution
1. **Anti-Slop Discipline:** ไม่ใช้การไล่เฉดสีม่วงหรือการ์ดลอยไร้จุดประสงค์ ใช้โทนสี Dark Studio สุขุม เรียบหรู
2. **Zero-Pill Metadata:** ข้อมูลเมทาดาต้าแสดงผลเป็นข้อความเรียบง่าย คั่นด้วยเครื่องหมาย `·` หรือ `/` (ไม่ใช้แคปซูลยาซ้อนกัน)
3. **Top Bar Contract:** แถบ Header แถวเดียว 3 โซนชัดเจน:
   * **Zone 1 (Brand):** `FriendMap AI` Wordmark + App Version
   * **Zone 2 (Navigation):** Segmented Control สลับระหว่าง `โหมดจัดวาง (Editor)` และ `โหมดนำเสนอ (Viewer)` + สถิติการตรวจทาน
   * **Zone 3 (Actions):** `ล้างข้อมูล`, `แนบภาพถ่าย`, `ตั้งค่า`, `ส่งออก / บันทึก`
4. **60-30-10 Color Budget:**
   * **60% Dominant Canvas:** Slate-950 (`#020617`) พื้นหลังเข้มสำหรับตรวจทานภาพถ่าย
   * **30% Structural Surfaces:** Slate-900 / Slate-800 (`#0f172a`, `#1e293b`) สำหรับการ์ดข้อมูลและแถบเครื่องมือ
   * **10% Accent Points:** Amber-400 / Amber-500 (`#fbbf24`, `#f59e0b`) สำหรับปุ่มหลัก, ป้ายบุคคลที่ถูกเลือก, และเส้นชี้

### 6.2 แบบอักษรและลำดับขั้นทางตัวพิมพ์ (Typography Hierarchy)
* **ภาษาไทย (Body & UI):** `Prompt`, `Sarabun`, sans-serif
* **ภาษาอังกฤษ & แบรนด์ (Display):** `Plus Jakarta Sans`, sans-serif
* **รหัสตัวเลข & พิกัด (Data & Telemetry):** `JetBrains Mono`, `tabular-nums`
* **Headline Display:** 18px – 24px (Bold 700)
* **Body Text:** 13px – 14px (Regular 400, Line-height 1.5)
* **Micro Metadata:** 10px – 11px (Medium 500)

### 6.3 กายวิภาคของป้ายชื่อบอลลูน (Balloon Anatomy)
* **ธีมการ์ตูนคอมิค (Cartoon Comic):** พื้นหลังสีเหลืองอ่อน `#fef08a`, ขอบหนาสีดำ `#0f172a`, เส้นชี้สีเหลืองทอง `#facc15`
* **ธีมโมเดิร์นป้ายชื่อ (Modern Badge):** พื้นหลังกระจกดำโปร่งแสง `rgba(15, 23, 42, 0.9)`, ขอบบาง Slate-700
* **ธีมดาร์กโหมด (Dark Tech):** คอนทราสต์สูงพิเศษสำหรับภาพถ่ายกลางคืน
* **สัญลักษณ์สถานะ:**
  * ป้ายสีเขียว = ตรวจทานแล้ว (`reviewed: true`)
  * ป้ายสีกรอบประ = รอการตรวจทาน (`reviewed: false`)
  * ไอคอนแม่กุญแจ = ล็อกตำแหน่งแล้ว (`locked: true`)

---

## 7. แบบจำลองข้อมูลและสคีมา JSON (Data Model & Schema Specification)

### 7.1 โครงสร้าง Photo Metadata JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PhotoMetadataJSON",
  "type": "object",
  "required": ["version", "exportType", "photoMetadata", "people"],
  "properties": {
    "version": { "type": "string", "example": "1.0.0" },
    "exportType": { "type": "string", "enum": ["friendmap_photo_metadata"] },
    "exportedAt": { "type": "string", "format": "date-time" },
    "photoMetadata": {
      "type": "object",
      "required": ["fileName", "width", "height", "aspectRatio"],
      "properties": {
        "id": { "type": "string" },
        "fileName": { "type": "string", "example": "32980304_10214774071859417_974758122205741056_n.jpg" },
        "title": { "type": "string" },
        "width": { "type": "integer", "example": 1536 },
        "height": { "type": "integer", "example": 959 },
        "aspectRatio": { "type": "number", "example": 1.60167 },
        "fileSizeBytes": { "type": "integer" },
        "mimeType": { "type": "string", "example": "image/jpeg" },
        "capturedDate": { "type": "string" },
        "locationName": { "type": "string" },
        "depthLayers": { "type": "integer", "example": 3 },
        "notes": { "type": "string" }
      }
    },
    "statistics": {
      "type": "object",
      "properties": {
        "totalPeople": { "type": "integer", "example": 31 },
        "reviewedCount": { "type": "integer" },
        "unreviewedCount": { "type": "integer" },
        "rowsCount": { "type": "integer", "example": 3 }
      }
    },
    "settings": {
      "type": "object",
      "properties": {
        "balloonTheme": { "type": "string", "enum": ["cartoon", "badge", "minimal", "dark"] },
        "leaderLineColor": { "type": "string" },
        "leaderLineWidth": { "type": "number" },
        "leaderLineStyle": { "type": "string", "enum": ["solid", "curved", "dashed", "cartoon"] },
        "fontSize": { "type": "integer" },
        "privacyMode": { "type": "boolean" }
      }
    },
    "people": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "head", "label", "reviewed"],
        "properties": {
          "id": { "type": "string", "example": "P001" },
          "name": { "type": "string" },
          "nickname": { "type": "string" },
          "groupTag": { "type": "string" },
          "contact": {
            "type": "object",
            "properties": {
              "phone": { "type": "string" },
              "email": { "type": "string" },
              "lineId": { "type": "string" }
            }
          },
          "notes": { "type": "string" },
          "head": {
            "type": "object",
            "required": ["x", "y", "radius"],
            "properties": {
              "x": { "type": "number", "minimum": 0, "maximum": 1 },
              "y": { "type": "number", "minimum": 0, "maximum": 1 },
              "radius": { "type": "number" }
            }
          },
          "label": {
            "type": "object",
            "required": ["dx", "dy", "locked", "visible"],
            "properties": {
              "dx": { "type": "number" },
              "dy": { "type": "number" },
              "locked": { "type": "boolean" },
              "visible": { "type": "boolean" },
              "customDirection": { "type": "string" }
            }
          },
          "reviewed": { "type": "boolean" },
          "depthRow": { "type": "string", "enum": ["front_seated", "middle_standing", "back_standing"] },
          "visualHint": { "type": "string" },
          "photoUrl": { "type": "string" }
        }
      }
    }
  }
}
```

---

## 8. อัลกอริทึมจัดป้ายหลบใบหน้า (Mathematical Placement Formulation)

### 8.1 เขตห้ามทับของใบหน้า (Protected Face Bounding Box)
สำหรับบุคคลแต่ละคน $i$:
$$\text{Box}_{\text{face}}(i) = [x_i - r_i \cdot \alpha, \; y_i - r_i \cdot \alpha, \; x_i + r_i \cdot \alpha, \; y_i + r_i \cdot \alpha]$$
โดยที่ $\alpha = 1.30$ คือ Safety Margin Factor

### 8.2 การกำเนิด Candidate ป้ายชื่อ 8 ทิศทาง
กำหนดชุดระยะทางรัศมี $D = \{0.065, 0.100, 0.140, 0.190, 0.240\}$  
และชุดเวกเตอร์หน่วย 8 ทิศ $\vec{u} \in \{\text{N}, \text{NE}, \text{E}, \text{SE}, \text{S}, \text{SW}, \text{W}, \text{NW}\}$:
$$\vec{C}(i, \vec{u}, d) = (x_i, y_i) + d \cdot \vec{u}$$

### 8.3 กฎการตัดตัวเลือก (Hard Pruning Constraint)
หากกรอบสี่เหลี่ยมผืนผ้าของป้าย $\text{Box}_{\text{label}}(i, \vec{u}, d)$ ซ้อนทับกับ $\text{Box}_{\text{face}}(j)$ ของบุคคลใดๆ ในภาพ $\implies$ **ตัดทิ้งทันที (Hard Discard)**

---

## 9. แผนงานขยายผลและการนำไปใช้ซ้ำ (Reusable Framework Roadmap)

| เฟสงาน | รายละเอียดความสามารถ | ผลลัพธ์ใน Framework |
|---|---|---|
| **Phase 1: Core Engine** | Normalized Canvas, Interactive Draggable Balloons, 8-way Pad | คอมโพเนนต์ `StageCanvas`, `PersonDetailPanel` นำไปใช้ซ้ำได้ |
| **Phase 2: AI Automation** | Gemini 3.8 Flash Vision API Integration, Review Queue | Route `/api/detect-heads` เป็น Microservice แยกอิสระ |
| **Phase 3: Collision Optimization** | Multi-tier Raycasting, Face Protection Halos | โมดูล `collisionAvoidance.ts` อิสระ ไม่ผูกติดกับ UI |
| **Phase 4: Multi-Photo OneVault** | ทะเบียนบุคคลเชื่อมโยงหลายภาพด้วย Person ID เดียวกัน | สคีมา `PhotoMetadataJSON` รองรับการรวมฐานข้อมูล |
| **Phase 5: Multi-Format Publishing** | PDF Print Engine, Markdown Generator, Annotated PNG | โมดูล `ExportModal` รองรับการพิมพ์รายงานขนาด A4 ทันที |
| **Phase 6: Power Productivity** | Face Cropping Canvas, Web Audio Voice Memos, Batch Import | คอมโพเนนต์ `FaceThumbnail`, `VoiceMemoPlayer`, `BatchImportModal` |

---

## 10. ข้อกำหนดทางวิศวกรรมระบบย่อยขั้นสูง (Advanced Subsystems Architecture)

### 10.1 Dynamic Canvas Face-Cropping Pipeline (`FaceThumbnail`)
- **Input:** `photoUrl` (String), `head: HeadPoint { x, y, radius }`, `size: number`
- **Algorithm:**
  1. สร้าง Offscreen/Onscreen HTML5 Canvas ปรับความละเอียดตาม Device Pixel Ratio ($dpr = \text{window.devicePixelRatio} \parallel 1$)
  2. กำหนดรัศมีการครอป $\text{cropDim} = r \cdot 2.70 \cdot \min(W_{\text{natural}}, H_{\text{natural}})$
  3. กำหนดกรอบตัดวงกลมด้วย `ctx.arc(size/2, size/2, size/2, 0, 2π)` และ `ctx.clip()`
  4. เรียก `ctx.drawImage` ตัดเฉพาะพื้นที่ใบหน้า วาดลงบน Canvas ด้วย $O(1)$ Memory Overhead

### 10.2 Web Audio MediaRecorder & Base64 Voice Memo (`VoiceMemoPlayer`)
- **Media Capture:** เรียก `navigator.mediaDevices.getUserMedia({ audio: true })`
- **Stream Compression:** บันทึกผ่าน `MediaRecorder` ในฟอร์แมต `audio/webm` หรือ `audio/mp4` โดยมีตัวจับเวลาความยาวสูงสุด 30 วินาที
- **Storage Strategy:** แปลงเป็น Data URL Base64 และบันทึกลงในออบเจ็กต์ `Person.voiceMemoUrl` ซึ่งจะถูกรวมในไฟล์ Metadata JSON โดยอัตโนมัติ

### 10.3 Multi-Format Text/TSV Batch Parser (`BatchImportModal`)
- **Input Stream:** ข้อความดิบที่คัดลอกจาก Excel (Tab-separated) หรือแชท LINE (Comma-separated / Numbered lists)
- **Tokenization:**
  - Regular Expression ตรวจจับ `\t` vs `,` vs `^\d+[\.\)]\s*(.+)\((.+)\)`
  - แปลงเป็น Array ของ `Partial<Person>`
- **Reconciliation Strategies:**
  - `assign_existing`: ปรับปรุงเฉพาะฟิลด์ชื่อ/กลุ่มในพิกัดเดิมโดยไม่เปลี่ยนตำแหน่ง $(x, y)$
  - `replace_all`: รีเซ็ตรายการทั้งหมด
  - `append_new`: สร้างบุคคลใหม่ต่อท้ายพร้อมรหัส ID ที่สร้างอัตโนมัติ

### 10.4 LocalStorage Draft Persistence with Quota Guard
- **Frequency:** Debounced ทุกๆ 600ms หลังมีการเปลี่ยนแปลงใน State `project`
- **Quota Safety Constraint:** คำนวณความยาวสตริงก่อนเขียน หากขนาดเกิน 4MB (เช่น ในกรณีภาพถ่ายดิบขนาดใหญ่) จะทำการกรองหรือแจ้งเตือนเพื่อป้องกัน `QuotaExceededError`
- **Hydration:** ดึงข้อมูลอัตโนมัติในรอบ Render แรก (`useEffect([], ...)`) และแสดงเวลาบันทึกล่าสุดบน Header

---
*เอกสารนี้จัดทำขึ้นเป็นพิมพ์เขียวมาตรฐาน (Design & Requirements Specification) สำหรับระบบ FriendMap AI เพื่อใช้เป็นกรอบการพัฒนาและต่อยอดในโครงการถัดไปได้อย่างสมบูรณ์*
