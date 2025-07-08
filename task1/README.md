# 🌦️ Vayutrack - A Smart Weather Interface

**Vayutrack** is a sleek and responsive weather dashboard built with **React**, **Tailwind CSS**, and modern UI components powered by **Shadcn UI** **Recharts** and **Lucide Icons**. It allows users to search cities, view real-time weather information, and interact with a minimal, fast user interface.

---

## 🧠 Core Features

* 🌤️ Real-time weather updates via external APIs
* 🔍 City-based search with suggestions
* 🎨 Clean and minimal UI built with Tailwind and Radix UI
* 📱 Fully responsive for all screen sizes
* 🌙 Light/Dark mode theme switching
* 📦 Vite-powered blazing fast build and dev server
* 🧠 React Query for caching and reactivity of API data


---

## 🌈 Screenshots

Add your app screenshots here to showcase UI:

```

```

---


## 📁 Project Structure

```
weatherwise/
├── public/                     # Static assets (if any)
├── src/
│   ├── api/                    # API logic and configurations
│   │   ├── config.js           # Base API URL or constants
│   │   └── weather.js          # API calls to fetch weather data
│   ├── assets/                 # Images, logos, and static content
│   ├── components/             # Reusable UI components
│   │   ├── About.jsx           # About section UI
│   │   └── city-search.jsx     # City search input & logic
│   ├── App.jsx                 # Main layout and routing
│   ├── App.css                 # Tailwind + custom styles
│   ├── index.css               # Global styles
│   └── main.jsx                # ReactDOM entry point
├── index.html                  # Vite entry HTML
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # Tailwind setup
├── vite.config.js              # Vite bundler config
├── .env                        # API keys & environment variables
└── README.md                   # Project documentation
```



---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weatherwise.git
cd weatherwise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file at the root:

```
VITE_WEATHER_API_KEY=your_openweathermap_api_key
```

### 4. Run Locally

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🧰 Tech Stack & Dependencies

### 💻 Core Tech:

* [React 19](https://reactjs.org/)
* [Vite 7](https://vitejs.dev/)
* [Tailwind CSS 4](https://tailwindcss.com/)

### 🛠 UI & UX:

* [Lucide React Icons](https://lucide.dev/)
* [Radix UI Primitives](https://www.radix-ui.com/)
* [CMDK](https://cmdk.paco.sh/) – command palette components
* [Sonner](https://sonner.emilkowal.dev/) – toasts & alerts

### 🧠 Utilities:

* [React Router DOM](https://reactrouter.com/)
* [React Query](https://tanstack.com/query/latest)
* [Date-fns](https://date-fns.org/) – modern date utilities

### ⚙️ Dev Tools:

* [ESLint](https://eslint.org/) + React Hooks plugin
* [Tailwind Animate CSS](https://github.com/tailwindlabs/animate.css)
* [Vite Plugin React](https://www.npmjs.com/package/@vitejs/plugin-react)

---

## 📦 Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start local dev server           |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint on codebase           |

---

## 📝 License

This project is licensed under the MIT License.
---

## 👨‍💻 Author

**Parvesh Bansal**

## 🔗 Connect with Me

- 💼 [LinkedIn](https://www.linkedin.com/in/parvesh-bansal/)  
- ✖️ [X (Twitter)](https://twitter.com/parve5h)  
- 📸 [Instagram](https://www.instagram.com/parve5h)  
- 📧 [Email Me](mailto:parveshbansal063@gmail.com)  
- 👨‍💻 [GitHub Profile](https://github.com/parve5h)

  ---



> "Vayutrack brings simplicity to complexity. Get the forecast, fast."
