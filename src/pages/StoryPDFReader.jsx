// src/pages/StoryPDFReader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storyData } from '../storyData';

const STORY_TITLE = "Murder on the Orient Express";
const STORY_AUTHOR = "Agatha Christie";
const PDF_PATH = "/story.pdf"; // Place your PDF at public/story.pdf

const DOWNLOAD_FILENAME = 'Murder_on_the_Orient_Express.pdf';

const StoryPDFReader = () => {
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const viewerRef = useRef(null);
  const toolbarRef = useRef(null);
  const navigate = useNavigate();

  const totalStories = storyData.length;
  const totalVocab = storyData.reduce((acc, s) => acc + s.vocabularyUsed.length, 0);

  // Auto-hide toolbar on scroll for immersive reading
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowToolbar(current < lastScroll || current < 100);
      setLastScroll(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  const handleIframeLoad = () => {
    setPdfLoaded(true);
    setPdfError(false);
  };

  const handleIframeError = () => {
    setPdfError(true);
    setPdfLoaded(false);
  };

  // ─── Guaranteed-filename download ────────────────────────────────────────
  // Chrome intercepts direct <a download> clicks on PDF URLs and ignores the
  // download attribute (produces a UUID filename).  The fix: fetch the bytes
  // ourselves as an ArrayBuffer, wrap them in a Blob typed as
  // application/octet-stream (NOT application/pdf — that re-triggers the
  // interceptor), build a blob: URL, then programmatically click it.
  // The blob: URL has no PDF-handler intercept, so link.download is the
  // sole filename source and is always respected.
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const response = await fetch(PDF_PATH);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Read raw bytes — avoids any browser PDF-pipeline interference
      const buffer = await response.arrayBuffer();

      // Use octet-stream so Chrome treats this as a generic binary download,
      // not a PDF to be handled by its built-in viewer.
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = DOWNLOAD_FILENAME; // Now authoritative — no interceptor
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL after the browser has started the download
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
    } catch (err) {
      console.error('PDF download failed, falling back to direct link:', err);
      // Last-resort fallback: direct URL (filename may be "story.pdf")
      const link = document.createElement('a');
      link.href = PDF_PATH;
      link.download = DOWNLOAD_FILENAME;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(PDF_PATH, '_blank');
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handlePrint = () => {
    window.open(PDF_PATH, '_blank')?.print();
  };

  return (
    <div className="pdf-reader-page">
      {/* === Floating Toolbar === */}
      <div className={`pdf-floating-toolbar ${showToolbar ? 'visible' : 'hidden'}`} ref={toolbarRef}>
        <div className="container">
          <div className="pdf-toolbar-inner">
            {/* Left: Back */}
            <button
              className="pdf-toolbar-btn back-btn"
              onClick={() => navigate('/storybook')}
              title="Back to Stories"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Stories</span>
            </button>

            {/* Center: Title */}
            <div className="pdf-toolbar-title">
              <span className="pdf-toolbar-book-icon">📖</span>
              <div>
                <div className="pdf-toolbar-name">{STORY_TITLE}</div>
                <div className="pdf-toolbar-author">by {STORY_AUTHOR}</div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="pdf-toolbar-actions">
              <button
                className="pdf-toolbar-btn icon-btn"
                onClick={handlePrint}
                title="Print PDF"
              >
                <i className="fas fa-print"></i>
                <span>Print</span>
              </button>
              <button
                className="pdf-toolbar-btn icon-btn"
                onClick={handleOpenInNewTab}
                title="Open in new tab"
              >
                <i className="fas fa-external-link-alt"></i>
                <span>New Tab</span>
              </button>
              <button
                className="pdf-toolbar-btn download-btn"
                onClick={handleDownload}
                disabled={isDownloading}
                title="Download PDF"
              >
                {isDownloading
                  ? <><i className="fas fa-spinner fa-spin"></i><span>Saving…</span></>
                  : <><i className="fas fa-download"></i><span>Download</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === Hero Header === */}
      <div className="pdf-hero">
        <div className="pdf-hero-bg-shapes">
          <div className="pdf-shape pdf-shape-1"></div>
          <div className="pdf-shape pdf-shape-2"></div>
          <div className="pdf-shape pdf-shape-3"></div>
        </div>
        <div className="container">
          <div className="pdf-hero-content">
            <div className="pdf-hero-badge">
              <i className="fas fa-file-pdf me-2"></i>PDF Edition
            </div>
            <h1 className="pdf-hero-title">{STORY_TITLE}</h1>
            <p className="pdf-hero-author">by {STORY_AUTHOR}</p>
            <p className="pdf-hero-subtitle">
              Adapted for vocabulary learning • {totalStories} chapters • {totalVocab}+ vocabulary words
            </p>

            <div className="pdf-hero-stats">
              <div className="pdf-stat">
                <i className="fas fa-book-open"></i>
                <span>{totalStories} Chapters</span>
              </div>
              <div className="pdf-stat-divider"></div>
              <div className="pdf-stat">
                <i className="fas fa-star"></i>
                <span>{totalVocab}+ Vocab Words</span>
              </div>
              <div className="pdf-stat-divider"></div>
              <div className="pdf-stat">
                <i className="fas fa-clock"></i>
                <span>~90 min read</span>
              </div>
            </div>

            {/* Download CTA */}
            <div className="pdf-hero-cta">
              <button className="btn pdf-download-btn" onClick={handleDownload} disabled={isDownloading}>
                {isDownloading
                  ? <><i className="fas fa-spinner fa-spin me-2"></i>Saving…</>
                  : <><i className="fas fa-download me-2"></i>Download PDF</>}
              </button>
              <button className="btn pdf-newtab-btn" onClick={handleOpenInNewTab}>
                <i className="fas fa-external-link-alt me-2"></i>Open Full Screen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === PDF Viewer === */}
      <div className="pdf-viewer-section">
        <div className="container">
          {/* Viewer Card */}
          <div className="pdf-viewer-card" ref={viewerRef}>
            {/* Viewer Header */}
            <div className="pdf-viewer-header">
              <div className="pdf-viewer-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="pdf-viewer-label">
                <i className="fas fa-file-pdf me-2 text-danger"></i>
                {STORY_TITLE}.pdf
              </div>
              <div className="pdf-viewer-controls">
                <button
                  className="pdf-ctrl-btn"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  title="Download"
                >
                  <i className={isDownloading ? 'fas fa-spinner fa-spin' : 'fas fa-download'}></i>
                </button>
                <button
                  className="pdf-ctrl-btn"
                  onClick={handleOpenInNewTab}
                  title="Open in new tab"
                >
                  <i className="fas fa-external-link-alt"></i>
                </button>
              </div>
            </div>

            {/* PDF Embed */}
            <div className="pdf-embed-container">
              {!pdfError ? (
                <>
                  {!pdfLoaded && (
                    <div className="pdf-loading">
                      <div className="pdf-loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring inner"></div>
                      </div>
                      <p className="pdf-loading-text">Loading your story...</p>
                      <p className="pdf-loading-sub">Preparing the PDF reader</p>
                    </div>
                  )}
                  <iframe
                    src={PDF_PATH}
                    className={`pdf-iframe ${pdfLoaded ? 'loaded' : ''}`}
                    title={`${STORY_TITLE} PDF`}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    allowFullScreen
                  />
                </>
              ) : (
                /* Fallback UI when PDF not found */
                <div className="pdf-fallback">
                  <div className="pdf-fallback-icon">📄</div>
                  <h3 className="pdf-fallback-title">PDF Coming Soon</h3>
                  <p className="pdf-fallback-desc">
                    The PDF file will be available shortly. In the meantime, you can read the story
                    directly on the website with interactive vocabulary highlighting!
                  </p>
                  <div className="pdf-fallback-actions">
                    <Link to="/storybook" className="btn pdf-fallback-btn-primary">
                      <i className="fas fa-book-open me-2"></i>Read Online
                    </Link>
                    <button
                      className="btn pdf-fallback-btn-secondary"
                      onClick={() => window.open('https://www.gutenberg.org', '_blank')}
                    >
                      <i className="fas fa-external-link-alt me-2"></i>Find PDF Online
                    </button>
                  </div>
                  <div className="pdf-fallback-tip">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Tip for site owner:</strong> Place your PDF at <code>public/story.pdf</code> to enable the viewer.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Below Viewer */}
          <div className="pdf-quick-actions">
            <button className="pdf-quick-btn" onClick={handleDownload} disabled={isDownloading}>
              <div className="pdf-quick-icon">
                <i className={isDownloading ? 'fas fa-spinner fa-spin' : 'fas fa-download'}></i>
              </div>
              <div className="pdf-quick-text">
                <strong>{isDownloading ? 'Saving…' : 'Download PDF'}</strong>
                <small>Save to your device</small>
              </div>
            </button>

            <button className="pdf-quick-btn" onClick={handlePrint}>
              <div className="pdf-quick-icon">
                <i className="fas fa-print"></i>
              </div>
              <div className="pdf-quick-text">
                <strong>Print Story</strong>
                <small>Print or save as PDF</small>
              </div>
            </button>

            <button className="pdf-quick-btn" onClick={handleOpenInNewTab}>
              <div className="pdf-quick-icon">
                <i className="fas fa-expand"></i>
              </div>
              <div className="pdf-quick-text">
                <strong>Full Screen</strong>
                <small>Open in new tab</small>
              </div>
            </button>

            <Link to="/storybook" className="pdf-quick-btn" style={{ textDecoration: 'none' }}>
              <div className="pdf-quick-icon">
                <i className="fas fa-highlighter"></i>
              </div>
              <div className="pdf-quick-text">
                <strong>Interactive Mode</strong>
                <small>Read with vocab highlights</small>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* === Bottom Banner === */}
      <div className="pdf-bottom-banner">
        <div className="container">
          <div className="pdf-banner-content">
            <div className="pdf-banner-text">
              <h5>💡 Pro Tip</h5>
              <p>
                Read the interactive version on the <strong>StoryBook</strong> page to see vocabulary words highlighted
                and get instant definitions by clicking on them!
              </p>
            </div>
            <Link to="/storybook" className="btn pdf-banner-btn">
              <i className="fas fa-book-open me-2"></i>Open StoryBook
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPDFReader;
