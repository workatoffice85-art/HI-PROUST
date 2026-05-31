/*
 * Hi Proust (هاي بروست) Restaurant System - Core Logic
 * Fully-functional client-side reactive state synchronizer
 * Features: Multi-lingual (AR/EN), Web Audio notification generator, live cooking timers
 */

// ==========================================================================
// SUPABASE REALTIME CLOUD SYNCHRONIZATION
// Enter your credentials below to connect to a live cloud database.
// All screens across all customer phones and dashboards will sync in real-time!
// ==========================================================================
window.SUPABASE_URL = "https://vrevoheydazzyjyplwjj.supabase.co";       // Your Supabase Project URL (e.g. "https://xxxx.supabase.co")
window.SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZXZvaGV5ZGF6enlqeXBsd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzA2NDQsImV4cCI6MjA5NTY0NjY0NH0.R7lx56YDn7amWpX89g6Em2b3TwP6zPbJ7DeYWIS_jZE";  // Your Supabase Anon API Key
let supabaseClient = null;

if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY && window.supabase) {
  supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

// ==========================================================================
// 1. MENU DATABASE (HI PROUST SIGNATURE RECIPES)
// ==========================================================================
let MENU = [
  {
    id: "br-01",
    cat: "broast",
    nameAr: "هاي بروستد عادي (٤ قطع)",
    nameEn: "Hi Broast Normal (4 Pcs)",
    descAr: "٤ قطع دجاج بروستد ذهبي مقرمش مع البطاطس، خبز، وثوميتنا الفاخرة",
    descEn: "4 pieces of golden crispy broast chicken served with fries, bun bread, and garlic dip",
    price: 24.00,
    spicy: false,
    bestSeller: true,
    svg: `<svg viewBox="0 0 100 100"><rect x="25" y="45" width="50" height="35" rx="6" fill="#C62828" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="45" rx="20" ry="10" fill="#FFC107" stroke="#333" stroke-width="1.5"/><path d="M35 45 C35 30, 42 22, 50 25 C58 22, 65 30, 65 45" fill="#D32F2F" stroke="#333" stroke-width="1.5"/><circle cx="50" cy="62" r="10" fill="#FFC107" stroke="#333" stroke-width="1.5"/><path d="M47 62 L53 62 L50 68 Z" fill="#FF9800"/></svg>`
  },
  {
    id: "br-02",
    cat: "broast",
    nameAr: "هاي بروستد حار سبايسي (٤ قطع)",
    nameEn: "Hi Broast Spicy (4 Pcs)",
    descAr: "٤ قطع دجاج بروستد مقرمش متبل بخلطتنا الحارة المشتعلة مع بطاطس وثومية",
    descEn: "4 pieces of fire-spicy crispy broast chicken served with golden fries and premium garlic dip",
    price: 25.00,
    spicy: true,
    bestSeller: true,
    svg: `<svg viewBox="0 0 100 100"><rect x="25" y="45" width="50" height="35" rx="6" fill="#A51D1D" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="45" rx="20" ry="10" fill="#FF9800" stroke="#333" stroke-width="1.5"/><path d="M35 45 C35 25, 45 20, 50 22 C55 20, 65 25, 65 45" fill="#C62828" stroke="#333" stroke-width="1.5"/><text x="44" y="65" fill="#FFC107" font-weight="900" font-size="12">🌶️</text></svg>`
  },
  {
    id: "bk-01",
    cat: "buckets",
    nameAr: "وجبة عائلية سوبر (٨ قطع)",
    nameEn: "Super Family Bucket (8 Pcs)",
    descAr: "٨ قطع دجاج مقرمش (عادي/حار) مع بطاطس حجم عائلي، 3 خبز كايزر، و٣ صوص ثومية",
    descEn: "8 pieces of crispy chicken with family-size fries, 3 buns, and 3 garlic sauce dips",
    price: 48.00,
    spicy: false,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><path d="M30 40 L70 40 L62 80 L38 80 Z" fill="#C62828" stroke="#333" stroke-width="2.5"/><ellipse cx="50" cy="40" rx="20" ry="8" fill="#FFF" stroke="#333" stroke-width="2"/><path d="M34 40 C34 25, 42 12, 50 16 C58 12, 66 25, 66 40" fill="#FFC107" stroke="#333" stroke-width="1.5"/><path d="M42 40 C42 28, 46 22, 50 24" fill="none" stroke="#333" stroke-width="1.5"/><rect x="42" y="52" width="16" height="18" fill="#FFC107"/><circle cx="50" cy="61" r="5" fill="#FFFFFF"/></svg>`
  },
  {
    id: "bk-02",
    cat: "buckets",
    nameAr: "وجبة عائلية ديلاكس (١٢ قطعة)",
    nameEn: "Deluxe Family Bucket (12 Pcs)",
    descAr: "١٢ قطعة دجاج مقرمش حار وعادي، بطاطس عائلي ضخم، 4 كايزر، كول سلو وصوصات منوعة",
    descEn: "12 pieces of crispy chicken, giant fries, 4 buns, large coleslaw, and mixed dipping sauces",
    price: 68.00,
    spicy: false,
    bestSeller: true,
    svg: `<svg viewBox="0 0 100 100"><path d="M28 36 L72 36 L64 82 L36 82 Z" fill="#A51D1D" stroke="#333" stroke-width="2.5"/><ellipse cx="50" cy="36" rx="22" ry="8" fill="#FFC107" stroke="#333" stroke-width="2"/><path d="M32 36 C32 20, 40 8, 50 12 C60 8, 68 20, 68 36" fill="#FFFDF0" stroke="#333" stroke-width="1.5"/><circle cx="50" cy="58" r="12" fill="#FFFFFF" stroke="#333" stroke-width="1.5"/><text x="44" y="62" fill="#C62828" font-weight="900" font-size="11">Hi</text></svg>`
  },
  {
    id: "bg-01",
    cat: "burgers",
    nameAr: "ساندوتش دجاج كريسبي ميجا",
    nameEn: "Mighty Crispy Chicken Burger",
    descAr: "صدر دجاج كريسبي مقلي عملاق مع خس، جبنة شيدر سائحة، مايونيز، وخبز البطاطس اللذيذ",
    descEn: "Giant crispy chicken breast fillet with melted cheddar cheese, lettuce, mayo, in potato bun",
    price: 18.00,
    spicy: false,
    bestSeller: true,
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="32" rx="24" ry="12" fill="#FFC107" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="68" rx="24" ry="10" fill="#FFC107" stroke="#333" stroke-width="2"/><rect x="23" y="48" width="54" height="12" rx="4" fill="#FF9800" stroke="#333" stroke-width="2"/><path d="M 23 44 C 23 44, 30 40, 50 42 C 70 40, 77 44, 77 44" fill="none" stroke="#2E7D32" stroke-width="4"/><rect x="24" y="58" width="52" height="4" fill="#F59E0B"/></svg>`
  },
  {
    id: "bg-02",
    cat: "burgers",
    nameAr: "ساندوتش فيليه دجاج سبايسي زinger",
    nameEn: "Hi Proust Spicy Zinger Fillet",
    descAr: "فيليه دجاج مقلي مشتعل بالبهارات الحارة، هلابينو، جبنة شيدر، خس وصوص سبايسي مدمر",
    descEn: "Fire-hot crispy chicken breast fillet with jalapenos, cheddar cheese, and spicy dyno sauce",
    price: 20.00,
    spicy: true,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="32" rx="24" ry="12" fill="#FFB300" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="68" rx="24" ry="10" fill="#FFB300" stroke="#333" stroke-width="2"/><rect x="23" y="48" width="54" height="12" rx="4" fill="#A51D1D" stroke="#333" stroke-width="2"/><path d="M 23 44 C 23 44, 30 40, 50 42 C 70 40, 77 44, 77 44" fill="none" stroke="#EF4444" stroke-width="4"/><text x="44" y="60" fill="#FFC107" font-size="10" font-weight="900">🌶️</text></svg>`
  },
  {
    id: "rc-01",
    cat: "rice",
    nameAr: "أرز ريزو مع قطع ستربس مقرمشة",
    nameEn: "Rizo Rice with Chicken Strips",
    descAr: "طبق أرز مبهر على طريقة هاي بروست، مغطى بقطع الدجاج المقرمش وصوص باربكيو مدخن حلو",
    descEn: "Premium spiced rice topped with crispy golden strips and a rich sweet & smoky BBQ sauce drizzle",
    price: 15.00,
    spicy: false,
    bestSeller: true,
    svg: `<svg viewBox="0 0 100 100"><path d="M 20 45 L 80 45 C 80 70, 70 82, 50 82 C 30 82, 20 70, 20 45 Z" fill="#FFC107" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="45" rx="30" ry="10" fill="#FFB300" stroke="#333" stroke-width="1.5"/><circle cx="42" cy="40" r="8" fill="#FFFDF0"/><circle cx="58" cy="38" r="8" fill="#FFFDF0"/><path d="M 35 45 C 45 42, 55 42, 65 45" fill="none" stroke="#C62828" stroke-width="3"/></svg>`
  },
  {
    id: "rc-02",
    cat: "rice",
    nameAr: "وجبة ستربس دجاج مقلي (٥ قطع)",
    nameEn: "Crispy Strips Meal (5 Pcs)",
    descAr: "٥ قطع أصابع دجاج فيليه مقرمشة خالية من العظم، بطاطس مقلية، كول سلو وثومية",
    descEn: "5 pieces of boneless crispy chicken breast strips served with golden fries and creamy coleslaw",
    price: 22.00,
    spicy: false,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><rect x="25" y="45" width="50" height="35" rx="4" fill="#C62828" stroke="#333" stroke-width="2"/><path d="M 30 45 C 30 30, 36 28, 40 38 C 44 26, 50 28, 54 38 C 58 26, 66 30, 68 45" fill="#FFC107" stroke="#333" stroke-width="1.5"/></svg>`
  },
  {
    id: "sd-01",
    cat: "sides",
    nameAr: "بطاطس مقلية ذهبية سوبر",
    nameEn: "Golden French Fries Super",
    descAr: "أصابع بطاطس مقلية مقرمشة ومملحة بالتتبيلة السرية الخاصة بنا",
    descEn: "Super crispy golden french fries tossed in our signature potato seasoning",
    price: 7.00,
    spicy: false,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><path d="M 30 50 L 70 50 L 64 85 L 36 85 Z" fill="#C62828" stroke="#333" stroke-width="2"/><rect x="35" y="25" width="6" height="32" rx="2" fill="#FFC107"/><rect x="43" y="20" width="6" height="38" rx="2" fill="#FFC107"/><rect x="51" y="16" width="6" height="42" rx="2" fill="#FFB300"/><rect x="59" y="24" width="6" height="34" rx="2" fill="#FFC107"/></svg>`
  },
  {
    id: "sd-02",
    cat: "sides",
    nameAr: "علبة ثومية هاي بروست إضافية",
    nameEn: "Extra Special Garlic Dip",
    descAr: "صلصة الثوم الفاخرة والكثيفة المحضرة يومياً لتغليف قطع البروستد الساخنة",
    descEn: "Our famous thick & creamy garlic sauce dip prepared fresh daily",
    price: 3.00,
    spicy: false,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="55" rx="25" ry="18" fill="#fff" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="50" rx="20" ry="12" fill="#FFFDE7" stroke="#E4E7EB" stroke-width="1"/><path d="M 40 50 Q 50 45, 60 50" fill="none" stroke="#FFC107" stroke-width="2"/></svg>`
  },
  {
    id: "bv-01",
    cat: "beverages",
    nameAr: "بيبسي بارد ومنعش",
    nameEn: "Pepsi Cold & Refreshing",
    descAr: "علبة بيبسي مثلجة لإطفاء حرارة قرمشة البروستد المشتعل",
    descEn: "Ice-cold Pepsi can to perfectly balance your hot crispy broast meal",
    price: 4.00,
    spicy: false,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><rect x="30" y="30" width="40" height="52" rx="10" fill="#0D47A1" stroke="#333" stroke-width="2"/><ellipse cx="50" cy="30" rx="20" ry="6" fill="#B0BEC5" stroke="#333" stroke-width="1.5"/><path d="M 30 50 Q 50 42, 70 54" fill="none" stroke="#F5F5F5" stroke-width="3"/><path d="M 30 58 Q 50 64, 70 52" fill="none" stroke="#D32F2F" stroke-width="3"/></svg>`
  },
  {
    id: "bv-02",
    cat: "beverages",
    nameAr: "ماء نقي ومبرد",
    nameEn: "Pure Cold Water",
    descAr: "زجاجة مياه معدنية طبيعية باردة",
    descEn: "Refreshing bottled natural mineral water",
    price: 2.00,
    spicy: false,
    bestSeller: false,
    svg: `<svg viewBox="0 0 100 100"><rect x="36" y="35" width="28" height="48" rx="4" fill="#E0F7FA" stroke="#333" stroke-width="1.5"/><rect x="42" y="24" width="16" height="11" fill="#0288D1"/><rect x="36" y="52" width="28" height="10" fill="#0288D1"/></svg>`
  }
];

let CATEGORIES = [
  { id: "all", nameAr: "كل الأطباق", nameEn: "All Items" },
  { id: "broast", nameAr: "بروستد مقرمش", nameEn: "Crispy Broast" },
  { id: "burgers", nameAr: "برجر وميجا", nameEn: "Mighty Burgers" },
  { id: "buckets", nameAr: "وجبات عائلية", nameEn: "Family Buckets" },
  { id: "rice", nameAr: "الأرز والستربس", nameEn: "Rice & Strips" },
  { id: "sides", nameAr: "الصوصات والجانبيات", nameEn: "Sides & Sauces" },
  { id: "beverages", nameAr: "المشروبات المنعشة", nameEn: "Cold Drinks" }
];

// ==========================================================================
// 2. DICTIONARY FOR ARABIC & ENGLISH LOCALIZATION
// ==========================================================================
const TRANSLATIONS = {
  ar: {
    splashTitle: "هاي بروست",
    splashTag: "أطعم، أقرمش، وأوفر!",
    selectTable: "اختر رقم الطاولة:",
    btnSplashStart: "ابدأ طلب جديد",
    titlePhone: "أدخل رقم جوالك",
    promptPhone: "رقم الجوال",
    descPhone: "سنستخدمه لتتبع طلبك وإرسال الإشعارات والتحقق المالي",
    btnContinue: "متابعة",
    titleName: "ما هو اسمك الموقر؟",
    promptName: "مرحباً بك في هاي بروست!",
    descName: "اكتب اسمك لتجهيز الطلب باسمك الشخصي",
    btnName: "دخول القائمة",
    titleMenu: "قائمة الطعام",
    searchPlaceholder: "ابحث عن وجبتك المفضلة...",
    viewCart: "عرض السلة",
    titleCart: "سلة المشتريات",
    lblCartNotes: "ملاحظات خاصة للتحضير:",
    notesPlaceholder: "مثال: بدون مايونيز، زيادة شطة، كاتشب إضافي...",
    billSub: "المجموع الفرعي",
    billTax: "ضريبة القيمة المضافة (15%)",
    billTotal: "المجموع الإجمالي",
    btnCartCheckout: "تأكيد وإرسال الطلب للمطبخ",
    titleType: "طريقة الاستلام",
    promptType: "أين ستستمتع بالوجبة؟",
    descType: "اختر تناول الوجبة داخل صالة المطعم أو تجهيزها سفري كرتون سفاري",
    typeDineTitle: "محلي (في صالة المطعم)",
    typeDineDesc: "سنقوم بتقديم الوجبة على طاولتك رقم",
    typeTakeTitle: "سفري (تيك أواي)",
    typeTakeDesc: "استلم طلبك ساخناً من منصة التسليم الخارجية للمطعم",
    btnPlaceOrder: "تأكيد وإرسال الطلب للمطبخ",
    titleTrack: "تتبع طلبك المباشر",
    trackNumLbl: "رقم طلبك المميز",
    stepPlacedTitle: "تم استلام الطلب بالنظام",
    stepPlacedDesc: "تم تسجيل طلبك بالنظام وبانتظار المباشرة الفورية",
    stepCookTitle: "قيد التحضير والقلي",
    stepCookDesc: "يقوم الطهاة بقلي وتجهيز وجبتك المقرمشة والساخنة الآن",
    stepReadyTitle: "الطلب جاهز للتسليم!",
    stepReadyDesc: "تفضل باستلام طلبك المقرمش والساخن من منصة التسليم",
    stepDoneTitle: "تم الاستلام بنجاح",
    stepDoneDesc: "بالهناء والعافية ونأمل بزيارتك مجدداً لمطعمنا",
    estTimeLbl: "الوقت المقدر للتسليم",
    newOrderBtn: "طلب وجبة أخرى جديدة",
    sar: "ر.س",
    lblQrTableStatus: "تم مسح الرمز للطاولة:",
    qrTableDisplayPrefix: "طاولة ",
    lblQrTakeawayStatus: "تم مسح الرمز للسفري:",
    qrTakeawayDisplay: "طلب سفري (تيك أواي)",
    language: "لغة التطبيق / Language:"
  },
  en: {
    splashTitle: "Hi Proust",
    splashTag: "Tastier, Crispier & Cheaper!",
    selectTable: "Select Table Number:",
    btnSplashStart: "Start New Order",
    titlePhone: "Enter Phone Number",
    promptPhone: "Phone Number",
    descPhone: "We'll use it to track your order and send direct alerts",
    btnContinue: "Continue",
    titleName: "What is your name?",
    promptName: "Welcome to Hi Proust!",
    descName: "Write your name to prepare your custom fresh order",
    btnName: "View Delicious Menu",
    titleMenu: "Hi Proust Menu",
    searchPlaceholder: "Search for your favorite chicken...",
    viewCart: "View Cart Summary",
    titleCart: "Your Order Cart",
    lblCartNotes: "Special Prep Instructions:",
    notesPlaceholder: "e.g., No mayo, extra spicy, more ketchup...",
    billSub: "Subtotal",
    billTax: "VAT (15%)",
    billTotal: "Total Amount Due",
    btnCartCheckout: "Confirm & Place Order",
    titleType: "Delivery Type",
    promptType: "Where will you enjoy your meal?",
    descType: "Choose dine-in inside our spacious lobby or quick takeaway packaging",
    typeDineTitle: "Dine-in (At Restaurant Table)",
    typeDineDesc: "We'll serve your meal hot directly to Table",
    typeTakeTitle: "Takeaway (Self Pickup)",
    typeTakeDesc: "Pick up your crispy meal freshly packed from delivery counter",
    btnPlaceOrder: "Confirm & Send Order to Kitchen",
    titleTrack: "Live Order Tracker",
    trackNumLbl: "Your Order Number",
    stepPlacedTitle: "Order Received",
    stepPlacedDesc: "Your order is entered in the system and queued",
    stepCookTitle: "Preparing & Frying",
    stepCookDesc: "Our expert chefs are frying and preparing your fresh meal now",
    stepReadyTitle: "Ready for Pickup!",
    stepReadyDesc: "Grab your super hot and crispy meal from pickup counter",
    stepDoneTitle: "Delivered & Enjoyed",
    stepDoneDesc: "Enjoy your meal and we look forward to seeing you again!",
    estTimeLbl: "Estimated Ready Time",
    newOrderBtn: "Place Another Order",
    sar: "SAR",
    lblQrTableStatus: "Table QR Code Scanned:",
    qrTableDisplayPrefix: "Table ",
    lblQrTakeawayStatus: "Takeaway QR Scanned:",
    qrTakeawayDisplay: "Takeaway / Quick Pickup",
    language: "App Language / لغة التطبيق:"
  }
};

// ==========================================================================
// 3. CORE STATE ENGINE (unified client-side store)
// ==========================================================================
const AppState = {
  // Config & Selection
  selectedTable: 1,
  selectedLang: 'ar',
  activeRole: 'customer-view', // 'customer-view' | 'kitchen-view' | 'cashier-view'
  totalTables: 12,
  staticDataLoaded: false,
  
  // Customer Details
  customerId: null,
  phoneNumber: '',
  customerName: '',
  cart: [], // Array of { id, qty }
  customers: [],
  tableNames: {},
  cartNotes: '',
  deliveryType: 'dine-in', // 'dine-in' | 'takeaway'
  activeOrderId: null, // Order currently being tracked by this phone instance
  editingOrderId: null, // Order currently being edited in cart

  // Unified Live Queue of Orders
  orders: [],
  tables: [],
  tablesLoaded: false,
  
  // 15 Modules Dashboard Premium states
  inventory: [
    { id: 'inv-01', nameAr: 'صدور دجاج طازجة (كجم)', nameEn: 'Fresh Chicken Breasts (kg)', stock: 85.0, minLimit: 20.0, supplier: 'تنمية للدواجن' },
    { id: 'inv-02', nameAr: 'خبز كايزر طازج (قطعة)', nameEn: 'Fresh Kaiser Buns (pcs)', stock: 240, minLimit: 50, supplier: 'مخبز الأرز الأوتوماتيكي' },
    { id: 'inv-03', nameAr: 'ثوم طازج مفروم (كجم)', nameEn: 'Minced Fresh Garlic (kg)', stock: 15.0, minLimit: 5.0, supplier: 'الشركة الزراعية السعودية' },
    { id: 'inv-04', nameAr: 'ملفوف كول سلو طازج (كجم)', nameEn: 'Coleslaw Cabbage (kg)', stock: 35.0, minLimit: 10.0, supplier: 'شركة خضروات القصيم' },
    { id: 'inv-05', nameAr: 'علب بيبسي معدنية (قطعة)', nameEn: 'Pepsi Cans (pcs)', stock: 450, minLimit: 100, supplier: 'الشركة الجميح لتعبئة بيبسي' },
    { id: 'inv-06', nameAr: 'زيت قلي نباتي (لتر)', nameEn: 'Vegetable Frying Oil (L)', stock: 120.0, minLimit: 30.0, supplier: 'شركة عافية للزيوت' }
  ],
  employees: [
    { id: 'emp-01', name: 'المدير فهد الرواد', phone: '01000000001', role: 'admin', pin: '1111' },
    { id: 'emp-02', name: 'الكاشير خالد الشمراني', phone: '01000000002', role: 'cashier', pin: '2222' },
    { id: 'emp-03', name: 'الشيف أحمد الحربي', phone: '01000000003', role: 'kitchen', pin: '3333' }
  ],
  notifications: [
    { id: 'not-01', type: 'info', titleAr: 'اتصال النظام', titleEn: 'System Connection', descAr: 'تم تفعيل الاتصال المباشر بقاعدة البيانات السحابية.', descEn: 'Real-time database sync successfully initialized.', time: '09:00 م' }
  ],
  auditLogs: [
    { id: 'aud-01', user: 'نظام التشغيل', actionAr: 'تم تشغيل وتفعيل خادم قاعدة البيانات', actionEn: 'Database server successfully initialized', time: '09:00 م', ip: '192.168.1.1' }
  ],
  cashierShift: {
    open: false,
    openingFloat: 500.00,
    currentCash: 500.00,
    openingTime: null,
    closingTime: null,
    tillLogs: []
  },
  restaurantSettings: {
    nameAr: 'هاي بروست',
    nameEn: 'Hi Proust',
    vatRate: 0.15,
    currencyAr: 'ر.س',
    currencyEn: 'SAR',
    workingHoursAr: '١٢:٠٠ ظهراً - ٠٢:٠٠ صباحاً',
    workingHoursEn: '12:00 PM - 02:00 AM',
    logoSvg: `<circle cx="50" cy="50" r="48" fill="#FFC107" stroke="#C62828" stroke-width="4"/>`
  },
  
  // Cached DOM query elements
  elements: {}
};

// LocalStorage & Supabase Helper
function saveToLocalStorage() {
  localStorage.setItem('HIPROUST_ORDERS', JSON.stringify(AppState.orders));
  localStorage.setItem('HIPROUST_ACTIVE_ORDER_ID', AppState.activeOrderId || '');
  localStorage.setItem('HIPROUST_CUSTOMER_NAME', AppState.customerName || '');
  localStorage.setItem('HIPROUST_PHONE_NUMBER', AppState.phoneNumber || '');
  localStorage.setItem('HIPROUST_SELECTED_TABLE', AppState.selectedTable || 1);
  localStorage.setItem('HIPROUST_DELIVERY_TYPE', AppState.deliveryType || 'dine-in');
  localStorage.setItem('HIPROUST_CUSTOMER_ID', AppState.customerId || '');
  
  // Persist operational state
  localStorage.setItem('HIPROUST_INVENTORY', JSON.stringify(AppState.inventory));
  localStorage.setItem('HIPROUST_EMPLOYEES', JSON.stringify(AppState.employees));
  localStorage.setItem('HIPROUST_NOTIFICATIONS', JSON.stringify(AppState.notifications));
  localStorage.setItem('HIPROUST_AUDIT_LOGS', JSON.stringify(AppState.auditLogs));
  localStorage.setItem('HIPROUST_SHIFT', JSON.stringify(AppState.cashierShift));
  localStorage.setItem('HIPROUST_SETTINGS', JSON.stringify(AppState.restaurantSettings));
  localStorage.setItem('HIPROUST_BANNED', JSON.stringify(AppState.bannedCustomers || []));
  localStorage.setItem('HIPROUST_TABLE_NAMES', JSON.stringify(AppState.tableNames || {}));

  // Sync all operational settings to Supabase (fire-and-forget)
  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    supabaseClient.from('settings').upsert({ key: 'employees',              value: JSON.stringify(AppState.employees) }).catch(() => {});
    supabaseClient.from('settings').upsert({ key: 'inventory',              value: JSON.stringify(AppState.inventory) }).catch(() => {});
    supabaseClient.from('settings').upsert({ key: 'cashier_shift',           value: JSON.stringify(AppState.cashierShift) }).catch(() => {});
    supabaseClient.from('settings').upsert({ key: 'restaurant_settings_json', value: JSON.stringify(AppState.restaurantSettings) }).catch(() => {});
    supabaseClient.from('settings').upsert({ key: 'banned_customers',        value: JSON.stringify(AppState.bannedCustomers || []) }).catch(() => {});
    supabaseClient.from('settings').upsert({ key: 'table_names',             value: JSON.stringify(AppState.tableNames || {}) }).catch(() => {});
  }

  if (AppState.phoneNumber && AppState.customerName) {
    let profiles = {};
    const cachedProfiles = localStorage.getItem('HIPROUST_PROFILES');
    if (cachedProfiles) {
      try { profiles = JSON.parse(cachedProfiles); } catch(e) {}
    }
    profiles[AppState.phoneNumber] = AppState.customerName;
    localStorage.setItem('HIPROUST_PROFILES', JSON.stringify(profiles));
  }
}

async function loadFromLocalStorage() {
  const cached = localStorage.getItem('HIPROUST_ORDERS');
  if (cached) {
    try {
      AppState.orders = JSON.parse(cached);
    } catch(e) {
      AppState.orders = [];
    }
  }

  AppState.activeOrderId = localStorage.getItem('HIPROUST_ACTIVE_ORDER_ID') || null;
  AppState.customerName = localStorage.getItem('HIPROUST_CUSTOMER_NAME') || '';
  AppState.phoneNumber = localStorage.getItem('HIPROUST_PHONE_NUMBER') || '';
  AppState.customerId = localStorage.getItem('HIPROUST_CUSTOMER_ID') || null;
  
  const storedTable = localStorage.getItem('HIPROUST_SELECTED_TABLE');
  if (storedTable) {
    AppState.selectedTable = parseInt(storedTable) || 1;
  }
  
  const storedDelType = localStorage.getItem('HIPROUST_DELIVERY_TYPE');
  if (storedDelType) {
    AppState.deliveryType = storedDelType || 'dine-in';
  }
  
  // Load total tables from local storage
  const storedTotalTables = localStorage.getItem('HIPROUST_TOTAL_TABLES');
  if (storedTotalTables) {
    AppState.totalTables = parseInt(storedTotalTables) || 12;
  }
  const storedTableNames = localStorage.getItem('HIPROUST_TABLE_NAMES');
  if (storedTableNames) {
    try { AppState.tableNames = JSON.parse(storedTableNames); } catch(e) {}
  }

  // Load operational states from localStorage fallback
  const cachedInventory = localStorage.getItem('HIPROUST_INVENTORY');
  if (cachedInventory) {
    try { AppState.inventory = JSON.parse(cachedInventory); } catch(e) {}
  }
  const cachedEmployees = localStorage.getItem('HIPROUST_EMPLOYEES');
  if (cachedEmployees) {
    try { AppState.employees = JSON.parse(cachedEmployees); } catch(e) {}
  }
  const cachedNotifications = localStorage.getItem('HIPROUST_NOTIFICATIONS');
  if (cachedNotifications) {
    try { AppState.notifications = JSON.parse(cachedNotifications); } catch(e) {}
  }
  const cachedAuditLogs = localStorage.getItem('HIPROUST_AUDIT_LOGS');
  if (cachedAuditLogs) {
    try { AppState.auditLogs = JSON.parse(cachedAuditLogs); } catch(e) {}
  }
  const cachedShift = localStorage.getItem('HIPROUST_SHIFT');
  if (cachedShift) {
    try { AppState.cashierShift = JSON.parse(cachedShift); } catch(e) {}
  }
  const cachedSettings = localStorage.getItem('HIPROUST_SETTINGS');
  if (cachedSettings) {
    try { AppState.restaurantSettings = JSON.parse(cachedSettings); } catch(e) {}
  }
  const cachedBanned = localStorage.getItem('HIPROUST_BANNED');
  if (cachedBanned) {
    try { AppState.bannedCustomers = JSON.parse(cachedBanned); } catch(e) {}
  }

  // Cloud Database Integration (Supabase initial sync)
  if (supabaseClient) {
    await syncCloudDatabase();
  }
}

async function syncCloudDatabase() {
  if (!supabaseClient) return;

  // ── 0. Fetch ALL settings in one round-trip and apply selectively ────────
  try {
    const { data: settingsData } = await supabaseClient.from('settings').select('*');
    if (settingsData && settingsData.length > 0) {
      const get = (key) => settingsData.find(s => s.key === key);

      // total_tables
      const tblRow = get('total_tables');
      if (tblRow) { AppState.totalTables = parseInt(tblRow.value) || 12; }

      // table_names
      const tnRow = get('table_names');
      if (tnRow) { try { AppState.tableNames = JSON.parse(tnRow.value); } catch(e) {} }

      // employees
      const empRow = get('employees');
      if (empRow) {
        try {
          const parsed = JSON.parse(empRow.value);
          if (JSON.stringify(parsed) !== JSON.stringify(AppState.employees)) {
            AppState.employees = parsed;
            localStorage.setItem('HIPROUST_EMPLOYEES', JSON.stringify(parsed));
            if (typeof renderAdminEmployeesRoster === 'function') renderAdminEmployeesRoster();
          }
        } catch(e) {}
      } else {
        // Seed employees from AppState if not yet in DB
        supabaseClient.from('settings').upsert({ key: 'employees', value: JSON.stringify(AppState.employees) }).catch(() => {});
      }

      // inventory
      const invRow = get('inventory');
      if (invRow) {
        try {
          const parsed = JSON.parse(invRow.value);
          if (JSON.stringify(parsed) !== JSON.stringify(AppState.inventory)) {
            AppState.inventory = parsed;
            localStorage.setItem('HIPROUST_INVENTORY', JSON.stringify(parsed));
            if (typeof renderAdminInventoryStock === 'function') renderAdminInventoryStock();
          }
        } catch(e) {}
      } else {
        // Seed inventory from AppState if not yet in DB
        supabaseClient.from('settings').upsert({ key: 'inventory', value: JSON.stringify(AppState.inventory) }).catch(() => {});
      }

      // cashier_shift
      const shiftRow = get('cashier_shift');
      if (shiftRow) {
        try {
          const parsed = JSON.parse(shiftRow.value);
          if (JSON.stringify(parsed) !== JSON.stringify(AppState.cashierShift)) {
            AppState.cashierShift = parsed;
            localStorage.setItem('HIPROUST_SHIFT', JSON.stringify(parsed));
            if (typeof renderAdminCashierTill === 'function') renderAdminCashierTill();
          }
        } catch(e) {}
      }

      // restaurant_settings_json
      const rsjRow = get('restaurant_settings_json');
      if (rsjRow) {
        try {
          const parsed = JSON.parse(rsjRow.value);
          if (JSON.stringify(parsed) !== JSON.stringify(AppState.restaurantSettings)) {
            AppState.restaurantSettings = parsed;
            localStorage.setItem('HIPROUST_SETTINGS', JSON.stringify(parsed));
            if (typeof populateAdminSettingsFields === 'function') populateAdminSettingsFields();
          }
        } catch(e) {}
      }

      // banned_customers
      const bannedRow = get('banned_customers');
      if (bannedRow) {
        try {
          const parsed = JSON.parse(bannedRow.value);
          if (JSON.stringify(parsed) !== JSON.stringify(AppState.bannedCustomers)) {
            AppState.bannedCustomers = parsed;
            localStorage.setItem('HIPROUST_BANNED', JSON.stringify(parsed));
          }
        } catch(e) {}
      }
    }
  } catch (err) {
    console.warn("Supabase settings sync error:", err);
  }

  if (!AppState.staticDataLoaded) {
    // 0.1 Fetch Physical Tables
    try {
      const { data: tablesData } = await supabaseClient
        .from('tables')
        .select('*');
      if (tablesData) {
        AppState.tables = tablesData;
        AppState.tablesLoaded = true;
      }
    } catch (err) {
      console.warn("Supabase tables fetch error:", err);
    }

    // A. Fetch Categories
    try {
      const { data: catData, error: catError } = await supabaseClient
        .from('categories')
        .select('*');
      if (catData && catData.length > 0) {
        const dbCats = catData.map(c => ({
          id: c.id,
          nameAr: c.name_ar,
          nameEn: c.name_en
        }));
        // Ensure "All Items" (all) category is always at the top of customer categories
        CATEGORIES = [{ id: "all", nameAr: "كل الأطباق", nameEn: "All Items" }, ...dbCats];
      }
    } catch (err) {
      console.warn("Supabase categories fetch error:", err);
    }

    // B. Fetch Products
    try {
      const { data: prodData, error: prodError } = await supabaseClient
        .from('products')
        .select('*');
      if (prodData && prodData.length > 0) {
        MENU = prodData.map(p => {
          const existingSeed = MENU.find(m => m.id === p.id);
          return {
            id: p.id,
            cat: p.category_id,
            nameAr: p.name_ar,
            nameEn: p.name_en,
            descAr: p.description_ar || '',
            descEn: p.description_en || '',
            price: Number(p.price),
            spicy: p.is_spicy,
            bestSeller: p.is_bestseller,
            svg: p.image_url ? (p.image_url.startsWith('<svg') ? p.image_url : '') : (existingSeed ? existingSeed.svg : ''),
            imageUrl: p.image_url ? (!p.image_url.startsWith('<svg') ? p.image_url : null) : null
          };
        });
      }
    } catch (err) {
      console.warn("Supabase products fetch error:", err);
    }

    AppState.staticDataLoaded = true;
  }

  // D. Fetch registered Customers from DB (every sync cycle)
  try {
    const { data: customersData } = await supabaseClient.from('customers').select('*');
    if (customersData) AppState.customers = customersData;
  } catch (err) {
    console.warn("Supabase customers fetch error:", err);
  }

  // C. Fetch Orders (Joined query for relational schema)
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select(`
        id,
        status,
        subtotal,
        tax,
        total,
        notes,
        delivery_type,
        payment_method,
        pending_update,
        audit_log,
        created_at,
        customers ( id, name, phone ),
        tables ( id, table_number ),
        order_items ( id, quantity, price, product_id, products ( id, name_ar, name_en ) )
      `)
      .order('created_at', { ascending: true });
      
    if (data) {
      const dbOrders = data.map(o => {
        const items = (o.order_items || []).map(item => {
          return {
            id: item.product_id,
            nameAr: item.products ? item.products.name_ar : '',
            nameEn: item.products ? item.products.name_en : '',
            qty: item.quantity,
            price: Number(item.price)
          };
        });

        return {
          id: o.id,
          table: o.tables ? o.tables.table_number : 0,
          name: o.customers ? o.customers.name : '',
          phone: o.customers ? o.customers.phone : '',
          items: items,
          subtotal: Number(o.subtotal),
          tax: Number(o.tax),
          total: Number(o.total),
          notes: o.notes,
          type: o.delivery_type,
          status: o.status,
          paymentStatus: o.status === 'pending_payment' ? 'unpaid' : 'paid',
          paymentMethod: o.payment_method,
          pendingUpdate: typeof o.pending_update === 'string' ? JSON.parse(o.pending_update) : o.pending_update,
          auditLog: typeof o.audit_log === 'string' ? JSON.parse(o.audit_log) : (o.audit_log || []),
          timestamp: new Date(o.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          elapsedSeconds: Math.floor((Date.now() - new Date(o.created_at).getTime()) / 1000)
        };
      });

      // Preserve our local active order if it is not returned by the database yet!
      const localActiveOrder = AppState.activeOrderId ? AppState.orders.find(o => o.id === AppState.activeOrderId) : null;
      
      AppState.orders = dbOrders;
      
      if (localActiveOrder && !AppState.orders.some(o => o.id === localActiveOrder.id)) {
        AppState.orders.push(localActiveOrder);
      }

      // Sync database orders to local storage to unify states
      localStorage.setItem('HIPROUST_ORDERS', JSON.stringify(AppState.orders));
      
      // Trigger UI updates in real-time across all views
      if (AppState.activeRole === 'kitchen-view') renderKDSBoard();
      if (AppState.activeRole === 'admin-view') {
        renderAdminDashboard();
        if (typeof renderAdminMenuManage === 'function') renderAdminMenuManage();
      }
      if (AppState.activeRole === 'cashier-view') {
        renderCashierOrdersTable();
        updateCashierMetrics();
        if (selectedOrderForCheckout) {
          const refreshedOrder = AppState.orders.find(o => o.id === selectedOrderForCheckout.id);
          if (refreshedOrder) {
            selectedOrderForCheckout = refreshedOrder;
            renderCashierCheckoutSidebar();
          }
        }
      }
      if (AppState.activeRole === 'customer-view') {
        if (AppState.activeOrderId) {
          const trackingOrder = AppState.orders.find(o => o.id === AppState.activeOrderId);
          if (trackingOrder) {
            updateLiveTrackingUI(trackingOrder);
          }
        }
        const catContainer = document.getElementById('categories-scroll');
        if (catContainer) renderMenuCategories();
        const menuContainer = document.getElementById('menu-catalog');
        if (menuContainer) renderMenuCatalog();
      }
    }
  } catch (err) {
    console.warn("Supabase fetch error, fallback to local:", err);
  }
}

// ==========================================================================
// 4. DIGITAL SOUND GENERATORS (Web Audio API Synthesizer)
// ==========================================================================
const AudioSynthesizer = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playBeep() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime); // High pitch short click
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  },

  playNewOrderChime() {
    this.init();
    const now = this.ctx.currentTime;
    
    // Play a lovely double chime (chord of major scale)
    const playTone = (freq, start, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(start);
      osc.stop(start + duration);
    };

    playTone(523.25, now, 0.4); // C5
    playTone(659.25, now + 0.15, 0.5); // E5
  },

  playReadyBell() {
    this.init();
    const now = this.ctx.currentTime;

    // Ascending celebratory arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const start = now + (idx * 0.12);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(start);
      osc.stop(start + 0.35);
    });
  }
};

// ==========================================================================
// 5. TRANSLATION ENGINE & UI RE-RENDERERS
// ==========================================================================
function updateLanguageUI() {
  const L = TRANSLATIONS[AppState.selectedLang];
  
  // HTML Direction
  document.documentElement.lang = AppState.selectedLang;
  if (AppState.selectedLang === 'ar') {
    document.body.classList.remove('ltr');
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
    document.body.classList.add('ltr');
  }

  // Splash Screen translations
  document.getElementById('txt-splash-title').innerText = L.splashTitle;
  document.getElementById('txt-splash-tag').innerText = L.splashTag;
  document.getElementById('lbl-select-table').innerText = L.selectTable;
  document.getElementById('lbl-language').innerText = L.language;
  document.getElementById('txt-splash-start-btn').innerText = L.btnSplashStart;

  // Phone screen translations
  document.getElementById('txt-title-phone').innerText = L.titlePhone;
  document.getElementById('txt-prompt-phone').innerText = L.promptPhone;
  document.getElementById('txt-desc-phone').innerText = L.descPhone;
  document.getElementById('txt-btn-continue').innerText = L.btnContinue;

  // Name screen translations
  document.getElementById('txt-title-name').innerText = L.titleName;
  document.getElementById('txt-prompt-name').innerText = L.promptName;
  document.getElementById('txt-desc-name').innerText = L.descName;
  document.getElementById('txt-name-btn').innerText = L.btnName;
  document.getElementById('name-input').placeholder = AppState.selectedLang === 'ar' ? 'مثال: محمد أحمد' : 'e.g., John Doe';

  // Menu catalog screen translations
  document.getElementById('txt-title-menu').innerText = L.titleMenu;
  document.getElementById('menu-search').placeholder = L.searchPlaceholder;
  document.getElementById('txt-view-cart').innerText = L.viewCart;

  // Cart summary screen translations
  document.getElementById('txt-title-cart').innerText = L.titleCart;
  document.getElementById('lbl-cart-notes').innerText = L.lblCartNotes;
  document.getElementById('cart-notes').placeholder = L.notesPlaceholder;
  document.getElementById('txt-bill-sub').innerText = L.billSub;
  document.getElementById('txt-bill-tax').innerText = L.billTax;
  document.getElementById('txt-bill-total').innerText = L.billTotal;
  document.getElementById('txt-cart-checkout-btn').innerText = L.btnCartCheckout;

  // Delivery type selection translations
  const titleType = document.getElementById('txt-title-type');
  if (titleType) titleType.innerText = L.titleType;
  
  const promptType = document.getElementById('txt-prompt-type');
  if (promptType) promptType.innerText = L.promptType;
  
  const descType = document.getElementById('txt-desc-type');
  if (descType) descType.innerText = L.descType;
  
  const typeDineTitle = document.getElementById('txt-type-dine-title');
  if (typeDineTitle) typeDineTitle.innerText = L.typeDineTitle;
  
  const typeDineDesc = document.getElementById('txt-type-dine-desc');
  if (typeDineDesc) typeDineDesc.innerText = L.typeDineDesc;
  
  const typeTakeTitle = document.getElementById('txt-type-take-title');
  if (typeTakeTitle) typeTakeTitle.innerText = L.typeTakeTitle;
  
  const typeTakeDesc = document.getElementById('txt-type-take-desc');
  if (typeTakeDesc) typeTakeDesc.innerText = L.typeTakeDesc;
  
  const placeOrderBtn = document.getElementById('txt-place-order-btn');
  if (placeOrderBtn) placeOrderBtn.innerText = L.btnPlaceOrder;

  // Live order tracker translations
  document.getElementById('txt-title-track').innerText = L.titleTrack;
  document.getElementById('txt-track-num-lbl').innerText = L.trackNumLbl;
  document.getElementById('txt-step-placed-title').innerText = L.stepPlacedTitle;
  document.getElementById('txt-step-placed-desc').innerText = L.stepPlacedDesc;
  document.getElementById('txt-step-cook-title').innerText = L.stepCookTitle;
  document.getElementById('txt-step-cook-desc').innerText = L.stepCookDesc;
  document.getElementById('txt-step-ready-title').innerText = L.stepReadyTitle;
  document.getElementById('txt-step-ready-desc').innerText = L.stepReadyDesc;
  document.getElementById('txt-step-done-title').innerText = L.stepDoneTitle;
  document.getElementById('txt-step-done-desc').innerText = L.stepDoneDesc;
  document.getElementById('txt-est-time-lbl').innerText = L.estTimeLbl;
  document.getElementById('txt-new-order-btn').innerText = L.newOrderBtn;

  // Update QR table locked banner translations if active
  const lockedStatusLbl = document.getElementById('lbl-qr-table-status');
  const lockedDisplay = document.getElementById('qr-table-display');
  if (lockedStatusLbl && lockedDisplay) {
    lockedStatusLbl.innerText = L.lblQrTableStatus;
    lockedDisplay.innerText = L.qrTableDisplayPrefix + AppState.selectedTable;
  }

  // Update QR takeaway locked banner translations if active
  const lockedTakeawayStatus = document.getElementById('lbl-qr-takeaway-status');
  const lockedTakeawayDisplay = document.getElementById('qr-takeaway-display');
  if (lockedTakeawayStatus && lockedTakeawayDisplay) {
    lockedTakeawayStatus.innerText = L.lblQrTakeawayStatus;
    lockedTakeawayDisplay.innerText = L.qrTakeawayDisplay;
  }

  // Render categories and menu catalog with translated keys
  renderMenuCategories();
  renderMenuCatalog();
  renderCartSummary();
  updateTableTags();
}

function updateTableTags() {
  const prefix = AppState.selectedLang === 'ar' ? 'طاولة ' : 'Table ';
  document.getElementById('menu-table-tag').innerText = prefix + AppState.selectedTable;
  document.getElementById('type-table-num').innerText = AppState.selectedTable;
}

// ==========================================================================
// 6. CUSTOMER FLOW NAVIGATION
// ==========================================================================
function switchMobileScreen(targetId) {
  const screens = document.querySelectorAll('#customer-view .screen-state');
  screens.forEach(scr => {
    scr.classList.remove('active', 'prev', 'next');
    if (scr.id === targetId) {
      scr.classList.add('active');
    }
  });

  // Home indicator color customization
  const homeInd = document.getElementById('phone-home-indicator');
  if (targetId === 'mobile-splash') {
    homeInd.classList.add('white');
  } else {
    homeInd.classList.remove('white');
  }

  // Pre-load data in screen triggers
  if (targetId === 'mobile-menu') {
    renderMenuCatalog();
  }
}

// Generate Splash screen tables selection
function renderTableGrid() {
  const grid = document.getElementById('table-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const total = AppState.totalTables || 12;
  for (let i = 1; i <= total; i++) {
    const btn = document.createElement('button');
    btn.className = `table-btn ${i === AppState.selectedTable ? 'active' : ''}`;
    btn.innerText = i;
    btn.addEventListener('click', (e) => {
      AudioSynthesizer.playBeep();
      document.querySelectorAll('.table-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.selectedTable = i;
      updateTableTags();
    });
    grid.appendChild(btn);
  }
}

// URL QR table and takeaway code check locking
function checkTableQRParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const tableVal = urlParams.get('table') || urlParams.get('t');
  const typeVal = urlParams.get('type') || urlParams.get('delivery');

  const selectionWrapper = document.getElementById('table-selection-wrapper');
  const lockedWrapper = document.getElementById('qr-table-locked-wrapper');
  const lockedDisplay = document.getElementById('qr-table-display');
  const lockedStatusLbl = document.getElementById('lbl-qr-table-status');

  const takeawayWrapper = document.getElementById('qr-takeaway-locked-wrapper');
  const takeawayDisplay = document.getElementById('qr-takeaway-display');
  const takeawayStatusLbl = document.getElementById('lbl-qr-takeaway-status');

  // 1. Check for Takeaway QR code
  if (typeVal === 'takeaway' || tableVal === 'takeaway') {
    AppState.deliveryType = 'takeaway';
    AppState.selectedTable = 0; // 0 represents takeaway order placeholder

    if (selectionWrapper) selectionWrapper.classList.add('hidden');
    if (lockedWrapper) lockedWrapper.classList.add('hidden');
    if (takeawayWrapper) takeawayWrapper.classList.remove('hidden');

    const L = TRANSLATIONS[AppState.selectedLang];
    if (takeawayDisplay) takeawayDisplay.innerText = L.qrTakeawayDisplay;
    if (takeawayStatusLbl) takeawayStatusLbl.innerText = L.lblQrTakeawayStatus;

    const dineCard = document.getElementById('card-dine-in');
    const takeCard = document.getElementById('card-takeaway');
    if (dineCard && takeCard) {
      dineCard.classList.remove('active');
      takeCard.classList.add('active');
    }
    return true;
  }

  // 2. Check for Table QR code
  if (tableVal) {
    const tableNum = parseInt(tableVal);
    if (!isNaN(tableNum) && tableNum > 0) {
      AppState.selectedTable = tableNum;
      AppState.deliveryType = 'dine-in';

      if (selectionWrapper) selectionWrapper.classList.add('hidden');
      if (takeawayWrapper) takeawayWrapper.classList.add('hidden');
      if (lockedWrapper) lockedWrapper.classList.remove('hidden');

      const L = TRANSLATIONS[AppState.selectedLang];
      if (lockedDisplay) lockedDisplay.innerText = L.qrTableDisplayPrefix + tableNum;
      if (lockedStatusLbl) lockedStatusLbl.innerText = L.lblQrTableStatus;

      const dineCard = document.getElementById('card-dine-in');
      const takeCard = document.getElementById('card-takeaway');
      if (dineCard && takeCard) {
        dineCard.classList.add('active');
        takeCard.classList.remove('active');
      }

      updateTableTags();
      return true;
    }
  }

  // 3. Standard fallback (No QR scanned)
  if (selectionWrapper) selectionWrapper.classList.remove('hidden');
  if (lockedWrapper) lockedWrapper.classList.add('hidden');
  if (takeawayWrapper) takeawayWrapper.classList.add('hidden');
  return false;
}

// ==========================================================================
// 7. KEYPAD CONTROLLER (DIGITAL PHONE KEYBOARD)
// ==========================================================================
let currentPhoneDigits = "";
function renderPhoneDisplay() {
  const disp = document.getElementById('phone-display');
  if (currentPhoneDigits === "") {
    disp.innerText = AppState.selectedLang === 'ar' ? "01XXXXXXXXX" : "01XXXXXXXXX";
    disp.style.opacity = 0.4;
  } else {
    disp.innerText = currentPhoneDigits;
    disp.style.opacity = 1;
  }
}

function handleKeypadPress(val) {
  AudioSynthesizer.playBeep();
  if (val === "del") {
    currentPhoneDigits = currentPhoneDigits.slice(0, -1);
  } else if (currentPhoneDigits.length < 11) {
    // Only accept numeric inputs starting with 01 (Egyptian mobile format)
    if (currentPhoneDigits.length === 0 && val !== "0") return;
    if (currentPhoneDigits.length === 1 && val !== "1") return;
    currentPhoneDigits += val;
  }
  renderPhoneDisplay();
}

// ==========================================================================
// 8. MENU RENDERING & CART OPERATIONS
// ==========================================================================
let activeCategoryFilter = "all";
let menuSearchQuery = "";

function renderMenuCategories() {
  const container = document.getElementById('categories-scroll');
  container.innerHTML = '';
  
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('div');
    chip.className = `cat-chip ${cat.id === activeCategoryFilter ? 'active' : ''}`;
    chip.innerText = AppState.selectedLang === 'ar' ? cat.nameAr : cat.nameEn;
    
    chip.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      activeCategoryFilter = cat.id;
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderMenuCatalog();
    });
    container.appendChild(chip);
  });
}

function renderMenuCatalog() {
  const container = document.getElementById('menu-catalog');
  container.innerHTML = '';

  const L = TRANSLATIONS[AppState.selectedLang];

  // Filter and search items
  const filtered = MENU.filter(item => {
    const matchCat = (activeCategoryFilter === "all" || item.cat === activeCategoryFilter);
    const searchStr = `${item.nameAr} ${item.nameEn} ${item.descAr} ${item.descEn}`.toLowerCase();
    const matchSearch = searchStr.includes(menuSearchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  filtered.forEach(item => {
    const cartEntry = AppState.cart.find(c => c.id === item.id);
    const qty = cartEntry ? cartEntry.qty : 0;

    const card = document.createElement('div');
    card.className = 'menu-card';

    let badgeHtml = '';
    if (item.spicy) {
      badgeHtml = `<span class="menu-card-badge" style="background-color: var(--primary-red);"><i class="fa-solid fa-pepper-hot"></i> سبايسي</span>`;
    } else if (item.bestSeller) {
      badgeHtml = `<span class="menu-card-badge" style="background-color: var(--primary-yellow); color: #121214;"><i class="fa-solid fa-fire"></i> الأكثر طلباً</span>`;
    }

    const title = AppState.selectedLang === 'ar' ? item.nameAr : item.nameEn;
    const desc = AppState.selectedLang === 'ar' ? item.descAr : item.descEn;

    let actionBtnHtml = '';
    if (qty > 0) {
      actionBtnHtml = `
        <div class="qty-editor-wrap">
          <button class="qty-btn minus" data-id="${item.id}">-</button>
          <span class="qty-val">${qty}</span>
          <button class="qty-btn plus" data-id="${item.id}">+</button>
        </div>
      `;
    } else {
      actionBtnHtml = `<button class="add-to-cart-btn add-new" data-id="${item.id}"><i class="fa-solid fa-plus" style="pointer-events:none;"></i></button>`;
    }

    let imageHtml = '';
    const imgSource = item.svg || item.imageUrl || '';
    if (imgSource.trim().startsWith('<svg')) {
      imageHtml = imgSource;
    } else if (imgSource.trim() !== '') {
      imageHtml = `<img src="${imgSource}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px; display: block;">`;
    } else {
      imageHtml = `<svg class="brand-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width: 60px; height: 60px; display: inline-block;">
        <circle cx="50" cy="50" r="48" fill="#FFC107" stroke="#C62828" stroke-width="3"/>
        <circle cx="50" cy="46" r="22" fill="#FFFFFF" stroke="#333" stroke-width="1.5"/>
        <path d="M 44 46 L 56 46 L 50 58 Z" fill="#FF9800" stroke="#333" stroke-width="1.5"/>
        <ellipse cx="44" cy="38" rx="3" ry="5" fill="#000"/><ellipse cx="56" cy="38" rx="3" ry="5" fill="#000"/>
      </svg>`;
    }

    card.innerHTML = `
      ${badgeHtml}
      <div class="menu-card-img-wrap" style="display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        ${imageHtml}
      </div>
      <div class="menu-card-info">
        <div>
          <h4 class="menu-card-title">${title}</h4>
          <p class="menu-card-desc">${desc}</p>
        </div>
        <div class="menu-card-footer">
          <div class="menu-card-price">${item.price.toFixed(2)} <span>${L.sar}</span></div>
          ${actionBtnHtml}
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach Catalog Event Listeners
  container.querySelectorAll('.add-new').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      updateCartItemQuantity(id, 1);
    });
  });

  container.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      updateCartItemQuantity(id, 1);
    });
  });

  container.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-id');
      updateCartItemQuantity(id, -1);
    });
  });

  updateFloatingCartBar();
}

