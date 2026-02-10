'use client';

import React, { useRef, useState } from 'react';
import { useUpload } from '@hooks/useUpload';
import Link from 'next/link';

export default function UploadPage() {
  const upload = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    genre: '',
    artist: '',
    language: 'en',
    contentRating: 'PG',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setMetadata({
        ...metadata,
        title: e.target.files[0].name.replace(/\.[^.]+$/, ''),
      });
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setMetadata({
      ...metadata,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !metadata.title) {
      alert('Please select a file and enter title');
      return;
    }

    setUploadStatus('uploading');

    try {
      // Initiate upload
      const initiateResult = await upload.initiateUpload('user-001', {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type,
        metadata: {
          title: metadata.title,
          description: metadata.description,
          genre: [metadata.genre],
          artist: metadata.artist,
          duration: 0,
          language: metadata.language,
          contentRating: metadata.contentRating as any,
        },
      });

      if (!initiateResult.success) {
        throw new Error(initiateResult.error);
      }

      if (!initiateResult.data) {
        throw new Error('Upload initiation failed - no data received');
      }

      // Upload file
      const uploadResult = await upload.uploadFile(
        initiateResult.data.uploadId,
        selectedFile,
        (progress: number) => {
          setUploadProgress(progress);
        }
      );

      if (uploadResult.success) {
        setUploadStatus('completed');
        setSelectedFile(null);
        setUploadProgress(0);
        setMetadata({
          title: '',
          description: '',
          genre: '',
          artist: '',
          language: 'en',
          contentRating: 'PG',
        });
      } else {
        throw new Error(uploadResult.error);
      }
    } catch (error) {
      setUploadStatus('error');
      console.error('Upload failed:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ padding: '20px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'block' }}>
            ← Back to Home
          </Link>
          <h1>Upload Media</h1>
          <p>Share your content with our community</p>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
          <form onSubmit={handleUpload}>
            {/* File Upload */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                Select File *
              </label>
              <div
                style={{
                  border: '2px dashed #0070f3',
                  borderRadius: '8px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#f9f9f9',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <p>
                    ✓ {selectedFile.name}
                    <br />
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </p>
                ) : (
                  <p>Click to select or drag and drop a file</p>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="audio/*,video/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={metadata.title}
                onChange={handleMetadataChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Description
              </label>
              <textarea
                name="description"
                value={metadata.description}
                onChange={handleMetadataChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Genre */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Genre
              </label>
              <input
                type="text"
                name="genre"
                value={metadata.genre}
                onChange={handleMetadataChange}
                placeholder="e.g., Pop, Rock, Jazz"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Artist */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Artist Name
              </label>
              <input
                type="text"
                name="artist"
                value={metadata.artist}
                onChange={handleMetadataChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Language */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Language
              </label>
              <select
                name="language"
                value={metadata.language}
                onChange={handleMetadataChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>

            {/* Content Rating */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Content Rating
              </label>
              <select
                name="contentRating"
                value={metadata.contentRating}
                onChange={handleMetadataChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                <option value="G">G - General Audiences</option>
                <option value="PG">PG - Parental Guidance</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R - Restricted</option>
              </select>
            </div>

            {/* Progress Bar */}
            {uploadStatus === 'uploading' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                  Upload Progress: {uploadProgress}%
                </label>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#eee',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      backgroundColor: '#0070f3',
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Status Messages */}
            {uploadStatus === 'completed' && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#efe',
                  color: '#060',
                  borderRadius: '4px',
                  marginBottom: '20px',
                }}
              >
                ✓ Upload successful! Your content is being reviewed.
              </div>
            )}

            {uploadStatus === 'error' && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#fee',
                  color: '#c33',
                  borderRadius: '4px',
                  marginBottom: '20px',
                }}
              >
                ✗ Upload failed. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploadStatus === 'uploading' || !selectedFile}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: uploadStatus === 'uploading' || !selectedFile ? 'not-allowed' : 'pointer',
                opacity: uploadStatus === 'uploading' || !selectedFile ? 0.6 : 1,
              }}
            >
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
            </button>
          </form>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
            <h3>Upload Guidelines</h3>
            <ul>
              <li>Only upload content you have the rights to</li>
              <li>No copyrighted material without permission</li>
              <li>Maximum file size: 5 GB</li>
              <li>Supported formats: MP3, MP4, WAV, AAC, etc.</li>
              <li>Your content will be reviewed before publishing (24-48 hours)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
