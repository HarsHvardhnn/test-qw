import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, X, Plus, Minus, DollarSign } from 'lucide-react';
import { Task } from './types';
import axiosInstance from '../../../axios';

interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  type?: string;
  price: number;
  unit: string;
  image?: string;
  vendor: string;
  savings?: {
    amount: number;
    competitorVendor: string;
  };
  bestPrice?: boolean;
}

interface MaterialsStoreProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (task: Task) => void;
  tasks?: Task[];
}

// const materialCategories = {
//   "Lumber & Framing Materials": [
//     "Dimensional Lumber",
//     "Plywood & Sheathing",
//     "Engineered Wood Products",
//     "Hardwood & Softwood",
//     "Milled Trim & Molding"
//   ],
//   "Roofing Materials": [
//     "Shingles",
//     "Metal Roofing",
//     "Tile Roofing",
//     "Roof Underlayment",
//     "Flashing & Sealants",
//     "Gutters & Drainage"
//   ],
//   "Foundation & Concrete Materials": [
//     "Concrete Mixes",
//     "Cement & Mortar",
//     "Rebar & Reinforcement",
//     "Concrete Blocks & Pavers",
//     "Gravel & Aggregates",
//     "Waterproofing & Sealants"
//   ],
//   "Insulation & Moisture Barriers": [
//     "Fiberglass Insulation",
//     "Foam Board Insulation",
//     "Spray Foam Insulation",
//     "Radiant Barriers & Reflective Insulation",
//     "House Wrap & Vapor Barriers",
//     "Soundproofing Materials"
//   ],
//   "Drywall & Wall Materials": [
//     "Drywall Panels",
//     "Plaster & Joint Compounds",
//     "Wall Paneling",
//     "Ceiling Tiles & Panels"
//   ],
//   "Flooring Materials": [
//     "Subfloor Materials",
//     "Underlayment",
//     "Tile & Stone Flooring",
//     "Hardwood Flooring",
//     "Vinyl & Laminate Flooring",
//     "Carpet & Padding",
//     "Epoxy & Concrete Flooring"
//   ],
//   "Windows & Doors": [
//     "Windows",
//     "Glass Types",
//     "Exterior Doors",
//     "Interior Doors",
//     "Garage Doors",
//     "Weather Stripping & Sealants"
//   ],
//   "Exterior Siding & Cladding": [
//     "Vinyl Siding",
//     "Fiber Cement Siding",
//     "Wood Siding",
//     "Metal Siding",
//     "Brick & Stone Veneer",
//     "Stucco & EIFS Systems"
//   ],
//   "Plumbing & Piping": [
//     "Pipes & Fittings",
//     "Water Heaters & Boilers",
//     "Drainage & Sewer Systems",
//     "Plumbing Fixtures",
//     "Water Filtration Systems"
//   ],
//   "Electrical & Lighting Materials": [
//     "Electrical Wiring",
//     "Panels & Circuit Breakers",
//     "Conduits & Raceway Systems",
//     "Lighting Fixtures & Components",
//     "Smart Home Wiring & Automation"
//   ],
//   "HVAC & Ventilation": [
//     "HVAC Ductwork & Fittings",
//     "Air Filters & Purification",
//     "Ventilation Fans & Exhaust",
//     "Heating Systems",
//     "Cooling Systems"
//   ],
//   "Fasteners & Adhesives": [
//     "Nails & Screws",
//     "Anchors & Masonry Fasteners",
//     "Construction Adhesives",
//     "Sealants & Caulking"
//   ],
//   "Paints, Coatings & Finishing Materials": [
//     "Interior Paints",
//     "Exterior Paints",
//     "Primers & Sealers",
//     "Stains & Varnishes"
//   ]
// };

