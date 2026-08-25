import { useEffect, useRef, useState } from 'react';

/**
 * Adia a montagem de um filho pesado (ex.: um mapa Leaflet) até o elemento
 * ficar perto de entrar na viewport. Sem isso, várias instâncias pesadas
 * montando de uma vez (ex.: um mapa por card numa listagem) bloqueiam a
 * primeira pintura da página — inclusive "engolindo" a animação de entrada
 * da tela, que corre contra o relógio e não contra o trabalho do JS.
 */
export function useLazyMount<T extends HTMLElement>(rootMargin = '200px') {
  const ref = useRef<T>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shouldMount) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, shouldMount]);

  return [ref, shouldMount] as const;
}
