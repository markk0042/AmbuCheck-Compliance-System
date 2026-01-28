import React from 'react';
import './ChecklistList.css';

const ChecklistList = () => {
  return (
    <div className="onboarding-hero">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="onboarding-text">
            <h2>Onboarding &amp; Login</h2>
            <p>
              These screens help crews understand the app’s goal from the very first
              moment. AmbuCheck provides a clear welcome experience and a simple,
              secure sign‑in so staff can get straight to vehicle and equipment checks.
            </p>
          </div>
          <div className="onboarding-meta">
            <div className="onboarding-meta-box">
              <span className="onboarding-meta-number">3</span>
              <span className="onboarding-meta-label">Key flows</span>
            </div>
          </div>
        </div>

        <div className="onboarding-devices">
          <div className="device-frame">
            <div className="device-screen">
              <h3>Welcome to AmbuCheck</h3>
              <p className="device-copy">
                A simple compliance suite to guide you through start‑of‑shift,
                end‑of‑shift and equipment checks – all in one place.
              </p>
              <div className="device-footer">
                <span className="device-dots">
                  <span className="dot active" />
                  <span className="dot" />
                  <span className="dot" />
                </span>
                <button className="device-button">Next</button>
              </div>
            </div>
          </div>

          <div className="device-frame device-center">
            <div className="device-screen">
              <h3 className="device-title">Sign in to continue</h3>
              <p className="device-copy">
                Enter your crew credentials to access VDI checks, equipment lists and
                medication bags.
              </p>
              <div className="device-form">
                <div className="device-input" />
                <div className="device-input" />
                <button className="device-button primary">Sign in</button>
                <button className="device-button secondary">View checks</button>
              </div>
            </div>
          </div>

          <div className="device-frame">
            <div className="device-screen">
              <h3>Keep everything in one place</h3>
              <p className="device-copy">
                Quickly see which vehicles, bags and monitors are ready for duty and
                which need attention before patient contact.
              </p>
              <div className="device-footer right">
                <button className="device-button">Let&apos;s start</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistList;