export const MaterialsStore: React.FC<MaterialsStoreProps> = ({
  isOpen,
  onClose,
  task,
  onUpdateTask,
  tasks = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);


    const [materialCategories,setMaterialCategories]=useState([])
    const [materials,setMaterials]=useState<Material[]>([]);

      useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await axiosInstance.get("/category");
           setMaterialCategories(response.data)
           console.log('respinse',response.data)
            setSelectedCategory(response.data[0]._id);
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
    
        fetchCategories();
      }, []);
    
      useEffect(() => {
        const fetchBrands = async () => {
          try {
            const response = await axiosInstance.get(
              `/sub-category?category=${selectedCategory}`
            );
            setSelectedSubcategory(response.data.length>0?response.data[0]._id:null);
          } catch (error) {
            console.error("Error fetching brands:", error);
          }
        };
        if (selectedCategory) {
          fetchBrands();
        }
      }, [selectedCategory]);
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            const response = await axiosInstance.get("/inventory/items?materialsOnly=true");
            setMaterials(response.data);
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
    
        fetchProducts();
      }, []);
    
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDragStart = (e: React.DragEvent, material: Material) => {
    e.dataTransfer.setData('application/json', JSON.stringify(material));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // const materials: Material[] = [
  //   {
  //     id: 'lumber-2x4',
  //     name: '2x4 Pressure Treated Lumber',
  //     description: 'Standard 8ft pressure treated lumber for framing',
  //     category: 'Lumber & Framing Materials',
  //     subcategory: 'Dimensional Lumber',
  //     price: 8.97,
  //     unit: 'piece',
  //     image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80',
  //     vendor: 'Home Depot',
  //     savings: {
  //       amount: 1.50,
  //       competitorVendor: "Lowe's"
  //     }
  //   },
  //   {
  //     id: 'plywood-osb',
  //     name: '7/16 OSB Sheathing',
  //     description: '4x8 oriented strand board',
  //     category: 'Lumber & Framing Materials',
  //     subcategory: 'Plywood & Sheathing',
  //     price: 32.98,
  //     unit: 'sheet',
  //     image: 'https://images.unsplash.com/photo-1585202900225-6d3ac20a6962?auto=format&fit=crop&q=80',
  //     vendor: "Lowe's",
  //     savings: {
  //       amount: 2.99,
  //       competitorVendor: 'McCoy\'s'
  //     },
  //     bestPrice: true
  //   }
  // ];

  const handleAddMaterial = (material: Material, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!task) return;

    const existingMaterial = task.materials?.find(m => m.id === material.id);

    if (existingMaterial) {
      const updatedMaterials = task.materials?.map(m => 
        m.id === material.id ? { ...m, quantity: m.quantity + 1 } : m
      );

      onUpdateTask({
        ...task,
        materials: updatedMaterials
      });
    } else {
      const updatedTask = {
        ...task,
        materials: [
          ...(task.materials || []),
          {
            id: material.id,
            name: material.name,
            quantity: 1,
            unit: material.unit,
            price: material.price
          }
        ]
      };

      onUpdateTask(updatedTask);
    }
  };

  const handleUpdateQuantity = (materialId: string, change: number) => {
    if (!task?.materials) return;

    const updatedMaterials = task.materials.map(material => {
      if (material.id === materialId) {
        const newQuantity = material.quantity + change;
        if (newQuantity < 1) return null;
        return { ...material, quantity: newQuantity };
      }
      return material;
    }).filter(Boolean);

    onUpdateTask({
      ...task,
      materials: updatedMaterials as NonNullable<Task['materials']>
    });
  };

  const handleRemoveMaterial = (materialId: string) => {
    if (!task?.materials) return;

    const updatedMaterials = task.materials.filter(m => m.id !== materialId);
    onUpdateTask({
      ...task,
      materials: updatedMaterials
    });
  };

  const filteredMaterials = materials.filter(material => {
    return  material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // const matchesCategory = !selectedCategory || material.category === selectedCategory;
    // const matchesSubcategory = !selectedSubcategory || material.subcategory === selectedSubcategory;
    
    // return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const calculateTotalMaterials = () => {
    const materialsMap = new Map<string, { name: string; quantity: number; unit: string; price: number; tasks: string[] }>();
    
    tasks.forEach(task => {
      task.materials?.forEach(material => {
        if (materialsMap.has(material.id)) {
          const existing = materialsMap.get(material.id)!;
          materialsMap.set(material.id, {
            ...existing,
            quantity: existing.quantity + material.quantity,
            tasks: [...existing.tasks, task.title]
          });
        } else {
          materialsMap.set(material.id, {
            name: material.name,
            quantity: material.quantity,
            unit: material.unit,
            price: material.price,
            tasks: [task.title]
          });
        }
      });
    });

    return Array.from(materialsMap.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
  };

  const [activeTab, setActiveTab] = useState<'store' | 'list'>('store');
  const totalMaterials = calculateTotalMaterials();
  const totalCost = totalMaterials.reduce((sum, material) => sum + (material.price * material.quantity), 0);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />
      )}

      <div 
        ref={panelRef}
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 border-b border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('store')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'store'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Materials Store
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'list'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Materials List
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {activeTab === 'store' ? (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {showFilters ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>

                {showFilters && (
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={selectedCategory || ''}
                        onChange={(e) => {
                          const value = e.target.value || null;
                          setSelectedCategory(value);
                          setSelectedSubcategory(null);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Categories</option>
                        {materialCategories.map(category => (
                          <option key={category._id} value={category._id}>{category.categoryName}</option>
                        ))}
                      </select>
                    </div>

                    {selectedCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={selectedSubcategory || ''}
                          onChange={(e) => setSelectedSubcategory(e.target.value || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">All Types</option>
                          {materialCategories.filter((cat)=>cat._id==selectedCategory).map(subcategory => (
                            <option key={subcategory._id} value={subcategory._id}>{subcategory.subCategoryName}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {filteredMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex flex-col p-4 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors cursor-move relative"
                    draggable
                    onDragStart={(e) => handleDragStart(e, material)}
                  >
                    {material.bestPrice && (
                      <div className="absolute -top-2 -right-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-lg">
                        BEST PRICE
                      </div>
                    )}

                    <div className="flex items-start space-x-4">
                      {material.image && (
                        <img
                          src={material.image}
                          alt={material.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{material.name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{material.description}</p>
                            <div className="flex items-baseline mt-1">
                              <span className="text-sm font-medium text-gray-900">${material.price}</span>
                              <span className="text-xs text-gray-500 ml-1">/ {material.unit}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleAddMaterial(material, e)}
                            className="ml-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-blue-600">{material.vendor}</span>
                            {material.savings && (
                              <span className="text-xs text-gray-500 ml-2">vs {material.savings.competitorVendor}</span>
                            )}
                          </div>
                          {material.savings && (
                            <span className="text-xs text-green-600">
                              Save ${material.savings.amount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Project Materials Summary</h3>
                <span className="text-sm font-medium text-gray-900">${totalCost.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {totalMaterials.map((material) => (
                  <div key={material.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{material.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {material.quantity} {material.unit}s @ ${material.price}/{material.unit}
                        </p>
                        <div className="mt-2 text-xs text-gray-500">
                          Used in: {material.tasks.join(', ')}
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        ${(material.price * material.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                {totalMaterials.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No materials selected yet
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};