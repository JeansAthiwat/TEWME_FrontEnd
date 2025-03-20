import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroRef.current);

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section className="relative overflow-hidden clip-hero bg-gradient-to-br from-blue-50 to-indigo-50 pt-32 pb-24 md:pt-15 md:pb-32">
      <div
        ref={heroRef}
        className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center opacity-0 translate-y-10 transition-all duration-700 ease-out"
      >
        <div className="space-y-6 md:space-y-8">
          <div className="inline-block px-3 py-1 bg-blue-200 text-blue-500 rounded-full font-medium text-sm animate-fade-in">
            A better way to learn
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Elevate your knowledge with <span className="text-blue-500">TewMe</span> Platform
          </h1>

          <p className="text-lg text-muted-foreground md:pr-12">
            Access high-quality video content and supplementary materials created by industry professionals to advance your skills.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/course"
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium transition-all duration-300 hover:bg-blue-410 active:scale-95 text-center"
            >
              Explore Courses
            </Link>
            <button className="px-6 py-3 bg-white shadow-sm border border-gray-200 rounded-full font-medium transition-all duration-300 hover:bg-gray-50 active:scale-95">
              Watch Demo
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                />
              ))}
            </div>
            <p>
              <span className="font-semibold">5,000+</span> students already enrolled
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-3xl blur-3xl opacity-30 animate-pulse"
            style={{ animationDuration: '8s' }}
          ></div>
          <div className="relative bg-white p-2 rounded-3xl shadow-xl border border-gray-100 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                alt="Learning Platform Preview"
                className="w-full h-full object-cover opacity-0 animate-blur-in"
                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                onLoad={(e) => (e.currentTarget.style.opacity = '1')}
              />
            </div>
            <div className="absolute -bottom-5 -right-5 p-3 rounded-full bg-white shadow-lg border border-gray-100 transform transition-transform duration-500 hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default HeroSection;
