import { useEffect, useRef } from 'react';

/**
 * Добавляет класс .is-visible элементу, когда он появляется во вьюпорте.
 * Используется вместе с классом .reveal из index.css.
 * Отслеживает и элементы, появившиеся позже (например, после загрузки данных с сервера).
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const supportsObserver = typeof IntersectionObserver !== 'undefined';
    let observer: IntersectionObserver | null = null;

    if (supportsObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -60px 0px' },
      );
    }

    const reveal = (el: HTMLElement) => {
      if (el.classList.contains('is-visible')) return;
      if (observer) {
        observer.observe(el);
      } else {
        el.classList.add('is-visible');
      }
    };

    const scan = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>('.reveal').forEach(reveal);
    };

    if (node.classList.contains('reveal')) reveal(node);
    scan(node);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((added) => {
          if (!(added instanceof HTMLElement)) return;
          if (added.classList.contains('reveal')) reveal(added);
          scan(added);
        });
      });
    });
    mutationObserver.observe(node, { childList: true, subtree: true });

    // страховка: если наблюдатель по какой-то причине не сработал
    const fallback = window.setInterval(() => {
      node.querySelectorAll<HTMLElement>('.reveal:not(.is-visible)').forEach((el) => {
        el.classList.add('is-visible');
      });
    }, 4000);

    return () => {
      window.clearInterval(fallback);
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, []);

  return ref;
}

export default useReveal;
