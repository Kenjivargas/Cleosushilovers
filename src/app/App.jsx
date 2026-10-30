import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PageSpinner } from '@/shared/components/ui'
import { isSupabaseConfigured } from '@/shared/lib/supabase'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { RequireAdmin } from '@/features/auth/components/RequireAdmin'
import { CartProvider } from '@/features/cart/components/CartProvider'
import { CartPage } from '@/features/cart/pages/CartPage'
import { CheckoutPage } from '@/features/checkout/pages/CheckoutPage'
import { OrderSlipPage } from '@/features/checkout/pages/OrderSlipPage'
import { MenuPage } from '@/features/menu/pages/MenuPage'
import { PublicLayout } from './layouts/PublicLayout'
import { NotFoundPage } from './NotFoundPage'
import { SetupNotice } from './SetupNotice'

// Admin screens are split into their own chunk; customers never download them.
const AdminLoginPage = lazy(() =>
  import('@/features/auth/pages/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })),
)
const AdminMenuPage = lazy(() =>
  import('@/features/admin/pages/AdminMenuPage').then((m) => ({ default: m.AdminMenuPage })),
)

export function App() {
  return (
    <ThemeProvider>
      {isSupabaseConfigured ? (
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={<PageSpinner />}>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route index element={<MenuPage />} />
                    <Route path="order" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="checkout/slip" element={<OrderSlipPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                  <Route path="admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="admin"
                    element={
                      <RequireAdmin>
                        <AdminMenuPage />
                      </RequireAdmin>
                    }
                  />
                </Routes>
              </Suspense>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      ) : (
        <SetupNotice />
      )}
    </ThemeProvider>
  )
}
