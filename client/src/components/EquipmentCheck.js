import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import './EquipmentCheck.css';

const EquipmentCheck = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [formData, setFormData] = useState({
    registration: '',
    vehicleCallsign: '',
    startMileage: '',
    startFuel: '',
    fuelCardPresent: '',
    // Section 1
    sideLights: '',
    mainBeam: '',
    fogLightRear: '',
    indicatorsRight: '',
    indicatorsHazards: '',
    headLights: '',
    fogLightFront: '',
    indicatorsLeft: '',
    brakeLights: '',
    orangeBeacon: '',
    engineOil: '',
    screenWash: '',
    // Section 2
    lightbarFront: '',
    sceneLightsLeft: '',
    grillLights: '',
    headlightFlash: '',
    lightbarRear: '',
    sceneLightsRight: '',
    rearReds: '',
    // Section 3
    entonoxSpare: '',
    oxygenHX1: '',
    oxygenCD1: '',
    oxygenCD3Stretcher: '',
    entonoxBag: '',
    oxygenHX2: '',
    oxygenCD2: '',
    // Section 4
    seatsSeatbelts: '',
    satNavIA: '',
    commsPhoneCable: '',
    dashboardWarningLights: '',
    torch: '',
    strykerBatterySpare: '',
    airConditioning: '',
    fireExtinguisher: '',
    switchesDashboard: '',
    commsRadioPDA: '',
    vehicleRadio: '',
    interiorLighting: '',
    helmets: '',
    spareBulbs: '',
    cabinHeater: '',
    // Section 5
    seatsSeatbeltsPatient: '',
    carryChairStraps: '',
    spinalBoard: '',
    monitorDefib: '',
    responseBag: '',
    mangaElkCushion: '',
    fullIPCKits: '',
    generalHeater: '',
    fireExtinguisherPatient: '',
    stretcherStraps: '',
    carryChairTracks: '',
    orthopaedicStretcher: '',
    lsuSuctionUnit: '',
    pouches: '',
    reusableFFP3: '',
    monitorDefibSpareBatteries: '',
    internalLighting: '',
    vehicleFluids: '',
    // Section 6
    ked: '',
    boxSplints: '',
    tractionSplint: '',
    pelvicSplint: '',
    spiderStraps: '',
    vacuumSplints: '',
    supportBelt: '',
    headBlocks: '',
    blanketsSheets: '',
    rescueDeviceMIBS: '',
    // Section 7
    damageNotes: '',
    // Section 8
    staffName: '',
    staffSignature: ''
  });

  const [photos, setPhotos] = useState({
    frontPhoto: null,
    nearsidePhoto: null,
    rearPhoto: null,
    offsidePhoto: null
  });

  const [uploadedPhotos, setUploadedPhotos] = useState({
    frontPhoto: false,
    nearsidePhoto: false,
    rearPhoto: false,
    offsidePhoto: false
  });

  useEffect(() => {
    // Load registrations / vehicles for the VDI registration dropdown
    const loadVehicles = async () => {
      try {
        const res = await api.get('/api/vehicles');
        if (Array.isArray(res.data)) {
          setRegistrations(res.data);
        }
      } catch (err) {
        console.error('Error loading vehicles for VDI form', err);
        // Fallback: keep hard-coded sample registrations
      }
    };

    loadVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setPhotos(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Upload file immediately
      const formData = new FormData();
      formData.append('file', file);

      try {
        await api.post(`/api/upload/${fieldName}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setUploadedPhotos(prev => ({
          ...prev,
          [fieldName]: true
        }));
      } catch (error) {
        console.error('Error uploading photo:', error);
        alert('Error uploading photo. Please try again.');
        // Reset the file input
        e.target.value = '';
        setPhotos(prev => ({
          ...prev,
          [fieldName]: null
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!pin) {
      alert('Crew Member PIN Number 1 is required');
      return;
    }

    if (!uploadedPhotos.frontPhoto || !uploadedPhotos.nearsidePhoto || 
        !uploadedPhotos.rearPhoto || !uploadedPhotos.offsidePhoto) {
      alert('Please upload all required photos');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('data', JSON.stringify({ ...formData, pin, pin2 }));
    
    Object.keys(photos).forEach(key => {
      if (photos[key]) {
        formDataToSend.append(key, photos[key]);
      }
    });

    try {
      await api.post('/api/equipment-checks', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Equipment check submitted successfully!');
      navigate('/checklists');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      setFormData({
        registration: '',
        vehicleCallsign: '',
        startMileage: '',
        startFuel: '',
        fuelCardPresent: '',
        sideLights: '',
        mainBeam: '',
        fogLightRear: '',
        indicatorsRight: '',
        indicatorsHazards: '',
        headLights: '',
        fogLightFront: '',
        indicatorsLeft: '',
        brakeLights: '',
        orangeBeacon: '',
        engineOil: '',
        screenWash: '',
        lightbarFront: '',
        sceneLightsLeft: '',
        grillLights: '',
        headlightFlash: '',
        lightbarRear: '',
        sceneLightsRight: '',
        rearReds: '',
        entonoxSpare: '',
        oxygenHX1: '',
        oxygenCD1: '',
        oxygenCD3Stretcher: '',
        entonoxBag: '',
        oxygenHX2: '',
        oxygenCD2: '',
        seatsSeatbelts: '',
        satNavIA: '',
        commsPhoneCable: '',
        dashboardWarningLights: '',
        torch: '',
        strykerBatterySpare: '',
        airConditioning: '',
        fireExtinguisher: '',
        switchesDashboard: '',
        commsRadioPDA: '',
        vehicleRadio: '',
        interiorLighting: '',
        helmets: '',
        spareBulbs: '',
        cabinHeater: '',
        seatsSeatbeltsPatient: '',
        carryChairStraps: '',
        spinalBoard: '',
        monitorDefib: '',
        responseBag: '',
        mangaElkCushion: '',
        fullIPCKits: '',
        generalHeater: '',
        fireExtinguisherPatient: '',
        stretcherStraps: '',
        carryChairTracks: '',
        orthopaedicStretcher: '',
        lsuSuctionUnit: '',
        pouches: '',
        reusableFFP3: '',
        monitorDefibSpareBatteries: '',
        internalLighting: '',
        vehicleFluids: '',
        ked: '',
        boxSplints: '',
        tractionSplint: '',
        pelvicSplint: '',
        spiderStraps: '',
        vacuumSplints: '',
        supportBelt: '',
        headBlocks: '',
        blanketsSheets: '',
        rescueDeviceMIBS: '',
        damageNotes: '',
        staffName: '',
        staffSignature: ''
      });
      setPhotos({
        frontPhoto: null,
        nearsidePhoto: null,
        rearPhoto: null,
        offsidePhoto: null
      });
      setUploadedPhotos({
        frontPhoto: false,
        nearsidePhoto: false,
        rearPhoto: false,
        offsidePhoto: false
      });
      setPin('');
      setPin2('');
    }
  };

  const renderStatusSelect = (name, value, options = []) => {
    // Define small, checklist-style option sets (with green/red circles)
    const optionSets = {
      working: [
        { value: 'working', label: '🟢 Working' },
        { value: 'notWorking', label: '🔴 Not Working' },
      ],
      gases: [
        { value: 'Empty', label: 'Empty' },
        { value: '1/4', label: '1/4' },
        { value: '1/2', label: '1/2' },
        { value: '3/4', label: '3/4' },
        { value: 'Full', label: 'Full' },
      ],
      present: [
        { value: 'present', label: '🟢 Present' },
        { value: 'notPresent', label: '🔴 Not Present' },
      ],
      min: [
        { value: 'aboveMinimum', label: '🟢 Above Minimum' },
        { value: 'belowMinimum', label: '🔴 Below Minimum' },
      ],
      charged: [
        { value: 'charged', label: '🟢 Charged' },
        { value: 'notCharged', label: '🔴 Not Charged' },
      ],
      condition: [
        { value: 'goodCondition', label: '🟢 Good Condition' },
        { value: 'poorCondition', label: '🔴 Poor Condition' },
      ],
      presentGood: [
        { value: 'presentGoodCondition', label: '🟢 Present / Good Condition' },
        { value: 'notPresent', label: '🔴 Not Present' },
      ],
      tagged: [
        { value: 'presentGreenTagged', label: '🟢 Present (Green Tagged)' },
        { value: 'notPresent', label: '🔴 Not Present' },
      ],
    };

    // Choose the most appropriate option set per field
    const fieldGroup = (() => {
      // Simple working / not working checks
      const workingFields = new Set([
        'sideLights',
        'mainBeam',
        'fogLightRear',
        'indicatorsRight',
        'indicatorsHazards',
        'headLights',
        'fogLightFront',
        'indicatorsLeft',
        'brakeLights',
        'orangeBeacon',
        'screenWash',
        'lightbarFront',
        'sceneLightsLeft',
        'grillLights',
        'headlightFlash',
        'lightbarRear',
        'sceneLightsRight',
        'rearReds',
        'seatsSeatbelts',
        'satNavIA',
        'commsPhoneCable',
        'dashboardWarningLights',
        'torch',
        'airConditioning',
        'switchesDashboard',
        'commsRadioPDA',
        'vehicleRadio',
        'interiorLighting',
        'cabinHeater',
        'seatsSeatbeltsPatient',
        'monitorDefib',
        'mangaElkCushion',
        'generalHeater',
        'carryChairTracks',
        'lsuSuctionUnit',
        'internalLighting',
      ]);

      // Presence-only style checks
      const presentFields = new Set([
        'fireExtinguisher',
        'spareBulbs',
        'fireExtinguisherPatient',
        'spinalBoard',
        'fullIPCKits',
        'orthopaedicStretcher',
        'reusableFFP3',
        'monitorDefibSpareBatteries',
        'vehicleFluids',
        'ked',
        'boxSplints',
        'tractionSplint',
        'pelvicSplint',
        'vacuumSplints',
        'supportBelt',
        'headBlocks',
        'blanketsSheets',
        'rescueDeviceMIBS',
        'entonoxSpare',
        'oxygenHX1',
        'oxygenCD1',
        'oxygenCD3Stretcher',
        'entonoxBag',
        'oxygenHX2',
        'oxygenCD2',
      ]);

      // Above / below minimum (fluids etc.)
      const minFields = new Set(['engineOil']);

      // Battery / charger style
      const chargedFields = new Set(['strykerBatterySpare']);

      // Condition-focused
      const conditionFields = new Set(['helmets']);

      // Present & good or tagged
      const presentGoodFields = new Set(['carryChairStraps', 'stretcherStraps']);
      const taggedFields = new Set(['responseBag', 'pouches']);

      // Medical gases – use volume levels
      const gasFields = new Set([
        'entonoxSpare',
        'oxygenHX1',
        'oxygenCD1',
        'oxygenCD3Stretcher',
        'entonoxBag',
        'oxygenHX2',
        'oxygenCD2',
      ]);

      if (workingFields.has(name)) return 'working';
      if (presentFields.has(name)) return 'present';
      if (minFields.has(name)) return 'min';
      if (chargedFields.has(name)) return 'charged';
      if (conditionFields.has(name)) return 'condition';
      if (presentGoodFields.has(name)) return 'presentGood';
      if (taggedFields.has(name)) return 'tagged';
      if (gasFields.has(name)) return 'gases';

      // Fallback to simple working set if nothing matches
      return 'working';
    })();

    const selectOptions =
      options.length > 0
        ? options
        : optionSets[fieldGroup] || optionSets.working;

    return (
      <select name={name} value={value} onChange={handleInputChange} required>
        <option value="">Select</option>
        {selectOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  };

  return (
    <div className="equipment-check-container">
      <div className="content-wrapper">
        <h2 className="form-title">VDI – Start of Shift</h2>
        
        <form onSubmit={handleSubmit} className="equipment-form">
          {/* PIN Requirement */}
          <div className="pin-section">
            <div className="form-group">
              <label htmlFor="pin">Crew Member PIN Number <span className="required">*</span></label>
              <input
                type="password"
                id="pin"
                name="pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                placeholder="Enter your PIN"
              />
            </div>
            <div className="form-group">
              <label htmlFor="pin2">Crew Member PIN Number 2 (optional)</label>
              <input
                type="password"
                id="pin2"
                name="pin2"
                value={pin2}
                onChange={(e) => setPin2(e.target.value)}
                placeholder="Enter second crew PIN (if applicable)"
              />
            </div>
          </div>

          {/* Start Shift Section */}
          <div className="form-section">
            <h3>Start Shift</h3>
            <div className="form-group">
              <label htmlFor="registration">Registration <span className="required">*</span></label>
              <select id="registration" name="registration" value={formData.registration} onChange={handleInputChange} required>
                <option value="">Select</option>
                {registrations.length > 0
                  ? registrations.map(v => (
                      <option key={v.id} value={v.registration}>
                        {v.registration}
                        {v.callsign ? ` – ${v.callsign}` : ''}
                      </option>
                    ))
                  : (
                    <>
                      {/* Fallback sample registrations if no vehicles configured yet */}
                      <option value="191-KE-2345">191-KE-2345</option>
                      <option value="192-KE-9081">192-KE-9081</option>
                      <option value="201-KE-4412">201-KE-4412</option>
                      <option value="202-KE-7730">202-KE-7730</option>
                      <option value="211-KE-1258">211-KE-1258</option>
                      <option value="221-KE-5679">221-KE-5679</option>
                      <option value="231-KE-9023">231-KE-9023</option>
                      <option value="241-KE-3147">241-KE-3147</option>
                    </>
                  )}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="vehicleCallsign">Vehicle Call Sign</label>
              <input
                type="text"
                id="vehicleCallsign"
                name="vehicleCallsign"
                value={formData.vehicleCallsign}
                onChange={handleInputChange}
                placeholder="Enter call sign"
              />
            </div>
            <div className="form-group">
              <label htmlFor="startMileage">Start Mileage <span className="required">*</span></label>
              <input
                type="number"
                id="startMileage"
                name="startMileage"
                value={formData.startMileage}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startFuel">Start Fuel <span className="required">*</span></label>
              <select id="startFuel" name="startFuel" value={formData.startFuel} onChange={handleInputChange} required>
                <option value="">Select</option>
                <option value="full">Full</option>
                <option value="threeQuarter">3/4</option>
                <option value="half">1/2</option>
                <option value="quarter">1/4</option>
                <option value="empty">Empty</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="fuelCardPresent">Is the correct fuel card present for the vehicle? <span className="required">*</span></label>
              <select
                id="fuelCardPresent"
                name="fuelCardPresent"
                value={formData.fuelCardPresent}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          {/* Section 1 */}
          <div className="form-section">
            <h3>Section 1 - Vehicle Lighting/Fluids</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Side Lights <span className="required">*</span></label>
                {renderStatusSelect('sideLights', formData.sideLights)}
              </div>
              <div className="form-group">
                <label>Main Beam <span className="required">*</span></label>
                {renderStatusSelect('mainBeam', formData.mainBeam)}
              </div>
              <div className="form-group">
                <label>Fog Light (Rear) <span className="required">*</span></label>
                {renderStatusSelect('fogLightRear', formData.fogLightRear)}
              </div>
              <div className="form-group">
                <label>Indicators (Right) <span className="required">*</span></label>
                {renderStatusSelect('indicatorsRight', formData.indicatorsRight)}
              </div>
              <div className="form-group">
                <label>Indicators (Hazards) <span className="required">*</span></label>
                {renderStatusSelect('indicatorsHazards', formData.indicatorsHazards)}
              </div>
              <div className="form-group">
                <label>Head Lights <span className="required">*</span></label>
                {renderStatusSelect('headLights', formData.headLights)}
              </div>
              <div className="form-group">
                <label>Fog Light (Front) <span className="required">*</span></label>
                {renderStatusSelect('fogLightFront', formData.fogLightFront)}
              </div>
              <div className="form-group">
                <label>Indicators (Left) <span className="required">*</span></label>
                {renderStatusSelect('indicatorsLeft', formData.indicatorsLeft)}
              </div>
              <div className="form-group">
                <label>Brake Lights <span className="required">*</span></label>
                {renderStatusSelect('brakeLights', formData.brakeLights)}
              </div>
              <div className="form-group">
                <label>Orange Beacon <span className="required">*</span></label>
                {renderStatusSelect('orangeBeacon', formData.orangeBeacon)}
              </div>
              <div className="form-group">
                <label>Engine Oil <span className="required">*</span></label>
                {renderStatusSelect('engineOil', formData.engineOil)}
              </div>
              <div className="form-group">
                <label>Screen Wash <span className="required">*</span></label>
                {renderStatusSelect('screenWash', formData.screenWash)}
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="form-section">
            <h3>Section 2 - Emergency Lighting/Sirens</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Lightbar (Front) <span className="required">*</span></label>
                {renderStatusSelect('lightbarFront', formData.lightbarFront)}
              </div>
              <div className="form-group">
                <label>Scene Lights (Left) <span className="required">*</span></label>
                {renderStatusSelect('sceneLightsLeft', formData.sceneLightsLeft)}
              </div>
              <div className="form-group">
                <label>Grill Lights <span className="required">*</span></label>
                {renderStatusSelect('grillLights', formData.grillLights)}
              </div>
              <div className="form-group">
                <label>Headlight Flash <span className="required">*</span></label>
                {renderStatusSelect('headlightFlash', formData.headlightFlash)}
              </div>
              <div className="form-group">
                <label>Lightbar (Rear) <span className="required">*</span></label>
                {renderStatusSelect('lightbarRear', formData.lightbarRear)}
              </div>
              <div className="form-group">
                <label>Scene Lights (Right) <span className="required">*</span></label>
                {renderStatusSelect('sceneLightsRight', formData.sceneLightsRight)}
              </div>
              <div className="form-group">
                <label>Rear Reds <span className="required">*</span></label>
                {renderStatusSelect('rearReds', formData.rearReds)}
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="form-section">
            <h3>Section 3 - Medical Gases</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Entonox Spare <span className="required">*</span></label>
                {renderStatusSelect('entonoxSpare', formData.entonoxSpare)}
              </div>
              <div className="form-group">
                <label>Oxygen (HX - 1) <span className="required">*</span></label>
                {renderStatusSelect('oxygenHX1', formData.oxygenHX1)}
              </div>
              <div className="form-group">
                <label>Oxygen (CD - 1) <span className="required">*</span></label>
                {renderStatusSelect('oxygenCD1', formData.oxygenCD1)}
              </div>
              <div className="form-group">
                <label>Oxygen (CD - 3 Stretcher) <span className="required">*</span></label>
                {renderStatusSelect('oxygenCD3Stretcher', formData.oxygenCD3Stretcher)}
              </div>
              <div className="form-group">
                <label>Entonox Bag <span className="required">*</span></label>
                {renderStatusSelect('entonoxBag', formData.entonoxBag)}
              </div>
              <div className="form-group">
                <label>Oxygen (HX - 2) <span className="required">*</span></label>
                {renderStatusSelect('oxygenHX2', formData.oxygenHX2)}
              </div>
              <div className="form-group">
                <label>Oxygen (CD - 2) <span className="required">*</span></label>
                {renderStatusSelect('oxygenCD2', formData.oxygenCD2)}
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="form-section">
            <h3>Section 4 - Cockpit Checks</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Seats + Seatbelts <span className="required">*</span></label>
                {renderStatusSelect('seatsSeatbelts', formData.seatsSeatbelts)}
              </div>
              <div className="form-group">
                <label>Sat Nav (IA) <span className="required">*</span></label>
                {renderStatusSelect('satNavIA', formData.satNavIA)}
              </div>
              <div className="form-group">
                <label>Comms Phone/Cable <span className="required">*</span></label>
                {renderStatusSelect('commsPhoneCable', formData.commsPhoneCable)}
              </div>
              <div className="form-group">
                <label>Dashboard Warning Lights <span className="required">*</span></label>
                {renderStatusSelect('dashboardWarningLights', formData.dashboardWarningLights)}
              </div>
              <div className="form-group">
                <label>Torch <span className="required">*</span></label>
                {renderStatusSelect('torch', formData.torch)}
              </div>
              <div className="form-group">
                <label>Stryker Battery (Spare) <span className="required">*</span></label>
                {renderStatusSelect('strykerBatterySpare', formData.strykerBatterySpare)}
              </div>
              <div className="form-group">
                <label>Air Conditioning <span className="required">*</span></label>
                {renderStatusSelect('airConditioning', formData.airConditioning)}
              </div>
              <div className="form-group">
                <label>Fire Extinguisher <span className="required">*</span></label>
                {renderStatusSelect('fireExtinguisher', formData.fireExtinguisher)}
              </div>
              <div className="form-group">
                <label>Switches/Dashboard <span className="required">*</span></label>
                {renderStatusSelect('switchesDashboard', formData.switchesDashboard)}
              </div>
              <div className="form-group">
                <label>Comms Radio/PDA <span className="required">*</span></label>
                {renderStatusSelect('commsRadioPDA', formData.commsRadioPDA)}
              </div>
              <div className="form-group">
                <label>Vehicle Radio <span className="required">*</span></label>
                {renderStatusSelect('vehicleRadio', formData.vehicleRadio)}
              </div>
              <div className="form-group">
                <label>Interior Lighting <span className="required">*</span></label>
                {renderStatusSelect('interiorLighting', formData.interiorLighting)}
              </div>
              <div className="form-group">
                <label>Helmets (x2) <span className="required">*</span></label>
                {renderStatusSelect('helmets', formData.helmets)}
              </div>
              <div className="form-group">
                <label>Spare Bulbs <span className="required">*</span></label>
                {renderStatusSelect('spareBulbs', formData.spareBulbs)}
              </div>
              <div className="form-group">
                <label>Cabin Heater <span className="required">*</span></label>
                {renderStatusSelect('cabinHeater', formData.cabinHeater)}
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="form-section">
            <h3>Section 5 - Patient Area</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Seats + Seatbelts <span className="required">*</span></label>
                {renderStatusSelect('seatsSeatbeltsPatient', formData.seatsSeatbeltsPatient)}
              </div>
              <div className="form-group">
                <label>Carry Chair + Straps <span className="required">*</span></label>
                {renderStatusSelect('carryChairStraps', formData.carryChairStraps)}
              </div>
              <div className="form-group">
                <label>Spinal Board <span className="required">*</span></label>
                {renderStatusSelect('spinalBoard', formData.spinalBoard)}
              </div>
              <div className="form-group">
                <label>Monitor / Defib <span className="required">*</span></label>
                {renderStatusSelect('monitorDefib', formData.monitorDefib)}
              </div>
              <div className="form-group">
                <label>Response Bag <span className="required">*</span></label>
                {renderStatusSelect('responseBag', formData.responseBag)}
              </div>
              <div className="form-group">
                <label>Manga Elk / Cushion <span className="required">*</span></label>
                {renderStatusSelect('mangaElkCushion', formData.mangaElkCushion)}
              </div>
              <div className="form-group">
                <label>Full IPC Kits (x2) <span className="required">*</span></label>
                {renderStatusSelect('fullIPCKits', formData.fullIPCKits)}
              </div>
              <div className="form-group">
                <label>General Heater <span className="required">*</span></label>
                {renderStatusSelect('generalHeater', formData.generalHeater)}
              </div>
              <div className="form-group">
                <label>Fire Extinguisher <span className="required">*</span></label>
                {renderStatusSelect('fireExtinguisherPatient', formData.fireExtinguisherPatient)}
              </div>
              <div className="form-group">
                <label>Stretcher + Straps <span className="required">*</span></label>
                {renderStatusSelect('stretcherStraps', formData.stretcherStraps)}
              </div>
              <div className="form-group">
                <label>Carry Chair Tracks <span className="required">*</span></label>
                {renderStatusSelect('carryChairTracks', formData.carryChairTracks)}
              </div>
              <div className="form-group">
                <label>Orthopaedic Stretcher (Scoop) <span className="required">*</span></label>
                {renderStatusSelect('orthopaedicStretcher', formData.orthopaedicStretcher)}
              </div>
              <div className="form-group">
                <label>LSU Suction Unit <span className="required">*</span></label>
                {renderStatusSelect('lsuSuctionUnit', formData.lsuSuctionUnit)}
              </div>
              <div className="form-group">
                <label>Pouches <span className="required">*</span></label>
                {renderStatusSelect('pouches', formData.pouches)}
              </div>
              <div className="form-group">
                <label>Reusable FFP3 (x2) <span className="required">*</span></label>
                {renderStatusSelect('reusableFFP3', formData.reusableFFP3)}
              </div>
              <div className="form-group">
                <label>Monitor / Defib Spare Batteries <span className="required">*</span></label>
                {renderStatusSelect('monitorDefibSpareBatteries', formData.monitorDefibSpareBatteries)}
              </div>
              <div className="form-group">
                <label>Internal Lighting <span className="required">*</span></label>
                {renderStatusSelect('internalLighting', formData.internalLighting)}
              </div>
              <div className="form-group">
                <label>Vehicle Fluids (Sodium Chloride) <span className="required">*</span></label>
                {renderStatusSelect('vehicleFluids', formData.vehicleFluids)}
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="form-section">
            <h3>Section 6 - Patient Equipment</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Kendrick Extrication Device (KED) <span className="required">*</span></label>
                {renderStatusSelect('ked', formData.ked)}
              </div>
              <div className="form-group">
                <label>Box Splints <span className="required">*</span></label>
                {renderStatusSelect('boxSplints', formData.boxSplints)}
              </div>
              <div className="form-group">
                <label>Traction Splint <span className="required">*</span></label>
                {renderStatusSelect('tractionSplint', formData.tractionSplint)}
              </div>
              <div className="form-group">
                <label>Pelvic Splint <span className="required">*</span></label>
                {renderStatusSelect('pelvicSplint', formData.pelvicSplint)}
              </div>
              <div className="form-group">
                <label>Spider Straps <span className="required">*</span></label>
                {renderStatusSelect('spiderStraps', formData.spiderStraps)}
              </div>
              <div className="form-group">
                <label>Vacuum Splints <span className="required">*</span></label>
                {renderStatusSelect('vacuumSplints', formData.vacuumSplints)}
              </div>
              <div className="form-group">
                <label>Support Belt <span className="required">*</span></label>
                {renderStatusSelect('supportBelt', formData.supportBelt)}
              </div>
              <div className="form-group">
                <label>Head Blocks <span className="required">*</span></label>
                {renderStatusSelect('headBlocks', formData.headBlocks)}
              </div>
              <div className="form-group">
                <label>Blankets / Sheets <span className="required">*</span></label>
                {renderStatusSelect('blanketsSheets', formData.blanketsSheets)}
              </div>
              <div className="form-group">
                <label>Rescue Device (MIBS) <span className="required">*</span></label>
                {renderStatusSelect('rescueDeviceMIBS', formData.rescueDeviceMIBS)}
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="form-section">
            <h3>Section 7 - Photos/Comments</h3>
            <p className="section-note">Please upload one photo at a time. You MUST ensure these are uploaded before you move on to the next photo. Once an image has been uploaded, it will appear at the top of the box and it will turn green.</p>
            
            <div className="photo-upload-grid">
              <div className={`photo-upload-box ${uploadedPhotos.frontPhoto ? 'uploaded' : ''}`}>
                <label htmlFor="frontPhoto">Front Photo <span className="required">*</span></label>
                <input
                  type="file"
                  id="frontPhoto"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'frontPhoto')}
                  required
                />
                {uploadedPhotos.frontPhoto && <span className="upload-success">? Uploaded</span>}
              </div>
              <div className={`photo-upload-box ${uploadedPhotos.nearsidePhoto ? 'uploaded' : ''}`}>
                <label htmlFor="nearsidePhoto">Nearside Photo <span className="required">*</span></label>
                <input
                  type="file"
                  id="nearsidePhoto"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'nearsidePhoto')}
                  required
                />
                {uploadedPhotos.nearsidePhoto && <span className="upload-success">? Uploaded</span>}
              </div>
              <div className={`photo-upload-box ${uploadedPhotos.rearPhoto ? 'uploaded' : ''}`}>
                <label htmlFor="rearPhoto">Rear Photo <span className="required">*</span></label>
                <input
                  type="file"
                  id="rearPhoto"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'rearPhoto')}
                  required
                />
                {uploadedPhotos.rearPhoto && <span className="upload-success">? Uploaded</span>}
              </div>
              <div className={`photo-upload-box ${uploadedPhotos.offsidePhoto ? 'uploaded' : ''}`}>
                <label htmlFor="offsidePhoto">Offside Photo <span className="required">*</span></label>
                <input
                  type="file"
                  id="offsidePhoto"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'offsidePhoto')}
                  required
                />
                {uploadedPhotos.offsidePhoto && <span className="upload-success">? Uploaded</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="damageNotes">Damage Notes/Comments</label>
              <textarea
                id="damageNotes"
                name="damageNotes"
                value={formData.damageNotes}
                onChange={handleInputChange}
                rows="4"
              />
            </div>
          </div>

          {/* Section 8 */}
          <div className="form-section">
            <h3>Section 8 - Staff Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="staffName">Staff Name <span className="required">*</span></label>
                <input
                  type="text"
                  id="staffName"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="staffSignature">Staff Signature <span className="required">*</span></label>
                <input
                  type="text"
                  id="staffSignature"
                  name="staffSignature"
                  value={formData.staffSignature}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentCheck;

