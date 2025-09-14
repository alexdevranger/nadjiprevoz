import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Ukupno korisnika</h3>
          <p className="text-2xl font-bold mt-2">123</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Aktivni oglasi</h3>
          <p className="text-2xl font-bold mt-2">45</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Premijum paketi</h3>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
      </div>
    </div>
  );
}
