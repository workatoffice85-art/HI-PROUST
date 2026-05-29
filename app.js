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
  phoneNumber: '',
  customerName: '',
  cart: [], // Array of { id, qty }
  cartNotes: '',
  deliveryType: 'dine-in', // 'dine-in' | 'takeaway'
  activeOrderId: null, // Order currently being tracked by this phone instance

  // Unified Live Queue of Orders
  orders: [],
  
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

  // Cloud Database Integration (Supabase)
  if (supabaseClient) {
    if (!AppState.staticDataLoaded) {
      // 0. Fetch Settings
      try {
        const { data: setVal } = await supabaseClient
          .from('settings')
          .select('*')
          .eq('key', 'total_tables')
          .single();
        if (setVal && setVal.value) {
          AppState.totalTables = parseInt(setVal.value) || 12;
        }
      } catch (err) {
        console.warn("Supabase settings fetch error (ignoring migration fallback):", err);
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
          MENU = prodData.map(p => ({
            id: p.id,
            cat: p.category_id,
            nameAr: p.name_ar,
            nameEn: p.name_en,
            descAr: p.description_ar || '',
            descEn: p.description_en || '',
            price: Number(p.price),
            spicy: p.is_spicy,
            bestSeller: p.is_bestseller,
            svg: p.image_url || '',
            imageUrl: p.image_url || null
          }));
        }
      } catch (err) {
        console.warn("Supabase products fetch error:", err);
      }

      AppState.staticDataLoaded = true;
    }

    // C. Fetch Orders
    try {
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (data) {
        AppState.orders = data.map(o => ({
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
          auditLog: typeof o.audit_log === 'string' ? JSON.parse(o.audit_log) : (o.audit_log || []),
          timestamp: new Date(o.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          elapsedSeconds: Math.floor((Date.now() - new Date(o.created_at).getTime()) / 1000)
        }));
        
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
  document.getElementById('txt-title-type').innerText = L.titleType;
  document.getElementById('txt-prompt-type').innerText = L.promptType;
  document.getElementById('txt-desc-type').innerText = L.descType;
  document.getElementById('txt-type-dine-title').innerText = L.typeDineTitle;
  document.getElementById('txt-type-dine-desc').innerText = L.typeDineDesc;
  document.getElementById('txt-type-take-title').innerText = L.typeTakeTitle;
  document.getElementById('txt-type-take-desc').innerText = L.typeTakeDesc;
  document.getElementById('txt-place-order-btn').innerText = L.btnPlaceOrder;

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
    disp.innerText = AppState.selectedLang === 'ar' ? "05XXXXXXXX" : "05XXXXXXXX";
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
  } else if (currentPhoneDigits.length < 10) {
    // Only accept numeric inputs starting with 05
    if (currentPhoneDigits.length === 0 && val !== "0") return;
    if (currentPhoneDigits.length === 1 && val !== "5") return;
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
function triggerPlaceOrder() {
  if (AppState.cart.length === 0) return;

  const L = TRANSLATIONS[AppState.selectedLang];

  // Calculate prices
  let subtotal = 0;
  AppState.cart.forEach(c => {
    const item = MENU.find(m => m.id === c.id);
    subtotal += (item.price * c.qty);
  });
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  // Generate unique order ID (e.g. A102)
  const orderIdNum = AppState.orders.length > 0 ? parseInt(AppState.orders[AppState.orders.length - 1].id.slice(1)) + 1 : 101;
  const orderId = "A" + orderIdNum;

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

  // Create new order record
  const newOrder = {
    id: orderId,
    table: AppState.selectedTable,
    name: AppState.customerName || (AppState.selectedLang === 'ar' ? "عميل طاولة " : "Guest Table ") + AppState.selectedTable,
    phone: AppState.phoneNumber || "0500000000",
    items: orderItems,
    subtotal: subtotal,
    tax: tax,
    total: total,
    notes: notes,
    type: AppState.deliveryType,
    status: 'new', // 'new' | 'preparing' | 'ready' | 'completed'
    paymentStatus: 'unpaid', // 'unpaid' | 'paid'
    paymentMethod: null,
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    elapsedSeconds: 0
  };

  // Add order to unified state
  AppState.orders.push(newOrder);
  AppState.activeOrderId = orderId;
  saveToLocalStorage();

  // Cloud Sync (Supabase Insert)
  if (supabaseClient) {
    supabaseClient.from('orders').insert({
      id: newOrder.id,
      table_number: newOrder.table,
      customer_name: newOrder.name,
      phone_number: newOrder.phone,
      items: newOrder.items,
      subtotal: newOrder.subtotal,
      tax: newOrder.tax,
      total: newOrder.total,
      notes: newOrder.notes,
      delivery_type: newOrder.type,
      status: newOrder.status,
      payment_status: newOrder.paymentStatus,
      payment_method: newOrder.paymentMethod
    }).then(res => {
      console.log('Order persisted to Supabase:', res);
    });
  }

  // Play audio alert
  AudioSynthesizer.playNewOrderChime();

  // Trigger Toast Notification
  showToastNotification(
    AppState.selectedLang === 'ar' 
      ? `تم إرسال طلبك بنجاح! رقم الطلب: ${orderId}` 
      : `Order Placed Successfully! ID: ${orderId}`, 
    'new'
  );

  // Clean active customer cart
  AppState.cart = [];
  document.getElementById('cart-notes').value = '';
  
  // Update Live Tracking UI in Mobile View
  updateLiveTrackingUI(newOrder);
  switchMobileScreen('mobile-tracking');

  // Trigger reactive renders on the KDS and Cashier views!
  renderKDSBoard();
  renderCashierOrdersTable();
  updateCashierMetrics();
}

function updateLiveTrackingUI(order) {
  if (!order) return;

  const L = TRANSLATIONS[AppState.selectedLang];

  // Set Order ID
  document.getElementById('track-order-id').innerText = order.id;

  // Timeline Step Status Adjustments
  const stepPlaced = document.getElementById('track-step-placed');
  const stepCook = document.getElementById('track-step-cooking');
  const stepReady = document.getElementById('track-step-ready');
  const stepDone = document.getElementById('track-step-done');

  // Reset steps
  [stepPlaced, stepCook, stepReady, stepDone].forEach(st => st.className = 'tracking-step');

  // Set Success circle icon
  const successBadge = document.getElementById('tracking-success-badge');

  if (order.status === 'new') {
    stepPlaced.classList.add('active');
    successBadge.innerHTML = `<i class="fa-solid fa-receipt"></i>`;
    successBadge.style.backgroundColor = 'var(--color-completed)';
    if (order.paymentStatus !== 'paid') {
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
  } else if (order.status === 'completed') {
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

  stackNew.innerHTML = '';
  stackPrep.innerHTML = '';
  stackReady.innerHTML = '';

  let countNew = 0;
  let countPrep = 0;
  let countReady = 0;

  AppState.orders.forEach(order => {
    if (order.status === 'completed') return; // Completed orders are archived from the KDS board
    
    // New Workflow Constraint: Orders MUST be approved/paid by cashier before reaching the kitchen!
    if (order.paymentStatus !== 'paid') return;

    const card = document.createElement('div');
    card.className = `kds-card ${order.status}-order`;

    // Metainfo (Table vs Takeaway)
    const typeLabel = order.type === 'dine-in' 
      ? (AppState.selectedLang === 'ar' ? `محلي - طاولة ${order.table}` : `Dine-in - Table ${order.table}`)
      : (AppState.selectedLang === 'ar' ? 'سفري - كرتون' : 'Takeaway - Box');

    const paymentLabel = order.paymentStatus === 'paid'
      ? `<span class="badge-pay paid" style="font-size: 0.65rem;">${AppState.selectedLang === 'ar' ? 'مدفوع' : 'Paid'}</span>`
      : `<span class="badge-pay unpaid" style="font-size: 0.65rem;">${AppState.selectedLang === 'ar' ? 'غير مدفوع' : 'Unpaid'}</span>`;

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
    if (order.status === 'new') {
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
    if (order.status === 'new') {
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
  document.getElementById('kds-count-new').innerText = countNew;
  document.getElementById('kds-count-prep').innerText = countPrep;
  document.getElementById('kds-count-ready').innerText = countReady;

  document.getElementById('kds-col-new-count').innerText = countNew;
  document.getElementById('kds-col-prep-count').innerText = countPrep;
  document.getElementById('kds-col-ready-count').innerText = countReady;
}

function advanceOrderStatus(orderId) {
  const order = AppState.orders.find(o => o.id === orderId);
  if (!order) return;

  const staffName = AppState.loggedStaff 
    ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
    : (AppState.selectedLang === 'ar' ? 'النظام' : 'System');

  if (order.status === 'new') {
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
    order.status = 'completed';
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
    if (order.status !== 'completed') {
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
}

function processCashierPayment() {
  if (!selectedOrderForCheckout) return;

  selectedOrderForCheckout.paymentStatus = 'paid';
  selectedOrderForCheckout.paymentMethod = selectedPaymentMethod;
  
  const staffName = AppState.loggedStaff 
    ? (AppState.selectedLang === 'ar' ? AppState.loggedStaff.name : AppState.loggedStaff.nameEn)
    : (AppState.selectedLang === 'ar' ? 'الكاشير' : 'Cashier');
  
  if (typeof addAuditLog === 'function') {
    addAuditLog(selectedOrderForCheckout, AppState.selectedLang === 'ar' ? `تحصيل الفاتورة بواسطة ${staffName}` : `Payment collected by ${staffName}`);
  }

  saveToLocalStorage();

  // Cloud Sync (Supabase Payment Update)
  if (supabaseClient) {
    supabaseClient
      .from('orders')
      .update({ 
        payment_status: selectedOrderForCheckout.paymentStatus, 
        payment_method: selectedOrderForCheckout.paymentMethod,
        audit_log: selectedOrderForCheckout.auditLog || []
      })
      .eq('id', selectedOrderForCheckout.id)
      .then(res => {
        if (res.error) {
          console.error('Payment update failed in Supabase:', res.error);
          showToastNotification(
            AppState.selectedLang === 'ar' 
              ? 'خطأ: لم يتم التحديث سحابياً! يرجى تشغيل كود ALTER في Supabase لإضافة عمود audit_log.' 
              : 'Error: Cloud update failed! Please run ALTER code in Supabase to add audit_log column.',
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
  const phones = ["0551234567", "0549876543", "0561112223", "0504445556", "0537778889", "0559990001"];
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
  if (AppState.orders.length > 0) return; // avoid duplicate seed populations

  // Seed 1: A Paid & Completed Dine-in Order
  AppState.orders.push({
    id: "A098",
    table: 4,
    name: "أحمد بن فهد",
    phone: "0558877665",
    items: [
      { id: "br-01", nameAr: "هاي بروستد عادي (٤ قطع)", nameEn: "Hi Broast Normal (4 Pcs)", qty: 2, price: 24.00 },
      { id: "sd-01", nameAr: "بطاطس مقلية ذهبية سوبر", nameEn: "Golden French Fries Super", qty: 1, price: 7.00 },
      { id: "bv-01", nameAr: "بيبسي بارد ومنعش", nameEn: "Pepsi Cold & Refreshing", qty: 2, price: 4.00 }
    ],
    subtotal: 63.00,
    tax: 9.45,
    total: 72.45,
    notes: "بدون ثومية",
    type: "dine-in",
    status: "completed",
    paymentStatus: "paid",
    paymentMethod: "mada",
    timestamp: "09:12 م",
    elapsedSeconds: 450
  });

  // Seed 2: An Unpaid Preparing Takeaway Order
  AppState.orders.push({
    id: "A099",
    table: 1,
    name: "منيرة السديري",
    phone: "0543322110",
    items: [
      { id: "bg-01", nameAr: "ساندوتش دجاج كريسبي ميجا", nameEn: "Mighty Crispy Chicken Burger", qty: 1, price: 18.00 },
      { id: "rc-01", nameAr: "أرز ريزو مع قطع ستربس مقرمشة", nameEn: "Rizo Rice with Strips", qty: 1, price: 15.00 },
      { id: "bv-02", nameAr: "ماء نقي ومبرد", nameEn: "Pure Cold Water", qty: 1, price: 2.00 }
    ],
    subtotal: 35.00,
    tax: 5.25,
    total: 40.25,
    notes: "",
    type: "takeaway",
    status: "preparing",
    paymentStatus: "paid",
    paymentMethod: "mada",
    timestamp: "09:48 م",
    elapsedSeconds: 110
  });

  // Seed 3: An Unpaid New Dine-in Order
  AppState.orders.push({
    id: "A100",
    table: 6,
    name: "سلطان العجمي",
    phone: "0565544332",
    items: [
      { id: "bk-01", nameAr: "وجبة عائلية سوبر (٨ قطع)", nameEn: "Super Family Bucket (8 Pcs)", qty: 1, price: 48.00 },
      { id: "sd-02", nameAr: "علبة ثومية هاي بروست إضافية", nameEn: "Extra Special Garlic Dip", qty: 2, price: 3.00 }
    ],
    subtotal: 54.00,
    tax: 8.10,
    total: 62.10,
    notes: "زيادة خبز كايزر",
    type: "dine-in",
    status: "new",
    paymentStatus: "unpaid",
    paymentMethod: null,
    timestamp: "09:55 م",
    elapsedSeconds: 22
  });

  saveToLocalStorage();
}

// ==========================================================================
// 13.5 CUSTOMER PROFILE & LOYALTY RENDERER
// ==========================================================================
function renderCustomerProfileScreen() {
  const nameLabel = document.getElementById('profile-user-name');
  const phoneLabel = document.getElementById('profile-user-phone');
  const historyContainer = document.getElementById('profile-orders-history');
  
  nameLabel.innerText = AppState.customerName || (AppState.selectedLang === 'ar' ? "عميل مميز" : "Valued Customer");
  phoneLabel.innerText = AppState.phoneNumber || "05XXXXXXXX";

  // Calculate order metrics & loyalty progress
  const customerOrders = AppState.orders.filter(o => o.phone === AppState.phoneNumber);
  const completedOrdersCount = customerOrders.filter(o => o.status === 'completed' || o.paymentStatus === 'paid').length;
  
  // Loyalty progress rules: completed orders count modulo 5
  const currentProgress = completedOrdersCount % 5;
  const progressPercent = (currentProgress / 5) * 100;
  
  document.getElementById('profile-loyalty-bar').style.width = `${progressPercent}%`;
  document.getElementById('profile-loyalty-percent').innerText = `${progressPercent}%`;
  
  const countLabel = AppState.selectedLang === 'ar' 
    ? `الطلبات الحالية: ${currentProgress} / 5` 
    : `Current orders: ${currentProgress} / 5`;
  document.getElementById('profile-loyalty-count').innerText = countLabel;

  // Set Loyalty level title based on order count
  const tierBadge = document.getElementById('profile-loyalty-tier');
  if (completedOrdersCount >= 10) {
    tierBadge.innerText = AppState.selectedLang === 'ar' ? 'الطبقة الماسية 💎' : 'Diamond Tier 💎';
    tierBadge.style.backgroundColor = '#E2E8F0';
    tierBadge.style.color = '#1E293B';
  } else if (completedOrdersCount >= 5) {
    tierBadge.innerText = AppState.selectedLang === 'ar' ? 'الطبقة البلاتينية 👑' : 'Platinum Tier 👑';
    tierBadge.style.backgroundColor = '#1E293B';
    tierBadge.style.color = '#F1F5F9';
  } else {
    tierBadge.innerText = AppState.selectedLang === 'ar' ? 'الطبقة الذهبية 🌟' : 'Gold Tier 🌟';
    tierBadge.style.backgroundColor = '#121214';
    tierBadge.style.color = '#FFC107';
  }

  // Render Past Orders
  historyContainer.innerHTML = '';
  const L = TRANSLATIONS[AppState.selectedLang];

  if (customerOrders.length === 0) {
    historyContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 30px 10px; background-color: #fff; border-radius: 12px; border: 1px dashed var(--light-border); width: 100%;">
        <i class="fa-solid fa-clock-rotate-left" style="font-size: 2rem; color: var(--light-border); margin-bottom: 8px;"></i>
        <p style="font-size: 0.75rem;">${AppState.selectedLang === 'ar' ? 'لا يوجد لديك طلبات سابقة بعد!' : 'No past orders registered yet!'}</p>
      </div>
    `;
    return;
  }

  // Render reverse history
  customerOrders.slice().reverse().forEach(o => {
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

    const itemsSummary = o.items.map(itm => {
      const name = AppState.selectedLang === 'ar' ? itm.nameAr : itm.nameEn;
      return `${itm.qty}x ${name}`;
    }).join(' ، ');

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--light-border); padding-bottom: 6px; direction: ltr;">
        <span style="font-weight: 800; color: var(--primary-red); font-size: 0.8rem;">${o.id}</span>
        <span style="font-size: 0.7rem; color: var(--text-muted);">${o.timestamp}</span>
      </div>
      <p style="font-size: 0.7rem; color: var(--text-dark); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; margin-top: 4px;"><strong>الوجبات:</strong> ${itemsSummary}</p>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; direction: ltr;">
        <span style="font-weight: 800; font-size: 0.85rem; color: var(--primary-red);">${o.total.toFixed(2)} ${L.sar}</span>
        <button class="btn-reorder" data-id="${o.id}" style="background-color: var(--primary-yellow); border: none; color: #121214; font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 4px; direction: rtl;">
          <i class="fa-solid fa-rotate-left"></i>
          <span>${AppState.selectedLang === 'ar' ? 'إعادة طلب' : 'Reorder'}</span>
        </button>
      </div>
    `;
    historyContainer.appendChild(card);
  });

  // Attach Reorder action buttons
  historyContainer.querySelectorAll('.btn-reorder').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      const orderId = btn.getAttribute('data-id');
      const targetOrder = AppState.orders.find(o => o.id === orderId);
      if (targetOrder) {
        // Clear current active cart
        AppState.cart = [];
        // Add items back into cart
        targetOrder.items.forEach(itm => {
          AppState.cart.push({
            id: itm.id,
            qty: itm.qty
          });
        });
        
        // Show success notification and direct route to cart!
        showToastNotification(
          AppState.selectedLang === 'ar'
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
        <td style="font-weight: 700; color: #fff;">${cat.nameAr} <span style="color: var(--text-light-muted); font-weight: normal; font-size: 0.75rem;">/ ${cat.nameEn}</span></td>
        <td style="text-align: center;">
          <button class="sim-btn delete-cat-btn" data-id="${cat.id}" style="background-color: rgba(239, 68, 68, 0.1); border-color: var(--color-new); color: var(--color-new); padding: 4px 8px; font-size: 0.7rem;">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      categoriesListBody.appendChild(tr);
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
            <div class="admin-product-card" style="display: flex; gap: 12px; background-color: #18181C; border: 1px solid var(--dark-border); border-radius: 10px; padding: 12px; position: relative;">
              ${badgeHtml}
              <div style="width: 70px; height: 70px; border-radius: 8px; background-color: #111113; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative;">
                ${imageHtml}
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; text-align: right;">
                <div>
                  <h5 style="font-size: 0.85rem; font-weight: bold; color: #fff; margin-bottom: 2px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; padding-left: 55px;">${title}</h5>
                  <p style="font-size: 0.7rem; color: var(--text-light-muted); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3;">${desc}</p>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; direction: ltr;">
                  <div style="font-weight: 800; color: var(--primary-yellow); font-size: 0.85rem;">${p.price.toFixed(2)} <span style="font-size: 0.65rem;">SAR</span></div>
                  <div style="display: flex; gap: 8px;">
                    <button class="sim-btn edit-product-btn" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.7rem;"><i class="fa-solid fa-pen-to-square"></i> تعديل</button>
                    <button class="sim-btn delete-product-btn" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.7rem; background-color: rgba(239, 68, 68, 0.1); border-color: var(--color-new); color: var(--color-new);"><i class="fa-solid fa-trash"></i></button>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
        productsHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">${cardsHtml}</div>`;
      }

      groupDiv.innerHTML = `
        <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary-yellow); margin-bottom: 12px; border-bottom: 1px dashed var(--dark-border); padding-bottom: 8px; text-align: right;">
          <i class="fa-solid fa-folder-open"></i> ${cat.nameAr} / ${cat.nameEn}
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
      if (btn.classList.contains('delete') || btn.querySelector('i')) {
        handleKeypadPress('del');
      } else if (char !== "") {
        handleKeypadPress(char);
      }
    });
  });

  // Keypad Confirm
  const btnPhoneSubmit = document.getElementById('btn-phone-submit');
  if (btnPhoneSubmit) {
    btnPhoneSubmit.addEventListener('click', () => {
      if (currentPhoneDigits.length < 10) {
        AudioSynthesizer.playBeep();
        showToastNotification(
          AppState.selectedLang === 'ar'
            ? "الرجاء إدخال رقم جوال سعودي صحيح مكون من ١٠ أرقام!"
            : "Please enter a valid 10-digit mobile number!",
          'new'
        );
        return;
      }
      AppState.phoneNumber = currentPhoneDigits;

      // Check if user exists in orders history
      const pastOrder = AppState.orders.find(o => o.phone === currentPhoneDigits);
      if (pastOrder) {
        AppState.customerName = pastOrder.name;
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
    });
  }

  // Name submit
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

  // New Order flow reset
  const btnNewOrder = document.getElementById('btn-track-new-order');
  if (btnNewOrder) {
    btnNewOrder.addEventListener('click', () => {
      AudioSynthesizer.playBeep();
      AppState.activeOrderId = null;
      AppState.customerName = "";
      AppState.phoneNumber = "";
      currentPhoneDigits = "";
      document.getElementById('name-input').value = "";
      renderPhoneDisplay();
      checkTableQRParam();
      saveToLocalStorage();
      switchMobileScreen('mobile-splash');
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

  // Restore tracking session if there is a live active order being tracked
  if (AppState.activeOrderId) {
    const activeOrder = AppState.orders.find(o => o.id === AppState.activeOrderId);
    if (activeOrder && activeOrder.status !== 'completed') {
      updateLiveTrackingUI(activeOrder);
      switchMobileScreen('mobile-tracking');
      showToastNotification(
        AppState.selectedLang === 'ar' ? "تم استعادة جلسة تتبع طلبك النشط!" : "Active tracking session restored!",
        'ready'
      );
    } else {
      AppState.activeOrderId = null;
      saveToLocalStorage();
    }
  } else if (AppState.phoneNumber && AppState.customerName) {
    // Restore current phone digits cache for profile editing
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

      const targetPanelId = item.getAttribute('data-target');
      document.querySelectorAll('.admin-tab-panel').forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetPanelId) {
          panel.classList.add('active');
        }
      });
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
      document.getElementById('edit-cat-id').value = '';
      document.getElementById('edit-cat-name-ar').value = '';
      document.getElementById('edit-cat-name-en').value = '';
      const catModal = document.getElementById('modal-category-editor');
      catModal.style.display = 'flex';
      catModal.classList.add('active');
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
      showToastNotification(
        AppState.selectedLang === 'ar' ? 'تمت إضافة قسم المنيو الجديد بنجاح!' : 'Category added successfully!',
        'ready'
      );
      renderAdminMenuManage();
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
  takeawayCard.style.padding = '16px';
  takeawayCard.style.backgroundColor = '#18181C';
  takeawayCard.style.border = '2px solid #0284C7'; // Blue border for takeaway

  takeawayCard.innerHTML = `
    <div style="font-weight: 800; font-size: 0.95rem; color: #0284C7;"><i class="fa-solid fa-bag-shopping"></i> طلب سفري / Takeaway</div>
    <div style="background-color: #fff; padding: 10px; border-radius: 12px; display: inline-block;">
      <img src="${takeawayQrApi}" alt="Takeaway QR" style="width: 130px; height: 130px; display: block;">
    </div>
    <div style="font-size: 0.65rem; color: var(--text-light-muted); line-height: 1.4; word-break: break-all; max-width: 150px;">
      ${takeawayUrl}
    </div>
    <a href="${takeawayQrApi}" target="_blank" download="takeaway_qr.png" class="sim-btn" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none; display: inline-block; background-color: rgba(2, 132, 199, 0.15); border-color: #0284C7; color: #0284C7;">
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
    card.style.backgroundColor = '#18181C';
    card.style.border = '1px solid var(--dark-border)';

    card.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; color: var(--primary-yellow);"><i class="fa-solid fa-chair"></i> طاولة ${i} / Table ${i}</div>
      <div style="background-color: #fff; padding: 10px; border-radius: 12px; display: inline-block;">
        <img src="${tableQrApi}" alt="Table ${i} QR" style="width: 130px; height: 130px; display: block;">
      </div>
      <div style="font-size: 0.65rem; color: var(--text-light-muted); line-height: 1.4; word-break: break-all; max-width: 150px;">
        ${tableUrl}
      </div>
      <a href="${tableQrApi}" target="_blank" download="table_${i}_qr.png" class="sim-btn" style="padding: 6px 12px; font-size: 0.75rem; text-decoration: none; display: inline-block;">
        <i class="fa-solid fa-print"></i> طباعة / تحميل
      </a>
    `;
    qrGrid.appendChild(card);
  }
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

// ==========================================================================
// 15. MAIN DOM CONTENT LOADED DISPATCHER
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Load local data and mock pre-populations
  loadFromLocalStorage().then(() => {
    prePopulateHistoricalOrders();

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
      supabaseClient
        .channel('public:orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
          console.log('Database changes detected via Supabase Realtime!', payload);
          loadFromLocalStorage();
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
    loadFromLocalStorage();
  }
}, 3000);
