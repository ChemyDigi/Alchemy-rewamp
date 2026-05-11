"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!projectId) { setLoading(false); return; }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/services`;

    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        console.log("REST API services response:", data);
        if (!data.documents) { setLoading(false); return; }

        // Find the event-management document
        const doc = data.documents.find((d: any) => {
          const fields = d.fields || {};
          return fields.slug?.stringValue === "event-management";
        });

        if (!doc) { console.log("No event-management doc found"); setLoading(false); return; }

        const fields = doc.fields || {};
        console.log("Found doc fields:", fields);

        // Parse the projects array from Firestore typed format
        const rawProjects = fields.projects?.arrayValue?.values || [];
        console.log("Raw projects:", rawProjects);

        const mappedEvents = rawProjects.map((item: any, i: number) => {
          const f = item.mapValue?.fields || {};
          const imagesArr = f.images?.arrayValue?.values || [];
          return {
            id: f.id?.stringValue || String(i),
            title: f.title?.stringValue || "Untitled Event",
            description: f.description?.stringValue || "",
            image: imagesArr[0]?.stringValue || "",
            link: "#",
          };
        });

        console.log("Mapped events:", mappedEvents);
        setEvents(mappedEvents);
        setLoading(false);
      })
      .catch((err) => {
        console.error("REST API fetch error:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events.length]);

  if (loading) {
    return (
      <section className="w-full bg-white px-4 md:px-8 lg:px-14 py-14 md:py-20 overflow-hidden flex items-center justify-center min-h-[500px]">
        <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="w-full bg-white px-4 md:px-8 lg:px-14 py-14 md:py-20 overflow-hidden flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-400 mb-2">No Recent Events</h2>
          <p className="text-slate-500">Please add events in the admin panel to display them here.</p>
        </div>
      </section>
    );
  }

  const currentEvent = events[currentIndex];

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-14 py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Grey background area - positioned absolutely to allow overlap */}
        <div className="absolute inset-x-0 bottom-0 top-[60px] md:top-[80px] lg:top-[100px] bg-[#eeeeee] rounded-[4px] z-0" />

        {/* Content Grid - relative and z-10 to sit above the grey box */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left Column: Heading and Text */}
          <div className="flex flex-col h-full lg:pl-16">
            {/* Title - stays on white, aligns with image top */}
            <div className="h-[60px] md:h-[80px] lg:h-[100px] flex items-center justify-center lg:justify-start">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-black text-center lg:text-left">
                OUR RECENT <span className="text-orange">EVENTS</span>
              </h2>
            </div>

            {/* Event Text Content - inside the grey area */}
            <div className="pt-12 md:pt-20 lg:pt-24 pb-8 lg:pb-14 flex flex-col items-center lg:items-start text-center lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full max-w-md mx-auto lg:mx-0"
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-orange mb-5 text-center lg:text-left">
                    {currentEvent.title}
                  </h3>

                  <p className="text-xs md:text-sm lg:text-base text-black font-normal leading-snug max-w-sm mx-auto lg:mx-0 text-center lg:text-left">
                    {currentEvent.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Overlapping Image */}
          <div className="lg:pr-16 w-full flex justify-center lg:block">
            <div className="relative w-full max-w-[500px] lg:max-w-none h-[250px] md:h-[320px] lg:h-[400px] rounded-[6px] overflow-hidden md:-mt-8 lg:-mt-12 mb-8 md:mb-12">
              <AnimatePresence>
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="absolute inset-0"
                >
                  {currentEvent.image ? (
                    <img
                      src={currentEvent.image}
                      alt={currentEvent.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No image</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
