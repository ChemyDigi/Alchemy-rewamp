
  // ✅ your image pool
//   const baseImages = [
//     "/images/logos/1.png",
//     "/images/logos/2.jpeg",
//     "/images/logos/3.png",
//     "/images/logos/4.jpg",
//     "/images/logos/5.jpeg",
//     "/images/logos/logo (1).jpg",

//   ];
"use client";

import Cubes from "./Cubes";

export default function JoinSection() {
  const GRID = 6;
  const TOTAL = GRID * GRID;

const baseImages = [
  "/images/logos/1.png",
  "/images/logos/2.jpeg",
  "/images/logos/3.png",
  "/images/logos/4.jpg",
  "/images/logos/5.jpeg",

  "/images/logos/logo (1).jpg",
  "/images/logos/logo (1).png",
  "/images/logos/logo (1).webp",

  "/images/logos/logo (2).jpg",
  "/images/logos/logo (2).png",

  "/images/logos/logo (3).jpg",
  "/images/logos/logo (3).png",

  "/images/logos/logo (4).jpg",
  "/images/logos/logo (4).png",

  "/images/logos/logo (5).jpg",
  "/images/logos/logo (5).png",

  "/images/logos/logo (6).jpg",
  "/images/logos/logo (6).png",

  "/images/logos/logo (7).jpg",
  "/images/logos/logo (7).png",

  "/images/logos/logo (8).jpg",
  "/images/logos/logo (8).png",

  "/images/logos/logo (9).jpg",
  "/images/logos/logo (9).png",

  "/images/logos/logo (10).jpg",
  "/images/logos/logo (10).png",

  "/images/logos/logo (11).jpg",
  "/images/logos/logo (11).png",

  "/images/logos/logo (12).jpg",
  "/images/logos/logo (12).png",

  "/images/logos/logo (13).jpg",
  "/images/logos/logo (13).png",

  "/images/logos/logo (14).jpg",
  "/images/logos/logo (14).png",

  "/images/logos/logo (15).jpg",
  "/images/logos/logo (15).png",

  "/images/logos/logo (16).jpg",
  "/images/logos/logo (16).png",

  "/images/logos/logo (17).png",

  "/images/logos/sample.png",
];

  // 🔥 Shuffle ONCE (no duplicates)
  const shuffled = [...baseImages].sort(() => Math.random() - 0.5);

  // 🔥 Only take available images (no repetition)
  const cubeImages = shuffled.slice(0, TOTAL);

  return (
    <section className="w-full bg-white py-20 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10">
      
      {/* LEFT */}
      <div className="max-w-lg">
        <h2 className="text-4xl font-bold leading-tight">
          JOIN THE <span className="text-orange-500">BEST</span>
        </h2>

        <p className="text-gray-500 mt-3">
          Trusted by leading partners across industries
        </p>

        <button className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition">
          GET IN TOUCH →
        </button>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-[500px] h-[500px] flex items-center justify-center">
        <Cubes
          gridSize={GRID}
          cubeSize={60}
          maxAngle={20}
          radius={3}
          images={cubeImages}
          faceColor="#1a1a2e"
        />
      </div>
    </section>
  );
}