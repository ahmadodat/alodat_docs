"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { User, Person, Category, Document } from "@/app/page";
import Toast from "./Toast";
import DocumentModal from "./DocumentModal";
import PersonModal from "./PersonModal";
import CategoryModal from "./CategoryModal";
import ChangePasswordModal from "./ChangePasswordModal";
import DocumentDetailsModal from "./DocumentDetailsModal";

type View = "dashboard" | "documents" | "persons" | "categories" | "notifications";

type ToastData = {
  message: string;
  type: "success" | "error" | "warning";
};

export default function Dashboard({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hasShownExpiryToast = useRef(false);

  // Filters
  const [personFilter, setPersonFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [showDocModal, setShowDocModal] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDocDetails, setShowDocDetails] = useState<Document | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ message, type });
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [docsRes, personsRes, catsRes] = await Promise.all([
        fetch("/api/documents"),
        fetch("/api/persons"),
        fetch("/api/categories"),
      ]);

      if (docsRes.ok) {
        const d = await docsRes.json();
        setDocuments(d.documents);
      }
      if (personsRes.ok) {
        const p = await personsRes.json();
        setPersons(p.persons);
      }
      if (catsRes.ok) {
        const c = await catsRes.json();
        setCategoriesList(c.categories);
      }
    } catch {
      showToast("حدث خطأ في تحميل البيانات", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function getDocumentStatus(expiryDate: string | null) {
    if (!expiryDate) {
      return {
        status: "unknown",
        label: "غير محدد",
        className: "bg-gray-500",
        textClassName: "text-gray-600",
        days: 0,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let expiry: Date;
    if (/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
      const parts = expiryDate.split("-");
      expiry = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    } else {
      expiry = new Date(expiryDate);
    }
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: "expired",
        label: "منتهية",
        className: "bg-red-500",
        textClassName: "text-red-600",
        days: diffDays,
      };
    } else if (diffDays <= 30) {
      return {
        status: "reminder_30",
        label: "تذكير شهر",
        className: "bg-orange-500",
        textClassName: "text-orange-600",
        days: diffDays,
      };
    } else if (diffDays <= 90) {
      return {
        status: "reminder_90",
        label: "تذكير 3 أشهر",
        className: "bg-yellow-500",
        textClassName: "text-yellow-600",
        days: diffDays,
      };
    } else {
      return {
        status: "active",
        label: "سارية",
        className: "bg-green-500",
        textClassName: "text-green-600",
        days: diffDays,
      };
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "غير محدد";
    try {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split("-");
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
      }
      const date = new Date(dateString);
      return date.toLocaleDateString("ar", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return dateString;
    }
  }

  useEffect(() => {
    if (loading || hasShownExpiryToast.current || documents.length === 0) return;

    const expiredCountNow = documents.filter(
      (doc) => getDocumentStatus(doc.expiryDate).status === "expired"
    ).length;
    const monthReminderCount = documents.filter(
      (doc) => getDocumentStatus(doc.expiryDate).status === "reminder_30"
    ).length;
    const threeMonthReminderCount = documents.filter(
      (doc) => getDocumentStatus(doc.expiryDate).status === "reminder_90"
    ).length;
    const totalAlerts = expiredCountNow + monthReminderCount + threeMonthReminderCount;

    if (totalAlerts > 0) {
      const parts = [];
      if (expiredCountNow > 0) parts.push(`${expiredCountNow} منتهية`);
      if (monthReminderCount > 0) parts.push(`${monthReminderCount} خلال شهر`);
      if (threeMonthReminderCount > 0) parts.push(`${threeMonthReminderCount} خلال 3 أشهر`);
      showToast(`تنبيه الوثائق: ${parts.join("، ")}`, "warning");
    }

    hasShownExpiryToast.current = true;
  }, [documents, loading, showToast]);

  function getFilteredDocuments() {
    let docs = [...documents];
    if (personFilter !== "all") docs = docs.filter((d) => d.personId === personFilter);
    if (categoryFilter !== "all") docs = docs.filter((d) => d.categoryId === categoryFilter);
    if (statusFilter !== "all") {
      docs = docs.filter((d) => getDocumentStatus(d.expiryDate).status === statusFilter);
    }
    if (searchQuery) {
      docs = docs.filter(
        (d) =>
          d.categoryName?.includes(searchQuery) ||
          d.documentNumber?.includes(searchQuery) ||
          d.notes?.includes(searchQuery)
      );
    }
    return docs;
  }

  // CRUD handlers
  async function handleSaveDocument(data: Partial<Document> & { id?: string }) {
    try {
      const isEdit = !!data.id;
      const url = isEdit ? `/api/documents/${data.id}` : "/api/documents";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast(isEdit ? "تم تحديث الوثيقة بنجاح" : "تم إضافة الوثيقة بنجاح");
        fetchAll();
        setShowDocModal(false);
        setEditDoc(null);
      } else {
        showToast("حدث خطأ", "error");
      }
    } catch {
      showToast("حدث خطأ في الاتصال", "error");
    }
  }

  async function handleDeleteDocument(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه الوثيقة؟")) return;
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم حذف الوثيقة بنجاح");
        fetchAll();
        setShowDocDetails(null);
      }
    } catch {
      showToast("حدث خطأ", "error");
    }
  }

  async function handleSavePerson(data: Partial<Person> & { id?: string }) {
    try {
      const isEdit = !!data.id;
      const url = isEdit ? `/api/persons/${data.id}` : "/api/persons";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast(isEdit ? "تم تحديث الفرد بنجاح" : "تم إضافة الفرد بنجاح");
        fetchAll();
        setShowPersonModal(false);
        setEditPerson(null);
      } else {
        showToast("حدث خطأ", "error");
      }
    } catch {
      showToast("حدث خطأ في الاتصال", "error");
    }
  }

  async function handleDeletePerson(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الفرد؟")) return;
    try {
      const res = await fetch(`/api/persons/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم حذف الفرد بنجاح");
        fetchAll();
      }
    } catch {
      showToast("حدث خطأ", "error");
    }
  }

  async function handleSaveCategory(data: Partial<Category> & { id?: string }) {
    try {
      const isEdit = !!data.id;
      const url = isEdit ? `/api/categories/${data.id}` : "/api/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showToast(isEdit ? "تم تحديث التصنيف بنجاح" : "تم إضافة التصنيف بنجاح");
        fetchAll();
        setShowCatModal(false);
        setEditCat(null);
      } else {
        showToast("حدث خطأ", "error");
      }
    } catch {
      showToast("حدث خطأ في الاتصال", "error");
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا التصنيف؟")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("تم حذف التصنيف بنجاح");
        fetchAll();
      }
    } catch {
      showToast("حدث خطأ", "error");
    }
  }

  // Stats
  const totalDocs = documents.length;
  const activeDocs = documents.filter((d) => getDocumentStatus(d.expiryDate).status === "active").length;
  const threeMonthReminderDocs = documents.filter(
    (d) => getDocumentStatus(d.expiryDate).status === "reminder_90"
  ).length;
  const monthReminderDocs = documents.filter(
    (d) => getDocumentStatus(d.expiryDate).status === "reminder_30"
  ).length;
  const expiredDocs = documents.filter((d) => getDocumentStatus(d.expiryDate).status === "expired").length;

  const navItems = [
    { view: "dashboard" as View, icon: "🏠", label: "لوحة التحكم" },
    { view: "documents" as View, icon: "📋", label: "الوثائق" },
    { view: "persons" as View, icon: "👥", label: "الأفراد" },
    { view: "categories" as View, icon: "🏷️", label: "التصنيفات" },
    { view: "notifications" as View, icon: "🔔", label: "التنبيهات" },
  ];

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-60 bg-white shadow-lg flex flex-col transform transition-transform lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="text-3xl mb-2 text-center">📄</div>
          <h2 className="text-base font-bold text-gray-800 text-center">
            إدارة الوثائق الشخصية
          </h2>
        </div>

        <nav className="p-3 flex-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setCurrentView(item.view);
                setSidebarOpen(false);
              }}
              className={`w-full text-right px-3 py-2.5 rounded-lg text-sm font-semibold mb-1 transition-colors ${
                currentView === item.view
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="mb-2">
            <div className="text-xs text-gray-600 mb-1">الحساب</div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              {user.email}
            </div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full text-right px-3 py-2 rounded-lg text-sm font-semibold mb-1 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            🔑 تغيير كلمة المرور
          </button>
          <button
            onClick={onLogout}
            className="w-full text-right px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="font-bold text-gray-800">إدارة الوثائق</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 text-2xl"
          >
            ☰
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {currentView === "dashboard" && renderDashboard()}
            {currentView === "documents" && renderDocuments()}
            {currentView === "persons" && renderPersons()}
            {currentView === "categories" && renderCategories()}
            {currentView === "notifications" && renderNotifications()}
          </>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modals */}
      {showDocModal && (
        <DocumentModal
          document={editDoc}
          persons={persons}
          categories={categoriesList}
          onSave={handleSaveDocument}
          onClose={() => {
            setShowDocModal(false);
            setEditDoc(null);
          }}
        />
      )}

      {showPersonModal && (
        <PersonModal
          person={editPerson}
          onSave={handleSavePerson}
          onClose={() => {
            setShowPersonModal(false);
            setEditPerson(null);
          }}
        />
      )}

      {showCatModal && (
        <CategoryModal
          category={editCat}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCatModal(false);
            setEditCat(null);
          }}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onSuccess={() => {
            showToast("تم تغيير كلمة المرور بنجاح");
            setShowPasswordModal(false);
          }}
          onClose={() => setShowPasswordModal(false)}
        />
      )}

      {showDocDetails && (
        <DocumentDetailsModal
          document={showDocDetails}
          persons={persons}
          categories={categoriesList}
          formatDate={formatDate}
          getDocumentStatus={getDocumentStatus}
          onEdit={(doc: Document) => {
            setShowDocDetails(null);
            setEditDoc(doc);
            setShowDocModal(true);
          }}
          onDelete={handleDeleteDocument}
          onClose={() => setShowDocDetails(null)}
        />
      )}
    </div>
  );

  function renderDashboard() {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="text-3xl mb-2">📄</div>
            <div className="text-3xl font-bold text-blue-600">{totalDocs}</div>
            <div className="text-sm text-gray-600">إجمالي الوثائق</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-3xl font-bold text-green-600">{activeDocs}</div>
            <div className="text-sm text-gray-600">سارية</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="text-3xl mb-2">🗓️</div>
            <div className="text-3xl font-bold text-yellow-600">{threeMonthReminderDocs}</div>
            <div className="text-sm text-gray-600">خلال 3 أشهر</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="text-3xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-orange-600">{monthReminderDocs}</div>
            <div className="text-sm text-gray-600">خلال شهر</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 card-hover">
            <div className="text-3xl mb-2">❌</div>
            <div className="text-3xl font-bold text-red-600">{expiredDocs}</div>
            <div className="text-sm text-gray-600">منتهية</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowDocModal(true)}
            className="bg-blue-600 text-white p-6 rounded-xl shadow-md card-hover text-center"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="font-bold text-lg">إضافة وثيقة جديدة</div>
          </button>
          <button
            onClick={() => setShowPersonModal(true)}
            className="bg-green-600 text-white p-6 rounded-xl shadow-md card-hover text-center"
          >
            <div className="text-3xl mb-2">👤</div>
            <div className="font-bold text-lg">إضافة فرد جديد</div>
          </button>
          <button
            onClick={() => setCurrentView("notifications")}
            className="bg-yellow-600 text-white p-6 rounded-xl shadow-md card-hover text-center"
          >
            <div className="text-3xl mb-2">🔔</div>
            <div className="font-bold text-lg">عرض التنبيهات</div>
          </button>
        </div>

        {/* Recent documents */}
        {documents.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">آخر الوثائق</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.slice(-6).reverse().map((doc) => {
                const category = categoriesList.find((c) => c.id === doc.categoryId);
                const status = getDocumentStatus(doc.expiryDate);
                const person = persons.find((p) => p.id === doc.personId);
                return (
                  <div
                    key={doc.id}
                    onClick={() => setShowDocDetails(doc)}
                    className="bg-white rounded-xl shadow-md p-6 card-hover cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl" style={{ color: category?.color }}>
                        {category?.icon || "📄"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                      {doc.categoryName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      🌍 {doc.country === "jordan" ? "الأردن" : "كندا"}
                    </p>
                    {person && (
                      <p className="text-sm text-gray-600 mb-2">
                        {person.avatar} {person.name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mb-1">
                      الانتهاء: {formatDate(doc.expiryDate)}
                    </p>
                    {status.days !== undefined && (
                      <p className="text-sm font-semibold text-gray-700">
                        ⌛ متبقي{" "}
                        {status.days > 0 ? `${status.days} يوم` : "منتهية"}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderDocuments() {
    const filteredDocs = getFilteredDocuments();

    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800">الوثائق</h1>
          <button
            onClick={() => setShowDocModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            إضافة وثيقة جديدة
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="🔍 بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <select
              value={personFilter}
              onChange={(e) => setPersonFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">جميع الأفراد</option>
              {persons.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.avatar} {p.name}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">جميع التصنيفات</option>
              {categoriesList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">سارية</option>
              <option value="reminder_90">خلال 3 أشهر</option>
              <option value="reminder_30">خلال شهر</option>
              <option value="expired">منتهية</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => {
              const category = categoriesList.find((c) => c.id === doc.categoryId);
              const status = getDocumentStatus(doc.expiryDate);
              const person = persons.find((p) => p.id === doc.personId);
              return (
                <div
                  key={doc.id}
                  onClick={() => setShowDocDetails(doc)}
                  className="bg-white rounded-xl shadow-md p-6 card-hover cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl" style={{ color: category?.color }}>
                      {category?.icon || "📄"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">
                    {doc.categoryName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    🌍 {doc.country === "jordan" ? "الأردن" : "كندا"}
                  </p>
                  {person && (
                    <p className="text-sm text-gray-600 mb-2">
                      {person.avatar} {person.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-1">
                    الانتهاء: {formatDate(doc.expiryDate)}
                  </p>
                  {status.days !== undefined && (
                    <p className="text-sm font-semibold text-gray-700">
                      ⌛ متبقي{" "}
                      {status.days > 0 ? `${status.days} يوم` : "منتهية"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">لا توجد وثائق</p>
          </div>
        )}
      </div>
    );
  }

  function renderPersons() {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">إدارة الأفراد</h1>
          <button
            onClick={() => setShowPersonModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            إضافة فرد
          </button>
        </div>

        {persons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {persons.map((person) => {
              const personDocs = documents.filter((d) => d.personId === person.id);
              const activeCount = personDocs.filter(
                (d) => getDocumentStatus(d.expiryDate).status === "active"
              ).length;
              const threeMonthCount = personDocs.filter(
                (d) => getDocumentStatus(d.expiryDate).status === "reminder_90"
              ).length;
              const monthCount = personDocs.filter(
                (d) => getDocumentStatus(d.expiryDate).status === "reminder_30"
              ).length;
              const expiredCount = personDocs.filter(
                (d) => getDocumentStatus(d.expiryDate).status === "expired"
              ).length;

              return (
                <div key={person.id} className="bg-white rounded-xl shadow-md p-6 card-hover">
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{person.avatar}</div>
                    <h3 className="font-bold text-gray-800 text-xl mb-1">
                      {person.name}
                    </h3>
                    <p className="text-sm text-gray-600">{person.relationship}</p>
                    {person.birthDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(person.birthDate)}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                      <div className="text-xs text-gray-600">سارية</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{threeMonthCount}</div>
                      <div className="text-xs text-gray-600">3 أشهر</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{monthCount}</div>
                      <div className="text-xs text-gray-600">شهر</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{expiredCount}</div>
                      <div className="text-xs text-gray-600">منتهية</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditPerson(person);
                        setShowPersonModal(true);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeletePerson(person.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">لا يوجد أفراد بعد</p>
          </div>
        )}
      </div>
    );
  }

  function renderCategories() {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">إدارة التصنيفات</h1>
          <button
            onClick={() => setShowCatModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            إضافة تصنيف
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoriesList.map((cat) => {
            const catDocs = documents.filter((d) => d.categoryId === cat.id);
            return (
              <div key={cat.id} className="bg-white rounded-xl shadow-md p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl" style={{ color: cat.color }}>
                      {cat.icon}
                    </span>
                    <div>
                      <h3 className="font-bold text-gray-800">{cat.name}</h3>
                      <p className="text-sm text-gray-600">{catDocs.length} وثيقة</p>
                    </div>
                  </div>
                  {cat.isDefault && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      افتراضي
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditCat(cat);
                      setShowCatModal(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    تعديل
                  </button>
                  {!cat.isDefault && (
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                      حذف
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderNotifications() {
    const alerts = documents
      .map((doc) => ({ ...doc, status: getDocumentStatus(doc.expiryDate) }))
      .filter(
        (doc) =>
          doc.status.status === "reminder_90" ||
          doc.status.status === "reminder_30" ||
          doc.status.status === "expired"
      )
      .sort((a, b) => a.status.days - b.status.days);

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">التنبيهات</h1>

        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((doc) => {
              const category = categoriesList.find((c) => c.id === doc.categoryId);
              const person = persons.find((p) => p.id === doc.personId);
              return (
                <div
                  key={doc.id}
                  onClick={() => setShowDocDetails(doc)}
                  className="bg-white rounded-xl shadow-md p-6 card-hover cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl" style={{ color: category?.color }}>
                        {category?.icon || "📄"}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {doc.categoryName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          الدولة: {doc.country === "jordan" ? "الأردن" : "كندا"}
                        </p>
                        {person && (
                          <p className="text-sm text-gray-600">
                            {person.avatar} {person.name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          الانتهاء: {formatDate(doc.expiryDate)}
                        </p>
                        <p className={`text-sm font-semibold ${doc.status.textClassName}`}>
                          {doc.status.days > 0
                            ? `متبقي ${doc.status.days} يوم`
                            : "منتهية"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${doc.status.className}`}
                    >
                      {doc.status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">لا توجد تنبيهات</p>
          </div>
        )}
      </div>
    );
  }
}
