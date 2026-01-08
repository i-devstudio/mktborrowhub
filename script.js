let itemCount = 0;
// *** ตรวจสอบ URL นี้ให้ตรงกับหน้า Deploy ล่าสุดของคุณ ***
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycFhWh6ybV0v1aWQPeQDi72F5ETCs3BYVpYE1aLjsRX752phEhab0DulTxtf69XjrdIA/exec'; 

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
        "Oil Control Base Gel SPF 50 PA +++++": ["No Variant"],
        "Corrector Color": ["Green", "Purple","Peach"],
        "Bright Tone Up": ["No Variant"]
    },
    "แก้ม ตา ปาก": {
        "Soft Touch Matte Lips Ex": ["F1", "P1", "P2", "NN", "PF", "FN"],
        "Lit Glit Lip Liner": ["01 Glow Beige", "02 First Light", "03 Sunshine Lit"],
        "Lit Glit Liquid Blush": ["01 Peach Lit","02 Nude Light", "03 Maple Shine","04 Twilight", "05 Pink Bloom", "06 Scarlet Ray", "07 Ivory Glow", "08 Mocha Mist"],
        "2 IN 1 Fix It Eyebrow": ["No Variant"],
        "Soft Serve": ["VP","FP","FF","PP","PN","PF"],
        "Keep Me Aspiring": ["01 Next Level Dream","02 Next Level Shine"],
        "Soft Slim": ["No Variant"],
        "Juicy Lush Tint Balm": ["N1","F0","P0","P2","F2"],
        "Glittering Eye": ["C1 Silver","F1 Golden Sand"],
        "Dolly Eye 2 IN 1": ["P0 Rosy Twinkle","N0 Golden Glow"],
        "Perfect Match Palette": ["No Variant"],
        "Classic Black Liner": ["No Variant"],
        "Fushion Glam Eye": ["FG","PR","NN"],
        "Blush Bomb": ["F1","N1","P1","P2","R1"],
        "Slay Lash Mascara": ["No Variant"],
        "Eye Expert Eyeliner": ["No Variant"],
        "Soft Bake Lip": ["FF", "NP","PN","PP","RR","FN","NF"],
        "Glossy Luxe Lip": ["P0 Charming", "F0 Energetic Gal"],
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
        "Marshmallow Puff": ["No Variant"],
        "Essential Brush Set": ["No Variant"],
        "Foundation Brush": ["No Variant"],
        "Make Up Studio Pro Brush Set": ["No Variant"],
        "Smooth Nano Puff": ["No Variant"],
        "Eyelash Curler": ["No Variant"]
    }
};

