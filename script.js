
const APP_VERSION = '1.1.0';

const incidentCategory = document.getElementById('incidentCategory');
const incidentType = document.getElementById('incidentType');
const operationalContext = document.getElementById('operationalContext');
const basicFields = document.getElementById('basicFields');
const vitalsFields = document.getElementById('vitalsFields');
const treatmentFields = document.getElementById('treatmentFields');
const workplaceSection = document.getElementById('workplaceSection');
const workplaceCheckbox = document.getElementById('workplaceIncident');
const workplaceWarning = document.getElementById('workplaceWarning');

const patientNameInput = document.getElementById('patientName');
const rosterNumberInput = document.getElementById('rosterNumber');
const incidentTimeInput = document.getElementById('incidentDateTime');
const incidentTimeQuickActions = document.getElementById('incidentTimeQuickActions');
const locationInput = document.getElementById('location');
const descriptionInput = document.getElementById('description');
const mechanismInput = document.getElementById('mechanismOfInjury');
const avpuSelect = document.getElementById('avpu');
const bloodPressureInput = document.getElementById('bloodPressure');
const spo2Input = document.getElementById('spo2');
const heartRateInput = document.getElementById('heartRate');
const respiratoryRateInput = document.getElementById('respiratoryRate');
const temperatureInput = document.getElementById('temperature');
const bloodGlucoseInput = document.getElementById('bloodGlucose');
const painScoreInput = document.getElementById('painScore');
const pupilResponseInput = document.getElementById('pupilResponse');
const currentStatusSelect = document.getElementById('currentStatus');
const treatmentInput = document.getElementById('treatment');
const treatmentQuickActions = document.getElementById('treatmentQuickActions');
const form = document.getElementById('incidentForm');
const followUpSection = document.getElementById('followUpSection');
const followUpOptions = Array.from(document.querySelectorAll('input[name="followUp"]'));
const followUpOptionWrappers = followUpOptions.reduce((map, option) => {
  map.set(option.value, option.closest('.follow-up-option'));
  return map;
}, new Map());
const followUpOptionByValue = new Map(followUpOptions.map((option) => [option.value, option]));
const followUpOptionContextMap = new Map(
  Array.from(followUpOptionWrappers.entries()).map(([value, wrapper]) => {
    const contextAttr = wrapper?.dataset?.context || 'both';
    const normalized = contextAttr.split(',').map((ctx) => ctx.trim().toLowerCase()).filter(Boolean);
    if (!normalized.length || normalized.includes('both')) {
      return [value, ['peace', 'war']];
    }
    return [value, normalized];
  })
);
const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
const tabPanes = {
  add: document.getElementById('addIncidentPane'),
  dashboard: document.getElementById('dashboardPane'),
  view: document.getElementById('viewIncidentsPane'),
  guide: document.getElementById('guidePane')
};
const incidentListContainer = document.getElementById('incidentList');
const printContainer = document.getElementById('printContainer');
const versionDisplay = document.getElementById('appVersionDisplay');
if (versionDisplay) {
  versionDisplay.textContent = `Version ${APP_VERSION}`;
}
const refreshDashboardButton = document.getElementById('refreshDashboard');
const dashboardMetrics = {
  total: document.getElementById('dashboardTotalIncidents'),
  last24: document.getElementById('dashboardLast24Hours'),
  lifeThreatening: document.getElementById('dashboardLifeThreatening'),
  serious: document.getElementById('dashboardSerious'),
  peace: document.getElementById('dashboardPeaceCount'),
  war: document.getElementById('dashboardWarCount'),
  active: document.getElementById('dashboardActiveIncidents'),
  completed: document.getElementById('dashboardCompletedIncidents')
};
const dashboardCategoryList = document.getElementById('dashboardCategoryList');
const dashboardStatusList = document.getElementById('dashboardStatusList');
const dashboardIncidentTypeList = document.getElementById('dashboardIncidentTypeList');
const dashboardFollowUpList = document.getElementById('dashboardFollowUpList');
const dashboardRecentList = document.getElementById('dashboardRecentList');
const printIncidentsButton = document.getElementById('printIncidents');
const downloadIncidentsButton = document.getElementById('downloadIncidents');
const clearIncidentsButton = document.getElementById('clearIncidents');
const filterSearchInput = document.getElementById('filterSearch');
const filterCategorySelect = document.getElementById('filterCategory');
const filterStatusSelect = document.getElementById('filterStatus');
const filterContextSelect = document.getElementById('filterContext');
const filterDispositionSelect = document.getElementById('filterDisposition');
const filterSeriousnessSelect = document.getElementById('filterSeriousness');
const filterTimeFromInput = document.getElementById('filterTimeFrom');
const filterTimeToInput = document.getElementById('filterTimeTo');
const applyFiltersButton = document.getElementById('applyFilters');
const clearFiltersButton = document.getElementById('clearFilters');
const guideSearchInput = document.getElementById('guideSearch');
const guideCategorySelect = document.getElementById('guideCategory');
const guideResultsContainer = document.getElementById('guideResults');
const INCIDENT_STORAGE_KEY = 'incidentFormRecords';
let incidentRecords = [];
let filteredRecords = [];
const followUpOptionLabels = new Map();
followUpOptionWrappers.forEach((wrapper, value) => {
  const labelText = wrapper?.querySelector('span')?.textContent?.trim() || '';
  followUpOptionLabels.set(value, labelText);
});
const STATUS_CONFIG = {
  active: {
    label: 'Active / ongoing care',
    badge: 'Active',
    tone: 'info'
  },
  monitoring: {
    label: 'Monitoring / awaiting follow-up',
    badge: 'Monitoring',
    tone: 'warning'
  },
  completed: {
    label: 'Completed / handed off',
    badge: 'Completed',
    tone: 'success'
  }
};
const getStatusConfig = (value) => STATUS_CONFIG[value] || STATUS_CONFIG.active;
const AVPU_CONFIG = {
  alert: 'Alert',
  verbal: 'Responds to verbal',
  pain: 'Responds to pain',
  unresponsive: 'Unresponsive'
};
const getAvpuLabel = (value, fallback = '') => {
  if (!value) return fallback;
  return AVPU_CONFIG[value] || fallback || value;
};
const exportDispositionOptions = () => {
  const unique = new Map();
  followUpOptionLabels.forEach((label, value) => {
    if (label) {
      unique.set(value, label);
    }
  });
  return Array.from(unique.entries()).map(([value, label]) => ({ value, label }));
};
const guidebookData = Array.isArray(window.GUIDEBOOK_DATA) ? window.GUIDEBOOK_DATA : [];
const prolongedCareSection = document.getElementById('prolongedCareSection');
const checkupTimeInput = document.getElementById('checkupTime');
const checkupNotesInput = document.getElementById('checkupNotes');
const recordCheckupButton = document.getElementById('recordCheckupButton');
const checkupList = document.getElementById('checkupList');
const checkupPlaceholder = document.getElementById('checkupPlaceholder');
const editBanner = document.getElementById('editBanner');
const editRecordLabel = document.getElementById('editRecordLabel');
const cancelEditButton = document.getElementById('cancelEditButton');
let vitalsSnapshots = [];
let editingRecordId = null;
let editingOriginalTimestamp = null;
const renderCheckupList = () => {
  if (!checkupList) {
    return;
  }
  checkupList.innerHTML = '';
  if (!vitalsSnapshots.length) {
    if (checkupPlaceholder) {
      checkupPlaceholder.classList.remove('hidden');
    }
    return;
  }
  if (checkupPlaceholder) {
    checkupPlaceholder.classList.add('hidden');
  }

  vitalsSnapshots.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'checkup-item';

    const header = document.createElement('div');
    header.className = 'checkup-item__header';
    header.textContent = entry.label;
    item.appendChild(header);

    const vitalsMeta = document.createElement('div');
    vitalsMeta.className = 'checkup-item__meta';
    const vitalPieces = Object.entries(entry.vitals)
      .map(([key, value]) => `${(vitalLabelMap.get(key) || key)}: ${value}`);
    vitalsMeta.textContent = vitalPieces.join(' • ');
    item.appendChild(vitalsMeta);

    if (entry.notes) {
      const notes = document.createElement('div');
      notes.className = 'checkup-item__notes';
      notes.textContent = entry.notes;
      item.appendChild(notes);
    }

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'checkup-item__delete';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      vitalsSnapshots.splice(index, 1);
      renderCheckupList();
      pushToast('Follow-up check removed.', { type: 'info' });
    });
    item.appendChild(removeButton);

    checkupList.appendChild(item);
  });
};
const resetProlongedCareState = () => {
  vitalsSnapshots = [];
  if (checkupTimeInput) {
    checkupTimeInput.value = formatDateTimeLocal(new Date());
  }
  if (checkupNotesInput) {
    checkupNotesInput.value = '';
  }
  renderCheckupList();
};
const resetFormState = () => {
  form.reset();
  incidentCategory.value = '';
  setIncidentTypeOptions('');
  incidentType.value = '';
  updateFieldVisibility('');
  clearFollowUpSelection();
  incidentTimeInput.dataset.unknown = 'false';
  if (incidentTimeInput) {
    incidentTimeInput.value = '';
  }
  if (mechanismInput) {
    mechanismInput.value = '';
  }
  if (avpuSelect) {
    avpuSelect.value = '';
  }
  if (currentStatusSelect) {
    currentStatusSelect.value = 'active';
  }
  workplaceCheckbox.checked = false;
  workplaceWarning.classList.add('hidden');
  followUpWarning.classList.add('hidden');
  followUpWarning.textContent = '';
  treatmentQuickActions.innerHTML = '';
  treatmentQuickActions.classList.add('hidden');
  resetProlongedCareState();
  updateFollowUpContextVisibility();
};
const exitEditingMode = ({ notify = false, resetForm = false } = {}) => {
  editingRecordId = null;
  editingOriginalTimestamp = null;
  if (editBanner) {
    editBanner.classList.add('hidden');
  }
  if (editRecordLabel) {
    editRecordLabel.textContent = '';
  }
  if (resetForm) {
    resetFormState();
  }
  if (notify) {
    pushToast('Edit cancelled.', { type: 'info' });
  }
};
const startEditingIncident = (recordId) => {
  const record = incidentRecords.find((item) => item.id === recordId);
  if (!record) {
    pushToast('Incident not found for editing.', { type: 'error' });
    return;
  }

  editingRecordId = recordId;
  editingOriginalTimestamp = record.timestamp;

  resetFormState();

  if (record.context?.value) {
    operationalContext.value = record.context.value;
  }
  updateFollowUpContextVisibility();

  if (record.category?.value) {
    incidentCategory.value = record.category.value;
    setIncidentTypeOptions(record.category.value);
  } else {
    incidentCategory.value = '';
    setIncidentTypeOptions('');
  }

  incidentType.value = record.incident?.value || '';
  updateFieldVisibility(incidentType.value);

  patientNameInput.value = record.patientName || '';
  rosterNumberInput.value = record.rosterNumber || '';

  if (record.incidentTime) {
    const incidentTime = record.incidentTime;
    incidentTimeInput.dataset.unknown = incidentTime.unknown ? 'true' : 'false';
    if (incidentTime.raw) {
      incidentTimeInput.value = incidentTime.raw;
    } else if (incidentTime.value) {
      const parsed = new Date(incidentTime.value);
      if (!Number.isNaN(parsed.getTime())) {
        incidentTimeInput.value = formatDateTimeLocal(parsed);
      }
    } else {
      incidentTimeInput.value = '';
    }
  } else {
    incidentTimeInput.dataset.unknown = 'false';
    incidentTimeInput.value = '';
  }

  locationInput.value = record.location || '';
  descriptionInput.value = record.description || '';
  if (mechanismInput) {
    mechanismInput.value = record.mechanismOfInjury || '';
  }
  if (avpuSelect) {
    const avpuValue =
      record.avpu?.value ||
      (typeof record.avpu === 'string' ? record.avpu : '') ||
      record.vitals?.avpu ||
      '';
    avpuSelect.value = AVPU_CONFIG[avpuValue] ? avpuValue : '';
  }
  if (currentStatusSelect) {
    const statusValue = record.status?.value || 'active';
    currentStatusSelect.value = STATUS_CONFIG[statusValue] ? statusValue : 'active';
  }
  treatmentInput.value = record.treatment || '';

  workplaceCheckbox.checked = Boolean(record.workplace);
  workplaceWarning.classList.toggle('hidden', !workplaceCheckbox.checked);

  Object.entries(vitalInputMap).forEach(([key, input]) => {
    const value = record.vitals?.[key] || '';
    input.value = value;
    evaluateVital(key);
  });

  followUpOptions.forEach((option) => {
    option.checked = option.value === record.followUp?.value;
  });
  if (record.followUp?.value === 'other') {
    followUpOtherWrapper.classList.remove('hidden');
    followUpOtherInput.value = record.followUpNotes || '';
  } else {
    followUpOtherWrapper.classList.add('hidden');
    followUpOtherInput.value = record.followUpNotes || '';
  }

  vitalsSnapshots = Array.isArray(record.prolongedCare)
    ? record.prolongedCare.map((entry) => ({
        timestamp: entry.timestamp || new Date().toISOString(),
        label:
          entry.label ||
          (entry.timestamp ? formatTimestamp(entry.timestamp) : 'Follow-up assessment'),
        vitals: { ...(entry.vitals || {}) },
        notes: entry.notes || ''
      }))
    : [];
  renderCheckupList();
  if (checkupTimeInput) {
    checkupTimeInput.value = formatDateTimeLocal(new Date());
  }
  if (checkupNotesInput) {
    checkupNotesInput.value = '';
  }

  if (editRecordLabel) {
    editRecordLabel.textContent =
      record.patientName ||
      record.rosterNumber ||
      record.incident?.label ||
      record.id;
  }
  if (editBanner) {
    editBanner.classList.remove('hidden');
  }

  setActiveTab('add');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  pushToast('Incident loaded for editing. Update fields and submit to save.', { type: 'info' });
};
if (recordCheckupButton) {
  recordCheckupButton.addEventListener('click', () => {
    const rawTimestamp = checkupTimeInput?.value?.trim();
    const timestampString = rawTimestamp || formatDateTimeLocal(new Date());
    const timestampDate = new Date(timestampString);
    if (Number.isNaN(timestampDate.getTime())) {
      pushToast('Enter a valid timestamp before logging the follow-up check.', { type: 'error' });
      return;
    }
    if (checkupTimeInput) {
      checkupTimeInput.value = formatDateTimeLocal(timestampDate);
    }

    const snapshotVitals = {};
    let hasValue = false;
    Object.entries(vitalInputMap).forEach(([key, input]) => {
      const value = input.value.trim();
      if (value) {
        snapshotVitals[key] = value;
        hasValue = true;
      }
    });

    if (!hasValue) {
      pushToast('Record at least one vital before adding a follow-up check.', { type: 'warning' });
      return;
    }

    const snapshot = {
      timestamp: timestampDate.toISOString(),
      label: timestampDate.toLocaleString(),
      vitals: { ...snapshotVitals },
      notes: checkupNotesInput?.value?.trim() || ''
    };

    vitalsSnapshots.push(snapshot);
    renderCheckupList();
    if (checkupNotesInput) {
      checkupNotesInput.value = '';
    }
    if (checkupTimeInput) {
      checkupTimeInput.value = formatDateTimeLocal(new Date());
    }
    pushToast('Follow-up check logged.', { type: 'success' });
  });
}

