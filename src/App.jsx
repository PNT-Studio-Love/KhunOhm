import { useEffect, useMemo, useState } from "react";
import { siteConfig } from "./siteConfig";

const assetModules = import.meta.glob("../assets/**/*", {
  eager: true,
  query: "?url",
  import: "default",
});

const assets = Object.fromEntries(
  Object.entries(assetModules).map(([path, url]) => [path.split("/").pop(), url])
);

function getAssetUrl(fileName) {
  if (!fileName) return "";
  return assets[fileName] || "";
}

function App() {
  const { theme } = siteConfig;
  const themeStyle = {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--cream": theme.cream,
    "--paper": theme.paper,
    "--ink": theme.ink,
    "--accent": theme.accent,
  };

  return (
    <main className="site-shell" style={themeStyle}>
      <FloatingDecor />
      <Navigation />
      <Hero />
      <MusicCard />
      <Timeline />
      <LoveLetter />
      <Gallery />
      <Videos />
      <SpecialVideoCard />
      <Footer />
    </main>
  );
}

function FloatingDecor() {
  return (
    <div className="floating-decor" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

function Navigation() {
  return (
    <header className="nav-wrap">
      <a className="brand" href="#home">
        <span className="brand-mark">รัก</span>
        <span>{siteConfig.couple.sender} ถึง {siteConfig.couple.receiver}</span>
      </a>
      <nav aria-label="เมนูหลัก">
        {siteConfig.nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  const heroImage = getAssetUrl(siteConfig.home.heroImage);

  return (
    <section id="home" className="hero section-pad">
      <div className="hero-copy">
        <p className="eyebrow">{siteConfig.home.eyebrow}</p>
        <h1>{siteConfig.home.title}</h1>
        <p className="hero-subtitle">{siteConfig.home.subtitle}</p>
        <div className="date-pill">
          <span>{siteConfig.dates.start}</span>
          <span aria-hidden="true">ถึง</span>
          <span>{siteConfig.dates.anniversary}</span>
        </div>
        <p className="soft-note">{siteConfig.home.note}</p>
        <div className="hero-actions">
          <a className="btn primary" href="#timeline">
            {siteConfig.home.primaryButton}
          </a>
          <a className="btn ghost" href="#letter">
            {siteConfig.home.secondaryButton}
          </a>
        </div>
      </div>
      <div className="hero-photo-frame">
        {heroImage ? (
          <img src={heroImage} alt="รูปความทรงจำของพี่โอมและคุณกอล์ฟ" />
        ) : (
          <div className="asset-fallback">ยังไม่ได้เลือกรูปหน้าแรก</div>
        )}
        <div className="photo-caption">{siteConfig.dates.label}</div>
      </div>
    </section>
  );
}

function MusicCard() {
  const audioUrl = getAssetUrl(siteConfig.music.audioFile);

  return (
    <section className="music-section section-pad" aria-labelledby="music-title">
      <div className="music-card">
        <div>
          <p className="eyebrow">{siteConfig.music.sectionTitle}</p>
          <h2 id="music-title">{siteConfig.music.title}</h2>
          <p>{siteConfig.music.artistText}</p>
        </div>
        {audioUrl ? (
          <audio controls autoPlay src={audioUrl}>
            เบราว์เซอร์นี้ไม่รองรับการเล่นเสียง
          </audio>
        ) : (
          <div className="empty-audio" role="note">
            <span className="play-dot" aria-hidden="true" />
            {siteConfig.music.emptyText}
          </div>
        )}
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section id="timeline" className="section-pad story-section">
      <SectionHeading
        eyebrow="เรื่องของเรา"
        title="เส้นทางตลอด 3 เดือน"
        intro="จากวันแรกที่ได้รู้จักกัน จนถึงวันที่ความรู้สึกของพี่ชัดเจนมากขึ้นทุกวัน"
      />
      <div className="timeline-list">
        {siteConfig.timeline.map((item, index) => (
          <article className="timeline-card" key={`${item.date}-${item.title}`}>
            <div className="timeline-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span>{item.date}</span>
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
            <MediaPreview fileName={item.image} alt={item.title} className="timeline-media" />
          </article>
        ))}
      </div>
    </section>
  );
}

function LoveLetter() {
  const fullText = useMemo(
    () => siteConfig.letter.paragraphs.join("\n\n"),
    []
  );
  const typedText = useTypewriter(fullText, 18);
  const paragraphs = typedText.split("\n\n");

  return (
    <section id="letter" className="section-pad letter-section">
      <SectionHeading
        eyebrow={siteConfig.letter.sectionTitle}
        title={siteConfig.letter.title}
        intro={siteConfig.letter.intro}
      />
      <article className="letter-paper">
        {paragraphs.map((paragraph, index) => (
          <p key={`${paragraph.slice(0, 12)}-${index}`}>{paragraph}</p>
        ))}
        <p className="signature">{siteConfig.letter.signature}</p>
      </article>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="section-pad gallery-section">
      <SectionHeading
        eyebrow="รูปถ่าย"
        title={siteConfig.gallery.sectionTitle}
        intro={siteConfig.gallery.intro}
      />
      <div className="gallery-grid">
        {siteConfig.gallery.items.map((item, index) => (
          <figure className="polaroid" key={`${item.src}-${index}`}>
            <MediaPreview fileName={item.src} alt={item.caption} />
            <figcaption>{item.caption}</figcaption>
          </figure>
        ))}
      </div>
      {siteConfig.gallery.outro && (
        <p className="gallery-outro">{siteConfig.gallery.outro}</p>
      )}
    </section>
  );
}

function Videos() {
  return (
    <section id="videos" className="section-pad videos-section">
      <SectionHeading
        eyebrow="วิดีโอ"
        title={siteConfig.videos.sectionTitle}
        intro={siteConfig.videos.intro}
      />
      <div className="video-grid">
        {siteConfig.videos.items.map((item) => {
          const videoUrl = getAssetUrl(item.src);

          return (
            <figure className="video-card" key={item.src}>
              {videoUrl ? (
                <video autoPlay loop muted playsInline controls preload="metadata" src={videoUrl}>
                  เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ
                </video>
              ) : (
                <div className="asset-fallback">ไม่พบไฟล์วิดีโอ</div>
              )}
              <figcaption>{item.caption}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="proposal-section">
      <div className="proposal-content">
        <span className="heart-icon">❤️</span>
        <h2>
          {siteConfig.footer.text}
          {siteConfig.footer.highlight && (
            <>
              <br />
              <span className="proposal-highlight">{siteConfig.footer.highlight}</span>
            </>
          )}
        </h2>
        <p className="proposal-signature">
          ด้วยรักจาก {siteConfig.couple.sender}
        </p>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
  );
}

function MediaPreview({ fileName, alt, className = "" }) {
  const url = getAssetUrl(fileName);

  if (!url) {
    return <div className={`asset-fallback ${className}`}>ไม่พบไฟล์รูปภาพ</div>;
  }

  return <img className={className} src={url} alt={alt} loading="lazy" />;
}

function useTypewriter(text, speed = 20) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    setVisibleText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed]);

  return visibleText;
}

function SpecialVideoCard() {
  const { specialVideo } = siteConfig;

  if (!specialVideo) return null;

  return (
    <section id="special-video" className="special-video-section section-pad" aria-labelledby="special-video-title">
      <SectionHeading
        eyebrow={specialVideo.sectionTitle}
        title={specialVideo.title}
        intro={specialVideo.intro}
      />
      <div className="youtube-container">
        {specialVideo.youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${specialVideo.youtubeId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="asset-fallback">ยังไม่ได้ใส่ลิงก์ YouTube</div>
        )}
      </div>
    </section>
  );
}

export default App;