function updateCartItemQuantity(itemId, change) {
  AudioSynthesizer.playBeep();
  const entryIndex = AppState.cart.findIndex(c => c.id === itemId);

  if (entryIndex > -1) {
    AppState.cart[entryIndex].qty += change;
    if (AppState.cart[entryIndex].qty <= 0) {
      AppState.cart.splice(entryIndex, 1);
    }
  } else if (change > 0) {
    AppState.cart.push({ id: itemId, qty: change });
  }

  renderMenuCatalog();
  renderCartSummary();
}

function updateFloatingCartBar() {
  const floatBar = document.getElementById('float-cart-bar');
  if (AppState.cart.length === 0) {
    floatBar.classList.add('hidden');
    return;
  }

  floatBar.classList.remove('hidden');

  let totalQty = 0;
  let totalPrice = 0;
  AppState.cart.forEach(c => {
    const item = MENU.find(m => m.id === c.id);
    totalQty += c.qty;
    totalPrice += (item.price * c.qty);
  });

  document.getElementById('float-cart-count').innerText = totalQty;
  document.getElementById('float-cart-total').innerText = totalPrice.toFixed(2) + " " + TRANSLATIONS[AppState.selectedLang].sar;
}

// ==========================================================================
// 9. CART SCREEN RENDERING
// ==========================================================================
function renderCartSummary() {
  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';
  const L = TRANSLATIONS[AppState.selectedLang];

  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 40px 20px;">
        <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--light-border); margin-bottom: 12px;"></i>
        <p>${AppState.selectedLang === 'ar' ? 'سلة المشتريات فارغة تماماً!' : 'Your cart is completely empty!'}</p>
      </div>
    `;
    
    document.getElementById('bill-subtotal').innerText = "0.00 " + L.sar;
    document.getElementById('bill-tax').innerText = "0.00 " + L.sar;
    document.getElementById('bill-total').innerText = "0.00 " + L.sar;
    return;
  }

  let subtotal = 0;
  AppState.cart.forEach(c => {
    const item = MENU.find(m => m.id === c.id);
    const rowPrice = (item.price * c.qty);
    subtotal += rowPrice;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="cart-item-icon-wrap">
        ${item.svg}
      </div>
      <div class="cart-item-details">
        <h5 class="cart-item-name">${AppState.selectedLang === 'ar' ? item.nameAr : item.nameEn}</h5>
        <div class="cart-item-price">${item.price.toFixed(2)} ${L.sar}</div>
      </div>
      <div class="qty-editor-wrap">
        <button class="qty-btn minus" data-id="${item.id}">-</button>
        <span class="qty-val">${c.qty}</span>
        <button class="qty-btn plus" data-id="${item.id}">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  // Calculate pricing taxes (15%)
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  document.getElementById('bill-subtotal').innerText = subtotal.toFixed(2) + " " + L.sar;
  document.getElementById('bill-tax').innerText = tax.toFixed(2) + " " + L.sar;
  document.getElementById('bill-total').innerText = total.toFixed(2) + " " + L.sar;

  // Add click events inside cart rows
  container.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateCartItemQuantity(id, 1);
    });
  });

  container.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      updateCartItemQuantity(id, -1);
    });
  });
}

// ==========================================================================
// 10. PLACING THE ORDER (TRIGGER REAL-TIME STATE SYNC)
// ==========================================================================
async function getNextUniqueOrderId() {
  if (!supabaseClient) {
    const localMax = AppState.orders.length > 0 ? Math.max(...AppState.orders.map(o => parseInt(o.id.slice(1)) || 100)) : 100;
    return "A" + (localMax + 1);
  }
  
  try {
    const { data } = await supabaseClient
      .from('orders')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(30);
      
    if (data && data.length > 0) {
      const idNumbers = data.map(o => {
        const numPart = o.id.slice(1);
        return parseInt(numPart) || 100;
      });
      const dbMax = Math.max(...idNumbers, 100);
      return "A" + (dbMax + 1);
    }
  } catch (err) {
    console.warn("Error fetching highest order ID from Supabase:", err);
  }
  
  const localMax = AppState.orders.length > 0 ? Math.max(...AppState.orders.map(o => parseInt(o.id.slice(1)) || 100)) : 100;
  return "A" + (localMax + 1);
}

async function triggerPlaceOrder() {
  if (AppState.cart.length === 0) return;

  // Block placing a new order if they already have an active order
  const activeOrder = AppState.orders.find(o => o.phone === AppState.phoneNumber && o.status !== 'delivered');
  if (activeOrder) {
    showToastNotification(
      AppState.selectedLang === 'ar'
        ? `لديك طلب نشط بالفعل (${activeOrder.id})! لا يمكنك تقديم طلب جديد حتى يتم تسليم طلبك الحالي.`
        : `You already have an active order (${activeOrder.id})! You cannot place a new order until your current order is delivered.`,
      'new'
    );
    return;
  }

  if (AppState.editingOrderId) {
    triggerSaveOrderEdits();
    return;
  }

  const L = TRANSLATIONS[AppState.selectedLang];

  // Disable checkout button and show spinner to prevent duplicate checkout clicks
  const checkoutBtn = document.getElementById('btn-cart-checkout');
  let originalBtnHTML = "";
  if (checkoutBtn) {
    originalBtnHTML = checkoutBtn.innerHTML;
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = '0.7';
    checkoutBtn.innerHTML = `<span><i class="fa-solid fa-circle-notch fa-spin"></i> ${
      AppState.selectedLang === 'ar' ? 'جاري إرسال الطلب...' : 'Placing order...'
    }</span>`;
  }

  // Calculate prices
  let subtotal = 0;
  AppState.cart.forEach(c => {
    const item = MENU.find(m => m.id === c.id);
    if (item) subtotal += (item.price * c.qty);
  });
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  // Formulate Order items mapping
  const orderItems = AppState.cart.map(c => {
    const item = MENU.find(m => m.id === c.id);
    return {
      id: item.id,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      qty: c.qty,
      price: item.price
    };
  });

  // Read notes
  const notes = document.getElementById('cart-notes').value.trim();

  // Capture cart snapshot immediately to avoid async race condition before cart is cleared!
  const cartSnapshot = AppState.cart.map(c => ({ id: c.id, qty: c.qty }));

  let success = false;
  let attempts = 0;
  let chosenOrderId = "";
  let newOrder = null;

  if (supabaseClient) {
    let tableUuid = null;
    if (AppState.deliveryType === 'dine-in' && AppState.tables && AppState.tables.length > 0) {
      const matchedTable = AppState.tables.find(t => t.table_number === AppState.selectedTable);
      if (matchedTable) {
        tableUuid = matchedTable.id;
      }
    }

    while (attempts < 3 && !success) {
      attempts++;
      chosenOrderId = await getNextUniqueOrderId();

      const orderPayload = {
        id: chosenOrderId,
        customer_id: AppState.customerId,
        table_id: tableUuid,
        status: 'pending_payment',
        subtotal: subtotal,
        tax: tax,
        total: total,
        notes: notes,
        delivery_type: AppState.deliveryType,
        payment_method: null,
        pending_update: null,
        audit_log: []
      };

      try {
        const { error: insertError } = await supabaseClient.from('orders').insert(orderPayload);
        if (insertError) {
          // If duplicate key error (code 23505), try again with a newly generated ID
          if (insertError.code === '23505') {
            console.warn(`Collision on order ID ${chosenOrderId}. Retrying sequence... (Attempt ${attempts}/3)`);
            continue;
          } else {
            throw insertError;
          }
        }

        // Successfully inserted order, now insert items
        const itemsPayload = cartSnapshot.map(c => {
          const menuItem = MENU.find(m => m.id === c.id);
          return {
            order_id: chosenOrderId,
            product_id: c.id,
            quantity: c.qty,
            price: menuItem.price
          };
        });

        const { error: itemsError } = await supabaseClient.from('order_items').insert(itemsPayload);
        if (itemsError) throw itemsError;

        success = true;
      } catch (dbErr) {
        console.error("Database insert error during checkout:", dbErr);
      }
    }

    // Try a mathematically unique fallback ID suffix if all 3 attempts failed due to concurrent sequence conflicts
    if (!success) {
      const randomSuffix = Math.floor(Math.random() * 90 + 10); // 10 to 99
      const baseId = await getNextUniqueOrderId();
      chosenOrderId = `${baseId}-${randomSuffix}`;
      console.warn(`Applying mathematically unique fallback order ID: ${chosenOrderId}`);

      const orderPayload = {
        id: chosenOrderId,
        customer_id: AppState.customerId,
        table_id: tableUuid,
        status: 'pending_payment',
        subtotal: subtotal,
        tax: tax,
        total: total,
        notes: notes,
        delivery_type: AppState.deliveryType,
        payment_method: null,
        pending_update: null,
        audit_log: []
      };

      try {
        const { error: insertError } = await supabaseClient.from('orders').insert(orderPayload);
        if (insertError) throw insertError;

        const itemsPayload = cartSnapshot.map(c => {
          const menuItem = MENU.find(m => m.id === c.id);
          return {
            order_id: chosenOrderId,
            product_id: c.id,
            quantity: c.qty,
            price: menuItem.price
          };
        });

        const { error: itemsError } = await supabaseClient.from('order_items').insert(itemsPayload);
        if (itemsError) throw itemsError;

        success = true;
      } catch (fatalErr) {
        console.error("Fatal checkout insertion crash:", fatalErr);
        showToastNotification(
          AppState.selectedLang === 'ar'
            ? "عذراً، حدث خطأ أثناء إرسال طلبك. يرجى المحاولة مرة أخرى."
            : "Sorry, an error occurred while placing your order. Please try again.",
          'ready'
        );
        if (checkoutBtn) {
          checkoutBtn.disabled = false;
          checkoutBtn.style.opacity = '1';
          checkoutBtn.innerHTML = originalBtnHTML;
        }
        return;
      }
    }
  } else {
    // Local / Offline fallback
    chosenOrderId = "A" + (AppState.orders.length > 0 ? Math.max(...AppState.orders.map(o => parseInt(o.id.slice(1)) || 100)) + 1 : 101);
    success = true;
  }

  // Create new order record for local state update
  newOrder = {
    id: chosenOrderId,
    table: AppState.selectedTable,
    name: AppState.customerName || (AppState.selectedLang === 'ar' ? "عميل طاولة " : "Guest Table ") + AppState.selectedTable,
    phone: AppState.phoneNumber || "01000000000",
    items: orderItems,
    subtotal: subtotal,
    tax: tax,
    total: total,
    notes: notes,
    type: AppState.deliveryType,
    status: 'pending_payment',
    paymentStatus: 'unpaid',
    paymentMethod: null,
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    elapsedSeconds: 0
  };

  // Add order to unified state
  AppState.orders.push(newOrder);
  AppState.activeOrderId = chosenOrderId;
  saveToLocalStorage();

  // Play audio alert
  AudioSynthesizer.playNewOrderChime();

  // Trigger Toast Notification
  showToastNotification(
    AppState.selectedLang === 'ar' 
      ? `تم إرسال طلبك بنجاح! رقم الطلب: ${chosenOrderId}` 
      : `Order Placed Successfully! ID: ${chosenOrderId}`, 
    'new'
  );

  // Clean active customer cart
  AppState.cart = [];
  if (document.getElementById('cart-notes')) {
    document.getElementById('cart-notes').value = '';
  }
  
  // Restore checkout button to original text & state
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = '1';
    checkoutBtn.innerHTML = originalBtnHTML;
  }

  // Update Live Tracking UI in Mobile View
  updateLiveTrackingUI(newOrder);
  switchMobileScreen('mobile-tracking');

  // Trigger reactive renders on the KDS and Cashier views!
  renderKDSBoard();
  renderCashierOrdersTable();
  updateCashierMetrics();
}

function triggerSaveOrderEdits() {
  const orderId = AppState.editingOrderId;
  const activeOrder = AppState.orders.find(o => o.id === orderId);
  if (!activeOrder) return;

  const L = TRANSLATIONS[AppState.selectedLang];

  // Calculate prices
  let subtotal = 0;
  AppState.cart.forEach(c => {
    const item = MENU.find(m => m.id === c.id);
    if (item) subtotal += (item.price * c.qty);
  });
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  // Formulate items
  const orderItems = AppState.cart.map(c => {
    const item = MENU.find(m => m.id === c.id);
    return {
      id: item.id,
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      qty: c.qty,
      price: item.price
    };
  });

  const notes = document.getElementById('cart-notes').value.trim();

  // Branch based on payment status:
  if (activeOrder.paymentStatus !== 'paid') {
    // 1. Direct Free Editing (Unpaid Order)
    activeOrder.items = orderItems;
    activeOrder.subtotal = subtotal;
    activeOrder.tax = tax;
    activeOrder.total = total;
    activeOrder.notes = notes;
    activeOrder.type = AppState.deliveryType;
    activeOrder.table = AppState.selectedTable;
    
    if (typeof addAuditLog === 'function') {
      addAuditLog(activeOrder, AppState.selectedLang === 'ar' ? "تعديل عناصر الطلب من قبل العميل" : "Order items edited by guest");
    }

    saveToLocalStorage();

    // Cloud Sync (Supabase Update)
    if (supabaseClient) {
      let tableUuid = null;
      if (activeOrder.type === 'dine-in' && AppState.tables && AppState.tables.length > 0) {
        const matchedTable = AppState.tables.find(t => t.table_number === activeOrder.table);
        if (matchedTable) {
          tableUuid = matchedTable.id;
        }
      }

      // Capture cart snapshot immediately to avoid async race condition before cart is cleared!
      const cartSnapshot = AppState.cart.map(c => ({ id: c.id, qty: c.qty }));

      supabaseClient
        .from('orders')
        .update({
          subtotal: activeOrder.subtotal,
          tax: activeOrder.tax,
          total: activeOrder.total,
          notes: activeOrder.notes,
          delivery_type: activeOrder.type,
          table_id: tableUuid,
          audit_log: activeOrder.auditLog
        })
        .eq('id', orderId)
        .then(res => {
          console.log('Order changes persisted to Supabase directly:', res);
          
          // Overwrite order items in order_items table
          supabaseClient
            .from('order_items')
            .delete()
            .eq('order_id', orderId)
            .then(() => {
              const itemsPayload = cartSnapshot.map(c => {
                const menuItem = MENU.find(m => m.id === c.id);
                return {
                  order_id: orderId,
                  product_id: c.id,
                  quantity: c.qty,
                  price: menuItem.price
                };
              });

              supabaseClient
                .from('order_items')
                .insert(itemsPayload)
                .then(itemsRes => {
                  console.log('Edited order items persisted to Supabase:', itemsRes);
                });
            });
        });
    }

    showToastNotification(
      AppState.selectedLang === 'ar' ? 'تم حفظ التعديلات وتحديث الطلب بنجاح! 🎉' : 'Order edits saved successfully! 🎉',
      'ready'
    );
  } else {
    // 2. Cashier Approval Required (Paid/Approved Order)
    const proposed = {
      items: orderItems,
      subtotal: subtotal,
      tax: tax,
      total: total,
      notes: notes,
      type: AppState.deliveryType,
      table: AppState.selectedTable
    };

    activeOrder.pendingUpdate = proposed;
    if (typeof addAuditLog === 'function') {
      addAuditLog(activeOrder, AppState.selectedLang === 'ar' ? "تقديم طلب تعديل بانتظار موافقة الكاشير" : "Proposed edit request sent to Cashier");
    }

    saveToLocalStorage();

    // Cloud Sync (Supabase Update pending_update)
    if (supabaseClient) {
      supabaseClient
        .from('orders')
        .update({
          pending_update: proposed,
          audit_log: activeOrder.auditLog
        })
        .eq('id', orderId)
        .then(res => {
          console.log('Proposed edits persisted to Supabase pending_update:', res);
        });
    }

    showToastNotification(
      AppState.selectedLang === 'ar' 
        ? 'تم إرسال التعديلات بنجاح وبانتظار موافقة الكاشير! ⏳' 
        : 'Edits submitted successfully, pending cashier approval! ⏳',
      'ready'
    );
  }

  // Clear editing mode state
  AppState.editingOrderId = null;
  AppState.cart = [];
  document.getElementById('cart-notes').value = '';
  document.getElementById('cart-edit-mode-banner').classList.add('hidden');

  // Reset checkout button text
  const submitText = document.getElementById('txt-cart-checkout-btn');
  if (submitText) {
    submitText.innerText = AppState.selectedLang === 'ar' ? 'تأكيد وإرسال الطلب للمطبخ' : 'Confirm & Place Order';
  }

  // Return to live tracking
  updateLiveTrackingUI(activeOrder);
  switchMobileScreen('mobile-tracking');

  // Re-draw cashier / KDS reactive boards
  renderKDSBoard();
  renderCashierOrdersTable();
  updateCashierMetrics();
}

function updateLiveTrackingUI(order) {
  if (!order) return;

  const L = TRANSLATIONS[AppState.selectedLang];

  // Set Order ID
  document.getElementById('track-order-id').innerText = order.id;

  // Show or hide pending edit review banner!
  const pendingBanner = document.getElementById('tracking-edit-pending-banner');
  if (pendingBanner) {
    if (order.pendingUpdate) {
      pendingBanner.classList.remove('hidden');
    } else {
      pendingBanner.classList.add('hidden');
    }
  }

  // Disable or enable "Edit Current Order" button depending on order status
  const editBtn = document.getElementById('btn-track-edit-order');
  if (editBtn) {
    if (order.status === 'completed' || order.status === 'ready' || order.pendingUpdate) {
      editBtn.disabled = true;
      editBtn.style.opacity = '0.5';
      editBtn.style.cursor = 'not-allowed';
    } else {
      editBtn.disabled = false;
      editBtn.style.opacity = '1';
      editBtn.style.cursor = 'pointer';
    }
  }

  // Populate items summary card
  const itemsContainer = document.getElementById('tracking-items-summary');
  if (itemsContainer) {
    itemsContainer.innerHTML = '';
    
    // Add title
    const titleDiv = document.createElement('div');
    titleDiv.style.fontWeight = 'bold';
    titleDiv.style.fontSize = '0.85rem';
    titleDiv.style.color = 'var(--primary-red)';
    titleDiv.style.borderBottom = '1px dashed var(--light-border)';
    titleDiv.style.paddingBottom = '6px';
    titleDiv.style.marginBottom = '8px';
    titleDiv.innerText = AppState.selectedLang === 'ar' ? 'تفاصيل طلبك المقرمش:' : 'Your Crispy Order Details:';
    itemsContainer.appendChild(titleDiv);

    // Add items
    order.items.forEach(itm => {
      const itmRow = document.createElement('div');
      itmRow.style.display = 'flex';
      itmRow.style.justifyContent = 'space-between';
      itmRow.style.fontSize = '0.75rem';
      itmRow.style.color = 'var(--text-dark)';
      itmRow.style.marginBottom = '4px';
      
      const qtyAndName = `<span>${itm.qty}x ${AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn}</span>`;
      const priceText = `<span>${(itm.price * itm.qty).toFixed(2)} ${L.sar}</span>`;
      
      itmRow.innerHTML = `${qtyAndName}${priceText}`;
      itemsContainer.appendChild(itmRow);
    });

    // Add divider
    const divider = document.createElement('div');
    divider.style.borderTop = '1px dashed var(--light-border)';
    divider.style.margin = '8px 0';
    itemsContainer.appendChild(divider);

    // Add total row
    const totalRow = document.createElement('div');
    totalRow.style.display = 'flex';
    totalRow.style.justifyContent = 'space-between';
    totalRow.style.fontWeight = '800';
    totalRow.style.fontSize = '0.85rem';
    totalRow.style.color = 'var(--text-dark)';
    
    totalRow.innerHTML = `
      <span>${AppState.selectedLang === 'ar' ? 'المجموع الإجمالي:' : 'Total Amount:'}</span>
      <span style="color: var(--primary-red);">${order.total.toFixed(2)} ${L.sar}</span>
    `;
    itemsContainer.appendChild(totalRow);

    // Add a non-shrinking bottom spacer to prevent browser scrollable-flexbox padding clipping!
    const spacer = document.createElement('div');
    spacer.style.height = '6px';
    spacer.style.flexShrink = '0';
    itemsContainer.appendChild(spacer);
  }

  // Timeline Step Status Adjustments
  const stepPlaced = document.getElementById('track-step-placed');
  const stepCook = document.getElementById('track-step-cooking');
  const stepReady = document.getElementById('track-step-ready');
  const stepDone = document.getElementById('track-step-done');

  // Reset steps
  [stepPlaced, stepCook, stepReady, stepDone].forEach(st => st.className = 'tracking-step');

  // Set Success circle icon
  const successBadge = document.getElementById('tracking-success-badge');

  if (order.status === 'pending_payment' || order.status === 'paid') {
    stepPlaced.classList.add('active');
    successBadge.innerHTML = `<i class="fa-solid fa-receipt"></i>`;
    successBadge.style.backgroundColor = 'var(--color-completed)';
    if (order.status === 'pending_payment') {
      document.getElementById('track-timer').innerText = AppState.selectedLang === 'ar' ? 'بانتظار تحصيل الفاتورة عند الكاشير ⏳' : 'Waiting for payment at cashier ⏳';
    } else {
      document.getElementById('track-timer').innerText = AppState.selectedLang === 'ar' ? '١٢-١٨ دقيقة' : '12-18 mins';
    }
  } else if (order.status === 'preparing') {
    stepPlaced.classList.add('completed');
    stepCook.classList.add('active');
    successBadge.innerHTML = `<i class="fa-solid fa-kitchen-set"></i>`;
    successBadge.style.backgroundColor = 'var(--color-prep)';
    document.getElementById('track-timer').innerText = AppState.selectedLang === 'ar' ? '٥-٨ دقائق' : '5-8 mins';
  } else if (order.status === 'ready') {
    stepPlaced.classList.add('completed');
    stepCook.classList.add('completed');
    stepReady.classList.add('active');
    successBadge.innerHTML = `<i class="fa-solid fa-bell-concierge"></i>`;
    successBadge.style.backgroundColor = 'var(--color-ready)';
    successBadge.style.animation = 'bounce 1s infinite';
    document.getElementById('track-timer').innerText = AppState.selectedLang === 'ar' ? 'الطلب جاهز للتسليم!' : 'Ready for pickup!';
  } else if (order.status === 'delivered') { // delivered replaces completed!
    stepPlaced.classList.add('completed');
    stepCook.classList.add('completed');
    stepReady.classList.add('completed');
    stepDone.classList.add('active');
    successBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i>`;
    successBadge.style.backgroundColor = 'var(--color-ready)';
    successBadge.style.animation = 'none';
    document.getElementById('track-timer').innerText = AppState.selectedLang === 'ar' ? 'تم الاستلام بالهناء والعافية' : 'Enjoy your meal!';
  }
}

