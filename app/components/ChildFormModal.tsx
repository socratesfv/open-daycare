"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { ChildRow, Room } from "@/utils/supabase/children";
import { parseAllergyTags, translateAllergy } from "@/utils/child-display";
import { saveChild, editChild } from "@/utils/supabase/server-actions";

interface ChildFormModalProps {
  onClose: () => void;
  rooms: Room[];
  child?: ChildRow | null;
}

function initialForm(child: ChildRow | null | undefined, rooms: Room[]) {
  if (child) {
    return {
      fullName: child.full_name,
      birthDate: child.birth_date,
      enrolledAt: child.enrolled_at,
      roomId: child.room_id ?? rooms[0]?.id ?? "",
      allergies: child.allergy_tags.map(translateAllergy).join(", "),
      medicalNotes: child.medical_notes,
      photoConsent: child.photo_consent,
    };
  }
  return {
    fullName: "",
    birthDate: "",
    enrolledAt: "",
    roomId: rooms[0]?.id ?? "",
    allergies: "",
    medicalNotes: "",
    photoConsent: true,
  };
}

function hasError(value: string): boolean {
  return value.trim().length === 0;
}

export default function ChildFormModal({ onClose, rooms, child }: ChildFormModalProps) {
  const [form, setForm] = useState(() => initialForm(child, rooms));
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEdit = Boolean(child);

  const birthDateValid = form.birthDate.trim().length > 0 && !isNaN(Date.parse(form.birthDate));
  const enrolledAtValid = form.enrolledAt.trim().length > 0 && !isNaN(Date.parse(form.enrolledAt));
  const isFormValid =
    !hasError(form.fullName) &&
    birthDateValid &&
    enrolledAtValid &&
    !hasError(form.roomId);

  const setField = (field: keyof ReturnType<typeof initialForm>) => (value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid || isSaving) return;

    const payload = {
      full_name: form.fullName.trim(),
      birth_date: form.birthDate,
      enrolled_at: form.enrolledAt,
      room_id: form.roomId,
      allergy_tags: parseAllergyTags(form.allergies),
      medical_notes: form.medicalNotes.trim(),
      photo_consent: form.photoConsent,
    };

    setIsSaving(true);
    setSubmitError(null);
    const result = child
      ? await editChild(child.id, payload)
      : await saveChild(payload);
    setIsSaving(false);

    if (result?.error) {
      setSubmitError("No se pudo guardar el niño. Inténtalo de nuevo.");
      return;
    }

    onClose();
  };

  const handleCancel = () => {
    setSubmitError(null);
    onClose();
  };

  const inputClass = (error: boolean) =>
    `w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] outline-none placeholder:text-[#B6A99B] focus:border-[#EE8164] ${
      error ? "border-[#E5484D]" : "border-[#EADFD0]"
    }`;

  const labelClass = "mb-2 text-[12px] font-extrabold uppercase tracking-[0.7px] text-[#94887B]";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80">
      <div className="flex h-full md:min-h-full md:items-center md:justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isEdit ? "Editar niño" : "Agregar niño"}
          className="flex h-full w-full flex-col bg-[#FBF4EC] md:h-auto md:max-w-[520px] md:rounded-[24px] md:border md:border-[#ECE0D0] md:shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]"
        >
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
              <button
                type="button"
                onClick={handleCancel}
                className="text-[15px] font-bold text-[#94887B]"
              >
                Cancelar
              </button>
              <span className="font-display text-lg font-semibold text-[#3F362E]">
                {isEdit ? "Editar niño" : "Agregar niño"}
              </span>
              <button
                type="submit"
                disabled={!isFormValid || isSaving}
                className="text-[15px] font-extrabold text-[#D9583C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving ? "Guardando…" : "Guardar"}
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-[18px] overflow-y-auto px-[26px] py-6">
              <div>
                <label htmlFor="child-fullName" className={labelClass}>
                  Nombre completo
                </label>
                <input
                  id="child-fullName"
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setField("fullName")(e.target.value)}
                  placeholder="Ej. Martina López"
                  autoFocus
                  className={inputClass(hasError(form.fullName))}
                />
                {hasError(form.fullName) && (
                  <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Campo obligatorio</p>
                )}
              </div>

              <div className="flex gap-[14px]">
                <div className="flex-1">
                  <label htmlFor="child-birthDate" className={labelClass}>
                    Fecha de nacimiento
                  </label>
                  <input
                    id="child-birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => setField("birthDate")(e.target.value)}
                    className={inputClass(!birthDateValid)}
                  />
                  {form.birthDate.trim().length === 0 && (
                    <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Campo obligatorio</p>
                  )}
                  {form.birthDate.trim().length > 0 && !birthDateValid && (
                    <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Fecha no válida</p>
                  )}
                </div>

                <div className="flex-1">
                  <label htmlFor="child-enrolledAt" className={labelClass}>
                    Fecha de ingreso
                  </label>
                  <input
                    id="child-enrolledAt"
                    type="date"
                    value={form.enrolledAt}
                    onChange={(e) => setField("enrolledAt")(e.target.value)}
                    className={inputClass(!enrolledAtValid)}
                  />
                  {form.enrolledAt.trim().length === 0 && (
                    <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Campo obligatorio</p>
                  )}
                  {form.enrolledAt.trim().length > 0 && !enrolledAtValid && (
                    <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Fecha no válida</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="child-room" className={labelClass}>
                  Sala
                </label>
                <div className="relative">
                  <select
                    id="child-room"
                    value={form.roomId}
                    onChange={(e) => setField("roomId")(e.target.value)}
                    className={`${inputClass(false)} appearance-none pr-10 font-bold`}
                  >
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B0A290"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div>
                <label htmlFor="child-allergies" className={labelClass}>
                  Alergias (etiquetas)
                </label>
                <input
                  id="child-allergies"
                  type="text"
                  value={form.allergies}
                  onChange={(e) => setField("allergies")(e.target.value)}
                  placeholder="Ej. Maní, Lactosa"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <label htmlFor="child-notes" className={labelClass}>
                  Notas médicas
                </label>
                <textarea
                  id="child-notes"
                  value={form.medicalNotes}
                  onChange={(e) => setField("medicalNotes")(e.target.value)}
                  placeholder="Indicaciones, medicación, contactos…"
                  rows={4}
                  className={`${inputClass(false)} min-h-[90px] resize-y leading-relaxed`}
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.photoConsent}
                  onChange={(e) => setField("photoConsent")(e.target.checked)}
                  className="h-5 w-5 rounded-[6px] accent-[#EE8164]"
                />
                <span className="text-[14.5px] font-bold text-[#3F362E]">
                  Consentimiento para fotos
                </span>
              </label>

              {submitError && (
                <p className="rounded-[12px] bg-[#FBDAD6] px-4 py-3 text-[13px] font-bold text-[#C5413A]">
                  {submitError}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
