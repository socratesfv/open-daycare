"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { children } from "@/data/mock/children";
import { POST_TYPE_CONFIG, type PostType } from "@/data/mock/posts";

const MAX_PHOTOS = 4;
const MAX_PHOTO_SIZE_MB = 4;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALL_ROOM = "all";

const CHILD_TEXT_COLORS: Record<string, string> = {
  A9D9E8: "#1F7A93",
  F4B8CC: "#C44A7A",
  B9DEC4: "#3E8B62",
  F4DC8E: "#A88526",
  C9B6E8: "#7B5FC0",
  A9C7E8: "#4E72C8",
};

const postTypeKeys = Object.keys(POST_TYPE_CONFIG) as PostType[];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedPhoto {
  file: File;
  url: string;
}

function PlusIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C5503A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [childId, setChildId] = useState("");
  const [type, setType] = useState<PostType | "">("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const childEmpty = childId === "";
  const typeEmpty = type === "";
  const descriptionEmpty = description.trim().length === 0;
  const photosEmpty = photos.length === 0;

  const showChildError = submitted && childEmpty;
  const showTypeError = submitted && typeEmpty;
  const showDescriptionError = submitted && descriptionEmpty;
  const showPhotosError = submitted && photosEmpty && !fileError;

  const handleClose = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setChildId("");
    setType("");
    setDescription("");
    setPhotos([]);
    setSubmitted(false);
    setFileError("");
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setFileError("");
    const nextPhotos: SelectedPhoto[] = [];
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setFileError("Formato no permitido. Usá JPG, PNG o WEBP.");
        continue;
      }
      if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
        setFileError(`La foto supera los ${MAX_PHOTO_SIZE_MB}MB.`);
        continue;
      }
      if (photos.length + nextPhotos.length >= MAX_PHOTOS) {
        setFileError(`Máximo ${MAX_PHOTOS} fotos.`);
        break;
      }
      nextPhotos.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotos([...photos, ...nextPhotos]);
    event.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (childEmpty || typeEmpty || descriptionEmpty || photosEmpty || fileError) return;
    console.log("Nueva publicación", { childId, type, description, photos: photos.map((p) => p.file) });
    handleClose();
  };

  const sectionLabel = "mb-[10px] text-[12px] font-extrabold uppercase tracking-[0.7px] text-[#94887B]";
  const errorMessage = "mt-[6px] text-[12px] font-bold text-[#E5484D]";

  const childChipClass = (selected: boolean) =>
    `flex items-center gap-2 rounded-full border-[1.5px] py-[6px] pl-[6px] pr-[14px] text-[14px] font-bold ${
      selected
        ? "border-[#3F362E] bg-[#3F362E] text-white"
        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
    }`;

  const allRoomChipClass = (selected: boolean) =>
    `rounded-full border-[1.5px] px-4 py-[6px] text-[14px] font-bold ${
      selected
        ? "border-[#3F362E] bg-[#3F362E] text-white"
        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
    }`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80">
      <div className="flex h-full md:min-h-full md:items-center md:justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Nueva publicación"
          className="flex h-full w-full flex-col bg-[#FBF4EC] md:h-auto md:max-w-[580px] md:rounded-[24px] md:border md:border-[#ECE0D0] md:shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]"
        >
          <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
            <button type="button" onClick={handleClose} className="text-[15px] font-bold text-[#94887B]">
              Cancelar
            </button>
            <span className="font-display text-lg font-semibold text-[#3F362E]">Nueva publicación</span>
            <button type="button" onClick={handleSubmit} className="text-[15px] font-extrabold text-[#D9583C]">
              Publicar
            </button>
          </div>

          <div className="min-h-0 flex-1 space-y-[22px] overflow-y-auto px-[26px] py-[22px]">
            <div>
              <div className={sectionLabel}>Para</div>
              <div className="flex flex-wrap gap-[9px]">
                {children.map((child) => {
                  const selected = childId === child.id;
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => setChildId(child.id)}
                      className={childChipClass(selected)}
                    >
                      <span
                        className="flex h-[26px] w-[26px] items-center justify-center rounded-full font-display text-[13px] font-semibold"
                        style={{
                          backgroundColor: `#${child.color}`,
                          color: CHILD_TEXT_COLORS[child.color] ?? "#fff",
                        }}
                      >
                        {child.initials}
                      </span>
                      {child.name.split(" ")[0]}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setChildId(ALL_ROOM)}
                  className={allRoomChipClass(childId === ALL_ROOM)}
                >
                  Toda la sala
                </button>
              </div>
              {showChildError && <p className={errorMessage}>Campo obligatorio</p>}
            </div>

            <div>
              <div className={sectionLabel}>Tipo</div>
              <div className="flex flex-wrap gap-[9px]">
                {postTypeKeys.map((key) => {
                  const config = POST_TYPE_CONFIG[key];
                  const selected = type === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setType(key)}
                      style={{ backgroundColor: config.bg, color: config.text }}
                      className={`rounded-full px-4 py-2 text-[13.5px] font-extrabold ${
                        selected ? "ring-2 ring-[#3F362E] ring-offset-1 ring-offset-[#FBF4EC]" : ""
                      }`}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
              {showTypeError && <p className={errorMessage}>Campo obligatorio</p>}
            </div>

            <div>
              <div className={sectionLabel}>Descripción</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contá cómo le fue hoy…"
                className={`min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] text-[15px] leading-[1.5] text-[#3F362E] outline-none placeholder:text-[#B6A99B] focus:border-[#EE8164] ${
                  showDescriptionError ? "border-[#E5484D]" : "border-[#EADFD0]"
                }`}
              />
              {showDescriptionError && <p className={errorMessage}>Campo obligatorio</p>}
            </div>

            <div>
              <div className={sectionLabel}>Fotos</div>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div key={photo.url} className="relative h-[96px] w-[96px]">
                    <img
                      src={photo.url}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full rounded-[14px] border border-[#ECE0D0] object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`Eliminar foto ${index + 1}`}
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -right-[7px] -top-[7px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#3F362E] text-white shadow-[0_2px_6px_rgba(63,54,46,.4)]"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[96px] w-[96px] flex-col items-center justify-center gap-[6px] rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
                  >
                    <PlusIcon />
                    <span className="text-xs">Agregar</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              {fileError && <p className={errorMessage}>{fileError}</p>}
              {showPhotosError && <p className={errorMessage}>Campo obligatorio</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
