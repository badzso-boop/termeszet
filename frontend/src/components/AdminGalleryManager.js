import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faTrash,
  faPenToSquare,
  faUpload,
  faSpinner,
  faCheck,
  faXmark,
  faImage,
  faCircleCheck,
  faCircleExclamation,
  faMagnifyingGlass,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export const AdminGalleryManager = () => {
  const { userId } = useAuth();
  const {
    galleryImages,
    fetchGalleryImages,
    uploadGalleryImages,
    toggleStarGalleryImage,
    updateGalleryImageTitle,
    deleteGalleryImage,
  } = useAdmin();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  // Upload State
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [batchTitle, setBatchTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Gallery View State
  const [loadingList, setLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'starred', 'unstarred'
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'oldest', 'title'
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  // Editing State
  const [editingImageId, setEditingImageId] = useState(null);
  const [editTitleText, setEditTitleText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Modal / Preview State
  const [previewImage, setPreviewImage] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [starTogglingId, setStarTogglingId] = useState(null);

  // Initial fetch if empty
  useEffect(() => {
    if (fetchGalleryImages && (!galleryImages || galleryImages.length === 0)) {
      setLoadingList(true);
      fetchGalleryImages()
        .catch(() => {})
        .finally(() => setLoadingList(false));
    }
  }, [fetchGalleryImages, galleryImages]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((item) => {
        if (item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [selectedFiles]);

  // Helper: Format file size
  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper: Format date
  const formatDate = (dateVal) => {
    if (!dateVal) return "-";
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);
      return d.toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(dateVal);
    }
  };

  // Helper: Get complete image URL
  const getFullImageUrl = (path) => {
    if (!path) return "";
    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("blob:") ||
      path.startsWith("data:")
    ) {
      return path;
    }
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${cleanPath}`;
  };

  // Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesAdded(Array.from(e.target.files));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFilesAdded = (files) => {
    setUploadError("");
    setUploadSuccess("");

    const newItems = [];
    let oversizedCount = 0;
    let nonImageCount = 0;

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        nonImageCount++;
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedCount++;
        return;
      }

      newItems.push({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file: file,
        preview: URL.createObjectURL(file),
        title: "",
        size: file.size,
      });
    });

    if (nonImageCount > 0) {
      setUploadError(
        `${nonImageCount} fájl kihagyva: Csak képformátumok (JPG, PNG, WebP, GIF stb.) tölthetők fel.`
      );
    } else if (oversizedCount > 0) {
      setUploadError(
        `${oversizedCount} fájl meghaladta a 100 MB-os maximális mérethatárt.`
      );
    }

    if (newItems.length > 0) {
      setSelectedFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleRemoveQueueItem = (id) => {
    setSelectedFiles((prev) => {
      const item = prev.find((x) => x.id === id);
      if (item && item.preview) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter((x) => x.id !== id);
    });
  };

  const handleQueueTitleChange = (id, newTitle) => {
    setSelectedFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleClearQueue = () => {
    selectedFiles.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    setSelectedFiles([]);
    setBatchTitle("");
    setUploadError("");
  };

  // Upload handler
  const handleUploadSubmit = async (e) => {
    if (e) e.preventDefault();
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess("");

    const formData = new FormData();
    selectedFiles.forEach((item, index) => {
      // Append files cleanly to 'images'
      formData.append("images", item.file);
      const itemTitle = item.title.trim() || batchTitle.trim() || "";
      if (itemTitle) {
        formData.append(`titles[${index}]`, itemTitle);
      }
    });

    if (batchTitle.trim()) {
      formData.append("batchTitle", batchTitle.trim());
      formData.append("title", batchTitle.trim());
    }
    formData.append("userId", userId);

    try {
      if (uploadGalleryImages) {
        await uploadGalleryImages(formData, (percent) => {
          setUploadProgress(percent);
        });
      } else {
        // Direct axios fallback
        const uploadUrl = `${API_BASE_URL}/api/admin/gallery/upload`;
        const token = localStorage.getItem("token");
        await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percent);
            }
          },
        });
        if (fetchGalleryImages) await fetchGalleryImages();
      }

      setUploadSuccess(
        `Sikeres feltöltés! ${selectedFiles.length} kép hozzáadva és optimalizálva.`
      );
      handleClearQueue();
    } catch (err) {
      console.error("Gallery upload error:", err);
      const serverMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Hiba történt a képek feltöltése és optimalizálása során.";
      setUploadError(serverMsg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Star toggle handler
  const handleToggleStar = async (image) => {
    const id = image.id || image._id;
    if (!id || starTogglingId) return;

    setStarTogglingId(id);
    try {
      if (toggleStarGalleryImage) {
        await toggleStarGalleryImage(id);
      } else {
        await axios.post(`${API_BASE_URL}/api/admin/gallery/toggle-star/${id}`, {
          userId,
        });
        if (fetchGalleryImages) await fetchGalleryImages();
      }
    } catch (err) {
      console.error("Star toggle error:", err);
    } finally {
      setStarTogglingId(null);
    }
  };

  // Edit Title Handlers
  const handleStartEdit = (image) => {
    const currentTitle =
      image.title || image.caption || image.cim || image.filename || "";
    setEditingImageId(image.id || image._id);
    setEditTitleText(currentTitle);
  };

  const handleSaveEdit = async (id) => {
    if (!id || savingEdit) return;
    setSavingEdit(true);
    try {
      if (updateGalleryImageTitle) {
        await updateGalleryImageTitle(id, editTitleText.trim());
      } else {
        await axios.put(`${API_BASE_URL}/api/admin/gallery/${id}`, {
          title: editTitleText.trim(),
          caption: editTitleText.trim(),
          userId,
        });
        if (fetchGalleryImages) await fetchGalleryImages();
      }
      setEditingImageId(null);
    } catch (err) {
      console.error("Save edit title error:", err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingImageId(null);
    setEditTitleText("");
  };

  // Delete Handlers
  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    const id = imageToDelete.id || imageToDelete._id;
    setDeletingId(id);
    try {
      if (deleteGalleryImage) {
        await deleteGalleryImage(id);
      } else {
        await axios.delete(`${API_BASE_URL}/api/admin/gallery/${id}`, {
          data: { userId, id },
        });
        if (fetchGalleryImages) await fetchGalleryImages();
      }
      setImageToDelete(null);
    } catch (err) {
      console.error("Delete gallery image error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Refresh handler
  const handleRefresh = async () => {
    setLoadingList(true);
    try {
      if (fetchGalleryImages) await fetchGalleryImages();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  // Gallery Filtering, Sorting & Pagination
  const rawImages = Array.isArray(galleryImages) ? galleryImages : [];
  const totalCount = rawImages.length;
  const starredCount = rawImages.filter(
    (img) => Boolean(img.isStarred || img.starred || img.is_starred || img.featured)
  ).length;

  const filteredImages = rawImages.filter((img) => {
    const isStarred = Boolean(
      img.isStarred || img.starred || img.is_starred || img.featured
    );
    if (filterMode === "starred" && !isStarred) return false;
    if (filterMode === "unstarred" && isStarred) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const title = (
        img.title ||
        img.caption ||
        img.cim ||
        img.filename ||
        ""
      ).toLowerCase();
      const filename = (img.filename || img.name || "").toLowerCase();
      return title.includes(q) || filename.includes(q);
    }
    return true;
  });

  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "newest") {
      const dateA = new Date(a.createdAt || a.uploadDate || a.datum || 0).getTime();
      const dateB = new Date(b.createdAt || b.uploadDate || b.datum || 0).getTime();
      return dateB - dateA;
    }
    if (sortBy === "oldest") {
      const dateA = new Date(a.createdAt || a.uploadDate || a.datum || 0).getTime();
      const dateB = new Date(b.createdAt || b.uploadDate || b.datum || 0).getTime();
      return dateA - dateB;
    }
    if (sortBy === "title") {
      const titleA = (a.title || a.caption || a.filename || "").toLowerCase();
      const titleB = (b.title || b.caption || b.filename || "").toLowerCase();
      return titleA.localeCompare(titleB, "hu");
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedImages.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedImages = sortedImages.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  return (
    <div className="w-full my-8 px-2 sm:px-4 lg:px-6">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink">
          Galéria kezelése
        </h2>
        <div className="mt-2 flex flex-wrap justify-center items-center gap-3 text-sm">
          <span className="bg-primary px-3 py-1 rounded-full border border-secondary/30 font-medium">
            Összes kép: <strong className="text-ink">{totalCount}</strong>
          </span>
          <span className="bg-gold/20 text-ink px-3 py-1 rounded-full border border-gold/40 font-medium">
            ⭐ Főoldalon kiemelt: <strong>{starredCount}</strong>
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* ========================================================================= */}
        {/* Upload Card */}
        {/* ========================================================================= */}
        <div className="bg-secondary/40 border border-secondary/30 rounded-xl p-4 sm:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-ink mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faUpload} className="text-gold" />
            <span>Új képek feltöltése</span>
          </h3>

          {/* Alert messages */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleExclamation} className="text-red-600" />
                <span>{uploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadError("")}
                className="text-red-600 hover:text-red-800"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-600" />
                <span>{uploadSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadSuccess("")}
                className="text-emerald-600 hover:text-emerald-800"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {/* Dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-gold bg-gold/10 scale-[1.01]"
                : "border-secondary/50 hover:border-gold hover:bg-gold/5 bg-primary/20"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center text-ink text-xl">
                <FontAwesomeIcon icon={faImage} />
              </div>
              <p className="font-medium text-ink">
                Húzd ide a feltölteni kívánt képeket, vagy{" "}
                <span className="text-gold underline font-semibold">
                  kattints a böngészéshez
                </span>
              </p>
              <p className="text-xs text-ink/60">
                Támogatott formátumok: JPG, PNG, WebP, GIF • Fájlonként akár 100 MB
                • Automatikus képoptimalizálás
              </p>
            </div>
          </div>

          {/* Selected Files Queue */}
          {selectedFiles.length > 0 && (
            <div className="mt-5 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="w-full sm:w-2/3">
                  <label className="block text-xs font-semibold text-ink/80 mb-1">
                    Közös képcím / felirat (opcionális):
                  </label>
                  <input
                    type="text"
                    value={batchTitle}
                    onChange={(e) => setBatchTitle(e.target.value)}
                    placeholder="Pl. Nyári élménytábor, Erdőjárás 2026..."
                    className="w-full px-3 py-2 text-sm border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                  />
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleClearQueue}
                    disabled={uploading}
                    className="px-3 py-2 text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-40"
                  >
                    Mégse / Lista törlése
                  </button>
                  <span className="text-xs bg-primary px-2 py-1 rounded border border-secondary/30 font-medium">
                    {selectedFiles.length} kép kiválasztva
                  </span>
                </div>
              </div>

              {/* Mini previews grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-2 bg-primary/20 rounded-lg border border-secondary/20">
                {selectedFiles.map((item) => (
                  <div
                    key={item.id}
                    className="relative group bg-white p-1.5 rounded-lg border border-secondary/30 shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full rounded overflow-hidden bg-black/5">
                      <img
                        src={item.preview}
                        alt={item.file.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveQueueItem(item.id);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition shadow"
                        title="Eltávolítás"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                    <div className="mt-1.5">
                      <p
                        className="text-[11px] font-medium truncate text-ink"
                        title={item.file.name}
                      >
                        {item.file.name}
                      </p>
                      <p className="text-[10px] text-ink/60">
                        {formatFileSize(item.size)}
                      </p>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleQueueTitleChange(item.id, e.target.value)
                        }
                        placeholder="Egyéni cím..."
                        className="w-full mt-1 px-1.5 py-0.5 text-[11px] border border-secondary/20 rounded focus:outline-none focus:ring-1 focus:ring-gold bg-primary/10"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Progress Bar */}
              {uploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs text-ink font-medium">
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gold" />
                      Feltöltés és Python optimalizálás folyamatban...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-secondary/30 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gold h-full transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload CTA */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleUploadSubmit}
                  disabled={uploading || selectedFiles.length === 0}
                  className="btn-brand text-sm px-6 py-2.5 disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Feltöltés és mentés...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} />
                      <span>{selectedFiles.length} kép feltöltése</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* Gallery Image Filter & Search Bar */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-secondary/20 p-3 rounded-lg border border-secondary/30">
          {/* Search */}
          <div className="relative flex-1">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40 text-sm"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Keresés képcím vagy fájlnév alapján..."
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold bg-white"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-secondary/30 text-xs">
            <button
              type="button"
              onClick={() => {
                setFilterMode("all");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded transition font-medium ${
                filterMode === "all"
                  ? "bg-ink text-ivory shadow-xs"
                  : "text-ink hover:bg-secondary/20"
              }`}
            >
              Mind ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterMode("starred");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded transition font-medium flex items-center gap-1 ${
                filterMode === "starred"
                  ? "bg-gold text-ink font-bold shadow-xs"
                  : "text-ink hover:bg-secondary/20"
              }`}
            >
              ⭐ Kiemelt ({starredCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setFilterMode("unstarred");
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded transition font-medium ${
                filterMode === "unstarred"
                  ? "bg-ink text-ivory shadow-xs"
                  : "text-ink hover:bg-secondary/20"
              }`}
            >
              Nem kiemelt ({totalCount - starredCount})
            </button>
          </div>

          {/* Sort & Refresh */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-secondary/30 rounded-md focus:outline-none focus:ring-1 focus:ring-gold bg-white text-ink"
            >
              <option value="newest">Legújabb elöl</option>
              <option value="oldest">Legrégebbi elöl</option>
              <option value="title">Cím szerint (A-Z)</option>
            </select>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loadingList}
              className="px-2.5 py-1.5 text-xs bg-white hover:bg-primary border border-secondary/30 rounded-md text-ink transition"
              title="Frissítés"
            >
              <FontAwesomeIcon
                icon={faRotateRight}
                className={loadingList ? "animate-spin text-gold" : ""}
              />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Gallery Image Grid */}
        {/* ========================================================================= */}
        {loadingList && sortedImages.length === 0 ? (
          <div className="p-12 text-center text-ink/60 bg-white/60 rounded-xl border border-secondary/30 flex flex-col items-center gap-2">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl text-gold" />
            <p>Galéria betöltése...</p>
          </div>
        ) : sortedImages.length === 0 ? (
          <div className="p-12 text-center text-ink/60 bg-white/60 rounded-xl border border-secondary/30 space-y-2">
            <FontAwesomeIcon icon={faImage} className="text-3xl text-secondary" />
            <p className="font-medium text-base text-ink">Nincs megjeleníthető kép.</p>
            <p className="text-xs">
              {searchQuery || filterMode !== "all"
                ? "Próbáld meg módosítani a keresési feltételeket vagy a szűrőt."
                : "Tölts fel képeket a fenti feltöltő zóna segítségével!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pagedImages.map((image) => {
              const imageId = image.id || image._id;
              const isStarred = Boolean(
                image.isStarred || image.starred || image.is_starred || image.featured
              );
              const title =
                image.title ||
                image.caption ||
                image.cim ||
                image.filename ||
                "Névtelen kép";
              const rawImgUrl =
                image.thumbnailUrl ||
                image.originalUrl ||
                image.url ||
                image.path ||
                image.filepath;
              const imgUrl = getFullImageUrl(rawImgUrl);
              const origImgUrl = getFullImageUrl(
                image.originalUrl || image.url || rawImgUrl
              );
              const isEditingThis = editingImageId === imageId;

              return (
                <div
                  key={imageId}
                  className="bg-white rounded-xl border border-secondary/30 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Top Thumbnail Section */}
                  <div className="relative aspect-[4/3] w-full bg-black/5 overflow-hidden group">
                    <img
                      src={imgUrl}
                      alt={title}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if thumbnail fails
                        if (origImgUrl && e.target.src !== origImgUrl) {
                          e.target.src = origImgUrl;
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                      onClick={() =>
                        setPreviewImage({
                          url: origImgUrl || imgUrl,
                          title: title,
                          date: image.createdAt || image.uploadDate || image.datum,
                          size: image.fileSize || image.size,
                          filename: image.filename,
                          isStarred,
                        })
                      }
                    />

                    {/* Star Badge / Indicator */}
                    <div className="absolute top-2 left-2 pointer-events-none">
                      {isStarred ? (
                        <span className="inline-flex items-center gap-1 bg-gold/90 text-ink text-[11px] font-bold px-2 py-0.5 rounded-full shadow backdrop-blur-xs">
                          ⭐ Főoldalon megjelenik
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-black/60 text-white/90 text-[10px] px-2 py-0.5 rounded-full shadow backdrop-blur-xs">
                          Nem kiemelt
                        </span>
                      )}
                    </div>

                    {/* Star Toggle Action Button (Top Right) */}
                    <button
                      type="button"
                      onClick={() => handleToggleStar(image)}
                      disabled={starTogglingId === imageId}
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow ${
                        isStarred
                          ? "bg-gold text-ink hover:scale-110"
                          : "bg-black/60 text-white/70 hover:text-gold hover:bg-black/80"
                      }`}
                      title={
                        isStarred
                          ? "Kiemelés visszavonása a főoldalról"
                          : "Kiemelés a főoldali galériába"
                      }
                    >
                      {starTogglingId === imageId ? (
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                      ) : (
                        <FontAwesomeIcon icon={faStar} className="text-sm" />
                      )}
                    </button>

                    {/* Quick Preview Hover Overlay Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewImage({
                          url: origImgUrl || imgUrl,
                          title: title,
                          date: image.createdAt || image.uploadDate || image.datum,
                          size: image.fileSize || image.size,
                          filename: image.filename,
                          isStarred,
                        })
                      }
                      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow"
                      title="Nagyítás / Részletek"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </div>

                  {/* Card Content / Metadata */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title display or Edit mode */}
                      {isEditingThis ? (
                        <div className="space-y-1.5 mb-2">
                          <input
                            type="text"
                            value={editTitleText}
                            onChange={(e) => setEditTitleText(e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-secondary/40 rounded focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="Képcím megadása..."
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(imageId);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                          />
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-2 py-0.5 text-[11px] text-ink/70 hover:text-ink rounded"
                            >
                              Mégse
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(imageId)}
                              disabled={savingEdit}
                              className="px-2 py-0.5 text-[11px] bg-ink text-ivory rounded hover:bg-gold hover:text-ink transition flex items-center gap-1 font-medium"
                            >
                              {savingEdit ? (
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                              ) : (
                                <FontAwesomeIcon icon={faCheck} />
                              )}
                              <span>Mentés</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4
                            className="font-semibold text-xs sm:text-sm text-ink line-clamp-1 flex-1"
                            title={title}
                          >
                            {title || <span className="italic text-ink/50">Nincs cím</span>}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(image)}
                            className="text-ink/50 hover:text-ink p-0.5 text-xs transition"
                            title="Képcím szerkesztése"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </button>
                        </div>
                      )}

                      {/* File Details */}
                      <div className="text-[11px] text-ink/60 space-y-0.5">
                        {image.filename && (
                          <p className="truncate" title={image.filename}>
                            📄 {image.filename}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[10px]">
                          <span>
                            {formatDate(
                              image.createdAt || image.uploadDate || image.datum
                            )}
                          </span>
                          <span>
                            {formatFileSize(image.fileSize || image.size)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="mt-3 pt-2 border-t border-secondary/20 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleStar(image)}
                        disabled={starTogglingId === imageId}
                        className={`text-xs px-2 py-1 rounded transition flex items-center gap-1 font-medium ${
                          isStarred
                            ? "bg-gold/20 text-ink hover:bg-gold/30 border border-gold/40"
                            : "bg-secondary/20 text-ink hover:bg-secondary/40 border border-secondary/30"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={faStar}
                          className={isStarred ? "text-gold" : "text-ink/40"}
                        />
                        <span>{isStarred ? "Kiemelve" : "Kiemelés"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setImageToDelete(image)}
                        className="text-xs text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition flex items-center gap-1 font-medium"
                        title="Kép törlése"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span>Törlés</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* Pagination */}
        {/* ========================================================================= */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="bg-primary text-ink disabled:opacity-40 px-3 py-1.5 rounded-md border border-secondary/30 text-sm font-medium transition hover:bg-secondary/20"
            >
              Előző
            </button>
            <span className="text-sm font-medium text-ink">
              {safeCurrentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="bg-primary text-ink disabled:opacity-40 px-3 py-1.5 rounded-md border border-secondary/30 text-sm font-medium transition hover:bg-secondary/20"
            >
              Következő
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Lightbox / Preview Modal */}
      {/* ========================================================================= */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 px-4 border-b border-secondary/30 flex items-center justify-between bg-primary/30">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-ink text-sm sm:text-base truncate max-w-md">
                  {previewImage.title || previewImage.filename || "Kép előnézet"}
                </h3>
                {previewImage.isStarred && (
                  <span className="bg-gold/30 text-ink text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ⭐ Kiemelt
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-secondary/30 transition"
              >
                <FontAwesomeIcon icon={faXmark} className="text-lg" />
              </button>
            </div>

            <div className="p-2 bg-black/90 flex items-center justify-center overflow-auto flex-1 min-h-[300px]">
              <img
                src={previewImage.url}
                alt={previewImage.title || "Full preview"}
                className="max-h-[65vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="p-3 px-4 bg-primary/20 text-xs text-ink/70 flex flex-wrap items-center justify-between gap-2">
              <span>{previewImage.filename}</span>
              <span>{formatDate(previewImage.date)}</span>
              <span>{formatFileSize(previewImage.size)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Delete Confirmation Dialog */}
      {/* ========================================================================= */}
      {imageToDelete && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => !deletingId && setImageToDelete(null)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-secondary/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-xl">
                <FontAwesomeIcon icon={faTrash} />
              </div>
              <div>
                <h4 className="font-semibold text-lg text-ink">Kép törlése</h4>
                <p className="text-xs text-ink/60">A művelet nem vonható vissza.</p>
              </div>
            </div>

            <p className="text-sm text-ink">
              Biztosan végleg törölni szeretnéd a(z){" "}
              <strong className="text-ink font-semibold">
                "{imageToDelete.title || imageToDelete.filename || "kiválasztott képet"}"
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 text-sm rounded-md border border-secondary/40 text-ink hover:bg-secondary/20 font-medium transition"
              >
                Mégse
              </button>
              <button
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 font-medium transition flex items-center gap-2 shadow"
              >
                {deletingId ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Törlés folyamatban...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Igen, törlöm</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManager;
