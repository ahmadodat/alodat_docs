"use client";

import type { Document, Person, Category } from "@/app/page";

type StatusInfo = {
  status: string;
  label: string;
  className: string;
  textClassName: string;
  days: number;
};

export default function DocumentDetailsModal({
  document: doc,
  persons,
  categories,
  formatDate,
  getDocumentStatus,
  onEdit,
  onDelete,
  onClose,
}: {
  document: Document;
  persons: Person[];
  categories: Category[];
  formatDate: (date: string | null) => string;
  getDocumentStatus: (date: string | null) => StatusInfo;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const category = categories.find((c) => c.id === doc.categoryId);
  const person = persons.find((p) => p.id === doc.personId);
  const status = getDocumentStatus(doc.expiryDate);

  return (
    <div className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">تفاصيل الوثيقة</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl" style={{ color: category?.color }}>
              {category?.icon || "📄"}
            </span>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {doc.categoryName}
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-white text-sm font-semibold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-semibold">الدولة</span>
              <span className="text-gray-800">
                🌍 {doc.country === "jordan" ? "الأردن" : "كندا"}
              </span>
            </div>

            {person && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-semibold">الفرد</span>
                <span className="text-gray-800">
                  {person.avatar} {person.name}
                </span>
              </div>
            )}

            {doc.documentNumber && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-semibold">رقم الوثيقة</span>
                <span className="text-gray-800">{doc.documentNumber}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-semibold">تاريخ الإصدار</span>
              <span className="text-gray-800">{formatDate(doc.issueDate)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-semibold">تاريخ الانتهاء</span>
              <span className="text-gray-800">{formatDate(doc.expiryDate)}</span>
            </div>

            {status.days !== undefined && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-semibold">المتبقي</span>
                <span className={`font-bold ${status.textClassName}`}>
                  {status.days > 0 ? `${status.days} يوم` : "منتهية"}
                </span>
              </div>
            )}

            {doc.notes && (
              <div className="py-2">
                <span className="text-gray-600 font-semibold block mb-1">
                  ملاحظات
                </span>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                  {doc.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => onEdit(doc)}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              ✏️ تعديل
            </button>
            <button
              onClick={() => onDelete(doc.id)}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
            >
              🗑️ حذف
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
