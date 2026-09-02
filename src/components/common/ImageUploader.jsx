import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const ImageUploader = ({ currentImage, onImageUploaded, label = 'Upload Image' }) => {
    const [preview, setPreview] = useState(currentImage || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Keep preview in sync when currentImage changes (handles switching tabs or clearing)
    useEffect(() => {
        if (!uploading) {
            setPreview(currentImage || '');
        }
    }, [currentImage, uploading]);

    const handleFile = async (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image (JPG, PNG, WEBP, GIF).');
            return;
        }

        setError('');
        // Instant local preview
        const localPreviewUrl = URL.createObjectURL(file);
        setPreview(localPreviewUrl);

        try {
            setUploading(true);
            const serverUrl = await api.uploadImage(file);
            setPreview(serverUrl);
            onImageUploaded(serverUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Image upload failed');
            setPreview(currentImage || '');
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                {label}
            </label>
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] bg-white group ${
                    dragActive
                        ? 'border-devorange-500 bg-devorange-100/30'
                        : 'border-gray-200 hover:border-devyellow-400 hover:bg-devyellow-100/20'
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {preview ? (
                    <div className="relative w-full h-36 flex items-center justify-center overflow-hidden rounded-lg">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain rounded-lg"
                        />
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5">
                                <Loader2 className="w-7 h-7 text-devorange-500 animate-spin" />
                                <span className="text-[11px] font-bold text-charcoal-800">Uploading...</span>
                            </div>
                        )}
                        {!uploading && (
                            <div className="absolute bottom-2 right-2 bg-charcoal-900/80 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-3.5 h-3.5 text-devyellow-400" /> Replace Image
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-12 h-12 rounded-full bg-devyellow-100/80 flex items-center justify-center mx-auto mb-2 text-devorange-600">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-charcoal-800">
                            Drag & drop or <span className="text-devorange-600 font-semibold underline">browse</span>
                        </p>
                        <p className="text-xs text-charcoal-500 mt-1">
                            Instant WebP & Cloudinary upload
                        </p>
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        </div>
    );
};

export default ImageUploader;