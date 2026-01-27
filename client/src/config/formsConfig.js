export const formsConfig = {
  // Placeholders for the other checklists you listed.
  ambulanceChecklist: {
    id: 'ambulanceChecklist',
    title: 'Ambulance Checklist',
    description: '',
    sections: [],
  },
  monitorCheck: {
    id: 'monitorCheck',
    title: 'Ambulance Monitor / AED Checklist',
    description:
      'Checklist for the ambulance monitor / AED, including pads, consumables, and basic functionality checks.',
    sections: [
      {
        id: 'monitor-email',
        title: 'Contact Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'practitionerPin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        id: 'monitor-details',
        title: 'Monitor / AED Details',
        fields: [
          {
            id: 'vehicleCallsign',
            label: 'Vehicle Call Sign',
            type: 'text',
            required: true,
          },
          {
            id: 'machineType',
            label: 'Machine type',
            type: 'select',
            required: true,
            options: ['Lifepak 12', 'Lifepak 15', 'Schiller', 'Corpuls', 'Zoll Series'],
          },
          {
            id: 'deviceId',
            label: 'Device ID / Number',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        id: 'monitor-core-checks',
        title: 'Core Checks',
        fields: [
          {
            id: 'testComplete',
            label: 'Defibrillator Shock Test Complete?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'padsInDate',
            label: 'Defib Pads in Date?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'dots',
            label: 'ECG Dots',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'paper',
            label: 'ECG Paper',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'monitor-consumables',
        title: 'Consumables',
        fields: [
          {
            id: 'consumablesRazor',
            label: 'Razor',
            type: 'select',
            required: false,
            options: ['Yes', 'No'],
          },
          {
            id: 'consumablesPadForDrying',
            label: 'Pad for Drying',
            type: 'select',
            required: false,
            options: ['Yes', 'No'],
          },
          {
            id: 'consumablesShears',
            label: 'Shears',
            type: 'select',
            required: false,
            options: ['Yes', 'No'],
          },
          {
            id: 'consumablesOther',
            label: 'Other (consumables)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'monitor-function',
        title: 'Monitor Functionality',
        fields: [
          {
            id: 'bpWorking',
            label: 'BP Working',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'spo2Working',
            label: 'SpO₂ working',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'batteriesChargerInPlace',
            label: 'Batteries/charger in place',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'lead12CablesPresent',
            label: '12 Lead ECG Cables Present?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'otherFunctionNotes',
            label: 'Other (functionality)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'monitor-comments',
        title: 'Final Comments',
        fields: [
          {
            id: 'comments',
            label: 'Any other comments',
            type: 'textarea',
            required: true,
          },
        ],
      },
    ],
  },
  vehicleIr1: {
    id: 'vehicleIr1',
    title: 'Vehicle IR1 – Incident Report',
    description:
      'Vehicle incident report for collisions, damage, near misses or safety events. Use this to record what happened and attach supporting images.',
    sections: [
      {
        id: 'vehicleIr1-details',
        title: 'Practitioner & Vehicle Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'practitionerPin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'vehicleCallsign',
            label: 'Vehicle Call Sign',
            type: 'text',
            required: true,
          },
          {
            id: 'incidentDateTime',
            label: 'Date / Time of Incident',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        id: 'vehicleIr1-incident',
        title: 'Incident Summary',
        fields: [
          {
            id: 'location',
            label: 'Location of Incident',
            type: 'text',
            required: true,
          },
          {
            id: 'incidentType',
            label: 'Type of Incident (e.g. collision, near miss, damage)',
            type: 'text',
            required: true,
          },
          {
            id: 'patientsOnBoard',
            label: 'Were patients on board?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'briefSummary',
            label: 'Brief Summary of What Happened',
            type: 'textarea',
            required: true,
          },
        ],
      },
      {
        id: 'vehicleIr1-impact',
        title: 'Injuries & Damage',
        fields: [
          {
            id: 'injuries',
            label: 'Any injuries to crew, patients or others?',
            type: 'textarea',
            required: false,
          },
          {
            id: 'vehicleDamage',
            label: 'Describe any damage to the vehicle or equipment',
            type: 'textarea',
            required: false,
          },
          {
            id: 'reportedTo',
            label: 'Who has this been reported to? (e.g. Control, Manager)',
            type: 'text',
            required: false,
          },
        ],
      },
      {
        id: 'vehicleIr1-photos',
        title: 'Photos (Optional)',
        fields: [
          {
            id: 'scenePhoto',
            label: 'Scene Photo',
            type: 'file',
            required: false,
          },
          {
            id: 'vehicleDamagePhoto',
            label: 'Vehicle / Equipment Damage Photo',
            type: 'file',
            required: false,
          },
          {
            id: 'otherPhoto',
            label: 'Other Relevant Photo',
            type: 'file',
            required: false,
          },
        ],
      },
      {
        id: 'vehicleIr1-comments',
        title: 'Additional Comments',
        fields: [
          {
            id: 'additionalComments',
            label: 'Any Other Relevant Information',
            type: 'textarea',
            required: false,
          },
        ],
      },
    ],
  },
  shiftEndVdi: {
    id: 'shiftEndVdi',
    title: 'VDI – End of Shift',
    description:
      'End-of-shift vehicle defect check, including refuelling, cleaning, parking, and paperwork return.',
    sections: [
      {
        id: 'shiftEndVdi-details',
        title: 'Shift End Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'pin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'returnToBaseTime',
            label: 'Return to Base time',
            type: 'text',
            required: true,
            hint: 'Enter date and time (e.g. 27/01/2026 07:30)',
          },
          {
            id: 'vehicleRefuelled',
            label: 'Vehicle Refuelled',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'vehicleCleanedOut',
            label: 'Vehicle Cleaned Out',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'mileage',
            label: 'Mileage',
            type: 'number',
            required: true,
          },
          {
            id: 'vehicleParkedAppropriately',
            label: 'Vehicle Parked Appropriately',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'returnedHardCopyPcrs',
            label: 'Returned Hard Copy PCRs',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
    ],
  },
  blsBagUpdated: {
    id: 'blsBagUpdated',
    title: 'BLS Bag',
    description:
      'BLS bag checklist. Break seals to check the bag and confirm all required contents and paperwork are present.',
    sections: [
      {
        id: 'bls-details',
        title: 'BLS Bag Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'practitionerPin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'bagNumber',
            label: 'Enter Bag Number',
            type: 'text',
            required: true,
          },
          {
            id: 'nameLocation',
            label: 'Location',
            type: 'text',
            required: true,
          },
          {
            id: 'blsTamperTagged',
            label: 'Is the BLS bag tamper seal tagged?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
            hint:
              'If Yes, you may submit without opening the bag. If No, you must complete the full contents check below.',
          },
        ],
      },
      {
        id: 'bls-pcr',
        title: 'Patient Care Reports',
        fields: [
          {
            id: 'efastBook',
            label: 'EFAST EMS Patient Report Book x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pheccPcrMin',
            label: 'PHECC PCR x5 minimum',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pcrOther',
            label: 'Other (Patient Care Reports)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'bls-oxygen',
        title: 'Oxygen & Airway',
        fields: [
          {
            id: 'oxygenCdLevel',
            label: 'Oxygen CD Cylinder',
            type: 'select',
            required: true,
            options: ['Empty', '1/4', '1/2', '3/4', 'Full'],
          },
          {
            id: 'oxygenExpiry',
            label: 'Oxygen Expiry Date',
            type: 'text',
            required: true,
          },
          {
            id: 'bvm',
            label: 'BVM',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'handHeldSuction',
            label: 'Hand held Suction',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'samSplint',
            label: 'Sam Splint',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'sickBags5',
            label: 'Sick Bags x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'bls-pouch1',
        title: 'Pouch 1: Masks',
        fields: [
          {
            id: 'p1AdultNr',
            label: 'Adult Non Rebreather x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p1AdultNeb',
            label: 'Adult Nebulizer x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p1AdultNasal',
            label: 'Adult Nasal Cannula x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p1PaedNr',
            label: 'Paed Non Rebreather x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p1PaedNeb',
            label: 'Paed Nebulizer x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p1PaedNasal',
            label: 'Paed Nasal Cannula x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p1Other',
            label: 'Other (Pouch 1: Masks)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'bls-pouch2',
        title: 'Pouch 2: Diagnostic',
        fields: [
          {
            id: 'p2Thermometer',
            label: 'Thermometer & Tips',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p2PenTorch',
            label: 'Pen Torch',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p2Spo2',
            label: 'SpO2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p2Glucometer',
            label: 'Glucometer',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p2BpCuff',
            label: 'BP Cuff',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p2Stethoscope',
            label: 'Stethoscope',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p2Other',
            label: 'Other (Pouch 2: Diagnostic)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'bls-pouch3',
        title: 'Pouch 3: First Aid',
        fields: [
          {
            id: 'p3Plasters',
            label: 'Plasters x10',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3WoundWipes',
            label: 'Wound Wipes x10',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3Mepores',
            label: 'Mepores/Adhesive Dressings Various Sizes x10',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3Steristrips',
            label: 'Steristrips Various Sizes x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3BurnDressings',
            label: 'Burns Dressings x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3BurnGel',
            label: 'Burn Gel Bottle/Sachets',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3SterileWash',
            label: 'Sterile Wash x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3Gauze',
            label: 'Gauze Swabs x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3Tweezers',
            label: 'Tweezers',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3ConformingBandage',
            label: 'Conforming Bandage x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3Shears',
            label: 'Shears',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3FoilBlankets',
            label: 'Foil Blankets x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p3Other',
            label: 'Other (Pouch 3: First Aid)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'bls-pouch4',
        title: 'Pouch 4: RICE',
        fields: [
          {
            id: 'p4IcePacks',
            label: 'Ice Packs x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p4TriangularBandages',
            label: 'Triangular Bandages x3',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p4CrepeBandages',
            label: 'Crepe Bandages x3',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p4Other',
            label: 'Other (Pouch 4: RICE)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'bls-pouch5',
        title: 'Pouch 5: Haemorrhage Control',
        fields: [
          {
            id: 'p5AmbulanceDressings',
            label: 'Ambulance Dressings S,M,L x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p5EyeDressings',
            label: 'Eye Dressings x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p5LargePads',
            label: 'Large Absorbent Pads x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'p5Hemostatic',
            label: 'Hemostatic Dressing',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'bls-airway',
        title: 'Advanced Airway',
        fields: [
          {
            id: 'opasSet',
            label: 'OPAs Full Set 00-4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'npasSet',
            label: 'NPAs 6,7,8',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'airwayLube',
            label: 'Lube',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'supraglotticHeader',
            label: 'Supraglottic/Advanced Airway IGel OR LMA  - min 1 of each',
            type: 'textarea',
            required: false,
          },
          {
            id: 'supraglotticTape',
            label: 'Tape',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'co2Detector',
            label: 'CO2 Detector Colourmetric',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'catheterMount',
            label: 'Catheter Mount',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'supraglotticLube',
            label: 'Lube (Advanced Airway)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'igel3',
            label: 'Size 3 IGel',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'igel4',
            label: 'Size 4 IGel',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'igel5',
            label: 'Size 5 IGel',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'lma4',
            label: 'Size 4 LMA',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'lma5',
            label: 'Size 5 LMA',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'lma6',
            label: 'Size 6 LMA',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'syringe20ml',
            label: '20ml Syringe',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'airwayOther',
            label: 'Other (Advanced Airway)',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'bls-gloves-ppe',
        title: 'Gloves & PPE',
        fields: [
          {
            id: 'glovesSmall',
            label: 'Gloves - Small',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'glovesMedium',
            label: 'Gloves - Medium',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'glovesLarge',
            label: 'Gloves - Large',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ppeKit',
            label: 'PPE Kit',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'carrySheet',
            label: 'Carry Sheet',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'bls-waste-paper',
        title: 'Waste & Documentation',
        fields: [
          {
            id: 'sharpsBin',
            label: 'Sharps Bin',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'clinicalWasteBags',
            label: 'Clinical Waste Bags',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pheccPcrPresent',
            label: 'PHECC PCR',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'bls-collars',
        title: 'Collars',
        fields: [
          {
            id: 'adultCollar',
            label: 'Adult Collar',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'paedCollar',
            label: 'Paed Collar',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'bls-comments',
        title: 'Comments & Confirmation',
        fields: [
          {
            id: 'comments',
            label: 'Comments',
            type: 'textarea',
            required: true,
          },
          {
            id: 'storePcrAgree',
            label: 'Please store all used patient care reports in main compartment',
            type: 'checkbox',
            required: true,
          },
        ],
      },
    ],
  },
  aedChecklist: {
    id: 'aedChecklist',
    title: 'AED Checklist',
    description: '',
    sections: [],
  },
  emtMeds: {
    id: 'emtMeds',
    title: 'EMT Medications',
    description:
      'EMT medications checklist. Only tick an item if it is not in the bag, below the required amount, or expired.',
    sections: [
      {
        id: 'emtMeds-details',
        title: 'EMT Medications Pouch Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'practitionerPin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'pouchNumber',
            label: 'Pouch Number',
            type: 'text',
            required: true,
          },
          {
            id: 'emtPouchSealed',
            label: 'Is the EMT pouch sealed?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
            hint:
              'If Yes, you may submit without opening the bag. If No, you must complete the full contents check below.',
          },
          {
            id: 'emtSealNumber',
            label: 'If yes, what is the seal number?',
            type: 'text',
            required: true,
          },
        ],
      },
      {
        id: 'emtMeds-items',
        title: 'Medications',
        fields: [
          {
            id: 'penthrox_status',
            label: 'Penthrox x1 - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Not Present'],
          },
          {
            id: 'paracetamolSusp_status',
            label:
              'Paracetamol Suspension 120mg/5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Not Present', 'Expired'],
          },
          {
            id: 'ibuprofenSusp_status',
            label:
              'Ibuprofen Suspension 100mg/5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Not Present', 'Expired'],
          },
          {
            id: 'glucagon_status',
            label: 'Glucagon x1 - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Not Present', 'Expired'],
          },
          {
            id: 'syringes10ml_status',
            label: 'Syringes 10ml',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 present'],
          },
          {
            id: 'syringes20ml_status',
            label: 'Syringes 20ml',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 in Bag'],
          },
          {
            id: 'aspirin300_status',
            label:
              'Aspirin 300mg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 4 tablets in Bag', 'Expired'],
          },
          {
            id: 'gtn_status',
            label: 'GTN - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Not in Bag'],
          },
          {
            id: 'paracetamol500_status',
            label:
              'Paracetamol 500mg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 12 tablets in Bag', 'Expired'],
          },
          {
            id: 'ibuprofen200_status',
            label:
              'Ibuprofen 200mg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 12 tablets in bag', 'Expired'],
          },
          {
            id: 'chlorphenamineTabs_status',
            label:
              'Chlorphenamine Tablets 4mg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 12 tablets in the bag', 'Expired'],
          },
          {
            id: 'liftGlucose_status',
            label:
              'Lift Glucose Shot - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', '1 Bottle Required', 'Expired'],
          },
          {
            id: 'salbutamol2_5_status',
            label:
              'Salbutamol 2.5mg/2.5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 nebs in bag', 'Expired'],
          },
          {
            id: 'salbutamol5_status',
            label:
              'Salbutamol 5mg/2.5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 3 Nebs in Bag', 'Expired'],
          },
          {
            id: 'adrenaline1_1000_status',
            label:
              'Adrenaline Amp 1:1000 - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 Amps in Bag', 'Expired'],
          },
          {
            id: 'chlorphenamineAmp_status',
            label:
              'Chlorphenamine Amp - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', '1 Amp required in Bag', 'Expired'],
          },
          {
            id: 'naloxoneAmp_status',
            label:
              'Naloxone Amp - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 Amps in Bag', 'Expired'],
          },
          {
            id: 'needlesVarious_status',
            label:
              'Needles Various - Only tick if not in bag (select all that apply)',
            type: 'textarea',
            required: false,
          },
          {
            id: 'needlesVarious_detail',
            label:
              'Needles missing (Blue, Green, Pink, Drawing up (Red))',
            type: 'text',
            required: false,
          },
          {
            id: 'vanishPoint3ml_status',
            label:
              'Vanish Point 3ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 in bag'],
          },
          {
            id: 'syringe1ml_status',
            label:
              '1ml Syringe - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 in bag'],
          },
          {
            id: 'syringe5ml_status',
            label:
              '5ml Syringe - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 in Bag'],
          },
          {
            id: 'syringe10ml_status',
            label:
              '10ml Syringe - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 2 in bag'],
          },
          {
            id: 'madDevice_status',
            label:
              'MAD Device - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Not in bag'],
          },
          {
            id: 'wipes_status',
            label:
              'Wipes - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Present', 'Less than 4 wipes in bag'],
          },
          {
            id: 'confirmation',
            label:
              'I have checked all medications in the Medication bag and all are present unless identified as below required amount or expired.',
            type: 'checkbox',
            required: true,
          },
          {
            id: 'logisticsNotified',
            label:
              'Logistics Department notified of required stock prior to leaving base.',
            type: 'textarea',
            required: false,
          },
        ],
      },
    ],
  },
  paramedicMeds: {
    id: 'paramedicMeds',
    title: 'Paramedic Medications',
    description:
      'Paramedic medications checklist. If the meds bag tamper seal is tagged and intact, you may submit without opening the bag. If the seal is broken or missing, select No and complete the full contents check below.',
    sections: [
      {
        id: 'paramedicMeds-details',
        title: 'Meds Bag Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'pin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'controlledPouchNumber',
            label: 'Controlled Medication Pouch Number',
            type: 'text',
            required: true,
          },
          {
            id: 'completedAt',
            label: 'Completion Date / Time',
            type: 'datetime',
            required: true,
          },
          {
            id: 'medsBagTamperTagged',
            label: 'Is the Meds Bag tamper seal tagged?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'paramedicMeds-items',
        title: 'Paramedic Medications',
        fields: [
          {
            id: 'aspirin300',
            label: 'Aspirin 300mg x6 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'aspirin300_other',
            label: 'Aspirin 300mg x6 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'cyclizine50',
            label: 'Cyclizine 50mg Amps x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'cyclizine50_other',
            label: 'Cyclizine 50mg Amps x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'hydrocortisone100',
            label: 'Hydrocortisone 100mg Vial x4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'hydrocortisone100_other',
            label: 'Hydrocortisone 100mg Vial x4 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'ipratropium250',
            label: 'Ipratropium Bromide 250mcg/1ml x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ipratropium250_other',
            label: 'Ipratropium Bromide 250mcg/1ml x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'clopidogrel300',
            label: 'Clopidogrel 300mg Tabs',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'clopidogrel300_other',
            label: 'Clopidogrel 300mg Tabs - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'midazolam10_2_paramedic',
            label: 'Midazolam 10mg/2ml Amps x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'midazolam10_2_paramedic_other',
            label: 'Midazolam 10mg/2ml Amps x1 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'ondansetron4_2_paramedic',
            label: 'Ondansetron 4mg/2ml Amps x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ondansetron4_2_paramedic_other',
            label: 'Ondansetron 4mg/2ml Amps x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'ticagrelor90',
            label: 'Ticagrelor 90mg Tabs',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ticagrelor90_other',
            label: 'Ticagrelor 90mg Tabs - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'methoxyflurane1',
            label: 'Methoxyflurane x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'methoxyflurane1_other',
            label: 'Methoxyflurane x1 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'gtn_paramedic',
            label: 'GTN x1 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'gtn_paramedic_other',
            label: 'GTN x1 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'glucagon_paramedic',
            label: 'Glucagon x1 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'glucagon_paramedic_other',
            label: 'Glucagon x1 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'glucoseGelLift_paramedic',
            label:
              'Glucose Gel Tubes OR Lift Glucose Shot x2 (Input expiry date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'glucoseGelLift_paramedic_other',
            label:
              'Glucose Gel Tubes OR Lift Glucose Shot x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'salbutamol2_5_paramedic',
            label:
              'Salbutamol 2.5mg/2.5ml x5 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'salbutamol2_5_paramedic_other',
            label:
              'Salbutamol 2.5mg/2.5ml x5 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'salbutamol5_paramedic',
            label:
              'Salbutamol 5mg/2.5ml x5 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'salbutamol5_paramedic_other',
            label:
              'Salbutamol 5mg/2.5ml x5 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'chlorphenamineTabs_paramedic',
            label:
              'Chlorphenamine Tablets 4mg x14 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'chlorphenamineTabs_paramedic_other',
            label:
              'Chlorphenamine Tablets 4mg x14 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'paracetamol500_paramedic',
            label:
              'Paracetamol 500mg x20 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'paracetamol500_paramedic_other',
            label:
              'Paracetamol 500mg x20 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'ibuprofen200_paramedic',
            label:
              'Ibuprofen 200mg x20 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ibuprofen200_paramedic_other',
            label:
              'Ibuprofen 200mg x20 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'paracetamolSusp_paramedic',
            label:
              'Paracetamol Suspension 120mg/5ml (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'paracetamolSusp_paramedic_other',
            label:
              'Paracetamol Suspension 120mg/5ml - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'ibuprofenSusp_paramedic',
            label:
              'Ibuprofen Suspension 100mg/5ml (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ibuprofenSusp_paramedic_other',
            label:
              'Ibuprofen Suspension 100mg/5ml - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'chlorphenamineAmp_paramedic',
            label:
              'Chlorphenamine Amp x2 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'chlorphenamineAmp_paramedic_other',
            label:
              'Chlorphenamine Amp x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'naloxoneAmp_paramedic',
            label:
              'Naloxone Amp x2 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'naloxoneAmp_paramedic_other',
            label:
              'Naloxone Amp x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'adrenaline1_1000_paramedic',
            label:
              'Adrenaline Amp 1:1000 x2 (Input Expiry Date)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'adrenaline1_1000_paramedic_other',
            label:
              'Adrenaline Amp 1:1000 x2 - Other',
            type: 'textarea',
            required: false,
          },
          {
            id: 'drawingUpNeedles_paramedic',
            label: 'Drawing Up Needles x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'vanishPoint3ml_paramedic',
            label: 'Vanish Point 3ml x4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'syringes5ml_paramedic',
            label: 'Syringes 5ml x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'syringes10ml_paramedic',
            label: 'Syringes 10ml x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
    ],
  },
  apMeds: {
    id: 'apMeds',
    title: 'Advanced Paramedic Medications',
    description:
      'Advanced Paramedic medications checklist. If the controlled meds pouch tamper seal is tagged and intact, you may submit without opening the pouch. If the seal is broken or missing, select No and complete the full contents check below.',
    sections: [
      {
        id: 'apMeds-details',
        title: 'Controlled Meds Pouch Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'pin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'controlledPouchNumber',
            label: 'Controlled Medication Pouch Number',
            type: 'text',
            required: true,
          },
          {
            id: 'completedAt',
            label: 'Completion Date / Time',
            type: 'datetime',
            required: true,
          },
        ],
      },
      {
        id: 'apMeds-controlled',
        title: 'Controlled Meds Pouch',
        fields: [
          {
            id: 'controlledTamperTagged',
            label: 'Is the controlled meds pouch tamper seal tagged?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'ketamine200_20',
            label: 'Ketamine 200mg/20ml x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'fentanyl100_2',
            label: 'Fentanyl 100mcg/2ml x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'midazolam10_2',
            label: 'Midazolam 10mg/2ml x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'morphine10_1',
            label: 'Morphine 10mg/1ml x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'apMeds-other',
        title: 'Other Medications',
        fields: [
          {
            id: 'apBagTamperTagged',
            label: 'Is the AP meds Bag tamper seal tagged?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'liftGlucose_notPresent',
            label: 'LIFT Glucose Shot - Only tick if not in bag or expired (Not Present)',
            type: 'select',
            required: false,
            options: ['Not Present'],
          },
          {
            id: 'paracetamolSusp_amount',
            label: 'Paracetamol Suspension 120mg/5ml - amount (ml or bottles)',
            type: 'text',
            required: false,
          },
          {
            id: 'paracetamolSusp_expiry',
            label: 'Paracetamol Suspension 120mg/5ml - expiry date',
            type: 'text',
            required: false,
          },
          {
            id: 'pentrox_status',
            label: 'Pentrox - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Not in bag', 'Present but expired'],
          },
          {
            id: 'glucagon_status',
            label: 'Glucagon - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Not Present', 'Expired'],
          },
          {
            id: 'paracetamol500_amount',
            label:
              'Paracetamol 500mg - List amount of tablets',
            type: 'text',
            required: false,
          },
          {
            id: 'paracetamol500_expiry',
            label:
              'Paracetamol 500mg - expiry date',
            type: 'text',
            required: false,
          },
          {
            id: 'aspirin300_status',
            label:
              'Aspirin 300mg - Only Tick if amount is less than 3 tablets',
            type: 'select',
            required: false,
            options: ['Less than 3 tablets', 'None'],
          },
          {
            id: 'gtn_status',
            label:
              'GTN - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Not Present', 'Expired'],
          },
          {
            id: 'ondansetron_status',
            label:
              'Ondansetron 2mg/ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Amps', 'Amps Expired'],
          },
          {
            id: 'salbutamol2_5_status',
            label:
              'Salbutamol 2.5mg/2.5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 3 Present', 'Expired'],
          },
          {
            id: 'salbutamol5_status',
            label:
              'Salbutamol 5mg/2.5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 3 in bag', 'Expired'],
          },
          {
            id: 'chlorphenamineTabs_amount',
            label:
              'Chlorphenamine Tablets 4mg - List number of tablets',
            type: 'text',
            required: false,
          },
          {
            id: 'ibuprofen200_amount',
            label:
              'Ibuprofen 200mg - List amount of tablets',
            type: 'text',
            required: false,
          },
          {
            id: 'ibuprofen200_expiry',
            label:
              'Ibuprofen 200mg - expiry date',
            type: 'text',
            required: false,
          },
          {
            id: 'clopidogrel75_status',
            label:
              'Clopidogrel 75mg Tablet - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 4 tablets', 'Expired'],
          },
          {
            id: 'ticagrelor_status',
            label:
              'Ticagrelor Tablets - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 4 Tablets', 'Expired'],
          },
          {
            id: 'amiodarone150_status',
            label:
              'Amiodarone 150mg/3ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 3 Amps in Bag', 'Amps Expired', 'None present'],
          },
          {
            id: 'ibuprofenSusp_expiry',
            label:
              'Ibuprofen Suspension 100mg/5ml - expiry date',
            type: 'text',
            required: false,
          },
          {
            id: 'ibuprofenSusp_missing',
            label:
              'Ibuprofen Suspension 100mg/5ml - not present',
            type: 'select',
            required: false,
            options: ['Not Present'],
          },
          {
            id: 'chlorphenamineAmp_status',
            label:
              'Chlorphenamine Amp - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Present', 'Expired'],
          },
          {
            id: 'naloxone_status',
            label:
              'Naloxone Amp - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 present', 'Expired'],
          },
          {
            id: 'txa500_status',
            label:
              'TXA 500mg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Amps in Bag', 'Amps Expired'],
          },
          {
            id: 'adrenaline1_1000_status',
            label:
              'Adrenaline Amp 1:1000 - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 4 Amps present', 'Expired'],
          },
          {
            id: 'atropine600_status',
            label:
              'Atropine Amp 600mcg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 3 Amps Present', 'Expired'],
          },
          {
            id: 'ceftriaxone1g_status',
            label:
              'Ceftraxone 1g Vial - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Amps present', 'Expired Amps'],
          },
          {
            id: 'cyclizine50_status',
            label:
              'Cyclizine 50mg/ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Amps present', 'Expired Amps'],
          },
          {
            id: 'hydrocortisone_status',
            label:
              'Hydrocortione Amp - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 4 Amps present', 'Expired Amps'],
          },
          {
            id: 'ivParacetamol1g_status',
            label:
              'IV Paracetamol 1g/100ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Not present'],
          },
          {
            id: 'ipratropium500_status',
            label:
              'Ipratropium Bromide 500mcg Neb - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Nebs', 'Expired'],
          },
          {
            id: 'magnesium1g_status',
            label:
              'Magnesium Sulphate 1g/2ml - Only tick if not in bag or expired (x2)',
            type: 'select',
            required: false,
            options: ['Less than 2 Amps', 'Expired'],
          },
          {
            id: 'adenosine6mg_status',
            label:
              'Adenosine Amp 6mg - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 3 Amps', 'Expired Amps'],
          },
          {
            id: 'lidocaine1pct_status',
            label:
              'Lidocaine 1% 50mg in 5ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 3 Amps', 'Expired'],
          },
          {
            id: 'furosemide20_status',
            label:
              'Furosemide 20mg/2ml - Only tick if not in bag or expired',
            type: 'select',
            required: false,
            options: ['Less than 2 Amps', 'Expired'],
          },
        ],
      },
      {
        id: 'apMeds-consumables',
        title: 'Consumables',
        fields: [
          {
            id: 'syringes10ml',
            label: 'Syringes 10ml x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'syringes5ml',
            label: 'Syringes 5ml x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'safetyNeedles',
            label: 'Safety Needles x3',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawingUpNeedles',
            label: 'Drawing Up Needles x3',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
    ],
  },
  system24: {
    id: 'system24',
    title: '24 System',
    description:
      'Yellow 24 System checklist. If the minimum quantity or more is in place, select Yes. If there is less than the minimum quantity shown or none at all, select No. If an item is entirely missing please highlight this to the Operations Manager immediately. Please place any comments at the end of the form.',
    sections: [
      {
        id: 'system24-drawer1',
        title: 'Drawer 1',
        fields: [
          {
            id: 'drawer1_largeBurnDressings',
            label: '5x Large Burn Dressings',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer1_smallBurnDressings',
            label: '5x Small Burn Dressings',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer1_burnGel50ml',
            label: '6x 50ml Burn Gel',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer2',
        title: 'Drawer 2',
        fields: [
          {
            id: 'drawer2_intrasiteGel',
            label: '10x Intrasite Gel',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer2_silkTape',
            label: '12x Silk Tape',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer2_porousTape',
            label: '12x Pourous Tape',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer3',
        title: 'Drawer 3',
        fields: [
          {
            id: 'drawer3_jelonet10x10',
            label: '10x Jelonet Dressing 10x10',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer3_jelonet10x40',
            label: '10x Jelonet Dressing 10x40',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer3_inadine9x9',
            label: '15x Inadine Dressing 9x9',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer3_steristrips12x101',
            label: '50x Steristrips 12x101',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer3_steristrips6x101',
            label: '50x Steristrips 6x101',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer3_steristrips3x76',
            label: '15x Steristrips 3x76',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer4',
        title: 'Drawer 4',
        fields: [
          {
            id: 'drawer4_mepore9x30',
            label: '6x Mepore 9x30',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_mepore10x10',
            label: '30x Mepore 10x10',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_mepore10x20',
            label: '25x Mepore 10x20',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_mepore5x7',
            label: '30x Mepore 5x7',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_plasters',
            label: '200x Plasters',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_kidsPlasters',
            label: '10x Kids Plasters',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_alcoholWipes',
            label: '38x Alcohol Wipes',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_woundWipes',
            label: '40x Wound Wipes',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer4_eyeWashPods',
            label: '13x Eye Wash Pods',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer5',
        title: 'Drawer 5',
        fields: [
          {
            id: 'drawer5_conforming15x4',
            label: '20x Conforming Bandages 15x4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer5_conforming10x4',
            label: '20x Conforming Bandages 10x4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer5_conforming7x4',
            label: '20x Conforming Bandages 7x4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer5_conforming5x4',
            label: '20x Conforming Bandages 5x4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer5_conformingMix',
            label: '40x Conforming Bandages (mix of above)',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer6',
        title: 'Drawer 6',
        fields: [
          {
            id: 'drawer6_icePacks',
            label: '20x Ice Packs',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer6_crepe6x5',
            label: '5x Crepe Bandages 6x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer6_crepe8x5',
            label: '8x Crepe Bandages 8x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer6_crepe10x5',
            label: '5x Crepe Bandages 10x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer6_crepe15x5',
            label: '7x Crepe Bandages 15x5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer6_cottonWoolRoll',
            label: '2x Cotton Wool Roll',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer7',
        title: 'Drawer 7',
        fields: [
          {
            id: 'drawer7_sickBags',
            label: '50x Sick Bags',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer7_dressingPacks',
            label: '10x Dressing Packs',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer7_basicProcedurePacks',
            label: '6x Basic Procedure Pack',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      {
        id: 'system24-drawer8',
        title: 'Drawer 8',
        fields: [
          {
            id: 'drawer8_tubigripA',
            label: 'Tubigrip Size A',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_tubigripB',
            label: 'Tubigrip Size B',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_tubigripC',
            label: 'Tubigrip Size C',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_tubigripD',
            label: 'Tubigrip Size D',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_tubigripE',
            label: 'Tubigrip Size E',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_tubigripF',
            label: 'Tubigrip Size F',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_tubigripG',
            label: 'Tubigrip Size G',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'drawer8_kidneyDish',
            label: '7x Kidney Dish',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
        ],
      },
      // Additional drawers 9–24 can be added here in the same pattern.
      {
        id: 'system24-comments',
        title: 'Comments',
        fields: [
          {
            id: 'comments',
            label: 'Comments',
            type: 'textarea',
            required: true,
          },
        ],
      },
    ],
  },
  system48: {
    id: 'system48',
    title: 'ALS Bag',
    description:
      'ALS bag checklist. If the tamper seal is tagged and intact, you may submit without opening the bag. If the seal is broken or missing, select No and complete the full contents check below.',
    sections: [
      {
        id: 'system48-details',
        title: 'ALS Bag Details',
        fields: [
          {
            id: 'practitionerName',
            label: 'Practitioners Name',
            type: 'text',
            required: true,
          },
          {
            id: 'pin',
            label: 'Practitioners PIN',
            type: 'text',
            required: true,
          },
          {
            id: 'bagNumber',
            label: 'Bag Number',
            type: 'text',
            required: true,
          },
          {
            id: 'completedAt',
            label: 'Completion Date / Time',
            type: 'datetime',
            required: true,
          },
        ],
      },
      {
        id: 'system48-main',
        title: 'Main Compartment',
        fields: [
          {
            id: 'tamperSealTagged',
            label: 'Is the ALS bag tamper seal tagged?',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
            hint:
              'If Yes, you may submit without opening the bag. If No, you must complete the full contents check below.',
          },
        ],
      },
      {
        id: 'system48-pouch1',
        title: 'Pouch 1',
        fields: [
          {
            id: 'pouch1_dex10',
            label: 'Dex 10 x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch1_givingSets',
            label: 'Giving Sets x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch1_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch2',
        title: 'Pouch 2',
        fields: [
          {
            id: 'pouch2_nacl500',
            label: 'NACL 500ml x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch2_givingSets',
            label: 'Giving Sets x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch2_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch3',
        title: 'Pouch 3',
        fields: [
          {
            id: 'pouch3_adrenalinePrefilled',
            label: 'Adrenaline 1:10,000 Pre Filled x3',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch3_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch4',
        title: 'Pouch 4',
        fields: [
          {
            id: 'pouch4_tape',
            label: 'Tape x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch4_conformingBandage',
            label: 'Conforming Bandage x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch4_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch5',
        title: 'Pouch 5',
        fields: [
          {
            id: 'pouch5_opasSet',
            label: 'OPAs Full Set 00-4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch5_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch6',
        title: 'Pouch 6',
        fields: [
          {
            id: 'pouch6_npas',
            label: 'NPAs 6,7,8',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch6_lube',
            label: 'Lube present',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch6_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch7',
        title: 'Pouch 7',
        fields: [
          {
            id: 'pouch7_catheterMount',
            label: 'Cathether Mount',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch7_bvmFilter',
            label: 'BVM Filter',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch7_endTidal',
            label: 'End Tidal',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch7_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch8',
        title: 'Pouch 8',
        fields: [
          {
            id: 'pouch8_chestSeal',
            label: 'Chest Seal',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch8_syringe20',
            label: '20ml Syringes',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch8_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch9',
        title: 'Pouch 9',
        fields: [
          {
            id: 'pouch9_tubeHolder',
            label: 'Tube Holder',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch9_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch10',
        title: 'Pouch 10',
        fields: [
          {
            id: 'pouch10_magills',
            label: 'Magils Forceps',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch10_etTube65',
            label: 'ET Tube 6.5 x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch10_etTube75',
            label: 'ET Tube 7.5 x2',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch10_etTube8',
            label: 'ET Tube 8 x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch10_etTube85',
            label: 'ET Tube 8.5 x1',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch10_spareTubeTie',
            label: 'Spare Tube Tie',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch10_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-pouch11',
        title: 'Pouch 11',
        fields: [
          {
            id: 'pouch11_laryngoscopeHandle',
            label: 'Laryngscope Handle',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch11_blades3and4',
            label: 'Blades 3 & 4',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'pouch11_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
      {
        id: 'system48-top',
        title: 'Top Compartment',
        fields: [
          {
            id: 'topCompartment_igels345',
            label: 'Igels 3,4,5',
            type: 'select',
            required: true,
            options: ['Yes', 'No'],
          },
          {
            id: 'topCompartment_other',
            label: 'Other',
            type: 'textarea',
            required: false,
          },
        ],
      },
    ],
  },
};


