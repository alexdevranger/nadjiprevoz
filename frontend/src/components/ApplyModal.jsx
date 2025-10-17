import { useState } from "react";
import axios from "axios";

const ApplyModal = ({ jobId, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/job-applications",
        { jobId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Prijava uspešno poslata!");
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Greška prilikom slanja prijave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Pošalji prijavu
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napišite kratku poruku..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Otkaži
          </button>
          <button
            onClick={handleApply}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Slanje..." : "Pošalji prijavu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
