'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type User = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  created_at: string
}

export type Order = {
  id: string
  items: Array<{
    title: string
    variant: string
    quantity: number
    price: number
    thumbnail: string | null
  }>
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: {
    name: string
    address: string
    city: string
    province: string
    phone: string
  }
  shipping_method: string
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered'
  created_at: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  orders: Order[]
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (data: RegisterData) => { success: boolean; error?: string }
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  addOrder: (order: Omit<Order, 'id' | 'created_at'>) => string
}

type RegisterData = {
  first_name: string
  last_name: string
  email: string
  phone: string
  password: string
}

type StoredUser = User & { password: string }

const AuthContext = createContext<AuthContextType | null>(null)

const USERS_KEY = 'draven_users'
const SESSION_KEY = 'draven_session'
const ORDERS_KEY = 'draven_orders'

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_KEY)
}

function getStoredOrders(userId: string): Order[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${ORDERS_KEY}_${userId}`)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveOrders(userId: string, orders: Order[]) {
  localStorage.setItem(`${ORDERS_KEY}_${userId}`, JSON.stringify(orders))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionEmail = getSession()
    if (sessionEmail) {
      const users = getStoredUsers()
      const found = users.find((u) => u.email === sessionEmail)
      if (found) {
        const { password: _, ...userData } = found
        setUser(userData)
        setOrders(getStoredOrders(found.id))
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const users = getStoredUsers()
    const found = users.find((u) => u.email === email)

    if (!found) {
      return { success: false, error: 'Account not found' }
    }
    if (found.password !== password) {
      return { success: false, error: 'Incorrect password' }
    }

    const { password: _, ...userData } = found
    setUser(userData)
    setOrders(getStoredOrders(found.id))
    localStorage.setItem(SESSION_KEY, email)
    return { success: true }
  }, [])

  const register = useCallback((data: RegisterData) => {
    const users = getStoredUsers()

    if (users.find((u) => u.email === data.email)) {
      return { success: false, error: 'Email already registered' }
    }

    const newUser: StoredUser = {
      id: `usr_${Date.now()}`,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      created_at: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    const { password: _, ...userData } = newUser
    setUser(userData)
    setOrders([])
    localStorage.setItem(SESSION_KEY, data.email)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setOrders([])
    localStorage.removeItem(SESSION_KEY)
  }, [])

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...data }
      const users = getStoredUsers()
      const idx = users.findIndex((u) => u.id === prev.id)
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data }
        saveUsers(users)
      }
      return updated
    })
  }, [])

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'created_at'>) => {
    const orderId = `DRV-${Date.now()}`
    const order: Order = {
      ...orderData,
      id: orderId,
      created_at: new Date().toISOString(),
    }

    setOrders((prev) => {
      const updated = [order, ...prev]
      if (user) saveOrders(user.id, updated)
      return updated
    })

    return orderId
  }, [user])

  const value = useMemo(
    () => ({ user, loading, orders, login, register, logout, updateProfile, addOrder }),
    [user, loading, orders, login, register, logout, updateProfile, addOrder],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
