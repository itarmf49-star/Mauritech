"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Package, AlertTriangle, Check, TrendingUp, Save, X, Upload, Image, Percent, Calendar, Tag, CheckCircle, AlertCircle } from "lucide-react";

interface InventoryItem {
  id: string;
  nameFr: string;
  nameAr: string;
  manufacturer: string;
  deviceType: string;
  model: string;
  priceMRU: number;
  priceUSD: number;
  stockQuantity: number;
  stockStatus: "AVAILABLE" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER";
  isFeatured: boolean;
  imageUrl?: string;
  discountPercent?: number;
  isOnSale?: boolean;
  saleEndDate?: string;
}

interface InventoryManagementProps {
  locale: "fr" | "ar";
}

export function InventoryManagement({ locale }: InventoryManagementProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await fetch("/api/admin/inventory");
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredItems = items.filter(item =>
    item.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nameAr.includes(searchQuery)
  );

  const totalStock = items.reduce((sum, item) => sum + (item.stockQuantity || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + ((item.priceMRU || 0) * (item.stockQuantity || 0)), 0);
  const lowStockCount = items.filter(i => i.stockStatus === "LOW_STOCK").length;

  const handleSave = async (item: InventoryItem) => {
    setSaving(true);
    try {
      const url = editingItem 
        ? "/api/admin/inventory/update"
        : "/api/admin/inventory/add";
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem ? { ...item, id: editingItem.id } : item),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadInventory(); // Reload from database
        showNotification(
          "success",
          editingItem 
            ? (locale === "fr" ? "Produit mis a jour!" : "Product updated!")
            : (locale === "fr" ? "Produit ajoute!" : "Product added!")
        );
      } else {
        showNotification("error", data.error || (locale === "fr" ? "Erreur de sauvegarde" : "Save failed"));
      }
    } catch (error) {
      console.error("Error saving item:", error);
      showNotification("error", locale === "fr" ? "Erreur de sauvegarde" : "Save failed");
    } finally {
      setSaving(false);
      setEditingItem(null);
      setShowAddForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === "fr" ? "Supprimer cet article?" : "حذف هذا العنصر؟")) {
      try {
        const response = await fetch(`/api/admin/inventory/delete?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          await loadInventory();
          showNotification("success", locale === "fr" ? "Produit supprime!" : "Product deleted!");
        } else {
          showNotification("error", data.error || (locale === "fr" ? "Erreur de suppression" : "Delete failed"));
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        showNotification("error", locale === "fr" ? "Erreur de suppression" : "Delete failed");
      }
    }
  };

  const getStockBadge = (status: InventoryItem["stockStatus"]) => {
    switch (status) {
      case "AVAILABLE":
        return { text: locale === "fr" ? "En stock" : "متوفر", color: "bg-green-500/20 text-green-400", icon: Check };
      case "LOW_STOCK":
        return { text: locale === "fr" ? "Stock limite" : "مخزون محدود", color: "bg-yellow-500/20 text-yellow-400", icon: AlertTriangle };
      case "OUT_OF_STOCK":
        return { text: locale === "fr" ? "Rupture" : "نفذ المخزون", color: "bg-red-500/20 text-red-400", icon: X };
      case "PRE_ORDER":
        return { text: locale === "fr" ? "Pre-commande" : "طلب مسبق", color: "bg-blue-500/20 text-blue-400", icon: Package };
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
              <p className="text-sm text-gray-600">{locale === "fr" ? "Produits" : "المنتجات"}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
              <p className="text-sm text-gray-600">{locale === "fr" ? "Stock total" : "إجمالي المخزون"}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
              <p className="text-sm text-gray-600">{locale === "fr" ? "Stock faible" : "مخزون منخفض"}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-yellow-500/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{(totalValue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600">MRU</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {locale === "fr" ? "Gestion de l'inventaire" : "إدارة المخزون"}
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {locale === "fr" ? "Ajouter" : "إضافة"}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder={locale === "fr" ? "Rechercher..." : "بحث..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Notification */}
      {notification && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          notification.type === "success" 
            ? "bg-green-500/10 border-green-500/30 text-green-400" 
            : "bg-red-500/10 border-red-500/30 text-red-400"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 mt-4">
            {locale === "fr" ? "Chargement..." : "جاري التحميل..."}
          </p>
        </div>
      ) : (
        <>
      {/* Inventory Form */}
      {(showAddForm || editingItem) && (
        <InventoryForm
          item={editingItem}
          locale={locale}
          onSave={handleSave}
          onCancel={() => {
            setShowAddForm(false);
            setEditingItem(null);
          }}
          saving={saving}
        />
      )}

      {/* Inventory Table */}
      <div className="bg-white backdrop-blur-md border border-yellow-500/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-yellow-500/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === "fr" ? "Produit" : "المنتج"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === "fr" ? "Fabricant" : "الشركة المصنعة"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === "fr" ? "Prix MRU" : "سعر MRU"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === "fr" ? "Stock" : "المخزون"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === "fr" ? "Statut" : "الحالة"}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {locale === "fr" ? "Actions" : "الإجراءات"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stockBadge = getStockBadge(item.stockStatus);
                const StockIcon = stockBadge.icon;
                return (
                  <tr key={item.id} className="border-b border-yellow-500/20 hover:bg-gray-100 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        )}
                        <div>
                          <div className="text-gray-900 font-medium">{item.nameFr}</div>
                          <div className="text-sm text-gray-600">{item.nameAr}</div>
                          {item.isOnSale && (item.discountPercent ?? 0) > 0 && (
                            <span className="text-xs text-yellow-600">
                              -{item.discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{item.manufacturer}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {item.priceMRU.toLocaleString()} MRU
                    </td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{item.stockQuantity}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${stockBadge.color}`}>
                        <StockIcon className="w-3 h-3" />
                        {stockBadge.text}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-2 hover:bg-yellow-500/20 rounded-lg text-yellow-400 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

interface InventoryFormProps {
  item: InventoryItem | null;
  locale: "fr" | "ar";
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
  saving: boolean;
}

function InventoryForm({ item, locale, onSave, onCancel, saving }: InventoryFormProps) {
  const [formData, setFormData] = useState<InventoryItem>(
    item || {
      id: "",
      nameFr: "",
      nameAr: "",
      manufacturer: "",
      deviceType: "ROUTER",
      model: "",
      priceMRU: 0,
      priceUSD: 0,
      stockQuantity: 0,
      stockStatus: "AVAILABLE",
      isFeatured: false,
      imageUrl: "",
      discountPercent: 0,
      isOnSale: false,
      saleEndDate: "",
    }
  );

  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, imageUrl: reader.result as string });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white backdrop-blur-md border border-yellow-500/30 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {item ? (locale === "fr" ? "Modifier" : "تعديل") : (locale === "fr" ? "Ajouter" : "إضافة")}
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload */}
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Image du produit" : "Product Image"}
          </label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 bg-gray-100 border border-yellow-500/30 rounded-lg flex items-center justify-center overflow-hidden">
              {imagePreview || formData.imageUrl ? (
                <img src={imagePreview || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Image className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="btn btn-ghost flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "..." : (locale === "fr" ? "Choisir une image" : "Choose Image")}
              </label>
              <p className="text-xs text-gray-600 mt-1">
                {locale === "fr" ? "JPG, PNG (Max 5MB)" : "JPG, PNG (Max 5MB)"}
              </p>
            </div>
          </div>
        </div>

        {/* Bilingual Names - NO ENGLISH */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Nom (FR)" : "Name (FR)"}</label>
          <input
            type="text"
            value={formData.nameFr}
            onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Nom (AR)" : "Name (AR)"}</label>
          <input
            type="text"
            value={formData.nameAr}
            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
            dir="rtl"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Fabricant" : "Manufacturer"}</label>
          <input
            type="text"
            value={formData.manufacturer}
            onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Modele" : "Model"}</label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Type" : "Type"}</label>
          <select
            value={formData.deviceType}
            onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="ROUTER">{locale === "fr" ? "Routeur" : "Router"}</option>
            <option value="ACCESS_POINT">{locale === "fr" ? "Point d'acces" : "Access Point"}</option>
            <option value="SWITCH">{locale === "fr" ? "Commutateur" : "Switch"}</option>
            <option value="MESH_NODE">{locale === "fr" ? "Noeud Mesh" : "Mesh Node"}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Prix MRU</label>
          <input
            type="number"
            value={formData.priceMRU}
            onChange={(e) => setFormData({ ...formData, priceMRU: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Prix USD</label>
          <input
            type="number"
            value={formData.priceUSD}
            onChange={(e) => setFormData({ ...formData, priceUSD: parseFloat(e.target.value) || 0 })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Stock" : "المخزون"}</label>
          <input
            type="number"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">{locale === "fr" ? "Statut" : "الحالة"}</label>
          <select
            value={formData.stockStatus}
            onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="AVAILABLE">{locale === "fr" ? "En stock" : "متوفر"}</option>
            <option value="LOW_STOCK">{locale === "fr" ? "Stock limite" : "مخزون محدود"}</option>
            <option value="OUT_OF_STOCK">{locale === "fr" ? "Rupture" : "نفذ المخزون"}</option>
            <option value="PRE_ORDER">{locale === "fr" ? "Pre-commande" : "طلب مسبق"}</option>
          </select>
        </div>
        
        {/* Offers & Discounts Section */}
        <div className="md:col-span-2 p-4 bg-gray-100 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-yellow-600" />
            <h4 className="text-gray-900 font-semibold">
              {locale === "fr" ? "Offres & Remises" : "Offers & Discounts"}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isOnSale}
                onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                className="rounded w-5 h-5 accent-yellow-500"
              />
              <label className="text-gray-900 text-sm">
                {locale === "fr" ? "En promotion" : "On Sale"}
              </label>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {locale === "fr" ? "Remise (%)" : "Discount (%)"}
              </label>
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-yellow-600" />
                <input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-yellow-500/30 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                {locale === "fr" ? "Fin de la promotion" : "Sale End Date"}
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <input
                  type="date"
                  value={formData.saleEndDate}
                  onChange={(e) => setFormData({ ...formData, saleEndDate: e.target.value })}
                  className="w-full bg-white border border-yellow-500/30 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="rounded w-5 h-5 accent-yellow-500"
          />
          <label className="text-gray-900">{locale === "fr" ? "Produit vedette" : "Featured Product"}</label>
        </div>
        <div className="md:col-span-2 flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
            disabled={saving}
          >
            {locale === "fr" ? "Annuler" : "إلغاء"}
          </button>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? "..." : (locale === "fr" ? "Sauvegarder" : "حفظ")}
          </button>
        </div>
      </form>
    </div>
  );
}