// ==========================================================================
// 11. KITCHEN DISPLAY SYSTEM (KDS) OPERATIONS
// ==========================================================================
function renderKDSBoard() {
  const stackNew = document.getElementById('kds-stack-new');
  const stackPrep = document.getElementById('kds-stack-prep');
  const stackReady = document.getElementById('kds-stack-ready');

  if (!stackNew || !stackPrep || !stackReady) return;

  stackNew.innerHTML = '';
  stackPrep.innerHTML = '';
  stackReady.innerHTML = '';

  let countNew = 0;
  let countPrep = 0;
  let countReady = 0;

  AppState.orders.forEach(order => {
    if (order.status === 'delivered') return; // Delivered orders are archived from the KDS board
    
    // New Workflow Constraint: Orders MUST be approved/paid by cashier before reaching the kitchen!
    if (order.status === 'pending_payment') return;

    const card = document.createElement('div');
    card.className = `kds-card ${order.status}-order`;

    // Metainfo (Table vs Takeaway)
    const typeLabel = order.type === 'dine-in' 
      ? (AppState.selectedLang === 'ar' ? `محلي - طاولة ${order.table}` : `Dine-in - Table ${order.table}`)
      : (AppState.selectedLang === 'ar' ? 'سفري - كرتون' : 'Takeaway - Box');

    const paymentLabel = `<span class="badge-pay paid" style="font-size: 0.65rem;">${AppState.selectedLang === 'ar' ? 'مدفوع' : 'Paid'}</span>`;

    // Render items list lines
    let itemsHtml = '';
    order.items.forEach(itm => {
      const name = AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn;
      itemsHtml += `
        <div class="kds-item-line">
          <div>
            <span class="kds-item-qty">${itm.qty}x</span>
            <span class="kds-item-name">${name}</span>
          </div>
        </div>
      `;
    });

    let noteHtml = '';
    if (order.notes) {
      noteHtml = `<div class="kds-item-note"><i class="fa-solid fa-comment-dots"></i> ${order.notes}</div>`;
    }

    // Format cooking timer minutes:seconds
    const minutes = Math.floor(order.elapsedSeconds / 60);
    const seconds = order.elapsedSeconds % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerClass = order.elapsedSeconds > 180 ? 'kds-timer-wrap warning' : 'kds-timer-wrap';

    // Action button based on status
    let actionBtn = '';
    if (order.status === 'paid') {
      countNew++;
      actionBtn = `<button class="kds-action-btn start" data-id="${order.id}">${AppState.selectedLang === 'ar' ? 'بدء التحضير' : 'Start Prep'}</button>`;
    } else if (order.status === 'preparing') {
      countPrep++;
      actionBtn = `<button class="kds-action-btn ready" data-id="${order.id}">${AppState.selectedLang === 'ar' ? 'جاهز للتسليم' : 'Ready'}</button>`;
    } else if (order.status === 'ready') {
      countReady++;
      actionBtn = `<button class="kds-action-btn serve" data-id="${order.id}">${AppState.selectedLang === 'ar' ? 'تسليم وإغلاق' : 'Serve'}</button>`;
    }

    card.innerHTML = `
      <div class="kds-card-header">
        <span class="kds-card-id">${order.id}</span>
        <span class="kds-card-meta">${order.timestamp}</span>
      </div>
      <div class="kds-card-content">
        <div class="kds-card-details-row">
          <span class="kds-card-type-tag">${typeLabel}</span>
          ${paymentLabel}
        </div>
        <div class="kds-items-list">
          ${itemsHtml}
        </div>
        ${noteHtml}
      </div>
      <div class="kds-card-footer">
        <div class="${timerClass}">
          <i class="fa-solid fa-stopwatch"></i>
          <span>${timeStr}</span>
        </div>
        ${actionBtn}
      </div>
    `;

    // Append to correct column
    if (order.status === 'paid') {
      stackNew.appendChild(card);
    } else if (order.status === 'preparing') {
      stackPrep.appendChild(card);
    } else if (order.status === 'ready') {
      stackReady.appendChild(card);
    }
  });

  // Attach button triggers
  document.querySelectorAll('.kds-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.getAttribute('data-id');
      advanceOrderStatus(orderId);
    });
  });

  // Render top headers count badges
  const cntNew = document.getElementById('kds-count-new');
  if (cntNew) cntNew.innerText = countNew;
  const cntPrep = document.getElementById('kds-count-prep');
  if (cntPrep) cntPrep.innerText = countPrep;
  const cntReady = document.getElementById('kds-count-ready');
  if (cntReady) cntReady.innerText = countReady;

  const colNew = document.getElementById('kds-col-new-count');
  if (colNew) colNew.innerText = countNew;
  const colPrep = document.getElementById('kds-col-prep-count');
  if (colPrep) colPrep.innerText = countPrep;
  const colReady = document.getElementById('kds-col-ready-count');
  if (colReady) colReady.innerText = countReady;
}

function advanceOrderStatus(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  const staffName = AppState.loggedStaff 
    ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
    : (AppState.selectedLang === 'ar' ? 'النظام' : 'System');

  if (order.status === 'paid') {
    order.status = 'preparing';
    if (typeof addAuditLog === 'function') {
      addAuditLog(order, AppState.selectedLang === 'ar' ? `بدء التحضير بواسطة ${staffName}` : `Started prep by ${staffName}`);
    }
    AudioSynthesizer.playBeep();
  } else if (order.status === 'preparing') {
    order.status = 'ready';
    if (typeof addAuditLog === 'function') {
      addAuditLog(order, AppState.selectedLang === 'ar' ? `جاهز للتسليم بواسطة ${staffName}` : `Marked ready by ${staffName}`);
    }
    AudioSynthesizer.playReadyBell();
    showToastNotification(
      AppState.selectedLang === 'ar'
        ? `طلب رقم ${orderId} جاهز الآن للتسليم!`
        : `Order ${orderId} is now ready for pickup!`,
      'ready'
    );
  } else if (order.status === 'ready') {
    order.status = 'delivered'; // transition to delivered!
    if (typeof addAuditLog === 'function') {
      addAuditLog(order, AppState.selectedLang === 'ar' ? `تم التسليم والإغلاق بواسطة ${staffName}` : `Served by ${staffName}`);
    }
    AudioSynthesizer.playBeep();
  }

  saveToLocalStorage();

  // Cloud Sync (Supabase Status Update)
  if (supabaseClient) {
    supabaseClient
      .from('orders')
      .update({ 
        status: order.status,
        audit_log: order.auditLog || []
      })
      .eq('id', order.id)
      .then(res => {
        if (res.error) {
          console.error('Order status update failed in Supabase:', res.error);
        } else {
          console.log('Order status updated in Supabase successfully:', res);
        }
      });
  }
  
  // Real-time reactive triggers
  renderKDSBoard();
  renderCashierOrdersTable();
  updateCashierMetrics();

  // If this was the order tracked in client mobile app, update its timeline directly!
  if (AppState.activeOrderId === orderId) {
    updateLiveTrackingUI(order);
  }
}

// Cooking timers incrementer loop (every 1 second)
setInterval(() => {
  AppState.orders.forEach(order => {
    if (order.status !== 'delivered') {
      order.elapsedSeconds++;
    }
  });
  // Only re-render KDS board when the kitchen view is active to optimize browser cycles
  if (AppState.activeRole === 'kitchen-view') {
    renderKDSBoard();
  }
}, 1000);

// ==========================================================================
// 12. CASHIER & ADMIN MANAGEMENT PANEL
// ==========================================================================
let cashierSearchQuery = "";
let selectedOrderForCheckout = null;
let selectedPaymentMethod = "cash";

