import React, { useState, useEffect } from "react";
import { ShoppingBag, ChevronDown, ChevronUp, CheckSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { ProductCard } from "./ProductCard";
import { ProductDetail } from "./ProductDetail";
import { ProductChecklist } from "./ProductChecklist";
import axiosInstance from "../../axios";

export const ProductSelections: React.FC = ({ projectId, setP }) => {
  const { products, selectedProducts, addProduct } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    null
  );
  const [activeType, setActiveType] = useState<string | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<
    any | null
  >(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [storeStructure, setStoreStructure] = useState<any | null>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/category/cats"); // Adjust endpoint if needed
        console.log("response", response);
        setStoreStructure(response.data);
        // setActiveCategory(response.data.length>0?response.data[0].name:null);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      } finally {
        // setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  // Auto-select first subcategory when category changes
  useEffect(() => {
    if (activeCategory) {
      console.log("active category", activeCategory);
      const category = storeStructure.find((cat) => cat.name == activeCategory);
      if (category && category.subcategories.length > 0) {
        setActiveSubcategory(category.subcategories[0].id);
        // Auto-select first type if available
        if (
          category.subcategories[0].products &&
          category.subcategories[0].products.length > 0
        ) {
          setActiveType(category.subcategories[0].products[0]);
        }
      }
    } else {
      setActiveSubcategory(null);
      setActiveType(null);
    }
  }, [activeCategory]);

  // Auto-select first type when subcategory changes
  // useEffect(() => {
  //   if (activeSubcategory) {
  //     const category = storeStructure.find(cat => cat.name == activeCategory);
  //     const subcategory = category?.subcategories.find(sub => sub.id === activeSubcategory);
  //     if (subcategory?.products && subcategory.products.length > 0) {
  //       setActiveType(subcategory.products[0]);
  //     } else {
  //       setActiveType(null);
  //     }
  //   }
  // }, [activeSubcategory, activeCategory]);

  // Get section header text
  const getSectionHeaderText = () => {
    if (!activeCategory) return "My Products";
    if (!activeSubcategory) return "All Products";

    const subcategory = storeStructure
      .find((cat) => cat.name === activeCategory)
      ?.subcategories.find((sub) => sub.id === activeSubcategory);

    return subcategory?.name || "Products";
  };

  // Get current navigation path
  const getNavigationPath = () => {
    const parts = [];

    if (activeCategory) {
      parts.push(activeCategory);

      if (activeSubcategory) {
        const subcategory = storeStructure
          .find((cat) => cat.name == activeCategory)
          ?.subcategories.find((sub) => sub.id == activeSubcategory);
        if (subcategory) {
          parts.push(subcategory.name);
        }
      }
    }

    return parts;
  };

  const navPath = getNavigationPath();

  // Get available subcategories for current category
  const getAvailableSubcategories = () => {
    if (!activeCategory) return [];
    return (
      storeStructure.find((cat) => cat.name === activeCategory)
        ?.subcategories || []
    );
  };

  // Get subcategory types for current subcategory
  const getSubcategoryTypes = () => {
    if (!activeCategory || !activeSubcategory) return [];
    const subcategory = storeStructure
      .find((cat) => cat.name === activeCategory)
      ?.subcategories.find((sub) => sub.id === activeSubcategory);
    return subcategory?.products || [];
  };

  // Get products to display based on active category, subcategory, and type
  const getDisplayProducts = () => {
    // If no category is selected (My Products view), show only selected products
    if (!activeCategory) {
      console.log("products", products);

      const selectedProductItems = products.filter((product) =>
        selectedProducts.includes(product.id)
      );
      return selectedProductItems.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = {
            premium: [],
            regular: [],
          };
        }
        if (
          product.isPremium ||
          product.isContractorChoice ||
          product.sponsored
        ) {
          acc[product.category].premium.push(product);
        } else {
          acc[product.category].regular.push(product);
        }
        return acc;
      }, {} as Record<string, { premium: any[]; regular: any[] }>);
    }

    console.log("products", products);
    // Filter products by category
    let filteredProducts = products.filter(
      (product) => product.category == activeCategory
    );

    console.log("filter 1", filteredProducts);
    // Filter by subcategory if selected
    if (activeSubcategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.subcategory == activeSubcategory
      );
    }
    console.log("fitler 2", filteredProducts, activeSubcategory);
    // Filter by type if selected
    // if (activeType) {
    //   filteredProducts = filteredProducts.filter(product => {
    //     return product.type === activeType;
    //   });
    // }

    const subcategoryName =
      storeStructure
        .find((cat) => cat.name === activeCategory)
        ?.subcategories.find((sub) => sub.id === activeSubcategory)?.name ||
      activeCategory;

    return {
      [subcategoryName]: {
        premium: filteredProducts.filter(
          (p) => p.isPremium || p.isContractorChoice || p.sponsored
        ),
        regular: filteredProducts.filter(
          (p) => !p.isPremium && !p.isContractorChoice && !p.sponsored
        ),
      },
    };
  };

  const displayProducts = getDisplayProducts();
  console.log("regular -prem0", displayProducts);
  const incrementView = async (inventoryId) => {
    try {
      const response = await axiosInstance.post(
        `/inventory/${inventoryId}/increment-view`
      );
      return response.data;
    } catch (error) {
      console.error("Error incrementing views:", error);
      return null;
    }
  };

  const incrementClick = async (inventoryId) => {
    try {
      const response = await axiosInstance.post(
        `/inventory/${inventoryId}/increment-click`
      );
      return response.data;
    } catch (error) {
      console.error("Error incrementing clicks:", error);
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Project Store</h2>
          {navPath.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
              {navPath.map((part, index) => (
                <React.Fragment key={part}>
                  {index > 0 && <span className="text-gray-400">›</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowChecklist(!showChecklist)}
          className="flex items-center self-start sm:self-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <CheckSquare className="w-4 h-4 mr-2" />
          Required Selections
        </button>
      </div>

      {/* Category Selection */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setActiveCategory(null);
              setActiveSubcategory(null);
              setActiveType(null);
              setShowCategoryDropdown(false);
              setShowSubcategoryDropdown(false);
            }}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              activeCategory === null
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Products
          </button>

          {/* Category Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowSubcategoryDropdown(false);
              }}
              className={`w-full sm:w-auto px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-between sm:justify-start gap-2 ${
                activeCategory
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="truncate">
                {activeCategory || "Select Category"}
              </span>
              {showCategoryDropdown ? (
                <ChevronUp className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              )}
            </button>

            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-64 overflow-y-auto">
                {storeStructure.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.name);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                      activeCategory === category.name
                        ? "bg-blue-50 text-blue-800"
                        : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subcategory Dropdown */}
          {activeCategory && (
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => {
                  setShowSubcategoryDropdown(!showSubcategoryDropdown);
                  setShowCategoryDropdown(false);
                }}
                className={`w-full sm:w-auto px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-between sm:justify-start gap-2 ${
                  activeSubcategory
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="truncate">
                  {activeSubcategory
                    ? getAvailableSubcategories().find(
                        (sub) => sub.id === activeSubcategory
                      )?.name
                    : "Select Subcategory"}
                </span>
                {showSubcategoryDropdown ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" />
                )}
              </button>

              {showSubcategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full sm:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-64 overflow-y-auto">
                  {getAvailableSubcategories().map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => {
                        setActiveSubcategory(subcategory.id);
                        setShowSubcategoryDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${
                        activeSubcategory === subcategory.id
                          ? "bg-blue-50 text-blue-800"
                          : "text-gray-700"
                      }`}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subcategory Type Quick Links - Horizontal Scrollable on Mobile */}
        {activeSubcategory && (
          <div className="flex overflow-x-auto scrollbar-hide pb-2 mt-3">
            <div className="flex flex-nowrap gap-2">
              {getSubcategoryTypes().map((type, index) => (
                <button
                  key={index}
                  onClick={() => setActiveType(type)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors flex-shrink-0 ${
                    activeType === type
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="space-y-8 mt-8">
        {Object.entries(displayProducts).map(
          ([sectionName, { premium, regular }]) => (
            <div key={sectionName}>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-800">
                  {getSectionHeaderText()}
                  {activeType && (
                    <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
                      - {activeType}
                    </span>
                  )}
                </h3>
                {premium.length + regular.length > 0 && (
                  <span className="text-sm text-gray-500">
                    {premium.length + regular.length}{" "}
                    {premium.length + regular.length === 1
                      ? "product"
                      : "products"}
                  </span>
                )}
              </div>

              {/* Active Type mobile display */}
              {activeType && (
                <div className="mb-4 sm:hidden">
                  <span className="text-sm text-gray-500">
                    Type: {activeType}
                  </span>
                </div>
              )}

              {/* Premium Products - Carousel on Mobile */}
              {premium.length > 0 && (
                <div className="mb-8">
                  {/* Mobile Carousel View */}
                  <div className="sm:hidden">
                    <div className="relative">
                      <div
                        className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {premium.map((product, index) => (
                          <div
                            key={product.id}
                            className="snap-start w-80 flex-shrink-0 mx-1 first:ml-0 last:mr-0"
                          >
                            <ProductCard
                              product={product}
                              onClick={() => {
                                incrementClick(product.id);
                                incrementView(product.id);
                                setSelectedProductForDetail(product);
                              }}
                              className="h-full"
                              size="large"
                              projectId={projectId}
                            />
                          </div>
                        ))}
                      </div>

                      {premium.length > 1 && (
                        <>
                          {/* <button
                            onClick={() => {
                              // Add scroll logic here if implementing with JS
                              document
                                .getElementById(
                                  `premium-carousel-${sectionName}`
                                )
                                .scrollBy({
                                  left: -300,
                                  behavior: "smooth",
                                });
                            }}
                            className="absolute top-1/2 transform -translate-y-1/2 -left-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 cursor-pointer z-10"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button> */}
                          {/* <button
                            onClick={() => {
                              // Add scroll logic here if implementing with JS
                              document
                                .getElementById(
                                  `premium-carousel-${sectionName}`
                                )
                                .scrollBy({
                                  left: 300,
                                  behavior: "smooth",
                                });
                            }}
                            className="absolute top-1/2 transform -translate-y-1/2 -right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 cursor-pointer z-10"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button> */}
                        </>
                      )}
                    </div>
                    <div className="flex justify-center mt-4">
                      {premium.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full mx-1 ${
                            index === 0 ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Grid View */}
                  <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {premium.map((product) => (
                      <div
                        key={product.id}
                        className="transform hover:scale-[1.02] transition-transform duration-300"
                      >
                        <ProductCard
                          product={product}
                          onClick={() => {
                            incrementClick(product.id);
                            incrementView(product.id);
                            setSelectedProductForDetail(product);
                          }}
                          className="h-full"
                          size="large"
                          projectId={projectId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Products - Carousel on Mobile */}
              {regular.length > 0 && (
                <div>
                  {/* Mobile Carousel View */}
                  <div className="sm:hidden">
                    <div className="relative">
                      <div
                        id={`regular-carousel-${sectionName}`}
                        className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {regular.map((product) => (
                          <div
                            key={product.id}
                            className="snap-start w-60 flex-shrink-0 mx-1 first:ml-0 last:mr-0"
                          >
                            <ProductCard
                              product={product}
                              onClick={() =>
                                setSelectedProductForDetail(product)
                              }
                              className="h-full"
                              size="small"
                              projectId={projectId}
                            />
                          </div>
                        ))}
                      </div>

                      {regular.length > 1 && (
                        <>
                          {/* <button
                            onClick={() => {
                              document
                                .getElementById(
                                  `regular-carousel-${sectionName}`
                                )
                                .scrollBy({
                                  left: -240,
                                  behavior: "smooth",
                                });
                            }}
                            className="absolute top-1/2 transform -translate-y-1/2 -left-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 cursor-pointer z-10"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button> */}
                          {/* <button
                            onClick={() => {
                              document
                                .getElementById(
                                  `regular-carousel-${sectionName}`
                                )
                                .scrollBy({
                                  left: 240,
                                  behavior: "smooth",
                                });
                            }}
                            className="absolute top-1/2 transform -translate-y-1/2 -right-2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-700 cursor-pointer z-10"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button> */}
                        </>
                      )}
                    </div>
                    {/* <div className="flex justify-center mt-4">
                      {regular.length > 5
                        ? Array(5)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className={`w-2 h-2 rounded-full mx-1 ${
                                  index === 0 ? "bg-blue-500" : "bg-gray-300"
                                }`}
                              ></div>
                            ))
                        : regular.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full mx-1 ${
                                index === 0 ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            ></div>
                          ))}
                    </div> */}
                  </div>

                  {/* Desktop Grid View */}
                  <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {regular.map((product) => (
                      <div
                        key={product.id}
                        className="transform hover:scale-[1.01] transition-transform duration-300"
                      >
                        <ProductCard
                          product={product}
                          onClick={() => setSelectedProductForDetail(product)}
                          className="h-full"
                          size="small"
                          projectId={projectId}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {Object.keys(displayProducts).length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <ShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No products selected
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't selected any products in this category yet.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductForDetail && (
        <ProductDetail
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
        />
      )}

      {/* Product Checklist */}
      <ProductChecklist
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        projectId={projectId}
      />
    </div>
  );
};
