import StyleDictionary from 'style-dictionary'

StyleDictionary.registerFormat({
  name: 'custom/tailwind-preset',
  format: ({ dictionary }) => {
    const colors = {}

    dictionary.allTokens.forEach((token) => {
      const [, group, shade] = token.path
      if (!group || !shade) return
      if (!colors[group]) colors[group] = {}
      colors[group][shade] = `var(--tg-color-${group}-${shade})`
    })

    const preset = { theme: { extend: { colors } } }
    return `/** Auto-generated — run npm run sync to update */\nexport default ${JSON.stringify(preset, null, 2)}\n`
  },
})

StyleDictionary.registerFormat({
  name: 'custom/js-tokens',
  format: ({ dictionary }) => {
    const colors = {}

    dictionary.allTokens.forEach((token) => {
      const [, group, shade] = token.path
      if (!group || !shade) return
      if (!colors[group]) colors[group] = {}
      colors[group][shade] = token.value
    })

    return `/** Auto-generated — run npm run sync to update */\nexport const colors = ${JSON.stringify(colors, null, 2)}\n`
  },
})

StyleDictionary.registerTransform({
  name: 'color/hex',
  type: 'value',
  filter: (token) => token.$type === 'color' || token.type === 'color',
  transform: (token) => token.value,
})

export default {
  source: ['tokens/figma-tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'tg',
      buildPath: 'tokens/generated/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: false,
          },
        },
      ],
    },
    tailwind: {
      transformGroup: 'js',
      buildPath: 'tokens/generated/',
      files: [
        {
          destination: 'tailwind-preset.js',
          format: 'custom/tailwind-preset',
          filter: (token) => token.path[0] === 'color',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'tokens/generated/',
      files: [
        {
          destination: 'tokens.js',
          format: 'custom/js-tokens',
          filter: (token) => token.path[0] === 'color',
        },
      ],
    },
  },
}