if (cancelEditButton) {
  cancelEditButton.addEventListener('click', () => {
    exitEditingMode({ notify: true, resetForm: true });
    setActiveTab('add');
  });
}

const getGuideMatches = (query, categoryId) => {
  const normalizedQuery = query.toLowerCase();
  return guidebookData
    .filter((category) => !categoryId || category.id === categoryId)
    .map((category) => {
      const filteredEntries = category.entries.filter((entry) => {
        if (!normalizedQuery) {
          return true;
        }
        const haystack = [
          category.title,
          entry.title,
          entry.tags?.join(' ') || '',
          entry.content
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      });
      return { ...category, entries: filteredEntries };
    })
    .filter((category) => category.entries.length);
};

const renderGuideResults = () => {
  if (!guideResultsContainer) {
    return;
  }
  const selectedCategory = guideCategorySelect?.value || '';
  const searchValue = guideSearchInput?.value?.trim() || '';
  const matches = getGuideMatches(searchValue, selectedCategory);

  guideResultsContainer.innerHTML = '';

  if (!matches.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No reference notes match your search. Adjust the filters to broaden the results.';
    guideResultsContainer.appendChild(empty);
    return;
  }

  matches.forEach((category) => {
    const categoryBlock = document.createElement('article');
    categoryBlock.className = 'guide-category';

    const title = document.createElement('h3');
    title.className = 'guide-category__title';
    title.textContent = category.title;
    categoryBlock.appendChild(title);

    category.entries.forEach((entry) => {
      const entryBlock = document.createElement('section');
      entryBlock.className = 'guide-entry';

      const header = document.createElement('div');
      header.className = 'guide-entry__header';

      const entryTitle = document.createElement('h4');
      entryTitle.className = 'guide-entry__title';
      entryTitle.textContent = entry.title;
      header.appendChild(entryTitle);

      if (entry.tags?.length) {
        const tagList = document.createElement('div');
        tagList.className = 'guide-entry__tags';
        entry.tags.forEach((tag) => {
          const tagChip = document.createElement('span');
          tagChip.className = 'guide-entry__tag';
          tagChip.textContent = tag;
          tagList.appendChild(tagChip);
        });
        header.appendChild(tagList);
      }

      entryBlock.appendChild(header);

      const contentContainer = document.createElement('div');
      contentContainer.className = 'guide-entry__content';

      const contentLines = (entry.content || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      let activeList = null;
      const flushList = () => {
        if (activeList) {
          contentContainer.appendChild(activeList);
          activeList = null;
        }
      };

      contentLines.forEach((line) => {
        if (line.startsWith('- ') || line.startsWith('• ')) {
          if (!activeList) {
            activeList = document.createElement('ul');
            activeList.className = 'guide-entry__list';
          }
          const item = document.createElement('li');
          item.textContent = line.replace(/^[-•]\s*/, '');
          activeList.appendChild(item);
          return;
        }

        flushList();

        const colonIndex = line.indexOf(':');
        if (colonIndex > 0 && colonIndex < line.length - 1) {
          const label = line.slice(0, colonIndex).trim();
          const value = line.slice(colonIndex + 1).trim();

          const fact = document.createElement('div');
          fact.className = 'guide-entry__fact';

          const term = document.createElement('span');
          term.className = 'guide-entry__fact-term';
          term.textContent = `${label}:`;

          const detail = document.createElement('span');
          detail.className = 'guide-entry__fact-detail';
          detail.textContent = value;

          fact.appendChild(term);
          fact.appendChild(detail);
          contentContainer.appendChild(fact);
        } else {
          const paragraph = document.createElement('p');
          paragraph.className = 'guide-entry__paragraph';
          paragraph.textContent = line;
          contentContainer.appendChild(paragraph);
        }
      });

      flushList();

      if (contentContainer.childElementCount) {
        entryBlock.appendChild(contentContainer);
      }

      if (Array.isArray(entry.media) && entry.media.length) {
        const mediaContainer = document.createElement('div');
        mediaContainer.className = 'guide-entry__media';

        entry.media.forEach((mediaItem) => {
          if (!mediaItem || mediaItem.type !== 'image' || !mediaItem.src) {
            return;
          }
          const figure = document.createElement('figure');
          figure.className = 'guide-entry__media-item';

          const img = document.createElement('img');
          img.src = mediaItem.src;
          img.alt = mediaItem.alt || `${entry.title} reference graphic`;
          img.loading = mediaItem.loading || 'lazy';
          img.decoding = 'async';
          if (mediaItem.width) {
            img.style.maxWidth = `${mediaItem.width}px`;
          }
          figure.appendChild(img);

          if (mediaItem.caption) {
            const caption = document.createElement('figcaption');
            caption.className = 'guide-entry__media-caption';
            caption.textContent = mediaItem.caption;
            figure.appendChild(caption);
          }

          mediaContainer.appendChild(figure);
        });

        if (mediaContainer.childElementCount) {
          entryBlock.appendChild(mediaContainer);
        }
      }

      if (Array.isArray(entry.references) && entry.references.length) {
        const referencesWrapper = document.createElement('div');
        referencesWrapper.className = 'guide-entry__references';

        const referencesTitle = document.createElement('h5');
        referencesTitle.className = 'guide-entry__references-title';
        referencesTitle.textContent = 'References';
        referencesWrapper.appendChild(referencesTitle);

        const referencesList = document.createElement('ul');
        referencesList.className = 'guide-entry__references-list';

        entry.references.forEach((ref) => {
          if (!ref) return;
          const listItem = document.createElement('li');

          const link = document.createElement('a');
          link.className = 'guide-entry__reference-link';
          link.href = ref;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = ref;

          listItem.appendChild(link);
          referencesList.appendChild(listItem);
        });

        if (referencesList.childElementCount) {
          referencesWrapper.appendChild(referencesList);
          entryBlock.appendChild(referencesWrapper);
        }
      }

      categoryBlock.appendChild(entryBlock);
    });

    guideResultsContainer.appendChild(categoryBlock);
  });
};

const populateGuideCategories = () => {
  if (!guideCategorySelect) {
    return;
  }
  guideCategorySelect.innerHTML = '<option value="">All categories</option>';
  guidebookData.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.title;
    guideCategorySelect.appendChild(option);
  });
};

