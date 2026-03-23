import { useState, useEffect } from "react"
import { Map, Lock, Eye, EyeOff } from "lucide-react"

const ADMIN_PASSWORD = "liquid4*"
const SESSION_KEY = "gtrace_admin_auth"

interface Props {
  children: React.ReactNode
}

export function AdminGate({ children }: Props) {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setAuthed(true)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true")
      setAuthed(true)
      setError("")
    } else {
      setError("Incorrect password. Access denied.")
      setShaking(true)
      setPassword("")
      setTimeout(() => setShaking(false), 600)
    }
  }

  if (authed) return <>{children}</>

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div
        className={`w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-lg p-8 transition-transform ${
          shaking ? "animate-[shake_0.4s_ease-in-out]" : ""
        }`}
        style={{
          animation: shaking ? "shake 0.4s ease-in-out" : undefined,
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-md shadow-primary/20">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-4 h-4 text-primary" />
            <span className="font-bold text-lg text-foreground">G Trace</span>
          </div>
          <p className="text-sm text-muted-foreground">Admin access only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError("")
                }}
                placeholder="Enter admin password"
                autoFocus
                className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 pt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all"
          >
            Unlock Admin Panel
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
