import axios from "axios"

function changeSection() {
  return {
    change_section: "signup",
    email: "",
    nickname: "",
    password: "",

    async doLogin() {
      const { email, password } = this

      if (email != "" && password != "") {
        // API
        const userData = {
          user: {
            email,
            password,
          },
        }

        try {
          const resp = await axios.post("https://todoo.5xcamp.us/users/sign_in", userData)
          const token = resp.headers.authorization

          if (token) {
            localStorage.setItem("todoToken", token)
          }
          this.resetForm()
          this.gotoTask()
        } catch (err) {
          console.log(err)
        }
      }
    },

    async doSignUp() {
      const { email, nickname, password } = this

      if (email != "" && nickname != "" && password != "") {
        const userData = {
          user: {
            email,
            nickname,
            password,
          },
        }

        try {
          await axios.post("https://todoo.5xcamp.us/users", userData)
          this.resetForm()
          this.gotoLogin()
        } catch (err) {
          alert(err.response.data.message)
        }
      }
    },

    resetForm() {
      this.email = ""
      this.password = ""
      this.nickname = ""
    },

    gotoLogin() {
      this.change_section = "login"
    },
    gotoSignUp() {
      this.change_section = "signup"
    },
    gotoTask() {
      this.change_section = "task"
    },
    showLogin() {
      return this.change_section == "login"
    },
    showSignUp() {
      return this.change_section == "signup"
    },
    showTask() {
      return this.change_section == "task"
    },
  }
}

export { changeSection }
