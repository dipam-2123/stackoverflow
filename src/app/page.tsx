import HeroSection from "./components/HeroSection";
import LatestQuestions from "./components/LatestQuestions";
import TopContributers from "./components/TopContributers";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-20">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-16">
            <HeroSection />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Latest Questions - Takes 2/3 of the space */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6 text-white">Latest Questions</h2>
              <LatestQuestions />
            </div>

            {/* Top Contributors - Takes 1/3 of the space */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-6 text-white">Top Contributors</h2>
              <TopContributers />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
