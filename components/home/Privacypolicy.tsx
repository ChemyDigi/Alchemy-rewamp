import { Mail, MapPin } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    body: "We may collect personal data you provide voluntarily, such as your name, email, and browsing activity.",
  },
  {
    title: "How We Use Your Information",
    body: "To improve our services, respond to your inquiries, and maintain website performance.",
  },
  {
    title: "Sharing Your Information",
    body: "Only with trusted service providers or if required by law.",
  },
  {
    title: "Data Security",
    body: "We implement standard security measures, but no system is completely secure.",
  },
  {
    title: "Your Rights",
    body: "You have rights to access, correct, or delete your personal data. Contact us to exercise these rights.",
  },
  {
    title: "Ownership of Content",
    body: "All website content is owned by Alchemy Holding Pvt. Ltd and is protected by law.",
  },
  {
    title: "Third-Party Links",
    body: "We are not responsible for privacy practices of external websites linked from ours.",
  },
  {
    title: "Changes to This Policy",
    body: "This policy may be updated from time to time. Please check back periodically.",
  },
  {
    title: "Contact Information",
    body: "See below for how to contact us regarding this policy.",
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="w-full bg-white text-black">
      {/* HERO */}
      <section className="w-full px-6 md:px-10 lg:px-16 pt-20 md:pt-36 pb-10 md:pb-14 bg-white">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-orange font-semibold uppercase tracking-wide text-sm md:text-base mb-3">
            Alchemy Holding Pvt. Ltd.
          </p>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.1]">
            Privacy <span className="text-orange">Policy</span>
          </h1>

          <p className="mt-4 text-gray-dark text-sm md:text-base">
            Effective Date: August 5, 2025
          </p>

          <p className="mt-6 max-w-3xl text-gray-dark text-base md:text-lg leading-relaxed">
            Welcome to Alchemy Holding Pvt. Ltd. We value your privacy and are
            committed to protecting your personal information. This Privacy
            Policy outlines how we collect, use, and protect the data you
            provide to us.
          </p>
        </div>
      </section>

      {/* SECTIONS */}
      <section className="w-full px-6 md:px-10 lg:px-16 pb-16 md:pb-24 bg-white">
        <div className="mx-auto max-w-[1200px] bg-gray-100 rounded-3xl p-6 md:p-12 lg:p-16">
          <div className="flex flex-col divide-y divide-gray-200">
            {sections.map((section, index) => (
              <div
                key={section.title}
                className="flex gap-5 md:gap-8 py-6 md:py-8 first:pt-0 last:pb-0"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange text-white font-semibold text-sm md:text-base">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-black mb-2">
                    {section.title}
                  </h2>
                  <p className="text-gray-dark text-sm md:text-lg leading-relaxed">
                    {section.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="w-full px-6 md:px-10 lg:px-16 pb-20 md:pb-28 bg-white">
        <div className="mx-auto max-w-[1200px] bg-orange rounded-3xl p-8 md:p-14 text-white">
          <h2 className="text-xl md:text-3xl font-bold mb-2">
            Questions About This Policy?
          </h2>
          <p className="text-white/90 max-w-2xl mb-8 text-sm md:text-lg">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us at:
          </p>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <a
              href="mailto:hello@alchemy.lk"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Mail size={20} />
              <span className="text-sm md:text-lg font-medium">
                hello@alchemy.lk
              </span>
            </a>

            <a
              href="https://www.google.com/maps/search/?api=1&query=43%2F5+Senanayake+Mawatha+Sri+Jayawardenepura+Kotte+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 hover:opacity-80 transition-opacity"
            >
              <MapPin size={20} className="mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-lg font-medium">
                43/5, Senanayake Mawatha, Sri Jayawardenepura Kotte, Sri Lanka
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
