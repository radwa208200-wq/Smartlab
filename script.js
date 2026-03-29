// =====================
// 1️⃣ تعريف الأوبجكتات الجديدة
// =====================

const tests = [
  { 
    name: { en: "CBC", ar: "صورة دم" }, 
    desc: { en: "Complete Blood Count Test", ar: "تحليل صورة دم كاملة" }, 
    symptoms: ["pale","weakness","fatigue","شكلي باهت","ضعف","اجهاد"]
  },
  { 
    name: { en: "COVID-19", ar: "كورونا" }, 
    desc: { en: "COVID-19 Test", ar: "تحليل فيروس كورونا" }, 
    symptoms: ["fever","cough","loss of taste","برد","كحه","فقدان شهية"]
  },
  { 
    name: { en: "Hormone Test", ar: "تحليل هرمونات" }, 
    desc: { en: "Hormone Level Test", ar: "تحليل دقيق لمستويات الهرمونات" }, 
    symptoms: ["mood swings","irregular periods","تقلبات في المزاج","عدم انتظام الدورة"] 
  },
  { 
    name: { en: "DNA Test", ar: "تحليل DNA" }, 
    desc: { en: "Genetic Testing Service", ar: "خدمة التحليل الجيني" }, 
    symptoms: ["family disease","genetic concern","مرض وراثي","قلق وراثي"] 
  },
  { 
    name: { en: "Diabetes Test", ar: "تحليل السكري" }, 
    desc: { en: "Monitor your blood sugar levels", ar: "مراقبة مستوى السكر في الدم" }, 
    symptoms: ["loss of consciousness","sore","فقدان الوعي","التهابات متكررة"] 
  },
  { 
    name: { en: "Pregnancy Test", ar: "تحليل الحمل" }, 
    desc: { en: "Reliable and quick pregnancy testing", ar: "تحليل حمل سريع وموثوق" }, 
    symptoms: ["nausea","period delay","تأخر الدورة","غثيان"] 
  }
];

const consultMsg = { en: "Consult your doctor", ar: "استشر طبيبك" };

// =====================
// 2️⃣ Booking Form
// =====================

const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(lang === "en" ? "Your booking has been submitted successfully ✅" : "تم تأكيد الحجز بنجاح ✅");
    bookingForm.reset();
  });
}

// =====================
// 3️⃣ Contact Form
// =====================

const contactForm = document.querySelector("form.contact-box");
if (contactForm && !bookingForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(lang === "en" ? "Message sent successfully 💙" : "تم إرسال الرسالة بنجاح 💙");
    contactForm.reset();
  });
}

// =====================
// 4️⃣ Symptom Checker
// =====================

// افتراضياً هتحطي Input للمستخدم في صفحة Home:
// <input type="text" id="symptomInput" placeholder="Enter your symptoms">
// <button onclick="submitSymptoms()">Check Test</button>
// <div id="output"></div>

function submitSymptoms() {
  const input = document.getElementById("symptomInput").value.toLowerCase();
  checkSymptoms(input.split(",").map(s => s.trim()));
}

function checkSymptoms(symptomsInput){
  const matched = tests.find(test => test.symptoms.some(s => symptomsInput.includes(s.toLowerCase())));
  const outputDiv = document.getElementById("output");
  
  if(matched){
    outputDiv.innerHTML = `
      <div class="card">
        <h3 data-en="${matched.name.en}" data-ar="${matched.name.ar}">${matched.name[lang]}</h3>
        <p data-en="${matched.desc.en}" data-ar="${matched.desc.ar}">${matched.desc[lang]}</p>
      </div>
    `;
  } else {
    outputDiv.innerHTML = `
      <div class="card">
        <h3 data-en="${consultMsg.en}" data-ar="${consultMsg.ar}">${consultMsg[lang]}</h3>
        <p></p>
      </div>
    `;
  }
}

// =====================
// 5️⃣ Language toggle
// =====================

let lang = "en";

function toggleLang() {
  lang = lang === "en" ? "ar" : "en";

  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  document.querySelectorAll("[data-en-placeholder]").forEach(el => {
    el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
  });

  const btn = document.getElementById("langBtn");
  if (btn) btn.textContent = lang === "en" ? "AR" : "EN";

  document.body.dir = lang === "ar" ? "rtl" : "ltr";

  // تحديث أي نتائج ظاهرة بالفعل من Symptom Checker بعد الترجمة
  const outputDiv = document.getElementById("output");
  if(outputDiv.innerHTML !== ""){
    const h3 = outputDiv.querySelector("h3");
    const p = outputDiv.querySelector("p");
    const matchedTest = tests.find(t => t.name.en === h3.getAttribute("data-en"));
    if(matchedTest){
      h3.textContent = matchedTest.name[lang];
      p.textContent = matchedTest.desc[lang];
    } else {
      h3.textContent = consultMsg[lang];
    }
  }
}

// =====================
// 6️⃣ About Page Typing Effect
// =====================

