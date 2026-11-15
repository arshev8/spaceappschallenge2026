import { useState, type CSSProperties } from 'react';
import { mediaUrl, nasaPage, type Media } from '../app/media';
import { KIND_KEY, useShell } from '../app/l10n';

type Props = {
  media: Media;
  className?: string;
  sizes?: string;
  /** Decorative use: empty alt, credit still shown unless `bare`. */
  decorative?: boolean;
  caption?: boolean;
  bare?: boolean;
  eager?: boolean;
  style?: CSSProperties;
};

/** Bundled NASA image with responsive sources, lazy loading, a credit line and a text fallback. */
export function NasaImage({ media: source, className = '', sizes = '(max-width: 760px) 100vw, 50vw', decorative, caption, bare, eager, style }: Props) {
  const [failed, setFailed] = useState(false);
  const { t, media: localize } = useShell();
  const media = localize(source);
  // Framing comes from the catalog: globes are never cropped, other photos crop around their subject.
  const framing: CSSProperties = media.fit === 'contain' ? { objectFit: 'contain', background: '#000' } : media.focus ? { objectPosition: media.focus } : {};
  const smWidth = Math.round(media.width * 640 / Math.max(media.width, media.height));
  const credit = <span className="media-credit">{t(KIND_KEY[media.kind])} · <a href={nasaPage(media)} target="_blank" rel="noreferrer">{media.credit}</a></span>;
  return <figure className={`nasa-image ${className}`} style={style}>
    {failed ? <div className="media-fallback" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : media.alt}><span>{media.caption}</span></div> :
      <img src={mediaUrl(media, 'lg')} srcSet={`${mediaUrl(media, 'sm')} ${smWidth}w, ${mediaUrl(media, 'lg')} ${media.width}w`} sizes={sizes}
        style={framing} width={media.width} height={media.height} alt={decorative ? '' : media.alt} loading={eager ? 'eager' : 'lazy'} decoding="async"
        onError={() => setFailed(true)} />}
    {!bare && (caption ? <figcaption>{media.caption} {credit}</figcaption> : <figcaption className="credit-only">{credit}</figcaption>)}
  </figure>;
}
