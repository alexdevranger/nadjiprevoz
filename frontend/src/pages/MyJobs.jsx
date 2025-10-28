import React, { useEffect, useState } from "react";
import axios from "axios";
import { useGlobalState } from "../helper/globalState";
import { useToast } from "../components/ToastContext";
import ConfirmModal from "../components/ConfirmModal";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaUser,
  FaSyncAlt,
  FaArrowLeft,
  FaStickyNote,
  FaCheckCircle,
  FaPauseCircle,
  FaArchive,
  FaBuilding,
  FaPaperPlane,
} from "react-icons/fa";

export default function MyJobs() {
  const [token] = useGlobalState("token");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    position: "",
    location: [""],
    salary: "",
    contact: {
      email: "",
      phone: "",
      person: "",
    },
    employmentType: "Puno radno vreme",
    description: "",
    requirements: [""],
    status: "aktivan",
  });

  const [filterStatus, setFilterStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const { success, error, warning, info } = useToast();
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
    isLoading: false,
  });
  const navigate = useNavigate();
  const [applications, setApplications] = useState({});
  const [showApplications, setShowApplications] = useState({});

  const showConfirmModal = ({
    title,
    message,
    onConfirm,
    type = "warning",
  }) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm,
      type,
      isLoading: false,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      title: "",
      message: "",
      onConfirm: null,
      type: "warning",
      isLoading: false,
    });
  };

  // Dodaj ovu funkciju za učitavanje aplikacija
  // const fetchJobApplications = async (jobId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await axios.get(`/api/job-applications/oglas/${jobId}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setApplications((prev) => ({
  //       ...prev,
  //       [jobId]: res.data,
  //     }));
  //   } catch (err) {
  //     console.error("Greška pri učitavanju aplikacija:", err);
  //   }
  // };
  const fetchJobApplications = async (jobId) => {
    // Proveri da li su aplikacije već učitane (cache)
    if (applications[jobId]) {
      console.log("♻️ Koristim keširane aplikacije za:", jobId);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Učitavam aplikacije za oglas:", jobId);

      // Probajte prvo sa /oglas/:jobId
      const res = await axios.get(`/api/job-applications/oglas/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📨 Aplikacije dobijene:", res.data);

      setApplications((prev) => ({
        ...prev,
        [jobId]: res.data,
      }));
    } catch (err) {
      console.error("❌ Greška sa /oglas ruta:", err);

      // Probajte alternativnu rutu
      try {
        console.log("🔄 Pokušavam sa /moje-objave rutom...");
        const allRes = await axios.get(`/api/job-applications/moje-objave`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filtriraj aplikacije samo za ovaj jobId
        const filteredApplications = allRes.data.filter(
          (app) => app.jobId && app.jobId._id === jobId
        );

        console.log("📨 Filtrirane aplikacije:", filteredApplications);

        setApplications((prev) => ({
          ...prev,
          [jobId]: filteredApplications,
        }));
      } catch (secondErr) {
        console.error("❌ Greška i sa /moje-objave:", secondErr);
      }
    }
  };

  // Dodaj ovu funkciju za promenu statusa aplikacije
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `/api/job-applications/${applicationId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      success(`Status prijave uspešno promenjen u ${newStatus}`);

      // Osveži sve aplikacije
      jobs.forEach((job) => {
        if (applications[job._id]) {
          fetchJobApplications(job._id);
        }
      });
    } catch (err) {
      console.error("Greška pri promeni statusa:", err);
      error("Greška pri promeni statusa prijave");
    }
  };

  const handleConfirm = async () => {
    if (confirmModal.onConfirm) {
      setConfirmModal((prev) => ({ ...prev, isLoading: true }));
      try {
        await confirmModal.onConfirm();
        closeConfirmModal();
      } catch (error) {
        console.error("Greška pri potvrdi:", error);
        setConfirmModal((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token nije pronađen");
        return;
      }
      const res = await axios.get("/api/jobs/my-jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Oglasi:", res.data);
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Greška pri učitavanju oglasa:", err);
      error("Greška pri učitavanju oglasa");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    showConfirmModal({
      title: "Obriši oglas",
      message:
        "Da li ste sigurni da želite da obrišete ovaj oglas? Ova akcija je nepovratna.",
      type: "danger",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            error("Sesija je istekla. Molimo prijavite se ponovo.");
            return;
          }

          await axios.delete(`/api/jobs/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          success("Oglas uspešno obrisan!");
          fetchJobs();
        } catch (err) {
          console.error("Greška pri brisanju oglasa:", err);
          error("Greška pri brisanju oglasa");
          throw err;
        }
      },
    });
  };

  const updateJobStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error("Sesija je istekla. Molimo prijavite se ponovo.");
        return;
      }

      await axios.put(
        `/api/jobs/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      success(`Status oglasa uspešno promenjen u ${newStatus}!`);
      fetchJobs();
    } catch (err) {
      console.error("Greška pri promeni statusa:", err);
      error("Greška pri promeni statusa oglasa");
    }
  };

  const startEditing = (job) => {
    setEditingJob(job._id);
    setEditForm({
      title: job.title,
      position: job.position,
      location: job.location.length > 0 ? job.location : [""],
      salary: job.salary || "",
      contact: {
        email: job.contact?.email || "",
        phone: job.contact?.phone || "",
        person: job.contact?.person || "",
      },
      employmentType: job.employmentType,
      description: job.description,
      requirements: job.requirements.length > 0 ? job.requirements : [""],
      status: job.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      contact: {
        ...editForm.contact,
        [name]: value,
      },
    });
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...editForm.location];
    newLocations[index] = value;
    setEditForm({
      ...editForm,
      location: newLocations,
    });
  };

  const addLocation = () => {
    setEditForm({
      ...editForm,
      location: [...editForm.location, ""],
    });
  };

  const removeLocation = (index) => {
    if (editForm.location.length > 1) {
      const newLocations = editForm.location.filter((_, i) => i !== index);
      setEditForm({
        ...editForm,
        location: newLocations,
      });
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...editForm.requirements];
    newRequirements[index] = value;
    setEditForm({
      ...editForm,
      requirements: newRequirements,
    });
  };

  const addRequirement = () => {
    setEditForm({
      ...editForm,
      requirements: [...editForm.requirements, ""],
    });
  };

  const removeRequirement = (index) => {
    if (editForm.requirements.length > 1) {
      const newRequirements = editForm.requirements.filter(
        (_, i) => i !== index
      );
      setEditForm({
        ...editForm,
        requirements: newRequirements,
      });
    }
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        error("Sesija je istekla. Molimo prijavite se ponovo.");
        return;
      }

      // Filtriraj prazne lokacije i uslove
      const submitData = {
        ...editForm,
        location: editForm.location.filter((loc) => loc.trim() !== ""),
        requirements: editForm.requirements.filter((req) => req.trim() !== ""),
      };

      await axios.put(`/api/jobs/${id}`, submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      success("Oglas uspešno ažuriran!");
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      console.error("Greška pri izmeni oglasa:", err);
      error("Greška pri izmeni oglasa");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  // Filtrirana lista
  const filteredJobs = filterStatus
    ? jobs.filter((job) => job.status === filterStatus)
    : jobs;

  // Status boje
  const getStatusColor = (status) => {
    switch (status) {
      case "aktivan":
        return "bg-green-100 text-green-800 border-green-200";
      case "pauziran":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "arhiviran":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "aktivan":
        return <FaCheckCircle className="text-green-500" />;
      case "pauziran":
        return <FaPauseCircle className="text-yellow-500" />;
      case "arhiviran":
        return <FaArchive className="text-gray-500" />;
      default:
        return <FaBriefcase className="text-blue-500" />;
    }
  };

  const handleResetFilters = () => {
    setFilterStatus("");
  };

  // Dodajte ovaj useEffect u MyJobs komponentu
  useEffect(() => {
    if (jobs.length > 0 && token && !initialLoad) {
      console.log("🔄 Automatsko učitavanje aplikacija za sve oglase...");

      // Učitaj aplikacije za svaki oglas
      jobs.forEach((job) => {
        fetchJobApplications(job._id);
      });

      setInitialLoad(true);
    }
  }, [jobs, token, initialLoad]);

  // Funkcija za generisanje nasumične boje za border
  const getRandomBorderColor = (index) => {
    const colors = [
      "border-blue-500",
      "border-green-500",
      "border-purple-500",
      "border-yellow-500",
      "border-indigo-500",
      "border-pink-500",
      "border-orange-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                Moji Oglasi za Posao
                <span className="ml-3 text-lg font-medium text-blue-400 border-l-2 border-gray-300 pl-3">
                  {jobs.length} {jobs.length === 1 ? "oglas" : "oglasa"}
                </span>
              </h1>
              <p className="text-gray-600 mt-2">
                Upravljajte svojim oglasima za posao i njihovim statusom
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base mr-2"
              >
                <FaArrowLeft className="mr-2" />
                Nazad
              </button>
              <Link to="/add-job">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors text-base">
                  <FaPlus className="mr-2" />
                  Dodaj novi oglas
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filteri */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaFilter className="text-blue-500 mr-2" />
            Filteri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FaBriefcase className="text-green-500 mr-2" />
                Status oglasa
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Svi statusi</option>
                <option value="aktivan">Aktivni</option>
                <option value="pauziran">Pauzirani</option>
                <option value="arhiviran">Arhivirani</option>
              </select>
            </div>

            {/* Reset filtera */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors w-full h-[42px] text-base"
              >
                <FaSyncAlt className="mr-2" />
                Reset filtera
              </button>
            </div>
          </div>
        </div>

        {/* Lista oglasa */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Učitavanje oglasa...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-8 text-center">
              <FaBriefcase className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {filterStatus
                  ? `Nema oglasa sa statusom ${filterStatus}`
                  : "Trenutno nema dostupnih oglasa."}
              </p>
              <Link to="/add-job" className="mt-4 inline-block">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Dodaj prvi oglas
                </button>
              </Link>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job, index) => (
                <div
                  key={job._id}
                  className={`relative border-l-4 ${getRandomBorderColor(
                    index
                  )} rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] bg-white`}
                >
                  {editingJob === job._id ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-4">
                        Izmena oglasa
                      </h3>

                      <div className="space-y-4">
                        {/* Osnovne informacije */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Naslov oglasa *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pozicija *
                            </label>
                            <input
                              type="text"
                              name="position"
                              value={editForm.position}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            />
                          </div>
                        </div>

                        {/* Lokacije */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lokacije *
                          </label>
                          {editForm.location.map((location, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={location}
                                onChange={(e) =>
                                  handleLocationChange(index, e.target.value)
                                }
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                              {editForm.location.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeLocation(index)}
                                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addLocation}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm"
                          >
                            <FaPlus className="mr-1" />
                            Dodaj lokaciju
                          </button>
                        </div>

                        {/* Plata i tip zaposlenja */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Plata
                            </label>
                            <input
                              type="text"
                              name="salary"
                              value={editForm.salary}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tip zaposlenja *
                            </label>
                            <select
                              name="employmentType"
                              value={editForm.employmentType}
                              onChange={handleEditChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="Puno radno vreme">
                                Puno radno vreme
                              </option>
                              <option value="Skraćeno radno vreme">
                                Skraćeno radno vreme
                              </option>
                              <option value="Ugovor">Ugovor</option>
                              <option value="Praksa">Praksa</option>
                              <option value="Privremeno">Privremeno</option>
                            </select>
                          </div>
                        </div>

                        {/* Kontakt informacije */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Kontakt osoba
                            </label>
                            <input
                              type="text"
                              name="person"
                              value={editForm.contact.person}
                              onChange={handleContactChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Telefon
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={editForm.contact.phone}
                              onChange={handleContactChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={editForm.contact.email}
                              onChange={handleContactChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Opis posla */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Opis posla *
                          </label>
                          <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleEditChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        {/* Uslovi */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uslovi
                          </label>
                          {editForm.requirements.map((requirement, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={requirement}
                                onChange={(e) =>
                                  handleRequirementChange(index, e.target.value)
                                }
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              {editForm.requirements.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRequirement(index)}
                                  className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addRequirement}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm"
                          >
                            <FaPlus className="mr-1" />
                            Dodaj uslov
                          </button>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            name="status"
                            value={editForm.status}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="aktivan">Aktivan</option>
                            <option value="pauziran">Pauziran</option>
                            <option value="arhiviran">Arhiviran</option>
                          </select>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => saveEdit(job._id)}
                            disabled={saving}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                          >
                            {saving ? "Čuvanje..." : "Sačuvaj izmene"}
                          </button>
                          <button
                            onClick={() => setEditingJob(null)}
                            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-lg transition-colors"
                          >
                            Odustani
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Prikaz oglasa - normalni mod */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {job.title}
                            </h3>
                            <div className="flex items-center mb-2">
                              <FaUserTie className="text-blue-500 mr-2" />
                              <span className="text-gray-700 font-medium">
                                {job.position}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                job.status
                              )} flex items-center`}
                            >
                              {getStatusIcon(job.status)}
                              <span className="ml-1 capitalize">
                                {job.status}
                              </span>
                            </span>
                            {job.company && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FaBuilding className="mr-1" />
                                {job.company.companyName}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <FaMapMarkerAlt className="text-red-500 mr-2" />
                            <span className="font-medium">Lokacije:</span>
                            <span className="ml-2">
                              {job.location.join(", ")}
                            </span>
                          </div>

                          {job.salary && (
                            <div className="flex items-center text-sm text-gray-600">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span className="font-medium">Plata:</span>
                              <span className="ml-2">{job.salary}</span>
                            </div>
                          )}

                          <div className="flex items-center text-sm text-gray-600">
                            <FaBriefcase className="text-purple-500 mr-2" />
                            <span className="font-medium">Tip zaposlenja:</span>
                            <span className="ml-2">{job.employmentType}</span>
                          </div>

                          {(job.contact?.person ||
                            job.contact?.email ||
                            job.contact?.phone) && (
                            <div className="border-t pt-3 mt-3">
                              <h4 className="font-medium text-gray-800 mb-2">
                                Kontakt:
                              </h4>
                              <div className="space-y-1 text-sm">
                                {job.contact?.person && (
                                  <div className="flex items-center text-gray-600">
                                    <FaUser className="text-blue-500 mr-2" />
                                    {job.contact.person}
                                  </div>
                                )}
                                {job.contact?.phone && (
                                  <div className="flex items-center text-gray-600">
                                    <FaPhone className="text-green-500 mr-2" />
                                    {job.contact.phone}
                                  </div>
                                )}
                                {job.contact?.email && (
                                  <div className="flex items-center text-gray-600">
                                    <FaEnvelope className="text-purple-500 mr-2" />
                                    {job.contact.email}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                            {job.description}
                          </p>

                          {job.requirements && job.requirements.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-medium text-gray-800 mb-2 text-sm">
                                Uslovi:
                              </h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {job.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-green-500 mr-2">
                                      •
                                    </span>
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Dugmadi za akcije */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => startEditing(job)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                          >
                            <FaEdit className="mr-1" />
                            Izmeni
                          </button>

                          {/* Status dugmad */}
                          {job.status !== "aktivan" && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "aktivan")
                              }
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                            >
                              <FaCheckCircle className="mr-1" />
                              Aktiviraj
                            </button>
                          )}

                          {job.status !== "pauziran" && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "pauziran")
                              }
                              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                            >
                              <FaPauseCircle className="mr-1" />
                              Pauziraj
                            </button>
                          )}

                          {job.status !== "arhiviran" && (
                            <button
                              onClick={() =>
                                updateJobStatus(job._id, "arhiviran")
                              }
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                            >
                              <FaArchive className="mr-1" />
                              Arhiviraj
                            </button>
                          )}

                          <button
                            onClick={() => deleteJob(job._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center text-sm"
                          >
                            <FaTrash className="mr-1" />
                            Obriši
                          </button>
                        </div>
                        {/* Sekcija za aplikacije */}
                        <div className="mt-4 border-t pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <button
                              onClick={() => {
                                if (!applications[job._id]) {
                                  fetchJobApplications(job._id);
                                }
                                setShowApplications((prev) => ({
                                  ...prev,
                                  [job._id]: !prev[job._id],
                                }));
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                            >
                              <FaUserTie className="mr-1" />
                              Aplikacije ({applications[job._id]?.length || 0})
                              <svg
                                className={`ml-1 h-4 w-4 transition-transform ${
                                  showApplications[job._id] ? "rotate-180" : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>

                          {showApplications[job._id] && (
                            <div className="mt-3 space-y-3">
                              {!applications[job._id] ? (
                                <div className="text-center py-4">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                                  <p className="text-gray-600 text-sm mt-2">
                                    Učitavanje aplikacija...
                                  </p>
                                </div>
                              ) : applications[job._id].length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  <FaUserTie className="text-2xl mx-auto mb-2 opacity-50" />
                                  <p>Još uvek nema aplikacija</p>
                                </div>
                              ) : (
                                applications[job._id].map((application) => (
                                  <div
                                    key={application._id}
                                    className="border rounded-lg p-3 bg-gray-50"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <h4 className="font-semibold text-gray-800">
                                          {application.applicantData?.name ||
                                            application.applicantId?.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          {application.applicantData?.email ||
                                            application.applicantId?.email}
                                        </p>
                                        {application.applicantData?.phone && (
                                          <p className="text-sm text-gray-600">
                                            {application.applicantData.phone}
                                          </p>
                                        )}
                                      </div>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          application.status === "prihvaćen"
                                            ? "bg-green-100 text-green-800"
                                            : application.status ===
                                              "u užem izboru"
                                            ? "bg-blue-100 text-blue-800"
                                            : application.status === "odbijen"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {application.status}
                                      </span>
                                    </div>

                                    {application.applicantData && (
                                      <div className="text-sm text-gray-600 mb-2">
                                        {application.applicantData
                                          .yearsOfExperience > 0 && (
                                          <p>
                                            {
                                              application.applicantData
                                                .yearsOfExperience
                                            }{" "}
                                            god. iskustva
                                          </p>
                                        )}
                                        {application.applicantData
                                          .hasOwnVehicle && (
                                          <p>
                                            Ima sopstveno vozilo:{" "}
                                            {
                                              application.applicantData
                                                .vehicleType
                                            }
                                          </p>
                                        )}
                                        {application.applicantData
                                          .portfolioData && (
                                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            Portfolio
                                          </span>
                                        )}
                                      </div>
                                    )}

                                    {application.message && (
                                      <p className="text-sm text-gray-700 mb-2">
                                        {application.message}
                                      </p>
                                    )}

                                    <div className="flex gap-2 flex-wrap">
                                      <select
                                        value={application.status}
                                        onChange={(e) =>
                                          updateApplicationStatus(
                                            application._id,
                                            e.target.value
                                          )
                                        }
                                        className="text-xs border border-gray-300 rounded px-2 py-1"
                                      >
                                        <option value="na čekanju">
                                          Na čekanju
                                        </option>
                                        <option value="u užem izboru">
                                          U užem izboru
                                        </option>
                                        <option value="prihvaćen">
                                          Prihvaćen
                                        </option>
                                        <option value="odbijen">Odbijen</option>
                                      </select>

                                      <button
                                        onClick={() => {
                                          // TODO: Otvori detaljan pregled aplikacije
                                        }}
                                        className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                                      >
                                        Detalji
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        isLoading={confirmModal.isLoading}
        confirmText="Da, obriši"
        cancelText="Otkaži"
      />
    </div>
  );
}
