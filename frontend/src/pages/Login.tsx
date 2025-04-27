import { useContext, useEffect, useState } from "react"
import { FormMessage, LoginFormData } from "../types"
import login from "../lib/api/login"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"

function validateLoginForm(data: LoginFormData): boolean {
  return data.email.length > 0 && data.password.length > 0
}

export default function Login() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  // Navigate to home is already logged in
  useEffect(() => {
    if (authContext.isAuthenticated) navigate("/")
  })

  const [data, setData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [formMessage, setFormMessage] = useState<FormMessage>({
    show: false,
    success: true,
    message: "",
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO validate form better
    if (!validateLoginForm(data)) {
      setFormMessage({
        show: true,
        success: false,
        message: "Form Validation Error",
      })
      return
    }

    const response = await login(data)

    if (!response.success) {
      setFormMessage({
        show: true,
        success: false,
        message: response.error,
      })
      return
    }

    setFormMessage({
      show: true,
      success: true,
      message: "Logging in...",
    })

    authContext.setAuthenticated(response.data)
    navigate("/")
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <main id="login">
      <h1>Login</h1>
      <div className="container primary">
        {formMessage.show ? (
          <div className="container secondary">
            <p
              className={formMessage.success ? "" : "color-red"}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {formMessage.message}
            </p>
          </div>
        ) : (
          <></>
        )}
        <form
          onSubmit={onSubmit}
          // Prevent sending the form by pressing enter
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault()
          }}
        >
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="register-email"
            autoComplete="email"
            value={data.email}
            onChange={onChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="register-password"
            autoComplete="password"
            value={data.password}
            onChange={onChange}
          />

          <input type="submit" value="Login" />
        </form>
      </div>
    </main>
  )
}