const followUpOtherWrapper = document.getElementById('followUpOtherWrapper');
const followUpOtherInput = document.getElementById('followUpOther');
const followUpWarning = document.getElementById('followUpWarning');
const followUpWarningMessages = {
  peace: {
    lifeThreatening: 'Life-threatening incident: coordinate ambulance transport unless the patient refuses care.',
    potentialLifeThreatening: 'Potentially life-threatening: monitor closely and escalate to ambulance transport if symptoms worsen.',
    serious: 'Serious incident: arrange physician follow-up or hospital evaluation and monitor for deterioration.'
  },
  war: {
    lifeThreatening: 'Life-threatening incident: coordinate MEDEVAC or the highest available evacuation platform unless refused.',
    potentialLifeThreatening: 'Potentially life-threatening: maintain advanced monitoring and prepare for rapid MEDEVAC if condition declines.',
    serious: 'Serious incident: route casualty to the appropriate Role 2/Role 3 capability and maintain combat casualty documentation.'
  }
};

const pushToast = (
  text,
  {
    type = 'info',
    duration
  } = {}
) => {
  const message = text ?? '';
  const toastOptions = {
    text: message,
    type,
    duration: duration ?? (type === 'error' ? 7000 : type === 'warning' ? 6000 : 4000),
    position: 'top-right',
    close: true,
    showTimerBar: true
  };
  if (typeof window.showToast === 'function') {
    window.showToast(toastOptions);
  } else if (type === 'error' || type === 'warning') {
    window.alert(message);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
};

const preparePrint = (records, { title = 'Incident Export', subtitle } = {}) => {
  if (!printContainer || !Array.isArray(records) || !records.length) {
    return;
  }

  printContainer.innerHTML = '';
  const wrapper = document.createElement('section');
  wrapper.className = 'incident-history incident-history--print';

  const heading = document.createElement('h3');
  heading.textContent = title;
  wrapper.appendChild(heading);

  const hint = document.createElement('p');
  hint.className = 'history-hint';
  hint.textContent = subtitle || `Generated on ${new Date().toLocaleString()}`;
  wrapper.appendChild(hint);

  records.forEach((record) => {
    const card = buildIncidentCard(record, { includeActions: false });
    wrapper.appendChild(card);
  });

  printContainer.appendChild(wrapper);

  const cleanup = () => {
    document.body.classList.remove('printing');
    if (printContainer) {
      printContainer.innerHTML = '';
    }
  };

  const handleAfterPrint = () => {
    cleanup();
    window.removeEventListener('afterprint', handleAfterPrint);
  };

  document.body.classList.add('printing');
  setActiveTab('view');

  requestAnimationFrame(() => {
    window.addEventListener('afterprint', handleAfterPrint);
    window.print();
    // Fallback cleanup in case afterprint is not fired
    setTimeout(cleanup, 1200);
  });
};

const exportIncidentAsPdf = (recordId) => {
  const record = incidentRecords.find((item) => item.id === recordId);
  if (!record) {
    pushToast('Unable to locate the requested incident.', { type: 'error' });
    return;
  }
  preparePrint([record], { title: 'Incident Handover Export' });
};

const exportLogAsPdf = () => {
  const recordsForExport = filteredRecords.length
    ? filteredRecords
    : incidentRecords.slice().reverse();
  if (!recordsForExport.length) {
    pushToast('No incidents matching the current filters to export.', { type: 'warning' });
    return;
  }
  preparePrint(recordsForExport, {
    title: 'Incident Log Export',
    subtitle: `Total incidents: ${recordsForExport.length} — Generated on ${new Date().toLocaleString()}`
  });
};

const downloadIncidents = () => {
  const recordsForExport = filteredRecords.length
    ? filteredRecords
    : incidentRecords.slice().reverse();
  if (!recordsForExport.length) {
    pushToast('No incidents matching the current filters to export.', { type: 'warning' });
    return;
  }
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    total: recordsForExport.length,
    incidents: recordsForExport
  };
  const data = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `incident-log-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const clearIncidents = () => {
  if (!incidentRecords.length) {
    pushToast('No stored incidents to clear.', { type: 'warning' });
    return;
  }
  const confirmed = confirm('This will remove all stored incidents from this browser. Continue?');
  if (!confirmed) {
    return;
  }
  incidentRecords = [];
  saveIncidentsToStorage();
  renderDashboard();
  exitEditingMode({ notify: false, resetForm: true });
  clearFilters();
  pushToast('All stored incidents cleared from this browser.', { type: 'success' });
};

const deleteIncident = (recordId) => {
  const index = incidentRecords.findIndex((record) => record.id === recordId);
  if (index === -1) {
    pushToast('Incident not found.', { type: 'error' });
    return;
  }
  const confirmed = confirm('Delete this incident from local storage? This cannot be undone.');
  if (!confirmed) {
    return;
  }
  incidentRecords.splice(index, 1);
  saveIncidentsToStorage();
  updateDispositionFilterOptions();
  applyFilters();
  renderDashboard();
  if (editingRecordId === recordId) {
    exitEditingMode({ notify: false, resetForm: true });
  }
  pushToast('Incident removed from local storage.', { type: 'success' });
};

if (printIncidentsButton) {
  printIncidentsButton.addEventListener('click', () => {
    exportLogAsPdf();
  });
}

if (downloadIncidentsButton) {
  downloadIncidentsButton.addEventListener('click', () => {
    downloadIncidents();
  });
}

if (clearIncidentsButton) {
  clearIncidentsButton.addEventListener('click', () => {
    clearIncidents();
  });
}

if (applyFiltersButton) {
  applyFiltersButton.addEventListener('click', () => {
    applyFilters();
  });
}

if (clearFiltersButton) {
  clearFiltersButton.addEventListener('click', () => {
    clearFilters();
  });
}

[
  filterCategorySelect,
  filterContextSelect,
  filterDispositionSelect,
  filterSeriousnessSelect,
  filterTimeFromInput,
  filterTimeToInput
].forEach((control) => {
  control?.addEventListener('change', () => applyFilters());
});

let filterSearchTimer;
if (filterSearchInput) {
  filterSearchInput.addEventListener('input', () => {
    clearTimeout(filterSearchTimer);
    filterSearchTimer = setTimeout(applyFilters, 250);
  });
}

if (guideSearchInput) {
  let guideSearchTimer;
  guideSearchInput.addEventListener('input', () => {
    clearTimeout(guideSearchTimer);
    guideSearchTimer = setTimeout(renderGuideResults, 200);
  });
}

if (guideCategorySelect) {
  guideCategorySelect.addEventListener('change', () => renderGuideResults());
}

const setActiveTab = (tabId = 'add') => {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabId;
    button.classList.toggle('active', isActive);
  });
  Object.entries(tabPanes).forEach(([key, pane]) => {
    if (!pane) return;
    pane.classList.toggle('active', key === tabId);
  });
  if (tabId === 'view') {
    renderIncidentList(filteredRecords.length ? filteredRecords : incidentRecords.slice().reverse());
  } else if (tabId === 'dashboard') {
    renderDashboard();
  } else if (tabId === 'guide') {
    renderGuideResults();
  }
};

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetTab = button.dataset.tab || 'add';
    setActiveTab(targetTab);
  });
});

if (refreshDashboardButton) {
  refreshDashboardButton.addEventListener('click', () => {
    renderDashboard();
    pushToast('Dashboard refreshed.', { type: 'info' });
  });
}

const loadIncidentsFromStorage = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(INCIDENT_STORAGE_KEY));
    if (Array.isArray(stored)) {
      incidentRecords = stored.map((record) => {
        const statusValue = record?.status?.value ?? record?.status;
        const normalizedStatusValue =
          typeof statusValue === 'string' && STATUS_CONFIG[statusValue] ? statusValue : 'active';
        const status = {
          value: normalizedStatusValue,
          label: STATUS_CONFIG[normalizedStatusValue].label
        };

        let avpuValue =
          record?.avpu?.value ??
          (typeof record?.avpu === 'string' ? record.avpu : '');
        if (!avpuValue && typeof record?.vitals?.avpu === 'string') {
          avpuValue = record.vitals.avpu;
        }
        const avpu =
          avpuValue && typeof avpuValue === 'string'
            ? {
                value: avpuValue,
                label: record?.avpu?.label || getAvpuLabel(avpuValue)
              }
            : null;

        return {
          ...record,
          status,
          avpu
        };
      });
    } else {
      incidentRecords = [];
    }
  } catch (error) {
    console.error('Unable to read incidents from storage', error);
    incidentRecords = [];
  }
  renderDashboard();
};

const saveIncidentsToStorage = () => {
  try {
    localStorage.setItem(INCIDENT_STORAGE_KEY, JSON.stringify(incidentRecords));
  } catch (error) {
    console.error('Unable to persist incidents to storage', error);
  }
};

const formatTimestamp = (isoString) => {
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown time';
  }
  return parsed.toLocaleString();
};

const createBadge = (text, tone = 'neutral') => {
  const badge = document.createElement('span');
  badge.className = `badge badge-${tone}`;
  badge.textContent = text;
  return badge;
};

const formatDateTimeLocal = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return '';
  }
  const pad = (value) => String(value).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const applyIncidentTimeQuickAction = (action) => {
  if (!incidentTimeInput) {
    return;
  }

  const now = new Date();
  let targetDate = null;

  switch (action) {
    case 'now':
      targetDate = now;
      break;
    case 'minus-10':
      targetDate = new Date(now.getTime() - 10 * 60 * 1000);
      break;
    case 'minus-30':
      targetDate = new Date(now.getTime() - 30 * 60 * 1000);
      break;
    case 'unknown':
      incidentTimeInput.value = '';
      incidentTimeInput.dataset.unknown = 'true';
      return;
    default:
      return;
  }

  if (targetDate) {
    incidentTimeInput.value = formatDateTimeLocal(targetDate);
    incidentTimeInput.dataset.unknown = 'false';
    incidentTimeInput.dispatchEvent(new Event('change'));
  }
};

if (incidentTimeQuickActions) {
  incidentTimeQuickActions.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) {
      return;
    }
    applyIncidentTimeQuickAction(button.dataset.action);
  });
}

if (incidentTimeInput) {
  incidentTimeInput.dataset.unknown = 'false';
  incidentTimeInput.addEventListener('input', () => {
    if (incidentTimeInput.value) {
      incidentTimeInput.dataset.unknown = 'false';
    } else if (incidentTimeInput.dataset.unknown !== 'true') {
      incidentTimeInput.dataset.unknown = '';
    }
  });
}

const buildIncidentCard = (record, { includeActions = true } = {}) => {
  const card = document.createElement('article');
  card.className = 'incident-card';
  card.dataset.recordId = record.id || '';

  const header = document.createElement('div');
  header.className = 'incident-card__header';

  const title = document.createElement('h4');
  title.textContent = record.patientName || 'Unnamed casualty';
  header.appendChild(title);

  const badgeGroup = document.createElement('div');
  badgeGroup.className = 'badge-group';

  const statusConfig = getStatusConfig(record.status?.value);
  if (statusConfig?.badge) {
    badgeGroup.appendChild(createBadge(statusConfig.badge, statusConfig.tone));
  }

  if (record.rosterNumber) {
    badgeGroup.appendChild(createBadge(record.rosterNumber, 'neutral'));
  }

  if (record.seriousness?.lifeThreatening) {
    badgeGroup.appendChild(createBadge('Life-threatening', 'critical'));
  } else if (record.seriousness?.serious) {
    badgeGroup.appendChild(createBadge('Serious', 'warning'));
  } else if (record.seriousness?.potentialLifeThreatening) {
    badgeGroup.appendChild(createBadge('Potentially Critical', 'warning'));
  }

  if (record.workplace) {
    badgeGroup.appendChild(createBadge('Workplace', 'info'));
  }

  if (badgeGroup.childElementCount) {
    header.appendChild(badgeGroup);
  }

  card.appendChild(header);

  const metaList = document.createElement('ul');
  metaList.className = 'incident-meta';

  const metaEntries = [
    { label: 'Incident', value: record.incident?.label || record.incident?.value },
    { label: 'Category', value: record.category?.label || record.category?.value },
    { label: 'Context', value: record.context?.label || record.context?.value },
    { label: 'Mechanism of injury', value: record.mechanismOfInjury },
    {
      label: 'AVPU',
      value: record.avpu?.label || getAvpuLabel(record.avpu?.value || record.vitals?.avpu || '')
    },
    { label: 'Status', value: record.status?.label || statusConfig.label },
    { label: 'Incident time', value: record.incidentTime?.label },
    { label: 'Logged at', value: formatTimestamp(record.timestamp) },
    { label: 'Updated', value: record.updatedAt ? formatTimestamp(record.updatedAt) : '' },
    { label: 'Location', value: record.location }
  ];

  metaEntries.forEach(({ label, value }) => {
    if (!value) return;
    const item = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${label}:`;
    item.appendChild(strong);
    item.append(` ${value}`);
    metaList.appendChild(item);
  });

  if (metaList.childElementCount) {
    card.appendChild(metaList);
  }

  if (record.description) {
    const description = document.createElement('p');
    description.className = 'incident-description';
    description.textContent = record.description;
    card.appendChild(description);
  }

  const vitalEntries = Object.entries(record.vitals || {});
  if (vitalEntries.length) {
    const vitalsWrapper = document.createElement('div');
    vitalsWrapper.className = 'incident-vitals';

    const vitalsTitle = document.createElement('h5');
    vitalsTitle.textContent = 'Recorded Vitals';
    vitalsWrapper.appendChild(vitalsTitle);

    const vitalsList = document.createElement('ul');
    vitalEntries.forEach(([key, value]) => {
      if (!value) return;
      const listItem = document.createElement('li');
      const label = vitalLabelMap.get(key) || key;
      const displayValue = key === 'avpu' ? getAvpuLabel(value, value) : value;
      listItem.textContent = `${label}: ${displayValue}`;
      vitalsList.appendChild(listItem);
    });
    if (vitalsList.childElementCount) {
      vitalsWrapper.appendChild(vitalsList);
      card.appendChild(vitalsWrapper);
    }
  }

  if (record.treatment) {
    const treatment = document.createElement('p');
    treatment.className = 'incident-treatment';
    treatment.textContent = record.treatment;
    card.appendChild(treatment);
  }

  if (record.followUp?.label) {
    const followUp = document.createElement('p');
    followUp.className = 'incident-followup';
    let followUpText = `Follow-up: ${record.followUp.label}`;
    if (record.followUpNotes) {
      followUpText += ` — ${record.followUpNotes}`;
    }
    followUp.textContent = followUpText;
    card.appendChild(followUp);
  }

    if (Array.isArray(record.prolongedCare) && record.prolongedCare.length) {
      const prolongedWrapper = document.createElement('div');
      prolongedWrapper.className = 'incident-vitals prolonged-checkups';
      const prolongedTitle = document.createElement('h5');
      prolongedTitle.textContent = 'Follow-up Checks';
      prolongedWrapper.appendChild(prolongedTitle);
      const prolongedList = document.createElement('ul');
      record.prolongedCare.forEach((entry) => {
        const item = document.createElement('li');
        const label = entry.label || (entry.timestamp ? formatTimestamp(entry.timestamp) : 'Assessment');
        const vitalsDescription = Object.entries(entry.vitals || {})
          .map(([key, value]) => `${vitalLabelMap.get(key) || key}: ${value}`)
          .join(' • ');
        let line = vitalsDescription ? `${label} — ${vitalsDescription}` : label;
        if (entry.notes) {
          line += ` (${entry.notes})`;
        }
        item.textContent = line;
        prolongedList.appendChild(item);
      });
      prolongedWrapper.appendChild(prolongedList);
      card.appendChild(prolongedWrapper);
    }

  if (includeActions) {
    const actions = document.createElement('div');
    actions.className = 'incident-card__actions';

      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.className = 'incident-card__action';
      editButton.textContent = 'Edit incident';
      editButton.addEventListener('click', () => startEditingIncident(record.id));

    const exportButton = document.createElement('button');
    exportButton.type = 'button';
    exportButton.className = 'incident-card__action';
    exportButton.textContent = 'Export this incident (PDF)';
    exportButton.addEventListener('click', () => exportIncidentAsPdf(record.id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'incident-card__action danger';
    deleteButton.textContent = 'Delete incident';
    deleteButton.addEventListener('click', () => deleteIncident(record.id));

      actions.appendChild(editButton);
    actions.appendChild(exportButton);
    actions.appendChild(deleteButton);
    card.appendChild(actions);
  }

  return card;
};

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const getRecordSeriousness = (record) => {
  if (record.seriousness?.lifeThreatening) return 'lifeThreatening';
  if (record.seriousness?.serious) return 'serious';
  if (record.seriousness?.potentialLifeThreatening) return 'potentialLifeThreatening';
  return 'minor';
};

const normalizeString = (value) => value?.toString().toLowerCase().trim() || '';

const matchesFilters = (record, filters) => {
  if (!record) return false;
  const { search, category, status, context, disposition, seriousness, timeFrom, timeTo } = filters;

  if (category && record.category?.value !== category) {
    return false;
  }

  if (context && record.context?.value !== context) {
    return false;
  }

  if (status) {
    const recordStatus = record.status?.value || 'active';
    if (recordStatus !== status) {
      return false;
    }
  }

  if (disposition && record.followUp?.value !== disposition) {
    return false;
  }

  if (seriousness) {
    const recordSeriousness = getRecordSeriousness(record);
    if (recordSeriousness !== seriousness) {
      return false;
    }
  }

  const incidentDate = parseDate(record.incidentTime?.value || record.timestamp);
  if (timeFrom && (!incidentDate || incidentDate < timeFrom)) {
    return false;
  }
  if (timeTo && (!incidentDate || incidentDate > timeTo)) {
    return false;
  }

  if (search) {
    const haystack = [
      record.patientName,
      record.rosterNumber,
      record.description,
      record.treatment,
      record.followUpNotes,
      record.incident?.label,
      record.category?.label,
      record.context?.label,
      record.status?.label,
      record.mechanismOfInjury,
      record.avpu?.label,
      record.followUp?.label,
      Object.values(record.vitals || {}).join(' ')
    ]
      .map(normalizeString)
      .filter(Boolean)
      .join(' ');

    if (!haystack.includes(search)) {
      return false;
    }
  }

  return true;
};

const getFilterCriteria = () => ({
  search: normalizeString(filterSearchInput?.value || ''),
  category: filterCategorySelect?.value || '',
  status: filterStatusSelect?.value || '',
  context: filterContextSelect?.value || '',
  disposition: filterDispositionSelect?.value || '',
  seriousness: filterSeriousnessSelect?.value || '',
  timeFrom: parseDate(filterTimeFromInput?.value),
  timeTo: parseDate(filterTimeToInput?.value)
});

const renderIncidentList = (records = filteredRecords) => {
  if (!incidentListContainer) {
    return;
  }
  incidentListContainer.innerHTML = '';
  if (!records.length) {
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state';
    emptyState.textContent = incidentRecords.length
      ? 'No incidents match the current filters. Adjust filters or clear them to see all incidents.'
      : 'No incidents stored yet. Complete the form on the Add tab to save one locally.';
    incidentListContainer.appendChild(emptyState);
    return;
  }

  records.forEach((record) => {
    const card = buildIncidentCard(record);
    incidentListContainer.appendChild(card);
  });
};

const getIncidentDate = (record) => {
  if (!record) {
    return null;
  }
  const candidates = [
    record.incidentTime?.value,
    record.incidentTime?.raw,
    record.timestamp
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = new Date(candidate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return null;
};

const toPercent = (count, total) => {
  if (!total) return 0;
  return Math.round((count / total) * 100);
};

const renderDashboardList = (container, entries, totalCount, emptyMessage) => {
  if (!container) {
    return;
  }
  container.innerHTML = '';
  if (!entries.length) {
    const empty = document.createElement('li');
    empty.className = 'dashboard-empty';
    empty.textContent = emptyMessage;
    container.appendChild(empty);
    return;
  }

  entries.forEach(({ label, count }) => {
    const item = document.createElement('li');
    item.className = 'dashboard-list__item';

    const name = document.createElement('span');
    name.className = 'dashboard-list__label';
    name.textContent = label;

    const value = document.createElement('span');
    value.className = 'dashboard-list__value';
    const percent = toPercent(count, totalCount);
    value.textContent = `${count.toLocaleString()} • ${percent}%`;

    item.append(name, value);
    container.appendChild(item);
  });
};

const getSeverityBadge = (record) => {
  if (!record?.seriousness) {
    return null;
  }
  if (record.seriousness.lifeThreatening) {
    return createBadge('Life-threatening', 'critical');
  }
  if (record.seriousness.serious) {
    return createBadge('Serious', 'warning');
  }
  if (record.seriousness.potentialLifeThreatening) {
    return createBadge('Potentially Critical', 'warning');
  }
  return null;
};

const renderDashboardRecent = () => {
  if (!dashboardRecentList) {
    return;
  }
  dashboardRecentList.innerHTML = '';
  if (!incidentRecords.length) {
    const empty = document.createElement('li');
    empty.className = 'dashboard-empty';
    empty.textContent = 'No incidents recorded yet.';
    dashboardRecentList.appendChild(empty);
    return;
  }

  const recent = incidentRecords
    .slice()
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      const safeA = Number.isNaN(timeA) ? 0 : timeA;
      const safeB = Number.isNaN(timeB) ? 0 : timeB;
      return safeB - safeA;
    })
    .slice(0, 5);

  recent.forEach((record) => {
    const item = document.createElement('li');
    item.className = 'dashboard-recent__item';

    const titleRow = document.createElement('div');
    titleRow.className = 'dashboard-recent__title';
    titleRow.textContent = record.incident?.label || 'Unspecified incident';
    const severityBadge = getSeverityBadge(record);
    if (severityBadge) {
      severityBadge.classList.add('dashboard-recent__badge');
      titleRow.appendChild(severityBadge);
    }
    item.appendChild(titleRow);

    const metaRow = document.createElement('div');
    metaRow.className = 'dashboard-recent__meta';
    const pieces = [];
    const statusConfig = getStatusConfig(record.status?.value);
    if (record.context?.label) {
      pieces.push(record.context.label);
    }
    if (record.category?.label) {
      pieces.push(record.category.label);
    }
    const timeLabel =
      record.incidentTime?.label ||
      formatTimestamp(record.incidentTime?.value || record.incidentTime?.raw || record.timestamp);
    if (timeLabel) {
      pieces.push(timeLabel);
    }
    metaRow.textContent = pieces.join(' • ');
    item.appendChild(metaRow);

    const statusRow = document.createElement('div');
    statusRow.className = 'dashboard-recent__detail';
    statusRow.textContent = `Status: ${record.status?.label || statusConfig.label}`;
    item.appendChild(statusRow);

    if (record.mechanismOfInjury) {
      const moiRow = document.createElement('div');
      moiRow.className = 'dashboard-recent__detail';
      moiRow.textContent = `MOI: ${record.mechanismOfInjury}`;
      item.appendChild(moiRow);
    }

    const avpuLabel =
      record.avpu?.label ||
      getAvpuLabel(record.avpu?.value || record.vitals?.avpu || '');
    if (avpuLabel) {
      const avpuRow = document.createElement('div');
      avpuRow.className = 'dashboard-recent__detail';
      avpuRow.textContent = `AVPU: ${avpuLabel}`;
      item.appendChild(avpuRow);
    }

    if (record.location) {
      const locationRow = document.createElement('div');
      locationRow.className = 'dashboard-recent__detail';
      locationRow.textContent = `Location: ${record.location}`;
      item.appendChild(locationRow);
    }

    if (record.followUp?.label) {
      const followUpRow = document.createElement('div');
      followUpRow.className = 'dashboard-recent__detail';
      followUpRow.textContent = `Disposition: ${record.followUp.label}`;
      item.appendChild(followUpRow);
    }

    dashboardRecentList.appendChild(item);
  });
};

const renderDashboard = () => {
  if (!tabPanes.dashboard) {
    return;
  }
  const total = incidentRecords.length;
  const now = Date.now();
  const dayWindow = 24 * 60 * 60 * 1000;
  let last24h = 0;
  let lifeThreateningCount = 0;
  let seriousCount = 0;
  let peaceCount = 0;
  let warCount = 0;

  const increment = (map, key, label) => {
    const normalizedKey = key || label || 'unknown';
    const normalizedLabel = label || key || 'Unspecified';
    const existing = map.get(normalizedKey);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(normalizedKey, { key: normalizedKey, label: normalizedLabel, count: 1 });
    }
  };

  const categoryCounts = new Map();
  const incidentTypeCounts = new Map();
  const followUpCounts = new Map();
  const statusCounts = new Map();

  incidentRecords.forEach((record) => {
    const incidentDate = getIncidentDate(record);
    if (incidentDate && now - incidentDate.getTime() <= dayWindow) {
      last24h += 1;
    }

    if (record.seriousness?.lifeThreatening) {
      lifeThreateningCount += 1;
    } else if (record.seriousness?.serious || record.seriousness?.potentialLifeThreatening) {
      seriousCount += 1;
    }

    const contextValue = (record.context?.value || '').toLowerCase();
    if (contextValue === 'war') {
      warCount += 1;
    } else if (contextValue === 'peace') {
      peaceCount += 1;
    }

    const categoryLabel = record.category?.label || 'Uncategorized';
    increment(categoryCounts, record.category?.value, categoryLabel);

    const incidentLabel = record.incident?.label || 'Unspecified incident';
    increment(incidentTypeCounts, record.incident?.value, incidentLabel);

    const followUpLabel = record.followUp?.label || 'Not recorded';
    increment(followUpCounts, record.followUp?.value, followUpLabel);

    const statusValue = record.status?.value || 'active';
    const statusLabel = getStatusConfig(statusValue).label;
    increment(statusCounts, statusValue, statusLabel);
  });

  const setMetric = (element, value) => {
    if (!element) return;
    const safeValue = Number.isFinite(value) ? value : 0;
    element.textContent = safeValue.toLocaleString();
  };

  setMetric(dashboardMetrics.total, total);
  setMetric(dashboardMetrics.last24, last24h);
  setMetric(dashboardMetrics.lifeThreatening, lifeThreateningCount);
  setMetric(dashboardMetrics.serious, seriousCount);
  setMetric(dashboardMetrics.peace, peaceCount);
  setMetric(dashboardMetrics.war, warCount);
  const activeCount = statusCounts.get('active')?.count || 0;
  const completedCount = statusCounts.get('completed')?.count || 0;
  setMetric(dashboardMetrics.active, activeCount);
  setMetric(dashboardMetrics.completed, completedCount);

  const sortedCategories = Array.from(categoryCounts.values()).sort((a, b) => b.count - a.count);
  renderDashboardList(
    dashboardCategoryList,
    sortedCategories,
    total,
    'No category data yet.'
  );

  const sortedStatuses = Array.from(statusCounts.values()).sort((a, b) => b.count - a.count);
  renderDashboardList(
    dashboardStatusList,
    sortedStatuses,
    total,
    'No status updates recorded yet.'
  );

  const sortedIncidentTypes = Array.from(incidentTypeCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  renderDashboardList(
    dashboardIncidentTypeList,
    sortedIncidentTypes,
    total,
    'No incident types logged yet.'
  );

  const sortedFollowUps = Array.from(followUpCounts.values()).sort((a, b) => b.count - a.count);
  renderDashboardList(
    dashboardFollowUpList,
    sortedFollowUps,
    total,
    'No follow-up selections recorded.'
  );

  renderDashboardRecent();
};

const updateDispositionFilterOptions = () => {
  if (!filterDispositionSelect) {
    return;
  }
  const previousValue = filterDispositionSelect.value;
  filterDispositionSelect.innerHTML = '<option value="">All follow-ups</option>';
  exportDispositionOptions().forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    filterDispositionSelect.appendChild(option);
  });
  if (previousValue) {
    filterDispositionSelect.value = previousValue;
  }
};

