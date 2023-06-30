import { Cantarell, Roboto_Slab } from 'next/font/google'
import localFont from 'next/font/local'

export const museo = localFont({
  variable: '--font-museo',
  src: [
    {
      path: '../assets/Museo500-Regular.woff',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../assets/Museo700-Regular.woff',
      weight: '700',
      style: 'bold'
    }
  ]
})

export const icomoon = localFont({
  variable: '--font-icomoon',
  src: [
    {
      path: '../assets/icomoon.woff',
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
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-slab'
})
