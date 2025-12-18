'use client';

import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* ---------------- TYPES ---------------- */
export interface ListingFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  brand: string;
  mpn: string;
  quantity: string;
  handlingTime: string;
  zipCode: string;
}

interface ListingFormProps {
  initialData?: ListingFormData;
  onSaveDraft: (data: ListingFormData, images: string[]) => Promise<void>;
  onPost: (data: ListingFormData, images: string[]) => Promise<void>;
  loading?: boolean;
}

const MAX_IMAGES = 12;

/* ---------------- SORTABLE IMAGE ---------------- */
function SortableImage({
  id,
  url,
  isMain,
  onRemove
}: {
  id: string;
  url: string;
  isMain: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <img src={url} className="w-full h-24 object-cover rounded-lg" />
      {isMain && (
        <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Main
        </span>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
      >
        ✕
      </button>
    </div>
  );
}

/* ---------------- MAIN FORM ---------------- */
export default function ListingForm({
  initialData,
  onSaveDraft,
  onPost,
  loading
}: ListingFormProps) {
  const [formData, setFormData] = useState<ListingFormData>(
    initialData || {
      title: '',
      description: '',
      price: '',
      category: '',
      condition: 'USED_GOOD',
      brand: '',
      mpn: '',
      quantity: '1',
      handlingTime: '2 business days',
      zipCode: '11790'
    }
  );

  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  /* -------- Load Draft -------- */
  useEffect(() => {
    const saved = localStorage.getItem('draftListing');
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed.formData);
      setImages(parsed.images || []);
    }
  }, []);

  /* -------- Save Draft -------- */
  useEffect(() => {
    localStorage.setItem('draftListing', JSON.stringify({ formData, images }));
  }, [formData, images]);

  /* -------- Image Upload -------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      setError(`Max ${MAX_IMAGES} images allowed`);
      return;
    }

    const newImages = Array.from(files).map(f => URL.createObjectURL(f));
    setImages(prev => [...prev, ...newImages]);
  };

  /* -------- Drag Reorder -------- */
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImages(items => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <form className="space-y-6">

      {/* PHOTOS */}
      <section className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-3">📸 Photos</h2>
        <input type="file" multiple accept="image/*" onChange={handleImageUpload} />

        {images.length > 0 && (
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={images} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, i) => (
                  <SortableImage
                    key={img}
                    id={img}
                    url={img}
                    isMain={i === 0}
                    onRemove={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      {/* TITLE */}
      <section className="bg-white/10 p-6 rounded-xl border border-white/20">
        <label className="text-white font-semibold">Title</label>
        <input
          maxLength={80}
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 text-white rounded-lg"
        />
        <p className="text-sm text-gray-400">{formData.title.length}/80</p>
      </section>

      {/* DESCRIPTION */}
      <section className="bg-white/10 p-6 rounded-xl border border-white/20">
        <label className="text-white font-semibold">Description</label>
        <textarea
          rows={6}
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 text-white rounded-lg"
        />
      </section>

      {/* PRICE */}
      <section className="bg-white/10 p-6 rounded-xl border border-white/20">
        <label className="text-white font-semibold">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-4 py-3 bg-white/5 text-white rounded-lg"
        />
      </section>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onSaveDraft(formData, images)}
          disabled={loading}
          className="flex-1 bg-gray-600 py-4 rounded-lg text-white"
        >
          Save Draft
        </button>

        <button
          type="button"
          onClick={() => onPost(formData, images)}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 py-4 rounded-lg text-white"
        >
          Post Listing
        </button>
      </div>

      {error && <p className="text-red-400">{error}</p>}
    </form>
  );
}
