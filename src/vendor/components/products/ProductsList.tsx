import React from "react";
import {
  Edit2,
  Trash2,
  Star,
  Eye,
  MousePointer,
  DollarSign,
  Package,
  ArrowUpRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category: {categoryName:string};
  subcategory: {brandName:string};
  price: number;
  image: string;
  status: "active" | "draft" | "archived";
  isPremium: boolean;
  stock: number;
  performance: {
    views: number;
    clicks: number;
    conversionRate: number;
    revenue: number;
  };
}

interface ProductsListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  activeTab: "products" | "materials";
}

export const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onDelete,
  activeTab,
}) => {

  console.log("productsss",products)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          {products.length}{" "}
          {activeTab === "products" ? "Products" : "Materials"}
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="p-6 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {activeTab === "products" ? "products" : "materials"} found
          </h3>
          <p className="text-gray-500">
            Add your first {activeTab === "products" ? "product" : "material"}{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {activeTab === "products" ? "Product" : "Material"}
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stock
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Views
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Clicks
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Conv.
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Revenue
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product?.id ?? Math.random()}
                  className="hover:bg-gray-50"
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={product?.image ?? "/images/default-image.svg"}
                        alt={product?.name ?? "Unknown Product"}
                        className="w-8 h-8 rounded object-cover flex-shrink-0"
                      />
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {product?.name ?? "Unnamed Product"}
                          </span>
                          {product?.isPremium && (
                            <span className="ml-1 px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {product?.description ?? "No description available"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product?.category?.categoryName ?? "Unknown Category"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product?.subcategory?.subCategoryName ?? "Unknown Subcategory"}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {product?.price !== undefined
                      ? formatCurrency(product.price)
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span
                      className={`text-sm font-medium ${
                        product?.stock !== undefined && product.stock < 10
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {product?.stock ?? "N/A"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500">
                    {product?.performance?.views !== undefined
                      ? product.performance.views.toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500">
                    {product?.performance?.clicks !== undefined
                      ? product.performance.clicks.toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-500">
                    {product?.performance?.conversionRate !== undefined
                      ? `${product.performance.conversionRate}%`
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {product?.performance?.revenue !== undefined
                      ? formatCurrency(product.performance.revenue)
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        product?.status
                          ? getStatusBadge(product.status)
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {product?.status
                        ? product.status.charAt(0).toUpperCase() +
                          product.status.slice(1)
                        : "Unknown"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          
                          console.log('selected prdouct',product);
                         product && onEdit(product)
                        }}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        disabled={!product}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => product?.id && onDelete(product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        disabled={!product?.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
