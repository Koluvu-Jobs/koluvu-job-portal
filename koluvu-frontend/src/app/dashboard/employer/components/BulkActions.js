
'use client';

import { Button } from "@koluvu/components/ui/buttons/page";

export default function BulkActions({ selectedCount }) {
  const actions = [
    { label: "Download", icon: "📥" },
    { label: "Walk-in", icon: "🚶‍♂️" },
    { label: "Schedule", icon: "🗓️" },
    { label: "Email", icon: "✉️" },
    { label: "SMS", icon: "💬" },
    { label: "WhatsApp", icon: "📱" }
  ];

  return (
    <div className="flex gap-2 mb-4 flex-wrap items-center">
      <div className="mr-2 text-sm text-gray-500">
        {selectedCount} selected
      </div>
      {actions.map((action) => (
        <Button 
          key={action.label}
          variant="outline"
          className="flex items-center gap-1"
        >
          <span>{action.icon}</span>
          {action.label}
        </Button>
      ))}
    </div>
  );
}
