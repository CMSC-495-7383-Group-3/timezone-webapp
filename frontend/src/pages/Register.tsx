import { useContext, useEffect, useState } from "react"
import { FormMessage, RegisterFormData } from "../types"
import register from "../lib/api/register"
import login from "../lib/api/login"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import "./LoginRegister.scss"

function validateRegisterForm(data: RegisterFormData): boolean {
  return (
    data.email.length > 0 &&
    data.username.length > 0 &&
    data.password.length > 0 &&
    data.first_name.length > 0 &&
    data.last_name.length > 0 &&
    data.timezone.length > 0
  )
}

export default function Register() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  // Navigate to home is already logged in
  useEffect(() => {
    if (authContext.isAuthenticated) navigate("/")
  })

  const [data, setData] = useState<RegisterFormData>({
    email: "",
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    timezone: "",
  })

  const [formMessage, setFormMessage] = useState<FormMessage>({
    show: false,
    success: true,
    message: "",
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO validate form better
    if (!validateRegisterForm(data)) {
      setFormMessage({
        show: true,
        success: false,
        message: "Form Validation Error",
      })
      return
    }

    const response = await register(data)

    if (!response.success) {
      setFormMessage({
        show: true,
        success: false,
        message: response.errors.join("\n"),
      })
      return
    }

    setFormMessage({
      show: true,
      success: true,
      message: `Successfully registered user "${data.username}".`,
    })

    // Log user in
    const loginResponse = await login({
      email: data.email,
      password: data.password,
    })

    if (!loginResponse.success) {
      setFormMessage({
        show: true,
        success: false,
        message: loginResponse.error,
      })
      return
    }

    authContext.setAuthenticated(response.data)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    navigate("/")
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <main id="register">
      <h1>Register</h1>
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="register-username"
            autoComplete="username"
            value={data.username}
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
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            name="first_name"
            id="register-first_name"
            autoComplete="given-name"
            value={data.first_name}
            onChange={onChange}
          />
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            name="last_name"
            id="register-last_name"
            autoComplete="family-name"
            value={data.last_name}
            onChange={onChange}
          />
          <label htmlFor="timezone">Timezone</label>
          <input
            type="text"
            name="timezone"
            id="register-timezone"
            value={data.timezone}
            onChange={onChange}
          />
          <input type="submit" value="Register" />
        </form>
      </div>
    </main>
  )
}