const applyFilters = () => {
  const filters = getFilterCriteria();
  filteredRecords = incidentRecords
    .slice()
    .reverse()
    .filter((record) => matchesFilters(record, filters));
  renderIncidentList(filteredRecords);
};

const clearFilters = () => {
  updateDispositionFilterOptions();
  if (filterSearchInput) filterSearchInput.value = '';
  if (filterCategorySelect) filterCategorySelect.value = '';
  if (filterStatusSelect) filterStatusSelect.value = '';
  if (filterContextSelect) filterContextSelect.value = '';
  if (filterDispositionSelect) filterDispositionSelect.value = '';
  if (filterSeriousnessSelect) filterSeriousnessSelect.value = '';
  if (filterTimeFromInput) filterTimeFromInput.value = '';
  if (filterTimeToInput) filterTimeToInput.value = '';
  filteredRecords = incidentRecords.slice().reverse();
  renderIncidentList(filteredRecords);
};

const getActiveContext = () => (operationalContext.value === 'war' ? 'war' : 'peace');

const isFollowUpOptionAvailable = (value, context) => {
  const contexts = followUpOptionContextMap.get(value);
  if (!contexts) {
    return true;
  }
  return contexts.includes(context);
};

const selectFollowUpOption = (value) => {
  if (!value) return;
  const option = followUpOptionByValue.get(value);
  if (!option) return;
  const wrapper = followUpOptionWrappers.get(value);
  if (!wrapper || wrapper.classList.contains('hidden')) {
    return;
  }
  option.checked = true;
};

