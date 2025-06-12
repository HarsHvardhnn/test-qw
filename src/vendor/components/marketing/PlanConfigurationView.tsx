import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, Target, Users, DollarSign, Search, X } from 'lucide-react';
import axiosInstance from '../../../axios';
import { toast } from 'react-toastify';
import { useLoader } from '../../../context/LoaderContext';

interface PlanConfigurationViewProps {
  plan: {
    id: string;
    name: string;
    type: 'Essential' | 'Targeted' | 'Premium';
    monthlyViews: number;
    clickCost: number;
    maxRegions: number;
    features: string[];
  };
  onBack: () => void;
}

const locationData = {
  'Alabama': { population: 5024279 },
  'Alaska': { population: 733391 },
  'Arizona': { population: 7151502 },
  'Arkansas': { population: 3011524 },
  'California': { population: 39538223 },
  'Colorado': { population: 5773714 },
  'Connecticut': { population: 3605944 },
  'Delaware': { population: 989948 },
  'Florida': { population: 21538187 },
  'Georgia': { population: 10711908 },
  'Hawaii': { population: 1455271 },
  'Idaho': { population: 1839106 },
  'Illinois': { population: 12812508 },
  'Indiana': { population: 6785528 },
  'Iowa': { population: 3190369 },
  'Kansas': { population: 2937880 },
  'Kentucky': { population: 4505836 },
  'Louisiana': { population: 4657757 },
  'Maine': { population: 1362359 },
  'Maryland': { population: 6177224 },
  'Massachusetts': { population: 7029917 },
  'Michigan': { population: 10077331 },
  'Minnesota': { population: 5706494 },
  'Mississippi': { population: 2961279 },
  'Missouri': { population: 6154913 },
  'Montana': { population: 1084225 },
  'Nebraska': { population: 1961504 },
  'Nevada': { population: 3104614 },
  'New Hampshire': { population: 1377529 },
  'New Jersey': { population: 9288994 },
  'New Mexico': { population: 2117522 },
  'New York': { population: 20201249 },
  'North Carolina': { population: 10439388 },
  'North Dakota': { population: 779094 },
  'Ohio': { population: 11799448 },
  'Oklahoma': {
    population: 3959353,
    counties: {
      'Adair': ['Stilwell', 'Westville', 'Watts'],
      'Alfalfa': ['Cherokee', 'Helena', 'Carmen'],
      'Atoka': ['Atoka', 'Stringtown', 'Tushka'],
      'Beaver': ['Beaver', 'Gate', 'Forgan'],
      'Beckham': ['Elk City', 'Sayre', 'Carter'],
      'Blaine': ['Watonga', 'Geary', 'Okeene'],
      'Bryan': ['Durant', 'Calera', 'Caddo'],
      'Caddo': ['Anadarko', 'Hinton', 'Carnegie'],
      'Canadian': ['El Reno', 'Yukon', 'Mustang'],
      'Carter': ['Ardmore', 'Healdton', 'Wilson'],
      'Cherokee': ['Tahlequah', 'Hulbert', 'Fort Gibson'],
      'Choctaw': ['Hugo', 'Boswell', 'Fort Towson'],
      'Cimarron': ['Boise City', 'Keyes', 'Felt'],
      'Cleveland': ['Norman', 'Moore', 'Noble'],
      'Coal': ['Coalgate', 'Lehigh', 'Centrahoma'],
      'Comanche': ['Lawton', 'Cache', 'Elgin'],
      'Cotton': ['Walters', 'Temple', 'Randlett'],
      'Craig': ['Vinita', 'Welch', 'Bluejacket'],
      'Creek': ['Sapulpa', 'Bristow', 'Drumright'],
      'Custer': ['Weatherford', 'Clinton', 'Arapaho'],
      'Delaware': ['Jay', 'Grove', 'Kansas'],
      'Dewey': ['Taloga', 'Seiling', 'Vici'],
      'Ellis': ['Arnett', 'Shattuck', 'Fargo'],
      'Garfield': ['Enid', 'North Enid', 'Waukomis'],
      'Garvin': ['Pauls Valley', 'Lindsay', 'Maysville'],
      'Grady': ['Chickasha', 'Tuttle', 'Rush Springs'],
      'Grant': ['Medford', 'Pond Creek', 'Wakita'],
      'Greer': ['Mangum', 'Granite', 'Willow'],
      'Harmon': ['Hollis', 'Gould', 'Vinson'],
      'Harper': ['Buffalo', 'Laverne', 'May'],
      'Haskell': ['Stigler', 'Keota', 'Kinta'],
      'Hughes': ['Holdenville', 'Wetumka', 'Calvin'],
      'Jackson': ['Altus', 'Eldorado', 'Duke'],
      'Jefferson': ['Waurika', 'Ryan', 'Ringling'],
      'Johnston': ['Tishomingo', 'Mannsville', 'Milburn'],
      'Kay': ['Ponca City', 'Blackwell', 'Tonkawa'],
      'Kingfisher': ['Kingfisher', 'Hennessey', 'Dover'],
      'Kiowa': ['Hobart', 'Snyder', 'Mountain View'],
      'Latimer': ['Wilburton', 'Red Oak', 'Yanush'],
      'Le Flore': ['Poteau', 'Heavener', 'Spiro'],
      'Lincoln': ['Chandler', 'Prague', 'Meeker'],
      'Logan': ['Guthrie', 'Crescent', 'Marshall'],
      'Love': ['Marietta', 'Thackerville', 'Leon'],
      'Major': ['Fairview', 'Ringwood', 'Meno'],
      'Marshall': ['Madill', 'Kingston', 'Oakland'],
      'Mayes': ['Pryor Creek', 'Chouteau', 'Adair'],
      'McClain': ['Purcell', 'Newcastle', 'Blanchard'],
      'McCurtain': ['Idabel', 'Broken Bow', 'Wright City'],
      'McIntosh': ['Eufaula', 'Checotah', 'Hanna'],
      'Murray': ['Sulphur', 'Davis', 'Dougherty'],
      'Muskogee': ['Muskogee', 'Fort Gibson', 'Haskell'],
      'Noble': ['Perry', 'Morrison', 'Billings'],
      'Nowata': ['Nowata', 'Delaware', 'South Coffeyville'],
      'Okfuskee': ['Okemah', 'Weleetka', 'Boley'],
      'Oklahoma': ['Oklahoma City', 'Edmond', 'Midwest City'],
      'Okmulgee': ['Okmulgee', 'Henryetta', 'Morris'],
      'Osage': ['Pawhuska', 'Hominy', 'Fairfax'],
      'Ottawa': ['Miami', 'Commerce', 'Fairland'],
      'Pawnee': ['Pawnee', 'Cleveland', 'Ralston'],
      'Payne': ['Stillwater', 'Cushing', 'Yale'],
      'Pittsburg': ['McAlester', 'Hartshorne', 'Krebs'],
      'Pontotoc': ['Ada', 'Byng', 'Roff'],
      'Pottawatomie': ['Shawnee', 'Tecumseh', 'McLoud'],
      'Pushmataha': ['Antlers', 'Clayton', 'Rattan'],
      'Roger Mills': ['Cheyenne', 'Hammon', 'Reydon'],
      'Rogers': ['Claremore', 'Catoosa', 'Owasso'],
      'Seminole': ['Wewoka', 'Seminole', 'Konawa'],
      'Sequoyah': ['Sallisaw', 'Roland', 'Muldrow'],
      'Stephens': ['Duncan', 'Marlow', 'Comanche'],
      'Texas': ['Guymon', 'Goodwell', 'Hooker'],
      'Tillman': ['Frederick', 'Grandfield', 'Tipton'],
      'Tulsa': ['Tulsa', 'Broken Arrow', 'Bixby'],
      'Wagoner': ['Wagoner', 'Coweta', 'Porter'],
      'Washington': ['Bartlesville', 'Dewey', 'Ramona'],
      'Washita': ['New Cordell', 'Sentinel', 'Burns Flat'],
      'Woods': ['Alva', 'Freedom', 'Waynoka'],
      'Woodward': ['Woodward', 'Mooreland', 'Fort Supply']
    }
  },
  'Oregon': { population: 4237256 },
  'Pennsylvania': { population: 13002700 },
  'Rhode Island': { population: 1097379 },
  'South Carolina': { population: 5118425 },
  'South Dakota': { population: 886667 },
  'Tennessee': { population: 6910840 },
  'Texas': { population: 29145505 },
  'Utah': { population: 3271616 },
  'Vermont': { population: 643077 },
  'Virginia': { population: 8631393 },
  'Washington': { population: 7705281 },
  'West Virginia': { population: 1793716 },
  'Wisconsin': { population: 5893718 },
  'Wyoming': { population: 576851 }
};

