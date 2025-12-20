/**
 * @license BSD-3-Clause
 * Copyright (c) 2025, ッツ Reader Authors
 * All rights reserved.
 */

export interface ColorObject {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface ThemeOption {
  fontColor: string;
  backgroundColor: string;
  selectionFontColor: string;
  selectionBackgroundColor: string;
  hintFuriganaShadowColor: string;
  hintFuriganaFontColor: string;
  tooltipTextFontColor: string;
}

export interface CustomThemeValue {
  hexExpression: string;
  alphaValue: number;
  rgbaExpression: string;
}

function updateHintFuriganaFontColor(theme: Record<keyof ThemeOption, ColorObject>) {
  return {
    ...theme,
    hintFuriganaFontColor: {
      ...theme.fontColor,
      a: theme.fontColor.a ? theme.fontColor.a * 0.38 : 0.38
    }
  };
}

const lightTheme = updateHintFuriganaFontColor({
  fontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xd9,
    a: 1
  },
  backgroundColor: {
    r: 0x06,
    g: 0x08,
    b: 0x0f,
    a: 0.5
  },
  selectionFontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xd9
  },
  selectionBackgroundColor: {
    r: 0x26,
    g: 0x33,
    b: 0x56
  },
  hintFuriganaFontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xd9
  },
  hintFuriganaShadowColor: {
    r: 0x4b,
    g: 0x2d,
    b: 0x5e,
    a: 0.5
  },
  tooltipTextFontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xf9,
    a: 0.9
  }
});

const darkTheme = updateHintFuriganaFontColor({
  fontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xd9,
    a: 1
  },
  backgroundColor: {
    r: 0x06,
    g: 0x08,
    b: 0x0f,
    a: 0.5
  },
  selectionFontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xd9
  },
  selectionBackgroundColor: {
    r: 0x26,
    g: 0x33,
    b: 0x56
  },
  hintFuriganaFontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xd9
  },
  hintFuriganaShadowColor: {
    r: 0x4b,
    g: 0x2d,
    b: 0x5e,
    a: 0.5
  },
  tooltipTextFontColor: {
    r: 0xc9,
    g: 0xd1,
    b: 0xf9,
    a: 0.9
  }
});

function themeObjValueToStringValue<T extends string>(objValue: Record<T, ColorObject>) {
  return Object.entries(objValue).reduce<Record<T, string>>((acc, [key, value]) => {
    const obj = value as ColorObject;
    const alpha = obj.a ?? 1;
    acc[key as T] = alpha === 0 ? 'transparent' : `rgba(${obj.r}, ${obj.g}, ${obj.b}, ${alpha})`;
    return acc;
  }, {} as any);
}

const availableThemesCamelCase = {
  lightTheme,
  ecruTheme: {
    ...lightTheme,
    backgroundColor: {
      r: 0x06,
      g: 0x08,
      b: 0x0f,
      a: 0.5
    }
  },
  waterTheme: {
    ...lightTheme,
    backgroundColor: {
      r: 0x06,
      g: 0x08,
      b: 0x0f,
      a: 0.5
    }
  },
  /**
   * Called gray theme for legacy reasons
   */
  grayTheme: darkTheme,
  /**
   * Called dark theme for legacy reasons
   */
  darkTheme: {
    ...darkTheme,
    fontColor: {
      r: 0xc9,
      g: 0xd1,
      b: 0xf9,
      a: 0.9
    },
    backgroundColor: {
      r: 0x06,
      g: 0x08,
      b: 0x0f,
      a: 0.5
    }
  },
  blackTheme: {
    ...darkTheme,
    backgroundColor: {
      r: 0x06,
      g: 0x08,
      b: 0x0f,
      a: 0.4
    }
  }
};

function camelCaseToKebabCase(s: string) {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

export const availableThemes = new Map(
  Object.entries(availableThemesCamelCase).map(([key, value]) => [
    camelCaseToKebabCase(key),
    themeObjValueToStringValue(value)
  ])
);
