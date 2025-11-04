// src/app/help-center/help-center/subscription/page.js

"use client";

import React from "react";
import EmployeeSubscriptionPlans from "../../../dashboard/employee/subscription/page";
import EmployerSubscriptionPage from "../../../dashboard/employer/subscription/page";

export default function HelpCenterSubscriptionPage() {
  return (
    <div className="space-y-16">
      <section>
        <EmployeeSubscriptionPlans />
      </section>
      <section>
        <EmployerSubscriptionPage />
      </section>
    </div>
  );
}