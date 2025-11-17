import React from 'react';
import { Card } from '../components/ui/Card';
import { IntakeForm } from '../components/intake/IntakeForm';

export const IntakePage: React.FC = () => {
  return (
    <Card>
      <h2 className="text-sm font-semibold mb-2">Manual Intake</h2>
      <p className="text-xs text-slate-600 mb-4">
        Use this sheet for any products or changes that happen outside of Faire.
        On submit, ConnectHUB will write entries to the Master sheet.
      </p>
      <IntakeForm />
    </Card>
  );
};
