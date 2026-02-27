const form = document.getElementById("analysis-form");
const medCountInput = document.getElementById("med-count");
const medicationInputs = document.getElementById("medication-inputs");
const statusMsg = document.getElementById("status-msg");
const reportEl = document.getElementById("report");
const printBtn = document.getElementById("print-btn");

const drugNames = (window.PHARMA_DATA && window.PHARMA_DATA.drugNames) || [];

function createMedicationSelect(index) {
  const wrapper = document.createElement("label");
  wrapper.textContent = `Medication ${index + 1}`;

  const select = document.createElement("select");
  select.name = "medication";

  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = "-- Select --";
  select.appendChild(blank);

  for (const med of drugNames) {
    const option = document.createElement("option");
    option.value = med;
    option.textContent = med;
    select.appendChild(option);
  }

  wrapper.appendChild(select);
  return wrapper;
}

function renderMedicationFields() {
  const count = Math.max(2, Math.min(8, Number(medCountInput.value) || 2));
  medCountInput.value = String(count);
  medicationInputs.innerHTML = "";

  for (let i = 0; i < count; i += 1) {
    medicationInputs.appendChild(createMedicationSelect(i));
  }
}

function setStatus(message, type = "") {
  statusMsg.textContent = message;
  statusMsg.className = `status ${type}`.trim();
}

function getPayload() {
  const formData = new FormData(form);
  const medications = Array.from(form.querySelectorAll('select[name="medication"]'))
    .map((el) => el.value.trim())
    .filter(Boolean);

  return {
    patient_id: (formData.get("patient_id") || "").toString().trim(),
    patient_name: (formData.get("patient_name") || "").toString().trim(),
    age: Number(formData.get("age") || 0),
    weight: Number(formData.get("weight") || 0),
    allergies: formData.getAll("allergies").map((a) => a.toString().trim()).filter(Boolean),
    medications,
  };
}

function renderReport(data) {
  reportEl.classList.remove("empty");
  reportEl.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = `${data.app_name} Clinical Report`;

  const meta = document.createElement("p");
  meta.innerHTML = `<strong>Patient ID:</strong> ${data.patient_id} | <strong>Name:</strong> ${data.patient_name}<br><strong>Date:</strong> ${data.generated_at}`;

  const section = document.createElement("p");
  section.innerHTML = "<strong>Clinical Assessment:</strong>";

  const content = document.createElement("div");
  content.textContent = data.report;

  reportEl.appendChild(heading);
  reportEl.appendChild(meta);
  reportEl.appendChild(section);
  reportEl.appendChild(content);
}

async function submitAnalysis(event) {
  event.preventDefault();
  const payload = getPayload();

  if (!payload.patient_id || !payload.patient_name) {
    setStatus("Please provide patient ID and patient name.", "error");
    return;
  }

  if (payload.medications.length < 2) {
    setStatus("Please select at least two medications.", "error");
    return;
  }

  setStatus("Processing clinical analysis...");
  printBtn.disabled = true;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Analysis failed.");
    }

    renderReport(data);
    setStatus("Clinical report generated.", "ok");
    printBtn.disabled = false;
  } catch (error) {
    setStatus(error.message || "Unexpected error.", "error");
  }
}

medCountInput.addEventListener("input", renderMedicationFields);
form.addEventListener("submit", submitAnalysis);
printBtn.addEventListener("click", () => window.print());

renderMedicationFields();
