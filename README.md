## Dynamic Medic Incident Form

This project is a hands-on practice exercise for building dynamic, data-driven web apps with vanilla JavaScript, HTML, and CSS. It delivers an interactive incident reporting form tailored for on-site medical teams at events, workplaces, festivals, and deployed military operations.

> **⚠️ Disclaimer:** This project is purely for fun and educational purposes. Since there is no real client or production requirements, the data fields, form requirements, and overall structure may be inconsistent or incomplete. The form is not intended for actual medical use or real-world incident reporting.

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
- **Export workflows** – one-click PDF exports (single incident or entire log), JSON download, and clear-controls for secure handovers.
- **Toast notifications** – instant feedback powered by the [Toast Notification Library](https://github.com/BlizzardWolf7/Toast-Notification-Library) for saves, errors, and handovers.
- **PWA + offline cache** – installable experience with local caching so the form keeps working even with limited connectivity.
- **Validation-first UX** – client-side rules ensure required fields, vitals, and follow-ups are complete before mock submission.

### Getting Started

1. Clone or download the project directory to your machine.
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari).
   - No build tools or servers required; it is a plain static asset.
3. Interact with the form:
   - Pick an incident category and type.
   - Set the operational context (peacetime vs. wartime) to tailor disposition pathways.
   - Toggle vitals, treatments, and follow-up dispositions.
   - Capture incident time with quick actions and record patient identifiers.
   - Log recurring vital checks for prolonged tactical field care (each snapshot timestamps and stores the current vitals).
   - Use the quick action chips and hint buttons to see how the UI reacts.
   - Submit to save the incident locally, then filter, export PDFs, or download JSON from the history tab—toast notifications confirm each action.
4. Open the Quick Reference tab any time for protocol refreshers, mnemonics, and radio formats—filter or search by keyword.
5. (Optional) Install the PWA from your browser or desktop prompt for one-click access, even offline.

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

### Future Iterations (Ideas)

- Introduce user authentication or role-based fields (e.g., medic vs. safety coordinator).
- Expand reporting to include attachments or photo uploads.
- Store patients so you can attach them to multiple incidents over time.
Fields to store:

Full name
MA number / roster ID / service number
Unit / team / role
Date of birth / age
Sex
Allergies
Meds taken regularly
Medical history (as needed)
Emergency contact (optional)
Bonus features:

Quick search by MA number or name

- Link patient ↔ incidents

A patient can be attached to multiple incidents over time.

Examples:

Patient is injured twice during training weeks
Patient has recurring medical checks

- Export patient (with linked incidents)

---

Feel free to fork the project, experiment with new incident types, or adapt the form for other emergency-response scenarios—including military and deployed operations. Contributions and suggestions are welcome!

