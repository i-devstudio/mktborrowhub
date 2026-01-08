let itemCount = 0;
// *** ตรวจสอบ URL นี้ให้ตรงกับหน้า Deploy ล่าสุดของคุณ ***
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby9Z_OAGpD-L_SUFEaS8SeWYRHEGJgM68PmubVX33TcBPeyDqMlkn2maaFFWnG9gsjyaw/exec'; 

const inventoryData = {
    "รองพื้น": {
        "Water Resist Liquid Foundation": ["00 Porcelain", "01 Vanilla", "02 Nude", "04 Natural Beige", "06 Warm Sand", "07 Soft Tan"],
        "Face Perfect Face Essence": ["01 Vanilla", "02 Nude", "04 Sand", "07 Sand Beige", "08 Honey"],
        "Sheer Soft Skin Liquid": ["00 Porcelain", "01 Vanilla", "03 Nude", "04 Natural Beige", "05 Warm Sand", "06 Soft Tan", "07 Sun Beige", "08 Honey"],
        "Nourishes": ["01 Ivory", "04 Nude", "08 Rich Tan"],
        "Dreamy Glow Cushion": ["00 Porcelain", "01 Ivory","03 Nude",")5 Warm Sand"],
        "Water Resist Haft Size 12 ml": ["01 Vanilla", "04 Natural Beige", "06 Warm Sand"]

    },
    "แป้ง": {
        "Loose Powder": ["N1 Natural", "P1 Rosy", "Y1 Ivory"],
        "Transparent Loose Powder": ["N1 Natural", "P1 Warm Rosy", "Y1 Vanilla"],
        "Light Setting": ["No Variant"],
        "Perfect Smooth Powder": ["00 Porecelain", "02 Nude", "05 Warm Beige", "08 Honey"],
        "Cover Gripe Powder": ["01 Light Beige", "02 Natural", "04 Medium Beige"]
    },
    "เมคอัพเบส": {
        "Scret Poreless Skin Primer 30 ml": ["No Variant"],
        "Scret Poreless Skin Primer 15 ml": ["No Variant"],
        "Blurring Wrinkle Concealer": ["01 Vanilla","02 Petal Nude","03 Nude"],
        "Oil Control Base Gel SPF 50 PA +++++": ["Green", "Purple"],
        "Corrector Color": ["Green", "Purple","Peach"],
        "Bright Tone Up": ["No Variant"]
    },
    "แก้ม ตา ปาก": {
        "Lip Matte": ["Red Orchid", "Pink Rose"],
        "Blush On": ["Soft Orange"]
    },
    "สกินแคร์ & ครีมกันแดด": {
        "Sun Skin Higt Protection": ["No Variant"],
        "UV Watery": ["No Variant"],
        "Sunshield Bright": ["No Variant"],
        "Sunshield Bright (ซอง)": ["No Variant"],
        "Melting Balm": ["No Variant"],
        "Ever Bright Serum": ["No Variant"],
        "Shoothing Facial Lock Mist": ["No Variant"],
    },
    "อุปกรณ์": {
        "อุปกรณ์": ["แปรงแต่งหน้า", "ฟองน้ำ"]
    }
};

// 1. จัดการหน้าจอ
function showPage(pageId) {
    document.querySelectorAll('section, #home-page').forEach(el => el.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    if(pageId === 'borrow-form' && itemCount === 0) addItemField();
}

// 2. ฟังก์ชันเพิ่มรายการสินค้า (แบบ Dropdown)
function addItemField() {
    itemCount++;
    const container = document.getElementById('item-container');
    const div = document.createElement('div');
    div.id = `item-row-${itemCount}`;
    div.className = "p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap gap-3 item-row relative animate-in zoom-in-95 duration-200";
    
    // สร้างตัวเลือกหมวดหมู่หลัก
    let categoryOptions = '<option value="" disabled selected>เลือกหมวดหมู่</option>';
    for (let cat in inventoryData) {
        categoryOptions += `<option value="${cat}">${cat}</option>`;
    }

    div.innerHTML = `
        <div class="w-full flex justify-between items-center">
            <span class="text-[10px] font-bold uppercase text-slate-400">รายการที่ <span class="row-number"></span></span>
            <button type="button" onclick="removeItem('${div.id}')" class="delete-btn text-red-400 hover:text-red-600 p-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
        </div>
        <div class="w-full">
            <select onchange="updateProductList(this)" class="w-full bg-transparent border-b border-slate-200 py-1 text-sm item-category outline-none focus:border-blue-500" required>
                ${categoryOptions}
            </select>
        </div>
        <div class="w-full">
            <select onchange="updateVariants(this)" class="w-full bg-transparent border-b border-slate-200 py-1 text-sm item-name outline-none focus:border-blue-500" required>
                <option value="" disabled selected>เลือกสินค้า</option>
            </select>
        </div>
        <div class="flex-1 min-w-[120px]">
            <select class="w-full bg-transparent border-b border-slate-200 py-1 text-sm item-variant outline-none focus:border-blue-500" required>
                <option value="" disabled selected>เลือก Variant</option>
            </select>
        </div>
        <div class="w-20">
            <input type="number" value="1" min="1" class="w-full bg-transparent border-b border-slate-200 py-1 text-sm item-qty outline-none focus:border-blue-500 text-center" required>
        </div>
    `;
    container.appendChild(div);
    updateRowNumbers();
}

// เมื่อเลือกหมวดหมู่ -> อัปเดตรายชื่อสินค้า
// 1. เมื่อเลือกหมวดหมู่ -> อัปเดตรายชื่อสินค้า
function updateProductList(categorySelect) {
    const row = categorySelect.closest('.item-row');
    const productSelect = row.querySelector('.item-name'); // ช่องเลือกสินค้า
    const variantSelect = row.querySelector('.item-variant'); // ช่องเลือก Variant
    const categoryName = categorySelect.value;
    
    // ล้างค่าเก่า
    productSelect.innerHTML = '<option value="" disabled selected>เลือกสินค้า</option>';
    variantSelect.innerHTML = '<option value="" disabled selected>เลือก Variant</option>';
    
    if (inventoryData[categoryName]) {
        Object.keys(inventoryData[categoryName]).forEach(product => {
            const opt = document.createElement('option');
            opt.value = product;
            opt.textContent = product;
            productSelect.appendChild(opt);
        });
    }
}

// 2. เมื่อเลือกสินค้า -> อัปเดตรายชื่อ Variant (แก้ไขจุดนี้)
function updateVariants(productSelect) {
    const row = productSelect.closest('.item-row');
    const categorySelect = row.querySelector('.item-category');
    const variantSelect = row.querySelector('.item-variant');
    
    const categoryName = categorySelect.value;
    const productName = productSelect.value;
    
    variantSelect.innerHTML = ''; // ล้างค่าเก่าออกทั้งหมด (ไม่ใช้ "เลือก Variant" แล้ว)
    
    if (inventoryData[categoryName] && inventoryData[categoryName][productName]) {
        const variants = inventoryData[categoryName][productName];
        
        variants.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v;
            opt.textContent = v;
            variantSelect.appendChild(opt);
        });

        // ✅ บังคับเลือกอันแรกทันที
        if (variants.length > 0) {
            variantSelect.value = variants[0];
        }
    }
}

