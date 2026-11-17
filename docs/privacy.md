# Privacy & Data Protection Architecture

## Core Privacy Statement

CareTransition is built on a **Zero-Telemetry, Zero-Cloud Storage** design philosophy. The application does not collect, transmit, monetize, or observe patient health information.

## Technical Safeguards

1. **No External Network Calls:**
   - The application makes no network calls to external APIs or services when processing health data, uploading documents, or generating PDFs.
   - Text parsing, medication schedules, and PDFs are created locally on your device's processor.

2. **No User Accounts or Passwords:**
   - Registration creates centralized databases that become attractive targets for data breaches. CareTransition avoids this entirely by requiring no accounts, passwords, or email addresses.

3. **No Third-Party Analytics or Trackers:**
   - The application includes zero Google Analytics, Meta Pixel, advertising scripts, or session recording SDKs.

4. **IndexedDB Local Storage:**
   - All entered information remains strictly within your browser's private IndexedDB storage partition.
   - You can completely erase all stored data at any time via the **"Erase All Local Data"** button in Settings & Privacy.

## Device Sharing Advisory

Because data is stored locally in the web browser:
- If you use a **shared computer** (such as a library terminal, hospital kiosk, or shared family PC), anyone with access to that web browser profile could see your saved tasks or medications.
- We strongly advise users on shared computers to export their summary as a PDF and then use **"Erase All Local Data"** before closing the browser.

## Regulatory Disclaimer

Local client-side storage is intended as a personal convenience and organizational aid. It is **not** an official Electronic Health Record (EHR) system. Do not claim HIPAA compliance certification without an institutional and organizational security audit.

