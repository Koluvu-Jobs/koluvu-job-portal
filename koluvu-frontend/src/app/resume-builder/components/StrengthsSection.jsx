import React from "react";
import CharacterCounter from "./CharacterCounter";

const STRENGTHS_LIMIT = 250;

export default function StrengthsSection({ formData, handleInputChange }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Strengths</h2>
      <textarea
        className="w-full px-3 py-2 border rounded"
        rows={4}
        value={formData.strengths || ""}
        onChange={(e) => handleInputChange(e)}
        maxLength={STRENGTHS_LIMIT}
        placeholder="List your strengths or core competencies, separated by commas or new lines"
      />
      <CharacterCounter
        current={(formData.strengths || "").length}
        limit={STRENGTHS_LIMIT}
        className="mt-2"
      />
    </div>
  );
}
