
'use client';

import { useState } from 'react';
import { Checkbox } from "@koluvu/components/ui/checkbox/page";
import { CheckCircle2 } from "lucide-react";

export default function ClientRow({ candidate, index }) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => setIsSelected(!isSelected)}
        />
      </TableCell>
      <TableCell>{index + 1}</TableCell>
      <TableCell className="flex items-center gap-2">
        {candidate.name}
        {candidate.isVerified && (
          <CheckCircle2 className="text-green-500" size={16} />
        )}
      </TableCell>
      {/* All other table cells */}
      <TableCell>{candidate.applyDate}</TableCell>
    </TableRow>
  );
}
