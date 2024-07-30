import type { Config } from 'tailwindcss';

export default {
  darkMode: 'selector',

  content: ['./src/**/*.{vue,html}'],
  theme: {
    fontFamily: {
      xht: ['xht'],
    },
    extend: {
      colors: {
        bg_color: 'var(--el-bg-color)',
        primary: 'var(--el-color-primary)',
        text_color_primary: 'var(--el-text-color-primary)',
        text_color_regular: 'var(--el-text-color-regular)',
      },
      fontSize: {
        sm: '.75rem',
        md: '.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
    },
  },
} satisfies Config;
