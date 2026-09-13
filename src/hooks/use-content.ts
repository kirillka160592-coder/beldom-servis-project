import { useEffect, useState } from 'react';
import { contentApi } from '@/lib/api';

const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function notify(section: string) {
  listeners.get(section)?.forEach((fn) => fn());
}

export function useContentBlock<T>(section: string, fallback: T) {
  const [data, setData] = useState<T>((cache.get(section) as T) ?? fallback);
  const [loading, setLoading] = useState(!cache.has(section));

  useEffect(() => {
    let mounted = true;

    const onUpdate = () => {
      if (mounted && cache.has(section)) {
        setData(cache.get(section) as T);
      }
    };

    if (!listeners.has(section)) listeners.set(section, new Set());
    listeners.get(section)!.add(onUpdate);

    if (!cache.has(section)) {
      contentApi
        .get(section)
        .then((res) => {
          const value = (res[section] as T) ?? fallback;
          cache.set(section, value);
          notify(section);
        })
        .catch(() => {
          // тихо оставляем значение по умолчанию
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
      listeners.get(section)?.delete(onUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  return { data, loading };
}
