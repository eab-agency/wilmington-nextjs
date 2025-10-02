import { Cantarell, Roboto_Slab } from 'next/font/google'
import localFont from 'next/font/local'

export const museo = localFont({
  variable: '--font-museo',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
  src: [
    {
      path: '../public/assets/Museo500-Regular.woff2',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../public/assets/Museo700-Regular.woff2',
      weight: '700',
      style: 'normal'
    }
  ]
})

export const icomoon = localFont({
  variable: '--font-icomoon',
  preload: true,
  src: [
    {
      path: '../public/assets/icomoon.woff',
      weight: 'normal'
    }
  ]
})

export const cantarell = Cantarell({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cantarell'
})

export const robotoSlab = Roboto_Slab({
  weight: 'variable',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-slab',
  adjustFontFallback: true
})
