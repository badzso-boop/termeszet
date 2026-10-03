import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faStar,
  faTrash,
  faEdit,
  faCopy,
  faCheck,
  faMagic,
  faImage,
  faSpa,
  faHeartPulse,
  faCompass,
  faSeedling,
  faHandsHoldingCircle,
  faTimes,
  faRotate,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { useAdmin } from "../context/AdminContext";

const AI_SYSTEM_PROMPT = `Te egy professzionális grafikus és minimalista ikon-tervező vagy.
Feladatod: Készíts egy finom vonalvezetésű, organikus, egyvonalas (single continuous line art / contour line drawing) fekete-fehér ikont/logót a megadott természetgyógyászati vagy spirituális szolgáltatáshoz.

Kötelező stílusirányzat a konzisztenciához:
- Stílus: Elegáns, kézzel rajzolt organikus folytonos vonalas művészet (continuous line drawing / minimalist aesthetic line art), mint a finom egyvonalas lélek- és testmotívumok.
- Téma: Természetgyógyászat, reflexológia, spirituális lélekgyógyászat, finom anatómiai, tenyér, talp vagy növényi szimbólumok.
- Színek: Kizárólag letisztult fekete vonalak, teljesen tiszta fehér vagy átlátszó háttér.
- Tilos: Árnyékok, színátmenetek (gradient), 3D effektek, színes kitöltések és vastag tömör foltok kerülendők.
- Formátum: Centrális, szimmetrikus vagy harmonikusan ívelt, négyzetbe/körbe tökéletesen illeszkedő ikon.

Kért ikon témája és címe: [ÍRD IDE A SZOLGÁLTATÁS NEVÉT, PL: Fülreflexológia, Kristályterápia, Hangtál meditáció, Daganatos betegek kísérése]`;

const ICON_PRESETS = [
  { id: "hands", label: "Kéz / Érintés", icon: faHandsHoldingCircle },
  { id: "spa", label: "Lótusz / Lélek", icon: faSpa },
  { id: "heart", label: "Szív / Életerő", icon: faHeartPulse },
  { id: "compass", label: "Iránytű / Életmód", icon: faCompass },
  { id: "seedling", label: "Növény / Táplálkozás", icon: faSeedling },
  { id: "feet", label: "Talp / Reflexológia", icon: faHandsHoldingCircle },
];

