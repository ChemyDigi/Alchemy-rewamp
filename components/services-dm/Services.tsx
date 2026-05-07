"use client";

import { useState } from "react";

const services = [
  {
    title: "Digital Strategy Consultation",
    content:
      "Our consultation helps you define a clear, actionable roadmap for achieving your business goals in the digital space. We analyze your current position, identify opportunities, and design strategies that leverage technology, marketing, and data-driven insights.",
  },
  {
    title: "Social Media Advertising",
    content:
      "We design highly targeted ad campaigns that amplify your brand’s visibility and generate real engagement. Our approach ensures your message reaches the right audience at the right time to maximize impact and conversions.",
  },
  {
    title: "Social Media Management",
    content:
      "We build and nurture online communities through meaningful interactions. By combining content strategy with engagement tactics, we strengthen your brand’s voice and build relationships.",
  },
  {
    title: "Pay Per Click Marketing",
    content:
      "We deliver instant visibility through precisely targeted ad campaigns on search engines and social platforms. By optimizing keywords, audience segments, and bidding strategies, we ensure your brand reaches the right people at the right time.",
  },
  {
    title: "Search Engine Optimization",
    content:
      "We enhance your online visibility by optimizing website structure, content, and technical elements. Our SEO strategies are designed to rank your business higher on search engines and attract qualified, organic traffic that drives sustainable growth.",
  },
  {
    title: "Conversion Rate Optimization",
    content:
      "We analyze user behavior and refine your website experience to increase conversions and maximize ROI. Through data-driven testing and strategic enhancements, we transform casual visitors into loyal customers who fuel your business growth.",
  },
  {
    title: "Email Marketing",
    content:
      "We create personalized email campaigns that build strong customer relationships and drive steady growth. Through targeted messaging and smart automation, we boost engagement and increase sales.",
  },
  {
    title: "Content Marketing",
    content:
      "We craft engaging, value-driven content that attracts and retains your ideal audience. By blending storytelling with SEO strategies, we strengthen your brand’s presence and build trust.",
  },
  {
    title: "Data Analytics",
    content:
      "We turn complex data into clear, actionable insights that guide smarter decisions. By tracking performance and measuring ROI, we help refine your digital strategy for consistent growth.",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 xl:gap-32">

        {/* LEFT TEXT */}
        <div className="flex flex-col justify-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5 text-black">
            SO WHAT DO WE DO <br className="hidden sm:block" /> EXACTLY ?
          </h2>
<p className="text-sm sm:text-[15px] text-black leading-relaxed mb-5 max-w-[550px]">
  We help brands grow through strategic digital marketing solutions designed
  to increase visibility, engagement, and conversions. From advertising and
  SEO to content creation and analytics, we combine creativity with data-driven
  strategies to deliver measurable results.
</p>

<p className="text-sm sm:text-[15px] text-black leading-relaxed max-w-md">
  Our focus is on building impactful digital experiences that connect with
  audiences, strengthen brand presence, and drive long-term business growth.
</p>
        </div>

        {/* RIGHT ACCORDION */}
        <div className="w-full">
          {services.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="py-4 border-b border-black/10 cursor-pointer"
                onClick={() => toggle(index)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3
                    className={`text-xl sm:text-2xl md:text-[25px] font-semibold transition-colors duration-300 ${isActive ? "text-orange" : "text-black"
                      }`}
                  >
                    {item.title}
                  </h3>

                  <span
                    className={`text-2xl sm:text-3xl font-light transition-colors duration-300 ${isActive ? "text-orange" : "text-black"
                      }`}
                  >
                    {isActive ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? "max-h-40 mt-4" : "max-h-0"
                    }`}
                >
                  <p className="text-sm sm:text-[15px] text-black leading-relaxed pr-0 sm:pr-6 max-w-[600px]">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}