const followUpDefaultsByContext = {
  lifeThreatening: { peace: 'ambulance', war: 'medevac' },
  serious: { peace: null, war: 'role2-surgical' },
  minor: { peace: 'none', war: 'remain-with-unit' }
};

const lifeThreateningDisallowedByContext = {
  peace: ['none', 'doctor', 'pharmacy'],
  war: ['remain-with-unit', 'role1-aid-station']
};

const updateFollowUpContextVisibility = () => {
  const context = getActiveContext();
  let hasValidSelection = false;

  followUpOptionWrappers.forEach((wrapper, value) => {
    if (isFollowUpOptionAvailable(value, context)) {
      wrapper.classList.remove('hidden');
      const option = followUpOptionByValue.get(value);
      if (option?.checked) {
        hasValidSelection = true;
      }
    } else {
      wrapper.classList.add('hidden');
      const option = followUpOptionByValue.get(value);
      if (option) {
        option.checked = false;
      }
    }
  });

  if (!hasValidSelection) {
    followUpOtherWrapper.classList.add('hidden');
    followUpOtherInput.value = '';
  }
};

const incidentData = Array.isArray(window.INCIDENT_DATA) ? window.INCIDENT_DATA : [];

incidentData.forEach(({ id, label }) => {
  const option = document.createElement('option');
  option.value = id;
  option.textContent = label;
  incidentCategory.appendChild(option);

  // Populate category filter
  const filterOption = document.createElement('option');
  filterOption.value = id;
  filterOption.textContent = label;
  filterCategorySelect?.appendChild(filterOption);
});

