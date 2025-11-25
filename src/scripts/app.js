import axios from "axios"
import { debounce } from "throttle-debounce"

function changeSection() {
  return {
    change_section: "",
    email: "",
    nickname: "",
    password: "",
    isLogin: false,
    taskName: "",
    tasks: [],

    init() {
      const token = localStorage.getItem("todoToken")

      if (token) {
        this.isLogin = true

        // 抓 TODO
        this.getTasks()
      }

      if (this.isLogin) {
        this.gotoTask()
      } else {
        this.gotoSignUp()
      }
    },

    async getTasks() {
      const config = this.setConfig()
      const resp = await axios.get("https://todoo.5xcamp.us/todos", config)

      this.tasks = resp.data.todos
    },

    setConfig() {
      const token = localStorage.getItem("todoToken")
      const config = {
        headers: {
          Authorization: token,
        },
      }

      return config
    },

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
            this.isLogin = true
          }
          this.resetForm()
          this.gotoTask()

          // 取得 tasks
          this.getTasks()
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

    toggleDebounce: debounce(1000, function (id, todo) {
      const { count } = todo

      // reset count
      todo.count = 0

      console.log(count)

      if (count % 2 != 0) {
        // 判斷奇數次 click
        axios.patch(`https://todoo.5xcamp.us/todos/${id}/toggle`, null, this.setConfig())
      }
    }),

    async toggleTask(id) {
      // 假戲
      const todo = this.tasks.find((t) => {
        return t.id == id
      })

      if (todo.completed_at) {
        // 已完成
        todo.completed_at = null
      } else {
        // 未完成
        todo.completed_at = new Date()
      }

      if (todo.count == undefined) {
        todo.count = 0
      }

      todo.count = todo.count + 1

      // 真做
      this.toggleDebounce(id, todo)
    },

    deleteTask(id) {
      const idx = this.tasks.findIndex((t) => {
        return t.id === id
      })

      if (idx >= 0) {
        // 演！
        this.tasks.splice(idx, 1)

        // 真
        axios.delete(`https://todoo.5xcamp.us/todos/${id}`, this.setConfig())
      }
    },

    async addTask() {
      if (this.taskName != "") {
        // API
        const todoData = {
          todo: {
            content: this.taskName,
          },
        }

        const config = this.setConfig()

        // 假戲
        const dummyTask = {
          id: crypto.randomUUID(),
          content: this.taskName,
          completed_at: null,
        }

        this.tasks.unshift(dummyTask)

        // 清除
        this.taskName = ""

        // 真做
        const resp = await axios.post("https://todoo.5xcamp.us/todos", todoData, config)

        // 換
        const newTask = resp.data
        const idx = this.tasks.findIndex((t) => {
          return t.id == dummyTask.id
        })
        this.tasks.splice(idx, 1, newTask)
      }
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
    async Logout() {
      const token = localStorage.getItem("todoToken")

      if (token) {
        const config = {
          headers: {
            Authorization: token,
          },
        }

        try {
          const resp = await axios.delete("https://todoo.5xcamp.us/users/sign_out", config)

          localStorage.removeItem("todoToken")
          this.isLogin = false
          this.gotoLogin()

          // 清空
          this.tasks = []
        } catch (err) {
          console.log(err)
        }
      }
    },
  }
}

export { changeSection }
