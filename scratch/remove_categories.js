const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'admin.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove sidebar menu item
const menuTarget = `<div class="admin-menu-item" data-target="panel-categories">\\s*<i class="fa-solid fa-folder-tree"></i>\\s*<span>Categories</span>\\s*</div>`;
const menuRegex = new RegExp(menuTarget, 'g');
content = content.replace(menuRegex, '');

// 2. Remove panel-categories tab panel
const panelTarget = `<!-- ==========================================================================\\s*TAB PANEL: CATEGORIES MANAGEMENT\\s*========================================================================== -->\\s*<div class="admin-tab-panel" id="panel-categories">[\\s\\S]*?</div>\\s*</div>\\s*</div>`;
const panelRegex = new RegExp(panelTarget, 'g');

// Let's do a direct exact string match instead of complex regex to be 100% safe
const exactPanelString = `      <!-- ==========================================================================
           TAB PANEL: CATEGORIES MANAGEMENT
           ========================================================================== -->
      <div class="admin-tab-panel" id="panel-categories">
        <div class="admin-card" style="max-width: 800px;">
          <div class="admin-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3><i class="fa-solid fa-folder-tree" style="color: var(--primary-yellow); margin-left: 8px;"></i>إدارة تصنيفات وأقسام قائمة الطعام</h3>
            <button class="sim-btn" id="btn-add-cat-modal-panel" style="padding: 8px 16px; font-size: 0.8rem; background: linear-gradient(135deg, var(--primary-red) 0%, #A51D1D 100%); border-color: rgba(255,255,255,0.05); color: #fff;">
              <i class="fa-solid fa-plus"></i> إضافة قسم منيو جديد
            </button>
          </div>
          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>معرّف القسم الفريد (ID)</th>
                  <th>الاسم بالعربية</th>
                  <th>الاسم بالإنجليزية</th>
                  <th style="text-align: center;">إجراءات التحكم</th>
                </tr>
              </thead>
              <tbody id="admin-panel-categories-rows">
                <!-- Dynamically populated category rows -->
              </tbody>
            </table>
          </div>
        </div>
      </div>`;

if (content.includes(exactPanelString)) {
  content = content.replace(exactPanelString, '');
  console.log("Categories tab panel removed successfully!");
} else {
  // Let's try matching with normalized line endings
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedExact = exactPanelString.replace(/\r\n/g, '\n');
  if (normalizedContent.includes(normalizedExact)) {
    content = normalizedContent.replace(normalizedExact, '');
    console.log("Categories tab panel removed successfully (normalized line endings)!");
  } else {
    console.error("Exact Categories panel string not found! Checking alternative match...");
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("admin.html updated successfully!");