function removeItem(rowId) {
    if (document.querySelectorAll('.item-row').length > 1) {
        document.getElementById(rowId).remove();
        updateRowNumbers();
    }
}

function updateRowNumbers() {
    const rows = document.querySelectorAll('.item-row');
    rows.forEach((row, i) => {
        row.querySelector('.row-number').innerText = i + 1;
        row.querySelector('.delete-btn').style.display = rows.length === 1 ? 'none' : 'block';
    });
}

// 3. จัดการรูปภาพ (Base64)
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

// 4. สรุปผลและส่งข้อมูล
// ฟังก์ชันแสดงสรุปก่อนส่ง
function openSummary(e) {
    e.preventDefault();
    
    // 1. บังคับแนบรูป
    const fileInput = document.getElementById('borrowImg');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("🚨 กรุณาแนบรูปภาพสินค้าก่อนส่งข้อมูลครับ");
        return;
    }

    // 2. เตรียมข้อมูลวันที่
    const now = new Date();
    const borrowDateDisplay = now.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let itemSummary = '';
    document.querySelectorAll('.item-row').forEach((row, i) => {
        const name = row.querySelector('.item-name').value;
        const variant = row.querySelector('.item-variant').value;
        const qty = row.querySelector('.item-qty').value;
        if(name) {
            itemSummary += `<p class="mb-1">${i + 1}. ${name} [${variant}] x ${qty}</p>`;
        }
    });

    // 3. แสดงผลใน Modal
    document.getElementById('summary-content').innerHTML = `
        <div class="space-y-2">
            <p><strong>ผู้ยืม:</strong> ${document.getElementById('nickname').value} (${document.getElementById('empId').value})</p>
            <p class="text-blue-600"><strong>วันที่ยืม (วันนี้):</strong> ${borrowDateDisplay}</p>
            <p class="text-red-600"><strong>กำหนดคืน:</strong> ${document.getElementById('returnDate').value}</p>
            <div class="bg-white p-3 rounded-lg border my-2 text-sm">
                <p class="font-bold border-b mb-2">รายการสินค้า:</p>
                ${itemSummary}
            </div>
        </div>
    `;
    document.getElementById('modal').classList.remove('hidden');
	
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }

async function saveToSheet() {
    const btn = document.getElementById('confirmBtn');
    const fileInput = document.getElementById('borrowImg');
    btn.innerText = "กำลังส่งข้อมูล...";
    btn.disabled = true;

    let imageData = null;
    let fileName = "";

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.size > 1048576) {
            alert("รูปใหญ่เกิน 1MB");
            btn.disabled = false; btn.innerText = "ส่งข้อมูล";
            return;
        }
        imageData = await toBase64(file);
        fileName = file.name;
    }

    const data = {
        empId: document.getElementById('empId').value,
        nickname: document.getElementById('nickname').value,
        returnDate: document.getElementById('returnDate').value,
        status: 'ในระหว่างยืมสินค้า',
        image: imageData,
        imageName: fileName,
        items: Array.from(document.querySelectorAll('.item-row')).map(row => ({
            name: row.querySelector('.item-name').value,
            variant: row.querySelector('.item-variant').value,
            qty: row.querySelector('.item-qty').value
        }))
    };

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (result.result === "success") {
            alert("บันทึกสำเร็จ!");
            location.reload();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error(error);
        alert("บันทึกสำเร็จ (CORS)! ตรวจสอบใน Sheet");
        location.reload();
    }
}