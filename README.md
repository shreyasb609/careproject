# CareTransition

**CareTransition** is a free, patient-facing web application designed to guide individuals and families safely through the critical, often confusing transition from hospital discharge to recovery at home.

When patients leave the hospital, they are typically handed voluminous paperwork containing unfamiliar clinical abbreviations, changing medication regimens, physical therapy limitations, and fragmented follow-up schedules. CareTransition brings order and clarity to this process while adhering to strict privacy and medical safety standards.

---

## Non-Negotiable Core Principles & Safety Architecture

1. **100% Client-Side Privacy (Zero Server Telemetry):**
   - **No user account or login required.**
   - **No remote patient databases.**
   - All data is persisted directly on your local device using the browser's **IndexedDB**.
   - No tracking cookies, advertising SDKs, or analytics services.
   - A dedicated **"Erase All Local Data"** button wipes your health records from the browser on demand.

2. **No AI Chatbots or Hallucinations:**
   - **Contains no generative AI APIs, external LLM endpoints, or chatbots.**
   - Discharge document interpretation uses deterministic, rule-based parsing and curated medical terminology to avoid hallucinations.
   - Ambiguous abbreviations and uncertain clinical instructions are flagged explicitly for patient clarification with their healthcare team.

3. **Medical Safety Guardrails:**
   - **Never makes diagnoses or suggests medical treatments.**
   - **Never alters, calculates, or infers medication doses.**
   - Explicitly separates newly prescribed, continued, and discontinued medications.
   - Prominently displays emergency warning signs and advice on when to call 911.

---

## Key Features

- **Recovery Planner:** Organize recovery tasks into categories (wound care, physical therapy, vital signs, diet & hydration, equipment, general). Track due dates, mark tasks completed, and review outstanding instructions.
- **Follow-up Appointment Organizer:** Track doctor visits, rehabilitation check-ins, clinic locations, and phone numbers. Flag appointments requiring scheduling calls and export an appointment schedule.
- **Medication Organizer:** Enter clinician-prescribed medications into a daily timetable (Morning, Noon, Evening, Bedtime, As Needed). Clearly flags discontinued medications to prevent dangerous accidental resumption. Generates a printable medication chart.
- **Medical Terminology Explorer:** Search a curated medical dictionary explaining hospital abbreviations (e.g. *BID*, *PRN*, *NWB*, *PT*, *PE*, *D/C*) in plain, accessible language with authoritative sources (NIH MedlinePlus, ISMP, CDC, CMS) and ambiguity alerts.
- **Discharge Document Interpreter:** Upload discharge PDFs or paste text. The system locally parses recognized terminology, candidate appointments, medication routines, and recovery tasks, presenting the original text alongside proposed items for patient confirmation before adding to their plan.
- **Caregiver Handoff Generator:** Patients select specific recovery tasks, appointments, and medication schedules to include in a printable and downloadable PDF guide tailored for family members, friends, or home health aides.
- **Recovery Summary PDF:** Consolidate your complete post-discharge recovery plan into an exportable, high-quality PDF report via jsPDF.

---

## Technology Stack

- **Framework:** React 18 with TypeScript
- **Tooling & Bundler:** Vite
- **Styling:** Tailwind CSS (accessible healthcare palette with high-contrast readable controls)
- **Local Persistence:** IndexedDB via `idb`
- **PDF Generation:** `jspdf` and `jspdf-autotable`
- **Client-Side PDF Parsing:** `pdfjs-dist`
- **Testing:** Vitest
- **Icons:** Lucide React

---

## Getting Started & Local Development

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/careproject.git
cd careproject

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open your browser to `http://localhost:5173` to explore CareTransition.

### Running Tests
Execute the unit and deterministic parsing test suite:
```bash
npm test
```

### Production Build
Compile TypeScript and build the optimized production assets:
```bash
npm run build
```
The output will be placed in the `dist/` directory.

---

## Deploying to Vercel

CareTransition is a client-side Single Page Application (SPA) with zero backend requirements. It can be deployed to Vercel in seconds:

1. **Push to GitHub:** Ensure your code is pushed to your Git repository.
2. **Connect to Vercel:** Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. **Import Repository:** Select the `careproject` repository.
4. **Build Settings:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. **Environment Variables:** None required! The application does not require secret keys or external API configurations.
6. **Deploy:** Click **Deploy**. Your secure site will be live instantly with automated SSL and edge delivery.

---

## Limitations & Disclaimer

CareTransition is an educational and organizational tool designed solely as a personal memory aid. It is **not** an Electronic Health Record (EHR) system, medical device, or licensed clinical provider. Patients should never alter prescription dosages or clinical regimens without direct consultation with their physician or pharmacist.

---

## License

This project is licensed under the [MIT License](LICENSE).