export const PlanConfigurationView: React.FC<PlanConfigurationViewProps> = ({
  plan,
  onBack
}) => {
  const [formData, setFormData] = useState({
    budget: 1000,
    audience: [] as ('contractors' | 'customers')[],
    selectedLocations: {
      states: [] as string[],
      counties: [] as string[],
      cities: [] as string[]
    }
  });

  const { showLoader, hideLoader } = useLoader();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLocationType, setActiveLocationType] = useState<'states' | 'counties' | 'cities'>('states');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    switch (activeLocationType) {
      case 'states':
        setSearchResults(
          Object.keys(locationData)
            .filter(state => state.toLowerCase().includes(term.toLowerCase()))
            .map(state => ({ name: state, population: locationData[state].population }))
        );
        break;
      case 'counties':
        setSearchResults(
          Object.entries(locationData).flatMap(([state, data]) =>
            Object.keys(data.counties || {})
              .filter(county => county.toLowerCase().includes(term.toLowerCase()))
              .map(county => ({ name: county, state, population: 850000 }))
          )
        );
        break;
      case 'cities':
        setSearchResults(
          Object.entries(locationData).flatMap(([state, data]) =>
            Object.entries(data.counties || {}).flatMap(([county, cities]) =>
              cities
                .filter(city => city.toLowerCase().includes(term.toLowerCase()))
                .map(city => ({ name: city, state, county, population: 250000 }))
            )
          )
        );
        break;
    }
  };

  const handleAddLocation = (location: any) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: {
        ...prev.selectedLocations,
        [activeLocationType]: [...prev.selectedLocations[activeLocationType], location.name]
      }
    }));
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveLocation = (type: 'states' | 'counties' | 'cities', locationName: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLocations: {
        ...prev.selectedLocations,
        [type]: prev.selectedLocations[type].filter(name => name !== locationName)
      }
    }));
  };

  const calculateTotalPopulation = () => {
    let total = 0;
    
    formData.selectedLocations.states.forEach(state => {
      total += locationData[state].population;
    });
    
    total += formData.selectedLocations.counties.length * 850000;
    
    total += formData.selectedLocations.cities.length * 250000;
    
    return total;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    if (formData.audience.length === 0) newErrors.audience = 'At least one audience type is required';
    if (Object.values(formData.selectedLocations).every(arr => arr.length === 0)) {
      newErrors.locations = 'At least one location must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const createMarketingPlan = async (planData) => {
    try {
      showLoader()
      const response = await axiosInstance.post("/marketing/create", planData);
      toast.success("Marketing plan created successfully!");
      return response.data;
    } catch (error) {
      console.error("Error creating marketing plan:", error);
      toast.error("Failed to create marketing plan  ",error.message );
      throw error.response?.data || { error: "Something went wrong" };
    } finally {
      hideLoader()
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const estimatedClicks = Math.floor(formData.budget / plan.clickCost);

    const data = {
      ...formData,
      startDate: new Date().toISOString().split("T")[0],
      estimatedClicks,
      planType: plan.type,
      clickCost: plan.clickCost,
    };
    console.log('Campaign created:',data);
    await createMarketingPlan(data)
  };


  const toggleAudience = (type: 'contractors' | 'customers') => {
    setFormData(prev => ({
      ...prev,
      audience: prev.audience.includes(type)
        ? prev.audience.filter(a => a !== type)
        : [...prev.audience, type]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
          <p className="text-sm text-gray-500">Configure your marketing campaign</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${
                  plan.type === 'Essential' ? 'bg-blue-50 text-blue-600' :
                  plan.type === 'Targeted' ? 'bg-purple-50 text-purple-600' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Selected Plan</p>
                  <p className="text-lg font-medium text-gray-900">{plan.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Cost per Click</p>
                <p className="text-xl font-bold text-gray-900">${plan.clickCost.toFixed(2)}</p>
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                Monthly Budget *
                {errors.budget && <span className="ml-2 text-xs text-red-500">{errors.budget}</span>}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="budget"
                  min="0"
                  step="100"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.budget ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Estimated {Math.floor(formData.budget / plan.clickCost).toLocaleString()} clicks at ${plan.clickCost}/click
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Location *
                {errors.locations && <span className="ml-2 text-xs text-red-500">{errors.locations}</span>}
              </label>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[
                  { type: 'states', label: 'States' },
                  { type: 'counties', label: 'Counties' },
                  { type: 'cities', label: 'Cities' }
                ].map(option => (
                  <div key={option.type} className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLocationType(option.type as 'states' | 'counties' | 'cities');
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                      className={`w-full p-4 rounded-lg border text-center transition-colors ${
                        activeLocationType === option.type
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>

                    {activeLocationType === option.type && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <div
                            key={index}
                            className="p-3 flex items-center justify-between hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-900">{result.name}</p>
                              {result.state && (
                                <p className="text-xs text-gray-500">
                                  {result.county ? `${result.county} County, ` : ''}{result.state}
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleAddLocation(result)}
                              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={`relative w-1/3 ${
                activeLocationType === 'states' ? 'ml-0' :
                activeLocationType === 'counties' ? 'ml-[33.33%]' :
                'ml-[66.66%]'
              } transition-all duration-200`}>
                <input
                  type="text"
                  placeholder={`Search ${activeLocationType}...`}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              {Object.entries(formData.selectedLocations).map(([type, locations]) => 
                locations.length > 0 && (
                  <div key={type} className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {locations.map(location => (
                        <div key={location} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                          {location}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(type as 'states' | 'counties' | 'cities', location)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Population in Selected Areas</p>
                  <p className="text-2xl font-bold text-blue-600 tabular-nums">
                    {calculateTotalPopulation().toLocaleString()} people
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Projects Created</p>
                  <p className="text-2xl font-bold text-green-600 tabular-nums">
                    {Math.floor(calculateTotalPopulation() * 0.01).toLocaleString()} projects
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Product/Material Purchased</p>
                  <p className="text-2xl font-bold text-purple-600 tabular-nums">
                    ${(Math.floor(calculateTotalPopulation() * 0.01) * 15600).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
                {errors.audience && <span className="ml-2 text-xs text-red-500">{errors.audience}</span>}
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => toggleAudience('contractors')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    formData.audience.includes('contractors')
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  Contractors
                </button>
                <button
                  type="button"
                  onClick={() => toggleAudience('customers')}
                  className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    formData.audience.includes('customers')
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-5 h-5 mx-auto mb-1" />
                  Customers
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You will only be charged when someone clicks on your ad</li>
                      <li>Unused budget rolls over to the next month</li>
                      <li>You can adjust your budget or pause the campaign anytime</li>
                      <li>Campaign applies to all your active products</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Campaign
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};