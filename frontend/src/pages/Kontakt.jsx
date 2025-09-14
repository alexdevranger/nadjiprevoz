import React from "react";

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-200">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl pt-12 lg:pt-24 font-extrabold text-gray-800 mb-6 text-center">
          Kontaktirajte nas
        </h2>
        <p className="text-lg text-gray-600 mb-10 text-center">
          Ako imate pitanja, predloge ili želite da nas kontaktirate, popunite
          formu ispod ili koristite ponuđene informacije.
        </p>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Kontakt forma
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600"
                >
                  Ime i prezime
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Vaše ime"
                  className="w-full px-4 py-3 rounded-lg shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600"
                >
                  Email adresa
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Vaš email"
                  className="w-full px-4 py-3 rounded-lg shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-600"
                >
                  Poruka
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Vaša poruka"
                  className="w-full px-4 py-3 rounded-lg shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                Pošalji
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                Kontakt informacije
              </h3>
              <p className="text-gray-600">
                <span className="font-bold">Adresa:</span> Bulevar Revolucije
                123, Beograd
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Telefon:</span> +381 64 123 4567
              </p>
              <p className="text-gray-600">
                <span className="font-bold">Email:</span> info@transporthub.rs
              </p>
            </div>

            {/* Map */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                Naša lokacija
              </h3>
              <div className="w-full h-64 rounded-lg overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.011271105745!2d20.46513061560743!3d44.81669047909895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7075e74d617b%3A0x6d8be94609b1d8d5!2sBeograd%2C%20Serbia!5e0!3m2!1sen!2srs!4v1606228852855!5m2!1sen!2srs"
                  allowFullScreen=""
                  loading="lazy"
                  title="Google Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Kontakt;