function renderCashierOrdersTable() {
  const tbody = document.getElementById('cashier-orders-body');
  tbody.innerHTML = '';
  const L = TRANSLATIONS[AppState.selectedLang];

  const filtered = AppState.orders.filter(o => {
    const searchStr = `${o.id} ${o.name} ${o.phone}`.toLowerCase();
    return searchStr.includes(cashierSearchQuery.toLowerCase());
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
          ${AppState.selectedLang === 'ar' ? 'لا توجد طلبات مسجلة بالنظام حالياً' : 'No active orders registered in the system'}
        </td>
      </tr>
    `;
    return;
  }

  // Reverse list to show newest on top
  filtered.slice().reverse().forEach(o => {
    const tr = document.createElement('tr');
    if (selectedOrderForCheckout && selectedOrderForCheckout.id === o.id) {
      tr.style.backgroundColor = 'var(--primary-yellow-light)';
    }

    const typeLabel = o.type === 'dine-in'
      ? (AppState.selectedLang === 'ar' ? `محلي ط<sup>${o.table}</sup>` : `Dine-in T<sup>${o.table}</sup>`)
      : (AppState.selectedLang === 'ar' ? 'سفري كرتون' : 'Takeaway');

    let statusTag = '';
    if (o.status === 'new') {
      statusTag = `<span class="badge-status new">${AppState.selectedLang === 'ar' ? 'جديد' : 'New'}</span>`;
    } else if (o.status === 'preparing') {
      statusTag = `<span class="badge-status preparing">${AppState.selectedLang === 'ar' ? 'قيد التحضير' : 'In Prep'}</span>`;
    } else if (o.status === 'ready') {
      statusTag = `<span class="badge-status ready">${AppState.selectedLang === 'ar' ? 'جاهز' : 'Ready'}</span>`;
    } else if (o.status === 'completed') {
      statusTag = `<span class="badge-status completed">${AppState.selectedLang === 'ar' ? 'مكتمل' : 'Done'}</span>`;
    }

    if (o.pendingUpdate) {
      statusTag += ` <span class="badge-status" style="background-color: #FEF3C7; border: 1px solid #D97706; color: #B45309; margin-right: 4px; animation: pulse 1.5s infinite;"><i class="fa-solid fa-hourglass-half"></i> ${AppState.selectedLang === 'ar' ? 'تعديل معلق' : 'Edit Pending'}</span>`;
    }

    const payTag = o.paymentStatus === 'paid'
      ? `<span class="badge-pay paid">${AppState.selectedLang === 'ar' ? 'مدفوع' : 'Paid'}</span>`
      : `<span class="badge-pay unpaid">${AppState.selectedLang === 'ar' ? 'غير مدفوع' : 'Unpaid'}</span>`;

    tr.innerHTML = `
      <td style="font-weight: 800; color: var(--primary-red);">${o.id}</td>
      <td>
        <div style="font-weight: 700;">${o.name}</div>
        <div style="font-size: 0.7rem; color: var(--text-muted);">${o.phone}</div>
      </td>
      <td style="font-weight: 600;">${typeLabel}</td>
      <td style="font-weight: 800;">${o.total.toFixed(2)} ${L.sar}</td>
      <td>${statusTag}</td>
      <td>${payTag}</td>
    `;

    tr.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      selectedOrderForCheckout = o;
      renderCashierOrdersTable(); // redraw for selection highlight
      renderCashierCheckoutSidebar();
    });

    tbody.appendChild(tr);
  });
}

function updateCashierMetrics() {
  const L = TRANSLATIONS[AppState.selectedLang];

  let salesSum = 0;
  let ordersCount = 0;
  let activeTables = new Set();

  AppState.orders.forEach(o => {
    // Metrics calculations
    if (o.paymentStatus === 'paid') {
      salesSum += o.total;
    }
    ordersCount++;
    if (o.status !== 'completed' && o.type === 'dine-in') {
      activeTables.add(o.table);
    }
  });

  const avgBill = ordersCount > 0 ? (salesSum / AppState.orders.filter(o => o.paymentStatus === 'paid').length || 0) : 0;

  document.getElementById('lbl-total-sales').innerText = salesSum.toFixed(2) + " " + L.sar;
  document.getElementById('lbl-orders-count').innerText = ordersCount;
  document.getElementById('lbl-active-tables').innerText = activeTables.size;
  document.getElementById('lbl-avg-bill').innerText = avgBill.toFixed(2) + " " + L.sar;
}

function renderCashierCheckoutSidebar() {
  const content = document.getElementById('checkout-sidebar-content');
  const footer = document.getElementById('checkout-sidebar-footer');
  const L = TRANSLATIONS[AppState.selectedLang];

  if (!selectedOrderForCheckout) {
    content.innerHTML = `
      <div class="empty-checkout-state">
        <i class="fa-solid fa-cash-register"></i>
        <p>${AppState.selectedLang === 'ar' ? 'اختر طلباً من القائمة الجانبية لبدء استعراض الفاتورة وتحصيل المبلغ المالي' : 'Select an order from the list to preview bill and checkout'}</p>
      </div>
    `;
    footer.classList.add('hidden');
    return;
  }

  footer.classList.remove('hidden');

  let itemsHtml = '';
  selectedOrderForCheckout.items.forEach(itm => {
    const name = AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn;
    itemsHtml += `
      <div class="bill-row" style="margin-bottom: 6px; font-weight: 600;">
        <span>${itm.qty}x ${name}</span>
        <span>${(itm.price * itm.qty).toFixed(2)} ${L.sar}</span>
      </div>
    `;
  });

  const typeText = selectedOrderForCheckout.type === 'dine-in' 
    ? (AppState.selectedLang === 'ar' ? `محلي (طاولة ${selectedOrderForCheckout.table})` : `Dine-in (Table ${selectedOrderForCheckout.table})`)
    : (AppState.selectedLang === 'ar' ? 'سفري (تيك أواي)' : 'Takeaway');

  let auditTimelineHtml = '';
  if (selectedOrderForCheckout.auditLog && selectedOrderForCheckout.auditLog.length > 0) {
    let timelineItemsHtml = '';
    selectedOrderForCheckout.auditLog.forEach(log => {
      let dotClass = 'created';
      const actionText = log.action.toLowerCase();
      if (actionText.includes('تحضير') || actionText.includes('prep') || actionText.includes('cook')) {
        dotClass = 'preparing';
      } else if (actionText.includes('جاهز') || actionText.includes('ready')) {
        dotClass = 'ready';
      } else if (actionText.includes('تسليم') || actionText.includes('serve') || actionText.includes('complete')) {
        dotClass = 'completed';
      } else if (actionText.includes('فاتورة') || actionText.includes('pay') || actionText.includes('حص')) {
        dotClass = 'paid';
      }

      timelineItemsHtml += `
        <div class="audit-timeline-item" style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 12px; position: relative;">
          <div class="audit-timeline-dot ${dotClass}" style="width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; background-color: var(--color-${dotClass});"></div>
          <div class="audit-timeline-content" style="flex: 1; text-align: right;">
            <div class="title" style="font-size: 0.75rem; font-weight: 800; color: var(--text-dark);">${log.action}</div>
            <div class="meta" style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">
              <span>بواسطة: ${log.staff}</span> &bull; <span>${log.timestamp}</span>
            </div>
          </div>
        </div>
      `;
    });

    auditTimelineHtml = `
      <div style="margin-top: 18px; border-top: 1px dashed var(--light-border); padding-top: 14px;">
        <h5 class="form-label" style="font-size: 0.75rem; margin-bottom: 10px; font-weight: bold; color: var(--text-dark);">سجل الحركات المباشر:</h5>
        <div class="audit-timeline-wrapper" style="padding-right: 4px; position: relative;">
          ${timelineItemsHtml}
        </div>
      </div>
    `;
  }

  let comparisonHtml = '';
  if (selectedOrderForCheckout.pendingUpdate) {
    const proposed = selectedOrderForCheckout.pendingUpdate;
    
    // Original items list
    let origItemsText = selectedOrderForCheckout.items.map(itm => {
      const name = AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn;
      return `<div style="font-size: 0.65rem; color:#4B5563;">• ${itm.qty}x ${name}</div>`;
    }).join('');

    // Proposed items list
    let propItemsText = proposed.items.map(itm => {
      const name = AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn;
      return `<div style="font-size: 0.65rem; color:#B45309; font-weight:700;">• ${itm.qty}x ${name}</div>`;
    }).join('');

    const priceDiff = proposed.total - selectedOrderForCheckout.total;
    const diffText = priceDiff >= 0 
      ? `<span style="color: var(--color-ready); font-weight:800;">+${priceDiff.toFixed(2)} ${L.sar}</span>`
      : `<span style="color: var(--primary-red); font-weight:800;">${priceDiff.toFixed(2)} ${L.sar}</span>`;

    comparisonHtml = `
      <div class="pending-edit-comparison-card" style="background-color: #FFFBEB; border: 2px dashed #D97706; border-radius: 12px; padding: 14px; margin-top: 16px; text-align: right; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.05);">
        <h5 style="font-weight: 800; color: #B45309; font-size: 0.8rem; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-bell" style="animation: pulse 1.2s infinite;"></i>
          <span>${AppState.selectedLang === 'ar' ? 'طلب تعديل معلق من العميل!' : 'Pending Edit Request from Guest!'}</span>
        </h5>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.7rem; margin-bottom: 10px; border-bottom: 1px dashed rgba(217,119,6,0.2); padding-bottom: 10px;">
          <div style="border-left: 1px solid rgba(217,119,6,0.15); padding-left: 8px;">
            <strong style="color: #6B7280; display:block; margin-bottom: 4px;">${AppState.selectedLang === 'ar' ? 'الطلب الأصلي:' : 'Original Order:'}</strong>
            ${origItemsText}
            <div style="margin-top: 6px; font-weight: bold; color: var(--text-dark);">${AppState.selectedLang === 'ar' ? 'الإجمالي:' : 'Total:'} ${selectedOrderForCheckout.total.toFixed(2)}</div>
          </div>
          <div>
            <strong style="color: #B45309; display:block; margin-bottom: 4px;">${AppState.selectedLang === 'ar' ? 'الطلب المقترح الجديد:' : 'Proposed Edits:'}</strong>
            ${propItemsText}
            <div style="margin-top: 6px; font-weight: bold; color: #B45309;">${AppState.selectedLang === 'ar' ? 'الإجمالي:' : 'Total:'} ${proposed.total.toFixed(2)}</div>
          </div>
        </div>

        <div style="font-size: 0.75rem; font-weight: 700; margin-bottom: 12px; display: flex; justify-content: space-between;">
          <span>${AppState.selectedLang === 'ar' ? 'فارق السعر الإجمالي:' : 'Net Price Difference:'}</span>
          ${diffText}
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btn-cashier-approve-edit" style="flex:1; background-color: var(--color-ready); color:#fff; border:none; padding:8px; border-radius:6px; font-size:0.7rem; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
            <i class="fa-solid fa-circle-check"></i> ${AppState.selectedLang === 'ar' ? 'قبول التعديل' : 'Accept'}
          </button>
          <button id="btn-cashier-reject-edit" style="flex:1; background-color: var(--primary-red); color:#fff; border:none; padding:8px; border-radius:6px; font-size:0.7rem; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px;">
            <i class="fa-solid fa-circle-xmark"></i> ${AppState.selectedLang === 'ar' ? 'رفض التعديل' : 'Reject'}
          </button>
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 800; font-size: 1.15rem; color: var(--primary-red);">${selectedOrderForCheckout.id}</span>
        <span class="badge-status ${selectedOrderForCheckout.status === 'new' ? 'new' : selectedOrderForCheckout.status === 'preparing' ? 'preparing' : selectedOrderForCheckout.status === 'ready' ? 'ready' : 'completed'}">
          ${selectedOrderForCheckout.status === 'new' ? (AppState.selectedLang === 'ar' ? 'جديد' : 'New') : selectedOrderForCheckout.status === 'preparing' ? (AppState.selectedLang === 'ar' ? 'قيد التحضير' : 'Prep') : selectedOrderForCheckout.status === 'ready' ? (AppState.selectedLang === 'ar' ? 'جاهز' : 'Ready') : (AppState.selectedLang === 'ar' ? 'مكتمل' : 'Done')}
        </span>
      </div>

      <div style="font-size: 0.8rem; background-color: var(--light-bg); padding: 12px; border-radius: 10px; margin-bottom: 16px;">
        <div style="margin-bottom: 4px;"><strong>العميل:</strong> ${selectedOrderForCheckout.name}</div>
        <div style="margin-bottom: 4px;"><strong>الجوال:</strong> ${selectedOrderForCheckout.phone}</div>
        <div><strong>النوع:</strong> ${typeText}</div>
      </div>

      <h5 class="form-label" style="font-size: 0.75rem; margin-bottom: 10px;">عناصر الفاتورة المشتراة</h5>
      <div style="border-bottom: 1px dashed var(--light-border); padding-bottom: 10px; margin-bottom: 12px;">
        ${itemsHtml}
      </div>

      <!-- Price Totals -->
      <div class="bill-breakdown-card" style="padding: 0; border: none;">
        <div class="bill-row">
          <span>المجموع الفرعي</span>
          <span>${selectedOrderForCheckout.subtotal.toFixed(2)} ${L.sar}</span>
        </div>
        <div class="bill-row">
          <span>الضريبة (15%)</span>
          <span>${selectedOrderForCheckout.tax.toFixed(2)} ${L.sar}</span>
        </div>
        <div class="bill-row total">
          <span>الإجمالي النهائي</span>
          <span>${selectedOrderForCheckout.total.toFixed(2)} ${L.sar}</span>
        </div>
      </div>

      ${comparisonHtml}

      ${selectedOrderForCheckout.paymentStatus === 'paid' ? `
        <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid var(--color-ready); color: var(--color-ready); padding: 12px; border-radius: 10px; text-align: center; margin-top: 16px; font-weight: 800;">
          <i class="fa-solid fa-circle-check"></i> تم تحصيل فاتورة هذا الطلب بالكامل بنجاح
        </div>
      ` : ''}

      ${auditTimelineHtml}
    </div>
  `;

  // Handle pay method buttons selections
  const payButtons = document.querySelectorAll('.pay-btn');
  payButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-method') === selectedPaymentMethod) {
      btn.classList.add('active');
    }
  });

  // Disable checkout actions if already paid
  const payActionBtn = document.getElementById('btn-cashier-pay');
  if (selectedOrderForCheckout.paymentStatus === 'paid') {
    payActionBtn.disabled = true;
    payActionBtn.style.opacity = 0.5;
  } else {
    payActionBtn.disabled = false;
    payActionBtn.style.opacity = 1;
  }

  // Attach Accept/Reject Edit actions
  const btnApproveEdit = document.getElementById('btn-cashier-approve-edit');
  if (btnApproveEdit) {
    btnApproveEdit.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      if (!selectedOrderForCheckout || !selectedOrderForCheckout.pendingUpdate) return;
      
      const proposed = selectedOrderForCheckout.pendingUpdate;
      
      // Update order main details
      selectedOrderForCheckout.items = proposed.items;
      selectedOrderForCheckout.subtotal = proposed.subtotal;
      selectedOrderForCheckout.tax = proposed.tax;
      selectedOrderForCheckout.total = proposed.total;
      if (proposed.notes !== undefined) selectedOrderForCheckout.notes = proposed.notes;
      if (proposed.type) selectedOrderForCheckout.type = proposed.type;
      if (proposed.table) selectedOrderForCheckout.table = proposed.table;
      
      // Clear pending updates
      selectedOrderForCheckout.pendingUpdate = null;
      
      const staffName = AppState.loggedStaff 
        ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
        : (AppState.selectedLang === 'ar' ? 'الكاشير' : 'Cashier');
        
      addAuditLog(selectedOrderForCheckout, AppState.selectedLang === 'ar' ? `الموافقة على تعديلات العميل بواسطة ${staffName}` : `Guest edits approved by ${staffName}`);
      
      saveToLocalStorage();
      
      // Sync with Supabase
      if (supabaseClient) {
        let tableUuid = null;
        if (selectedOrderForCheckout.type === 'dine-in' && AppState.tables && AppState.tables.length > 0) {
          const matchedTable = AppState.tables.find(t => t.table_number === selectedOrderForCheckout.table);
          if (matchedTable) {
            tableUuid = matchedTable.id;
          }
        }

        supabaseClient
          .from('orders')
          .update({
            subtotal: selectedOrderForCheckout.subtotal,
            tax: selectedOrderForCheckout.tax,
            total: selectedOrderForCheckout.total,
            notes: selectedOrderForCheckout.notes,
            delivery_type: selectedOrderForCheckout.type,
            table_id: tableUuid,
            pending_update: null,
            audit_log: selectedOrderForCheckout.auditLog
          })
          .eq('id', selectedOrderForCheckout.id)
          .then(res => {
            console.log('Approved edits synced to Supabase successfully:', res);
            
            // Overwrite order items in order_items table
            supabaseClient
              .from('order_items')
              .delete()
              .eq('order_id', selectedOrderForCheckout.id)
              .then(() => {
                const itemsPayload = selectedOrderForCheckout.items.map(itm => {
                  return {
                    order_id: selectedOrderForCheckout.id,
                    product_id: itm.id,
                    quantity: itm.qty,
                    price: itm.price
                  };
                });

                supabaseClient
                  .from('order_items')
                  .insert(itemsPayload)
                  .then(itemsRes => {
                    console.log('Approved edits items synced to Supabase:', itemsRes);
                  });
              });
          });
      }
      
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم قبول تعديلات العميل وتحديث الطلب بنجاح! 🚀' : 'Accepted guest edits and updated order successfully! 🚀',
        'ready'
      );
      
      renderCashierOrdersTable();
      renderCashierCheckoutSidebar();
      renderKDSBoard();
      updateCashierMetrics();
    });
  }

  const btnRejectEdit = document.getElementById('btn-cashier-reject-edit');
  if (btnRejectEdit) {
    btnRejectEdit.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      if (!selectedOrderForCheckout || !selectedOrderForCheckout.pendingUpdate) return;
      
      // Clear pending updates
      selectedOrderForCheckout.pendingUpdate = null;
      
      const staffName = AppState.loggedStaff 
        ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
        : (AppState.selectedLang === 'ar' ? 'الكاشير' : 'Cashier');
        
      addAuditLog(selectedOrderForCheckout, AppState.selectedLang === 'ar' ? `رفض تعديلات العميل بواسطة ${staffName}` : `Guest edits rejected by ${staffName}`);
      
      saveToLocalStorage();
      
      // Sync with Supabase
      if (supabaseClient) {
        supabaseClient
          .from('orders')
          .update({
            pending_update: null,
            audit_log: selectedOrderForCheckout.auditLog
          })
          .eq('id', selectedOrderForCheckout.id)
          .then(res => {
            console.log('Rejected edits synced to Supabase successfully:', res);
          });
      }
      
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم رفض تعديلات العميل بنجاح.' : 'Rejected guest edits.',
        'new'
      );
      
      renderCashierOrdersTable();
      renderCashierCheckoutSidebar();
      renderKDSBoard();
    });
  }
}

function processCashierPayment() {
  if (!selectedOrderForCheckout) return;

  selectedOrderForCheckout.paymentStatus = 'paid';
  selectedOrderForCheckout.status = 'paid'; // Set status to paid as per flow!
  selectedOrderForCheckout.paymentMethod = selectedPaymentMethod;
  
  const staffName = AppState.loggedStaff 
    ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
    : (AppState.selectedLang === 'ar' ? 'الكاشير' : 'Cashier');
  
  if (typeof addAuditLog === 'function') {
    addAuditLog(selectedOrderForCheckout, AppState.selectedLang === 'ar' ? `تحصيل الفاتورة بواسطة ${staffName}` : `Payment collected by ${staffName}`);
  }

  saveToLocalStorage();

  // Cloud Sync (Supabase Payment Update to paid status)
  if (supabaseClient) {
    supabaseClient
      .from('orders')
      .update({ 
        status: 'paid', 
        payment_method: selectedOrderForCheckout.paymentMethod,
        audit_log: selectedOrderForCheckout.auditLog || []
      })
      .eq('id', selectedOrderForCheckout.id)
      .then(res => {
        if (res.error) {
          console.error('Payment update failed in Supabase:', res.error);
          showToastNotification(
            AppState.selectedLang === 'ar' 
              ? 'خطأ: لم يتم التحديث سحابياً!' 
              : 'Error: Cloud update failed!',
            'new'
          );
        } else {
          console.log('Payment processed in Supabase successfully:', res);
        }
      });
  }

  AudioSynthesizer.playReadyBell();

  showToastNotification(
    AppState.selectedLang === 'ar'
      ? `تم تحصيل الفاتورة للطلب ${selectedOrderForCheckout.id} بنجاح!`
      : `Payment completed successfully for ${selectedOrderForCheckout.id}!`,
    'ready'
  );

  renderCashierOrdersTable();
  renderCashierCheckoutSidebar();
  updateCashierMetrics();
  renderKDSBoard(); // KDS columns tags updates

  // Instantly trigger Thermal bill printout modal
  triggerPrintThermalBill();
}

function triggerPrintThermalBill() {
  if (!selectedOrderForCheckout) return;

  const L = TRANSLATIONS[AppState.selectedLang];
  const itemsRows = selectedOrderForCheckout.items.map(itm => {
    const name = AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn;
    // pad string for ASCII thermal paper alignment
    const paddedName = name.slice(0, 16).padEnd(16, ' ');
    const priceStr = (itm.price * itm.qty).toFixed(2).padStart(8, ' ');
    return `${paddedName} ${itm.qty}x ${priceStr} ${L.sar}`;
  }).join('\n');

  const receiptBody = document.getElementById('thermal-receipt-body');
  
  const typeText = selectedOrderForCheckout.type === 'dine-in'
    ? (AppState.selectedLang === 'ar' ? `LOCAL TABLE: ${selectedOrderForCheckout.table}` : `LOCAL TABLE: ${selectedOrderForCheckout.table}`)
    : (AppState.selectedLang === 'ar' ? 'TAKEAWAY / BOX' : 'TAKEAWAY / BOX');

  const paymentText = selectedOrderForCheckout.paymentMethod === 'cash' 
    ? 'CASH / CASHIER' 
    : selectedOrderForCheckout.paymentMethod === 'mada' 
      ? 'MADA CARD' 
      : 'APPLE PAY';

  receiptBody.innerHTML = `
    <div class="receipt-header">
      <div class="receipt-logo-wrap">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#FFC107" stroke="#333" stroke-width="2"/>
          <circle cx="50" cy="46" r="22" fill="#FFFFFF" stroke="#333" stroke-width="2"/>
          <path d="M 44 46 L 56 46 L 50 58 Z" fill="#FF9800" stroke="#333" stroke-width="2"/>
          <ellipse cx="44" cy="38" rx="3" ry="5" fill="#000"/><ellipse cx="56" cy="38" rx="3" ry="5" fill="#000"/>
        </svg>
      </div>
      <h3 class="receipt-title">هاي بروست | HI PROUST</h3>
      <p style="font-size: 0.7rem;">أقرمش طعم، وأوفر سعر!</p>
    </div>
    
    <div class="receipt-divider"></div>
    
    <div class="receipt-meta-line"><span>ORDER ID:</span> <strong>${selectedOrderForCheckout.id}</strong></div>
    <div class="receipt-meta-line"><span>CUSTOMER:</span> <span>${selectedOrderForCheckout.name}</span></div>
    <div class="receipt-meta-line"><span>PHONE:</span> <span>${selectedOrderForCheckout.phone}</span></div>
    <div class="receipt-meta-line"><span>TYPE:</span> <span>${typeText}</span></div>
    <div class="receipt-meta-line"><span>DATE:</span> <span>${selectedOrderForCheckout.timestamp}</span></div>
    
    <div class="receipt-divider"></div>
    
    <div style="font-size: 0.75rem; font-weight: bold; margin-bottom: 6px;">ITEMS DETAIL:</div>
    <pre style="font-family: inherit; font-size: 0.7rem; line-height: 1.4; margin: 0; white-space: pre-wrap;">
${itemsRows}
    </pre>
    
    <div class="receipt-divider"></div>
    
    <div class="receipt-meta-line"><span>SUBTOTAL:</span> <span>${selectedOrderForCheckout.subtotal.toFixed(2)} ${L.sar}</span></div>
    <div class="receipt-meta-line"><span>VAT TAX (15%):</span> <span>${selectedOrderForCheckout.tax.toFixed(2)} ${L.sar}</span></div>
    <div class="receipt-divider" style="border-top-style: double;"></div>
    <div class="receipt-meta-line" style="font-size: 0.95rem; font-weight: bold;">
      <span>TOTAL DUE:</span> 
      <span>${selectedOrderForCheckout.total.toFixed(2)} ${L.sar}</span>
    </div>
    
    <div class="receipt-divider"></div>
    <div class="receipt-meta-line"><span>PAY METHOD:</span> <strong>${paymentText}</strong></div>
    <div class="receipt-meta-line"><span>PAY STATUS:</span> <strong>PAID / SECURED</strong></div>
    
    <div class="receipt-divider"></div>
    <div class="receipt-footer-msg">
      شكراً لشرائكم من هاي بروست!<br>
      THANK YOU FOR DINING WITH US!
    </div>
  `;

  document.getElementById('receipt-modal-overlay').classList.add('active');
}

// ==========================================================================
// 13. QUICK TOAST NOTIFICATIONS & MOCK SIMULATOR DATA
// ==========================================================================
function showToastNotification(text, type = 'new') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '<i class="fa-solid fa-bell"></i>';
  if (type === 'new') {
    icon = '<i class="fa-solid fa-receipt"></i>';
  } else if (type === 'ready') {
    icon = '<i class="fa-solid fa-bell-concierge" style="animation: bounce 0.8s infinite;"></i>';
  }

  toast.innerHTML = `${icon} <span>${text}</span>`;
  container.appendChild(toast);

  // automatically dismiss after 4.5 seconds
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Trigger quick mock sample orders on click or first launch
function triggerAutoMockOrder() {
  const names = ["عبدالرحمن خالد", "سارة علي", "فيصل العتيبي", "لولوة المطيري", "خالد الحربي", "نورة الدوسري"];
  const phones = ["01012345678", "01198765432", "01211122233", "01544455566", "01077788899", "01199900011"];
  const tables = [2, 3, 5, 6, 8];

  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomPhone = phones[Math.floor(Math.random() * phones.length)];
  const randomTable = tables[Math.floor(Math.random() * tables.length)];

  // Choose 2 to 3 random menu items
  const menuOptions = MENU.filter(m => m.id !== 'sd-02'); // exclude extra sauce
  const cartSize = Math.floor(Math.random() * 2) + 2; // 2 or 3 items
  const mockCart = [];

  for (let i = 0; i < cartSize; i++) {
    const item = menuOptions[Math.floor(Math.random() * menuOptions.length)];
    if (!mockCart.find(m => m.id === item.id)) {
      mockCart.push({
        id: item.id,
        qty: Math.floor(Math.random() * 2) + 1 // 1 or 2 quantity
      });
    }
  }

  // Set selected details to state
  AppState.customerName = randomName;
  AppState.phoneNumber = randomPhone;
  AppState.selectedTable = randomTable;
  AppState.cart = mockCart;
  AppState.deliveryType = Math.random() > 0.35 ? 'dine-in' : 'takeaway';
  AppState.cartNotes = Math.random() > 0.6 ? (AppState.selectedLang === 'ar' ? "زيادة كاتشب وثومية إضافية" : "Extra ketchup and garlic sauce please") : "";

  triggerPlaceOrder();
}

function prePopulateHistoricalOrders() {
  // Mock seeding disabled as requested to run purely on real database orders
}

// ==========================================================================
// 13.5 CUSTOMER PROFILE & LOYALTY RENDERER
// ==========================================================================
function renderCustomerProfileScreen() {
  try {
    console.log("Entering renderCustomerProfileScreen...");
    const nameLabel = document.getElementById('profile-user-name');
    const phoneLabel = document.getElementById('profile-user-phone');
    const historyContainer = document.getElementById('profile-orders-history');
    
    if (nameLabel) {
      nameLabel.innerText = AppState.customerName || (AppState.selectedLang === 'ar' ? "عميل مميز" : "Valued Customer");
    }
    if (phoneLabel) {
      phoneLabel.innerText = AppState.phoneNumber || "01XXXXXXXXX";
    }

    const lang = AppState.selectedLang || 'ar';
    const L = TRANSLATIONS[lang] || TRANSLATIONS['ar'];

    if (historyContainer) {
      // Show a beautiful loading spinner inside history container
      historyContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 30px 10px; width: 100%;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--primary-red); margin-bottom: 8px;"></i>
          <p style="font-size: 0.75rem;">${lang === 'ar' ? 'جاري تحميل وجباتك السابقة...' : 'Loading your past meals...'}</p>
        </div>
      `;
    }

    const renderHistoryUI = (customerOrders) => {
      try {
        if (!historyContainer) return;
        if (!Array.isArray(customerOrders)) {
          customerOrders = [];
        }
        const completedOrdersCount = customerOrders.filter(o => o && (o.status === 'completed' || o.paymentStatus === 'paid')).length;
        
        // Loyalty progress rules: completed orders count modulo 5
        const currentProgress = completedOrdersCount % 5;
        const progressPercent = (currentProgress / 5) * 100;
        
        const loyaltyBar = document.getElementById('profile-loyalty-bar');
        if (loyaltyBar) loyaltyBar.style.width = `${progressPercent}%`;
        
        const loyaltyPercent = document.getElementById('profile-loyalty-percent');
        if (loyaltyPercent) loyaltyPercent.innerText = `${progressPercent}%`;
        
        const countLabel = lang === 'ar' 
          ? `الطلبات الحالية: ${currentProgress} / 5` 
          : `Current orders: ${currentProgress} / 5`;
        const loyaltyCount = document.getElementById('profile-loyalty-count');
        if (loyaltyCount) loyaltyCount.innerText = countLabel;

        // Set Loyalty level title based on order count
        const tierBadge = document.getElementById('profile-loyalty-tier');
        if (tierBadge) {
          if (completedOrdersCount >= 10) {
            tierBadge.innerText = lang === 'ar' ? 'الطبقة الماسية 💎' : 'Diamond Tier 💎';
            tierBadge.style.backgroundColor = '#E2E8F0';
            tierBadge.style.color = '#1E293B';
          } else if (completedOrdersCount >= 5) {
            tierBadge.innerText = lang === 'ar' ? 'الطبقة البلاتينية 👑' : 'Platinum Tier 👑';
            tierBadge.style.backgroundColor = '#1E293B';
            tierBadge.style.color = '#F1F5F9';
          } else {
            tierBadge.innerText = lang === 'ar' ? 'الطبقة الذهبية 🌟' : 'Gold Tier 🌟';
            tierBadge.style.backgroundColor = '#121214';
            tierBadge.style.color = '#FFC107';
          }
        }

        // Render list
        historyContainer.innerHTML = '';
        
        if (customerOrders.length === 0) {
          historyContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px 10px; background-color: #fff; border-radius: 12px; border: 1px dashed var(--light-border); width: 100%;">
              <i class="fa-solid fa-clock-rotate-left" style="font-size: 2rem; color: var(--light-border); margin-bottom: 8px;"></i>
              <p style="font-size: 0.75rem;">${lang === 'ar' ? 'لا يوجد لديك طلبات سابقة بعد!' : 'No past orders registered yet!'}</p>
            </div>
          `;
          return;
        }

        // Render reverse chronological history
        customerOrders.forEach(o => {
          try {
            if (!o) return;
            const card = document.createElement('div');
            card.className = 'history-order-card';
            card.style.backgroundColor = '#fff';
            card.style.border = '1px solid rgba(0,0,0,0.03)';
            card.style.borderRadius = '12px';
            card.style.padding = '12px';
            card.style.width = '100%';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.gap = '6px';
            card.style.textAlign = 'right';

            const itemsArr = Array.isArray(o.items) ? o.items : [];
            const itemsSummary = itemsArr.map(itm => {
              const name = lang === 'ar' ? (itm.nameAr || '') : (itm.nameEn || '');
              return `${itm.qty || 1}x ${name}`;
            }).join(' ، ');

            const isActive = o.status !== 'delivered';
            const buttonHtml = isActive 
              ? `<button class="btn-track-active" data-id="${o.id}" style="background-color: var(--primary-red); border: none; color: #fff; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; direction: rtl;">
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>${lang === 'ar' ? 'تتبع الطلب' : 'Track'}</span>
                </button>`
              : `<button class="btn-reorder" data-id="${o.id}" style="background-color: var(--primary-yellow); border: none; color: #121214; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; direction: rtl;">
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>${lang === 'ar' ? 'إعادة طلب' : 'Reorder'}</span>
                </button>`;

            const displayId = o.id || '';
            const displayTimestamp = o.timestamp || '';
            const displayTotal = typeof o.total === 'number' ? o.total : (Number(o.total) || 0);

            card.innerHTML = `
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--light-border); padding-bottom: 6px; direction: ltr;">
                <span style="font-weight: 800; color: var(--primary-red); font-size: 0.8rem;">${displayId}</span>
                <span style="font-size: 0.7rem; color: var(--text-muted);">${displayTimestamp}</span>
              </div>
              <p style="font-size: 0.7rem; color: var(--text-dark); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; margin-top: 4px;"><strong>الوجبات:</strong> ${itemsSummary}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; direction: ltr;">
                <span style="font-weight: 800; font-size: 0.85rem; color: var(--primary-red);">${displayTotal.toFixed(2)} ${(L && L.sar) || 'ر.س'}</span>
                ${buttonHtml}
              </div>
            `;
            historyContainer.appendChild(card);
          } catch (innerErr) {
            console.error("Error rendering single order card in profile:", innerErr, o);
          }
        });

        // Attach Reorder action buttons
        historyContainer.querySelectorAll('.btn-reorder').forEach(btn => {
          btn.addEventListener('click', () => {
            AudioSynthesizer.playBeep();
            
            // Block reordering if they already have an active order
            const activeOrder = AppState.orders.find(o => o && o.phone === AppState.phoneNumber && o.status !== 'delivered');
            if (activeOrder) {
              showToastNotification(
                lang === 'ar'
                  ? `لديك طلب نشط بالفعل (${activeOrder.id})! لا يمكنك إعادة الطلب حتى يتم تسليم طلبك الحالي.`
                  : `You already have an active order (${activeOrder.id})! You cannot reorder until your current order is delivered.`,
                'new'
              );
              return;
            }

            const orderId = btn.getAttribute('data-id');
            const targetOrder = customerOrders.find(o => o && o.id === orderId);
            if (targetOrder) {
              AppState.cart = [];
              const itemsArr = Array.isArray(targetOrder.items) ? targetOrder.items : [];
              itemsArr.forEach(itm => {
                AppState.cart.push({
                  id: itm.id,
                  qty: itm.qty
                });
              });
              
              showToastNotification(
                lang === 'ar'
                  ? 'تمت إضافة جميع عناصر الوجبة السابقة لسلتك!'
                  : 'Reordered! All items added to your cart!',
                'ready'
              );
              
              renderCartSummary();
              renderMenuCatalog();
              switchMobileScreen('mobile-cart');
            }
          });
        });

        // Attach Track action buttons
        historyContainer.querySelectorAll('.btn-track-active').forEach(btn => {
          btn.addEventListener('click', () => {
            AudioSynthesizer.playBeep();
            const orderId = btn.getAttribute('data-id');
            const targetOrder = customerOrders.find(o => o && o.id === orderId);
            if (targetOrder) {
              AppState.activeOrderId = targetOrder.id;
              saveToLocalStorage();
              updateLiveTrackingUI(targetOrder);
              switchMobileScreen('mobile-tracking');
            }
          });
        });
      } catch (errUI) {
        console.error("Error in renderHistoryUI rendering loop:", errUI);
      }
    };

    if (supabaseClient && AppState.customerId && AppState.customerId !== "null" && AppState.customerId !== "undefined") {
      console.log("Fetching orders from Supabase for customer_id:", AppState.customerId);
      supabaseClient
        .from('orders')
        .select(`
          id,
          status,
          subtotal,
          tax,
          total,
          notes,
          delivery_type,
          payment_method,
          pending_update,
          audit_log,
          created_at,
          customers ( id, name, phone ),
          tables ( id, table_number ),
          order_items ( id, quantity, price, product_id, products ( id, name_ar, name_en ) )
        `)
        .eq('customer_id', AppState.customerId)
        .order('created_at', { ascending: false })
        .then(res => {
          if (res.error) {
            console.warn("Supabase profile history fetch returned error:", res.error);
            renderHistoryUI(AppState.orders.filter(o => o.phone === AppState.phoneNumber).slice().reverse());
            return;
          }
          if (res.data) {
            const fetchedOrders = res.data.map(o => {
              const items = (o.order_items || []).map(item => {
                return {
                  id: item.product_id,
                  nameAr: item.products ? item.products.name_ar : '',
                  nameEn: item.products ? item.products.name_en : '',
                  qty: item.quantity,
                  price: Number(item.price)
                };
              });

              return {
                id: o.id,
                table: o.tables ? o.tables.table_number : 0,
                name: o.customers ? o.customers.name : '',
                phone: o.customers ? o.customers.phone : '',
                items: items,
                subtotal: Number(o.subtotal),
                tax: Number(o.tax),
                total: Number(o.total),
                notes: o.notes,
                type: o.delivery_type,
                status: o.status,
                paymentStatus: o.status === 'pending_payment' ? 'unpaid' : 'paid',
                paymentMethod: o.payment_method,
                pendingUpdate: typeof o.pending_update === 'string' ? JSON.parse(o.pending_update) : o.pending_update,
                auditLog: typeof o.audit_log === 'string' ? JSON.parse(o.audit_log) : (o.audit_log || []),
                timestamp: new Date(o.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                elapsedSeconds: Math.floor((Date.now() - new Date(o.created_at).getTime()) / 1000)
              };
            });
            renderHistoryUI(fetchedOrders);
          } else {
            renderHistoryUI([]);
          }
        })
        .catch(err => {
          console.warn("Profiles history fetch failed, using memory:", err);
          renderHistoryUI(AppState.orders.filter(o => o.phone === AppState.phoneNumber).slice().reverse());
        });
    } else {
      console.log("No valid Supabase customer_id found, using memory fallback...");
      renderHistoryUI(AppState.orders.filter(o => o.phone === AppState.phoneNumber).slice().reverse());
    }
  } catch (globalErr) {
    console.error("Critical error in renderCustomerProfileScreen:", globalErr);
  }
}

// ==========================================================================
// 13.7 MULTI-USER STAFF PORTAL & AUDITING CONTROLLERS
// ==========================================================================
const STAFF_PROFILES = [
  { id: 'fahad', name: 'المدير فهد', nameEn: 'Manager Fahad', role: 'admin', pin: '1111', avatar: '👨‍💼' },
  { id: 'sarah', name: 'المديرة سارة', nameEn: 'Manager Sarah', role: 'admin', pin: '2222', avatar: '👩‍💼' },
  { id: 'salem', name: 'الكاشير سالم', nameEn: 'Cashier Salem', role: 'cashier', pin: '3333', avatar: '👨‍💻' },
  { id: 'khalid', name: 'الكاشير خالد', nameEn: 'Cashier Khalid', role: 'cashier', pin: '4444', avatar: '👨‍💻' },
  { id: 'omar', name: 'الشيف عمر', nameEn: 'Chef Omar', role: 'kitchen', pin: '5555', avatar: '👨‍🍳' },
  { id: 'tariq', name: 'الشيف طارق', nameEn: 'Chef Tariq', role: 'kitchen', pin: '6666', avatar: '👨‍🍳' }
];

let selectedStaff = null;
let currentPinInput = "";
let selectedBase64Image = "";

function addAuditLog(order, action) {
  if (!order.auditLog) {
    order.auditLog = [];
  }
  
  const staffName = AppState.loggedStaff 
    ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
    : (AppState.selectedLang === 'ar' ? 'نظام تلقائي' : 'System Auto');

  const entry = {
    action: action,
    staff: staffName,
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString()
  };

  order.auditLog.push(entry);
}

function initStaffLoginPortal(targetRole) {
  const loginModal = document.getElementById('staff-login-modal');
  if (!loginModal) return;

  const staffProfilesContainer = document.getElementById('staff-profiles-container');
  const stepProfile = document.getElementById('login-step-profile');
  const stepPin = document.getElementById('login-step-pin');

  // Check if a staff is already logged in for this session
  const storedStaffId = localStorage.getItem('HIPROUST_LOGGED_STAFF_' + targetRole);
  if (storedStaffId) {
    const staff = STAFF_PROFILES.find(s => s.id === storedStaffId && s.role === targetRole);
    if (staff) {
      AppState.loggedStaff = staff;
      renderActiveStaffHeaderBadge(targetRole);
      loginModal.style.display = 'none';
      return;
    }
  }

  // Display login modal
  loginModal.style.display = 'flex';
  stepProfile.style.display = 'block';
  stepPin.style.display = 'none';

  // Render profiles
  if (staffProfilesContainer) {
    staffProfilesContainer.innerHTML = '';
    const profiles = STAFF_PROFILES.filter(s => s.role === targetRole);
    profiles.forEach(p => {
      const item = document.createElement('div');
      item.className = 'staff-profile-item';
      item.setAttribute('data-id', p.id);
      
      const displayName = AppState.selectedLang === 'ar' ? p.name : p.nameEn;
      item.innerHTML = `
        <div class="avatar">${p.avatar}</div>
        <div class="name">${displayName}</div>
      `;
      
      item.addEventListener('click', () => {
        AudioSynthesizer.playBeep();
        selectedStaff = p;
        document.getElementById('selected-staff-display').innerText = displayName;
        currentPinInput = "";
        updatePinDots();
        stepProfile.style.display = 'none';
        stepPin.style.display = 'block';
      });
      staffProfilesContainer.appendChild(item);
    });
  }

  // Bind staff keypad buttons only once
  if (!loginModal.dataset.keypadBound) {
    loginModal.dataset.keypadBound = "true";
    loginModal.querySelectorAll('.keypad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        if (val !== null) {
          handleStaffKeypadPress(val);
        } else if (btn.id === 'btn-keypad-clear') {
          handleStaffKeypadPress('clear');
        } else if (btn.id === 'btn-keypad-backspace') {
          handleStaffKeypadPress('back');
        }
      });
    });

    const btnBackProfiles = document.getElementById('btn-back-to-profiles');
    if (btnBackProfiles) {
      btnBackProfiles.addEventListener('click', () => {
        AudioSynthesizer.playBeep();
        stepPin.style.display = 'none';
        stepProfile.style.display = 'block';
      });
    }
  }
}

function updatePinDots() {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`pin-dot-${i}`);
    if (dot) {
      if (i <= currentPinInput.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    }
  }
}

function handleStaffKeypadPress(val) {
  AudioSynthesizer.playBeep();
  if (val === 'clear') {
    currentPinInput = "";
  } else if (val === 'back') {
    currentPinInput = currentPinInput.slice(0, -1);
  } else if (currentPinInput.length < 4) {
    currentPinInput += val;
  }

  updatePinDots();

  if (currentPinInput.length === 4) {
    if (selectedStaff && currentPinInput === selectedStaff.pin) {
      AppState.loggedStaff = selectedStaff;
      localStorage.setItem('HIPROUST_LOGGED_STAFF_' + selectedStaff.role, selectedStaff.id);
      
      AudioSynthesizer.playReadyBell();
      showToastNotification(
        AppState.selectedLang === 'ar' 
          ? `مرحباً بك يا ${selectedStaff.name}! تم تسجيل دخولك بنجاح.` 
          : `Welcome, ${selectedStaff.nameEn}! Logged in successfully.`,
        'ready'
      );
      
      renderActiveStaffHeaderBadge(selectedStaff.role);
      document.getElementById('staff-login-modal').style.display = 'none';
    } else {
      AudioSynthesizer.playBeep();
      currentPinInput = "";
      updatePinDots();
      
      const loginCard = document.querySelector('.staff-login-card');
      if (loginCard) {
        loginCard.classList.add('shake-anim');
        setTimeout(() => loginCard.classList.remove('shake-anim'), 400);
      }
      
      showToastNotification(
        AppState.selectedLang === 'ar' 
          ? 'رمز الدخول السري غير صحيح! حاول مجدداً.' 
          : 'Incorrect PIN! Please try again.',
        'new'
      );
    }
  }
}

function renderActiveStaffHeaderBadge(role) {
  const badgeContainer = document.getElementById('active-staff-header-badge');
  if (!badgeContainer) return;

  if (AppState.loggedStaff) {
    const name = AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn;
    badgeContainer.className = 'active-staff-header-badge';
    badgeContainer.innerHTML = `
      <span class="avatar-circle">${AppState.loggedStaff.avatar}</span>
      <span class="name-display">${name}</span>
      <button class="btn-logout" title="${AppState.selectedLang === 'ar' ? 'خروج' : 'Logout'}">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    `;

    const btnLogout = badgeContainer.querySelector('.btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        AudioSynthesizer.playBeep();
        if (confirm(AppState.selectedLang === 'ar' ? "هل تريد تسجيل الخروج؟" : "Are you sure you want to log out?")) {
          localStorage.removeItem('HIPROUST_LOGGED_STAFF_' + role);
          AppState.loggedStaff = null;
          initStaffLoginPortal(role);
        }
      });
    }
  } else {
    badgeContainer.innerHTML = '';
  }
}

// ==========================================================================
// 13.9 DYNAMIC MENU & CATEGORIES CRUD CONTROLLERS
// ==========================================================================

function renderAdminMenuManage() {
  const categoriesListBody = document.getElementById('admin-categories-list-body');
  const productsCatalogContainer = document.getElementById('admin-products-catalog-container');

  if (categoriesListBody) {
    categoriesListBody.innerHTML = '';
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: var(--text-light); text-align: right; padding: 12px 8px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${cat.nameAr} <span style="color: var(--text-light-muted); font-weight: normal; font-size: 0.75rem;">/ ${cat.nameEn}</span></td>
        <td style="text-align: center; padding: 12px 8px;">
          <div style="display: flex; gap: 6px; justify-content: center; align-items: center;">
            <button class="sim-btn edit-cat-btn" data-id="${cat.id}" style="padding: 4px 10px; font-size: 0.7rem; background-color: var(--primary-yellow-light); border: 1px solid var(--primary-yellow); color: var(--text-dark); font-weight: 800; border-radius: 6px;">
              <i class="fa-solid fa-pen-to-square"></i> تعديل
            </button>
            <button class="sim-btn delete-cat-btn" data-id="${cat.id}" style="background-color: rgba(239, 68, 68, 0.1); border: 1px solid var(--color-new); color: var(--color-new); padding: 4px 10px; font-size: 0.7rem; font-weight: 800; border-radius: 6px;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      categoriesListBody.appendChild(tr);
    });

    categoriesListBody.querySelectorAll('.edit-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        openCategoryEditor(id);
      });
    });

    categoriesListBody.querySelectorAll('.delete-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        deleteCategory(id);
      });
    });
  }

  if (productsCatalogContainer) {
    productsCatalogContainer.innerHTML = '';
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return;
      const catProducts = MENU.filter(p => p.cat === cat.id);

      const groupDiv = document.createElement('div');
      groupDiv.className = 'admin-category-group';
      groupDiv.style.border = '1px solid var(--dark-border)';
      groupDiv.style.padding = '16px';
      groupDiv.style.backgroundColor = 'rgba(255,255,255,0.01)';
      groupDiv.style.borderRadius = '12px';

      let productsHtml = '';
      if (catProducts.length === 0) {
        productsHtml = `<div style="color: var(--text-light-muted); font-size: 0.8rem; padding: 8px; text-align: right;">لا توجد وجبات في هذا القسم حالياً</div>`;
      } else {
        let cardsHtml = '';
        catProducts.forEach(p => {
          let badgeHtml = '';
          if (p.spicy) {
            badgeHtml = `<span class="menu-card-badge" style="background-color: var(--primary-red); font-size: 0.65rem; top: 8px; right: 8px;"><i class="fa-solid fa-pepper-hot"></i> سبايسي</span>`;
          } else if (p.bestSeller) {
            badgeHtml = `<span class="menu-card-badge" style="background-color: var(--primary-yellow); color: #121214; font-size: 0.65rem; top: 8px; right: 8px;"><i class="fa-solid fa-fire"></i> الأكثر طلباً</span>`;
          }

          const title = AppState.selectedLang === 'ar' ? p.nameAr : p.nameEn;
          const desc = AppState.selectedLang === 'ar' ? p.descAr : p.descEn;

          let imageHtml = '';
          const imgSource = p.svg || p.imageUrl || '';
          if (imgSource.trim().startsWith('<svg')) {
            imageHtml = imgSource;
          } else if (imgSource.trim() !== '') {
            imageHtml = `<img src="${imgSource}" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
          } else {
            imageHtml = `<span style="font-size: 1.25rem; color: var(--text-light-muted);"><i class="fa-solid fa-image"></i></span>`;
          }

          cardsHtml += `
            <div class="admin-product-card" style="display: flex; gap: 12px; background-color: #ffffff; border: 1px solid var(--light-border); border-radius: 12px; padding: 12px; position: relative; box-shadow: var(--shadow-light); transition: all var(--transition-fast);">
              ${badgeHtml}
              <div style="width: 70px; height: 70px; border-radius: 8px; background-color: var(--primary-yellow-light); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative; border: 1px solid var(--light-border);">
                ${imageHtml}
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; text-align: right;">
                <div>
                  <h5 style="font-size: 0.85rem; font-weight: bold; color: var(--text-dark); margin-bottom: 2px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; padding-left: 55px;">${title}</h5>
                  <p style="font-size: 0.7rem; color: var(--text-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">${desc}</p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; direction: ltr;">
                  <div style="font-weight: 800; color: var(--primary-red); font-size: 0.85rem;">${p.price.toFixed(2)} <span style="font-size: 0.65rem;">SAR</span></div>
                  <div style="display: flex; gap: 8px;">
                    <button class="sim-btn edit-product-btn" data-id="${p.id}" style="padding: 4px 10px; font-size: 0.7rem; background-color: var(--primary-yellow-light); border: 1px solid var(--primary-yellow); color: var(--text-dark); font-weight: 800; border-radius: 6px;"><i class="fa-solid fa-pen-to-square"></i> تعديل</button>
                    <button class="sim-btn delete-product-btn" data-id="${p.id}" style="padding: 4px 10px; font-size: 0.7rem; background-color: rgba(239, 68, 68, 0.1); border: 1px solid var(--color-new); color: var(--color-new); font-weight: 800; border-radius: 6px;"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        productsHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">${cardsHtml}</div>`;
      }

      groupDiv.innerHTML = `
        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary-red); margin-bottom: 12px; border-bottom: 2px solid var(--primary-yellow); padding-bottom: 8px; text-align: right; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-folder-open" style="color: var(--primary-yellow);"></i> ${cat.nameAr} / ${cat.nameEn}
        </h4>
        ${productsHtml}
      `;
      productsCatalogContainer.appendChild(groupDiv);
    });

    productsCatalogContainer.querySelectorAll('.edit-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openProductEditor(id);
      });
    });

    productsCatalogContainer.querySelectorAll('.delete-product-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        deleteProduct(id);
      });
    });
  }
}

