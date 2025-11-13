// API utility functions
export class HuaweiAPI {
  private baseUrl = "/api"

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
    return response.json()
  }

  async getSystemInfo() {
    const response = await fetch(`${this.baseUrl}/system`)
    return response.json()
  }

  async getHotspotUsers() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          users: [
            { id: 1, username: "user001", ip: "192.168.2.100", status: "active" },
            { id: 2, username: "guest_wifi", ip: "192.168.2.101", status: "active" },
          ],
        })
      }, 500)
    })
  }

  async getPPPoEUsers() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          users: [
            { id: 1, username: "pppoe001", ip: "10.0.0.100", status: "connected" },
            { id: 2, username: "pppoe002", ip: "10.0.0.101", status: "connected" },
          ],
        })
      }, 500)
    })
  }
}

export const api = new HuaweiAPI()
