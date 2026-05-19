"use client";

import { useEffect } from "react";

export function SiteInteractions() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const cursorRing = document.getElementById("cursorRing");
    const navbar = document.getElementById("navbar");
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationFrame = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (cursor) {
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
      }
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      animationFrame = requestAnimationFrame(animateRing);
    };

    const onScroll = () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 60);
      const hero = document.getElementById("hero");
      const heroLeft = document.querySelector<HTMLElement>(".hero-left");
      if (!hero || !heroLeft || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        heroLeft.style.transform = "";
        return;
      }
      const scrolledPast = Math.max(0, -rect.top);
      heroLeft.style.transform = `translate3d(0, ${Math.min(320, scrolledPast * 0.72)}px, 0)`;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    animateRing();
    onScroll();

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
