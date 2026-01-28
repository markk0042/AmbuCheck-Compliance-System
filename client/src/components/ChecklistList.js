import React from 'react';
import './ChecklistList.css';

const ChecklistList = () => {
  return (
    <div className="hero-ambulance">
      <div className="hero-ambulance__overlay">
        <div className="hero-ambulance__content">
          <div className="hero-ambulance__copy">
            <div className="hero-ambulance__eyebrow">AmbuCheck • Ambulance Compliance Suite</div>
            <h1>On‑Shift Ambulance Compliance, Made Simple.</h1>
            <p>
              Capture VDI start‑of‑shift, end‑of‑shift and equipment checks in one secure,
              easy‑to‑use app. Give crews a clear checklist every time the wheels roll.
            </p>
            <p className="hero-ambulance__note">
              On tablet devices, AmbuCheck looks best in horizontal (landscape) view.
            </p>
            <ul className="hero-ambulance__bullets">
              <li>Standardised daily VDI forms for every vehicle.</li>
              <li>Bag, monitor and medication checks at a glance.</li>
              <li>Designed for tablets and mobiles on the front line.</li>
            </ul>
          </div>

          <div className="hero-ambulance__phone">
            <div className="phone-mockup">
              <div className="phone-mockup__bezel">
                <div className="phone-mockup__notch" />
                <div className="phone-mockup__screen">
                  {/* This image should be a screenshot of your VDI – Start of Shift screen */}
                  <img
                    src="/vdi-start-screen.png"
                    alt="AmbuCheck VDI – Start of Shift screen"
                  />
                </div>
              </div>
              <div className="phone-mockup__shadow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistList;

