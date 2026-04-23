"use client";

export default function AboutStats() {
  return (
    <section className="w-full min-h-screen  flex items-center justify-center">
      
      <div className="grid grid-cols-2 gap-x-36 gap-y-28 text-center">
        
        {[
          { num: "80", title: "GLOBAL", sub: "HAPPY CLIENTS" },
          { num: "600", title: "PROJECTS", sub: "COMPLETED" },
          { num: "20", title: "TEAM", sub: "MEMBERS" },
          { num: "550", title: "DIGITAL", sub: "PRODUCTS" },
        ].map((item, i) => (
          
          <div key={i}>
            <div className="relative inline-block">
              
              {/* NUMBER */}
              <h2 className="text-orange text-[130px] font-bold leading-none">
                {item.num}
              </h2>

              {/* PLUS */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-2xl">
                +
              </div>
            </div>

            {/* TITLE */}
            <p className="text-black text-[54px] font-bold leading-none mt-3">
              {item.title}
            </p>

            {/* SUBTEXT */}
            <p className="text-black text-[24px] mt-1">
              {item.sub}
            </p>
          </div>

        ))}

      </div>
    </section>
  );
}