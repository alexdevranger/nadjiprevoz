import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaCalendar,
  FaEuroSign,
  FaCar,
  FaUser,
  FaCheck,
} from "react-icons/fa";

export default function JobDetailsPopup({ job, onClose, onApply }) {
  const [token] = useGlobalState("token");
  const [user] = useGlobalState("user");
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [applicationData, setApplicationData] = useState({
    message: "",
    yearsOfExperience: 0,
    hasOwnVehicle: false,
    vehicleType: "",
    previousExperience: [],
    skills: [],
  });
  const { success, error } = useToast();

  useEffect(() => {
    checkPortfolio();
  }, []);

  const checkPortfolio = async () => {
    try {
      const response = await axios.get("/api/portfolio/my-portfolio", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.portfolio) {
        setPortfolio(response.data.portfolio);
        // Automatski popuni podatke iz portfolija
        setApplicationData({
          message: "",
          yearsOfExperience: response.data.portfolio.yearsOfExperience,
          hasOwnVehicle: response.data.portfolio.hasOwnVehicle,
          vehicleType: response.data.portfolio.vehicleType,
          previousExperience: response.data.portfolio.previousExperience,
          skills: response.data.portfolio.skills,
        });
      }
    } catch (err) {
      console.error("Greška pri proveri portfolija:", err);
    }
  };

  const handleApplyWithPortfolio = async () => {
    try {
      const response = await axios.post(
        "/api/job-applications/apply-with-portfolio",
        {
          jobId: job._id,
          message: applicationData.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        success("Prijava uspešno poslata sa podacima iz portfolija!");
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || "Greška pri slanju prijave");
    }
  };

  const handleApplyWithForm = async () => {
    try {
      const response = await axios.post(
        "/api/job-applications",
        {
          jobId: job._id,
          message: applicationData.message,
          applicantData: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            yearsOfExperience: applicationData.yearsOfExperience,
            hasOwnVehicle: applicationData.hasOwnVehicle,
            vehicleType: applicationData.vehicleType,
            previousExperience: applicationData.previousExperience,
            skills: applicationData.skills,
            portfolioData: false,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        success("Prijava uspešno poslata!");
        onClose();
      }
    } catch (err) {
      error(err.response?.data?.message || "Greška pri slanju prijave");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Job Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaCalendar className="mr-2" />
              <span>{new Date(job.createdAt).toLocaleDateString("sr-RS")}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaEuroSign className="mr-2" />
              <span>{job.salary} €</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FaCar className="mr-2" />
              <span>{job.vehicleType}</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Opis posla:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Zahtevi:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.requirements}
            </p>
          </div>

          {/* Apply Section */}
          {!showApplyForm ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Prijavite se na oglas</h3>

              {portfolio ? (
                <div className="space-y-3">
                  <div className="flex items-center text-green-600 mb-2">
                    <FaCheck className="mr-2" />
                    <span>Imate kreiran portfolio!</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Vaši podaci će automatski biti poslati sa prijavom.
                  </p>
                  <textarea
                    placeholder="Dodatna poruka poslodavcu (opciono)"
                    value={applicationData.message}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        message: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleApplyWithPortfolio}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex-1"
                    >
                      Prijavi se sa Portfolio podacima
                    </button>
                    <button
                      onClick={() => setShowApplyForm(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex-1"
                    >
                      Ručno popuni podatke
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Nemate kreiran portfolio. Možete se prijaviti ručnim
                    popunjavanjem podataka.
                  </p>
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg w-full"
                  >
                    Popuni podatke za prijavu
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">
                Popunite podatke za prijavu
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Godine iskustva
                  </label>
                  <input
                    type="number"
                    value={applicationData.yearsOfExperience}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        yearsOfExperience: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={applicationData.hasOwnVehicle}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        hasOwnVehicle: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span>Imam sopstveno vozilo</span>
                </div>

                {applicationData.hasOwnVehicle && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Vrsta vozila
                    </label>
                    <input
                      type="text"
                      value={applicationData.vehicleType}
                      onChange={(e) =>
                        setApplicationData({
                          ...applicationData,
                          vehicleType: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="npr. kamion, dostavno vozilo..."
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prethodno iskustvo
                  </label>
                  <textarea
                    value={applicationData.previousExperience
                      .map(
                        (exp) =>
                          `${exp.companyName} - ${exp.position} (${
                            exp.startDate
                              ? new Date(exp.startDate).getFullYear()
                              : ""
                          }-${
                            exp.current
                              ? "sada"
                              : exp.endDate
                              ? new Date(exp.endDate).getFullYear()
                              : ""
                          })`
                      )
                      .join("\n")}
                    onChange={(e) => {
                      // Ovo je pojednostavljeno - u realnoj aplikaciji bi bilo bolje imati posebnu formu za iskustva
                    }}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Opisite vaše prethodno iskustvo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Veštine
                  </label>
                  <input
                    type="text"
                    value={applicationData.skills.join(", ")}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        skills: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="npr. vožnja po gradovima, rukovanje teretom..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Poruka poslodavcu (opciono)
                  </label>
                  <textarea
                    value={applicationData.message}
                    onChange={(e) =>
                      setApplicationData({
                        ...applicationData,
                        message: e.target.value,
                      })
                    }
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleApplyWithForm}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex-1"
                  >
                    Pošalji prijavu
                  </button>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg flex-1"
                  >
                    Nazad
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