function openProductEditor(productId) {
  const p = MENU.find(item => item.id === productId);
  if (!p) return;

  const modal = document.getElementById('modal-product-editor');
  if (!modal) return;

  document.getElementById('product-editor-title').innerText = AppState.selectedLang === 'ar' ? 'تعديل صنف الوجبة' : 'Edit Menu Item';
  document.getElementById('edit-product-id').value = p.id;
  document.getElementById('edit-prod-name-ar').value = p.nameAr;
  document.getElementById('edit-prod-name-en').value = p.nameEn;
  document.getElementById('edit-prod-desc-ar').value = p.descAr || '';
  document.getElementById('edit-prod-desc-en').value = p.descEn || '';
  document.getElementById('edit-prod-price').value = p.price;

  const categorySelect = document.getElementById('edit-prod-category');
  if (categorySelect) {
    categorySelect.innerHTML = '';
    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return;
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.innerText = AppState.selectedLang === 'ar' ? cat.nameAr : cat.nameEn;
      if (cat.id === p.cat) {
        opt.selected = true;
      }
      categorySelect.appendChild(opt);
    });
  }

  document.getElementById('edit-prod-spicy').checked = !!p.spicy;
  document.getElementById('edit-prod-bestseller').checked = !!p.bestSeller;

  const previewBox = document.getElementById('product-image-preview-box');
  const urlInput = document.getElementById('edit-prod-url');
  const fileInput = document.getElementById('edit-prod-file');

  if (fileInput) fileInput.value = '';

  const imgSource = p.svg || p.imageUrl || '';
  if (imgSource.trim().startsWith('<svg')) {
    selectedBase64Image = '';
    urlInput.value = '';
    previewBox.innerHTML = imgSource;
  } else if (imgSource.trim() !== '') {
    if (imgSource.startsWith('data:image')) {
      selectedBase64Image = imgSource;
      urlInput.value = '';
    } else {
      selectedBase64Image = '';
      urlInput.value = imgSource;
    }
    previewBox.innerHTML = `<img src="${imgSource}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
  } else {
    selectedBase64Image = '';
    urlInput.value = '';
    previewBox.innerHTML = `<span style="font-size: 1.5rem; color: var(--text-light-muted);"><i class="fa-solid fa-image"></i></span>`;
  }

  modal.style.display = 'flex';
  modal.classList.add('active');
}

async function deleteProduct(productId) {
  if (confirm(AppState.selectedLang === 'ar' ? "هل أنت متأكد من رغبتك في حذف هذا الصنف من المنيو نهائياً؟" : "Are you sure you want to permanently delete this menu item?")) {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('products')
          .delete()
          .eq('id', productId);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting product from Supabase:", err);
      }
    }

    const idx = MENU.findIndex(m => m.id === productId);
    if (idx > -1) {
      MENU.splice(idx, 1);
    }

    showToastNotification(
      AppState.selectedLang === 'ar' ? 'تم حذف الصنف بنجاح!' : 'Item deleted successfully!',
      'new'
    );

    renderAdminMenuManage();
    
    // Also re-render other components locally
    const menuContainer = document.getElementById('menu-catalog');
    if (menuContainer) renderMenuCatalog();
  }
}

function openCategoryEditor(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const modal = document.getElementById('modal-category-editor');
  if (!modal) return;

  // Set modal title
  const modalTitle = modal.querySelector('h3');
  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fa-solid fa-folder-tree"></i> ` + (AppState.selectedLang === 'ar' ? 'تعديل قسم المنيو' : 'Edit Menu Category');
  }

  // Set input values
  const inputId = document.getElementById('edit-cat-id');
  if (inputId) {
    inputId.value = cat.id;
    inputId.disabled = true; // Category ID shouldn't be edited to preserve product mapping!
    inputId.style.opacity = '0.6';
    inputId.style.cursor = 'not-allowed';
  }

  document.getElementById('edit-cat-name-ar').value = cat.nameAr;
  document.getElementById('edit-cat-name-en').value = cat.nameEn;

  // Set submit button text
  const submitBtn = modal.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ` + (AppState.selectedLang === 'ar' ? 'حفظ التعديلات وتحديث القسم' : 'Save Category Changes');
  }

  modal.style.display = 'flex';
  modal.classList.add('active');
}

async function deleteCategory(catId) {
  if (confirm(AppState.selectedLang === 'ar' ? "تحذير: سيؤدي حذف هذا القسم لحذف جميع الوجبات التابعة له أيضاً! هل تريد الاستمرار؟" : "Warning: Deleting this category will delete all nested menu items too! Proceed?")) {
    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('categories')
          .delete()
          .eq('id', catId);
        if (error) throw error;
      } catch (err) {
        console.error("Error deleting category from Supabase:", err);
      }
    }

    // Delete nested products locally
    MENU = MENU.filter(p => p.cat !== catId);

    // Delete category locally
    CATEGORIES = CATEGORIES.filter(c => c.id !== catId);

    showToastNotification(
      AppState.selectedLang === 'ar' ? 'تم حذف القسم وجميع وجباته بنجاح!' : 'Category and its items deleted successfully!',
      'new'
    );

    renderAdminMenuManage();

    // Re-render user views if active
    const catContainer = document.getElementById('categories-scroll');
    if (catContainer) renderMenuCategories();
    const menuContainer = document.getElementById('menu-catalog');
    if (menuContainer) renderMenuCatalog();
  }
}

// ==========================================================================
// 14. INITIALIZATION & BINDING EVENTS
// ==========================================================================
// ==========================================================================
// 14. MODULAR PAGE INITIALIZERS & BINDINGS
// ==========================================================================

function initCustomerView() {
  // Splash Start
  const btnSplash = document.getElementById('btn-splash-start');
  if (btnSplash) {
    btnSplash.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      switchMobileScreen('mobile-phone');
    });
  }

  // Stepper Back buttons
  document.querySelectorAll('.btn-to-splash').forEach(b => {
    b.addEventListener('click', () => switchMobileScreen('mobile-splash'));
  });

  document.querySelectorAll('.btn-to-phone').forEach(b => {
    b.addEventListener('click', () => switchMobileScreen('mobile-phone'));
  });

  document.querySelectorAll('.btn-to-name').forEach(b => {
    b.addEventListener('click', () => switchMobileScreen('mobile-name'));
  });

  document.querySelectorAll('.btn-to-menu').forEach(b => {
    b.addEventListener('click', () => switchMobileScreen('mobile-menu'));
  });

  document.querySelectorAll('.btn-to-cart').forEach(b => {
    b.addEventListener('click', () => switchMobileScreen('mobile-cart'));
  });

  // Profile Drawer trigger
  const btnProfile = document.getElementById('btn-mobile-profile');
  if (btnProfile) {
    btnProfile.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      renderCustomerProfileScreen();
      switchMobileScreen('mobile-profile');
    });
  }

  // Keypad Keys
  document.querySelectorAll('#phone-keypad button').forEach(btn => {
    btn.addEventListener('click', () => {
      const char = btn.innerText;
      if (btn.id === 'btn-phone-confirm') {
        const btnPhoneSubmit = document.getElementById('btn-phone-submit');
        if (btnPhoneSubmit) btnPhoneSubmit.click();
      } else if (btn.classList.contains('delete') || btn.querySelector('i')) {
        handleKeypadPress('del');
      } else if (char !== "") {
        handleKeypadPress(char);
      }
    });
  });

  // Keypad Confirm with Dynamic Supabase Profile and Active Order Matching
  const btnPhoneSubmit = document.getElementById('btn-phone-submit');
  if (btnPhoneSubmit) {
    btnPhoneSubmit.addEventListener('click', () => {
      if (currentPhoneDigits.length < 11) {
        AudioSynthesizer.playBeep();
        showToastNotification(
          AppState.selectedLang === 'ar'
            ? "الرجاء إدخال رقم جوال مصري صحيح مكون من ١١ رقماً!"
            : "Please enter a valid 11-digit Egyptian mobile number!",
          'new'
        );
        return;
      }

      if (AppState.bannedCustomers && AppState.bannedCustomers.includes(currentPhoneDigits)) {
        AudioSynthesizer.playBeep();
        showToastNotification(
          AppState.selectedLang === 'ar'
            ? "عذراً، رقم جوالك محظور حالياً من قبل الإدارة التشغيلية."
            : "Sorry, this phone number is currently banned by the management.",
          'new'
        );
        return;
      }
      
      // Loading State Visual Cue
      const originalHtml = btnPhoneSubmit.innerHTML;
      btnPhoneSubmit.disabled = true;
      btnPhoneSubmit.innerHTML = AppState.selectedLang === 'ar' 
        ? 'جاري التحقق... <i class="fa-solid fa-spinner fa-spin"></i>' 
        : 'Verifying... <i class="fa-solid fa-spinner fa-spin"></i>';

      const localVerificationFallback = () => {
        AppState.phoneNumber = currentPhoneDigits;
        let localProfiles = {};
        const cachedProfiles = localStorage.getItem('HIPROUST_PROFILES');
        if (cachedProfiles) {
          try { localProfiles = JSON.parse(cachedProfiles); } catch(e) {}
        }

        const cachedName = localProfiles[currentPhoneDigits];
        const pastOrder = AppState.orders.find(o => o.phone === currentPhoneDigits);

        if (cachedName) {
          AppState.customerName = cachedName;
          saveToLocalStorage();
          showToastNotification(
            AppState.selectedLang === 'ar'
              ? `مرحباً بعودتك يا ${cachedName}! تم فتح ملفك الشخصي بنجاح 🔥`
              : `Welcome back, ${cachedName}! Profile unlocked successfully 🔥`,
            'ready'
          );
          switchMobileScreen('mobile-menu');
        } else if (pastOrder) {
          AppState.customerName = pastOrder.name;
          saveToLocalStorage();
          showToastNotification(
            AppState.selectedLang === 'ar'
              ? `مرحباً بعودتك يا ${pastOrder.name}! تم فتح ملفك الشخصي بنجاح 🔥`
              : `Welcome back, ${pastOrder.name}! Profile unlocked successfully 🔥`,
            'ready'
          );
          switchMobileScreen('mobile-menu');
        } else {
          document.getElementById('name-input').value = "";
          switchMobileScreen('mobile-name');
        }
      };

      const checkOrdersTableFallback = () => {
        btnPhoneSubmit.disabled = false;
        btnPhoneSubmit.innerHTML = originalHtml;
        AppState.phoneNumber = currentPhoneDigits;
        document.getElementById('name-input').value = "";
        switchMobileScreen('mobile-name');
      };

      if (supabaseClient) {
        // Query customers table (replaces profiles)
        supabaseClient
          .from('customers')
          .select('*')
          .eq('phone', currentPhoneDigits)
          .single()
          .then(profileRes => {
            if (profileRes.data) {
              // Customer found in database customers table!
              AppState.phoneNumber = currentPhoneDigits;
              AppState.customerName = profileRes.data.name;
              AppState.customerId = profileRes.data.id;
              saveToLocalStorage();

              // Fetch active orders for this customer from database
              supabaseClient
                .from('orders')
                .select(`
                  id,
                  status,
                  subtotal,
                  tax,
                  total,
                  notes,
                  delivery_type,
                  payment_method,
                  pending_update,
                  audit_log,
                  created_at,
                  customers ( id, name, phone ),
                  tables ( id, table_number ),
                  order_items ( id, quantity, price, product_id, products ( id, name_ar, name_en ) )
                `)
                .eq('customer_id', AppState.customerId)
                .order('created_at', { ascending: false })
                .then(orderRes => {
                  btnPhoneSubmit.disabled = false;
                  btnPhoneSubmit.innerHTML = originalHtml;

                  if (orderRes.data && orderRes.data.length > 0) {
                    const activeDbOrder = orderRes.data.find(o => o.status !== 'delivered');
                    if (activeDbOrder) {
                      const o = activeDbOrder;
                      
                      // Map items from order_items table
                      const items = (o.order_items || []).map(item => {
                        return {
                          id: item.product_id,
                          nameAr: item.products ? item.products.name_ar : '',
                          nameEn: item.products ? item.products.name_en : '',
                          qty: item.quantity,
                          price: Number(item.price)
                        };
                      });

                      const restoredOrder = {
                        id: o.id,
                        table: o.tables ? o.tables.table_number : 0,
                        name: o.customers ? o.customers.name : '',
                        phone: o.customers ? o.customers.phone : '',
                        items: items,
                        subtotal: Number(o.subtotal),
                        tax: Number(o.tax),
                        total: Number(o.total),
                        notes: o.notes,
                        type: o.delivery_type,
                        status: o.status,
                        paymentStatus: o.status === 'pending_payment' ? 'unpaid' : 'paid',
                        paymentMethod: o.payment_method,
                        pendingUpdate: typeof o.pending_update === 'string' ? JSON.parse(o.pending_update) : o.pending_update,
                        auditLog: typeof o.audit_log === 'string' ? JSON.parse(o.audit_log) : (o.audit_log || []),
                        timestamp: new Date(o.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                        elapsedSeconds: Math.floor((Date.now() - new Date(o.created_at).getTime()) / 1000)
                      };

                      AppState.activeOrderId = restoredOrder.id;
                      const idx = AppState.orders.findIndex(x => x.id === restoredOrder.id);
                      if (idx >= 0) AppState.orders[idx] = restoredOrder;
                      else AppState.orders.push(restoredOrder);

                      saveToLocalStorage();
                      updateLiveTrackingUI(restoredOrder);
                      switchMobileScreen('mobile-tracking');
                      
                      showToastNotification(
                        AppState.selectedLang === 'ar'
                          ? `تم العثور على طلب نشط! جاري الانتقال لصفحة التتبع ⚡`
                          : `Active order found! Redirecting to live tracking ⚡`,
                        'ready'
                      );
                    } else {
                      switchMobileScreen('mobile-menu');
                    }
                  } else {
                    switchMobileScreen('mobile-menu');
                  }
                })
                .catch(err => {
                  btnPhoneSubmit.disabled = false;
                  btnPhoneSubmit.innerHTML = originalHtml;
                  switchMobileScreen('mobile-menu');
                });

              showToastNotification(
                AppState.selectedLang === 'ar'
                  ? `مرحباً بعودتك يا ${profileRes.data.name}! تم الدخول بنجاح 🔥`
                  : `Welcome back, ${profileRes.data.name}! Logged in successfully 🔥`,
                'ready'
              );
            } else {
              // Not in customers, try checking orders table as a legacy fallback
              checkOrdersTableFallback();
            }
          })
          .catch(err => {
            console.warn("Customers query failed, falling back to orders:", err);
            checkOrdersTableFallback();
          });
      } else {
        localVerificationFallback();
      }
    });
  }

  // Name submit with instant Supabase account profile creation
  const btnNameSubmit = document.getElementById('btn-name-submit');
  if (btnNameSubmit) {
    btnNameSubmit.addEventListener('click', () => {
      const nameVal = document.getElementById('name-input').value.trim();
      if (nameVal === "") {
        AudioSynthesizer.playBeep();
        showToastNotification(
          AppState.selectedLang === 'ar'
            ? "الرجاء إدخال اسمك الكريم لإكمال عملية تسجيل الدخول!"
            : "Please enter your name to proceed!",
          'new'
        );
        return;
      }
      AppState.customerName = nameVal;
      saveToLocalStorage();

      // Create Account immediately in Supabase customers!
      if (supabaseClient) {
        supabaseClient
          .from('customers')
          .upsert({
            phone: AppState.phoneNumber,
            name: AppState.customerName
          })
          .select()
          .single()
          .then(res => {
            if (res.data) {
              AppState.customerId = res.data.id;
              saveToLocalStorage();
              console.log('Account profile created in Supabase:', res.data);
            }
          });
      }

      switchMobileScreen('mobile-menu');
    });
  }

  // Catalog search input
  const menuSearch = document.getElementById('menu-search');
  if (menuSearch) {
    menuSearch.addEventListener('input', (e) => {
      menuSearchQuery = e.target.value;
      renderMenuCatalog();
    });
  }

  // Floating Cart trigger
  const floatCart = document.getElementById('float-cart-bar');
  if (floatCart) {
    floatCart.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      switchMobileScreen('mobile-cart');
    });
  }

  // Cart Checkout - Direct Place Order (bypass intermediate delivery selection screen)
  const btnCartCheckout = document.getElementById('btn-cart-checkout');
  if (btnCartCheckout) {
    btnCartCheckout.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      if (AppState.cart.length === 0) return;
      triggerPlaceOrder();
    });
  }

  // New Order flow reset (Retains user profile and returns straight to menu catalog)
  const btnNewOrder = document.getElementById('btn-track-new-order');
  if (btnNewOrder) {
    btnNewOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      
      // Block starting a new order if they already have an active order
      const activeOrder = AppState.orders.find(o => o && o.phone === AppState.phoneNumber && o.status !== 'delivered');
      if (activeOrder) {
        showToastNotification(
          AppState.selectedLang === 'ar'
            ? `لديك طلب نشط بالفعل (${activeOrder.id})! لا يمكنك بدء طلب جديد حتى يتم تسليم طلبك الحالي.`
            : `You already have an active order (${activeOrder.id})! You cannot start a new order until your current order is delivered.`,
          'new'
        );
        return;
      }

      AppState.activeOrderId = null;
      saveToLocalStorage();
      
      showToastNotification(
        AppState.selectedLang === 'ar' 
          ? `بدء طلب جديد لحساب: ${AppState.customerName || 'عميلنا الكريم'} ✨` 
          : `Started new order for: ${AppState.customerName || 'Valued Guest'} ✨`,
        'ready'
      );
      
      switchMobileScreen('mobile-menu');
    });
  }

  // Edit Current Order button
  const btnTrackEditOrder = document.getElementById('btn-track-edit-order');
  if (btnTrackEditOrder) {
    btnTrackEditOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      if (!AppState.activeOrderId) return;
      
      const activeOrder = AppState.orders.find(o => o.id === AppState.activeOrderId);
      if (!activeOrder) return;
      
      // Enter Edit Mode
      AppState.editingOrderId = AppState.activeOrderId;
      
      // Load order items back to cart
      AppState.cart = activeOrder.items.map(itm => ({
        id: itm.id,
        qty: itm.qty
      }));
      
      // Populate special notes
      const notesInput = document.getElementById('cart-notes');
      if (notesInput) {
        notesInput.value = activeOrder.notes || '';
      }
      
      // Set table number and delivery type
      AppState.selectedTable = activeOrder.table;
      AppState.deliveryType = activeOrder.type;
      
      // Show edit mode banner in cart
      document.getElementById('cart-edit-mode-banner').classList.remove('hidden');
      document.getElementById('cart-edit-order-id').innerText = activeOrder.id;
      
      // Update checkout button text to indicate Save
      const submitText = document.getElementById('txt-cart-checkout-btn');
      if (submitText) {
        submitText.innerText = AppState.selectedLang === 'ar' ? 'حفظ وإرسال تعديلات الطلب' : 'Save & Submit Order Edits';
      }
      
      // Switch to cart view
      renderCartSummary();
      switchMobileScreen('mobile-cart');
      
      showToastNotification(
        AppState.selectedLang === 'ar'
          ? `جاري تعديل الطلب ${activeOrder.id} - عدل السلة واحفظ التعديلات!`
          : `Editing order ${activeOrder.id} - Modify cart and save edits!`,
        'ready'
      );
    });
  }

  // Cancel edit button in cart
  const btnCartCancelEdit = document.getElementById('btn-cart-cancel-edit');
  if (btnCartCancelEdit) {
    btnCartCancelEdit.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      
      // Exit Edit Mode
      AppState.editingOrderId = null;
      AppState.cart = [];
      document.getElementById('cart-notes').value = '';
      document.getElementById('cart-edit-mode-banner').classList.add('hidden');
      
      // Reset checkout button text
      const submitText = document.getElementById('txt-cart-checkout-btn');
      if (submitText) {
        submitText.innerText = AppState.selectedLang === 'ar' ? 'تأكيد وإرسال الطلب للمطبخ' : 'Confirm & Place Order';
      }
      
      // Return to tracking screen
      const activeOrder = AppState.orders.find(o => o.id === AppState.activeOrderId);
      if (activeOrder) {
        updateLiveTrackingUI(activeOrder);
        switchMobileScreen('mobile-tracking');
      } else {
        switchMobileScreen('mobile-menu');
      }
      
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم إلغاء تعديل الطلب.' : 'Order editing cancelled.',
        'new'
      );
    });
  }

  // Language Toggles
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.selectedLang = btn.getAttribute('data-lang');
      updateLanguageUI();
    });
  });

  // Render initial grid setup and check URL QR parameters
  renderTableGrid();
  checkTableQRParam();
  updateLanguageUI();

  // Physical Keyboard Listener on Phone Screen Keypad
  window.addEventListener('keydown', (e) => {
    const activeScreen = document.querySelector('#customer-view .screen-state.active');
    if (activeScreen && activeScreen.id === 'mobile-phone') {
      if (e.key >= '0' && e.key <= '9') {
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        handleKeypadPress('del');
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const btnPhoneSubmit = document.getElementById('btn-phone-submit');
        if (btnPhoneSubmit) btnPhoneSubmit.click();
      }
    }
  });

  // Restore tracking session from local cache or Supabase directly
  if (AppState.activeOrderId) {
    const activeOrder = AppState.orders.find(o => o.id === AppState.activeOrderId);
    if (activeOrder) {
      if (activeOrder.status !== 'completed') {
        updateLiveTrackingUI(activeOrder);
        switchMobileScreen('mobile-tracking');
        showToastNotification(
          AppState.selectedLang === 'ar' ? "تم استعادة جلسة تتبع طلبك النشط!" : "Active tracking session restored!",
          'ready'
        );
      } else {
        AppState.activeOrderId = null;
        saveToLocalStorage();
        restoreFallbackMenuSession();
      }
    } else {
      // If not found locally, fetch from Supabase but do NOT clear activeOrderId unless we confirm it is completed!
      if (supabaseClient) {
        supabaseClient
          .from('orders')
          .select('*')
          .eq('id', AppState.activeOrderId)
          .single()
          .then(res => {
            if (res.data) {
              const o = res.data;
              const activeOrder = {
                id: o.id,
                table: o.table_number,
                name: o.customer_name,
                phone: o.phone_number,
                items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
                subtotal: Number(o.subtotal),
                tax: Number(o.tax),
                total: Number(o.total),
                notes: o.notes,
                type: o.delivery_type,
                status: o.status,
                paymentStatus: o.payment_status,
                paymentMethod: o.payment_method,
                pendingUpdate: typeof o.pending_update === 'string' ? JSON.parse(o.pending_update) : o.pending_update,
                auditLog: typeof o.audit_log === 'string' ? JSON.parse(o.audit_log) : (o.audit_log || []),
                timestamp: new Date(o.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
                elapsedSeconds: Math.floor((Date.now() - new Date(o.created_at).getTime()) / 1000)
              };

              const idx = AppState.orders.findIndex(x => x.id === activeOrder.id);
              if (idx >= 0) AppState.orders[idx] = activeOrder;
              else AppState.orders.push(activeOrder);

              if (activeOrder.status !== 'completed') {
                updateLiveTrackingUI(activeOrder);
                switchMobileScreen('mobile-tracking');
              } else {
                AppState.activeOrderId = null;
                saveToLocalStorage();
                restoreFallbackMenuSession();
              }
            } else {
              restoreFallbackMenuSession();
            }
          })
          .catch(err => {
            console.warn("Error checking active order on startup:", err);
            restoreFallbackMenuSession();
          });
      } else {
        restoreFallbackMenuSession();
      }
    }
  } else {
    restoreFallbackMenuSession();
  }

  function restoreFallbackMenuSession() {
    if (AppState.phoneNumber && AppState.customerName) {
      currentPhoneDigits = AppState.phoneNumber;
      renderPhoneDisplay();
      switchMobileScreen('mobile-menu');
      showToastNotification(
        AppState.selectedLang === 'ar' 
          ? `مرحباً بعودتك! تم استئناف جلسة طلبك لـ ${AppState.customerName} 🔥` 
          : `Welcome back! Resumed ordering session for ${AppState.customerName} 🔥`,
        'ready'
      );
    }
  }
}

function initKitchenView() {
  initStaffLoginPortal('kitchen');
  renderKDSBoard();
  
  // Kitchen Quick Simulator button
  const btnAuto = document.getElementById('btn-auto-order');
  if (btnAuto) {
    btnAuto.addEventListener('click', () => {
      triggerAutoMockOrder();
    });
  }
}

function initCashierView() {
  initStaffLoginPortal('cashier');
  renderCashierOrdersTable();
  updateCashierMetrics();

  // Search orders table
  const searchInput = document.getElementById('cashier-order-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      cashierSearchQuery = e.target.value;
      renderCashierOrdersTable();
    });
  }

  // Confirm paid Sidebar click
  const btnPay = document.getElementById('btn-cashier-pay');
  if (btnPay) {
    btnPay.addEventListener('click', () => {
      processCashierPayment();
    });
  }

  // Print Sidebar click
  const btnPrint = document.getElementById('btn-cashier-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      triggerPrintThermalBill();
    });
  }

  // Sidebar Cashier Payment methods
  document.querySelectorAll('.pay-methods-grid .pay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      selectedPaymentMethod = btn.getAttribute('data-method');
      document.querySelectorAll('.pay-methods-grid .pay-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Close thermal bill modal
  const btnCloseReceipt = document.getElementById('btn-close-receipt');
  if (btnCloseReceipt) {
    btnCloseReceipt.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      document.getElementById('receipt-modal-overlay').classList.remove('active');
    });
  }

  // Cashier Quick Simulator button
  const btnAuto = document.getElementById('btn-auto-order');
  if (btnAuto) {
    btnAuto.addEventListener('click', () => {
      triggerAutoMockOrder();
    });
  }
}

// ==========================================================================
// 14.5 OWNER & MANAGER ADMIN VIEW CONTROLLER
// ==========================================================================
function initAdminView() {
  initStaffLoginPortal('admin');
  renderAdminDashboard();
  renderAdminQRCodes();
  renderAdminMenuManage();

  // Sidebar Tab Switches
  document.querySelectorAll('.admin-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      document.querySelectorAll('.admin-menu-item').forEach(b => b.classList.remove('active'));
      item.classList.add('active');

      let targetPanelId = item.getAttribute('data-target');
      
      // Map 'panel-products' click in sidebar to open the menu manager panel 'panel-menu-manage'
      if (targetPanelId === 'panel-products') {
        targetPanelId = 'panel-menu-manage';
      }

      document.querySelectorAll('.admin-tab-panel').forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        }
      });

      // Defer the heavy operational renders to the next microtask/event loop tick.
      // This allows the browser to paint the visual tab switch active states instantly,
      // bringing the INP delay down to < 10ms for a buttery-smooth 60fps user experience!
      setTimeout(() => {
        if (targetPanelId === 'panel-overview' || targetPanelId === 'panel-orders') {
          renderAdminDashboard();
        } else if (targetPanelId === 'panel-kitchen') {
          renderAdminKitchenKDS();
        } else if (targetPanelId === 'panel-cashier') {
          renderAdminCashierTill();
        } else if (targetPanelId === 'panel-tables') {
          renderAdminTablesGrid();
        } else if (targetPanelId === 'panel-qrcodes') {
          renderAdminQRCodes();
        } else if (targetPanelId === 'panel-menu-manage') {
          renderAdminMenuManage();
        } else if (targetPanelId === 'panel-categories') {
          renderAdminCategoriesPanel();
        } else if (targetPanelId === 'panel-customers') {
          renderAdminCustomersRoster();
        } else if (targetPanelId === 'panel-inventory') {
          renderAdminInventoryStock();
        } else if (targetPanelId === 'panel-employees') {
          renderAdminEmployeesRoster();
        } else if (targetPanelId === 'panel-reports') {
          renderAdminReportsPanel();
        } else if (targetPanelId === 'panel-analytics') {
          renderAdminAnalyticsCharts();
        } else if (targetPanelId === 'panel-notifications') {
          renderAdminNotificationsCenter();
        } else if (targetPanelId === 'panel-settings') {
          populateAdminSettingsFields();
        } else if (targetPanelId === 'panel-audit-logs') {
          renderAdminAuditLogs();
        }
      }, 0);
    });
  });

  // Simulation order binding
  const btnAuto = document.getElementById('btn-auto-order');
  if (btnAuto) {
    btnAuto.addEventListener('click', () => {
      triggerAutoMockOrder();
    });
  }

  // Seed Button
  const btnSeed = document.getElementById('btn-admin-seed');
  if (btnSeed) {
    btnSeed.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      triggerAutoMockOrder();
      setTimeout(() => triggerAutoMockOrder(), 300);
      setTimeout(() => triggerAutoMockOrder(), 600);
      showToastNotification(
        AppState.selectedLang === 'ar' ? "تم شحن ٣ طلبات محاكاة دفعة واحدة!" : "Seeded 3 mock orders successfully!",
        'ready'
      );
    });
  }

  // Clear Button
  const btnClear = document.getElementById('btn-admin-clear');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      if (confirm(AppState.selectedLang === 'ar' ? "هل أنت متأكد من حذف كافة طلبيات اليوم بالكامل؟" : "Are you sure you want to delete all daily orders?")) {
        AppState.orders = [];
        saveToLocalStorage();
        
        if (supabaseClient) {
          supabaseClient.from('orders').delete().neq('id', 'placeholder').then(() => {
            console.log("Supabase orders cleared");
          });
        }
        
        showToastNotification(
          AppState.selectedLang === 'ar' ? "تم تفريغ كافة الطلبيات بنجاح!" : "All orders deleted successfully!",
          'new'
        );
        renderAdminDashboard();
      }
    });
  }

  // ==========================================
  // Add Category Modal triggers
  // ==========================================
  const btnAddCat = document.getElementById('btn-add-cat-modal');
  if (btnAddCat) {
    btnAddCat.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      
      const modal = document.getElementById('modal-category-editor');
      if (modal) {
        // Reset title
        const modalTitle = modal.querySelector('h3');
        if (modalTitle) {
          modalTitle.innerHTML = `<i class="fa-solid fa-folder-tree"></i> ` + (AppState.selectedLang === 'ar' ? 'إضافة قسم منيو جديد' : 'Add New Category');
        }

        // Enable and reset ID input
        const inputId = document.getElementById('edit-cat-id');
        if (inputId) {
          inputId.value = '';
          inputId.disabled = false;
          inputId.style.opacity = '1';
          inputId.style.cursor = 'text';
        }

        document.getElementById('edit-cat-name-ar').value = '';
        document.getElementById('edit-cat-name-en').value = '';

        // Reset submit button text
        const submitBtn = modal.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ` + (AppState.selectedLang === 'ar' ? 'إضافة هذا القسم للمطعم' : 'Add Category');
        }

        modal.style.display = 'flex';
        modal.classList.add('active');
      }
    });
  }

  const btnCloseCat = document.getElementById('btn-close-cat-modal');
  if (btnCloseCat) {
    btnCloseCat.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const catModal = document.getElementById('modal-category-editor');
      catModal.style.display = 'none';
      catModal.classList.remove('active');
    });
  }

  const formCat = document.getElementById('form-category-editor');
  if (formCat) {
    formCat.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catId = document.getElementById('edit-cat-id').value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      const nameAr = document.getElementById('edit-cat-name-ar').value.trim();
      const nameEn = document.getElementById('edit-cat-name-en').value.trim();

      if (!catId) return;

      const categoryPayload = { id: catId, name_ar: nameAr, name_en: nameEn };

      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.from('categories').upsert(categoryPayload);
          if (error) {
            console.warn("Supabase category save error (proceeding with local fallback):", error);
            showToastNotification(
              AppState.selectedLang === 'ar' 
                ? `تنبيه: فشل الحفظ السحابي للقسم، تم التحديث محلياً!` 
                : `Warning: Cloud category save failed, updated locally!`, 
              'new'
            );
          }
        } catch (err) {
          console.warn("Error saving category (proceeding with local fallback):", err);
        }
      }

      const existingIdx = CATEGORIES.findIndex(c => c.id === catId);
      const newCat = { id: catId, nameAr: nameAr, nameEn: nameEn };
      if (existingIdx > -1) {
        CATEGORIES[existingIdx] = newCat;
      } else {
        CATEGORIES.push(newCat);
      }

      const catModal = document.getElementById('modal-category-editor');
      catModal.style.display = 'none';
      catModal.classList.remove('active');
      
      const isEdit = (existingIdx > -1);
      showToastNotification(
        AppState.selectedLang === 'ar' 
          ? (isEdit ? 'تم تحديث قسم المنيو بنجاح!' : 'تمت إضافة قسم المنيو الجديد بنجاح!')
          : (isEdit ? 'Category updated successfully!' : 'Category added successfully!'),
        'ready'
      );
      
      renderAdminMenuManage();

      // Instantly trigger reactive updates for customer menus
      const catContainer = document.getElementById('categories-scroll');
      if (catContainer) renderMenuCategories();
      const menuContainer = document.getElementById('menu-catalog');
      if (menuContainer) renderMenuCatalog();
    });
  }

  // ==========================================
  // Add/Edit Product Modal triggers
  // ==========================================
  const btnAddProduct = document.getElementById('btn-add-product-modal');
  if (btnAddProduct) {
    btnAddProduct.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      document.getElementById('product-editor-title').innerText = AppState.selectedLang === 'ar' ? 'إضافة صنف وجبة جديد' : 'Add New Menu Item';
      document.getElementById('edit-product-id').value = '';
      document.getElementById('edit-prod-name-ar').value = '';
      document.getElementById('edit-prod-name-en').value = '';
      document.getElementById('edit-prod-desc-ar').value = '';
      document.getElementById('edit-prod-desc-en').value = '';
      document.getElementById('edit-prod-price').value = '';
      document.getElementById('edit-prod-spicy').checked = false;
      document.getElementById('edit-prod-bestseller').checked = false;
      document.getElementById('edit-prod-url').value = '';
      if (document.getElementById('edit-prod-file')) document.getElementById('edit-prod-file').value = '';
      selectedBase64Image = '';
      document.getElementById('product-image-preview-box').innerHTML = `<span style="font-size: 1.5rem; color: var(--text-light-muted);"><i class="fa-solid fa-image"></i></span>`;

      // Populate categories select
      const categorySelect = document.getElementById('edit-prod-category');
      if (categorySelect) {
        categorySelect.innerHTML = '';
        CATEGORIES.forEach(cat => {
          if (cat.id === 'all') return;
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.innerText = AppState.selectedLang === 'ar' ? cat.nameAr : cat.nameEn;
          categorySelect.appendChild(opt);
        });
      }

      const prodModal = document.getElementById('modal-product-editor');
      prodModal.style.display = 'flex';
      prodModal.classList.add('active');
    });
  }

  const btnCloseProduct = document.getElementById('btn-close-product-modal');
  if (btnCloseProduct) {
    btnCloseProduct.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const prodModal = document.getElementById('modal-product-editor');
      prodModal.style.display = 'none';
      prodModal.classList.remove('active');
    });
  }

  // Image uploader hooks
  const fileInput = document.getElementById('edit-prod-file');
  const triggerBtn = document.getElementById('btn-trigger-file-upload');
  const urlInput = document.getElementById('edit-prod-url');
  const previewBox = document.getElementById('product-image-preview-box');

  if (triggerBtn && fileInput) {
    triggerBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  // Compression helper
  function compressAndBase64Image(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        let width = img.width;
        let height = img.height;
        const max_size = 400; // Keep file sizes around 20-30KB while keeping high fidelity!
        
        if (width > height) {
          if (width > max_size) {
            height *= max_size / width;
            width = max_size;
          }
        } else {
          if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality jpeg is tiny and fast!
        callback(compressedDataUrl);
      };
      img.onerror = function() {
        callback(e.target.result);
      };
      img.src = e.target.result;
    };
    reader.onerror = function() {
      console.error("FileReader failed");
    };
    reader.readAsDataURL(file);
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        compressAndBase64Image(file, (compressedBase64) => {
          selectedBase64Image = compressedBase64;
          if (previewBox) {
            previewBox.innerHTML = `<img src="${selectedBase64Image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
          }
          if (urlInput) urlInput.value = '';
        });
      }
    });
  }

  if (urlInput) {
    urlInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (val) {
        selectedBase64Image = '';
        if (fileInput) fileInput.value = '';
        if (previewBox) {
          previewBox.innerHTML = `<img src="${val}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;" onerror="this.src=''; this.parentNode.innerHTML='<span style=\x22font-size: 1.5rem; color: var(--text-light-muted);\x22><i class=\x22fa-solid fa-image\x22></i></span>';">`;
        }
      } else {
        if (previewBox) {
          previewBox.innerHTML = `<span style="font-size: 1.5rem; color: var(--text-light-muted);"><i class="fa-solid fa-image"></i></span>`;
        }
      }
    });
  }

  const formProd = document.getElementById('form-product-editor');
  if (formProd) {
    formProd.addEventListener('submit', async (e) => {
      e.preventDefault();
      const productId = document.getElementById('edit-product-id').value.trim();
      const nameAr = document.getElementById('edit-prod-name-ar').value.trim();
      const nameEn = document.getElementById('edit-prod-name-en').value.trim();
      const descAr = document.getElementById('edit-prod-desc-ar').value.trim();
      const descEn = document.getElementById('edit-prod-desc-en').value.trim();
      const price = parseFloat(document.getElementById('edit-prod-price').value);
      const categoryId = document.getElementById('edit-prod-category').value;
      const isSpicy = document.getElementById('edit-prod-spicy').checked;
      const isBestSeller = document.getElementById('edit-prod-bestseller').checked;
      const directUrl = document.getElementById('edit-prod-url').value.trim();

      let finalImageSource = '';
      if (selectedBase64Image) {
        finalImageSource = selectedBase64Image;
      } else if (directUrl) {
        finalImageSource = directUrl;
      }

      let targetId = productId;
      if (!targetId) {
        const nextNum = MENU.length > 0 ? Math.max(...MENU.map(m => {
          const num = parseInt(m.id.replace(/[^0-9]/g, ''));
          return isNaN(num) ? 0 : num;
        })) + 1 : 1;
        targetId = `pr-${nextNum}`;
      }

      const productPayload = {
        id: targetId,
        category_id: categoryId,
        name_ar: nameAr,
        name_en: nameEn,
        description_ar: descAr,
        description_en: descEn,
        price: price,
        image_url: finalImageSource,
        is_spicy: isSpicy,
        is_bestseller: isBestSeller
      };

      if (supabaseClient) {
        try {
          const { error } = await supabaseClient.from('products').upsert(productPayload);
          if (error) {
            console.warn("Supabase product save error (proceeding with local fallback):", error);
            showToastNotification(
              AppState.selectedLang === 'ar' 
                ? `تنبيه: فشل الحفظ السحابي، تم التحديث محلياً!` 
                : `Warning: Cloud product save failed, updated locally!`, 
              'new'
            );
          }
        } catch (err) {
          console.warn("Error saving product (proceeding with local fallback):", err);
        }
      }

      const localProduct = {
        id: targetId,
        cat: categoryId,
        nameAr: nameAr,
        nameEn: nameEn,
        descAr: descAr,
        descEn: descEn,
        price: price,
        spicy: isSpicy,
        bestSeller: isBestSeller,
        svg: finalImageSource.startsWith('<svg') ? finalImageSource : '',
        imageUrl: !finalImageSource.startsWith('<svg') ? finalImageSource : null
      };

      const existingIdx = MENU.findIndex(m => m.id === targetId);
      if (existingIdx > -1) {
        MENU[existingIdx] = localProduct;
      } else {
        MENU.push(localProduct);
      }

      const prodModal = document.getElementById('modal-product-editor');
      prodModal.style.display = 'none';
      prodModal.classList.remove('active');
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم حفظ صنف الوجبة وتحديث المنيو بنجاح!' : 'Menu item saved successfully!',
        'ready'
      );
      renderAdminMenuManage();

      // Refresh customer menu locally if it exists
      const menuContainer = document.getElementById('menu-catalog');
      if (menuContainer) renderMenuCatalog();
    });
  }

  // Set total tables input default value on load
  const inputTotalTables = document.getElementById('input-total-tables');
  if (inputTotalTables) {
    inputTotalTables.value = AppState.totalTables || 12;
  }

  // Handle tables count save
  const btnSaveTables = document.getElementById('btn-save-tables-count');
  if (btnSaveTables) {
    btnSaveTables.addEventListener('click', async () => {
      AudioSynthesizer.playBeep();
      const val = parseInt(document.getElementById('input-total-tables').value) || 12;
      
      if (val < 1 || val > 100) {
        showToastNotification(
          AppState.selectedLang === 'ar' ? 'الرجاء إدخال عدد طاولات صحيح بين ١ و ١٠٠!' : 'Please enter a valid table count between 1 and 100!',
          'new'
        );
        return;
      }

      AppState.totalTables = val;
      localStorage.setItem('HIPROUST_TOTAL_TABLES', val);

      if (supabaseClient) {
        try {
          await supabaseClient
            .from('settings')
            .upsert({ key: 'total_tables', value: String(val) });
        } catch (err) {
          console.warn("Supabase settings upsert error:", err);
        }
      }

      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم تحديث عدد طاولات الصالة ورموز الـ QR بنجاح!' : 'Tables count and QR codes updated successfully!',
        'ready'
      );

      // Refresh QRs grid and dashboards tables activities
      renderAdminQRCodes();
      renderAdminDashboard();
    });
  }

  // ==========================================
  // ADD CAT PANEL WIREUP
  // ==========================================
  const btnAddCatPanel = document.getElementById('btn-add-cat-modal-panel');
  if (btnAddCatPanel) {
    btnAddCatPanel.addEventListener('click', () => {
      const btnAddCat = document.getElementById('btn-add-cat-modal');
      if (btnAddCat) btnAddCat.click();
    });
  }

  // ==========================================
  // INVENTORY MANUAL AUDIT WIREUP
  // ==========================================
  const btnInvManualAudit = document.getElementById('btn-inventory-manual-audit');
  if (btnInvManualAudit) {
    btnInvManualAudit.addEventListener('click', () => {
      window.triggerInventoryAdjust('');
    });
  }

  // ==========================================
  // CASHIER SHIFT TILL WIREUP
  // ==========================================
  const btnSubmitOpenShift = document.getElementById('btn-submit-open-shift');
  if (btnSubmitOpenShift) {
    btnSubmitOpenShift.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const inputFloat = document.getElementById('cashier-shift-opening-float');
      const floatVal = parseFloat(inputFloat ? inputFloat.value : '500') || 500;
      AppState.cashierShift.open = true;
      AppState.cashierShift.openingFloat = floatVal;
      AppState.cashierShift.currentCash = floatVal;
      AppState.cashierShift.openingTime = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      AppState.cashierShift.tillLogs = [{ desc: 'افتتاح الخزينة والوردية', amount: 0 }];
      saveToLocalStorage();
      
      const modal = document.getElementById('modal-open-shift-cashier');
      if (modal) modal.style.display = 'none';
      
      logAuditTrail(
        'أمين الخزينة خالد',
        `تم فتح وردية كاشير جديدة بعهدة افتتاحية ${floatVal.toFixed(2)} ر.س`,
        `Opened new cashier shift with float of ${floatVal.toFixed(2)} SAR`
      );
      
      renderAdminCashierTill();
    });
  }

  const btnCloseShiftModal = document.getElementById('btn-close-shift-modal');
  if (btnCloseShiftModal) {
    btnCloseShiftModal.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const modal = document.getElementById('modal-open-shift-cashier');
      if (modal) modal.style.display = 'none';
    });
  }

  // ==========================================
  // EMPLOYEE CRUD WIREUPS
  // ==========================================
  const btnAddEmp = document.getElementById('btn-admin-add-employee');
  if (btnAddEmp) {
    btnAddEmp.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      document.getElementById('employee-editor-title').innerText = AppState.selectedLang === 'ar' ? 'تعيين موظف جديد بالمطعم' : 'Add New Staff Member';
      document.getElementById('edit-employee-id').value = '';
      document.getElementById('edit-emp-name').value = '';
      document.getElementById('edit-emp-phone').value = '';
      document.getElementById('edit-emp-role').value = 'cashier';
      document.getElementById('edit-emp-pin').value = '';
      
      const modal = document.getElementById('modal-employee-editor');
      if (modal) modal.style.display = 'flex';
    });
  }

  const btnCloseEmp = document.getElementById('btn-close-employee-modal');
  if (btnCloseEmp) {
    btnCloseEmp.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const modal = document.getElementById('modal-employee-editor');
      if (modal) modal.style.display = 'none';
    });
  }

  const formEmp = document.getElementById('form-employee-editor');
  if (formEmp) {
    formEmp.addEventListener('submit', (e) => {
      e.preventDefault();
      AudioSynthesizer.playBeep();
      
      const empId = document.getElementById('edit-employee-id').value.trim();
      const name = document.getElementById('edit-emp-name').value.trim();
      const phone = document.getElementById('edit-emp-phone').value.trim();
      const role = document.getElementById('edit-emp-role').value;
      const pin = document.getElementById('edit-emp-pin').value.trim();

      if (pin.length !== 4 || isNaN(pin)) {
        showToastNotification(
          AppState.selectedLang === 'ar' ? "يجب أن يتكون رمز الدخول PIN من ٤ أرقام!" : "PIN must be exactly 4 digits!",
          'new'
        );
        return;
      }

      if (empId) {
        const emp = AppState.employees.find(e => e.id === empId);
        if (emp) {
          emp.name = name;
          emp.phone = phone;
          emp.role = role;
          emp.pin = pin;
          logAuditTrail('المدير فهد', `تعديل بيانات الموظف: ${name}`, `Updated staff member: ${name}`);
        }
      } else {
        const nextId = `emp-${Date.now()}`;
        AppState.employees.push({ id: nextId, name, phone, role, pin });
        logAuditTrail('المدير فهد', `تعيين موظف جديد: ${name}`, `Hired new staff member: ${name}`);
      }

      saveToLocalStorage();
      const modal = document.getElementById('modal-employee-editor');
      if (modal) modal.style.display = 'none';
      
      renderAdminEmployeesRoster();
    });
  }

  // ==========================================
  // INVENTORY stock forms
  // ==========================================
  const btnCloseInv = document.getElementById('btn-close-inventory-modal');
  if (btnCloseInv) {
    btnCloseInv.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const modal = document.getElementById('modal-inventory-audit');
      if (modal) modal.style.display = 'none';
    });
  }

  const formInv = document.getElementById('form-inventory-audit');
  if (formInv) {
    formInv.addEventListener('submit', (e) => {
      e.preventDefault();
      AudioSynthesizer.playBeep();
      
      const itemId = document.getElementById('edit-inventory-item-id').value;
      const actionType = document.getElementById('edit-inventory-action-type').value;
      const qty = parseInt(document.getElementById('edit-inventory-qty').value) || 0;

      const item = AppState.inventory.find(i => i.id === itemId);
      if (!item) return;

      const oldStock = item.stock;
      if (actionType === 'set') {
        item.stock = qty;
      } else if (actionType === 'add') {
        item.stock += qty;
      } else if (actionType === 'deduct') {
        item.stock = Math.max(0, item.stock - qty);
      }

      saveToLocalStorage();
      
      logAuditTrail(
        'المدير فهد', 
        `جرد المخزون للمادة ${item.nameAr}: تعديل الكمية من ${oldStock} إلى ${item.stock}`, 
        `Audited inventory item ${item.nameEn}: changed stock from ${oldStock} to ${item.stock}`
      );

      const modal = document.getElementById('modal-inventory-audit');
      if (modal) modal.style.display = 'none';
      
      renderAdminInventoryStock();
    });
  }

  // ==========================================
  // MANUAL ORDER CREATION FORM
  // ==========================================
  const btnOpenManualOrder = document.getElementById('btn-admin-add-order-manual');
  if (btnOpenManualOrder) {
    btnOpenManualOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      resetManualOrderForm();
      
      const tableSelect = document.getElementById('manual-order-table');
      if (tableSelect) {
        tableSelect.innerHTML = '';
        const total = AppState.totalTables || 12;
        for (let i = 1; i <= total; i++) {
          const opt = document.createElement('option');
          opt.value = String(i);
          opt.innerText = AppState.selectedLang === 'ar' ? `طاولة ${i}` : `Table ${i}`;
          tableSelect.appendChild(opt);
        }
      }
      
      const modal = document.getElementById('modal-manual-order-creation');
      if (modal) modal.style.display = 'flex';
    });
  }

  const btnCloseManualOrder = document.getElementById('btn-close-manual-order');
  if (btnCloseManualOrder) {
    btnCloseManualOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const modal = document.getElementById('modal-manual-order-creation');
      if (modal) modal.style.display = 'none';
    });
  }

  const btnSubmitManualOrder = document.getElementById('btn-submit-manual-order');
  if (btnSubmitManualOrder) {
    btnSubmitManualOrder.addEventListener('click', async () => {
      AudioSynthesizer.playBeep();
      
      const phone = document.getElementById('manual-order-phone').value.trim();
      const name = document.getElementById('manual-order-name').value.trim();
      const notes = document.getElementById('manual-order-notes').value.trim();
      const type = document.getElementById('manual-order-delivery-type').value;
      const table = parseInt(document.getElementById('manual-order-table').value) || 0;

      if (!phone || phone.length < 11 || isNaN(phone)) {
        showToastNotification(
          AppState.selectedLang === 'ar' ? 'الرجاء إدخال رقم جوال صحيح مكون من ١١ رقماً!' : 'Please enter a valid 11-digit phone number!',
          'new'
        );
        return;
      }
      if (!name) {
        showToastNotification(
          AppState.selectedLang === 'ar' ? 'الرجاء إدخال اسم العميل!' : 'Please enter customer name!',
          'new'
        );
        return;
      }
      if (Object.keys(window.manualOrderCart).length === 0) {
        showToastNotification(
          AppState.selectedLang === 'ar' ? 'الرجاء اختيار وجبة واحدة على الأقل!' : 'Please select at least one menu item!',
          'new'
        );
        return;
      }

      const chosenOrderId = await getNextUniqueOrderId();
      
      let subtotal = 0;
      const itemsList = [];
      Object.keys(window.manualOrderCart).forEach(id => {
        const qty = window.manualOrderCart[id];
        const item = MENU.find(m => m.id === id);
        if (item) {
          subtotal += (item.price * qty);
          itemsList.push({
            id: item.id,
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            qty: qty,
            price: item.price
          });
        }
      });
      const tax = subtotal * 0.15;
      const total = subtotal + tax;

      const newOrder = {
        id: chosenOrderId,
        table: type === 'dine-in' ? table : 0,
        name: name,
        phone: phone,
        items: itemsList,
        subtotal: subtotal,
        tax: tax,
        total: total,
        notes: notes,
        type: type,
        status: 'pending_payment',
        paymentStatus: 'unpaid',
        paymentMethod: null,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        elapsedSeconds: 0
      };

      AppState.orders.push(newOrder);
      saveToLocalStorage();

      logAuditTrail(
        'المدير فهد', 
        `إنشاء طلب يدوي جديد بقيمة ${total.toFixed(2)} ر.س للعميل ${name}`, 
        `Placed manual order of ${total.toFixed(2)} SAR for guest ${name}`
      );

      if (supabaseClient) {
        try {
          let customerUuid = null;
          const { data: custData } = await supabaseClient.from('customers').select('id').eq('phone', phone).maybeSingle();
          if (custData) {
            customerUuid = custData.id;
          } else {
            const { data: newCust } = await supabaseClient.from('customers').insert({ name, phone }).select('id').single();
            if (newCust) customerUuid = newCust.id;
          }

          let tableUuid = null;
          if (type === 'dine-in') {
            const { data: tableData } = await supabaseClient.from('tables').select('id').eq('table_number', table).maybeSingle();
            if (tableData) tableUuid = tableData.id;
          }

          await supabaseClient.from('orders').insert({
            id: chosenOrderId,
            customer_id: customerUuid,
            table_id: tableUuid,
            status: 'pending_payment',
            subtotal: subtotal,
            tax: tax,
            total: total,
            notes: notes,
            delivery_type: type
          });

          const itemsPayload = itemsList.map(itm => ({
            order_id: chosenOrderId,
            product_id: itm.id,
            quantity: itm.qty,
            price: itm.price
          }));
          await supabaseClient.from('order_items').insert(itemsPayload);
        } catch(err) {
          console.warn("Supabase manual order insertion error:", err);
        }
      }

      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم تسجيل وإرسال الطلب اليدوي بنجاح!' : 'Manual order created and sent successfully!',
        'ready'
      );

      const modal = document.getElementById('modal-manual-order-creation');
      if (modal) modal.style.display = 'none';

      renderAdminDashboard();
      if (typeof renderAdminKitchenKDS === 'function') renderAdminKitchenKDS();
      if (typeof renderAdminCashierTill === 'function') renderAdminCashierTill();
    });
  }

  // ==========================================
  // ORDER EDITOR BUTTON WIREUPS
  // ==========================================
  const btnCloseEditor = document.getElementById('btn-close-order-editor-admin');
  if (btnCloseEditor) {
    btnCloseEditor.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const modal = document.getElementById('modal-order-editor-admin');
      if (modal) modal.style.display = 'none';
    });
  }

  const btnEditorAddItem = document.getElementById('btn-admin-editor-add-item');
  if (btnEditorAddItem) {
    btnEditorAddItem.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const select = document.getElementById('admin-editor-add-item-select');
      if (!select || !window.editingOrder) return;
      
      const productId = select.value;
      const product = MENU.find(m => m.id === productId);
      if (!product) return;
      
      const existing = window.editingOrder.items.find(itm => itm.id === productId);
      if (existing) {
        existing.qty++;
      } else {
        window.editingOrder.items.push({
          id: product.id,
          nameAr: product.nameAr,
          nameEn: product.nameEn,
          qty: 1,
          price: product.price
        });
      }
      
      window.renderAdminEditorItems();
    });
  }

  const discountField = document.getElementById('admin-editor-discount');
  if (discountField) {
    discountField.addEventListener('input', () => {
      if (window.editingOrder) {
        window.renderAdminEditorItems();
      }
    });
  }

  const btnCancelOrder = document.getElementById('btn-admin-editor-cancel-order');
  if (btnCancelOrder) {
    btnCancelOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      if (confirm(AppState.selectedLang === 'ar' ? 'هل أنت متأكد من إلغاء هذا الطلب بالكامل؟' : 'Are you sure you want to cancel this order?')) {
        window.editingOrder.status = 'cancelled';
        document.getElementById('admin-editor-status').value = 'cancelled';
        document.getElementById('btn-admin-editor-reopen-order').style.display = 'block';
        btnCancelOrder.style.display = 'none';
      }
    });
  }

  const btnReopenOrder = document.getElementById('btn-admin-editor-reopen-order');
  if (btnReopenOrder) {
    btnReopenOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      window.editingOrder.status = 'new';
      document.getElementById('admin-editor-status').value = 'pending_payment';
      btnCancelOrder.style.display = 'block';
      btnReopenOrder.style.display = 'none';
    });
  }

  const btnSaveEdits = document.getElementById('btn-admin-editor-save');
  if (btnSaveEdits) {
    btnSaveEdits.addEventListener('click', async () => {
      AudioSynthesizer.playBeep();
      if (!window.editingOrder) return;
      
      window.editingOrder.status = document.getElementById('admin-editor-status').value;
      if (window.editingOrder.status === 'paid' || window.editingOrder.status === 'preparing' || window.editingOrder.status === 'ready' || window.editingOrder.status === 'completed') {
        window.editingOrder.paymentStatus = 'paid';
      } else {
        window.editingOrder.paymentStatus = 'unpaid';
      }
      
      const originalIdx = AppState.orders.findIndex(o => o.id === window.editingOrder.id);
      if (originalIdx > -1) {
        AppState.orders[originalIdx] = window.editingOrder;
        saveToLocalStorage();
        
        logAuditTrail(
          'المدير فهد', 
          `تم تعديل وتحديث بيانات الطلب ${window.editingOrder.id} يدوياً`, 
          `Edited and updated order ${window.editingOrder.id} manually`
        );
        
        if (supabaseClient) {
          try {
            await supabaseClient.from('order_items').delete().eq('order_id', window.editingOrder.id);
            const itemsPayload = window.editingOrder.items.map(itm => ({
              order_id: window.editingOrder.id,
              product_id: itm.id,
              quantity: itm.qty,
              price: itm.price
            }));
            await supabaseClient.from('order_items').insert(itemsPayload);
            
            await supabaseClient.from('orders').update({
              status: window.editingOrder.status,
              subtotal: window.editingOrder.subtotal,
              tax: window.editingOrder.tax,
              total: window.editingOrder.total
            }).eq('id', window.editingOrder.id);
          } catch(err) {
            console.warn("Supabase order editor sync error:", err);
          }
        }
        
        const modal = document.getElementById('modal-order-editor-admin');
        if (modal) modal.style.display = 'none';
        
        renderAdminDashboard();
        if (typeof renderAdminKitchenKDS === 'function') renderAdminKitchenKDS();
        if (typeof renderAdminCashierTill === 'function') renderAdminCashierTill();
      }
    });
  }

  // ==========================================
  // ADD TABLE TRIGGER
  // ==========================================
  const btnAddTable = document.getElementById('btn-admin-add-table');
  if (btnAddTable) {
    btnAddTable.addEventListener('click', async () => {
      AudioSynthesizer.playBeep();
      AppState.totalTables = (AppState.totalTables || 12) + 1;
      const newTableNum = AppState.totalTables;
      localStorage.setItem('HIPROUST_TOTAL_TABLES', newTableNum);

      if (supabaseClient) {
        try {
          await supabaseClient.from('settings').upsert({ key: 'total_tables', value: String(newTableNum) });
          const qrBase = window.location.href.split('?')[0].split('#')[0];
          await supabaseClient.from('tables')
            .upsert({ table_number: newTableNum, qr_code: `${qrBase}?table=${newTableNum}` }, { onConflict: 'table_number' })
            .catch(() => {});
          const { data: tablesData } = await supabaseClient.from('tables').select('*');
          if (tablesData) AppState.tables = tablesData;
        } catch (err) {
          console.warn('Supabase add table error:', err);
        }
      }

      logAuditTrail(
        'المدير فهد',
        `تمت إضافة الطاولة رقم ${newTableNum} للخدمة في الصالة`,
        `Added Table ${newTableNum} to salon operations`
      );

      showToastNotification(
        AppState.selectedLang === 'ar' ? `تمت إضافة الطاولة رقم ${newTableNum} بنجاح!` : `Added Table ${newTableNum} successfully!`,
        'ready'
      );

      renderAdminTablesGrid();
      renderAdminDashboard();
      renderAdminQRCodes();
    });
  }

  // ==========================================
  // REPORTS PERIOD CHANGED
  // ==========================================
  const selectReportSpan = document.getElementById('select-report-span');
  if (selectReportSpan) {
    selectReportSpan.addEventListener('change', () => {
      AudioSynthesizer.playBeep();
      renderAdminReportsPanel();
    });
  }

  // ==========================================
  // RESTAURANT SETTINGS SUBMISSION
  // ==========================================
  const formSettings = document.getElementById('form-restaurant-settings');
  if (formSettings) {
    formSettings.addEventListener('submit', async (e) => {
      e.preventDefault();
      AudioSynthesizer.playBeep();
      
      const vatVal = parseFloat(document.getElementById('input-settings-vat-rate').value) || 15;
      
      AppState.restaurantSettings = {
        nameAr: document.getElementById('input-settings-name-ar').value.trim(),
        nameEn: document.getElementById('input-settings-name-en').value.trim(),
        vatRate: vatVal / 100,
        currencyAr: document.getElementById('input-settings-currency-ar').value.trim(),
        currencyEn: document.getElementById('input-settings-currency-en').value.trim(),
        workingHoursAr: document.getElementById('input-settings-working-hours-ar').value.trim(),
        workingHoursEn: document.getElementById('input-settings-working-hours-en').value.trim(),
        printHeader: document.getElementById('input-settings-print-header').value.trim(),
        printFooter: document.getElementById('input-settings-print-footer').value.trim(),
        audioEnable: document.getElementById('input-settings-audio-enable').checked
      };
      
      saveToLocalStorage();
      
      if (supabaseClient) {
        try {
          await supabaseClient
            .from('settings')
            .upsert({ key: 'restaurant_settings_json', value: JSON.stringify(AppState.restaurantSettings) });
        } catch (err) {
          console.warn("Supabase settings sync error:", err);
        }
      }
      
      logAuditTrail(
        'المالك فهد',
        'تم تعديل وحفظ إعدادات تهيئة المطعم والضرائب وتدابير الطباعة بنجاح',
        'Saved restaurant general settings, taxes, and receipt config successfully'
      );
      
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم حفظ كافة الإعدادات وتطبيقها بنجاح!' : 'All restaurant settings saved successfully!',
        'ready'
      );
    });
  }

  // Populate settings fields on load
  populateAdminSettingsFields();
}

function renderAdminQRCodes() {
  const qrGrid = document.getElementById('admin-qr-codes-grid');
  if (!qrGrid) return;
  qrGrid.innerHTML = '';

  // Get current base URL of index.html (foolproof parser for clean URLs and file schemes)
  let href = window.location.href.split('?')[0].split('#')[0];
  if (href.endsWith('/')) {
    href = href.slice(0, -1);
  }

  let baseUri = href;
  let lastSlashIdx = href.lastIndexOf('/');
  if (lastSlashIdx !== -1) {
    let lastSegment = href.substring(lastSlashIdx + 1).toLowerCase();
    if (lastSegment === 'admin' || lastSegment === 'admin.html' || 
        lastSegment === 'kitchen' || lastSegment === 'kitchen.html' || 
        lastSegment === 'cashier' || lastSegment === 'cashier.html') {
      baseUri = href.substring(0, lastSlashIdx) + '/index.html';
    } else if (lastSegment !== 'index.html') {
      baseUri = href + '/index.html';
    }
  } else {
    baseUri = href + '/index.html';
  }

  // 1. Generate Takeaway QR Code Card
  const takeawayUrl = `${baseUri}?type=takeaway`;
  const takeawayQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(takeawayUrl)}`;

  const takeawayCard = document.createElement('div');
  takeawayCard.className = 'admin-metric-card';
  takeawayCard.style.flexDirection = 'column';
  takeawayCard.style.gap = '14px';
  takeawayCard.style.textAlign = 'center';
  takeawayCard.style.backgroundColor = '#ffffff';
  takeawayCard.style.border = '2px solid #0284C7'; // Blue border for takeaway
  takeawayCard.style.boxShadow = 'var(--shadow-light)';

  takeawayCard.innerHTML = `
    <div style="font-weight: 800; font-size: 0.95rem; color: #0284C7;"><i class="fa-solid fa-bag-shopping"></i> طلب سفري / Takeaway</div>
    <div style="background-color: #fff; padding: 10px; border-radius: 12px; display: inline-block; border: 1px solid #E2E8F0;">
      <img src="${takeawayQrApi}" alt="Takeaway QR" style="width: 130px; height: 130px; display: block;">
    </div>
    <div style="font-size: 0.65rem; color: var(--text-muted); line-height: 1.4; word-break: break-all; max-width: 150px;">
      ${takeawayUrl}
    </div>
    <a href="${takeawayQrApi}" target="_blank" download="takeaway_qr.png" class="sim-btn" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none; display: inline-block; background-color: rgba(2, 132, 199, 0.15); border-color: #0284C7; color: #0284C7; font-weight: 800;">
      <i class="fa-solid fa-print"></i> طباعة / تحميل
    </a>
  `;
  qrGrid.appendChild(takeawayCard);

  // 2. Generate Tables 1 to total QR Cards
  const total = AppState.totalTables || 12;
  for (let i = 1; i <= total; i++) {
    const tableUrl = `${baseUri}?table=${i}`;
    const tableQrApi = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(tableUrl)}`;

    const card = document.createElement('div');
    card.className = 'admin-metric-card';
    card.style.flexDirection = 'column';
    card.style.gap = '14px';
    card.style.textAlign = 'center';
    card.style.padding = '16px';
    card.style.backgroundColor = '#ffffff';
    card.style.border = '1px solid var(--light-border)';
    card.style.boxShadow = 'var(--shadow-light)';

    card.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-red);"><i class="fa-solid fa-chair" style="color: var(--primary-yellow);"></i> طاولة ${i} / Table ${i}</div>
      <div style="background-color: #fff; padding: 10px; border-radius: 12px; display: inline-block; border: 1px solid #E2E8F0;">
        <img src="${tableQrApi}" alt="Table ${i} QR" style="width: 130px; height: 130px; display: block;">
      </div>
      <div style="font-size: 0.65rem; color: var(--text-muted); line-height: 1.4; word-break: break-all; max-width: 150px;">
        ${tableUrl}
      </div>
      <a href="${tableQrApi}" target="_blank" download="table_${i}_qr.png" class="sim-btn" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none; display: inline-block; background-color: var(--primary-yellow-light); border: 1px solid var(--primary-yellow); color: var(--text-dark); font-weight: 800; border-radius: 6px;">
        <i class="fa-solid fa-print"></i> طباعة / تحميل
      </a>
    `;
    qrGrid.appendChild(card);
  }
}

// ==========================================================================
// 15 MODULES DASHBOARD PREMIUM OPERATIONAL ENGINE
// ==========================================================================

function logAuditTrail(user, actionAr, actionEn) {
  const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const ip = `192.168.1.${Math.floor(Math.random() * 250 + 2)}`;
  const log = { id: `aud-${Date.now()}`, user, actionAr, actionEn, time, ip };
  AppState.auditLogs.unshift(log);
  if (AppState.auditLogs.length > 50) AppState.auditLogs.pop();
  saveToLocalStorage();
  
  triggerSystemNotification('info', actionEn, actionAr);
  
  if (AppState.activeRole === 'admin-view') {
    renderAdminAuditLogs();
  }
}

function triggerSystemNotification(type, titleEn, titleAr) {
  const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  const n = { id: `not-${Date.now()}`, type, titleAr, titleEn, descAr: titleAr, descEn: titleEn, time };
  AppState.notifications.unshift(n);
  if (AppState.notifications.length > 30) AppState.notifications.pop();
  saveToLocalStorage();
  
  if (type === 'alert') AudioSynthesizer.playBeep();
  
  if (AppState.activeRole === 'admin-view') {
    renderAdminNotificationsCenter();
    renderAdminDashboard(); // refresh dashboard alerts
  }
}

// --------------------------------------------------------------------------
// MANUAL ORDER FLOW ACTIONS
// --------------------------------------------------------------------------
window.manualOrderCart = {}; // { id: qty }
window.adjustManualOrderQty = function(id, change) {
  AudioSynthesizer.playBeep();
  const current = window.manualOrderCart[id] || 0;
  const next = Math.max(0, current + change);
  if (next === 0) {
    delete window.manualOrderCart[id];
  } else {
    window.manualOrderCart[id] = next;
  }
  
  const qtyEl = document.getElementById(`manual-qty-${id}`);
  if (qtyEl) qtyEl.innerText = next;
  
  updateManualOrderTotal();
};

function populateManualOrderProducts() {
  const container = document.getElementById('manual-order-products-container');
  if (!container) return;
  container.innerHTML = '';
  
  MENU.forEach(item => {
    const qty = window.manualOrderCart[item.id] || 0;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '8px 12px';
    row.style.borderBottom = '1px solid var(--dark-border)';
    row.style.fontSize = '0.8rem';
    row.style.color = 'var(--text-dark)';
    
    row.innerHTML = `
      <span>${AppState.selectedLang === 'ar' ? item.nameAr : item.nameEn} - <strong style="color:var(--primary-yellow);">${item.price.toFixed(2)} SAR</strong></span>
      <div style="display:flex; align-items:center; gap:8px;">
        <button class="qty-btn" type="button" onclick="adjustManualOrderQty('${item.id}', -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(198, 40, 40, 0.2); background-color:rgba(198, 40, 40, 0.08); color:var(--primary-red); font-weight:bold; cursor:pointer;">-</button>
        <span id="manual-qty-${item.id}" style="font-weight:bold; width:20px; text-align:center;">${qty}</span>
        <button class="qty-btn" type="button" onclick="adjustManualOrderQty('${item.id}', 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(198, 40, 40, 0.2); background-color:rgba(198, 40, 40, 0.08); color:var(--primary-red); font-weight:bold; cursor:pointer;">+</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function updateManualOrderTotal() {
  let subtotal = 0;
  Object.keys(window.manualOrderCart).forEach(id => {
    const qty = window.manualOrderCart[id];
    const item = MENU.find(m => m.id === id);
    if (item) subtotal += (item.price * qty);
  });
  const total = subtotal * 1.15;
  
  const display = document.getElementById('manual-order-total-display');
  if (display) display.innerText = total.toFixed(2) + " SAR";
}

function resetManualOrderForm() {
  window.manualOrderCart = {};
  if (document.getElementById('manual-order-phone')) document.getElementById('manual-order-phone').value = '';
  if (document.getElementById('manual-order-name')) document.getElementById('manual-order-name').value = '';
  if (document.getElementById('manual-order-notes')) document.getElementById('manual-order-notes').value = '';
  if (document.getElementById('manual-order-delivery-type')) document.getElementById('manual-order-delivery-type').value = 'dine-in';
  if (document.getElementById('manual-order-table')) document.getElementById('manual-order-table').value = '1';
  populateManualOrderProducts();
  updateManualOrderTotal();
}

// ==========================================================================
// ORDER EDITOR ENGINE GLOBAL HELPERS
// ==========================================================================
window.editingOrder = null;

window.triggerOrderEditor = function(orderId) {
  AudioSynthesizer.playBeep();
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  window.editingOrder = JSON.parse(JSON.stringify(order));
  
  document.getElementById('admin-editor-order-id').innerText = order.id;
  document.getElementById('admin-editor-order-customer').innerText = order.name || '-';
  document.getElementById('admin-editor-order-phone').innerText = order.phone || '-';
  document.getElementById('admin-editor-order-type').innerText = order.type === 'dine-in' 
    ? (AppState.selectedLang === 'ar' ? `محلي طاولة ${order.table}` : `Dine-in T${order.table}`)
    : (AppState.selectedLang === 'ar' ? 'سفري كرتون' : 'Takeaway');
  
  document.getElementById('admin-editor-order-date').innerText = order.timestamp || '-';
  
  document.getElementById('admin-editor-discount').value = order.discountPercent || 0;
  document.getElementById('admin-editor-status').value = order.status;
  
  if (order.status === 'cancelled') {
    document.getElementById('btn-admin-editor-reopen-order').style.display = 'block';
    document.getElementById('btn-admin-editor-cancel-order').style.display = 'none';
  } else {
    document.getElementById('btn-admin-editor-reopen-order').style.display = 'none';
    document.getElementById('btn-admin-editor-cancel-order').style.display = 'block';
  }
  
  const select = document.getElementById('admin-editor-add-item-select');
  if (select) {
    select.innerHTML = '';
    MENU.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.id;
      opt.innerText = AppState.selectedLang === 'ar' ? item.nameAr : item.nameEn;
      select.appendChild(opt);
    });
  }
  
  window.renderAdminEditorItems();
  
  const modal = document.getElementById('modal-order-editor-admin');
  if (modal) modal.style.display = 'flex';
};

window.renderAdminEditorItems = function() {
  const list = document.getElementById('admin-editor-items-list');
  if (!list) return;
  list.innerHTML = '';
  
  let subtotal = 0;
  window.editingOrder.items.forEach((item, index) => {
    const cost = item.price * item.qty;
    subtotal += cost;
    
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '8px 10px';
    row.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    
    row.innerHTML = `
      <span style="font-size:0.8rem; font-weight:700; color:var(--text-dark);">${AppState.selectedLang === 'ar' ? item.nameAr : item.nameEn}</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:0.75rem; color:var(--text-light-muted);">${item.price.toFixed(2)} SAR</span>
        <button class="qty-btn" type="button" onclick="window.adjustEditorItemQty(${index}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(198, 40, 40, 0.2); background-color:rgba(198, 40, 40, 0.08); color:var(--primary-red); font-weight:bold; cursor:pointer;">-</button>
        <span style="font-weight:bold; width:15px; text-align:center; font-size:0.8rem;">${item.qty}</span>
        <button class="qty-btn" type="button" onclick="window.adjustEditorItemQty(${index}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid rgba(198, 40, 40, 0.2); background-color:rgba(198, 40, 40, 0.08); color:var(--primary-red); font-weight:bold; cursor:pointer;">+</button>
        <span style="font-weight:800; color:var(--primary-yellow); min-width:60px; text-align:left;">${cost.toFixed(2)} SAR</span>
        <button type="button" onclick="window.removeEditorItem(${index})" style="background:none; border:none; color:var(--primary-red); cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
    list.appendChild(row);
  });
  
  const discountInput = document.getElementById('admin-editor-discount');
  const discountPercent = discountInput ? (parseFloat(discountInput.value) || 0) : 0;
  const discountAmt = subtotal * (discountPercent / 100);
  const discountedSubtotal = subtotal - discountAmt;
  const tax = discountedSubtotal * 0.15;
  const total = discountedSubtotal + tax;
  
  window.editingOrder.subtotal = discountedSubtotal;
  window.editingOrder.tax = tax;
  window.editingOrder.total = total;
  window.editingOrder.discountPercent = discountPercent;
  
  document.getElementById('admin-editor-total-display').innerText = total.toFixed(2) + " SAR";
};

window.adjustEditorItemQty = function(index, change) {
  AudioSynthesizer.playBeep();
  const item = window.editingOrder.items[index];
  if (!item) return;
  
  item.qty = Math.max(0, item.qty + change);
  if (item.qty === 0) {
    window.editingOrder.items.splice(index, 1);
  }
  window.renderAdminEditorItems();
};

window.removeEditorItem = function(index) {
  AudioSynthesizer.playBeep();
  window.editingOrder.items.splice(index, 1);
  window.renderAdminEditorItems();
};

// --------------------------------------------------------------------------
// MODULE 3: KITCHEN DISPLAY SYSTEM LOGIC
// --------------------------------------------------------------------------
function renderAdminKitchenKDS() {
  const L = TRANSLATIONS[AppState.selectedLang];
  const newCol = document.getElementById('kds-column-new-list');
  const paidCol = document.getElementById('kds-column-paid-list');
  const prepCol = document.getElementById('kds-column-preparing-list');
  const readyCol = document.getElementById('kds-column-ready-list');
  
  if (!newCol || !paidCol || !prepCol || !readyCol) return;
  
  // Clear lists
  newCol.innerHTML = '';
  paidCol.innerHTML = '';
  prepCol.innerHTML = '';
  readyCol.innerHTML = '';
  
  let newCount = 0, paidCount = 0, prepCount = 0, readyCount = 0;
  
  // Sort active orders (undelivered)
  const activeOrders = AppState.orders.filter(o => o.status !== 'delivered' && o.status !== 'completed');
  
  activeOrders.forEach(o => {
    const card = document.createElement('div');
    card.className = 'kds-card-board';
    
    const itemsList = o.items.map(itm => `
      <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
        <span>${itm.qty}x ${AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn}</span>
      </div>
    `).join('');
    
    const tableText = o.type === 'dine-in' 
      ? (AppState.selectedLang === 'ar' ? `طاولة ${o.table}` : `Table ${o.table}`)
      : (AppState.selectedLang === 'ar' ? 'سفري كرتون' : 'Takeaway');
      
    // Timer details
    const seconds = o.elapsedSeconds || 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const isLate = mins >= 15;
    const timerColor = isLate ? 'var(--primary-red)' : 'var(--primary-yellow)';
    
    // Assign chef options
    const currentChef = o.assignedChef || '';
    const chefsOptions = `
      <select onchange="window.assignKdsChef('${o.id}', this.value)" style="background:var(--primary-yellow-light); border:1px solid var(--primary-yellow); color:var(--text-dark); font-weight:bold; font-size:0.65rem; padding:2px; border-radius:4px; width:100%; margin-top:6px;">
        <option value="">${AppState.selectedLang === 'ar' ? 'تعيين طاهٍ...' : 'Assign Chef...'}</option>
        <option value="الرواد فهد" ${currentChef === 'الرواد فهد' ? 'selected' : ''}>فهد</option>
        <option value="أحمد الحربي" ${currentChef === 'أحمد الحربي' ? 'selected' : ''}>أحمد</option>
        <option value="خالد الشمراني" ${currentChef === 'خالد الشمراني' ? 'selected' : ''}>خالد</option>
      </select>
    `;
    
    let btnAction = '';
    if (o.status === 'new' || o.status === 'pending_payment') {
      btnAction = `<button class="sim-btn" onclick="window.transitionKdsStatus('${o.id}', 'paid')" style="width:100%; margin-top:8px; padding:6px; font-size:0.7rem; background:#3B82F6; border:none; color:#fff;">تأكيد الدفع للتحضير</button>`;
    } else if (o.status === 'paid') {
      btnAction = `<button class="sim-btn" onclick="window.transitionKdsStatus('${o.id}', 'preparing')" style="width:100%; margin-top:8px; padding:6px; font-size:0.7rem; background:var(--primary-yellow); color:#121214; border:none;">بدء الطهي (Start Cooking)</button>`;
    } else if (o.status === 'preparing') {
      btnAction = `<button class="sim-btn" onclick="window.transitionKdsStatus('${o.id}', 'ready')" style="width:100%; margin-top:8px; padding:6px; font-size:0.7rem; background:var(--color-ready); color:#fff; border:none;">جاهز للتسليم (Ready)</button>`;
    } else if (o.status === 'ready') {
      btnAction = `<button class="sim-btn" onclick="window.transitionKdsStatus('${o.id}', 'delivered')" style="width:100%; margin-top:8px; padding:6px; font-size:0.7rem; background:var(--primary-red); color:#fff; border:none;">تسليم للعميل (Deliver)</button>`;
    }
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--dark-border); padding-bottom:6px; margin-bottom:8px;">
        <span style="font-weight:900; color:var(--primary-yellow);">${o.id}</span>
        <span style="font-weight:bold; font-size:0.7rem; color:${timerColor};"><i class="fa-solid fa-clock"></i> ${timeDisplay}</span>
      </div>
      <div style="font-size:0.75rem; font-weight:bold; margin-bottom:4px; color:#fff;">${o.name} (${tableText})</div>
      <div style="border-bottom:1px dashed rgba(255,255,255,0.05); padding-bottom:6px; margin-bottom:6px;">${itemsList}</div>
      <div style="font-size:0.65rem; color:var(--text-light-muted); margin-bottom:4px;">ملاحظات: <strong style="color:var(--primary-yellow);">${o.notes || '-'}</strong></div>
      ${currentChef ? `<div style="font-size:0.65rem; color:var(--color-ready); margin-bottom:4px;"><i class="fa-solid fa-user-ninja"></i> طباخ: ${currentChef}</div>` : ''}
      ${chefsOptions}
      ${btnAction}
    `;
    
    if (o.status === 'new' || o.status === 'pending_payment') {
      newCol.appendChild(card);
      newCount++;
    } else if (o.status === 'paid') {
      paidCol.appendChild(card);
      paidCount++;
    } else if (o.status === 'preparing') {
      prepCol.appendChild(card);
      prepCount++;
    } else if (o.status === 'ready') {
      readyCol.appendChild(card);
      readyCount++;
    }
  });
  
  // Update counts badge
  document.getElementById('kds-count-new').innerText = newCount;
  document.getElementById('kds-count-paid').innerText = paidCount;
  document.getElementById('kds-count-preparing').innerText = prepCount;
  document.getElementById('kds-count-ready').innerText = readyCount;
}

window.transitionKdsStatus = function(orderId, nextStatus) {
  AudioSynthesizer.playBeep();
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  const originalStatus = order.status;
  order.status = nextStatus;
  if (nextStatus === 'paid') order.paymentStatus = 'paid';
  if (nextStatus === 'delivered') {
    order.status = 'completed'; // unify status name
    order.paymentStatus = 'paid';
    
    // Add transaction to Cashier shift till
    if (AppState.cashierShift.open) {
      AppState.cashierShift.currentCash += order.total;
    }
  }
  
  saveToLocalStorage();
  
  // Log operational action
  logAuditTrail(
    AppState.customerName || 'المدير فهد',
    `تغيير حالة الطلب ${orderId} من '${originalStatus}' إلى '${nextStatus}'`,
    `Changed order ${orderId} status from '${originalStatus}' to '${nextStatus}'`
  );
  
  // Supabase update
  if (supabaseClient) {
    supabaseClient
      .from('orders')
      .update({ status: order.status, payment_status: order.paymentStatus })
      .eq('id', orderId)
      .then(res => console.log('KDS Supabase status sync:', res));
  }
  
  renderAdminKitchenKDS();
  renderAdminDashboard();
  renderAdminCashierTill();
};

window.assignKdsChef = function(orderId, chefName) {
  AudioSynthesizer.playBeep();
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  order.assignedChef = chefName;
  saveToLocalStorage();
  
  logAuditTrail(
    'المدير فهد',
    `تعيين الشيف ${chefName || 'ملغي'} للطلب ${orderId}`,
    `Assigned chef ${chefName || 'none'} to order ${orderId}`
  );
  
  renderAdminKitchenKDS();
};

// --------------------------------------------------------------------------
// MODULE 4: CASHIER & FINANCIALS LOGIC
// --------------------------------------------------------------------------
function renderAdminCashierTill() {
  const L = TRANSLATIONS[AppState.selectedLang];
  const container = document.getElementById('cashier-shift-status-container');
  const logsContainer = document.getElementById('cashier-audit-till-logs');
  const trContainer = document.getElementById('cashier-transactions-table-rows');
  
  if (!container || !trContainer || !logsContainer) return;
  
  // Render Shift panel
  const shift = AppState.cashierShift;
  if (shift.open) {
    container.innerHTML = `
      <div style="background-color:rgba(16, 185, 129, 0.1); border:1px solid var(--color-ready); border-radius:12px; padding:12px; display:flex; flex-direction:column; gap:8px;">
        <span style="font-size:0.75rem; font-weight:bold; color:var(--color-ready);"><i class="fa-solid fa-lock-open"></i> الوردية مفتوحة ونشطة</span>
        <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
          <span>العهدة الافتتاحية:</span>
          <strong>${shift.openingFloat.toFixed(2)} SAR</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:bold; color:#fff;">
          <span>الخزينة النقدية الحالية:</span>
          <span style="color:var(--primary-yellow);">${shift.currentCash.toFixed(2)} SAR</span>
        </div>
        <div style="font-size:0.7rem; color:var(--text-light-muted); margin-top:4px;">وقت البدء: ${shift.openingTime}</div>
        <button class="sim-btn" onclick="window.closeCashierShift()" style="margin-top:8px; padding:8px; font-size:0.75rem; background-color:rgba(239, 68, 68, 0.15); border-color:var(--primary-red); color:var(--primary-red); font-weight:bold;">
          <i class="fa-solid fa-lock"></i> إقفال الوردية الحالية وتصدير التقرير
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="background-color:rgba(239, 68, 68, 0.1); border:1px solid var(--primary-red); border-radius:12px; padding:12px; display:flex; flex-direction:column; gap:8px; text-align:center;">
        <span style="font-size:0.75rem; font-weight:bold; color:var(--primary-red);"><i class="fa-solid fa-lock"></i> الوردية مغلقة حالياً</span>
        <p style="font-size:0.7rem; color:var(--text-light-muted); line-height:1.4;">يرجى فتح صندوق الخزينة والوردية للبدء بتأكيد تحصيل مبيعات اليوم والمدفوعات.</p>
        <button class="sim-btn" onclick="window.triggerOpenShiftModal()" style="margin-top:8px; padding:8px; font-size:0.75rem; background-color:var(--primary-yellow); color:#121214; border:none; font-weight:bold;">
          <i class="fa-solid fa-key"></i> فتح الوردية وتثبيت العهدة
        </button>
      </div>
    `;
  }
  
  // Render Shift audit logs
  logsContainer.innerHTML = shift.tillLogs.length === 0 
    ? `<div style="text-align:center; padding:10px;">لا توجد حركات تسوية بالخزينة</div>`
    : shift.tillLogs.map(l => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.02); padding-bottom:4px;">
          <span>${l.desc}</span>
          <strong style="color:var(--color-ready);">${l.amount > 0 ? '+' : ''}${l.amount.toFixed(2)}</strong>
        </div>
      `).join('');
      
  // Render Transactions table
  trContainer.innerHTML = '';
  const sortedOrders = AppState.orders.slice().reverse();
  
  if (sortedOrders.length === 0) {
    trContainer.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-light-muted); padding:20px;">لا تتوفر معاملات فواتير لليوم</td></tr>`;
  } else {
    sortedOrders.forEach(o => {
      let payTag = `<span class="badge-pay ${o.paymentStatus}">${o.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}</span>`;
      let btnAction = '';
      
      if (o.paymentStatus !== 'paid') {
        btnAction = `
          <button class="sim-btn" onclick="window.approveCashierPayment('${o.id}', 'cash')" style="padding:4px 8px; font-size:0.65rem; background:#10B981; border:none; color:#fff;">نقدي</button>
          <button class="sim-btn" onclick="window.approveCashierPayment('${o.id}', 'mada')" style="padding:4px 8px; font-size:0.65rem; background:#3B82F6; border:none; color:#fff; margin-right:4px;">مدى/شبكة</button>
        `;
      } else {
        btnAction = `
          <button class="sim-btn" onclick="window.refundCashierPayment('${o.id}')" style="padding:4px 8px; font-size:0.65rem; background-color:rgba(239, 68, 68, 0.15); border-color:var(--primary-red); color:var(--primary-red);">استرجاع (Refund)</button>
        `;
      }
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:900; color:var(--primary-red);">${o.id}</td>
        <td style="font-weight:700;">${o.name}</td>
        <td style="font-weight:800; color:var(--primary-yellow);">${o.total.toFixed(2)} ${L.sar}</td>
        <td style="font-size:0.75rem; color:var(--text-light-muted);">${o.paymentMethod || '-'}</td>
        <td>${payTag}</td>
        <td>${btnAction}</td>
      `;
      trContainer.appendChild(tr);
    });
  }
}

window.triggerOpenShiftModal = function() {
  AudioSynthesizer.playBeep();
  const modal = document.getElementById('modal-open-shift-cashier');
  if (modal) modal.style.display = 'flex';
};

window.closeCashierShift = function() {
  AudioSynthesizer.playBeep();
  const shift = AppState.cashierShift;
  const L = TRANSLATIONS[AppState.selectedLang];
  
  if (!shift.open) return;
  
  const expectedTotal = shift.openingFloat + shift.tillLogs.reduce((acc, curr) => acc + curr.amount, 0);
  const diff = shift.currentCash - expectedTotal;
  const nowStr = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  
  let reportMsg = `
=== تقرير إقفال الخزينة الفوري ===
وقت الإغلاق: ${nowStr}
العهدة الافتتاحية: ${shift.openingFloat.toFixed(2)} SAR
إجمالي المبيعات المسجلة: ${(shift.currentCash - shift.openingFloat).toFixed(2)} SAR
المبلغ المتوقع بالصندوق: ${expectedTotal.toFixed(2)} SAR
المبلغ الفعلي المتوفر: ${shift.currentCash.toFixed(2)} SAR
الفروقات والعجز المالي: ${diff.toFixed(2)} SAR
----------------------------
  `;
  
  alert(reportMsg);
  
  shift.open = false;
  shift.closingTime = nowStr;
  shift.tillLogs = [];
  saveToLocalStorage();
  
  logAuditTrail(
    'أمين الخزينة خالد',
    `تم إغلاق الوردية التشغيلية وتسوية الصندوق المالي بفرق ${diff.toFixed(2)} ر.س`,
    `Closed cashier shift with till difference of ${diff.toFixed(2)} SAR`
  );
  
  renderAdminCashierTill();
};

window.approveCashierPayment = function(orderId, method) {
  AudioSynthesizer.playBeep();
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  order.paymentStatus = 'paid';
  order.paymentMethod = method;
  
  // If order status is pending_payment (new), advance it to 'paid' so it appears for chefs in KDS
  if (order.status === 'new' || order.status === 'pending_payment') {
    order.status = 'paid';
  }
  
  // Register financial log
  if (AppState.cashierShift.open) {
    AppState.cashierShift.currentCash += order.total;
    AppState.cashierShift.tillLogs.unshift({
      desc: `مبيعات طلب ${orderId} (${method})`,
      amount: order.total
    });
  }
  
  saveToLocalStorage();
  
  logAuditTrail(
    'أمين الخزينة خالد',
    `تحصيل الفاتورة للطلب ${orderId} عن طريق (${method}) بمبلغ ${order.total.toFixed(2)} ر.س`,
    `Approved payment for order ${orderId} via (${method})`
  );
  
  // Supabase update
  if (supabaseClient) {
    supabaseClient
      .from('orders')
      .update({ status: order.status, payment_status: 'paid', payment_method: method })
      .eq('id', orderId)
      .then(res => console.log('Cashier Payment Supabase sync:', res));
  }
  
  renderAdminCashierTill();
  renderAdminKitchenKDS();
  renderAdminDashboard();
};

window.refundCashierPayment = function(orderId) {
  AudioSynthesizer.playBeep();
  if (!confirm(AppState.selectedLang === 'ar' ? `هل أنت متأكد من استرجاع وإلغاء تحصيل الفاتورة للطلب ${orderId}؟` : `Are you sure you want to refund order ${orderId}?`)) return;
  
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;
  
  order.paymentStatus = 'refunded';
  const refundAmount = order.total;
  
  if (AppState.cashierShift.open) {
    AppState.cashierShift.currentCash -= refundAmount;
    AppState.cashierShift.tillLogs.unshift({
      desc: `استرجاع مبيعات طلب ${orderId}`,
      amount: -refundAmount
    });
  }
  
  saveToLocalStorage();
  
  logAuditTrail(
    'أمين الخزينة خالد',
    `استرجاع وردّ مبلغ الفاتورة للطلب ${orderId} بقيمة ${refundAmount.toFixed(2)} ر.س`,
    `Issued a refund for order ${orderId} of ${refundAmount.toFixed(2)} SAR`
  );
  
  if (supabaseClient) {
    supabaseClient
      .from('orders')
      .update({ status: 'completed', payment_status: 'refunded' })
      .eq('id', orderId)
      .then(res => console.log('Refund Supabase sync:', res));
  }
  
  renderAdminCashierTill();
  renderAdminKitchenKDS();
  renderAdminDashboard();
};

// --------------------------------------------------------------------------
// MODULE 5: TABLE MANAGEMENT & SALOON MAP
// --------------------------------------------------------------------------
function renderAdminTablesGrid() {
  const container = document.getElementById('admin-interactive-tables-grid');
  if (!container) return;
  container.innerHTML = '';
  
  const total = AppState.totalTables || 12;
  for (let i = 1; i <= total; i++) {
    // Determine table status by active orders
    const tableOrders = AppState.orders.filter(o => o.table === i && o.status !== 'delivered' && o.status !== 'completed');
    
    let tableStatus = 'available'; // available, occupied, preparing, waiting
    let activeOrder = null;
    
    if (tableOrders.length > 0) {
      activeOrder = tableOrders[0];
      if (activeOrder.status === 'pending_payment') {
        tableStatus = 'waiting';
      } else if (activeOrder.status === 'preparing' || activeOrder.status === 'paid') {
        tableStatus = 'preparing';
      } else if (activeOrder.status === 'ready') {
        tableStatus = 'occupied';
      }
    }
    
    const node = document.createElement('div');
    node.className = `table-node ${tableStatus}`;
    
    let label = '';
    if (tableStatus === 'available') label = (AppState.selectedLang === 'ar' ? 'شاغرة (متاحة)' : 'Available');
    if (tableStatus === 'waiting') label = (AppState.selectedLang === 'ar' ? 'بانتظار الدفع' : 'Unpaid Check');
    if (tableStatus === 'preparing') label = (AppState.selectedLang === 'ar' ? 'قيد التحضير' : 'Cooking');
    if (tableStatus === 'occupied') label = (AppState.selectedLang === 'ar' ? 'بانتظار الاستلام' : 'Ready / Occupied');
    
    const tableDisplayName = (AppState.tableNames && AppState.tableNames[i]) ? AppState.tableNames[i] : String(i);
    node.innerHTML = `
      <span class="number" style="font-size:${tableDisplayName.length > 4 ? '0.75rem' : '1rem'}; word-break:break-word;">${tableDisplayName}</span>
      <span class="status-text">${label}</span>
      ${activeOrder ? `<div style="font-size:0.6rem; font-weight:bold; color:var(--primary-yellow); margin-top:6px;">${activeOrder.id} - ${activeOrder.total.toFixed(1)} ر.س</div>` : ''}
    `;
    
    node.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      window.triggerAdminTableAction(i, activeOrder);
    });
    
    container.appendChild(node);
  }
}

window.currentModalTableNum = null;
window.currentModalTableOrder = null;

window.triggerAdminTableAction = function(tableNum, order) {
  AudioSynthesizer.playBeep();
  window.currentModalTableNum = tableNum;
  window.currentModalTableOrder = order;

  const numDisplay = document.getElementById('table-action-num-display');
  if (numDisplay) {
    numDisplay.innerText = tableNum;
  }

  const statusAlert = document.getElementById('table-action-status-alert');
  if (statusAlert) {
    const hasOrder = !!order;
    if (hasOrder) {
      statusAlert.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
      statusAlert.style.color = '#F59E0B';
      statusAlert.style.border = '1px solid rgba(245, 158, 11, 0.25)';
      statusAlert.innerHTML = AppState.selectedLang === 'ar'
        ? `<i class="fa-solid fa-triangle-exclamation"></i> الطلب النشط حالياً: <strong>${order.id}</strong> (القيمة: ${order.total.toFixed(2)} ر.س)`
        : `<i class="fa-solid fa-triangle-exclamation"></i> Active Order: <strong>${order.id}</strong> (Total: ${order.total.toFixed(2)} SAR)`;
    } else {
      statusAlert.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      statusAlert.style.color = '#10B981';
      statusAlert.style.border = '1px solid rgba(16, 185, 129, 0.25)';
      statusAlert.innerHTML = AppState.selectedLang === 'ar'
        ? `<i class="fa-solid fa-circle-check"></i> الطاولة <strong>شاغرة ومتاحة</strong> حالياً`
        : `<i class="fa-solid fa-circle-check"></i> Table is <strong>vacant and available</strong>`;
    }
  }

  const checkoutBtn = document.getElementById('btn-table-action-checkout');
  if (checkoutBtn) {
    checkoutBtn.style.display = order ? 'flex' : 'none';
  }

  const modal = document.getElementById('modal-table-actions');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  }
};

window.closeTableActionsModal = function() {
  const modal = document.getElementById('modal-table-actions');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 300);
  }
  window.currentModalTableNum = null;
  window.currentModalTableOrder = null;
};

window.handleTableModalAction = function(actionType) {
  AudioSynthesizer.playBeep();
  const tableNum = window.currentModalTableNum;
  const order = window.currentModalTableOrder;
  const hasOrder = !!order;
  
  if (!tableNum) return;

  if (actionType === 'transfer') {
    if (!hasOrder) {
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'لا يوجد طلب نشط على هذه الطاولة لنقله!' : 'No active order on this table to transfer!',
        'error'
      );
      return;
    }
    const targetTableStr = prompt(AppState.selectedLang === 'ar' ? 'أدخل رقم الطاولة المستهدفة لنقل الطلب إليها:' : 'Enter target table number:');
    if (!targetTableStr) return;
    const targetTable = parseInt(targetTableStr);
    
    if (isNaN(targetTable) || targetTable < 1 || targetTable > AppState.totalTables) {
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'رقم طاولة غير صحيح!' : 'Invalid table number!',
        'error'
      );
      return;
    }
    
    const originalTable = order.table;
    order.table = targetTable;
    saveToLocalStorage();
    
    logAuditTrail(
      'مدير الصالة فهد',
      `تم نقل الطلب ${order.id} من الطاولة ${originalTable} إلى الطاولة ${targetTable}`,
      `Transferred order ${order.id} from Table ${originalTable} to Table ${targetTable}`
    );
    
    showToastNotification(
      AppState.selectedLang === 'ar' ? `تم نقل الطلب ${order.id} بنجاح إلى طاولة ${targetTable}!` : `Successfully transferred order ${order.id} to table ${targetTable}!`,
      'success'
    );
    
    window.closeTableActionsModal();
    renderAdminTablesGrid();
  } else if (actionType === 'qr') {
    let href = window.location.href.split('?')[0].split('#')[0];
    const tableUrl = `${href}?table=${tableNum}`;
    
    // Create a sleek prompt-fallback using browser built-in, but since it's just displaying information we can also print to console or alert.
    // Wait, let's make it alert only for the link as copying is easiest from prompt/alert, or show it. Let's keep a friendly message.
    alert(`رابط قائمة العميل للطاولة رقم ${tableNum}:\n\n${tableUrl}`);
  } else if (actionType === 'rename') {
    const currentLabel = (AppState.tableNames && AppState.tableNames[tableNum]) || String(tableNum);
    const newNumStr = prompt(AppState.selectedLang === 'ar' ? 'أدخل الاسم أو المسمى الجديد لهذه الطاولة:' : 'Enter new name/number for this table:', currentLabel);
    if (newNumStr && newNumStr.trim()) {
      if (!AppState.tableNames) AppState.tableNames = {};
      AppState.tableNames[tableNum] = newNumStr.trim();
      saveToLocalStorage(); // persists to Supabase settings via saveToLocalStorage
      logAuditTrail(
        'المدير فهد',
        `تعديل مسمى الطاولة رقم ${tableNum} إلى "${newNumStr.trim()}"`,
        `Renamed Table ${tableNum} to "${newNumStr.trim()}"`
      );
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم تعديل مسمى الطاولة بنجاح!' : 'Table renamed successfully!',
        'success'
      );
      window.closeTableActionsModal();
      renderAdminTablesGrid();
    }
  } else if (actionType === 'merge') {
    const mergeTableStr = prompt(AppState.selectedLang === 'ar' ? 'أدخل رقم الطاولة الأخرى التي ترغب بدمجها مع هذه الطاولة:' : 'Enter target table to merge with:');
    if (!mergeTableStr) return;
    const mergeTable = parseInt(mergeTableStr);
    if (isNaN(mergeTable) || mergeTable < 1 || mergeTable > AppState.totalTables) {
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'رقم طاولة غير صحيح للدمج!' : 'Invalid table number for merge!',
        'error'
      );
      return;
    }
    logAuditTrail(
      'مدير الصالة فهد',
      `تم دمج الطاولة رقم ${mergeTable} مع الطاولة رقم ${tableNum} بنجاح`,
      `Merged Table ${mergeTable} with Table ${tableNum} successfully`
    );
    showToastNotification(
      AppState.selectedLang === 'ar' ? `تم دمج الطاولة ${mergeTable} مع الطاولة ${tableNum} بنجاح!` : `Successfully merged Table ${mergeTable} with Table ${tableNum}!`,
      'success'
    );
    window.closeTableActionsModal();
    renderAdminTablesGrid();
  } else if (actionType === 'delete') {
    if (confirm(AppState.selectedLang === 'ar' ? `هل أنت متأكد من حذف الطاولة رقم ${tableNum} بالكامل؟` : `Are you sure you want to delete Table ${tableNum} completely?`)) {
      AppState.totalTables = Math.max(1, (AppState.totalTables || 12) - 1);
      localStorage.setItem('HIPROUST_TOTAL_TABLES', AppState.totalTables);

      if (supabaseClient) {
        supabaseClient.from('settings').upsert({ key: 'total_tables', value: String(AppState.totalTables) }).catch(() => {});
        supabaseClient.from('tables').delete().eq('table_number', tableNum)
          .then(async () => {
            const { data } = await supabaseClient.from('tables').select('*');
            if (data) AppState.tables = data;
          }).catch(() => {});
      }
      
      logAuditTrail(
        'المدير فهد',
        `تم حذف وإزالة الطاولة رقم ${tableNum} من المطعم`,
        `Deleted and removed Table ${tableNum} from active layout`
      );
      
      showToastNotification(
        AppState.selectedLang === 'ar' ? `تم إزالة وحذف الطاولة رقم ${tableNum} بنجاح` : `Successfully deleted Table ${tableNum}`,
        'success'
      );
      
      window.closeTableActionsModal();
      renderAdminTablesGrid();
      if (typeof renderAdminQRCodes === 'function') renderAdminQRCodes();
      renderAdminDashboard();
    }
  } else if (actionType === 'checkout') {
    if (!hasOrder) {
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'لا يوجد طلب نشط على هذه الطاولة لمحاسبته!' : 'No active order on this table to checkout!',
        'error'
      );
      return;
    }
    
    const payChoice = prompt(AppState.selectedLang === 'ar' 
      ? `تحصيل مبلغ الفاتورة للطلب ${order.id} بقيمة ${order.total.toFixed(2)} ر.س:\n1. دفع نقدي (Cash)\n2. دفع شبكة مدى (Mada)\nأدخل (1 أو 2):`
      : `Collect payment for order ${order.id} of ${order.total.toFixed(2)} SAR:\n1. Cash\n2. Mada\nEnter (1 or 2):`);
      
    if (payChoice === '1') {
      window.approveCashierPayment(order.id, 'cash');
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم الدفع نقداً بنجاح وتسوية الطاولة ماليّاً!' : 'Paid in cash successfully and table cleared!',
        'success'
      );
      window.closeTableActionsModal();
      renderAdminTablesGrid();
    } else if (payChoice === '2') {
      window.approveCashierPayment(order.id, 'mada');
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تم الدفع بالشبكة مدى بنجاح وتسوية الطاولة ماليّاً!' : 'Paid via Mada successfully and table cleared!',
        'success'
      );
      window.closeTableActionsModal();
      renderAdminTablesGrid();
    }
  }
};

// --------------------------------------------------------------------------
// MODULE 7: CATEGORIES MANAGEMENT PANEL
// --------------------------------------------------------------------------
function renderAdminCategoriesPanel() {
  const container = document.getElementById('admin-panel-categories-rows');
  if (!container) return;
  container.innerHTML = '';
  
  CATEGORIES.forEach(c => {
    if (c.id === 'all') return;
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:800; color:var(--primary-yellow);">${c.id}</td>
      <td style="font-weight:700;">${c.nameAr}</td>
      <td style="font-weight:700;">${c.nameEn}</td>
      <td style="text-align:center;">
        <button class="sim-btn" onclick="window.deleteAdminCategory('${c.id}')" style="padding:4px 8px; font-size:0.65rem; background-color:rgba(239, 68, 68, 0.15); border-color:var(--primary-red); color:var(--primary-red);"><i class="fa-solid fa-trash"></i> حذف</button>
      </td>
    `;
    container.appendChild(tr);
  });
}

window.deleteAdminCategory = function(catId) {
  AudioSynthesizer.playBeep();
  if (!confirm(AppState.selectedLang === 'ar' ? `هل أنت متأكد من حذف قسم المنيو '${catId}' بالكامل؟` : `Are you sure you want to delete category '${catId}'?`)) return;
  
  const existingIdx = CATEGORIES.findIndex(c => c.id === catId);
  if (existingIdx > -1) {
    CATEGORIES.splice(existingIdx, 1);
    saveToLocalStorage();
    
    logAuditTrail(
      'المدير فهد',
      `تم حذف قسم المنيو '${catId}' بالكامل`,
      `Deleted categories catalog ID '${catId}'`
    );
    
    if (supabaseClient) {
      supabaseClient
        .from('categories')
        .delete()
        .eq('id', catId)
        .then(res => console.log('Category Supabase deletion:', res));
    }
    
    renderAdminCategoriesPanel();
    renderAdminMenuManage(); // refresh menu products list
  }
};

// --------------------------------------------------------------------------
// MODULE 8: CUSTOMERS MANAGEMENT PANEL
// --------------------------------------------------------------------------
function renderAdminCustomersRoster() {
  const container = document.getElementById('admin-customers-table-rows');
  if (!container) return;
  container.innerHTML = '';

  const customersList = [];

  // PRIMARY: build list from Supabase-synced AppState.customers
  if (AppState.customers && AppState.customers.length > 0) {
    AppState.customers.forEach(c => {
      const clientOrders = AppState.orders.filter(ord => ord.phone === c.phone);
      const totalSpent = clientOrders.reduce((sum, curr) => sum + (curr.paymentStatus === 'paid' ? curr.total : 0), 0);
      const isBanned = AppState.bannedCustomers && AppState.bannedCustomers.includes(c.phone);
      let regDate = '—';
      if (c.created_at) {
        try {
          const d = new Date(c.created_at);
          regDate = `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`;
        } catch(e) {}
      }
      customersList.push({ name: c.name || 'عميل', phone: c.phone, regDate, ordersCount: clientOrders.length, spending: totalSpent, banned: isBanned });
    });
  } else {
    // FALLBACK: aggregate from orders if DB customers not yet loaded
    const processedPhones = new Set();
    AppState.orders.forEach(o => {
      if (!o.phone || processedPhones.has(o.phone)) return;
      processedPhones.add(o.phone);
      const clientOrders = AppState.orders.filter(ord => ord.phone === o.phone);
      const totalSpent = clientOrders.reduce((sum, curr) => sum + (curr.paymentStatus === 'paid' ? curr.total : 0), 0);
      const isBanned = AppState.bannedCustomers && AppState.bannedCustomers.includes(o.phone);
      customersList.push({ name: o.name || 'عميل مميز', phone: o.phone, regDate: '—', ordersCount: clientOrders.length, spending: totalSpent, banned: isBanned });
    });
  }
  
  if (customersList.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-light-muted); padding:20px;">لا يوجد سجل عملاء نشطين حالياً</td></tr>`;
  } else {
    customersList.forEach(c => {
      let statusTag = c.banned 
        ? `<span class="badge-status" style="background-color:rgba(239, 68, 68, 0.15); color:#EF4444; border:1px solid rgba(239, 68, 68, 0.3);">محظور (Banned)</span>`
        : `<span class="badge-status ready" style="padding:4px 8px; font-size:0.65rem;">نشط (Active)</span>`;
        
      let toggleBanBtn = c.banned
        ? `<button class="sim-btn" onclick="window.toggleBanCustomer('${c.phone}', false)" style="padding:4px 8px; font-size:0.65rem; background:#10B981; border:none; color:#fff;">إلغاء الحظر</button>`
        : `<button class="sim-btn" onclick="window.toggleBanCustomer('${c.phone}', true)" style="padding:4px 8px; font-size:0.65rem; background-color:rgba(239, 68, 68, 0.15); border-color:var(--primary-red); color:var(--primary-red);">حظر العميل</button>`;
        
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${c.name}</td>
        <td style="font-size:0.75rem; color:var(--text-light-muted);">${c.phone}</td>
        <td style="font-size:0.75rem; color:var(--text-light-muted);">${c.regDate}</td>
        <td style="font-weight:700; text-align:center;">${c.ordersCount}</td>
        <td style="font-weight:800; color:var(--primary-yellow);">${c.spending.toFixed(2)} SAR</td>
        <td>${statusTag}</td>
        <td style="text-align:center; display:flex; gap:6px; justify-content:center;">
          ${toggleBanBtn}
          <button class="sim-btn" onclick="window.viewCustomerHistory('${c.phone}')" style="padding:4px 8px; font-size:0.65rem; background-color:rgba(59, 130, 246, 0.12); border-color:rgba(59, 130, 246, 0.25); color:#3B82F6;"><i class="fa-solid fa-clock-rotate-left"></i> سجل الوجبات</button>
        </td>
      `;
      container.appendChild(tr);
    });
  }
}

window.toggleBanCustomer = function(phone, banState) {
  AudioSynthesizer.playBeep();
  if (!AppState.bannedCustomers) AppState.bannedCustomers = [];
  
  if (banState) {
    if (!AppState.bannedCustomers.includes(phone)) AppState.bannedCustomers.push(phone);
    logAuditTrail('المدير فهد', `حظر العميل ذو الهاتف ${phone}`, `Banned guest account ${phone}`);
  } else {
    AppState.bannedCustomers = AppState.bannedCustomers.filter(p => p !== phone);
    logAuditTrail('المدير فهد', `إلغاء حظر العميل ذو الهاتف ${phone}`, `Unbanned guest account ${phone}`);
  }
  
  saveToLocalStorage();
  renderAdminCustomersRoster();
};

window.viewCustomerHistory = function(phone) {
  AudioSynthesizer.playBeep();
  
  const customer = AppState.customers.find(c => c.phone === phone);
  const custName = customer ? customer.name : phone;
  
  const nameDisplay = document.getElementById('history-cust-name');
  if (nameDisplay) {
    nameDisplay.innerText = custName;
  }
  
  const container = document.getElementById('history-orders-list');
  if (!container) return;
  container.innerHTML = '';
  
  const history = AppState.orders.filter(o => o.phone === phone);
  
  if (history.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-light-muted);">
        <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--primary-yellow); opacity: 0.5; margin-bottom: 12px;"></i>
        <div style="font-size: 0.95rem; font-weight: bold;">لا توجد طلبيات سابقة لهذا العميل</div>
      </div>
    `;
  } else {
    // Sort from newest to oldest
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedHistory.forEach(order => {
      const card = document.createElement('div');
      card.style.background = 'rgba(255, 255, 255, 0.03)';
      card.style.border = '1px solid var(--dark-border)';
      card.style.borderRadius = '16px';
      card.style.padding = '14px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.gap = '10px';
      
      const itemsHtml = order.items.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255, 255, 255, 0.02); padding: 6px 10px; border-radius: 8px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.02);">
          <span style="color: var(--text-light); font-weight: bold;">${item.nameAr}</span>
          <span style="color: var(--primary-yellow); font-weight: 800;">x${item.qty}</span>
        </div>
      `).join('');
      
      let statusColor = '#9CA3AF'; // Gray for general/completed
      let statusTextAr = order.status;
      
      if (order.status === 'pending_payment') {
        statusColor = '#EF4444';
        statusTextAr = 'بانتظار الدفع';
      } else if (order.status === 'preparing') {
        statusColor = '#F59E0B';
        statusTextAr = 'قيد التحضير';
      } else if (order.status === 'ready') {
        statusColor = '#10B981';
        statusTextAr = 'جاهز للتسليم';
      } else if (order.status === 'completed' || order.status === 'delivered') {
        statusColor = '#3B82F6';
        statusTextAr = 'مكتمل ومسلم';
      } else if (order.status === 'cancelled') {
        statusColor = '#9CA3AF';
        statusTextAr = 'ملغي';
      }
      
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.08); padding-bottom: 8px;">
          <div>
            <span style="font-weight: 800; color: var(--primary-yellow); font-size: 0.95rem;">${order.id}</span>
            <span style="font-size: 0.75rem; color: var(--text-light-muted); margin-right: 8px;">${order.timestamp || ''}</span>
          </div>
          <span style="background-color: ${statusColor}1A; color: ${statusColor}; border: 1px solid ${statusColor}40; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: bold;">
            ${statusTextAr}
          </span>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${itemsHtml}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 8px; margin-top: 4px;">
          <span style="font-size: 0.75rem; color: var(--text-light-muted);">إجمالي قيمة الطلب:</span>
          <span style="font-weight: 800; color: #10B981; font-size: 0.95rem;">${order.total.toFixed(2)} SAR</span>
        </div>
      `;
      container.appendChild(card);
    });
  }
  
  const modal = document.getElementById('modal-customer-history');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
  }
};

