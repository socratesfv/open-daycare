"use client";

import { useState } from "react";

interface LinkParentModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
}

const PARENT_ROLE_OPTIONS = ["Mamá", "Papá", "Tutor/a"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateInvitationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function LinkParentModal({ isOpen, onClose, childName }: LinkParentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [invitationCode, setInvitationCode] = useState(generateInvitationCode);

  if (!isOpen) return null;

  const nameEmpty = name.trim().length === 0;
  const emailEmpty = email.trim().length === 0;
  const emailInvalid = !emailEmpty && !EMAIL_PATTERN.test(email.trim());
  const roleEmpty = role === "";
  const isFormValid = !nameEmpty && !emailEmpty && !emailInvalid && !roleEmpty;

  const showNameError = submitted && nameEmpty;
  const showEmailError = submitted && (emailEmpty || emailInvalid);
  const showRoleError = submitted && roleEmpty;

  const handleClose = () => {
    setName("");
    setEmail("");
    setRole("");
    setSubmitted(false);
    setInvitationCode(generateInvitationCode());
    onClose();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!isFormValid) return;
    console.log("Enviar invitación", { childName, name, email, role, invitationCode });
    handleClose();
  };

  const errorMessage = "mt-[6px] text-[12px] font-bold text-[#E5484D]";
  const labelClass = "mb-2 text-[12px] font-extrabold uppercase tracking-[0.7px] text-[#94887B]";
  const inputClass = (hasError: boolean) =>
    `w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] outline-none placeholder:text-[#B6A99B] focus:border-[#EE8164] ${
      hasError ? "border-[#E5484D]" : "border-[#EADFD0]"
    }`;

  const roleClass = (selected: boolean) =>
    `flex-1 rounded-full border-[1.5px] py-[11px] text-[14px] font-extrabold ${
      selected
        ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
    }`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80" onClick={handleClose}>
      <div className="flex h-full md:min-h-full md:items-center md:justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vincular padre"
          onClick={(e) => e.stopPropagation()}
          className="flex h-full w-full flex-col bg-[#FBF4EC] md:h-auto md:max-w-[480px] md:rounded-[24px] md:border md:border-[#ECE0D0] md:shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]"
        >
          <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
            <div>
              <div className="font-display text-lg font-semibold text-[#3F362E]">Vincular padre</div>
              <div className="text-[13px] text-[#A89A8B]">a {childName}</div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-[18px] overflow-y-auto px-[26px] py-[22px]">
            <div className="flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4E72C8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-[1px] flex-none"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
                Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {childName}.
              </span>
            </div>

            <div>
              <label htmlFor="parent-name" className={labelClass}>
                Nombre del padre/madre
              </label>
              <input
                id="parent-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Diego Fernández"
                className={inputClass(showNameError)}
              />
              {showNameError && <p className={errorMessage}>Campo obligatorio</p>}
            </div>

            <div>
              <label htmlFor="parent-email" className={labelClass}>
                Email
              </label>
              <input
                id="parent-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className={inputClass(showEmailError)}
              />
              {showEmailError && (
                <p className={errorMessage}>
                  {emailEmpty ? "Campo obligatorio" : "Email no válido"}
                </p>
              )}
            </div>

            <div>
              <div className={labelClass}>Parentesco</div>
              <div className="flex gap-[9px]">
                {PARENT_ROLE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRole(option)}
                    className={roleClass(role === option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showRoleError && <p className={errorMessage}>Campo obligatorio</p>}
            </div>

            <div className="rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] px-0 py-[18px] text-center">
              <div className="mb-2 text-[12px] font-extrabold uppercase tracking-[0.7px] text-[#A88526]">
                Código de invitación
              </div>
              <div className="font-display text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
                {invitationCode}
              </div>
              <div className="mt-[6px] text-[13px] text-[#A88526]">Vence en 7 días</div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] px-0 py-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="M22 2 11 13" />
              </svg>
              Enviar invitación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
