import React from 'react';
import './ChecklistList.css';

const ChecklistList = () => {
  return (
    <div className="checklist-list-container">
      <div className="content-wrapper">
        <div className="checklist-list-header">
          <h2>Welcome to AmbuCheck</h2>
          <p>
            Please follow these steps at the start and end of every shift, and complete the
            required equipment and bag checks before patient contact.
          </p>
        </div>

        <div className="checklist-grid">
          <div className="checklist-card">
            <h3>VDI – Start of Shift</h3>
            <p>
              At the <strong>start of every shift</strong>, you must complete the
              VDI – Start of Shift to check the vehicle&rsquo;s lights, fluids,
              cockpit, patient area and required photos before leaving base.
            </p>
          </div>

          <div className="checklist-card">
            <h3>VDI – End of Shift</h3>
            <p>
              At the <strong>end of every shift</strong>, you must complete the
              VDI – End of Shift to record return time, mileage, refuelling, cleaning,
              parking and return of any hard‑copy PCRs.
            </p>
          </div>

          <div className="checklist-card">
            <h3>Equipment &amp; Bag Checks</h3>
            <p>
              Before patient contact, complete the necessary equipment and bag checklists
              (BLS / EMT bags, monitor / AED, ALS bags and other role‑specific checks) to
              ensure all items are present, functional and in date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistList;


