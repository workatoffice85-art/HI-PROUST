const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(filePath, 'utf8');

const target = '  <!-- TOAST ALERTS WRAPPER -->';
const modalHtml = `  <!-- ==========================================================================
       MODAL: INTERACTIVE TABLE ACTIONS
       ========================================================================== -->
  <div class="receipt-overlay" id="modal-table-actions" style="display: none; justify-content: center; align-items: center; z-index: 99999;">
    <div class="receipt-modal" style="max-width: 480px; width: 92%; background: var(--light-card); border: 3px solid var(--primary-yellow); border-radius: 24px; padding: 24px; box-shadow: 0 25px 60px rgba(0,0,0,0.4); direction: rtl; text-align: right;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--dark-border); padding-bottom: 12px; margin-bottom: 20px;">
        <h3 style="color: var(--primary-red); font-weight: 800; font-size: 1.2rem;"><i class="fa-solid fa-chair" style="color: var(--primary-yellow); margin-left: 8px;"></i>خيارات التحكم بالطاولة: <span id="table-action-num-display" style="color: var(--primary-yellow);"></span></h3>
        <button onclick="window.closeTableActionsModal()" style="background: none; border: none; color: var(--text-light-muted); font-size: 1.4rem; cursor: pointer;"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div id="table-action-status-alert" style="margin-bottom: 20px; padding: 12px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; text-align: center;">
        <!-- Status description -->
      </div>

      <!-- Grid of Premium Actions -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 10px;">
        <button class="sim-btn" onclick="window.handleTableModalAction('transfer')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 10px; border-radius: 16px; background-color: rgba(59, 130, 246, 0.08); border-color: rgba(59, 130, 246, 0.25); color: #3B82F6; font-weight: bold; font-size: 0.8rem; cursor: pointer;">
          <i class="fa-solid fa-arrow-right-arrow-left" style="font-size: 1.4rem;"></i>
          <span>نقل الطلب لطاولة أخرى</span>
        </button>

        <button class="sim-btn" onclick="window.handleTableModalAction('qr')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 10px; border-radius: 16px; background-color: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.25); color: #10B981; font-weight: bold; font-size: 0.8rem; cursor: pointer;">
          <i class="fa-solid fa-qrcode" style="font-size: 1.4rem;"></i>
          <span>عرض رابط ورمز الـ QR</span>
        </button>

        <button class="sim-btn" onclick="window.handleTableModalAction('rename')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 10px; border-radius: 16px; background-color: rgba(255, 193, 7, 0.08); border-color: rgba(255, 193, 7, 0.25); color: var(--primary-yellow-hover); font-weight: bold; font-size: 0.8rem; cursor: pointer;">
          <i class="fa-solid fa-pen-to-square" style="font-size: 1.4rem;"></i>
          <span>تعديل مسمى الطاولة</span>
        </button>

        <button class="sim-btn" onclick="window.handleTableModalAction('merge')" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 10px; border-radius: 16px; background-color: rgba(139, 92, 246, 0.08); border-color: rgba(139, 92, 246, 0.25); color: #8B5CF6; font-weight: bold; font-size: 0.8rem; cursor: pointer;">
          <i class="fa-solid fa-code-merge" style="font-size: 1.4rem;"></i>
          <span>دمج مع طاولة أخرى</span>
        </button>

        <button id="btn-table-action-checkout" class="sim-btn" onclick="window.handleTableModalAction('checkout')" style="grid-column: span 2; display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 10px; padding: 14px; border-radius: 16px; background: linear-gradient(135deg, var(--color-ready) 0%, #059669 100%); border-color: rgba(255,255,255,0.05); color: #fff; font-weight: bold; font-size: 0.85rem; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.25);">
          <i class="fa-solid fa-file-invoice-dollar" style="font-size: 1.2rem;"></i>
          <span>تحصيل الحساب ودفع الفاتورة بالكاشير</span>
        </button>

        <button class="sim-btn" onclick="window.handleTableModalAction('delete')" style="grid-column: span 2; display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 10px; padding: 12px; border-radius: 16px; background-color: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.25); color: var(--primary-red); font-weight: bold; font-size: 0.8rem; cursor: pointer; margin-top: 6px;">
          <i class="fa-solid fa-trash-can" style="font-size: 1rem;"></i>
          <span>حذف وإزالة الطاولة بالكامل من النظام</span>
        </button>
      </div>
    </div>
  </div>

`;

if (content.includes(target)) {
  content = content.replace(target, modalHtml + '\n' + target);
  console.log("Modal HTML appended successfully!");
} else {
  // Try normalized line endings
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedTarget)) {
    content = normalizedContent.replace(normalizedTarget, modalHtml + '\n' + normalizedTarget);
    console.log("Modal HTML appended successfully (normalized line endings)!");
  } else {
    console.error("Target placeholder '<!-- TOAST ALERTS WRAPPER -->' not found!");
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("admin.html updated successfully!");
