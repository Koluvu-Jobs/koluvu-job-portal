// src/app/dashboard/employer/applicants/components/StatusBadge.js
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export default function StatusBadge({ verified, status }) {
  return (
    <span className="inline-flex items-center ml-2">
      {verified ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : status === 'Pending' ? (
        <Clock className="w-4 h-4 text-yellow-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
    </span>
  );
}