const setIncidentTypeOptions = (categoryId) => {
  incidentType.innerHTML = '<option value="">--Select incident--</option>';

  if (!categoryId) {
    incidentType.disabled = true;
    return;
  }

  const category = incidentData.find((item) => item.id === categoryId);
  if (!category) {
    incidentType.disabled = true;
    return;
  }

  category.incidents.forEach(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    incidentType.appendChild(option);
  });

  incidentType.disabled = false;
};

const vitalFieldMap = {
  bloodPressure: document.querySelector('[data-vital="bloodPressure"]'),
  spo2: document.querySelector('[data-vital="spo2"]'),
  heartRate: document.querySelector('[data-vital="heartRate"]'),
  respiratoryRate: document.querySelector('[data-vital="respiratoryRate"]'),
  temperature: document.querySelector('[data-vital="temperature"]'),
  bloodGlucose: document.querySelector('[data-vital="bloodGlucose"]'),
  painScore: document.querySelector('[data-vital="painScore"]'),
  pupilResponse: document.querySelector('[data-vital="pupilResponse"]'),
  avpu: document.querySelector('[data-vital="avpu"]')
};

const vitalInputMap = {
  bloodPressure: bloodPressureInput,
  spo2: spo2Input,
  heartRate: heartRateInput,
  respiratoryRate: respiratoryRateInput,
  temperature: temperatureInput,
  bloodGlucose: bloodGlucoseInput,
  painScore: painScoreInput,
  pupilResponse: pupilResponseInput,
  avpu: avpuSelect
};
const vitalLabelMap = new Map();
Object.entries(vitalFieldMap).forEach(([key, field]) => {
  const labelEl = field?.querySelector('label');
  if (labelEl) {
    vitalLabelMap.set(key, labelEl.textContent.replace(':', '').trim());
  }
});

const allowedNonNumericVitalValues = {
  bloodPressure: ['unable to obtain'],
  spo2: ['unknown'],
  heartRate: ['unknown'],
  respiratoryRate: ['unknown'],
  temperature: ['not taken', 'unknown'],
  bloodGlucose: ['not taken', 'unknown'],
  painScore: ['unable to rate'],
  pupilResponse: ['unknown'],
  avpu: ['alert', 'verbal', 'pain', 'unresponsive']
};

const vitalWarningMap = {
  bloodPressure: document.querySelector('[data-warning="bloodPressure"]'),
  spo2: document.querySelector('[data-warning="spo2"]'),
  heartRate: document.querySelector('[data-warning="heartRate"]'),
  respiratoryRate: document.querySelector('[data-warning="respiratoryRate"]'),
  temperature: document.querySelector('[data-warning="temperature"]'),
  bloodGlucose: document.querySelector('[data-warning="bloodGlucose"]')
};

const treatmentQuickActionMap = window.TREATMENT_QUICK_ACTION_MAP || {};

const incidentVitalRequirements = window.INCIDENT_VITAL_REQUIREMENTS || {};

const incidentsRequiringTreatment = new Set(window.INCIDENTS_REQUIRING_TREATMENT || []);

const seriousIncidents = new Set(window.SERIOUS_INCIDENTS || []);

const lifeThreateningIncidents = new Set(window.LIFE_THREATENING_INCIDENTS || []);

const potentialLifeThreateningIncidents = new Set(
  window.POTENTIAL_LIFE_THREATENING_INCIDENTS || []
);

const minorIncidentDefaults = new Set(window.MINOR_INCIDENT_DEFAULTS || []);

const workplaceEligibleIncidents = new Set(window.WORKPLACE_ELIGIBLE_INCIDENTS || []);

const incidentsRequiringAvpu = new Set(window.INCIDENTS_REQUIRING_AVPU || []);

const prolongedCareEligibleIncidents = new Set([
  ...lifeThreateningIncidents,
  ...potentialLifeThreateningIncidents,
  ...seriousIncidents
]);

