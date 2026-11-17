/* eslint-disable @next/next/no-img-element */
/**
 * Slot artwork. Catalogue art comes through /api/art (the sister site's files
 * cannot be hotlinked); a title with no art gets a typographic tile instead.
 * Plain <img>: the proxy already caches and sizes it.
 */
export function SlotArt({ src, name, className = "", width }: { src: string | null; name: string; className?: string; width?: 128 | 640 }) {
  if (!src)
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-surface-raised to-page p-3 text-center ${className}`}>
        <span className="ccs-display text-sm text-text-secondary">{name}</span>
      </div>
    );
  const url = width && src.startsWith("/api/art/") ? `${src}?w=${width}` : src;
  return <img src={url} alt={name} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
}
