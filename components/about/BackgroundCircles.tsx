"use client";

export default function BackgroundCircles() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center -translate-y-[400px]">

      {/* BIG CIRCLE */}
      <svg
        className="absolute w-[900px] md:w-[1100px] lg:w-[1300px] opacity-40 animate-[spin_80s_linear_infinite]"
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle
          cx="300"
          cy="300"
          r="250"
          stroke="#f97316"
          strokeWidth="1"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />

        {/* SOLID DOTS */}
        <circle cx="300" cy="50" r="6" fill="#f97316" />
        <circle cx="550" cy="300" r="6" fill="#f97316" />
        <circle cx="300" cy="550" r="6" fill="#f97316" />
        <circle cx="50" cy="300" r="6" fill="#f97316" />
      </svg>

      {/* SMALL CIRCLE */}
      <svg
        className="absolute w-[600px] md:w-[750px] lg:w-[900px] opacity-30 animate-[spin_60s_linear_reverse_infinite]"
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle
          cx="300"
          cy="300"
          r="200"
          stroke="#f97316"
          strokeWidth="1"
          strokeDasharray="2 6"
          strokeLinecap="round"
        />

        {/* SOLID DOTS */}
        <circle cx="300" cy="100" r="5" fill="#f97316" />
        <circle cx="500" cy="300" r="5" fill="#f97316" />
        <circle cx="300" cy="500" r="5" fill="#f97316" />
        <circle cx="100" cy="300" r="5" fill="#f97316" />
      </svg>

    </div>
  );
}