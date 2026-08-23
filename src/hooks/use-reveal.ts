import { useEffect, useRef } from 'react';

/**
 * Добавляет класс .is-visible элементу, когда он появляется во вьюпорте.
 * Используется вместе с классом .reveal из index.css
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const targets = Array.from(node.querySelectorAll<HTMLElement>('.reveal'));
    if (node.classList.contains('reveal')) targets.push(node);
    if (!targets.length) return;

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' },
    );

    targets.forEach((el) => observer.observe(el));

    // страховка: если наблюдатель по какой-то причине не сработал
    const fallback = window.setTimeout(() => {
      targets.forEach((el) => el.classList.add('is-visible'));
    }, 4000);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return ref;
}

export default useReveal;