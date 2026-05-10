export const homelabSpecs = {
  hypervisor: {
    name: "Proxmox VE 8.x",
    nodes: 1,
    vms: 8,
    cpu: "6-core Xeon",
    ram: "128GB DDR4",
    storage: "4TB storage",
  },
  network: {
    firewall: "pfSense (Netgate)",
    switch: "Managed switch (802.1Q trunking)",
    vlans: [
      { id: 10,  name: "MANAGEMENT", color: "#00D4FF" },
      { id: 20,  name: "SERVERS",    color: "#7B4FFF" },
      { id: 30,  name: "TRUSTED",    color: "#00FF88" },
      { id: 40,  name: "IOT",        color: "#FFB347" },
      { id: 50,  name: "GUEST",      color: "#FF9F43" },
      { id: 99,  name: "DMZ",        color: "#FF6B9D" },
    ],
  },
  services: [
    { name: "LiteLLM Gateway",   status: "running", url: "ai.local",      tech: "Python + Docker"  },
    { name: "Ollama",            status: "running", url: "ollama.local",  tech: "Go + Docker"      },
    { name: "Grafana",           status: "running", url: "monitor.local", tech: "Grafana OSS"      },
    { name: "Prometheus",        status: "running", url: "metrics.local", tech: "Prometheus"        },
    { name: "Cloudflare Tunnel", status: "running", url: "tunnel",        tech: "cloudflared"      },
    { name: "CI/CD Runners",     status: "running", url: "runners.local", tech: "GitHub Actions"   },
  ],
};
