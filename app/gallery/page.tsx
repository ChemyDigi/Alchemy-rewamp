import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray">
      
      {/* NAVBAR */}
      <Navbar />

      {/* FAKE CONTENT */}
      <section className="px-6 py-20 space-y-10">
        <h1 className="text-6xl font-bold">Home Page</h1>

        <p className="max-w-xl text-lg">
          This is just placeholder content to test scrolling and navbar behavior.
        </p>

        {[...Array(20)].map((_, i) => (
          <p key={i} className="max-w-xl text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </section>

    </main>
  );
}