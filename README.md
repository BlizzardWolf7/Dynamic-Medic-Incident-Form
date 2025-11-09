## Dynamic Medic Incident Form

This project is a hands-on practice exercise for building dynamic, data-driven web apps with vanilla JavaScript, HTML, and CSS. It delivers an interactive incident reporting form tailored for on-site medical teams at events, workplaces, and festivals.

### Features at a Glance

- **Two-stage incident selection** – choose a category, then a specific incident type to reveal context-sensitive fields.
- **Adaptive form sections** – location/description, vitals, treatment, workplace reporting, and patient disposition appear only when relevant.
- **Vitals intelligence** – configurable vital sets per incident, live numeric validation, warning banners for dangerous readings, and quick-fill chips for common values.
- **Treatment quick actions** – incident-specific intervention shortcuts that append curated actions to the treatment notes.
- **Follow-up workflow** – disposition options with incident-driven defaults and requirements (e.g., ambulance transport enforced for life-threatening cases).
- **Tooltips + warnings** – inline guidance for every field, workplace safety alerts, and layered seriousness warnings (potential / serious / life-threatening).
- **Validation-first UX** – client-side rules ensure required fields, vitals, and follow-ups are complete before mock submission.

### Getting Started

1. Clone or download the project directory to your machine.
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari).
   - No build tools or servers required; it is a plain static asset.
3. Interact with the form:
   - Pick an incident category and type.
   - Toggle vitals, treatments, and follow-up dispositions.
   - Use the quick action chips and hint buttons to see how the UI reacts.
   - Submit to view the mock confirmation alert.

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

- Persist submitted incidents to local storage or a simple backend.
- Add printable/PDF export for post-incident records.
- Introduce user authentication or role-based fields (e.g., medic vs. safety coordinator).
- Expand reporting to include attachments or photo uploads.

---

Feel free to fork the project, experiment with new incident types, or adapt the form for other emergency-response scenarios. Contributions and suggestions are welcome!

