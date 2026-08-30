"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, LayoutGrid, Megaphone } from "lucide-react";

interface Category {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  order: number;
  isActive: boolean;
}

interface Banner {
  id: string;
  titleFr: string;
  titleAr: string;
  subtitleFr: string;
  subtitleAr: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface ShopContentManagerProps {
  locale: "fr" | "ar";
}

export function ShopContentManager({ locale }: ShopContentManagerProps) {
  const [activeTab, setActiveTab] = useState<"categories" | "banners">("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/admin/content/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategories([
          { id: "1", nameFr: "Routeurs", nameAr: "الراوترات", slug: "routers", order: 1, isActive: true },
          { id: "2", nameFr: "Points d'accès", nameAr: "نقاط الوصول", slug: "access-points", order: 2, isActive: true },
          { id: "3", nameFr: "Commutateurs", nameAr: "المبدلات", slug: "switches", order: 3, isActive: true },
          { id: "4", nameFr: "Câblage", nameAr: "الكابلات", slug: "cabling", order: 4, isActive: true },
          { id: "5", nameFr: "Sécurité", nameAr: "الأمن", slug: "security", order: 5, isActive: true },
        ]);
      }
    };

    const loadBanners = async () => {
      try {
        const response = await fetch('/api/admin/content/banners');
        if (response.ok) {
          const data = await response.json();
          setBanners(data.banners || []);
        }
      } catch (error) {
        console.error('Failed to load banners:', error);
        setBanners([
          {
            id: "1",
            titleFr: "Offre Spéciale - Wi-Fi 6",
            titleAr: "عرض خاص - Wi-Fi 6",
            subtitleFr: "Jusqu'à -20% sur les routeurs Wi-Fi 6",
            subtitleAr: "خصم يصل إلى 20% على راوترات Wi-Fi 6",
            imageUrl: "",
            link: "/shop",
            order: 1,
            isActive: true,
          },
        ]);
      }
    };

    loadCategories();
    loadBanners();
  }, []);

  const handleSaveCategory = async (category: Category) => {
    try {
      const response = await fetch('/api/admin/content/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category),
      });
      if (response.ok) {
        if (editingCategory) {
          setCategories(categories.map(c => c.id === category.id ? category : c));
        } else {
          setCategories([...categories, { ...category, id: Date.now().toString() }]);
        }
        setEditingCategory(null);
        setShowCategoryForm(false);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm(locale === "fr" ? "Supprimer cette catégorie?" : "حذف هذه الفئة؟")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const handleSaveBanner = async (banner: Banner) => {
    try {
      const response = await fetch('/api/admin/content/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(banner),
      });
      if (response.ok) {
        if (editingBanner) {
          setBanners(banners.map(b => b.id === banner.id ? banner : b));
        } else {
          setBanners([...banners, { ...banner, id: Date.now().toString() }]);
        }
        setEditingBanner(null);
        setShowBannerForm(false);
      }
    } catch (error) {
      console.error('Failed to save banner:', error);
    }
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm(locale === "fr" ? "Supprimer cette bannière?" : "حذف هذه البانر؟")) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {locale === "fr" ? "Gestion du Boutique" : "إدارة المتجر"}
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "categories"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <LayoutGrid className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Catégories" : "الفئات"}
        </button>
        <button
          onClick={() => setActiveTab("banners")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "banners"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Megaphone className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Bannières" : "اللافتات"}
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {locale === "fr" ? "Gérer les catégories de produits" : "إدارة فئات المنتجات"}
            </p>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {locale === "fr" ? "Ajouter" : "إضافة"}
            </button>
          </div>

          {showCategoryForm && (
            <CategoryForm
              category={editingCategory}
              onSave={handleSaveCategory}
              onCancel={() => {
                setShowCategoryForm(false);
                setEditingCategory(null);
              }}
              locale={locale}
            />
          )}

          <div className="bg-white border border-yellow-500/30 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {locale === "fr" ? "Nom (FR)" : "الاسم (FR)"}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {locale === "fr" ? "Nom (AR)" : "الاسم (AR)"}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {locale === "fr" ? "Slug" : "الرابط"}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {locale === "fr" ? "Ordre" : "الترتيب"}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    {locale === "fr" ? "État" : "الحالة"}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    {locale === "fr" ? "Actions" : "الإجراءات"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-t border-gray-200">
                    <td className="px-4 py-3 text-gray-900">{category.nameFr}</td>
                    <td className="px-4 py-3 text-gray-900">{category.nameAr}</td>
                    <td className="px-4 py-3 text-gray-600">{category.slug}</td>
                    <td className="px-4 py-3 text-gray-600">{category.order}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          category.isActive
                            ? "bg-green-500/20 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {category.isActive ? (locale === "fr" ? "Actif" : "نشط") : (locale === "fr" ? "Inactif" : "غير نشط")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setShowCategoryForm(true);
                          }}
                          className="p-2 hover:bg-gray-200 rounded transition-colors text-yellow-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-gray-200 rounded transition-colors text-red-400"
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
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === "banners" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {locale === "fr" ? "Gérer les bannières promotionnelles" : "إدارة اللافتات الترويجية"}
            </p>
            <button
              onClick={() => {
                setEditingBanner(null);
                setShowBannerForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {locale === "fr" ? "Ajouter" : "إضافة"}
            </button>
          </div>

          {showBannerForm && (
            <BannerForm
              banner={editingBanner}
              onSave={handleSaveBanner}
              onCancel={() => {
                setShowBannerForm(false);
                setEditingBanner(null);
              }}
              locale={locale}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white border border-yellow-500/30 rounded-lg p-4 relative"
              >
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setShowBannerForm(true);
                    }}
                    className="p-2 hover:bg-gray-200 rounded transition-colors text-yellow-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 hover:bg-gray-200 rounded transition-colors text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center text-gray-500">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <span>{locale === "fr" ? "Aucune image" : "لا توجد صورة"}</span>
                  )}
                </div>
                <h3 className="text-gray-900 font-semibold">{locale === "fr" ? banner.titleFr : banner.titleAr}</h3>
                <p className="text-gray-600 text-sm">{locale === "fr" ? banner.subtitleFr : banner.subtitleAr}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.isActive
                        ? "bg-green-500/20 text-green-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {banner.isActive ? (locale === "fr" ? "Actif" : "نشط") : (locale === "fr" ? "Inactif" : "غير نشط")}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {locale === "fr" ? "Ordre:" : "الترتيب:"} {banner.order}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onSave,
  onCancel,
  locale,
}: {
  category: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
  locale: "fr" | "ar";
}) {
  const [formData, setFormData] = useState<Category>(
    category || {
      id: "",
      nameFr: "",
      nameAr: "",
      slug: "",
      order: 0,
      isActive: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-yellow-500/30 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Nom (Français)" : "الاسم (الفرنسية)"}
          </label>
          <input
            type="text"
            value={formData.nameFr}
            onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Nom (Arabe)" : "الاسم (العربية)"}
          </label>
          <input
            type="text"
            value={formData.nameAr}
            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Ordre" : "الترتيب"}
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded border-gray-300 bg-gray-100 accent-yellow-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          {locale === "fr" ? "Actif" : "نشط"}
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <X className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Annuler" : "إلغاء"}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Sauvegarder" : "حفظ"}
        </button>
      </div>
    </form>
  );
}

