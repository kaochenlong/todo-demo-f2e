function changeSection() {
  return {
    change_section: "signup",
    gotoLogin() {
      this.change_section = "login"
    },
    gotoSignUp() {
      this.change_section = "signup"
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
