import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  {
    number: "01",
    title: "The Origin",
    lines: ["Rare oud wood, aged for years", "in the quiet of the dark."],
    tone: "#24180f",
  },
  {
    number: "02",
    title: "The Blend",
    lines: ["Saffron, amber and rose,", "layered drop by drop."],
    tone: "#38220e",
  },
  {
    number: "03",
    title: "The Opening",
    lines: ["The cap lifts. One spray.", "And the story begins."],
    tone: "#49300e",
  },
  {
    number: "04",
    title: "The Signature",
    lines: ["A scent that stays on the skin", "long after the night is gone."],
    tone: "#17110c",
  },
];

export default function ScrollStory() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const video = videoRef.current;
    const mobileVideo = mobileVideoRef.current;
    if (!section || !image || !video || !mobileVideo) return undefined;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      const chapterElements = gsap.utils.toArray(".making-story-chapter");
      const progressFill = section.querySelector(".making-story-progress-fill");
      const dots = gsap.utils.toArray(".making-story-dot");

      const resetVideo = () => {
        video.pause();
        video.currentTime = 0;
      };
      const playMobileVideo = () => {
        const playback = mobileVideo.play();
        if (playback) playback.catch(() => {});
      };
      gsap.set(image, { autoAlpha: 1 });
      gsap.set(video, { autoAlpha: 0 });

      media.add(
        {
          desktop: "(min-width: 769px)",
          mobile: "(max-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduceMotion } = context.conditions;

          if (reduceMotion) {
            section.classList.add("is-flow");
            gsap.set(chapterElements, { autoAlpha: 1, y: 0 });
            gsap.fromTo(
              chapterElements,
              { opacity: 0.65 },
              {
                opacity: 1,
                stagger: 0.08,
                duration: 0.6,
                scrollTrigger: {
                  trigger: section,
                  start: "top 75%",
                  toggleActions: "play none none reverse",
                },
              }
            );
            if (mobile) {
              const mobileVideoTrigger = ScrollTrigger.create({
                trigger: mobileVideo,
                start: "top 85%",
                end: "bottom 15%",
                onToggle: (self) => {
                  if (self.isActive) playMobileVideo();
                  else mobileVideo.pause();
                },
              });
              return () => {
                mobileVideoTrigger.kill();
                mobileVideo.pause();
                section.classList.remove("is-flow");
              };
            }
            return () => section.classList.remove("is-flow");
          }

          if (mobile) {
            section.classList.add("is-flow", "is-mobile");
            gsap.set([image, video], { autoAlpha: 1 });
            gsap.set(video, { autoAlpha: 0 });
            mobileVideo.pause();

            chapterElements.forEach((chapter) => {
              gsap.fromTo(
                chapter,
                { autoAlpha: 0, y: 40 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: chapter,
                    start: "top 82%",
                    toggleActions: "play none none reverse",
                  },
                }
              );
            });
            const mobileVideoTrigger = ScrollTrigger.create({
              trigger: mobileVideo,
              start: "top 85%",
              end: "bottom 15%",
              onToggle: (self) => {
                if (self.isActive) playMobileVideo();
                else mobileVideo.pause();
              },
            });
            return () => {
              mobileVideoTrigger.kill();
              mobileVideo.pause();
              section.classList.remove("is-flow", "is-mobile");
              resetVideo();
            };
          }

          if (desktop) {
            section.classList.add("is-desktop");
            gsap.set(chapterElements, { autoAlpha: 0, y: 40 });
            gsap.set(chapterElements[0], { autoAlpha: 1, y: 0 });
            gsap.set(image, { autoAlpha: 1, immediateRender: true });
            gsap.set(video, { autoAlpha: 0, immediateRender: true });
            gsap.set(progressFill, { scaleY: 0, transformOrigin: "top center", immediateRender: true });
            gsap.set(dots, { backgroundColor: "rgba(201, 162, 74, 0.25)", immediateRender: true });
            gsap.set(dots[0], { backgroundColor: "#c9a24a", immediateRender: true });

            let activeIndex = -1;
            const goTo = (index) => {
              if (index === activeIndex) return;
              activeIndex = index;

              chapterElements.forEach((chapter, chapterIndex) => {
                const isActive = chapterIndex === index;
                gsap.to(chapter, {
                  autoAlpha: isActive ? 1 : 0,
                  y: isActive ? 0 : chapterIndex < index ? -40 : 40,
                  duration: 0.5,
                  ease: "power2.out",
                  overwrite: "auto",
                });
                gsap.to(dots[chapterIndex], {
                  backgroundColor: isActive ? "#c9a24a" : "rgba(201, 162, 74, 0.25)",
                  duration: 0.3,
                  overwrite: "auto",
                });
              });

              gsap.to(progressFill, {
                scaleY: (index + 1) / chapterElements.length,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });
              gsap.to(section, {
                "--story-tone": chapters[index].tone,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
              });

              const showVideo = index === 2;
              if (showVideo) {
                video.pause();
                video.currentTime = 0;
                const playback = video.play();
                if (playback) playback.catch(() => {});
              } else {
                resetVideo();
              }
              gsap.to(image, { autoAlpha: showVideo ? 0 : 1, duration: 0.5, overwrite: "auto" });
              gsap.to(video, { autoAlpha: showVideo ? 1 : 0, duration: 0.5, overwrite: "auto" });
            };

            goTo(0);
            ScrollTrigger.create({
              trigger: section,
              start: "top top",
              end: "+=400%",
              pin: true,
              anticipatePin: 1,
              onUpdate: (self) => {
                const index = Math.min(3, Math.floor(self.progress * 4));
                goTo(index);
              },
              onLeaveBack: () => goTo(0),
              onLeave: () => goTo(3),
            });

            gsap.fromTo(
              [image, video],
              { yPercent: -4, scale: 1.04 },
              {
                yPercent: 4,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "+=400%",
                  scrub: 1,
                },
              }
            );

            return () => {
              section.classList.remove("is-desktop");
              resetVideo();
            };
          }
          return undefined;
        }
      );

      return () => {
        media.revert();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="making-story" ref={sectionRef} aria-label="The Making of Aurelle">
      <div className="making-story-inner">
        <div className="making-story-image-column">
          <p className="eyebrow making-story-kicker">The Making of Aurelle</p>
          <div className="making-story-image-frame">
            <img
              ref={imageRef}
              className="making-story-image"
              src="/products/p1.jpg"
              alt="Midnight Oud perfume bottle"
              onLoad={() => ScrollTrigger.refresh()}
            />
            <video
              ref={videoRef}
              className="making-story-video"
              src="/videos/midnight-oud.mp4"
              muted
              playsInline
              preload="auto"
              aria-label="Midnight Oud cap opening and perfume spray"
              onLoadedMetadata={() => ScrollTrigger.refresh()}
            />
            <div className="making-story-image-shade" />
          </div>
        </div>

        <div className="making-story-copy-column">
          <div className="making-story-chapters">
            {chapters.map((chapter, index) => (
              <article className="making-story-chapter" key={chapter.number}>
                <span className="making-story-number">{chapter.number}</span>
                <div className="making-story-heading-mask">
                  <h2 className="making-story-heading">
                    {chapter.title.split(" ").map((word) => (
                      <span className="making-story-heading-word-mask" key={word}>
                        <span className="making-story-heading-line">{word}</span>
                      </span>
                    ))}
                  </h2>
                </div>
                <p>{chapter.lines[0]}<br />{chapter.lines[1]}</p>
                {index === 2 && (
                  <video
                    ref={mobileVideoRef}
                    className="making-story-mobile-video"
                    src="/videos/midnight-oud.mp4"
                    muted
                    playsInline
                    loop
                    preload="metadata"
                    aria-label="Midnight Oud cap opening and perfume spray"
                    onLoadedMetadata={() => ScrollTrigger.refresh()}
                  />
                )}
                {index === 3 && (
                  <Link to="/shop" className="btn making-story-cta">Explore the collection</Link>
                )}
              </article>
            ))}
          </div>
        </div>

        <div className="making-story-progress" aria-hidden="true">
          <span className="making-story-progress-track" />
          <span className="making-story-progress-fill" />
          {chapters.map((chapter) => (
            <span className="making-story-dot" key={chapter.number} />
          ))}
        </div>
      </div>
    </section>
  );
}
