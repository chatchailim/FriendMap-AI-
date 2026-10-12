import { FriendMapProject, Person } from '../types/friendmap';

// Initial 31 candidate head positions mapped to the 3-tier group photo (~1536x959 / 2048x1272)
export const INITIAL_PEOPLE_31: Person[] = [
  // --- แถวยืนหลังสุด (Back Standing Row) ---
  {
    id: 'P001',
    name: 'กานต์สินี สุวรรณรัตน์',
    nickname: 'กานต์',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '081-423-9901', email: 'karnsinee.s@example.com', lineId: 'karn_suwan' },
    notes: 'ยืนริมซ้ายสุด เสื้อโปโลเหลือง-เทา',
    head: { x: 0.038, y: 0.285, radius: 0.026 },
    label: { dx: -0.015, dy: -0.11, locked: false, visible: true, customDirection: 'NW' },
    reviewed: true,
    depthRow: 'back_standing',
    visualHint: 'หญิง ยืนซ้ายสุด เสื้อโปโลเทาขลิบเหลือง',
  },
  {
    id: 'P002',
    name: 'พรทิพย์ เจริญพานิช',
    nickname: 'ปุ๊ก',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '089-551-2244', email: 'pook.c@example.com', lineId: 'pook_charoen' },
    notes: 'ใส่แว่น ยืนถัดจากกานต์',
    head: { x: 0.205, y: 0.305, radius: 0.025 },
    label: { dx: -0.065, dy: -0.11, locked: false, visible: true, customDirection: 'NW' },
    reviewed: true,
    depthRow: 'back_standing',
    visualHint: 'หญิง แว่นตา ยืนแถวหลังซ้าย',
  },
  {
    id: 'P003',
    name: 'ดร. อนุสรณ์ ชัยวัฒน์',
    nickname: 'พี่หนึ่ง',
    groupTag: 'ผู้บริหาร / แถวยืนหลัง',
    contact: { phone: '081-888-9123', email: 'anusorn.c@example.com', lineId: 'anusorn_dr' },
    notes: 'เสื้อเชิ้ตขาวลายริ้ว ใส่แว่น ประธานรุ่น',
    head: { x: 0.328, y: 0.235, radius: 0.028 },
    label: { dx: -0.02, dy: -0.125, locked: true, visible: true, customDirection: 'N' },
    reviewed: true,
    depthRow: 'back_standing',
    visualHint: 'ชาย แว่นตา เชิ้ตขาวริ้ว ยืนแถวหลัง',
  },
  {
    id: 'P004',
    name: 'ธนวัฒน์ ปรีชากุล',
    nickname: 'บอย',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '086-332-1100', email: 'thanawat.p@example.com', lineId: 'boy_precha' },
    notes: 'ใส่แว่น ยืนหลังพี่หนึ่ง',
    head: { x: 0.365, y: 0.260, radius: 0.024 },
    label: { dx: 0.035, dy: -0.12, locked: false, visible: true, customDirection: 'N' },
    reviewed: true,
    depthRow: 'back_standing',
    visualHint: 'ชาย ยืนหลังซ้อน',
  },
  {
    id: 'P005',
    name: 'วรพจน์ กิจตระกูล',
    nickname: 'แมน',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '084-221-9988', email: 'man.worapoj@example.com', lineId: 'man_kit' },
    notes: 'เสื้อโปโลเทาเข้ม ยืนข้างพี่หนึ่ง',
    head: { x: 0.395, y: 0.275, radius: 0.025 },
    label: { dx: 0.05, dy: -0.12, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'back_standing',
    visualHint: 'ชาย ยืนแถวหลัง',
  },
  {
    id: 'P006',
    name: 'พิเชษฐ์ เกียรติอนันต์',
    nickname: 'เอก',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '083-999-4411', email: 'pichet.k@example.com', lineId: 'ek_pichet' },
    notes: 'ยืนแถวหลังกลางภาพ',
    head: { x: 0.435, y: 0.255, radius: 0.026 },
    label: { dx: 0.02, dy: -0.125, locked: false, visible: true, customDirection: 'N' },
    reviewed: false,
    depthRow: 'back_standing',
    visualHint: 'ชาย ยืนหลังกลาง',
  },
  {
    id: 'P007',
    name: 'ภาณุมาศ ศิริเจริญ',
    nickname: 'กอล์ฟ',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '087-123-5566', email: 'panumas.g@example.com', lineId: 'golf_panu' },
    notes: 'เสื้อโปโลเทา-เหลือง ยืนแถวหลังสูง',
    head: { x: 0.540, y: 0.258, radius: 0.027 },
    label: { dx: 0.015, dy: -0.12, locked: false, visible: true, customDirection: 'N' },
    reviewed: true,
    depthRow: 'back_standing',
    visualHint: 'ชาย เสื้อโปโลเทาขลิบเหลือง แถวหลัง',
  },
  {
    id: 'P008',
    name: 'ณภัทร ลิมปิสวัสดิ์',
    nickname: 'เบิร์ด',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '085-321-4477', email: 'naphat.b@example.com', lineId: 'bird_lim' },
    notes: 'ยืนข้างกอล์ฟ',
    head: { x: 0.612, y: 0.285, radius: 0.025 },
    label: { dx: 0.035, dy: -0.11, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'back_standing',
    visualHint: 'ชาย ยืนแถวหลังขวา',
  },
  {
    id: 'P009',
    name: 'สมเกียรติ สิทธิพร',
    nickname: 'เก่ง',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '081-772-3344', email: 'keng.s@example.com', lineId: 'keng_sitthi' },
    notes: 'ยืนซ้อนข้างขวา',
    head: { x: 0.785, y: 0.285, radius: 0.024 },
    label: { dx: 0.05, dy: -0.11, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'back_standing',
    visualHint: 'ชาย ยืนหลังเยื้องขวา',
  },
  {
    id: 'P010',
    name: 'วิภาดา ธนกิจ',
    nickname: 'แจน',
    groupTag: 'แถวยืนหลัง',
    contact: { phone: '082-665-9922', email: 'vipada.j@example.com', lineId: 'jan_vipada' },
    notes: 'ใส่แว่น ยืนแถวหลังด้านขวา',
    head: { x: 0.835, y: 0.295, radius: 0.026 },
    label: { dx: 0.05, dy: -0.10, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'back_standing',
    visualHint: 'หญิง แว่นตา ยืนแถวหลังขวา',
  },
  {
    id: 'P011',
    name: 'ชัยวัฒน์ มงคลศิลป์',
    nickname: 'ป้อม',
    groupTag: 'ผู้บริหาร / แถวยืนหลัง',
    contact: { phone: '089-445-6677', email: 'chaiwat.m@example.com', lineId: 'pom_chaiwat' },
    notes: 'เสื้อโปโลเทา-เหลือง ยืนขวาสุด',
    head: { x: 0.940, y: 0.230, radius: 0.030 },
    label: { dx: 0.02, dy: -0.125, locked: true, visible: true, customDirection: 'N' },
    reviewed: true,
    depthRow: 'back_standing',
    visualHint: 'ชาย รูปร่างสูง ยืนริมขวาสุด เสื้อโปโล',
  },

  // --- แถวกลาง (Middle Row) ---
  {
    id: 'P012',
    name: 'ชุติมา อัศวเดช',
    nickname: 'เปิ้ล',
    groupTag: 'แถวกลาง',
    contact: { phone: '081-334-5599', email: 'chutima.p@example.com', lineId: 'ple_chuti' },
    notes: 'เสื้อแจ็คเก็ตยีนส์เข้ม ยืนเอียงซ้าย',
    head: { x: 0.142, y: 0.380, radius: 0.028 },
    label: { dx: -0.075, dy: -0.065, locked: false, visible: true, customDirection: 'W' },
    reviewed: true,
    depthRow: 'middle_standing',
    visualHint: 'หญิง เสื้อยีนส์เข้ม ยืนซ้าย',
  },
  {
    id: 'P013',
    name: 'วิรัช บวรเกียรติ',
    nickname: 'โต้ง',
    groupTag: 'แถวกลาง',
    contact: { phone: '086-778-9900', email: 'wirat.t@example.com', lineId: 'tong_wirat' },
    notes: 'เสื้อโปโลเทา ยืนหน้าพี่หนึ่ง',
    head: { x: 0.238, y: 0.385, radius: 0.028 },
    label: { dx: -0.065, dy: 0.065, locked: false, visible: true, customDirection: 'SW' },
    reviewed: true,
    depthRow: 'middle_standing',
    visualHint: 'ชาย เสื้อโปโลเทา ยืนหน้าซ้าย',
  },
  {
    id: 'P014',
    name: 'สุทธิดา โชคอนันต์',
    nickname: 'นิด',
    groupTag: 'แถวกลาง',
    contact: { phone: '084-556-7711', email: 'sutthida.n@example.com', lineId: 'nid_sutthi' },
    notes: 'ผมยาว ใส่แว่น เสื้อดำ',
    head: { x: 0.455, y: 0.315, radius: 0.024 },
    label: { dx: -0.045, dy: -0.08, locked: false, visible: true, customDirection: 'NW' },
    reviewed: false,
    depthRow: 'middle_standing',
    visualHint: 'หญิง ผมยาว เสื้อดำ ยืนกลาง',
  },
  {
    id: 'P015',
    name: 'กานดา ภักดีชน',
    nickname: 'แนท',
    groupTag: 'แถวกลาง',
    contact: { phone: '081-229-8800', email: 'kanda.nat@example.com', lineId: 'nat_kanda' },
    notes: 'เสื้อลูกไม้ดำ ยิ้มสดใสกลางภาพ',
    head: { x: 0.505, y: 0.300, radius: 0.027 },
    label: { dx: 0.05, dy: -0.09, locked: false, visible: true, customDirection: 'NE' },
    reviewed: true,
    depthRow: 'middle_standing',
    visualHint: 'หญิง ยิ้มสวย เสื้อลูกไม้ดำ กลางภาพ',
  },
  {
    id: 'P016',
    name: 'ดารณี ภัทรพล',
    nickname: 'ต่าย',
    groupTag: 'แถวกลาง',
    contact: { phone: '083-441-2288', email: 'daranee.t@example.com', lineId: 'tai_daranee' },
    notes: 'แว่นตา เสื้อน้ำเงินคล้องป้ายชื่อ',
    head: { x: 0.582, y: 0.320, radius: 0.026 },
    label: { dx: -0.025, dy: -0.08, locked: false, visible: true, customDirection: 'N' },
    reviewed: true,
    depthRow: 'middle_standing',
    visualHint: 'หญิง แว่นตา เสื้อน้ำเงินมีป้ายชื่อ',
  },
  {
    id: 'P017',
    name: 'มาริสา จันทร์แก้ว',
    nickname: 'หน่อย',
    groupTag: 'แถวกลาง',
    contact: { phone: '089-112-3355', email: 'marisa.n@example.com', lineId: 'noi_marisa' },
    notes: 'เสื้อขาว ยืนถัดจากต่าย',
    head: { x: 0.638, y: 0.325, radius: 0.026 },
    label: { dx: 0.045, dy: -0.08, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'middle_standing',
    visualHint: 'หญิง เสื้อขาว ยืนกลางขวา',
  },
  {
    id: 'P018',
    name: 'อรทัย วงศ์สุวรรณ',
    nickname: 'อุ้ม',
    groupTag: 'แถวกลาง',
    contact: { phone: '087-889-4400', email: 'orathai.o@example.com', lineId: 'oum_orathai' },
    notes: 'เสื้อลาย ยืนหลัง',
    head: { x: 0.690, y: 0.328, radius: 0.025 },
    label: { dx: 0.035, dy: -0.08, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'middle_standing',
    visualHint: 'หญิง เสื้อลายดอก ยืนแถวกลาง',
  },
  {
    id: 'P019',
    name: 'พัชรี สุขสมบูรณ์',
    nickname: 'ก้อย',
    groupTag: 'แถวกลาง',
    contact: { phone: '085-667-8899', email: 'patcharee.k@example.com', lineId: 'koy_patch' },
    notes: 'เสื้อม่วงพาสเทล ใส่แว่น',
    head: { x: 0.748, y: 0.328, radius: 0.025 },
    label: { dx: 0.035, dy: -0.08, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'middle_standing',
    visualHint: 'หญิง เสื้อม่วง แว่นตา',
  },
  {
    id: 'P020',
    name: 'ศิริพร บุญเสริม',
    nickname: 'นุ้ย',
    groupTag: 'แถวกลาง',
    contact: { phone: '082-334-1188', email: 'siriporn.n@example.com', lineId: 'nui_siri' },
    notes: 'เสื้อเขียว ยิ้มหวาน',
    head: { x: 0.795, y: 0.335, radius: 0.027 },
    label: { dx: 0.05, dy: -0.08, locked: false, visible: true, customDirection: 'NE' },
    reviewed: true,
    depthRow: 'middle_standing',
    visualHint: 'หญิง เสื้อเขียว แขนกุด',
  },
  {
    id: 'P021',
    name: 'วรัญญา รุ่งเรือง',
    nickname: 'แอน',
    groupTag: 'แถวกลาง',
    contact: { phone: '086-441-2299', email: 'waranya.a@example.com', lineId: 'ann_waranya' },
    notes: 'ผมยาวตรง ยืนริมขวาแถวกลาง',
    head: { x: 0.892, y: 0.475, radius: 0.028 },
    label: { dx: 0.055, dy: -0.07, locked: false, visible: true, customDirection: 'E' },
    reviewed: false,
    depthRow: 'middle_standing',
    visualHint: 'หญิง ผมยาวประบ่า ยืนริมขวา',
  },

  // --- แถวนั่งและคุกเข่าด้านหน้า (Front Kneeling & Seated Row) ---
  {
    id: 'P022',
    name: 'ธีรศักดิ์ เวชวิสิทธิ์',
    nickname: 'เต้ย',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '081-992-3311', email: 'teerasak.t@example.com', lineId: 'toey_teera' },
    notes: 'เสื้อโปโลเทา ใส่แว่น คุกเข่าซ้าย',
    head: { x: 0.285, y: 0.455, radius: 0.030 },
    label: { dx: -0.065, dy: -0.065, locked: false, visible: true, customDirection: 'NW' },
    reviewed: true,
    depthRow: 'front_seated',
    visualHint: 'ชาย แว่นตา เสื้อโปโลเทา นั่งคุกเข่าซ้าย',
  },
  {
    id: 'P023',
    name: 'ประสิทธิ์ มงคลชัย',
    nickname: 'อาร์ต',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '084-771-5522', email: 'prasit.a@example.com', lineId: 'art_prasit' },
    notes: 'ใส่แว่น ย่อตัวอยู่หลังแมน',
    head: { x: 0.395, y: 0.448, radius: 0.027 },
    label: { dx: -0.045, dy: -0.07, locked: false, visible: true, customDirection: 'NW' },
    reviewed: false,
    depthRow: 'front_seated',
    visualHint: 'ชาย แว่นตา แถวหน้าซ้าย',
  },
  {
    id: 'P024',
    name: 'สมชาย ประเสริฐสุข',
    nickname: 'บอล',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '089-661-7788', email: 'somchai.b@example.com', lineId: 'ball_somchai' },
    notes: 'คุกเข่าหน้า มีกระเป๋าคาดเอวสีเขียวขี้ม้า รองเท้าแตะรัดส้น',
    head: { x: 0.425, y: 0.525, radius: 0.032 },
    label: { dx: -0.065, dy: 0.065, locked: false, visible: true, customDirection: 'SW' },
    reviewed: true,
    depthRow: 'front_seated',
    visualHint: 'ชาย คุกเข่าหน้า คาดกระเป๋าเอว โปโลเทา',
  },
  {
    id: 'P025',
    name: 'สุรชัย ศรีสัจจา',
    nickname: 'วิน',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '083-228-4411', email: 'surachai.w@example.com', lineId: 'win_sura' },
    notes: 'เอียงคอ ใส่แว่น เสื้อลาย',
    head: { x: 0.478, y: 0.495, radius: 0.026 },
    label: { dx: -0.03, dy: -0.065, locked: false, visible: true, customDirection: 'N' },
    reviewed: false,
    depthRow: 'front_seated',
    visualHint: 'ชาย แว่นตา เอียงศีรษะ เสื้อยืดลาย',
  },
  {
    id: 'P026',
    name: 'กิตติศักดิ์ ธรรมนูญ',
    nickname: 'ตั้ม',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '087-449-3300', email: 'kittisak.t@example.com', lineId: 'tum_kitti' },
    notes: 'เสื้อเชิ้ตชมพู แว่นตา ยิ้มกว้าง',
    head: { x: 0.528, y: 0.465, radius: 0.028 },
    label: { dx: 0.035, dy: -0.07, locked: false, visible: true, customDirection: 'NE' },
    reviewed: true,
    depthRow: 'front_seated',
    visualHint: 'ชาย เชิ้ตสีชมพูอ่อน แว่นตา ยิ้ม',
  },
  {
    id: 'P027',
    name: 'ชูชาติ เกตุแก้ว',
    nickname: 'ชาติ',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '081-552-4411', email: 'choochart.k@example.com', lineId: 'chart_choo' },
    notes: 'นั่งคุกเข่าอยู่หลังพี่ตั้ม',
    head: { x: 0.580, y: 0.448, radius: 0.026 },
    label: { dx: 0.045, dy: -0.065, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'front_seated',
    visualHint: 'ชาย แถวกลางค่อนหน้า',
  },
  {
    id: 'P028',
    name: 'ยุพาพร วารินทร์',
    nickname: 'มด',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '085-779-3322', email: 'yupaporn.m@example.com', lineId: 'mod_yupa' },
    notes: 'เสื้อน้ำตาล แว่นตา ผมสั้น',
    head: { x: 0.612, y: 0.475, radius: 0.026 },
    label: { dx: -0.035, dy: 0.065, locked: false, visible: true, customDirection: 'S' },
    reviewed: false,
    depthRow: 'front_seated',
    visualHint: 'หญิง เสื้อน้ำตาล แว่นตา ผมสั้น',
  },
  {
    id: 'P029',
    name: 'ศศิธร เจียมจิตต์',
    nickname: 'จอย',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '088-332-9988', email: 'sasithorn.j@example.com', lineId: 'joy_sasi' },
    notes: 'เสื้อสูทเบลเซอร์สีน้ำเงินสด นั่งพับเพียบบนพื้นถนน',
    head: { x: 0.665, y: 0.560, radius: 0.032 },
    label: { dx: -0.065, dy: 0.065, locked: false, visible: true, customDirection: 'SW' },
    reviewed: true,
    depthRow: 'front_seated',
    visualHint: 'หญิง สูทเบลเซอร์น้ำเงิน นั่งพื้นถนน ยิ้มกว้าง',
  },
  {
    id: 'P030',
    name: 'วราวุธ สุริยา',
    nickname: 'ภพ',
    groupTag: 'แถวนั่งหน้า',
    contact: { phone: '082-114-6655', email: 'warawut.p@example.com', lineId: 'phop_wara' },
    notes: 'แว่นตา เสื้อดำ นั่งคุกเข่า',
    head: { x: 0.742, y: 0.485, radius: 0.028 },
    label: { dx: 0.05, dy: -0.065, locked: false, visible: true, customDirection: 'NE' },
    reviewed: false,
    depthRow: 'front_seated',
    visualHint: 'ชาย แว่นตา เสื้อดำ แถวนั่งขวา',
  },
  {
    id: 'P031',
    name: 'ชาติชาย วัฒนกุล',
    nickname: 'พี่ชาติ (ช่างภาพ)',
    groupTag: 'ช่างภาพ / แถวนั่งหน้า',
    contact: { phone: '081-345-6789', email: 'chatchai.next@gmail.com', lineId: 'chatchai_next' },
    notes: 'เสื้อโปโลฟ้า กางเกงกากี นั่งเหยียดขาบนพื้น ถือกล้อง DSLR เลนส์ใหญ่',
    head: { x: 0.778, y: 0.565, radius: 0.034 },
    label: { dx: 0.055, dy: 0.065, locked: true, visible: true, customDirection: 'SE' },
    reviewed: true,
    depthRow: 'front_seated',
    visualHint: 'ชาย เสื้อฟ้า นั่งเหยียดขาบนพื้น ถือกล้อง DSLR ในมือ',
  },
];