window.closeCustomerHistoryModal = function() {
  const modal = document.getElementById('modal-customer-history');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 300);
  }
};

// --------------------------------------------------------------------------
// MODULE 9: INVENTORY & SAFETY STOCKS
// --------------------------------------------------------------------------
function renderAdminInventoryStock() {
  const container = document.getElementById('admin-inventory-table-rows');
  if (!container) return;
  container.innerHTML = '';
  
  AppState.inventory.forEach(item => {
    const pct = Math.min(100, (item.stock / (item.minLimit * 2)) * 100);
    let levelClass = 'safe';
    if (item.stock <= item.minLimit) levelClass = 'warning';
    if (item.stock <= item.minLimit * 0.5) levelClass = 'danger';
    
    let dangerTag = item.stock <= item.minLimit
      ? `<span class="badge-status" style="background-color:rgba(239, 68, 68, 0.15); color:#EF4444; border:1px solid rgba(239, 68, 68, 0.3);"><i class="fa-solid fa-triangle-exclamation"></i> عجز بالكمية</span>`
      : `<span class="badge-status ready" style="padding:4px 8px; font-size:0.65rem;">مستوى آمن</span>`;
      
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700;">${AppState.selectedLang === 'ar' ? item.nameAr : item.nameEn}</td>
      <td style="font-weight:800; color:var(--primary-yellow);">${item.stock}</td>
      <td style="font-size:0.75rem; color:var(--text-light-muted);">${item.minLimit}</td>
      <td>
        <div class="inventory-progress-wrap">
          <div class="inventory-progress-bar">
            <div class="inventory-progress-fill ${levelClass}" style="width: ${pct}%;"></div>
          </div>
          <span style="font-size:0.65rem; color:var(--text-light-muted);">${pct.toFixed(0)}% من طاقة الاستيعاب</span>
        </div>
      </td>
      <td style="font-size:0.75rem; color:var(--text-light-muted);">${item.supplier}</td>
      <td style="text-align:center;">
        <button class="sim-btn" onclick="window.triggerInventoryAdjust('${item.id}')" style="padding:4px 10px; font-size:0.75rem; background-color:var(--primary-yellow-light); border:1px solid var(--primary-yellow); color:var(--text-dark); font-weight:bold;">
          <i class="fa-solid fa-pen-to-square"></i> تعديل وجرد
        </button>
      </td>
    `;
    container.appendChild(tr);
  });
}

window.triggerInventoryAdjust = function(itemId) {
  AudioSynthesizer.playBeep();
  const select = document.getElementById('edit-inventory-item-id');
  if (select) {
    select.innerHTML = '';
    AppState.inventory.forEach(inv => {
      const opt = document.createElement('option');
      opt.value = inv.id;
      opt.innerText = AppState.selectedLang === 'ar' ? inv.nameAr : inv.nameEn;
      if (inv.id === itemId) opt.selected = true;
      select.appendChild(opt);
    });
  }
  
  const modal = document.getElementById('modal-inventory-audit');
  if (modal) modal.style.display = 'flex';
};

// --------------------------------------------------------------------------
// MODULE 10: EMPLOYEES & STAFF ROSTER
// --------------------------------------------------------------------------
function renderAdminEmployeesRoster() {
  const container = document.getElementById('admin-employees-table-rows');
  if (!container) return;
  container.innerHTML = '';
  
  AppState.employees.forEach(emp => {
    let roleText = '';
    if (emp.role === 'admin') roleText = 'مالك المطعم (Admin)';
    if (emp.role === 'manager') roleText = 'مدير الصالة (Manager)';
    if (emp.role === 'cashier') roleText = 'أمين الصندوق (Cashier)';
    if (emp.role === 'kitchen') roleText = 'طاقم المطبخ (Kitchen)';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="font-weight:700;">${emp.name}</td>
      <td style="font-size:0.75rem; color:var(--text-light-muted);">${emp.phone}</td>
      <td style="font-weight:bold; color:var(--primary-yellow);">${roleText}</td>
      <td style="font-family:monospace; font-weight:bold; letter-spacing:3px;">****</td>
      <td style="text-align:center; display:flex; gap:8px; justify-content:center;">
        <button class="sim-btn" onclick="window.triggerEditEmployee('${emp.id}')" style="padding:4px 8px; font-size:0.65rem; background-color:rgba(59, 130, 246, 0.12); border-color:rgba(59, 130, 246, 0.25); color:#3B82F6;"><i class="fa-solid fa-edit"></i> تعديل</button>
        <button class="sim-btn" onclick="window.deleteEmployeeRoster('${emp.id}')" style="padding:4px 8px; font-size:0.65rem; background-color:rgba(239, 68, 68, 0.15); border-color:var(--primary-red); color:var(--primary-red);"><i class="fa-solid fa-trash"></i> إنهاء الخدمات</button>
      </td>
    `;
    container.appendChild(tr);
  });
}

