'use client'

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once we're on the client side
  const [styledComponentsStyleSheet] = useState(() => {
    if (typeof window === 'undefined') {
      return new ServerStyleSheet()
    }
    return null
  })

  useServerInsertedHTML(() => {
    if (styledComponentsStyleSheet) {
      const styles = styledComponentsStyleSheet.getStyleElement()
      styledComponentsStyleSheet.instance.clearTag()
      return <>{styles}</>
    }
    return null
  })

  if (typeof window !== 'undefined') {
    return <>{children}</>
  }

  if (!styledComponentsStyleSheet) {
    return <>{children}</>
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  )
}
