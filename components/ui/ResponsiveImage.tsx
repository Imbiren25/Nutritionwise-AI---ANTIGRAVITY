import React from 'react'

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  sources?: Array<{ srcset: string; type?: string; media?: string }>
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ sources, alt = '', ...imgProps }) => {
  if (sources && sources.length) {
    return (
      <picture>
        {sources.map((s, i) => (
          <source key={i} srcSet={s.srcset} type={s.type} media={s.media} />
        ))}
        <img alt={alt} loading={imgProps.loading || 'lazy'} {...imgProps} />
      </picture>
    )
  }
  return <img alt={alt} loading={imgProps.loading || 'lazy'} {...imgProps} />
}

export default ResponsiveImage

