;(function (window) {
  'use strict'

  const incidentData = [
    {
      id: 'minor',
      label: 'Minor Injuries',
      incidents: [
        { value: 'cut-laceration', label: 'Cut / small laceration' },
        { value: 'scrape-abrasion', label: 'Scrape / abrasion' },
        { value: 'bruise-contusion', label: 'Bruise / contusion' },
        { value: 'sprain-strain', label: 'Sprain / strain' },
        { value: 'blister', label: 'Blister' },
        { value: 'burn-minor', label: 'Burn (minor)' },
        { value: 'foreign-object-eye', label: 'Foreign object in eye / minor irritation' }
      ]
    },
    {
      id: 'medical',
      label: 'Medical Emergencies',
      incidents: [
        { value: 'heat-related', label: 'Heat stroke / overheating / dehydration' },
        { value: 'cold-exposure', label: 'Cold exposure / hypothermia / frostbite' },
        { value: 'fainting-syncope', label: 'Fainting / syncope' },
        { value: 'anaphylaxis', label: 'Severe allergic reaction / anaphylaxis' },
        { value: 'chest-pain-cardiac', label: 'Chest pain / possible cardiac issue' },
        { value: 'seizure', label: 'Seizure / convulsion' },
        { value: 'asthma-breathing', label: 'Asthma attack / breathing difficulty' },
        { value: 'severe-bleeding', label: 'Severe bleeding' }
      ]
    },
    {
      id: 'substance',
      label: 'Substance-Related',
      incidents: [
        { value: 'alcohol-intoxication', label: 'Alcohol intoxication / overconsumption' },
        { value: 'recreational-drug', label: 'Recreational drug use / adverse reaction' },
        { value: 'suspected-overdose', label: 'Suspected overdose' },
        { value: 'vomiting-substance', label: 'Vomiting due to substance intake' }
      ]
    },
    {
      id: 'environmental',
      label: 'Environmental / Festival-Related',
      incidents: [
        { value: 'crowd-crush', label: 'Crowd crush / trampling risk' },
        { value: 'slip-fall', label: 'Slips / falls' },
        { value: 'bite-sting', label: 'Insect / animal bite or sting' },
        { value: 'sunburn-heat', label: 'Sunburn / minor heat exposure' },
        { value: 'weather-related', label: 'Weather-related injuries' }
      ]
    },
    {
      id: 'staff',
      label: 'Staff / Operational Incidents',
      incidents: [
        { value: 'chemical-exposure', label: 'Chemical burn / exposure' },
        { value: 'electrical-injury', label: 'Electrical injury / shock' },
        { value: 'equipment-injury', label: 'Equipment-related injury' },
        { value: 'manual-handling', label: 'Manual handling injury' },
        { value: 'occupational-other', label: 'Other occupational hazards' }
      ]
    },
    {
      id: 'military',
      label: 'Military / Operational',
      incidents: [
        { value: 'blast-injury', label: 'Blast injury / barotrauma' },
        { value: 'gunshot-wound', label: 'Gunshot wound' },
        { value: 'penetrating-trauma', label: 'Penetrating trauma / shrapnel' },
        { value: 'tbi-concussion', label: 'Traumatic brain injury / concussion' },
        { value: 'chemical-agent', label: 'Chemical agent exposure (CBRN)' },
        { value: 'combat-stress', label: 'Combat stress reaction / acute stress' },
        { value: 'mass-casualty', label: 'Mass casualty triage' }
      ]
    },
    {
      id: 'mental',
      label: 'Mental Health / Behavioral',
      incidents: [
        { value: 'anxiety-panic', label: 'Anxiety / panic attack' },
        { value: 'aggressive-assault', label: 'Aggressive behavior / assault' },
        { value: 'confusion-disorientation', label: 'Confusion / disorientation' },
        { value: 'self-harm-risk', label: 'Self-harm risk' }
      ]
    },
    {
      id: 'other',
      label: 'Other / Miscellaneous',
      incidents: [
        { value: 'eye-irritation', label: 'Eye irritation (dust, smoke, debris)' },
        { value: 'headache-migraine', label: 'Headache / migraine' },
        { value: 'nausea-upset-stomach', label: 'Nausea / upset stomach (not substance-related)' },
        { value: 'medical-device-issue', label: 'Medical device / equipment issues' },
        { value: 'other-unspecified', label: 'Other / unspecified' }
      ]
    }
  ]

  const treatmentQuickActionMap = {
    'cut-laceration': [
      'Wound cleaned',
      'Bandage applied',
      'Plaster applied'
    ],
    'scrape-abrasion': [
      'Area cleaned',
      'Antiseptic applied',
      'Plaster applied'
    ],
    'bruise-contusion': [
      'Ice applied',
      'Compression bandage applied',
      'Patient advised rest'
    ],
    'sprain-strain': [
      'Ice applied',
      'Compression applied',
      'Limb elevated',
      'Advised rest'
    ],
    'blister': [
      'Blister cleaned',
      'Protective dressing applied',
      'Padding applied'
    ],
    'burn-minor': [
      'Burn cooled with water',
      'Sterile dressing applied',
      'Topical burn gel applied'
    ],
    'foreign-object-eye': [
      'Eye irrigated',
      'Object removed safely',
      'Lubricating drops applied'
    ],
    'heat-related': [
      'Patient moved to cool area',
      'Cooling packs applied',
      'Fluids provided',
      'Monitoring vital signs'
    ],
    'cold-exposure': [
      'Wet clothing removed',
      'Passive rewarming initiated',
      'Warm blankets applied'
    ],
    'fainting-syncope': [
      'Patient laid supine',
      'Legs elevated',
      'Glucose administered'
    ],
    'anaphylaxis': [
      'Epinephrine administered',
      'Airway monitored',
      'Oxygen provided'
    ],
    'chest-pain-cardiac': [
      'Oxygen administered',
      'Aspirin administered',
      'Monitored with ECG'
    ],
    'seizure': [
      'Patient protected from injury',
      'Airway monitored',
      'Postictal reassessment'
    ],
    'asthma-breathing': [
      'Bronchodilator administered',
      'Oxygen provided',
      'Patient coached on breathing'
    ],
    'severe-bleeding': [
      'Direct pressure applied',
      'Tourniquet applied',
      'Bleeding controlled with dressing'
    ],
    'alcohol-intoxication': [
      'Airway monitored',
      'Patient positioned for safety',
      'Observation initiated'
    ],
    'recreational-drug': [
      'Airway monitored',
      'Activated charcoal administered',
      'Observation initiated'
    ],
    'suspected-overdose': [
      'Naloxone administered',
      'Airway supported',
      'Oxygen provided'
    ],
    'vomiting-substance': [
      'Airway cleared',
      'Patient positioned lateral',
      'Fluids provided'
    ],
    'crowd-crush': [
      'Patient extricated to safe area',
      'Airway and breathing supported',
      'Bleeding controlled'
    ],
    'slip-fall': [
      'Ice applied',
      'Compression bandage applied',
      'Mobility assessed'
    ],
    'bite-sting': [
      'Area cleaned',
      'Cold pack applied',
      'Antihistamine administered'
    ],
    'sunburn-heat': [
      'Cooling gel applied',
      'Hydration encouraged',
      'Sun exposure limited'
    ],
    'weather-related': [
      'Moved to safe shelter',
      'Warm/dry clothing provided',
      'Monitoring vital signs'
    ],
    'chemical-exposure': [
      'Area irrigated',
      'Contaminated clothing removed',
      'Poison control contacted'
    ],
    'electrical-injury': [
      'Power source isolated',
      'Cardiac monitoring initiated',
      'Burns treated'
    ],
    'equipment-injury': [
      'Bleeding controlled',
      'Immobilized affected area',
      'Pain managed'
    ],
    'manual-handling': [
      'Ice applied to strain',
      'Compression wrap applied',
      'Rest advised'
    ],
    'occupational-other': [
      'Hazard mitigated',
      'First aid applied',
      'Supervisor notified'
    ],
    'blast-injury': [
      'Airway and breathing reassessed',
      'Tourniquets applied',
      'Needle decompression performed',
      'Hemorrhage control with pressure dressings'
    ],
    'gunshot-wound': [
      'Hemostatic gauze packed',
      'Pressure dressing applied',
      'Tourniquet applied',
      'Rapid trauma survey completed'
    ],
    'penetrating-trauma': [
      'Chest seal applied',
      'Wound packed',
      'Hypothermia prevention initiated',
      'Evacuation request transmitted'
    ],
    'tbi-concussion': [
      'C-spine maintained',
      'Neurological checks performed',
      'Pupillary response monitored',
      'Head elevated 30 degrees'
    ],
    'chemical-agent': [
      'MOPP gear verified / adjusted',
      'Decontamination initiated',
      'Antidote kit administered',
      'Airway supported with oxygen'
    ],
    'combat-stress': [
      'Grounding techniques facilitated',
      'Reassurance and battle buddy support provided',
      'Sleep / hydration plan discussed',
      'Behavioral health notified'
    ],
    'mass-casualty': [
      'Triage category assigned',
      'Casualty collection point established',
      'Evacuation priorities communicated',
      'SITREP sent to higher'
    ],
    'anxiety-panic': [
      'Breathing coaching',
      'Grounding techniques used',
      'Supportive reassurance provided'
    ],
    'aggressive-assault': [
      'Scene secured',
      'Bleeding controlled',
      'Police/security notified'
    ],
    'confusion-disorientation': [
      'Blood glucose checked',
      'Hydration provided',
      'Neurological status monitored'
    ],
    'self-harm-risk': [
      'Scene secured',
      'Self-harm implements removed',
      'Mental health support contacted'
    ],
    'eye-irritation': [
      'Eye flushed',
      'Lubricating drops applied',
      'Eye patch applied'
    ],
    'headache-migraine': [
      'Quiet dark environment provided',
      'Hydration encouraged',
      'Analgesic administered'
    ],
    'nausea-upset-stomach': [
      'Antiemetic administered',
      'Hydration encouraged',
      'Patient positioned comfortably'
    ],
    'medical-device-issue': [
      'Device inspected',
      'Manufacturer contacted',
      'Manual backup initiated'
    ],
    'other-unspecified': [
      'Patient monitored',
      'Basic first aid applied',
      'Provider notified'
    ]
  }

  const incidentVitalRequirements = {
    'cut-laceration': ['painScore'],
    'scrape-abrasion': ['painScore'],
    'bruise-contusion': ['painScore'],
    'sprain-strain': ['painScore'],
    'blister': ['painScore'],
    'burn-minor': ['temperature', 'painScore'],
    'foreign-object-eye': ['painScore', 'pupilResponse'],
    'heat-related': ['bloodPressure', 'spo2', 'heartRate', 'respiratoryRate', 'temperature'],
    'cold-exposure': ['temperature', 'bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'fainting-syncope': ['bloodPressure', 'heartRate', 'spo2'],
    'anaphylaxis': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'chest-pain-cardiac': ['bloodPressure', 'heartRate', 'spo2'],
    'seizure': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'asthma-breathing': ['spo2', 'heartRate', 'respiratoryRate'],
    'severe-bleeding': ['bloodPressure', 'heartRate', 'painScore'],
    'alcohol-intoxication': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'recreational-drug': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'suspected-overdose': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'temperature'],
    'vomiting-substance': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'crowd-crush': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'slip-fall': ['bloodPressure', 'heartRate', 'painScore'],
    'bite-sting': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore'],
    'sunburn-heat': ['temperature', 'painScore'],
    'weather-related': ['temperature', 'bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'chemical-exposure': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore'],
    'electrical-injury': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore'],
    'equipment-injury': ['bloodPressure', 'heartRate', 'painScore'],
    'manual-handling': ['bloodPressure', 'heartRate', 'painScore'],
    'occupational-other': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'anxiety-panic': ['heartRate', 'respiratoryRate', 'spo2'],
    'aggressive-assault': ['bloodPressure', 'heartRate', 'painScore'],
    'confusion-disorientation': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'bloodGlucose'],
    'self-harm-risk': ['bloodPressure', 'heartRate', 'painScore'],
    'blast-injury': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore', 'pupilResponse'],
    'gunshot-wound': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore'],
    'penetrating-trauma': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore'],
    'tbi-concussion': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'painScore', 'pupilResponse'],
    'chemical-agent': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'temperature'],
    'combat-stress': ['heartRate', 'respiratoryRate', 'spo2', 'painScore'],
    'mass-casualty': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'temperature', 'painScore'],
    'eye-irritation': ['painScore', 'pupilResponse'],
    'headache-migraine': ['bloodPressure', 'heartRate', 'painScore'],
    'nausea-upset-stomach': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2'],
    'medical-device-issue': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'bloodGlucose'],
    'other-unspecified': ['bloodPressure', 'heartRate', 'respiratoryRate', 'spo2', 'temperature']
  }

  const incidentsRequiringAvpu = new Set([
    'heat-related',
    'cold-exposure',
    'fainting-syncope',
    'anaphylaxis',
    'chest-pain-cardiac',
    'seizure',
    'asthma-breathing',
    'severe-bleeding',
    'suspected-overdose',
    'crowd-crush',
    'slip-fall',
    'bite-sting',
    'chemical-exposure',
    'electrical-injury',
    'equipment-injury',
    'manual-handling',
    'anxiety-panic',
    'aggressive-assault',
    'confusion-disorientation',
    'self-harm-risk',
    'blast-injury',
    'gunshot-wound',
    'penetrating-trauma',
    'tbi-concussion',
    'chemical-agent',
    'combat-stress',
    'mass-casualty',
    'eye-irritation',
    'other-unspecified'
  ])

  const incidentsRequiringTreatment = new Set([
    'cut-laceration',
    'scrape-abrasion',
    'bruise-contusion',
    'sprain-strain',
    'blister',
    'burn-minor',
    'foreign-object-eye',
    'heat-related',
    'cold-exposure',
    'fainting-syncope',
    'anaphylaxis',
    'chest-pain-cardiac',
    'seizure',
    'asthma-breathing',
    'severe-bleeding',
    'alcohol-intoxication',
    'recreational-drug',
    'suspected-overdose',
    'vomiting-substance',
    'crowd-crush',
    'slip-fall',
    'bite-sting',
    'sunburn-heat',
    'weather-related',
    'chemical-exposure',
    'electrical-injury',
    'equipment-injury',
    'manual-handling',
    'occupational-other',
    'anxiety-panic',
    'aggressive-assault',
    'confusion-disorientation',
    'self-harm-risk',
    'blast-injury',
    'gunshot-wound',
    'penetrating-trauma',
    'tbi-concussion',
    'chemical-agent',
    'combat-stress',
    'mass-casualty',
    'eye-irritation',
    'headache-migraine',
    'nausea-upset-stomach',
    'medical-device-issue',
    'other-unspecified'
  ])

  const seriousIncidents = new Set([
    'heat-related',
    'cold-exposure',
    'anaphylaxis',
    'chest-pain-cardiac',
    'seizure',
    'asthma-breathing',
    'severe-bleeding',
    'suspected-overdose',
    'alcohol-intoxication',
    'recreational-drug',
    'blast-injury',
    'gunshot-wound',
    'penetrating-trauma',
    'tbi-concussion',
    'chemical-agent',
    'mass-casualty',
    'combat-stress'
  ])

  const lifeThreateningIncidents = new Set([
    'cold-exposure',
    'anaphylaxis',
    'chest-pain-cardiac',
    'seizure',
    'asthma-breathing',
    'severe-bleeding',
    'suspected-overdose',
    'blast-injury',
    'gunshot-wound',
    'penetrating-trauma',
    'chemical-agent',
    'mass-casualty'
  ])

  const potentialLifeThreateningIncidents = new Set([
    'heat-related',
    'tbi-concussion'
  ])

  const minorIncidentDefaults = new Set([
    'cut-laceration',
    'scrape-abrasion',
    'bruise-contusion',
    'sprain-strain',
    'blister',
    'burn-minor',
    'foreign-object-eye',
    'combat-stress'
  ])

  const workplaceEligibleIncidents = new Set([
    'slip-fall',
    'chemical-exposure',
    'electrical-injury',
    'equipment-injury',
    'manual-handling',
    'occupational-other'
  ])

  window.INCIDENT_DATA = incidentData
  window.TREATMENT_QUICK_ACTION_MAP = treatmentQuickActionMap
  window.INCIDENT_VITAL_REQUIREMENTS = incidentVitalRequirements
  window.INCIDENTS_REQUIRING_TREATMENT = Array.from(incidentsRequiringTreatment)
  window.SERIOUS_INCIDENTS = Array.from(seriousIncidents)
  window.LIFE_THREATENING_INCIDENTS = Array.from(lifeThreateningIncidents)
  window.POTENTIAL_LIFE_THREATENING_INCIDENTS = Array.from(
    potentialLifeThreateningIncidents
  )
  window.MINOR_INCIDENT_DEFAULTS = Array.from(minorIncidentDefaults)
  window.WORKPLACE_ELIGIBLE_INCIDENTS = Array.from(workplaceEligibleIncidents)
  window.INCIDENTS_REQUIRING_AVPU = Array.from(incidentsRequiringAvpu)
})(window)