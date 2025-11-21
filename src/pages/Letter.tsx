import { useState, useEffect, useRef, useMemo } from 'react';

const loveLetterContent = [
  "亲爱的宋青春：",
  "",
  "当我提笔写下这封信的时候，心中满是对你的思念与爱意。",
  "",
  "你就像春天里最美的那朵花，让我的世界变得绚烂多彩。",
  "你的笑容如阳光般温暖，照亮了我生命中的每一个角落。",
  "你的眼神如星辰般璀璨，让我沉醉其中无法自拔。",
  "",
  "每一次与你相遇，都是我生命中最美好的时刻。",
  "你的声音如天籁之音，让我心旷神怡。",
  "你的温柔如春风拂面，让我感受到前所未有的幸福。",
  "",
  "我想对你说，我爱你，胜过爱自己。",
  "我愿意用一生的时间，去守护你的笑容。",
  "我愿意用所有的温柔，去呵护你的心灵。",
  "",
  "你是我生命中最美的风景，",
  "是我心中永远的牵挂，",
  "是我此生最深沉的爱恋。",
  "",
  "愿我的爱如春风，永远环绕着你。",
  "愿我的情如细雨，永远滋润着你。",
  "愿我的心如明月，永远照耀着你。",
];

export default function Letter() {
  const [fallingElements, setFallingElements] = useState<Array<{id: number, type: 'petal' | 'heart', x: number, delay: number}>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const maxLinesPerPage = 9;
  const pages = useMemo(() => {
    const acc: string[][] = [];
    let current: string[] = [];
    for (const line of loveLetterContent) {
      const isEmpty = line.trim() === '';
      if (!isEmpty) current.push(line);
      if (current.length >= maxLinesPerPage || (isEmpty && current.length > 0)) {
        acc.push(current);
        current = [];
      }
    }
    if (current.length) acc.push(current);
    return acc;
  }, []);
  const [activePage, setActivePage] = useState(0);
  const [visibleCounts, setVisibleCounts] = useState<number[]>(() => pages.map(() => 0));

  useEffect(() => {
    // Falling elements animation
    const createFallingElement = () => {
      const newElement = {
        id: Date.now() + Math.random(),
        type: Math.random() > 0.5 ? 'petal' : 'heart' as 'petal' | 'heart',
        x: Math.random() * 100,
        delay: Math.random() * 3
      };
      setFallingElements(prev => [...prev, newElement]);
    };

    // Create falling elements periodically
    const interval = setInterval(createFallingElement, 1500);
    
    // Create initial elements
    for (let i = 0; i < 8; i++) {
      setTimeout(createFallingElement, i * 300);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const lines = pages[activePage]?.length || 0;
    const timers: number[] = [];
    for (let i = 0; i < lines; i++) {
      timers.push(window.setTimeout(() => {
        setVisibleCounts(prev => {
          const next = [...prev];
          next[activePage] = i + 1;
          return next;
        });
      }, i * 800));
    }
    return () => timers.forEach(t => clearTimeout(t));
  }, [activePage, pages]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActivePage(idx);
          }
        });
      },
      { root, threshold: 0.6 }
    );
    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToPage = (idx: number) => {
    const target = sectionRefs.current[idx];
    if (target && containerRef.current) {
      containerRef.current.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    }
  };
  const nextPage = () => {
    if (activePage < pages.length - 1) scrollToPage(activePage + 1);
  };
  const prevPage = () => {
    if (activePage > 0) scrollToPage(activePage - 1);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePage]);

  // Clean up old falling elements
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFallingElements(prev => prev.filter(el => Date.now() - el.id < 10000));
    }, 2000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 relative overflow-hidden">
      {fallingElements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-pulse pointer-events-none"
          style={{
            left: `${element.x}%`,
            top: '-20px',
            animation: `fall 8s linear infinite`,
            animationDelay: `${element.delay}s`
          }}
        >
          {element.type === 'petal' ? (
            <div className="w-4 h-4 bg-pink-300 rounded-full opacity-70 transform rotate-45"></div>
          ) : (
            <div className="w-5 h-5 text-red-400 opacity-80">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          )}
        </div>
      ))}

      <div ref={containerRef} className="h-full overflow-y-auto snap-y snap-mandatory">
        {pages.map((pageLines, idx) => (
          <div
            key={idx}
            data-index={idx}
            ref={(el) => (sectionRefs.current[idx] = el)}
            className="h-screen snap-start"
          >
            <div className="max-w-4xl mx-auto p-8 h-full">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 h-full rounded-lg shadow-2xl border border-pink-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-pink-100 to-transparent transform rotate-45 scale-150"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-100 to-transparent transform -rotate-45 scale-150"></div>
                </div>
                <div className="absolute top-4 left-4 right-4 h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 rounded-full opacity-60"></div>
                <div className="absolute bottom-4 left-4 right-4 h-1 bg-gradient-to-r from-pink-300 via-rose-300 to-pink-300 rounded-full opacity-60"></div>
                <div className="absolute top-4 bottom-4 left-4 w-1 bg-gradient-to-b from-pink-300 via-rose-300 to-pink-300 rounded-full opacity-60"></div>
                <div className="absolute top-4 bottom-4 right-4 w-1 bg-gradient-to-b from-pink-300 via-rose-300 to-pink-300 rounded-full opacity-60"></div>

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
                  {idx === 0 && (
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 mx-auto mb-4 text-pink-400">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <h1 className="text-3xl md:text-4xl font-serif text-pink-800 mb-2">一封情书</h1>
                      <p className="text-pink-600 font-medium">To 宋青春</p>
                    </div>
                  )}

                  <div className="space-y-4 max-w-2xl mx-auto">
                    {pageLines.map((line, lineIdx) => (
                      <div
                        key={lineIdx}
                        className={`transition-all duration-1000 transform ${
                          visibleCounts[idx] > lineIdx
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <p className="text-pink-900 text-lg md:text-xl leading-relaxed font-serif text-center">
                          {line}
                        </p>
                      </div>
                    ))}
                  </div>

                  {idx < pages.length - 1 && visibleCounts[idx] >= pageLines.length && (
                    <button
                      aria-label="下一屏"
                      onClick={nextPage}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/60 backdrop-blur border border-pink-200 shadow-sm flex items-center justify-center text-pink-600 hover:bg-white/80 transition-colors animate-bounce"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                        <path d="M12 16l-6-6h12l-6 6z" />
                      </svg>
                    </button>
                  )}
                  {idx === pages.length - 1 && (
                    <div className="text-center mt-12">
                      <div className="w-12 h-12 mx-auto text-pink-400 opacity-80">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </div>
                      <p className="text-pink-600 text-sm mt-2">永远爱你的宇哥</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
