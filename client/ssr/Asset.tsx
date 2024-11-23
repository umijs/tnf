import React from 'react';
import type { RouterManagedTag } from '@tanstack/react-router';

export function Asset({ tag, attrs, children }: RouterManagedTag) {
  switch (tag) {
    case 'title':
      return (
        <title {...attrs} suppressHydrationWarning>
          {children}
        </title>
      );
    case 'meta':
      return <meta {...attrs} suppressHydrationWarning />;
    case 'link':
      return <link {...attrs} suppressHydrationWarning />;
    case 'style':
      return (
        <style
          {...attrs}
          dangerouslySetInnerHTML={{ __html: children || '' }}
        />
      );
    case 'script':
      if (attrs && attrs.src) {
        return <script {...attrs} suppressHydrationWarning />;
      }
      if (typeof children === 'string')
        return (
          <script
            {...attrs}
            dangerouslySetInnerHTML={{
              __html: children,
            }}
            suppressHydrationWarning
          />
        );
      return null;
    default:
      return null;
  }
}