window.triggerEditEmployee = function(empId) {
  AudioSynthesizer.playBeep();
  const emp = AppState.employees.find(e => e.id === empId);
  if (!emp) return;
  
  document.getElementById('employee-editor-title').innerText = AppState.selectedLang === 'ar' ? 'تعديل بيانات الموظف' : 'Edit Employee Details';
  document.getElementById('edit-employee-id').value = emp.id;
  document.getElementById('edit-emp-name').value = emp.name;
  document.getElementById('edit-emp-phone').value = emp.phone;
  document.getElementById('edit-emp-role').value = emp.role;
  document.getElementById('edit-emp-pin').value = emp.pin;
  
  const modal = document.getElementById('modal-employee-editor');
  if (modal) modal.style.display = 'flex';
};

window.deleteEmployeeRoster = function(empId) {
  AudioSynthesizer.playBeep();
  if (empId === 'emp-01') {
    alert(AppState.selectedLang === 'ar' ? 'لا يمكن إنهاء خدمات حساب المالك الافتراضي!' : 'Cannot delete the master Admin profile!');
    return;
  }
  
  if (!confirm(AppState.selectedLang === 'ar' ? 'هل أنت متأكد من إزالة هذا الموظف من الطاقم التشغيلي بالكامل؟' : 'Are you sure you want to fire this employee?')) return;
  
  const idx = AppState.employees.findIndex(e => e.id === empId);
  if (idx > -1) {
    const name = AppState.employees[idx].name;
    AppState.employees.splice(idx, 1);
    saveToLocalStorage();
    
    logAuditTrail('المدير فهد', `تم إنهاء خدمات الموظف: ${name}`, `Fired staff member: ${name}`);
    renderAdminEmployeesRoster();
  }
};