const collectIncidentData = () => {
  const contextLabel = operationalContext.options[operationalContext.selectedIndex]?.textContent?.trim() || operationalContext.value;
  const categoryLabel = incidentCategory.selectedIndex > 0
    ? incidentCategory.options[incidentCategory.selectedIndex].textContent
    : incidentCategory.value;
  const incidentLabel = incidentType.selectedIndex >= 0
    ? incidentType.options[incidentType.selectedIndex].textContent
    : incidentType.value;

  const vitals = Object.entries(vitalInputMap).reduce((acc, [key, input]) => {
    const value = input.value.trim();
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
  const prolongedCare = vitalsSnapshots.map((entry) => ({
    timestamp: entry.timestamp,
    label: entry.label,
    vitals: { ...entry.vitals },
    notes: entry.notes
  }));

  const followUpValue = followUpOptions.find((option) => option.checked)?.value || '';
  const rawIncidentTime = incidentTimeInput.value.trim();
  const incidentTimeUnknown = incidentTimeInput.dataset.unknown === 'true';
  let incidentTimeISO = '';
  let incidentTimeLabel = '';

  if (rawIncidentTime) {
    const parsedTime = new Date(rawIncidentTime);
    if (!Number.isNaN(parsedTime.getTime())) {
      incidentTimeISO = parsedTime.toISOString();
      incidentTimeLabel = parsedTime.toLocaleString();
    } else {
      incidentTimeLabel = rawIncidentTime;
    }
  } else if (incidentTimeUnknown) {
    incidentTimeLabel = 'Unknown';
  }

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    context: {
      value: operationalContext.value,
      label: contextLabel
    },
    category: {
      value: incidentCategory.value,
      label: categoryLabel
    },
    incident: {
      value: incidentType.value,
      label: incidentLabel
    },
    patientName: patientNameInput.value.trim(),
    rosterNumber: rosterNumberInput.value.trim(),
    incidentTime: {
      value: incidentTimeISO,
      label: incidentTimeLabel,
      raw: rawIncidentTime,
      unknown: incidentTimeUnknown
    },
    location: locationInput.value.trim(),
    mechanismOfInjury: mechanismInput.value.trim(),
    avpu: (() => {
      const value = avpuSelect?.value || '';
      if (!value) {
        return null;
      }
      const label =
        avpuSelect?.options?.[avpuSelect.selectedIndex]?.textContent?.trim() ||
        getAvpuLabel(value);
      return { value, label };
    })(),
    status: (() => {
      const value = currentStatusSelect?.value || 'active';
      const label =
        currentStatusSelect?.options?.[currentStatusSelect.selectedIndex]?.textContent?.trim() ||
        getStatusConfig(value).label;
      return {
        value,
        label
      };
    })(),
    description: descriptionInput.value.trim(),
    vitals,
    treatment: treatmentInput.value.trim(),
    workplace: workplaceCheckbox.checked,
    followUp: {
      value: followUpValue,
      label: followUpOptionLabels.get(followUpValue) || ''
    },
    followUpNotes: followUpOtherInput.value.trim(),
    seriousness: {
      lifeThreatening: lifeThreateningIncidents.has(incidentType.value),
      potentialLifeThreatening: potentialLifeThreateningIncidents.has(incidentType.value),
      serious: seriousIncidents.has(incidentType.value)
    },
    prolongedCare
  };
};

workplaceCheckbox.addEventListener('change', () => {
  if (workplaceCheckbox.checked) {
    workplaceWarning.classList.remove('hidden');
  } else {
    workplaceWarning.classList.add('hidden');
  }
});

let currentRequiredVitals = new Set();

const setVitalWarning = (key, message) => {
  const warningEl = vitalWarningMap[key];
  if (!warningEl) return;
  if (message) {
    warningEl.textContent = message;
    warningEl.classList.remove('hidden');
  } else {
    warningEl.textContent = '';
    warningEl.classList.add('hidden');
  }
};

const vitalEvaluators = {
  bloodPressure: (raw) => {
    const match = raw.match(/^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/);
    if (!match) {
      return '';
    }
    const systolic = Number(match[1]);
    const diastolic = Number(match[2]);
    if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
      return '';
    }
    if (systolic < 90 || diastolic < 50) {
      return 'Blood pressure suggests hypotension. Monitor for shock and treat immediately.';
    }
    if (systolic > 180 || diastolic > 110) {
      return 'Blood pressure is critically high. Evaluate for hypertensive emergency.';
    }
    return '';
  },
  spo2: (raw) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      return '';
    }
    if (value < 85) {
      return 'SpO₂ below 85% indicates critical hypoxia. Provide high-flow oxygen and escalate care.';
    }
    if (value < 92) {
      return 'SpO₂ below 92% is low. Administer oxygen and reassess frequently.';
    }
    return '';
  },
  heartRate: (raw) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      return '';
    }
    if (value < 50) {
      return 'Heart rate below 50 bpm suggests bradycardia. Assess perfusion and potential causes.';
    }
    if (value > 120) {
      return 'Heart rate above 120 bpm suggests tachycardia. Evaluate for shock, pain, or arrhythmia.';
    }
    return '';
  },
  respiratoryRate: (raw) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      return '';
    }
    if (value < 10) {
      return 'Respiratory rate below 10 breaths/min indicates hypoventilation. Support airway and breathing.';
    }
    if (value > 24) {
      return 'Respiratory rate above 24 breaths/min indicates respiratory distress. Evaluate and support ventilation.';
    }
    return '';
  },
  temperature: (raw) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      return '';
    }
    if (value < 35) {
      return 'Temperature below 35°C indicates hypothermia. Begin rewarming protocols.';
    }
    if (value > 39) {
      return 'Temperature above 39°C indicates high fever or heat illness. Initiate cooling measures.';
    }
    return '';
  },
  bloodGlucose: (raw) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) {
      return '';
    }
    if (value < 70) {
      return 'Blood glucose below 70 mg/dL indicates hypoglycemia. Provide glucose and monitor.';
    }
    if (value > 250) {
      return 'Blood glucose above 250 mg/dL indicates hyperglycemia. Assess for DKA or HHS.';
    }
    return '';
  },
  avpu: () => ''
};

const evaluateVital = (key) => {
  const input = vitalInputMap[key];
  if (!input) return;
  const rawValue = input.value.trim();
  if (!rawValue) {
    setVitalWarning(key, '');
    return;
  }
  const allowedValues = allowedNonNumericVitalValues[key] || [];
  if (allowedValues.includes(rawValue.toLowerCase())) {
    setVitalWarning(key, '');
    return;
  }
  const evaluator = vitalEvaluators[key];
  if (!evaluator) {
    setVitalWarning(key, '');
    return;
  }
  const message = evaluator(rawValue);
  setVitalWarning(key, message);
};

const createQuickActionButton = (label) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.value = label;
  return button;
};

const applyHintValue = (targetKey, value) => {
  const input = vitalInputMap[targetKey];
  if (!input) return;
  input.value = value;
  input.focus();
  evaluateVital(targetKey);
};

const applyTreatmentQuickAction = (label) => {
  const currentValue = treatmentInput.value.trim();
  if (!currentValue) {
    treatmentInput.value = label;
  } else if (!currentValue.includes(label)) {
    treatmentInput.value = `${currentValue}\n${label}`;
  }
  treatmentInput.focus();
};

const hintButtons = document.querySelectorAll('.field-hints button');

hintButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const container = button.closest('.field-hints');
    if (!container) return;
    const targetKey = container.dataset.for;
    const value = button.dataset.value ?? button.textContent.trim();
    applyHintValue(targetKey, value);
  });
});

Object.entries(vitalInputMap).forEach(([key, input]) => {
  if (!vitalWarningMap[key]) {
    return;
  }
  input.addEventListener('input', () => evaluateVital(key));
});

const clearFollowUpSelection = () => {
  followUpOptions.forEach((option) => {
    option.checked = false;
  });
  followUpOtherWrapper.classList.add('hidden');
  followUpOtherInput.value = '';
  followUpWarning.classList.add('hidden');
  followUpWarning.textContent = '';
};

const adjustFollowUpOptions = (incidentValue) => {
  clearFollowUpSelection();
  updateFollowUpContextVisibility();

  if (!incidentValue) {
    return;
  }

  const context = getActiveContext();
  const messages = followUpWarningMessages[context] || followUpWarningMessages.peace;
  const isLifeThreatening = lifeThreateningIncidents.has(incidentValue);
  const isPotentialLifeThreatening = potentialLifeThreateningIncidents.has(incidentValue);

  if (isLifeThreatening) {
    const defaultOption = followUpDefaultsByContext.lifeThreatening[context];
    if (isFollowUpOptionAvailable(defaultOption, context)) {
      selectFollowUpOption(defaultOption);
    }
    (lifeThreateningDisallowedByContext[context] || []).forEach((value) => {
      const wrapper = followUpOptionWrappers.get(value);
      if (wrapper) {
        wrapper.classList.add('hidden');
      }
      const option = followUpOptionByValue.get(value);
      if (option) {
        option.checked = false;
      }
    });
    followUpWarning.textContent = messages.lifeThreatening;
    followUpWarning.classList.remove('hidden');
    return;
  }

    if (isPotentialLifeThreatening) {
    followUpWarning.textContent = messages.potentialLifeThreatening;
      followUpWarning.classList.remove('hidden');
    } else if (seriousIncidents.has(incidentValue)) {
    followUpWarning.textContent = messages.serious;
      followUpWarning.classList.remove('hidden');
    const seriousDefault = followUpDefaultsByContext.serious[context];
    if (isFollowUpOptionAvailable(seriousDefault, context)) {
      selectFollowUpOption(seriousDefault);
    }
  }

    if (minorIncidentDefaults.has(incidentValue)) {
    const minorDefault = followUpDefaultsByContext.minor[context];
    if (isFollowUpOptionAvailable(minorDefault, context)) {
      selectFollowUpOption(minorDefault);
    }
  }
};

followUpOptions.forEach((option) => {
  option.addEventListener('change', () => {
    if (option.value === 'other' && option.checked) {
      followUpOtherWrapper.classList.remove('hidden');
      followUpOtherInput.focus();
    } else if (option.checked) {
      followUpOtherWrapper.classList.add('hidden');
      followUpOtherInput.value = '';
    }
  });
});

