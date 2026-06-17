import { useEffect, useMemo, useState, useRef } from "react";
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
  const [hasEntered, setHasEntered] = useState(false);
  const audioRef = useRef(null);

  const themeStyle = {
    "--primary": theme.primary,
    "--secondary": theme.secondary,
    "--cream": theme.cream,
    "--paper": theme.paper,
    "--ink": theme.ink,
    "--accent": theme.accent,
  };

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  return (
    <main className="site-shell" style={{ ...themeStyle, ...(hasEntered ? {} : { height: '100vh', overflow: 'hidden' }) }}>
      {!hasEntered && (
        <div className="gift-overlay">
          {/* Floating hearts background */}
          <div className="gift-hearts" aria-hidden="true">
            <span>♡</span><span>♡</span><span>♡</span>
            <span>♡</span><span>♡</span><span>♡</span>
            <span>♡</span><span>♡</span>
          </div>

          <div className="gift-card">
            {/* Ribbon decoration */}
            <div className="gift-ribbon" aria-hidden="true">
              <div className="gift-ribbon-v" />
              <div className="gift-ribbon-h" />
              <div className="gift-bow">
                <span className="bow-loop bow-left" />
                <span className="bow-loop bow-right" />
                <span className="bow-knot" />
              </div>
            </div>

            {/* Content */}
            <p className="gift-from">จากพี่โอม ถึง คุณกอล์ฟ</p>
            <h2 className="gift-title">พี่มีของขวัญเล็ก ๆ<br />มาฝากครับ</h2>
            <p className="gift-subtitle">
              เรื่องราวน่ารัก ๆ ตลอด 3 เดือนที่ผ่านมา<br />ถูกเก็บไว้ข้างในนี้แล้ว
            </p>

            <button className="gift-btn" onClick={handleEnter} type="button">
              <span className="gift-btn-icon">💌</span>
              <span>แตะเพื่อเปิดของขวัญ</span>
            </button>
          </div>
        </div>
      )}
      <FloatingDecor />
      <Navigation />
      <Hero />
        <MusicCard audioRef={audioRef} />
        <Timeline />
        <LoveLetter />
        <Gallery />
        <MiniGame />
        <PromiseSection />
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

function MusicCard({ audioRef }) {
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
          <audio ref={audioRef} controls autoPlay src={audioUrl}>
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
            <TimelineMedia item={item} />
          </article>
        ))}
      </div>
    </section>
  );
}

function TimelineMedia({ item }) {
  const files = item.images?.length ? item.images : [item.image].filter(Boolean);

  if (files.length === 1) {
    return <MediaPreview fileName={files[0]} alt={item.title} className="timeline-media" />;
  }

  return (
    <div className={`timeline-polaroids count-${files.length}`}>
      {files.map((fileName, index) => (
        <div className="timeline-polaroid" key={fileName}>
          <MediaPreview
            fileName={fileName}
            alt={`${item.title} ${index + 1}`}
            className="polaroid-img"
          />
        </div>
      ))}
    </div>
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

function MiniGame() {
  const [cards, setCards] = useState(() => buildGameDeck());
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);

  const complete = matched.length === siteConfig.miniGame.cards.length;

  function resetGame() {
    setCards(buildGameDeck());
    setSelected([]);
    setMatched([]);
  }

  function chooseCard(card) {
    if (selected.length === 2 || selected.includes(card.uid) || matched.includes(card.id)) return;

    const next = [...selected, card.uid];
    setSelected(next);

    if (next.length !== 2) return;

    const [first, second] = next.map((uid) => cards.find((item) => item.uid === uid));

    if (first.id === second.id) {
      setMatched((items) => [...items, first.id]);
      setSelected([]);
      return;
    }

    window.setTimeout(() => setSelected([]), 700);
  }

  return (
    <section id="mini-game" className="section-pad mini-game-section">
      <SectionHeading
        eyebrow={siteConfig.miniGame.sectionTitle}
        title={siteConfig.miniGame.title}
        intro={siteConfig.miniGame.intro}
      />
      <div className="game-panel">
        <div className="game-grid">
          {cards.map((card) => {
            const isOpen = selected.includes(card.uid) || matched.includes(card.id);

            return (
              <button
                className={`memory-card ${isOpen ? "is-open" : ""}`}
                key={card.uid}
                onClick={() => chooseCard(card)}
                type="button"
              >
                <span className="memory-front">รัก</span>
                <span className="memory-back">
                  <MediaPreview fileName={card.image} alt={card.label} />
                  <span>{card.label}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="game-actions">
          <p>{complete ? siteConfig.miniGame.completeText : "จับคู่รูปที่เหมือนกันให้ครบทุกคู่นะครับ"}</p>
          <button className="btn ghost" onClick={resetGame} type="button">
            {siteConfig.miniGame.resetText}
          </button>
        </div>
      </div>
    </section>
  );
}

function PromiseSection() {
  return (
    <section id="promise" className="section-pad promise-section">
      <SectionHeading
        eyebrow={siteConfig.promise.sectionTitle}
        title={siteConfig.promise.title}
        intro={siteConfig.promise.intro}
      />
      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-hint-icon">↔</span>
        <span>เลื่อนซ้าย-ขวาเพื่อดูคำสัญญาอื่น ๆ</span>
      </div>
      <div className="promise-grid">
        {siteConfig.promise.items.map((item, index) => (
          <PromiseCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function PromiseCard({ item, index }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <button 
      className={`promise-card-flip ${isFlipped ? "is-flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
      type="button"
      aria-expanded={isFlipped}
    >
      <div className="promise-card-inner">
        <div className="promise-front">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{item.title}</h3>
          {item.emoji && <div className="promise-emoji">{item.emoji}</div>}
          <p className="tap-hint">แตะเพื่อดูคำสัญญา</p>
        </div>
        <div className="promise-back">
          <p>{item.text}</p>
        </div>
      </div>
    </button>
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

function buildGameDeck() {
  return shuffle(
    siteConfig.miniGame.cards.flatMap((card) => [
      { ...card, uid: `${card.id}-a` },
      { ...card, uid: `${card.id}-b` },
    ])
  );
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
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
