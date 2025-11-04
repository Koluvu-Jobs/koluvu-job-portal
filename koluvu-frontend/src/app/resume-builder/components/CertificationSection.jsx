import React from "react";

export default function CertificationSection({
  formData,
  handleInputChange,
  handleAddCertification,
  handleRemoveCertification,
}) {
  const certs = formData.certifications || [];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Certifications</h2>
      {certs.map((c, i) => (
        <div key={i} className="mb-4 border p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            <input
              className="px-3 py-2 border rounded"
              value={c.name || ""}
              onChange={(e) => handleInputChange(i, "name", e.target.value)}
              placeholder="Certification name"
            />
            <input
              className="px-3 py-2 border rounded"
              value={c.issuer || ""}
              onChange={(e) => handleInputChange(i, "issuer", e.target.value)}
              placeholder="Issuer"
            />
            <input
              className="px-3 py-2 border rounded"
              value={c.date || ""}
              onChange={(e) => handleInputChange(i, "date", e.target.value)}
              placeholder="Date (e.g., 2023)"
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              onClick={() => handleRemoveCertification(i)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={handleAddCertification}
        >
          Add Certification
        </button>
      </div>
    </div>
  );
}
