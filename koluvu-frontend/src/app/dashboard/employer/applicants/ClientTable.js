// src/app/dashboard/employer/applicants/ClientTable.js
'use client';

import { useState } from "react";
import { Checkbox } from "@koluvu/components/ui/checkbox/page";
import { CheckCircle2 } from "lucide-react";

export default function ClientTable({ candidates }) {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === candidates.length) {
      setSelected([]);
    } else {
      setSelected(candidates.map((c) => c.id));
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={selected.length === candidates.length}
              onCheckedChange={toggleSelectAll}
            />
          </TableHead>
          <TableHead>S No</TableHead>
          <TableHead>Candidate Name</TableHead>
          <TableHead>Highest Qualification</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Designation</TableHead>
          <TableHead>ATS Score</TableHead>
          <TableHead>Years of Experience</TableHead>
          <TableHead>Key Skills</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Profile Completion (%)</TableHead>
          <TableHead>Notice Period</TableHead>
          <TableHead>Present CTC</TableHead>
          <TableHead>Expected CTC</TableHead>
          <TableHead>Preferred Location</TableHead>
          <TableHead>Apply Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((candidate, index) => (
          <TableRow key={candidate.id}>
            <TableCell>
              <Checkbox
                checked={selected.includes(candidate.id)}
                onCheckedChange={() => toggleSelect(candidate.id)}
              />
            </TableCell>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="flex items-center gap-2">
              {candidate.name}
              {candidate.isVerified && (
                <CheckCircle2
                  className="text-green-500"
                  size={16}
                  title="Verified Profile"
                />
              )}
            </TableCell>
            <TableCell>{candidate.education}</TableCell>
            <TableCell>{candidate.department}</TableCell>
            <TableCell>{candidate.designation}</TableCell>
            <TableCell>{candidate.atsScore}</TableCell>
            <TableCell>{candidate.experience}</TableCell>
            <TableCell>{candidate.skills}</TableCell>
            <TableCell>{candidate.gender}</TableCell>
            <TableCell>{candidate.profileCompletion}%</TableCell>
            <TableCell>{candidate.noticePeriod}</TableCell>
            <TableCell>{candidate.presentCTC}</TableCell>
            <TableCell>{candidate.expectedCTC}</TableCell>
            <TableCell>{candidate.preferredLocation}</TableCell>
            <TableCell>{candidate.applyDate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
