// The Gear page. Add, remove or rename groups freely.
// `link` and `image` are optional. Images go in /public/gear.

export type GearItem = {
  name: string;
  note: string;
  link?: string;
  image?: string;
};

export type GearGroup = {
  title: string;
  items: GearItem[];
};

export const gear: { intro: string; groups: GearGroup[] } = {
  intro: "The hardware and software I use to build, ship and stay organized.",
  groups: [
    {
      title: "Desk setup",
      items: [
        {
          name: 'MacBook Pro 14"',
          note: "M4 Pro, 24 GB memory, Nov 2024",
          link: "https://www.apple.com/macbook-pro/",
          image: "/gear/macbook-pro.png",
        },
        { name: "BenQ MA270U", note: "27-inch 4K (3840 × 2160), the main screen", image: "/gear/benq-ma270u.png" },
        {
          name: "ARZOPA portable monitor",
          note: "16.3-inch 1080p at 144Hz, turned vertical as a second screen",
          image: "/gear/arzopa.webp",
        },
        {
          name: "Ajazz AK820 Max Plus",
          note: "Gasket-mount, hot-swap mechanical keyboard with a built-in screen. Wired, 2.4GHz or Bluetooth",
          image: "/gear/ajazz-ak820.webp",
        },
        {
          name: "Scyrox V8",
          note: "Lightweight mouse, set up from the browser with Control HUB",
          image: "/gear/scyrox-v8.webp",
        },
        {
          name: "VESSELS desk mat",
          note: "Extended leather mat under the keyboard and mouse",
          image: "/gear/vessels-mat.webp",
        },
        { name: "Maono DGM20", note: "USB microphone for calls and recordings", image: "/gear/maono-dgm20.webp" },
        { name: "Marshall Willen", note: "Small Bluetooth speaker on the desk", image: "/gear/marshall-willen.webp" },
        {
          name: "Sihoo M57 Pro",
          note: "Ergonomic chair with adjustable lumbar support and headrest",
          image: "/gear/sihoo-m57-pro.webp",
        },
        {
          name: "Internet",
          note: "220 Mbps down, 170 up, 5 ms latency",
          link: "https://fast.com",
          image: "/gear/internet-speed.webp",
        },
      ],
    },
    {
      title: "Software",
      items: [
        {
          name: "Claude Code",
          note: "Daily coding partner, with my own skills for planning, specs and checks",
          link: "https://claude.com/claude-code",
          image: "/gear/claude.svg",
        },
        {
          name: "Visual Studio Code",
          note: "Editor",
          link: "https://code.visualstudio.com",
          image: "/gear/vscode.webp",
        },
        {
          name: "Obsidian",
          note: "Notes, plans and a running log of decisions",
          link: "https://obsidian.md",
          image: "/gear/obsidian.svg",
        },
        { name: "Linear", note: "Issues and project planning", link: "https://linear.app", image: "/gear/linear.svg" },
        { name: "Notion", note: "Docs, mail and calendar", link: "https://www.notion.com", image: "/gear/notion.svg" },
        {
          name: "Docker",
          note: "Databases and services running locally",
          link: "https://www.docker.com",
          image: "/gear/docker.svg",
        },
        { name: "Orca", note: "Terminal, where my Claude Code sessions run", image: "/gear/orca.webp" },
      ],
    },
  ],
};
