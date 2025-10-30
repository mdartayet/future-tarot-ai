export interface ZodiacSign {
  name: string;
  symbol: string;
  dateRange: string;
  element: string;
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    dateRange: '21 Mar - 19 Abr',
    element: 'Fuego'
  },
  {
    name: 'Tauro',
    symbol: '♉',
    dateRange: '20 Abr - 20 May',
    element: 'Tierra'
  },
  {
    name: 'Géminis',
    symbol: '♊',
    dateRange: '21 May - 20 Jun',
    element: 'Aire'
  },
  {
    name: 'Cáncer',
    symbol: '♋',
    dateRange: '21 Jun - 22 Jul',
    element: 'Agua'
  },
  {
    name: 'Leo',
    symbol: '♌',
    dateRange: '23 Jul - 22 Ago',
    element: 'Fuego'
  },
  {
    name: 'Virgo',
    symbol: '♍',
    dateRange: '23 Ago - 22 Sep',
    element: 'Tierra'
  },
  {
    name: 'Libra',
    symbol: '♎',
    dateRange: '23 Sep - 22 Oct',
    element: 'Aire'
  },
  {
    name: 'Escorpio',
    symbol: '♏',
    dateRange: '23 Oct - 21 Nov',
    element: 'Agua'
  },
  {
    name: 'Sagitario',
    symbol: '♐',
    dateRange: '22 Nov - 21 Dic',
    element: 'Fuego'
  },
  {
    name: 'Capricornio',
    symbol: '♑',
    dateRange: '22 Dic - 19 Ene',
    element: 'Tierra'
  },
  {
    name: 'Acuario',
    symbol: '♒',
    dateRange: '20 Ene - 18 Feb',
    element: 'Aire'
  },
  {
    name: 'Piscis',
    symbol: '♓',
    dateRange: '19 Feb - 20 Mar',
    element: 'Agua'
  }
];