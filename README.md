## Dynamic Medic Incident Form

This project is a hands-on practice exercise for building dynamic, data-driven web apps with vanilla JavaScript, HTML, and CSS. It delivers an interactive incident reporting form tailored for on-site medical teams at events, workplaces, festivals, and deployed military operations.

> **⚠️ Disclaimer:** This project is purely for fun and educational purposes. Since there is no real client or production requirements, the data fields, form requirements, and overall structure may be inconsistent or incomplete. The form is not intended for actual medical use or real-world incident reporting.

### Version 1.1.1 - Major Update

**What's New:**
- **Patient Image Support** – Upload and store patient photos directly in patient profiles. Images are securely stored in IndexedDB and displayed in patient cards and forms.
- **Settings Modal** – Centralized settings interface accessible via the settings button in the header. Configure military features, import/export data, and manage application preferences.
- **IndexedDB Storage** – All data (incidents, patients, settings, and images) now uses IndexedDB instead of localStorage for improved security, larger storage capacity, and better performance. **100% backward compatible** – existing localStorage data is automatically migrated to IndexedDB on first load.
- **Enhanced Patient Management** – Patient profiles now support photo uploads, and all patient data is stored securely in IndexedDB.

**Migration:** If you have existing data in localStorage, it will be automatically migrated to IndexedDB when you first load version 1.1.1. No data loss, no manual steps required!

### Features at a Glance

- **Two-stage incident selection** – choose a category, then a specific incident type to reveal context-sensitive fields.
- **Adaptive form sections** – location/description, vitals, treatment, workplace reporting, and patient disposition appear only when relevant.
- **Military-ready data sets** – dedicated `Military / Operational` category covering blast, ballistic, CBRN, combat stress, and mass-casualty scenarios with tailored vitals and treatments.
- **Vitals intelligence** – configurable vital sets per incident, live numeric validation, warning banners for dangerous readings, and quick-fill chips for common values.
- **Treatment quick actions** – incident-specific intervention shortcuts that append curated actions to the treatment notes.
- **Operational context toggle** – switch between peacetime/garrison and wartime/deployed environments to align follow-up pathways.
- **Follow-up workflow** – context-aware disposition options with incident-driven defaults and requirements (e.g., ambulance vs. MEDEVAC enforced for life-threatening cases).
- **Tooltips + warnings** – inline guidance for every field, workplace safety alerts, and layered seriousness warnings (potential / serious / life-threatening).
- **Tabs + incident history** – switch between adding a new incident and reviewing previously logged reports saved to local storage.
- **Search + filters** – slice stored incidents by keyword, category, context, disposition, seriousness, or timeframe for rapid lookups.
- **Prolonged care logging** – capture repeated vital assessments with timestamps for tactical field care handovers.
- **Quick reference guide** – in-app handbook with fast search and category filters (medicine, MARCH, radio procedures, logistics, and more).
- **Patient management system** – store patient profiles with demographics, medical history, allergies, medications, and photos. Link patients to multiple incidents over time for comprehensive care tracking.
- **Patient photos** – upload and store patient images securely in IndexedDB. Images are displayed in patient cards and can be removed or updated at any time.
- **Patient dashboard** – dedicated tab to view, search, edit, and manage all stored patients with linked incident history.
- **Quick patient selection** – dropdown in incident form to select existing patients with auto-fill of name and service number, or create new patients on the fly.
- **Patient export/import** – export patient data to JSON files and import them back with merge or replace options for data portability.
- **Quick-add options** – common allergies and medications available as quick-action buttons in the patient form for faster data entry.
- **Auto-calculated age** – patient age automatically calculated from date of birth, always current.
- **Settings modal** – centralized settings interface to toggle military features, import/export incidents and patients, and manage application preferences.
- **IndexedDB storage** – all data stored securely in IndexedDB instead of localStorage for better security, larger capacity, and improved performance. Automatic migration from localStorage ensures 100% backward compatibility.
- **Export workflows** – one-click PDF exports (single incident or entire log), JSON download, and clear-controls for secure handovers.
- **Toast notifications** – instant feedback powered by the [Toast Notification Library](https://github.com/BlizzardWolf7/Toast-Notification-Library) for saves, errors, and handovers.
- **PWA + offline cache** – installable experience with local caching so the form keeps working even with limited connectivity.
- **Validation-first UX** – client-side rules ensure required fields, vitals, and follow-ups are complete before mock submission.

### Getting Started

1. Clone or download the project directory to your machine.
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari).
   - No build tools or servers required; it is a plain static asset.
