// src/app/main/dashboard/training/components/ui/toaster.jsx
import * as React from "react"
import { Toast } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <Toast.ToastProvider>
      {toasts.map(({ id, title, description, action, ...props }) => {
        return (
          <Toast key={id}>
            <div className="grid gap-1">
              {title && <Toast.ToastTitle>{title}</Toast.ToastTitle>}
              {description && (
                <Toast.ToastDescription>{description}</Toast.ToastDescription>
              )}
            </div>
            {action}
            <Toast.ToastClose />
          </Toast>
        )
      })}
      <Toast.ToastViewport />
    </Toast.ToastProvider>
  )
}