const AdminServicesManager = () => {
  const {
    services,
    fetchServices,
    createService,
    updateService,
    toggleStarService,
    deleteService,
  } = useAdmin();

  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [isStarred, setIsStarred] = useState(true);
  const [iconType, setIconType] = useState("hands");
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      await fetchServices();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(AI_SYSTEM_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);
  };

  const openAddModal = () => {
    setEditingService(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setDuration("");
    setIsStarred(true);
    setIconType("hands");
    setIconFile(null);
    setIconPreview("");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setTitle(service.title || "");
    setDescription(service.description || "");
    setPrice(service.price || "");
    setDuration(service.duration || "");
    setIsStarred(service.isStarred !== false);
    setIconType(service.iconType || "hands");
    setIconFile(null);
    setIconPreview(service.iconUrl || "");
    setErrorMsg("");
    setSuccessMsg("");
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg("A cím és a leírás megadása kötelező!");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (price.trim()) formData.append("price", price.trim());
      if (duration.trim()) formData.append("duration", duration.trim());
      formData.append("isStarred", isStarred);
      formData.append("iconType", iconType);

      if (iconFile) {
        formData.append("icon", iconFile);
      }

      if (editingService) {
        await updateService(editingService.id, formData);
        setSuccessMsg("Szolgáltatás sikeresen frissítve!");
      } else {
        await createService(formData);
        setSuccessMsg("Új szolgáltatás sikeresen hozzáadva!");
      }

      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("");
      }, 800);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || "Hiba történt a mentés során.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStar = async (id) => {
    try {
      await toggleStarService(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (service) => {
    if (window.confirm(`Biztosan törölni szeretnéd a(z) "${service.title}" szolgáltatást?`)) {
      try {
        await deleteService(service.id);
      } catch (err) {
        console.error(err);
        alert("Hiba történt a törlés során.");
      }
    }
  };

  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      s.title?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.price?.toLowerCase().includes(q)
    );
  });

  const starredCount = services.filter((s) => s.isStarred).length;

  return (
    <div className="w-full my-8 px-2 sm:px-4 lg:px-6">
      <div className="w-full lg:w-3/4 mx-auto">
        {/* Fejléc */}
        <h1 className="text-center font-display text-2xl font-semibold mb-2 text-ink">
          Szolgáltatások
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-3 text-sm mb-6">
          <span className="bg-primary px-3 py-1 rounded-full border border-secondary/30 font-medium text-ink">
            Összes: <strong>{services.length}</strong>
          </span>
          <span className="bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold/40 font-medium">
            ⭐ Főoldalon kiemelt: <strong>{starredCount}</strong>
          </span>
        </div>

        {/* Gombok */}
        <div className="w-full flex flex-wrap justify-center items-center gap-3 mb-6">
          <button onClick={openAddModal} className="btn-brand">
            <FontAwesomeIcon icon={faPlus} className="text-xl mr-2" />
            <span>Új szolgáltatás</span>
          </button>
          <button
            onClick={() => setShowPromptModal(true)}
            className="btn-outline"
            title="AI Rendszer-Prompt másolása az egységes logók generálásához"
          >
            <FontAwesomeIcon icon={faMagic} className="text-gold mr-2" />
            <span>AI Logó Prompt</span>
          </button>
        </div>

        {/* Keresőmező */}
        <div className="w-full flex justify-center mb-6">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keresés szolgáltatás neve vagy leírása alapján..."
              className="w-full px-4 py-2.5 pl-10 bg-primary/30 border border-secondary/30 rounded-md text-ink placeholder-ink/60 focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50 text-sm"
            />
          </div>
        </div>

        {/* Szolgáltatások rácsa */}
        {loading ? (
          <div className="py-12 text-center text-ink/70">
            <FontAwesomeIcon icon={faRotate} className="animate-spin text-2xl mb-2 text-gold" />
            <p>Szolgáltatások betöltése...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12 border border-secondary/30 rounded-lg p-8 bg-secondary/15">
            <FontAwesomeIcon icon={faSpa} className="text-4xl text-gold/60 mb-3" />
            <p className="text-ink font-medium mb-3">
              {searchQuery ? "Nincs találat a keresési feltételekre." : "Még nincs felvéve szolgáltatás."}
            </p>
            {!searchQuery && (
              <button onClick={openAddModal} className="btn-brand">
                Hozd létre az első szolgáltatást
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`p-6 rounded-xl border transition-all flex flex-col justify-between relative bg-secondary/25 backdrop-blur-sm ${
                  service.isStarred
                    ? "border-gold/80 shadow-md ring-1 ring-gold/30"
                    : "border-secondary/30 shadow-sm opacity-90"
                }`}
              >
                <div>
                  {/* Ikon és műveleti gombok */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center text-ink overflow-hidden shrink-0 border border-gold/40 shadow-inner">
                      {service.iconUrl ? (
                        <img
                          src={service.iconUrl}
                          alt={service.title}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={
                            service.iconType === "heart"
                              ? faHeartPulse
                              : service.iconType === "compass"
                              ? faCompass
                              : service.iconType === "seedling"
                              ? faSeedling
                              : service.iconType === "spa"
                              ? faSpa
                              : faHandsHoldingCircle
                          }
                          className="text-2xl text-ink"
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-primary/60 px-2 py-1 rounded-lg border border-secondary/30">
                      {/* Csillagozás */}
                      <button
                        onClick={() => handleToggleStar(service.id)}
                        className="p-1.5 transition-colors"
                        title={
                          service.isStarred
                            ? "Kiemelve a főoldalon (Kattints a levételhez)"
                            : "Nincs a főoldalon (Kattints a kiemeléshez)"
                        }
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={`text-lg transition-colors ${
                            service.isStarred
                              ? "text-gold drop-shadow-sm"
                              : "text-ink/30 hover:text-gold"
                          }`}
                        />
                      </button>

                      {/* Szerkesztés */}
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-1.5 text-ink/70 hover:text-ink transition-colors"
                        title="Szerkesztés"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-base" />
                      </button>

                      {/* Törlés */}
                      <button
                        onClick={() => handleDelete(service)}
                        className="p-1.5 text-ink/40 hover:text-red-600 transition-colors"
                        title="Törlés"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-base" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display font-semibold text-lg text-ink">
                      {service.title}
                    </h3>
                    {service.isStarred && (
                      <span className="bg-gold/25 text-ink text-[11px] font-semibold px-2 py-0.5 rounded-full border border-gold/40">
                        Főoldalon
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-ink/80 leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                {(service.price || service.duration) && (
                  <div className="pt-3 mt-2 border-t border-secondary/30 flex items-center justify-between text-xs text-ink/70 font-medium">
                    {service.duration && <span>Időtartam: {service.duration}</span>}
                    {service.price && <span className="text-ink font-semibold text-sm">{service.price}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Prompt Segédlet Modal */}
      {showPromptModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-primary rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-secondary/40 relative animate-fadeIn text-ink">
            <div className="flex justify-between items-center mb-4 border-b border-secondary/30 pb-3">
              <div className="flex items-center gap-2 font-display font-semibold text-xl text-ink">
                <FontAwesomeIcon icon={faMagic} className="text-gold" />
                <span>Generatív AI Rendszer-Prompt logótervezéshez</span>
              </div>
              <button
                onClick={() => setShowPromptModal(false)}
                className="text-ink/60 hover:text-ink text-xl p-1"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <p className="text-sm text-ink/80 mb-4 leading-relaxed">
              Másold be ezt a promptot a ChatGPT-be, Midjourney-be, DALL-E-be vagy Claude-ba, és a végén csak írd be az új szolgáltatás nevét! Így minden ikon tökéletesen illeszkedni fog a weboldal egyvonalas, kézzel rajzolt arculatához:
            </p>

            <div className="relative bg-secondary/30 p-4 rounded-xl border border-secondary/40 text-xs sm:text-sm font-mono text-ink mb-6 max-h-64 overflow-y-auto whitespace-pre-wrap">
              {AI_SYSTEM_PROMPT}
            </div>

            <div className="flex flex-wrap justify-between items-center gap-3">
              <button
                onClick={handleCopyPrompt}
                className={`btn-brand ${
                  copiedPrompt ? "!bg-emerald-700 !border-emerald-700 !text-white" : ""
                }`}
              >
                <FontAwesomeIcon icon={copiedPrompt ? faCheck : faCopy} className="mr-2" />
                <span>{copiedPrompt ? "Prompt Másolva a vágólapra!" : "Prompt másolása vágólapra"}</span>
              </button>
              <button
                onClick={() => setShowPromptModal(false)}
                className="btn-outline"
              >
                Bezárás
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Létrehozás / Szerkesztés Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-primary rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-secondary/40 relative my-8 animate-fadeIn text-ink">
            <div className="flex justify-between items-center mb-5 border-b border-secondary/30 pb-3">
              <h3 className="text-2xl font-display font-semibold text-ink">
                {editingService ? "Szolgáltatás szerkesztése" : "Új szolgáltatás hozzáadása"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink/60 hover:text-ink text-xl p-1"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-900 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-lg text-sm">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cím */}
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Szolgáltatás neve / Címe *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="pl. Talpreflexológia, Kombinált Kezelés..."
                  className="w-full px-3.5 py-2.5 bg-ivory/60 border border-secondary/40 rounded-lg text-sm text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Leírás */}
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                  Rövid leírás *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Részletezd, miben segít a kezelés, hogyan zajlik..."
                  className="w-full px-3.5 py-2.5 bg-ivory/60 border border-secondary/40 rounded-lg text-sm text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              {/* Ár és Időtartam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Ár (opcionális)
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="pl. 15.000 Ft vagy Egyeztetés alapján"
                    className="w-full px-3.5 py-2.5 bg-ivory/60 border border-secondary/40 rounded-lg text-sm text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">
                    Időtartam (opcionális)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="pl. 60 perc vagy 90 perc"
                    className="w-full px-3.5 py-2.5 bg-ivory/60 border border-secondary/40 rounded-lg text-sm text-ink placeholder-ink/50 focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              {/* Logó / Ikon választás és Feltöltés */}
              <div className="border border-secondary/40 rounded-xl p-4 bg-secondary/20">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <FontAwesomeIcon icon={faImage} className="text-gold" />
                    Egyedi Logó / Ikon feltöltése
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="text-xs text-gold hover:text-gold/80 font-medium flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faMagic} />
                    AI Prompt másolása
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Előnézet */}
                  <div className="w-16 h-16 rounded-xl bg-ivory/80 border border-gold/40 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {iconPreview ? (
                      <img
                        src={iconPreview}
                        alt="Ikon előnézet"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={
                          iconType === "heart"
                            ? faHeartPulse
                            : iconType === "compass"
                            ? faCompass
                            : iconType === "seedling"
                            ? faSeedling
                            : iconType === "spa"
                            ? faSpa
                            : faHandsHoldingCircle
                        }
                        className="text-2xl text-ink"
                      />
                    )}
                  </div>

                  {/* Fájlválasztó */}
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-outline !py-2 !px-3 text-xs mb-1"
                    >
                      Kép / SVG kiválasztása...
                    </button>
                    <p className="text-[11px] text-ink/60">
                      PNG, JPG, WebP vagy tiszta fekete-fehér SVG fájl.
                    </p>
                  </div>
                </div>

                {/* Vagy Alapértelmezett Ikon választó */}
                {!iconPreview && (
                  <div className="mt-3 pt-3 border-t border-secondary/30">
                    <span className="block text-[11px] text-ink/70 mb-2 font-medium">
                      Vagy válassz egy beépített ikont:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ICON_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setIconType(preset.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border transition-colors ${
                            iconType === preset.id
                              ? "bg-gold text-ink font-semibold border-gold shadow-sm"
                              : "bg-primary/60 border-secondary/40 text-ink hover:bg-primary"
                          }`}
                        >
                          <FontAwesomeIcon icon={preset.icon} className="text-xs" />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Főoldali megjelenítés kapcsoló */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isStarredCheckbox"
                  checked={isStarred}
                  onChange={(e) => setIsStarred(e.target.checked)}
                  className="w-4 h-4 rounded text-gold focus:ring-gold border-secondary/40 cursor-pointer"
                />
                <label
                  htmlFor="isStarredCheckbox"
                  className="text-xs font-semibold text-ink cursor-pointer"
                >
                  Megjelenítés a Főoldal "Szolgáltatások" kártyái között (Kiemelve)
                </label>
              </div>

              {/* Gombok */}
              <div className="flex justify-end gap-3 pt-4 border-t border-secondary/30">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-outline"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-brand disabled:opacity-50"
                >
                  {saving ? "Mentés..." : editingService ? "Módosítások mentése" : "Szolgáltatás hozzáadása"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesManager;
