import React from 'react'

/**
 * Sovereign Image Component
 * All Cloudinary dependencies have been removed. 
 * Images are served directly from local assets or the S3 Proxy.
 */

export const getCldImageUrl = (options) => {
    return typeof options === 'string' ? options : options.src;
}

export default function OptimizedImage({ src, alt, width, height, className, style, ...props }) {
    if (!src) return null

    return (
        <img 
            src={src} 
            alt={alt || ''} 
            className={className} 
            width={width}
            height={height}
            style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                ...style
            }} 
            {...props} 
        />
    )
}
