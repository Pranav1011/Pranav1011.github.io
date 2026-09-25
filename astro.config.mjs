// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';

// Content files carry `<!-- src: … -->` source notes for internal review.
// They name local files and must never reach the published HTML.
/** @type {import('satteri').MdastPluginDefinition} */
const stripComments = {
  name: 'strip-html-comments',
  html(node, ctx) {
    if (/^\s*<!--[\s\S]*-->\s*$/.test(node.value)) ctx.removeNode(node);
  },
};

export default defineConfig({
  site: 'https://pranav1011.github.io',
  integrations: [mdx(), sitemap({ filter: (page) => !page.includes('/og-card') })],
  markdown: {
    processor: satteri({ mdastPlugins: [stripComments] }),
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Schibsted Grotesk',
      cssVariable: '--font-sans',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // Case-study prose only: loaded by WorkLayout, never on the home page.
      provider: fontProviders.fontsource(),
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      weights: [400, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      // Figure axes, trace labels and code only.
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
