import images from '../data/imageVariants.json';

export default function SiteImage({ src, alt, priority = false, sizes = '(max-width: 640px) 100vw, 50vw', ...props }) {
  const image = images[src];
  return <img src={image?.src || src} srcSet={image?.srcSet} sizes={image ? sizes : undefined}
    width={image?.width} height={image?.height} alt={alt}
    loading={priority || !image ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" {...props} />;
}
