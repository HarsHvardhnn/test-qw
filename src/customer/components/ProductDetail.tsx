import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare, Star, Check, Ruler, DollarSign, ArrowRight } from 'lucide-react';
import { GlassmorphicButton } from '../../components/GlassmorphicButton';
import { QwilloLogo } from '../../components/QwilloLogo';
import { useProducts } from '../context/ProductContext';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    category: string;
    rating?: number;
    reviewCount?: number;
    isContractorChoice?: boolean;
    sponsored?: boolean;
  };
  onClose: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose }) => {
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [selectedView, setSelectedView] = useState<'overview' | 'dimensions' | 'alternatives'>('overview');
  const { toggleProductSelection, selectedProducts } = useProducts();
  const isSelected = selectedProducts.includes(product.id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample product images array - in a real app this would come from the product data
  const productImages = [
    product.image,
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd31?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd32?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584568694244-14fbdf83bd33?auto=format&fit=crop&q=80'
  ];

  // Sample dimensions data
  const dimensions = {
    width: '35.75"',
    height: '70"',
    depth: '36.5"',
    capacity: '26.5 cu. ft.',
    weight: '375 lbs',
    doorClearance: '42"'
  };

  // Sample alternative options
  const alternatives = [
    {
      name: 'Budget-Friendly Option',
      brand: 'Whirlpool',
      description: 'Side-by-side refrigerator with basic features and reliable performance',
      priceDifference: -800,
      features: [
        'Basic temperature controls',
        'Standard ice maker',
        'LED lighting',
        'Energy Star certified'
      ]
    },
    {
      name: 'Premium Upgrade',
      brand: 'LG Signature',
      description: 'Luxury smart refrigerator with advanced features and premium finish',
      priceDifference: 1200,
      features: [
        'InstaView door-in-door',
        'Dual ice maker with craft ice',
        'UV sanitization',
        'Custom temperature zones'
      ]
    }
  ];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image Section */}
          <div className="md:w-1/2 p-6">
            {/* Main Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${
                    currentImageIndex === index ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-lg text-blue-600">{product.brand.brandName}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">${product.price.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">128 reviews</span>
              </div>
            </div>

            {/* View Selection Tabs */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setSelectedView('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedView === 'overview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedView('dimensions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedView === 'dimensions'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dimensions
              </button>
              <button
                onClick={() => setSelectedView('alternatives')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedView === 'alternatives'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Alternatives
              </button>
            </div>

            {/* Overview View */}
            {selectedView === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">
                    Experience the future of home appliances with this premium {product.name.toLowerCase()}. 
                    Designed for modern kitchens, it combines cutting-edge technology with elegant aesthetics.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                      <span className="text-gray-600">Energy efficient design</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                      <span className="text-gray-600">Smart home compatible</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                      <span className="text-gray-600">Premium {product.brand.brandName} quality</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                      <span className="text-gray-600">5-year manufacturer warranty</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Dimensions View */}
            {selectedView === 'dimensions' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Dimensions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(dimensions).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                          <Ruler className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Installation Note</h4>
                  <p className="text-sm text-blue-600">
                    Please ensure your space can accommodate these dimensions. Add 2" for ventilation on each side and 1" on top.
                  </p>
                </div>
              </div>
            )}

            {/* Alternatives View */}
            {selectedView === 'alternatives' && (
              <div className="space-y-4">
                {alternatives.map((alt, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={alt === alternatives[0] ? 
                          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80" :
                          "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80"
                        } 
                        alt={alt.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{alt.brand}</h4>
                          <p className="text-xs text-blue-600">{alt.name}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            alt.priceDifference < 0 ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {alt.priceDifference < 0 ? '-' : '+'}${Math.abs(alt.priceDifference).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{alt.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${
                                star <= (alt === alternatives[0] ? 4 : 5) 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <button 
                          className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                          onClick={() => {/* Handle switch */}}
                        >
                          View Details
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Why Consider Alternatives?</h4>
                  <p className="text-xs text-gray-600">
                    Each option offers different features and price points to match your specific needs. 
                    Compare alternatives to find the perfect balance of features and value for your project.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                className={`w-full py-3 ${
                  isSelected
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } rounded-lg transition-colors flex items-center justify-center`}
                onClick={() => {
                  toggleProductSelection(product.id);
                  onClose();
                }}
              >
                {isSelected ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Selected
                  </>
                ) : (
                  'Add to Project'
                )}
              </button>
              <button 
                className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Explanation Modal */}
      {showAiExplanation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAiExplanation(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full">
            <button
              onClick={() => setShowAiExplanation(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10">
                <QwilloLogo variant="icon" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Qwillo AI Explains</h3>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                This product stands out for several reasons specific to your kitchen remodel project:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span className="ml-2 text-gray-600">The energy efficiency rating aligns with your goal of reducing utility costs.</span>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span className="ml-2 text-gray-600">Its dimensions perfectly fit the space we discussed during the consultation.</span>
                </li>
                <li className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <span className="ml-2 text-gray-600">The modern design matches your preferred aesthetic while maintaining functionality.</span>
                </li>
              </ul>
            </div>

            <button
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowAiExplanation(false)}
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};