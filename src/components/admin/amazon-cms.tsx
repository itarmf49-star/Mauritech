"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, LayoutGrid, Megaphone, Clock, Image as ImageIcon, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

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

interface CategoryShowcase {
  id: string;
  nameFr: string;
  nameAr: string;
  slug: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface FlashDeal {
  id: string;
  nameFr: string;
  nameAr: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  imageUrl: string;
  endTime: string;
  order: number;
  isActive: boolean;
}

interface PromoBlock {
  id: string;
  titleFr: string;
  titleAr: string;
  descriptionFr: string;
  descriptionAr: string;
  imageUrl: string;
  link: string;
  order: number;
  isActive: boolean;
}

interface AmazonCMSProps {
  locale: "fr" | "ar";
}

export function AmazonCMS({ locale }: AmazonCMSProps) {
  const [activeTab, setActiveTab] = useState<"banners" | "categories" | "deals" | "promos">("banners");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categoryShowcases, setCategoryShowcases] = useState<CategoryShowcase[]>([]);
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([]);
  const [promoBlocks, setPromoBlocks] = useState<PromoBlock[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bannersRes, categoriesRes, dealsRes, promosRes] = await Promise.all([
        fetch('/api/admin/content/banners'),
        fetch('/api/admin/content/category-showcases'),
        fetch('/api/admin/content/flash-deals'),
        fetch('/api/admin/content/promo-blocks'),
      ]);