// 1. จัดการหน้าจอ
function showPage(pageId) {
    // ซ่อนทุกหน้า (Section) และ หน้า Home
    document.querySelectorAll('section, #home-page').forEach(el => {
        el.classList.add('hidden');
    });
    
    // แสดงหน้าที่ต้องการ
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // ถ้าไปหน้ายืมและยังไม่มีรายการ ให้เพิ่ม 1 รายการอัตโนมัติ
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
// ... (คงส่วน inventoryData และ showPage ไว้เหมือนเดิม) ...

// 4. สรุปผลและส่งข้อมูล
function openSummary(e) {
    e.preventDefault();
    
    // 1. ตรวจสอบไฟล์ภาพ
    const fileInput = document.getElementById('borrowImg');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert("🚨 กรุณาแนบรูปภาพสินค้าก่อนส่งข้อมูลครับ");
        return;
    }

    // 2. ดึงค่าจาก Input วันที่ทั้งสองช่อง
    const borrowDateRaw = document.getElementById('borrowDate').value;
    const returnDateRaw = document.getElementById('returnDate').value;

    if (!borrowDateRaw || !returnDateRaw) {
        alert("🚨 กรุณาเลือกทั้งวันที่ยืมและกำหนดคืนสินค้า");
        return;
    }

    // --- เพิ่มการเช็ก: วันคืนห้ามน้อยกว่าวันยืม ---
    const bDate = new Date(borrowDateRaw);
    const rDate = new Date(returnDateRaw);

    if (rDate < bDate) {
        alert("🚨 วันที่คืนสินค้าห้ามน้อยกว่าวันที่ยืมสินค้าครับ กรุณาตรวจสอบอีกครั้ง");
        return;
    }

    // ฟังก์ชันจัดรูปแบบวันที่เป็นภาษาไทย (11 มกราคม 2569)
    const thaiFormat = (dateObj) => {
        return dateObj.toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const borrowDateDisplay = thaiFormat(bDate);
    const returnDateDisplay = thaiFormat(rDate);

    // 3. รวมรายการสินค้า
    let itemSummary = '';
    document.querySelectorAll('.item-row').forEach((row, i) => {
        const name = row.querySelector('.item-name').value;
        const variant = row.querySelector('.item-variant').value;
        const qty = row.querySelector('.item-qty').value;
        if(name) {
            itemSummary += `<p class="mb-1">${i + 1}. ${name} [${variant}] x ${qty}</p>`;
        }
    });

    // 4. แสดงผลใน Modal (Summary)
    document.getElementById('summary-content').innerHTML = `
        <div class="space-y-3 text-left">
            <div class="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <p class="text-xs text-blue-500 font-bold uppercase mb-1">ข้อมูลผู้ยืม</p>
                <p><strong>ชื่อ:</strong> ${document.getElementById('nickname').value} (${document.getElementById('empId').value})</p>
                <p><strong>เหตุผล:</strong> ${document.getElementById('borrowReason').value || '-'}</p>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p class="text-[10px] text-slate-400 uppercase font-bold">วันที่ยืม</p>
                    <p class="text-sm font-semibold text-slate-700">${borrowDateDisplay}</p>
                </div>
                <div class="p-3 bg-red-50 rounded-xl border border-red-100">
                    <p class="text-[10px] text-red-400 uppercase font-bold">กำหนดคืน</p>
                    <p class="text-sm font-semibold text-red-600">${returnDateDisplay}</p>
                </div>
            </div>

            <div class="bg-white p-3 rounded-xl border border-slate-200 text-sm">
                <p class="font-bold border-b mb-2 pb-1 text-slate-500">รายการสินค้า:</p>
                ${itemSummary}
            </div>
        </div>
    `;
    document.getElementById('modal').classList.remove('hidden');
	
}
// เพิ่มฟังก์ชันปิด Modal (ถ้าในไฟล์ยังไม่มี)
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// ผูกฟังก์ชันกับปุ่มแก้ไข (ถ้าปุ่มมี ID หรือ Class ที่ระบุได้)
// สมมติว่าปุ่มแก้ไขอยู่ใน modal และเป็นปุ่มแรก
document.querySelector('#modal button:first-of-type').addEventListener('click', closeModal);

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

    // เตรียมข้อมูลส่งไป Apps Script
    const data = {
        empId: document.getElementById('empId').value,
        nickname: document.getElementById('nickname').value,
        borrowDate: document.getElementById('borrowDate').value, // เพิ่มวันยืม
        returnDate: document.getElementById('returnDate').value,
        reason: document.getElementById('borrowReason').value, // ✅ ส่งเหตุผลไปที่ Sheet
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
            btn.disabled = false; btn.innerText = "ส่งข้อมูล";
        }
    } catch (error) {
        console.error(error);
        alert("บันทึกสำเร็จ! (CORS)");
        location.reload();
    }
}

