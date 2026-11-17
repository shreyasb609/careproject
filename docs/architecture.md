# System Architecture & Technical Design

## 1. High-Level Architecture Overview

CareTransition is structured as a **Pure Client-Side Application** (Single Page Application in React/TypeScript) that operates completely inside the patient's local web browser environment without communicating with any backend server, patient database, or external machine learning service.

```
+---------------------------------------------------------------------------------+
|                               Patient Web Browser                               |
|                                                                                 |
|  +---------------------+   +---------------------+   +-----------------------+  |
|  |     UI Layer        |   |   Parsing Engine    |   | Medical Dictionary    |  |
|  | - React 18 / TS     |   | - Rule-based Regex  |   | - Curated terms/abbrev|  |
|  | - Tailwind CSS      |   | - Context Analysis  |   | - Ambiguity Warnings  |  |
|  | - Accessible Nav    |   | - pdfjs-dist        |   | - Plain translations  |  |
|  +----------+----------+   +----------+----------+   +-----------+-----------+  |
|             |                         |                          |              |
|             v                         v                          v              |
|  +---------------------------------------------------------------------------+  |
|  |                           Application State                               |  |
|  |                           (React Context)                                 |  |
|  +------------------------------------+--------------------------------------+  |
|                                       |                                         |
|                   +-------------------+--------------------+                    |
|                   v                                        v                    |
|  +----------------------------------+   +------------------------------------+  |
|  |       IndexedDB Persistence      |   |          Local PDF Engine          |  |
|  |  - Recovery Tasks                |   |  - jsPDF / jsPDF-autotable         |  |
|  |  - Follow-up Appointments        |   |  - Recovery Summary Report         |  |
|  |  - Medication Schedule           |   |  - Caregiver Handoff Guide         |  |
|  |  - Patient Preferences           |   |  - Browser Print Timetables        |  |
|  +----------------------------------+   +------------------------------------+  |
+---------------------------------------------------------------------------------+
```

## 2. Component Structure

- **Context Layer (`AppContext.tsx`):**
  - Exposes state and transactional mutations for Tasks, Appointments, Medications, and Profile.
  - Interacts asynchronously with the persistence storage service.

- **Persistence Layer (`storageService.ts`):**
  - Uses the native browser `IndexedDB` API through the lightweight `idb` abstraction.
  - Manages five object stores: `tasks`, `appointments`, `medications`, `profile`, and `meta`.
  - Provides a single-action `clearAllLocalData()` function that purges all stores simultaneously.

- **Interpretation & Extraction Engine (`interpreterService.ts` & `pdfExtractorService.ts`):**
  - Converts PDF documents into plain text using `pdfjs-dist` in-memory.
  - Employs deterministic regex heuristics to locate appointment timeframes, medications, and activity limitations.
  - Automatically compares tokens against `medicalDictionary.ts` to surface plain-language definitions and ambiguity warnings.
  - Preserves original raw text snippets side-by-side with proposed items.

- **Export & Reporting Engine (`pdfGeneratorService.ts`):**
  - Creates multi-page, formatted PDFs directly in client memory with `jspdf` and `jspdf-autotable`.
  - Formats Caregiver Guides, Recovery Summaries, and Appointment Agendas with clear warnings and emergency contact information.

## 3. Technology Rationale

| Dependency | Purpose | Why Chosen |
|---|---|---|
| **React 18 + TypeScript** | UI & State Engine | Strict type safety for medical objects; mature ecosystem |
| **Tailwind CSS** | Styling | Accessible color palettes, high readability, mobile-first design |
| **IndexedDB (`idb`)** | Persistence | Native client-side storage capable of holding multi-document records securely without server uploads |
| **pdfjs-dist** | Local Document Extraction | Extracts text from PDF files directly in the browser |
| **jsPDF + AutoTable** | PDF Output Generation | Generates clean, printable documents client-side |
| **Vitest** | Automated Testing | Fast unit testing for parser rules and edge cases |
