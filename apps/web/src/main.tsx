import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import "@workspace/ui/globals.css"
import { router } from "./router.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { MorphingCursor } from "@workspace/ui/components/morphing-cursor"
import { ParticleClickEffect } from "@workspace/ui/components/particle-click-effect"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <MorphingCursor />
        <ParticleClickEffect />
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
)