      if (bannersRes.ok) {
        const data = await bannersRes.json();
        setBanners(data.banners || []);
      }
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategoryShowcases(data.showcases || []);
      }
      if (dealsRes.ok) {
        const data = await dealsRes.json();
        setFlashDeals(data.deals || []);
      }
      if (promosRes.ok) {
        const data = await promosRes.json();
        setPromoBlocks(data.blocks || []);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSave = async (item: any) => {
    setSaving(true);
    try {
      const endpoint = activeTab === "banners" 
        ? "/api/admin/content/banners"
        : activeTab === "categories"
        ? "/api/admin/content/category-showcases"
        : activeTab === "deals"
        ? "/api/admin/content/flash-deals"
        : "/api/admin/content/promo-blocks";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        await loadData();
        setEditingItem(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(locale === "fr" ? "Supprimer cet élément?" : "حذف هذا العنصر؟")) {
      try {
        const endpoint = activeTab === "banners"
          ? "/api/admin/content/banners"
          : activeTab === "categories"
          ? "/api/admin/content/category-showcases"
          : activeTab === "deals"
          ? "/api/admin/content/flash-deals"
          : "/api/admin/content/promo-blocks";

        const response = await fetch(`${endpoint}/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await loadData();
        }
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleReorder = async (items: { id: string; order: number }[]) => {
    try {
      const endpoint = activeTab === "banners"
        ? "/api/admin/content/banners/reorder"
        : activeTab === "categories"
        ? "/api/admin/content/category-showcases/reorder"
        : activeTab === "deals"
        ? "/api/admin/content/flash-deals/reorder"
        : "/api/admin/content/promo-blocks/reorder";

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error('Failed to reorder:', error);
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    const reorder = <T extends { id: string; order: number }>(list: T[]) => {
      if (newIndex < 0 || newIndex >= list.length) return null;
      const items = [...list];
      [items[index], items[newIndex]] = [items[newIndex], items[index]];
      return items.map((item, i) => ({ ...item, order: i + 1 }));
    };

    const apply = <T extends { id: string; order: number }>(
      list: T[],
      setList: (next: T[]) => void,
    ) => {
      const items = reorder(list);
      if (!items) return;
      setList(items);
      handleReorder(items);
    };

    if (activeTab === "banners") apply(banners, setBanners);
    else if (activeTab === "categories") apply(categoryShowcases, setCategoryShowcases);
    else if (activeTab === "deals") apply(flashDeals, setFlashDeals);
    else apply(promoBlocks, setPromoBlocks);
  };

  const renderItemForm = () => {
    if (!showForm) return null;

    return (
      <div className="bg-white border border-yellow-500/30 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {editingItem ? (locale === "fr" ? "Modifier" : "تعديل") : (locale === "fr" ? "Ajouter" : "إضافة")}
        </h3>

        {activeTab === "banners" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Titre (FR)" : "العنوان (فرنسي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.titleFr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titleFr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Titre (AR)" : "العنوان (عربي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.titleAr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Sous-titre (FR)" : "العنوان الفرعي (فرنسي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.subtitleFr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, subtitleFr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Sous-titre (AR)" : "العنوان الفرعي (عربي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.subtitleAr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, subtitleAr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Lien" : "الرابط"}</label>
              <input
                type="text"
                defaultValue={editingItem?.link || ""}
                onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Nom (FR)" : "الاسم (فرنسي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.nameFr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameFr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Nom (AR)" : "الاسم (عربي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.nameAr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameAr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Slug" : "الرابط المختصر"}</label>
              <input
                type="text"
                defaultValue={editingItem?.slug || ""}
                onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
          </div>
        )}

        {activeTab === "deals" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Nom (FR)" : "الاسم (فرنسي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.nameFr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameFr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Nom (AR)" : "الاسم (عربي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.nameAr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, nameAr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Prix original" : "السعر الأصلي"}</label>
              <input
                type="number"
                defaultValue={editingItem?.originalPrice || ""}
                onChange={(e) => setEditingItem({ ...editingItem, originalPrice: parseInt(e.target.value) })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Prix remisé" : "السعر المخفض"}</label>
              <input
                type="number"
                defaultValue={editingItem?.discountPrice || ""}
                onChange={(e) => setEditingItem({ ...editingItem, discountPrice: parseInt(e.target.value) })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Pourcentage" : "النسبة المئوية"}</label>
              <input
                type="number"
                defaultValue={editingItem?.discountPercent || ""}
                onChange={(e) => setEditingItem({ ...editingItem, discountPercent: parseInt(e.target.value) })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
          </div>
        )}

        {activeTab === "promos" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Titre (FR)" : "العنوان (فرنسي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.titleFr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titleFr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Titre (AR)" : "العنوان (عربي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.titleAr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, titleAr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Description (FR)" : "الوصف (فرنسي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.descriptionFr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, descriptionFr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Description (AR)" : "الوصف (عربي)"}</label>
              <input
                type="text"
                defaultValue={editingItem?.descriptionAr || ""}
                onChange={(e) => setEditingItem({ ...editingItem, descriptionAr: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">{locale === "fr" ? "Lien" : "الرابط"}</label>
              <input
                type="text"
                defaultValue={editingItem?.link || ""}
                onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <button
            onClick={() => handleSave(editingItem)}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {locale === "fr" ? "Enregistrer" : "حفظ"}
          </button>
          <button
            onClick={() => { setShowForm(false); setEditingItem(null); }}
            className="flex items-center gap-2 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg"
          >
            <X className="w-4 h-4" />
            {locale === "fr" ? "Annuler" : "إلغاء"}
          </button>
        </div>
      </div>
    );
  };

  const renderItems = () => {
    type Row = {
      id: string;
      title: string;
      subtitle: string;
      data: Banner | CategoryShowcase | FlashDeal | PromoBlock;
    };

    const rows: Row[] =
      activeTab === "banners"
        ? banners.map((b) => ({ id: b.id, title: locale === "fr" ? b.titleFr : b.titleAr, subtitle: "", data: b }))
        : activeTab === "categories"
        ? categoryShowcases.map((c) => ({ id: c.id, title: locale === "fr" ? c.nameFr : c.nameAr, subtitle: "", data: c }))
        : activeTab === "deals"
        ? flashDeals.map((d) => ({
            id: d.id,
            title: locale === "fr" ? d.nameFr : d.nameAr,
            subtitle: `${d.discountPrice.toLocaleString()} MRU (-${d.discountPercent}%)`,
            data: d,
          }))
        : promoBlocks.map((p) => ({
            id: p.id,
            title: locale === "fr" ? p.titleFr : p.titleAr,
            subtitle: locale === "fr" ? p.descriptionFr : p.descriptionAr,
            data: p,
          }));

    return (
      <div className="space-y-3">
        {rows.map((item, index) => (
          <div
            key={item.id}
            className="bg-white border border-yellow-500/30 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{item.title}</p>
              <p className="text-gray-600 text-sm">{item.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => moveItem(index, "up")}
                disabled={index === 0}
                className="p-2 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveItem(index, "down")}
                disabled={index === rows.length - 1}
                className="p-2 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setEditingItem(item.data); setShowForm(true); }}
                className="p-2 hover:bg-yellow-500/20 rounded text-yellow-600"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 hover:bg-red-500/20 rounded text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {locale === "fr" ? "Gestion Amazon CMS" : "إدارة Amazon CMS"}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("banners")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "banners"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Megaphone className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Bannières" : "اللافتات"}
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "categories"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <LayoutGrid className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Catégories" : "الفئات"}
        </button>
        <button
          onClick={() => setActiveTab("deals")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "deals"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Ventes Flash" : "العروض السريعة"}
        </button>
        <button
          onClick={() => setActiveTab("promos")}
          className={`px-4 py-2 font-medium transition ${
            activeTab === "promos"
              ? "text-yellow-600 border-b-2 border-yellow-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          {locale === "fr" ? "Promotions" : "العروض الترويجية"}
        </button>
      </div>

      {/* Add Button */}
      <button
        onClick={() => { setEditingItem({}); setShowForm(true); }}
        className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-4 py-2 rounded-lg font-medium"
      >
        <Plus className="w-4 h-4" />
        {locale === "fr" ? "Ajouter" : "إضافة"}
      </button>

      {/* Form */}
      {renderItemForm()}

      {/* Items List */}
      {renderItems()}
    </div>
  );
}
