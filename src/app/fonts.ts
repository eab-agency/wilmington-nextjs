import { Cantarell, Roboto_Slab } from 'next/font/google'

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