// High fidelity synthetic illustration representing the reunion night scene (1536x959, 16:10)
// This serves as the instant zero-broken-image fallback until the user uploads their original photo!
export function createSyntheticSampleImageUri(): string {
  // We produce an SVG data URL with the full night scene composition, street light rays, and character silhouettes
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 959" width="1536" height="959">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a101d"/>
        <stop offset="45%" stop-color="#141e30"/>
        <stop offset="60%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="beam1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.45"/>
        <stop offset="60%" stop-color="#38bdf8" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="beam2" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#d97706" stop-opacity="0"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <!-- Dark night background with foliage -->
    <rect width="1536" height="959" fill="url(#bg)"/>
    <path d="M0,0 Q200,300 0,600 L0,0 Z" fill="#064e3b" opacity="0.35"/>
    <path d="M1536,0 Q1300,250 1536,550 L1536,0 Z" fill="#064e3b" opacity="0.25"/>

    <!-- Pavement ground with yellow road line -->
    <path d="M0,640 L1536,610 L1536,959 L0,959 Z" fill="url(#road)"/>
    <path d="M0,860 L1536,790" stroke="#facc15" stroke-width="18" stroke-dasharray="140,40" opacity="0.85"/>

    <!-- Festive light flare beams in the night sky -->
    <polygon points="980,80 0,220 0,260 980,80" fill="url(#beam1)"/>
    <polygon points="980,80 1536,360 1536,390 980,80" fill="url(#beam2)"/>
    <circle cx="980" cy="80" r="14" fill="#a7f3d0" filter="url(#glow)"/>
    <circle cx="830" cy="130" r="10" fill="#fef08a" filter="url(#glow)"/>

    <!-- Group photo character silhouettes indicating rows -->
    <!-- Back row silhouettes -->
    <g fill="#1e293b" stroke="#334155" stroke-width="2">
      <ellipse cx="60" cy="380" rx="35" ry="90"/>
      <ellipse cx="310" cy="360" rx="45" ry="110"/>
      <ellipse cx="505" cy="330" rx="45" ry="120"/>
      <ellipse cx="610" cy="340" rx="42" ry="115"/>
      <ellipse cx="830" cy="345" rx="45" ry="115"/>
      <ellipse cx="940" cy="350" rx="48" ry="110"/>
      <ellipse cx="1440" cy="310" rx="55" ry="130"/>
    </g>

    <!-- Foreground group clusters with clothing colors -->
    <g opacity="0.9">
      <!-- Grey polo cluster (left) -->
      <path d="M220,530 Q370,510 520,540 L480,780 L250,770 Z" fill="#475569"/>
      <!-- Blue blazer seated front center -->
      <path d="M960,560 Q1040,550 1120,580 L1100,740 L970,730 Z" fill="#1d4ed8"/>
      <!-- Photographer seated on right pavement with khaki pants -->
      <path d="M1150,560 Q1240,560 1280,620 L1360,780 L1080,790 Z" fill="#0284c7"/>
      <path d="M1020,740 L1340,780 L1180,880 Z" fill="#d6d3d1"/>
      <!-- DSLR camera body -->
      <rect x="1000" y="655" width="65" height="45" rx="8" fill="#18181b"/>
      <circle cx="1025" cy="678" r="18" fill="#27272a" stroke="#52525b" stroke-width="3"/>
    </g>

    <!-- Visual watermark placeholder -->
    <g transform="translate(48, 910)" font-family="Prompt, sans-serif" fill="#94a3b8" font-size="16">
      <text x="0" y="0">FriendMap AI · ภาพหมู่รุ่น 31 คน (ตัวอย่างภาพสังเคราะห์ — สามารถคลิก "อัปโหลดภาพจริง" เพื่อใส่ภาพต้นฉบับได้ทันที)</text>
    </g>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export const EMPTY_PROJECT: FriendMapProject = {
  version: '1.0.0',
  title: 'โปรเจกต์ใหม่ (FriendMap)',
  updatedAt: new Date().toISOString(),
  photo: {
    id: 'empty_initial',
    title: 'ยังไม่มีภาพถ่ายในระบบ',
    fileName: '',
    url: '',
    width: 1536,
    height: 959,
    aspectRatio: 1536 / 959,
    sourceType: 'empty',
    notes: 'กระดานเริ่มต้นว่างเปล่า พร้อมสำหรับแนบภาพจริง หรือกดจำลองภาพสาธิต',
  },
  people: [],
  settings: {
    balloonTheme: 'cartoon',
    balloonColor: '#0284c7',
    leaderLineColor: '#facc15',
    leaderLineWidth: 2,
    leaderLineStyle: 'cartoon',
    badgeShape: 'rounded',
    fontSize: 13,
    showNicknamesOnly: false,
    showIds: true,
    showDots: true,
    showFacesBBox: false,
    privacyMode: false,
    autoAvoidFaces: true,
  },
};

export const SIMULATION_PROJECT: FriendMapProject = {
  version: '1.0.0',
  title: '32980304_10214774071859417_974758122205741056_n',
  updatedAt: new Date().toISOString(),
  photo: {
    id: '32980304_10214774071859417_974758122205741056_n',
    title: '32980304_10214774071859417_974758122205741056_n',
    fileName: '32980304_10214774071859417_974758122205741056_n.jpg',
    url: createSyntheticSampleImageUri(),
    width: 1536,
    height: 959,
    aspectRatio: 1536 / 959,
    sourceType: 'sample',
    fileSizeBytes: 1474560,
    mimeType: 'image/jpeg',
    capturedDate: '2026-10-11',
    locationName: 'งานคืนสู่เหย้าศิษย์เก่า (Night Reunion Event)',
    cameraInfo: 'Canon EOS / Low Light Evening',
    depthLayers: 3,
    notes: 'ภาพหมู่กลางคืน ~30 คน เรียงซ้อน 3 ระดับความลึก (ยืนหลัง, แถวกลาง, นั่งพื้นหน้า)',
  },
  people: INITIAL_PEOPLE_31,
  settings: {
    balloonTheme: 'cartoon',
    balloonColor: '#0284c7',
    leaderLineColor: '#facc15',
    leaderLineWidth: 2,
    leaderLineStyle: 'cartoon',
    badgeShape: 'rounded',
    fontSize: 13,
    showNicknamesOnly: false,
    showIds: true,
    showDots: true,
    showFacesBBox: false,
    privacyMode: true,
    autoAvoidFaces: true,
  },
};

export const DEFAULT_PROJECT: FriendMapProject = EMPTY_PROJECT;