3. Interact with the form:
   - **Manage patients**: Navigate to the Patients tab to create patient profiles with demographics, medical history, allergies, and medications. Use quick-add buttons for common allergies and medications.
   - **Link patients to incidents**: When adding an incident, select an existing patient from the dropdown to auto-fill their information, or create a new patient on the fly.
   - Pick an incident category and type.
   - Set the operational context (peacetime vs. wartime) to tailor disposition pathways.
   - Toggle vitals, treatments, and follow-up dispositions.
   - Capture incident time with quick actions and record patient identifiers.
   - Log recurring vital checks for prolonged tactical field care (each snapshot timestamps and stores the current vitals).
   - Use the quick action chips and hint buttons to see how the UI reacts.
   - Submit to save the incident locally, then filter, export PDFs, or download JSON from the history tab—toast notifications confirm each action.
4. **View patient history**: In the Patients tab, see all linked incidents for each patient with clickable links to edit those incidents.
5. **Export/import data**: Export patients to JSON files from the Patients tab, or import them via Settings. Same export/import workflow available for incidents.
6. Open the Quick Reference tab any time for protocol refreshers, mnemonics, and radio formats—filter or search by keyword.
7. (Optional) Install the PWA from your browser or desktop prompt for one-click access, even offline.

> **Tip:** Extend or localize the in-app guide by editing `guidebook-data.js`, which holds the reference categories/entries loaded into the Quick Reference tab.

### Tech Stack

- **HTML5** – semantic structure for the form and its sections.
- **CSS3** – responsive styling, chip controls, warning banners, and tooltips; no external frameworks.
- **Vanilla JavaScript** – dynamic logic for field visibility, validation, quick actions, and state management.

### Project Goals

This repo emphasizes:

- Building dynamic UIs without frameworks.
- Organizing incident-specific configuration data for reuse.
- Responding to user input in real time (validation + warnings).
- Structuring code for maintainability in a single-page widget.

### Patient Management Features

The patient management system allows you to:

- **Store comprehensive patient profiles** with:
  - Full name (required)
  - MA number / service number
  - Unit / team / role
  - Date of birth (age auto-calculated)
  - Sex
  - **Patient photo** – upload and store patient images securely
  - Allergies (with quick-add buttons for common allergies)
  - Regular medications (with quick-add buttons for common medications)
  - Medical history
  - Emergency contact information

- **Link patients to incidents**: Each incident can be linked to a patient, allowing you to track a patient's medical history across multiple incidents over time.

- **Patient dashboard**: View all patients with their photos, search by name/MA number/unit, and see linked incidents for each patient.

- **Quick patient selection**: When creating an incident, select an existing patient from a dropdown to auto-fill their name and service number.

- **Export/import patients**: Export patient data to JSON files and import them back, with options to merge with existing patients or replace them entirely.

- **Image management**: Upload, preview, and remove patient photos directly from the patient form. Images are stored securely in IndexedDB.

### Storage & Data Management

**IndexedDB Storage (v1.1.1+):**
- All data (incidents, patients, settings, and images) is stored in IndexedDB for improved security and performance
- Automatic migration from localStorage ensures seamless upgrades
- Larger storage capacity compared to localStorage
- Better suited for binary data like patient images
- 100% backward compatible – existing data is automatically preserved

**Settings:**
- Access the settings modal via the settings button in the header
- Toggle military features on/off
- Import incidents and patients from JSON files
- Export data for backup or transfer between devices

### Future Iterations (Ideas)

- Introduce user authentication or role-based fields (e.g., medic vs. safety coordinator).
- Expand reporting to include attachments or photo uploads for incidents.
- Generate patient medical history reports showing all linked incidents over time.
- Add patient vital sign trends and charts.
- Implement patient medication schedules and reminders.
- Add image annotations or markup tools for patient photos.

---

Feel free to fork the project, experiment with new incident types, or adapt the form for other emergency-response scenarios—including military and deployed operations. Contributions and suggestions are welcome!