document.addEventListener("DOMContentLoaded", () => {

  // نتأكد إننا في صفحة About بس
  if (!document.body.classList.contains("about-page")) return;

  const elements = document.querySelectorAll(
    ".about-page .page h1, .about-page .page h2, .about-page .page h3, .about-page .page p"
  );

  let totalDelay = 0;

  elements.forEach(el => {
    const fullText = el.textContent;
    el.textContent = "";

    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    el.appendChild(cursor);

    [...fullText].forEach((char, index) => {
      setTimeout(() => {
        cursor.remove();
        el.textContent += char;
        el.appendChild(cursor);
      }, totalDelay + index * 40);
    });

    totalDelay += fullText.length * 40 + 500;
  });

});

// =====================
// 7️⃣ Smart Emergency Detection (Contact Page)
// =====================

const emergencyKeywords = [
  "emergency",
  "urgent",
  "pain",
  "bleeding",
  "unconscious",
  "severe",
  "chest pain",
  "difficulty breathing"
];

const contactTextArea = document.querySelector(".contact-box textarea");

if (contactTextArea) {
  contactTextArea.addEventListener("input", () => {
    const message = contactTextArea.value.toLowerCase();

    const isEmergency = emergencyKeywords.some(keyword =>
      message.includes(keyword)
    );

    if (isEmergency) {
      showEmergencyAlert();
    }
  });
}

function showEmergencyAlert() {
  if (document.getElementById("emergencyAlert")) return;

  const alertBox = document.createElement("div");
  alertBox.id = "emergencyAlert";
  alertBox.innerHTML = `
    ⚠️ <strong>Emergency Detected</strong><br>
    This looks like an urgent medical case.<br>
    Please call <strong>+20 100 000 0000</strong> immediately.
  `;

  alertBox.style.background = "#ffe5e5";
  alertBox.style.color = "#a40000";
  alertBox.style.padding = "15px";
  alertBox.style.marginTop = "15px";
  alertBox.style.borderRadius = "10px";
  alertBox.style.textAlign = "center";
  alertBox.style.fontWeight = "bold";

  contactTextArea.parentElement.prepend(alertBox);
}



// =====================
// 8️⃣ Booking Page Smart Logic
// =====================

document.addEventListener("DOMContentLoaded", () => {

  const bookingForm = document.getElementById("bookingForm");
  if (!bookingForm) return; // لو مش في صفحة booking اطلع

  /* =====================
     Smart Payment
  ===================== */

  const paymentRadios = document.querySelectorAll("input[name='payment']");
  const visaBox = document.getElementById("visaBox");
  const paymentMsg = document.getElementById("paymentMsg");

  visaBox.style.display = "none";

  paymentRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "visa") {
        visaBox.style.display = "block";
        paymentMsg.textContent =
          lang === "en"
            ? "Your payment is secure 🔒"
            : "الدفع آمن ومشفر 🔒";
      } else {
        visaBox.style.display = "none";
        paymentMsg.textContent =
          lang === "en"
            ? "You will pay during your visit 💵"
            : "سيتم الدفع عند الزيارة 💵";
      }
    });
  });

  /* =====================
     Smart Doctors Schedule
  ===================== */

  const doctorsSchedule = {
    monday: ["Dr. Ahmed", "Dr. Sara"],
    tuesday: ["Dr. Mohamed"],
    wednesday: ["Dr. Lina", "Dr. Omar"],
    thursday: ["Dr. Ahmed"],
    friday: ["Dr. Sara", "Dr. Lina"]
  };

  const dateInput = document.getElementById("dateInput");
  const doctorSelect = document.getElementById("doctorSelect");
const reminder = document.getElementById("testTip");

  // لو المستخدم اختار تاريخ قبل كده
  const savedDate = localStorage.getItem("selectedDate");
  if (savedDate) {
  dateInput.value = savedDate;
  loadDoctors(savedDate);

  reminder.textContent =
    lang === "en"
      ? `📅 Your test is scheduled on ${savedDate}`
      : `📅 تحليلك محجوز يوم ${savedDate}`;
}


  dateInput.addEventListener("change", () => {
  localStorage.setItem("selectedDate", dateInput.value);
  loadDoctors(dateInput.value);

  reminder.textContent =
    lang === "en"
      ? `📅 Your test is scheduled on ${dateInput.value}`
      : `📅 تحليلك محجوز يوم ${dateInput.value}`;
});


  function loadDoctors(dateValue) {
    doctorSelect.innerHTML = `<option value="">${
      lang === "en" ? "Select Doctor" : "اختر الطبيب"
    }</option>`;

    const day = new Date(dateValue)
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();

    const availableDoctors = doctorsSchedule[day];

    if (availableDoctors) {
      availableDoctors.forEach(doc => {
        const option = document.createElement("option");
        option.textContent = doc;
        doctorSelect.appendChild(option);
      });
    } else {
      const option = document.createElement("option");
      option.textContent =
        lang === "en"
          ? "No doctors available"
          : "لا يوجد أطباء متاحين";
      doctorSelect.appendChild(option);
    }
  }

});
