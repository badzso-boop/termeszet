/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Márka-paletta a névjegykártya vizuális terve alapján (taupe/greige alap,
        // fekete tipográfia, visszafogott pezsgőarany akcentus). `primary`/`secondary`
        // a meglévő komponensekben mindenhol ezeket a neveket használja, ezért a
        // tényleges brand-színeket ide, a régi (krém/korall) értékek helyére kötjük be
        // -- így a komponensek szerkezetét nem kell egyenként átírni.
        primary: '#D8D0C3', // ivory / light marble -- világos felület-alap
        secondary: '#A29C96', // taupe / greige -- fő vizuális alap (kártya, nav, section-hátterek)
        ink: '#11110F', // szinte fekete -- elsődleges szövegszín
        gold: '#C9B38A', // champagne gold -- csak akcentusként (vonal, hover, kiemelés)
        ivory: '#D8D0C3', // = primary, explicit néven is elérhető
        beige: '#BFAF94', // meleg beige-gold -- másodlagos akcentus/felület
        customGreen: {
          light: '#6EE7B7',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
      },
      fontFamily: {
        // Body/UI -- letisztult, jól olvasható sans-serif.
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Editorial/display -- címekhez, szekciófejlécekhez.
        display: ['"Cormorant Garamond"', 'serif'],
        // Brand/signature -- kizárólag a márka-aláírás jellegű elemekhez (pl. hero név),
        // NEM címekhez vagy hosszabb szövegekhez.
        script: ['Allura', 'cursive'],
      },
    },
  },
  plugins: [],
}
