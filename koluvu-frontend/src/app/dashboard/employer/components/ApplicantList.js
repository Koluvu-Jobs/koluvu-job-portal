
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@koluvu/components/ui/table/page";
import { CheckCircle2 } from "lucide-react";
import ClientRow from './ClientRow';

export default function ApplicantList({ candidates }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S No</TableHead>
          <TableHead>Candidate Name</TableHead>
          <TableHead>Highest Qualification</TableHead>
          {/* Keep all your existing table headers */}
          <TableHead>Apply Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {candidates.map((candidate, index) => (
          <ClientRow 
            key={candidate.id} 
            candidate={candidate} 
            index={index} 
          />
        ))}
      </TableBody>
    </Table>
  );
}