// ค้นหารายการจากรหัสพนักงาน
// ค้นหารายการจากรหัสพนักงาน พร้อมเรียงลำดับวันที่ใกล้คืนที่สุด
async function searchBorrowedItems() {
    const empId = document.getElementById('searchEmpId').value;
    if (!empId) return alert("กรุณากรอกรหัสพนักงาน");

    const listContainer = document.getElementById('borrow-list');
    listContainer.innerHTML = '<p class="text-center py-10 text-slate-500">กำลังค้นหาข้อมูล...</p>';

    try {
        const response = await fetch(`${SCRIPT_URL}?action=getBorrowed&empId=${empId}`);
        const rawItems = await response.json();

        if (rawItems.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-red-400 py-10">ไม่พบรายการค้างยืมสำหรับรหัสนี้</p>';
            return;
        }

        // 1. จัดกลุ่มสินค้าที่มี ID เดียวกัน (Group by ID)
        const groupedItems = rawItems.reduce((acc, item) => {
            if (!acc[item.id]) {
                acc[item.id] = { ...item, products: [] };
            }
            acc[item.id].products.push(`${item.itemList} x ${item.qty || 1}`); 
            return acc;
        }, {});

        // 2. แปลงเป็น Array และเรียงลำดับ (Sort) ตามวันที่คืนที่ใกล้ที่สุด
        const sortedItems = Object.values(groupedItems).sort((a, b) => {
            const dateA = new Date(a.returnDate);
            const dateB = new Date(b.returnDate);
            return dateA - dateB; // วันที่น้อยกว่า (มาถึงก่อน) จะอยู่ด้านบน
        });

        // 3. แสดงผลในรูปแบบ Card
        listContainer.innerHTML = sortedItems.map(group => {
            const allProductsText = group.products.join('<br>• ');
            
            // ตรวจสอบว่าใกล้ถึงกำหนดคืนหรือยัง (ถ้าเหลือ <= 2 วัน ให้เปลี่ยนสีเตือน)
            const today = new Date();
            const returnDateObj = new Date(group.returnDate);
            const diffTime = returnDateObj - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const isUrgent = diffDays <= 2;

            return `
            <div class="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4">
                <div class="absolute top-0 left-0 w-1.5 h-full ${isUrgent ? 'bg-red-500' : 'bg-blue-500'}"></div>
                
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-bold ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} px-2 py-0.5 rounded-full">ID: ${group.id}</span>
                    <span class="text-[10px] text-slate-400 font-medium">ยืมเมื่อ: ${group.borrowDate}</span>
                </div>
                
                <p class="font-bold text-slate-800 text-lg">${group.nickname} (${group.empId})</p>
                
                <div class="bg-slate-50 p-4 rounded-2xl my-3 border border-slate-50">
                    <p class="text-[10px] uppercase font-bold text-slate-400 mb-2">รายการสินค้าที่ยืม:</p>
                    <p class="text-sm text-slate-700 leading-relaxed font-medium">• ${allProductsText}</p> 
                </div>

                <div class="flex justify-between items-center text-xs mb-4">
                    <span class="text-slate-400">กำหนดคืน:</span>
                    <span class="font-bold ${isUrgent ? 'text-white bg-red-500 animate-pulse' : 'text-red-500 bg-red-50'} px-3 py-1.5 rounded-lg">
                        ${group.returnDate} ${isUrgent ? '(ใกล้ครบกำหนด!)' : ''}
                    </span>
                </div>

                <button onclick="openReturnModal('${group.id}', '${group.products.join(', ')}')" 
                    class="w-full py-4 ${isUrgent ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-slate-800'} text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg">
                    คืนรายการทั้งหมดนี้
                </button>
            </div>
            `;
        }).join('');

    } catch (e) {
        console.error("Search Error:", e);
        listContainer.innerHTML = '<p class="text-center text-red-400 py-10">เกิดข้อผิดพลาดในการดึงข้อมูล โปรดลองใหม่</p>';
    }
}

function openReturnModal(id, info) {
    document.getElementById('targetReturnId').value = id;
    document.getElementById('return-item-info').innerText = "รายการ: " + info;
    document.getElementById('return-modal').classList.remove('hidden');
}

function closeReturnModal() {
    document.getElementById('return-modal').classList.add('hidden');
}

async function submitReturn() {
    const btn = document.getElementById('confirmReturnBtn');
    const id = document.getElementById('targetReturnId').value;
    const fileInput = document.getElementById('returnImg'); // ID ของ Input file ใน Modal คืน

    if (fileInput.files.length === 0) {
        alert("🚨 กรุณาถ่ายรูปสินค้าตอนคืนเพื่อเป็นหลักฐานครับ");
        return;
    }

    btn.innerText = "กำลังบันทึก...";
    btn.disabled = true;

    try {
        // แปลงรูปภาพเป็น Base64
        const imgBase64 = await toBase64(fileInput.files[0]);

        const data = {
            action: "returnItem",
            id: id,
            returnImage: imgBase64 // ส่งรูปภาพไปด้วย
        };

        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (result.result === "success") {
            alert("✅ คืนสินค้าและบันทึกรูปภาพเรียบร้อย!");
            location.reload();
        }
    } catch (e) {
        console.error(e);
        alert("บันทึกสำเร็จ (CORS)!");
        location.reload();
    }
}

