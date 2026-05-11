import { homelab as cfg } from "@/config/bls.config";

export const homelabSpecs = {
  hypervisor: {
    name:    cfg.host,
    nodes:   1,
    vms:     cfg.vms,
    cpu:     cfg.cpu,
    ram:     `${cfg.ram_gb}GB DDR4`,
    storage: `${cfg.storage_tb}TB storage`,
  },
  network: {
    firewall: cfg.router,
    switch:   cfg.switch,
    vlans:    cfg.vlans.map((v) => ({
      id:    v.id,
      name:  v.name.toUpperCase(),
      color: v.color,
    })),
  },
  services: cfg.services.map((s) => ({
    name:   s.name,
    status: s.status,
    url:    "",
    tech:   s.desc,
  })),
};
