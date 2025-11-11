import React from "react";
import { useTranslation } from "react-i18next";

const Kontakt = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-mainDarkBG">
      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl pt-12 lg:pt-24 font-extrabold text-gray-800 dark:text-gray-400 mb-6 text-center">
          {t("Contact us")}
        </h2>
        <p className="text-lg text-gray-600 dark:text-white mb-10 text-center">
          {t(
            "If you have questions, suggestions or want to contact us, fill out the form below or use the provided information."
          )}
        </p>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-cardBGText p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-100 mb-4">
              {t("Contact form")}
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-100"
                >
                  {t("Full name")}
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder={t("Your name")}
                  className="w-full px-4 py-3 rounded-lg shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-mainDarkBG dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-100"
                >
                  {t("Email address")}
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder={t("Your email")}
                  className="dark:bg-mainDarkBG w-full px-4 py-3 rounded-lg shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-100"
                >
                  {t("Message")}
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder={t("Your message")}
                  className="dark:bg-mainDarkBG w-full px-4 py-3 rounded-lg shadow border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-200"
              >
                {t("Send")}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-cardBGText p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-4 dark:text-white">
                {t("Contact information")}
              </h3>
              <p className="text-gray-600 dark:text-darkText">
                <span className="font-bold">{t("Address")}:</span> Bulevar
                Revolucije 123, Beograd
              </p>
              <p className="text-gray-600 dark:text-darkText">
                <span className="font-bold">{t("Phone")}:</span> +381 64 123
                4567
              </p>
              <p className="text-gray-600 dark:text-darkText">
                <span className="font-bold">{t("Email")}:</span>{" "}
                info@transporthub.rs
              </p>
            </div>

            {/* Map */}
            <div className="bg-white dark:bg-cardBGText p-6 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-700 mb-4 dark:text-white">
                {t("Our location")}
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
