import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import DatePicker, { registerLocale } from "react-datepicker";
import srLatin from "../helper/sr-latin";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";

registerLocale("sr-latin", srLatin);

export default function FindRouteWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    date: null,
    startLocation: "",
    endLocation: "",
    vehicleType: "",
    cargoWeight: "",
  });
  const [results, setResults] = useState([]);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/agent/find-routes", form);
      setResults(res.data.routes || []);
      setStep(step + 1);
    } catch (err) {
      console.error("Greška:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-2xl">
      {step === 0 && (
        <div className="space-y-4">
          <p>Želiš li da pronađem prevoznike?</p>
          <div className="flex gap-4">
            <Button onClick={handleNext}>Da</Button>
            <Button variant="outline">Ne</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p>📅 Izaberi datum</p>
          <DatePicker
            selected={form.date}
            onChange={(date) => setForm({ ...form, date })}
            locale="sr-latin"
            dateFormat="d. MMMM yyyy"
            placeholderText="Izaberite datum"
            className="border p-2 w-full"
            required
          />
          <Button onClick={handleNext}>Dalje</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p>🏁 Unesi početnu destinaciju</p>
          <Input
            placeholder="Kragujevac"
            value={form.startLocation}
            onChange={(e) =>
              setForm({ ...form, startLocation: e.target.value })
            }
          />
          <div className="flex justify-between">
            <Button onClick={handlePrev} variant="outline">
              Nazad
            </Button>
            <Button onClick={handleNext}>Dalje</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p>🎯 Unesi krajnju destinaciju</p>
          <Input
            placeholder="Ruski Krstur"
            value={form.endLocation}
            onChange={(e) => setForm({ ...form, endLocation: e.target.value })}
          />
          <div className="flex justify-between">
            <Button onClick={handlePrev} variant="outline">
              Nazad
            </Button>
            <Button onClick={handleNext}>Dalje</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <p>🚚 Izaberi vozilo</p>
          <Select
            onValueChange={(value) => setForm({ ...form, vehicleType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Odaberi vozilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kamion">Kamion</SelectItem>
              <SelectItem value="sleper">Šleper</SelectItem>
              <SelectItem value="kombi">Kombi</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-between">
            <Button onClick={handlePrev} variant="outline">
              Nazad
            </Button>
            <Button onClick={handleNext}>Dalje</Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <p>⚖️ Unesi težinu robe (kg)</p>
          <Input
            type="number"
            placeholder="7000"
            value={form.cargoWeight}
            onChange={(e) => setForm({ ...form, cargoWeight: e.target.value })}
          />
          <div className="flex justify-between">
            <Button onClick={handlePrev} variant="outline">
              Nazad
            </Button>
            <Button onClick={handleSubmit}>Pronađi rute</Button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div>
          <p className="mb-4">📋 Rezultati:</p>
          {results.length === 0 ? (
            <p>Nema dostupnih prevoza za odabrane kriterijume.</p>
          ) : (
            <ul className="space-y-4">
              {results.map((r, idx) => (
                <li key={idx} className="p-4 border rounded-xl shadow-sm">
                  <p>
                    <strong>
                      {r.startLocation} → {r.endLocation}
                    </strong>{" "}
                    | {new Date(r.date).toLocaleDateString()}
                  </p>
                  <p>
                    🚚 Vozilo: {r.vehicle?.type} ({r.vehicle?.capacity} kg)
                  </p>
                  <p>
                    👤 Kontakt: {r.contactPerson} ({r.contactPhone})
                  </p>
                  {r.note && <p>📝 {r.note}</p>}
                </li>
              ))}
            </ul>
          )}
          <Button className="mt-4" onClick={() => setStep(0)}>
            Nova pretraga
          </Button>
        </div>
      )}
    </div>
  );
}