const updateFieldVisibility = (value) => {
  if (value) {
    basicFields.classList.remove('hidden');
  } else {
    basicFields.classList.add('hidden');
  }

  const requiredVitals = incidentVitalRequirements[value] || [];
  currentRequiredVitals = new Set(requiredVitals);
  if (incidentsRequiringAvpu.has(value)) {
    currentRequiredVitals.add('avpu');
  }

  if (currentRequiredVitals.size) {
    vitalsFields.classList.remove('hidden');
  } else {
    vitalsFields.classList.add('hidden');
  }

  Object.entries(vitalFieldMap).forEach(([key, field]) => {
    if (currentRequiredVitals.has(key)) {
      field.classList.remove('hidden');
      evaluateVital(key);
    } else {
      field.classList.add('hidden');
      vitalInputMap[key].value = '';
      setVitalWarning(key, '');
    }
  });

  if (incidentsRequiringTreatment.has(value)) {
    treatmentFields.classList.remove('hidden');
  } else {
    treatmentFields.classList.add('hidden');
    treatmentInput.value = '';
  }

  if (prolongedCareSection) {
    const eligible = value && prolongedCareEligibleIncidents.has(value);
    if (eligible) {
      prolongedCareSection.classList.remove('hidden');
      if (vitalsSnapshots.length === 0 && checkupTimeInput) {
        checkupTimeInput.value = formatDateTimeLocal(new Date());
      }
    } else {
      prolongedCareSection.classList.add('hidden');
      vitalsSnapshots = [];
      renderCheckupList();
      if (checkupNotesInput) {
        checkupNotesInput.value = '';
      }
      if (checkupPlaceholder) {
        checkupPlaceholder.classList.add('hidden');
      }
    }
    renderCheckupList();
  }

  if (workplaceEligibleIncidents.has(value)) {
    workplaceSection.classList.remove('hidden');
  } else {
    workplaceSection.classList.add('hidden');
    workplaceCheckbox.checked = false;
    workplaceWarning.classList.add('hidden');
  }

  if (value) {
    followUpSection.classList.remove('hidden');
    adjustFollowUpOptions(value);
    const actions = treatmentQuickActionMap[value];
    treatmentQuickActions.innerHTML = '';
    if (actions && actions.length) {
      treatmentQuickActions.classList.remove('hidden');
      treatmentQuickActions.dataset.for = 'treatment';
      actions.forEach((label) => {
        const button = createQuickActionButton(label);
        button.addEventListener('click', () => applyTreatmentQuickAction(label));
        treatmentQuickActions.appendChild(button);
      });
    } else {
      treatmentQuickActions.classList.add('hidden');
      treatmentQuickActions.removeAttribute('data-for');
    }
  } else {
    followUpSection.classList.add('hidden');
    clearFollowUpSelection();
    treatmentQuickActions.classList.add('hidden');
    treatmentQuickActions.innerHTML = '';
    treatmentQuickActions.removeAttribute('data-for');
  }
};

operationalContext.addEventListener('change', () => {
  updateFollowUpContextVisibility();
  adjustFollowUpOptions(incidentType.value);
});

incidentCategory.addEventListener('change', () => {
  const selectedCategory = incidentCategory.value;
  setIncidentTypeOptions(selectedCategory);
  incidentType.value = '';
  vitalsSnapshots = [];
  renderCheckupList();
  if (checkupNotesInput) {
    checkupNotesInput.value = '';
  }
  updateFieldVisibility('');
});

incidentType.addEventListener('change', () => {
  vitalsSnapshots = [];
  renderCheckupList();
  if (checkupNotesInput) {
    checkupNotesInput.value = '';
  }
  updateFieldVisibility(incidentType.value);
});

updateFollowUpContextVisibility();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const errors = [];
  const incidentValue = incidentType.value;

  if (!incidentValue) {
    errors.push('Select an incident type.');
  }

  if (!basicFields.classList.contains('hidden')) {
    if (!patientNameInput.value.trim()) {
      errors.push('Record the patient name or identifier.');
    }

    if (!rosterNumberInput.value.trim()) {
      errors.push('Provide the roster / MA number.');
    }

    const incidentTimeValue = incidentTimeInput.value.trim();
    const incidentTimeUnknown = incidentTimeInput.dataset.unknown === 'true';
    if (!incidentTimeValue && !incidentTimeUnknown) {
      errors.push('Document the incident time or mark it as unknown.');
    }

    if (!locationInput.value.trim()) {
      errors.push('Provide the incident location.');
    }

    if (!descriptionInput.value.trim()) {
      errors.push('Provide a brief description of the incident.');
    }
  }

  if (currentRequiredVitals.size) {
    currentRequiredVitals.forEach((key) => evaluateVital(key));
    if (currentRequiredVitals.has('bloodPressure') && !bloodPressureInput.value.trim()) {
      errors.push('Enter the patient\'s blood pressure.');
    }

    const numericVitalChecks = [
      { key: 'spo2', label: 'SpO₂', min: 0, max: 100 },
      { key: 'heartRate', label: 'Heart rate', min: 20, max: 250 },
      { key: 'respiratoryRate', label: 'Respiratory rate', min: 4, max: 80 },
      { key: 'temperature', label: 'Temperature (°C)', min: 30, max: 45 },
      { key: 'bloodGlucose', label: 'Blood glucose', min: 20, max: 600 }
    ];

    numericVitalChecks
      .filter(({ key }) => currentRequiredVitals.has(key))
      .forEach(({ key, label, min, max }) => {
        const input = vitalInputMap[key];
        const value = input.value.trim();
        if (!value) {
          errors.push(`Enter ${label.toLowerCase()}.`);
        } else {
          const normalizedValue = value.toLowerCase();
          const allowedValues = allowedNonNumericVitalValues[key] || [];
          if (allowedValues.includes(normalizedValue)) {
            return;
          }
          const numericValue = Number(value);
          if (!Number.isFinite(numericValue)) {
            errors.push(`${label} must be a number.`);
          } else if (numericValue < min || numericValue > max) {
            errors.push(`${label} should be between ${min} and ${max}.`);
          }
        }
      });

    if (currentRequiredVitals.has('painScore')) {
      const painValue = painScoreInput.value.trim();
      if (!painValue) {
        errors.push('Record the patient\'s pain score.');
      } else {
        const normalizedPain = painValue.toLowerCase();
        const allowedPainValues = allowedNonNumericVitalValues.painScore || [];
        if (!allowedPainValues.includes(normalizedPain)) {
          const numericPain = Number(painValue);
          if (!Number.isInteger(numericPain) || numericPain < 0 || numericPain > 10) {
            errors.push('Pain score must be a whole number between 0 and 10.');
          }
        }
      }
    }

    if (currentRequiredVitals.has('pupilResponse') && !pupilResponseInput.value.trim()) {
      errors.push('Note the pupil response.');
    }

    if (currentRequiredVitals.has('avpu')) {
      const avpuValue = avpuSelect?.value?.trim() || '';
      if (!avpuValue) {
        errors.push('Select the AVPU status.');
      }
    }
  }

  if (!treatmentFields.classList.contains('hidden')) {
    if (!treatmentInput.value.trim()) {
      errors.push('Document any treatment or interventions provided.');
    }
  }

  const context = getActiveContext();
  const selectedFollowUp = followUpOptions.find((option) => option.checked)?.value || '';
  if (seriousIncidents.has(incidentValue)) {
    const invalidSeriousValues = context === 'war' ? ['none', 'remain-with-unit'] : ['none'];
    if (!selectedFollowUp || invalidSeriousValues.includes(selectedFollowUp)) {
      errors.push(
        context === 'war'
          ? 'Serious incidents require selecting an evacuation path beyond remaining with the unit.'
          : 'Serious incidents require selecting a follow-up beyond on-site release.'
      );
    }
  }

  if (lifeThreateningIncidents.has(incidentValue)) {
    const requiredFollowUp = followUpDefaultsByContext.lifeThreatening[context];
    if (!selectedFollowUp || selectedFollowUp !== requiredFollowUp) {
      errors.push(
        context === 'war'
          ? 'Life-threatening incidents require selecting MEDEVAC transport.'
          : 'Life-threatening incidents require selecting ambulance transport.'
      );
    }
  }

  if (selectedFollowUp === 'other' && !followUpOtherInput.value.trim()) {
    errors.push('Provide notes for the selected follow-up option.');
  }

  if (errors.length) {
    pushToast(`Please correct the following:\n- ${errors.join('\n- ')}`, { type: 'error', duration: 9000 });
    return;
  }

  const isEditing = Boolean(editingRecordId);
  const record = collectIncidentData();

  if (isEditing) {
    const targetIndex = incidentRecords.findIndex((item) => item.id === editingRecordId);
    if (targetIndex !== -1) {
      record.id = editingRecordId;
      record.timestamp = editingOriginalTimestamp || incidentRecords[targetIndex].timestamp;
      record.updatedAt = new Date().toISOString();
      incidentRecords.splice(targetIndex, 1, record);
    } else {
      record.updatedAt = null;
      incidentRecords.push(record);
    }
  } else {
    record.updatedAt = null;
    incidentRecords.push(record);
  }

  saveIncidentsToStorage();
  renderDashboard();

  pushToast(isEditing ? 'Incident updated.' : 'Incident saved locally.', { type: 'success' });
  resetFormState();
  exitEditingMode({ notify: false, resetForm: false });
  updateDispositionFilterOptions();
  applyFilters();
  setActiveTab('view');
});

setIncidentTypeOptions('');
updateFieldVisibility(incidentType.value);
loadIncidentsFromStorage();
clearFilters();
populateGuideCategories();
renderGuideResults();
setActiveTab('add');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(() => console.log('[PWA] Service worker registered.'))
      .catch((error) => console.error('[PWA] Service worker registration failed:', error));
  });
}