function BannerForm({
  banner,
  onSave,
  onCancel,
  locale,
}: {
  banner: Banner | null;
  onSave: (banner: Banner) => void;
  onCancel: () => void;
  locale: "fr" | "ar";
}) {
  const [formData, setFormData] = useState<Banner>(
    banner || {
      id: "",
      titleFr: "",
      titleAr: "",
      subtitleFr: "",
      subtitleAr: "",
      imageUrl: "",
      link: "",
      order: 0,
      isActive: true,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-yellow-500/30 rounded-lg p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Titre (Français)" : "العنوان (الفرنسية)"}
          </label>
          <input
            type="text"
            value={formData.titleFr}
            onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Titre (Arabe)" : "العنوان (العربية)"}
          </label>
          <input
            type="text"
            value={formData.titleAr}
            onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Sous-titre (Français)" : "العنوان الفرعي (الفرنسية)"}
          </label>
          <input
            type="text"
            value={formData.subtitleFr}
            onChange={(e) => setFormData({ ...formData, subtitleFr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Sous-titre (Arabe)" : "العنوان الفرعي (العربية)"}
          </label>
          <input
            type="text"
            value={formData.subtitleAr}
            onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "URL de l'image" : "رابط الصورة"}
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Lien" : "الرابط"}
          </label>
          <input
            type="text"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            {locale === "fr" ? "Ordre" : "الترتيب"}
          </label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            className="w-full bg-gray-100 border border-yellow-500/30 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="rounded border-gray-300 bg-gray-100 accent-yellow-500"
        />
        <label htmlFor="isActive" className="text-sm text-gray-700">
          {locale === "fr" ? "Actif" : "نشط"}
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors"
        >
          <X className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Annuler" : "إلغاء"}
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Sauvegarder" : "حفظ"}
        </button>
      </div>
    </form>
  );
}
