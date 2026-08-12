"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { addChild } from "@/data/mock/children";

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROOM_OPTIONS = ["Soles", "Lunas", "Estrellas"];

const EMPTY_FORM = {
  name: "",
  birthDate: "",
  room: "Soles",
  allergies: "",
  medicalNotes: "",
};

function hasError(value: string): boolean {
  return value.trim().length === 0;
}

export default function AddChildModal({ isOpen, onClose }: AddChildModalProps) {
  const [form, setForm] = useState(EMPTY_FORM);

  if (!isOpen) return null;

  const birthDateValid = form.birthDate.trim().length > 0 && !isNaN(Date.parse(form.birthDate));
  const isFormValid =
    !hasError(form.name) &&
    birthDateValid &&
    !hasError(form.allergies) &&
    !hasError(form.medicalNotes);

  const setField = (field: keyof typeof EMPTY_FORM) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;
    addChild({
      name: form.name.trim(),
      birthDate: form.birthDate,
      room: form.room,
      allergies: form.allergies.trim(),
      medicalNotes: form.medicalNotes.trim(),
    });
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
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
          aria-label="Agregar niño"
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
              <span className="font-display text-lg font-semibold text-[#3F362E]">Agregar niño</span>
              <button
                type="submit"
                disabled={!isFormValid}
                className="text-[15px] font-extrabold text-[#D9583C] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Guardar
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-[18px] overflow-y-auto px-[26px] py-6">
              <div>
                <label htmlFor="child-name" className={labelClass}>
                  Nombre completo
                </label>
                <input
                  id="child-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setField("name")(e.target.value)}
                  placeholder="Ej. Martina López"
                  autoFocus
                  className={inputClass(hasError(form.name))}
                />
                {hasError(form.name) && (
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
                  <label htmlFor="child-room" className={labelClass}>
                    Sala
                  </label>
                  <div className="relative">
                    <select
                      id="child-room"
                      value={form.room}
                      onChange={(e) => setField("room")(e.target.value)}
                      className={`${inputClass(false)} appearance-none pr-10 font-bold`}
                    >
                      {ROOM_OPTIONS.map((room) => (
                        <option key={room} value={room}>
                          {room}
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
                  className={inputClass(hasError(form.allergies))}
                />
                {hasError(form.allergies) && (
                  <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Campo obligatorio</p>
                )}
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
                  className={`${inputClass(hasError(form.medicalNotes))} min-h-[90px] resize-y leading-relaxed`}
                />
                {hasError(form.medicalNotes) && (
                  <p className="mt-[6px] text-[12px] font-bold text-[#E5484D]">Campo obligatorio</p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