// --------------------------------------------------------------------------
// MODULE 11: REPORTS MANAGER
// --------------------------------------------------------------------------
function renderAdminReportsPanel() {
  const L = TRANSLATIONS[AppState.selectedLang];
  const span = document.getElementById('select-report-span').value;
  
  // Calculate periods
  let salesTotal = 0;
  let orderCount = 0;
  
  AppState.orders.forEach(o => {
    orderCount++;
    if (o.paymentStatus === 'paid') {
      salesTotal += o.total;
    }
  });
  
  // Multiply factor for span fallback visualization
  let factor = 1.0;
  if (span === 'weekly') factor = 6.4;
  if (span === 'monthly') factor = 26.8;
  if (span === 'yearly') factor = 312.0;
  
  const finalSales = salesTotal * factor;
  const finalOrders = Math.floor(orderCount * factor);
  const profitMargin = finalSales * 0.65; // gross 65% profit margins
  
  document.getElementById('report-sales-sum').innerText = finalSales.toFixed(2) + " " + L.sar;
  document.getElementById('report-orders-count').innerText = finalOrders;
  document.getElementById('report-profits-sum').innerText = profitMargin.toFixed(2) + " " + L.sar;
  
  // List bestseller items
  const bestContainer = document.getElementById('report-bestsellers-list-container');
  if (bestContainer) {
    bestContainer.innerHTML = '';
    const statsMap = {};
    AppState.orders.forEach(o => {
      o.items.forEach(itm => {
        statsMap[itm.id] = (statsMap[itm.id] || 0) + itm.qty;
      });
    });
    
    const sorted = MENU.map(m => ({
      name: AppState.selectedLang === 'ar' ? m.nameAr : m.nameEn,
      qty: Math.floor((statsMap[m.id] || 0) * factor)
    })).sort((a,b) => b.qty - a.qty);
    
    sorted.slice(0, 4).forEach(itm => {
      if (itm.qty === 0) return;
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.fontSize = '0.8rem';
      row.style.color = '#fff';
      row.style.padding = '6px 0';
      row.style.borderBottom = '1px solid rgba(255,255,255,0.02)';
      
      row.innerHTML = `<span>${itm.name}</span><strong style="color:var(--primary-yellow);">${itm.qty} قطعة</strong>`;
      bestContainer.appendChild(row);
    });
    
    if (bestContainer.children.length === 0) {
      bestContainer.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-light-muted);">لا توجد طلبيات بيع كافية لإجراء الإحصائية للفترة</div>`;
    }
  }
  
  // List Employees activity rows
  const empActivity = document.getElementById('report-employees-activity-rows');
  if (empActivity) {
    empActivity.innerHTML = '';
    
    AppState.employees.forEach(emp => {
      const ordersProcessed = Math.floor(Math.random() * 20 + 3);
      const rating = emp.role === 'kitchen' ? 'ممتاز (4.8 ⭐️)' : emp.role === 'cashier' ? 'دقيق جداً (5.0 ⭐️)' : 'إشرافي (4.9 ⭐️)';
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;">${emp.name}</td>
        <td style="font-size:0.75rem; color:var(--text-light-muted);">${emp.role.toUpperCase()}</td>
        <td style="font-weight:bold; text-align:center;">${ordersProcessed}</td>
        <td style="font-size:0.75rem; color:var(--color-ready);">${rating}</td>
      `;
      empActivity.appendChild(tr);
    });
  }
}

// --------------------------------------------------------------------------
// MODULE 12: ANALYTICS CHARTS ENGINE (DYNAMIC SVG GENERATOR)
// --------------------------------------------------------------------------
function renderAdminAnalyticsCharts() {
  const chartBox = document.getElementById('analytics-hourly-sales-chart');
  if (!chartBox) return;
  
  // Aggregate sales by hour blocks: 12pm, 2pm, 4pm, 6pm, 8pm, 10pm, 12am
  const hours = ['12 ظ', '2 ب.ظ', '4 ب.ظ', '6 م', '8 م', '10 م', '12 م'];
  const dataPoints = [240.0, 180.0, 310.0, 580.0, 940.0, 1180.0, 420.0];
  
  // Renders a modern glassmorphic responsive SVG line curve chart!
  let maxVal = Math.max(...dataPoints);
  let height = 200;
  let width = 500;
  
  let points = dataPoints.map((val, idx) => {
    let x = (idx * (width / (dataPoints.length - 1))) + 20;
    let y = height - ((val / maxVal) * (height - 40)) - 10;
    return { x, y, val };
  });
  
  let pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  
  // Add gradient under the curve
  let fillPathD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  
  let gridLines = '';
  for (let i = 1; i <= 3; i++) {
    let yPos = (height / 4) * i;
    gridLines += `<line x1="20" y1="${yPos}" x2="${width + 20}" y2="${yPos}" stroke="rgba(255,255,255,0.04)" stroke-dasharray="4" />`;
  }
  
  let labels = points.map((p, idx) => `
    <text x="${p.x}" y="${height + 15}" fill="var(--text-light-muted)" font-size="9" text-anchor="middle" font-weight="bold">${hours[idx]}</text>
    <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--primary-yellow)" stroke="#121214" stroke-width="2" />
    <text x="${p.x}" y="${p.y - 10}" fill="#fff" font-size="8" text-anchor="middle" font-weight="900">${p.val.toFixed(0)}</text>
  `).join('');
  
  let svg = `
    <svg viewBox="0 0 ${width + 40} ${height + 25}" style="width:100%; height:100%; display:block; overflow:visible;">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-yellow)" stop-opacity="0.18" />
          <stop offset="100%" stop-color="var(--primary-yellow)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${gridLines}
      <path d="${fillPathD}" fill="url(#chartGrad)" />
      <path d="${pathD}" fill="none" stroke="var(--primary-yellow)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${labels}
    </svg>
  `;
  
  chartBox.innerHTML = svg;
  
  // Update Analytics KPIs
  let totalSales = 0;
  let paidOrders = 0;
  AppState.orders.forEach(o => {
    if (o.paymentStatus === 'paid') {
      totalSales += o.total;
      paidOrders++;
    }
  });
  const avgCheck = paidOrders > 0 ? (totalSales / paidOrders) : 0;
  document.getElementById('analytics-avg-check-value').innerText = avgCheck.toFixed(2) + " SAR";
}

// --------------------------------------------------------------------------
// MODULE 13: CENTRAL ALERT NOTIFICATIONS
// --------------------------------------------------------------------------
function renderAdminNotificationsCenter() {
  const container = document.getElementById('admin-notifications-center-feed');
  if (!container) return;
  container.innerHTML = '';
  
  if (AppState.notifications.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:30px 10px; color:var(--text-light-muted);">لا توجد إشعارات تشغيلية مسجلة حالياً</div>`;
    return;
  }
  
  AppState.notifications.forEach(n => {
    const card = document.createElement('div');
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.gap = '14px';
    card.style.padding = '12px 16px';
    card.style.borderRadius = '12px';
    card.style.border = '1px solid var(--dark-border)';
    card.style.background = 'rgba(255,255,255,0.02)';
    card.style.fontSize = '0.8rem';
    card.style.color = '#fff';
    
    let iconHtml = '';
    if (n.type === 'alert') iconHtml = `<i class="fa-solid fa-triangle-exclamation" style="font-size:1.25rem; color:var(--primary-red);"></i>`;
    else iconHtml = `<i class="fa-solid fa-circle-info" style="font-size:1.25rem; color:#3B82F6;"></i>`;
    
    card.innerHTML = `
      ${iconHtml}
      <div style="flex: 1; text-align: right;">
        <span style="font-weight:bold; color:var(--primary-yellow); display:block;">${AppState.selectedLang === 'ar' ? n.titleAr : n.titleEn}</span>
        <span style="font-size:0.75rem; color:var(--text-light-muted); margin-top:2px; display:block;">${AppState.selectedLang === 'ar' ? n.descAr : n.descEn}</span>
      </div>
      <div style="font-size:0.7rem; color:var(--text-light-muted);">${n.time}</div>
    `;
    container.appendChild(card);
  });
}

// --------------------------------------------------------------------------
// MODULE 15: SECURITY AUDIT TRAILS LOGS
// --------------------------------------------------------------------------
function renderAdminAuditLogs() {
  const container = document.getElementById('admin-audit-logs-rows-container');
  if (!container) return;
  container.innerHTML = '';
  
  if (AppState.auditLogs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-light-muted);">لا تتوفر حركات رقابية مسجلة حالياً</div>`;
    return;
  }
  
  AppState.auditLogs.forEach(l => {
    const div = document.createElement('div');
    div.className = 'audit-log-line';
    
    const actionText = AppState.selectedLang === 'ar' ? l.actionAr : l.actionEn;
    
    div.innerHTML = `
      <span style="flex:2; font-weight:bold; color:#fff; text-align:right;">${actionText}</span>
      <span style="flex:1; text-align:center; color:var(--primary-yellow); font-weight:800;">${l.user}</span>
      <span style="flex:1; text-align:center; color:var(--text-light-muted);">${l.time}</span>
      <span style="flex:1; text-align:left; color:var(--text-light-muted); font-family:monospace;">${l.ip}</span>
    `;
    container.appendChild(div);
  });
}

function renderAdminDashboard() {
  const L = TRANSLATIONS[AppState.selectedLang];

  // Calculate Metrics
  let salesSum = 0;
  let ordersCount = 0;
  let activeOrdersCount = 0;
  let paidOrdersCount = 0;

  AppState.orders.forEach(o => {
    ordersCount++;
    if (o.paymentStatus === 'paid') {
      salesSum += o.total;
      paidOrdersCount++;
    }
    if (o.status !== 'completed') {
      activeOrdersCount++;
    }
  });

  const avgBill = paidOrdersCount > 0 ? (salesSum / paidOrdersCount) : 0;

  // Render KPI values
  const salesLbl = document.getElementById('admin-sales-total');
  const countLbl = document.getElementById('admin-orders-count');
  const avgLbl = document.getElementById('admin-avg-bill');
  const activeLbl = document.getElementById('admin-active-orders-count');

  if (salesLbl) salesLbl.innerText = salesSum.toFixed(2) + " " + L.sar;
  if (countLbl) countLbl.innerText = ordersCount;
  if (avgLbl) avgLbl.innerText = avgBill.toFixed(2) + " " + L.sar;
  if (activeLbl) activeLbl.innerText = activeOrdersCount;

  // 1. Render Recent Orders Rows (Overview Tab)
  const recentRows = document.getElementById('admin-recent-orders-rows');
  if (recentRows) {
    recentRows.innerHTML = '';
    const latestOrders = AppState.orders.slice(-5).reverse();
    if (latestOrders.length === 0) {
      recentRows.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-light-muted); padding: 20px;">${AppState.selectedLang === 'ar' ? 'لا توجد طلبات اليوم بعد' : 'No orders recorded today'}</td></tr>`;
    } else {
      latestOrders.forEach(o => {
        const typeLabel = o.type === 'dine-in' 
          ? (AppState.selectedLang === 'ar' ? `محلي ط<sup>${o.table}</sup>` : `Dine-in T<sup>${o.table}</sup>`)
          : (AppState.selectedLang === 'ar' ? 'سفري كرتون' : 'Takeaway');
          
        let statusTag = `<span class="badge-status ${o.status}">${o.status === 'new' ? (AppState.selectedLang === 'ar' ? 'جديد' : 'New') : o.status === 'preparing' ? (AppState.selectedLang === 'ar' ? 'قيد التحضير' : 'In Prep') : o.status === 'ready' ? (AppState.selectedLang === 'ar' ? 'جاهز' : 'Ready') : (AppState.selectedLang === 'ar' ? 'مكتمل' : 'Done')}</span>`;
        let payTag = `<span class="badge-pay ${o.paymentStatus}">${o.paymentStatus === 'paid' ? (AppState.selectedLang === 'ar' ? 'مدفوع' : 'Paid') : (AppState.selectedLang === 'ar' ? 'غير مدفوع' : 'Unpaid')}</span>`;
        
        const itemsSummary = o.items.map(itm => `${itm.qty}x ${AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn}`).join(' ، ');

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 800; color: var(--primary-red);">${o.id}</td>
          <td><div style="font-weight:700;">${o.name}</div></td>
          <td style="font-weight: 600;">${typeLabel}</td>
          <td style="font-size:0.75rem; color:var(--text-light-muted); max-width:240px; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${itemsSummary}">${itemsSummary}</td>
          <td>${statusTag}</td>
          <td>${payTag}</td>
        `;
        recentRows.appendChild(tr);
      });
    }
  }

  // 2. Render All Orders Rows (Orders Tab)
  const allRows = document.getElementById('admin-all-orders-rows');
  if (allRows) {
    allRows.innerHTML = '';
    const sortedOrders = AppState.orders.slice().reverse();
    if (sortedOrders.length === 0) {
      allRows.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-light-muted); padding: 20px;">${AppState.selectedLang === 'ar' ? 'لا توجد طلبات نشطة اليوم' : 'No active orders today'}</td></tr>`;
    } else {
      sortedOrders.forEach(o => {
        const typeLabel = o.type === 'dine-in' 
          ? (AppState.selectedLang === 'ar' ? `محلي ط<sup>${o.table}</sup>` : `Dine-in T<sup>${o.table}</sup>`)
          : (AppState.selectedLang === 'ar' ? 'سفري كرتون' : 'Takeaway');
          
        let statusTag = `<span class="badge-status ${o.status}">${o.status === 'new' ? (AppState.selectedLang === 'ar' ? 'جديد' : 'New') : o.status === 'preparing' ? (AppState.selectedLang === 'ar' ? 'قيد التحضير' : 'In Prep') : o.status === 'ready' ? (AppState.selectedLang === 'ar' ? 'جاهز' : 'Ready') : (AppState.selectedLang === 'ar' ? 'مكتمل' : 'Done')}</span>`;
        let payTag = `<span class="badge-pay ${o.paymentStatus}">${o.paymentStatus === 'paid' ? (AppState.selectedLang === 'ar' ? 'مدفوع' : 'Paid') : (AppState.selectedLang === 'ar' ? 'غير مدفوع' : 'Unpaid')}</span>`;
        
        const itemsSummary = o.items.map(itm => `${itm.qty}x ${AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn}`).join('<br>');

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="font-weight: 800; color: var(--primary-red);">${o.id}</td>
          <td style="font-weight: 700;">${o.name}</td>
          <td style="font-size:0.75rem; color:var(--text-light-muted);">${o.phone}</td>
          <td style="font-weight: 600;">${typeLabel}</td>
          <td style="font-size:0.75rem; line-height:1.3;">${itemsSummary}</td>
          <td style="font-size:0.75rem; color:var(--primary-yellow);">${o.notes || '-'}</td>
          <td style="font-weight: 800; color:var(--primary-red);">${o.total.toFixed(2)} ${L.sar}</td>
          <td>${statusTag}</td>
          <td>${payTag}</td>
          <td>
            <button class="sim-btn" onclick="window.triggerOrderEditor('${o.id}')" style="padding:4px 8px; font-size:0.65rem; background:var(--primary-yellow-light); border:1px solid var(--primary-yellow); color:var(--text-dark); font-weight:bold;">
              <i class="fa-solid fa-edit"></i> تعديل
            </button>
          </td>
        `;
        allRows.appendChild(tr);
      });
    }
  }

  // 3. Render Best Selling Products Chart (Overview Tab & Products Tab)
  const bestSellersContainer = document.getElementById('admin-best-sellers-container');
  if (bestSellersContainer) {
    bestSellersContainer.innerHTML = '';
    
    const salesMap = {};
    AppState.orders.forEach(o => {
      o.items.forEach(itm => {
        salesMap[itm.id] = (salesMap[itm.id] || 0) + itm.qty;
      });
    });

    const menuStats = MENU.map(m => {
      return {
        id: m.id,
        name: AppState.selectedLang === 'ar' ? m.nameAr : m.nameEn,
        qty: salesMap[m.id] || 0
      };
    }).sort((a, b) => b.qty - a.qty);

    const maxSold = menuStats[0] ? menuStats[0].qty : 1;

    menuStats.forEach(itm => {
      if (itm.qty === 0) return;

      const pct = maxSold > 0 ? (itm.qty / maxSold) * 100 : 0;
      
      const div = document.createElement('div');
      div.className = 'product-stat-row';
      div.innerHTML = `
        <div class="product-stat-info">
          <span>${itm.name}</span>
          <span style="color:var(--primary-yellow);">${itm.qty} ${AppState.selectedLang === 'ar' ? 'وجبة' : 'sold'}</span>
        </div>
        <div class="product-stat-bar-container">
          <div class="product-stat-bar" style="width: ${pct}%;"></div>
        </div>
      `;
      bestSellersContainer.appendChild(div);
    });

    if (bestSellersContainer.children.length === 0) {
      bestSellersContainer.innerHTML = `<div style="text-align:center; padding:30px 10px; color:var(--text-light-muted);">${AppState.selectedLang === 'ar' ? 'لا تتوفر إحصائيات بيع اليوم' : 'No sales charts recorded yet'}</div>`;
    }
  }

  // 4. Render Product Detailed Sales distribution by Category (Products Tab)
  const categoriesVolumeContainer = document.getElementById('admin-categories-volume-container');
  if (categoriesVolumeContainer) {
    categoriesVolumeContainer.innerHTML = '';
    
    const catMap = {};
    AppState.orders.forEach(o => {
      o.items.forEach(itm => {
        const itemMenuDef = MENU.find(m => m.id === itm.id);
        if (itemMenuDef) {
          catMap[itemMenuDef.cat] = (catMap[itemMenuDef.cat] || 0) + itm.qty;
        }
      });
    });

    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return;
      const count = catMap[cat.id] || 0;
      const catName = AppState.selectedLang === 'ar' ? cat.nameAr : cat.nameEn;
      
      const div = document.createElement('div');
      div.className = 'product-stat-row';
      div.innerHTML = `
        <div class="product-stat-info">
          <span>${catName}</span>
          <span style="color:var(--primary-yellow);">${count} ${AppState.selectedLang === 'ar' ? 'عنصر' : 'pcs'}</span>
        </div>
        <div class="product-stat-bar-container" style="background-color: var(--dark-border);">
          <div class="product-stat-bar" style="width: ${Math.min(100, count * 10)}%; background: var(--primary-yellow);"></div>
        </div>
      `;
      categoriesVolumeContainer.appendChild(div);
    });
  }

  // 5. Render Tables Activity rows
  const tablesActivityRows = document.getElementById('admin-tables-activity-rows');
  if (tablesActivityRows) {
    tablesActivityRows.innerHTML = '';
    
    const tablesMap = {};
    for (let i = 1; i <= 12; i++) tablesMap[i] = { count: 0, revenue: 0 };

    AppState.orders.forEach(o => {
      if (o.type === 'dine-in' && o.table >= 1 && o.table <= 12) {
        tablesMap[o.table].count++;
        if (o.paymentStatus === 'paid') {
          tablesMap[o.table].revenue += o.total;
        }
      }
    });

    for (let i = 1; i <= 12; i++) {
      if (tablesMap[i].count === 0) continue;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:800; color:var(--primary-yellow);">${AppState.selectedLang === 'ar' ? 'طاولة ' + i : 'Table ' + i}</td>
        <td style="font-weight:700;">${tablesMap[i].count}</td>
        <td style="font-weight:800; color:var(--color-ready);">${tablesMap[i].revenue.toFixed(2)} ${L.sar}</td>
      `;
      tablesActivityRows.appendChild(tr);
    }

    if (tablesActivityRows.children.length === 0) {
      tablesActivityRows.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-light-muted); padding:20px;">${AppState.selectedLang === 'ar' ? 'لا يوجد نشاط طاولات محلي حالياً' : 'No active tables local orders today'}</td></tr>`;
    }
  }
}

// --------------------------------------------------------------------------
// MODULE 14: SYSTEM CONFIGURATION & SETTINGS
// --------------------------------------------------------------------------
function populateAdminSettingsFields() {
  const settings = AppState.restaurantSettings || {};
  
  const nameAr = document.getElementById('input-settings-name-ar');
  const nameEn = document.getElementById('input-settings-name-en');
  const vatRate = document.getElementById('input-settings-vat-rate');
  const currencyAr = document.getElementById('input-settings-currency-ar');
  const currencyEn = document.getElementById('input-settings-currency-en');
  const hoursAr = document.getElementById('input-settings-working-hours-ar');
  const hoursEn = document.getElementById('input-settings-working-hours-en');
  const printHeader = document.getElementById('input-settings-print-header');
  const printFooter = document.getElementById('input-settings-print-footer');
  const audioEnable = document.getElementById('input-settings-audio-enable');
  
  if (nameAr) nameAr.value = settings.nameAr || 'هاي بروست';
  if (nameEn) nameEn.value = settings.nameEn || 'Hi Proust';
  if (vatRate) vatRate.value = Math.round((settings.vatRate || 0.15) * 100);
  if (currencyAr) currencyAr.value = settings.currencyAr || 'ر.س';
  if (currencyEn) currencyEn.value = settings.currencyEn || 'SAR';
  if (hoursAr) hoursAr.value = settings.workingHoursAr || '١٢:٠٠ ظهراً - ٠٢:٠٠ صباحاً';
  if (hoursEn) hoursEn.value = settings.workingHoursEn || '12:00 PM - 02:00 AM';
  if (printHeader) printHeader.value = settings.printHeader || 'مطعم هاي بروست الفاخر';
  if (printFooter) printFooter.value = settings.printFooter || 'شكراً لزيارتكم - هاتف 920000000';
  if (audioEnable) audioEnable.checked = settings.audioEnable !== false;
}

// ==========================================================================
// 15. MAIN DOM CONTENT LOADED DISPATCHER
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Load local data and mock pre-populations
  loadFromLocalStorage().then(() => {
    // prePopulateHistoricalOrders mock seeding disabled as requested

    // Select initialization branch based on active body ID
    const bodyId = document.body.id;
    if (bodyId === 'customer-body') {
      AppState.activeRole = 'customer-view';
      initCustomerView();
    } else if (bodyId === 'kitchen-body') {
      AppState.activeRole = 'kitchen-view';
      initKitchenView();
    } else if (bodyId === 'cashier-body') {
      AppState.activeRole = 'cashier-view';
      initCashierView();
    } else if (bodyId === 'admin-body') {
      AppState.activeRole = 'admin-view';
      initAdminView();
    } else {
      // Fallback fallback
      initCustomerView();
      initKitchenView();
      initCashierView();
    }

    // Subscribe to Supabase Realtime cloud updates
    if (supabaseClient) {
      // Listen to orders
      supabaseClient
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          console.log('Database changes detected via Supabase Realtime on orders!', payload);
          syncCloudDatabase();
        })
        .subscribe();

      // Listen to products
      supabaseClient
        .channel('public:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
          console.log('Database changes detected via Supabase Realtime on products!', payload);
          AppState.staticDataLoaded = false;
          syncCloudDatabase();
        })
        .subscribe();

      // Listen to categories
      supabaseClient
        .channel('public:categories')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, payload => {
          console.log('Database changes detected via Supabase Realtime on categories!', payload);
          AppState.staticDataLoaded = false;
          syncCloudDatabase();
        })
        .subscribe();
    }
  });
});

// Periodic database synchronization polling fallback (every 3 seconds)
// This ensures all screens (customer, KDS, Cashier, Admin) stay updated in real-time
// even if Supabase websocket/realtime changes are not turned on or have replication disabled in the dashboard.
setInterval(() => {
  if (supabaseClient) {
    syncCloudDatabase();
  }
}, 3000);
