# Medical Safety Guardrails & Principles

CareTransition is designed to reduce the anxiety of post-discharge recovery while maintaining rigorous clinical safety standards.

## 1. No Clinical Inference or Modification

- **Never Calculates Doses:** The application never calculates, alters, or suggests medication dosages based on patient weight, age, or clinical condition.
- **Never Changes Prescriptions:** The system explicitly categorizes medications into `Newly Prescribed`, `Continued`, and `Discontinued` based only on explicit clinician text.
- **Discontinued Medication Alerts:** Discontinued drugs are styled with red strikethroughs and safety banners to prevent patients from accidentally continuing an old prescription that was superseded during hospitalization.

## 2. No Artificial Intelligence Hallucinations

- Generative AI chatbots and Large Language Models (LLMs) are known to hallucinate believable yet incorrect clinical recommendations.
- CareTransition **strictly excludes all generative AI APIs**. 
- Text interpretation uses deterministic regular expressions and a curated database of clinical terms from recognized authorities.
- When an instruction or medication is ambiguous, the system **flags it for direct healthcare team clarification** rather than guessing.

## 3. Clear Warning Signs & Red Flags

Post-operative and post-discharge complications require prompt emergency care. CareTransition embeds clear red-flag reminders:
- Seek emergency care or dial 911 for:
  - Sudden or severe shortness of breath (SOB)
  - Chest pain or pressure
  - Sudden unilateral calf swelling or tenderness (DVT warning)
  - Fever over 101°F (38.3°C)
  - Uncontrolled bleeding or purulent wound discharge

## 4. Curated Terminology Sources

All medical terminology and abbreviation definitions are referenced from authoritative health organizations:
- **ISMP** (Institute for Safe Medication Practices) — List of Error-Prone Abbreviations
- **NIH MedlinePlus** — Medical Abbreviations and Terms
- **CDC** (Centers for Disease Control and Prevention)
- **CMS** (Centers for Medicare & Medicaid Services)
- **AOTA & APTA** (Occupational & Physical Therapy Associations)
