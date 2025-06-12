import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, DollarSign, ExternalLink, Shield, Home, Users } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  company: string;
  description: string;
  image: string;
  link: string;
  customerPercentage: number;
}

export const RelatedServicesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  const services: Service[] = [
    {
      id: 'water',
      title: 'Culligan Water',
      company: 'Culligan',
      description: 'Get cleaner, safer water throughout your entire home with professional installation.',
      image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80',
      link: '#',
      customerPercentage: 45
    },
    {
      id: 'insurance',
      title: 'Home & Auto Insurance',
      company: 'SafeGuard Insurance',
      description: 'Protect your newly remodeled home with comprehensive coverage at competitive rates.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
      link: '#',
      customerPercentage: 38
    },
    {
      id: 'financing',
      title: 'Project Financing',
      company: 'HomeLoan Pro',
      description: 'Flexible financing options to help you complete your dream renovation project.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
      link: '#',
      customerPercentage: 42
    },
    {
      id: 'security',
      title: 'Home Security',
      company: 'SecureHome Systems',
      description: 'Protect your investment with smart security solutions integrated with your renovation.',
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80',
      link: '#',
      customerPercentage: 35
    },
    {
      id: 'cleaning',
      title: 'Post-Renovation Cleaning',
      company: 'CleanSweep Pro',
      description: 'Professional deep cleaning services to make your newly renovated space shine.',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80',
      link: '#',
      customerPercentage: 40
    }
  ];

  // Update visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 768) {
        setVisibleItems(2);
      } else if (width < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? services.length - visibleItems : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, services.length - visibleItems);
      return prevIndex >= maxIndex ? 0 : prevIndex + 1;
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [visibleItems]);

  // Calculate the width percentage for each card based on visible items
  const cardWidth = 100 / visibleItems;

  // Calculate the translation percentage based on the current index and card width
  const translateX = (currentIndex * cardWidth);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Related Services</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="overflow-hidden"
      >
        <div 
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${translateX}%)` }}
        >
          {services.map((service) => (
            <div 
              key={service.id} 
              className="flex-none"
              style={{ width: `calc(${cardWidth}% - 24px)` }}
            >
              <div className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Customer Percentage Tag */}
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
                      <Users className="w-3 h-3 mr-1 text-blue-600" />
                      {service.customerPercentage}% of customers opted to add
                    </div>
                  </div>
                  
                  {/* Premium Partner Badges */}
                  <div className="absolute top-4 right-4 z-10">
                    {service.id === 'water' && (
                      <div className="bg-cyan-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Healthy Home Partner
                      </div>
                    )}
                    {service.id === 'insurance' && (
                      <div className="bg-emerald-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Insurance Savings
                      </div>
                    )}
                    {service.id === 'financing' && (
                      <div className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Affordable Financing
                      </div>
                    )}
                    {service.id === 'security' && (
                      <div className="bg-purple-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        Security Partner
                      </div>
                    )}
                    {service.id === 'cleaning' && (
                      <div className="bg-amber-600/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center">
                        <Home className="w-3 h-3 mr-1" />
                        TidyUp Partner
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
                  <p className="text-sm text-blue-600 mb-3">{service.company}</p>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <a 
                    href={service.link} 
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};