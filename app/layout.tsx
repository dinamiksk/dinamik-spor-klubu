import type { Metadata } from 'next';
import { Anton, Barlow_Condensed } from 'next/font/google';
import './globals.css';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dinamik Spor Kulübü | İman. Disiplin. Spor.',
  description: 'Antalya merkezli, değerler odaklı spor kulübümüz. Bilek güreşi, dalgıçlık, kamp ve ENP faaliyetleriyle gençleri güçlü bireyler olarak yetiştiriyoruz.',
  keywords: 'spor kulübü, antalya, bilek güreşi, dalgıçlık, izcilik, ENP, gençlik',
  openGraph: {
    title: 'Dinamik Spor Kulübü | İman. Disiplin. Spor.',
    description: 'Antalya merkezli değerler odaklı spor kulübümüz.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${anton.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  );
}
