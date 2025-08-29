

# Model Evaluation Dashboard

An interactive dashboard for visualizing and evaluating machine learning models in real time, built with React and TypeScript. Features reusable UI components, WebSocket-based live updates, and flexible deployment options.

## Features

* **Model selection**: Pick from multiple models dynamically.
* **Real-time updates**: Utilizes WebSockets for live metric streaming.
* **Visual insights**: Charts and metric cards showcase KPIs like accuracy and loss.
* **Tabbed navigation**: Clean separation of overview and model-specific views.
* **Mock data ready**: Comes with mock models for quick testing and demos.

---

## Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kmenilrussell/rork-modelviz---model-evaluation-dashboard.git
cd rork-modelviz---model-evaluation-dashboard
```

### 2. Install Dependencies

**Using Bun (recommended):**

```bash
bun install
```

**Or with npm:**

```bash
npm install
```

### 3. Run the Development Server

```bash
bun dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to interact with the dashboard.

### 4. Build for Production

```bash
bun build
# or
npm run build
```

---

## Usage

1. Launch the app in your browser.
2. Use the **Model Selector** to switch between models.
3. Observe **Metric Cards** and interactive charts.
4. Toggle chart type via the **ChartTypeSelector**.
5. Monitor connection status through the live indicator.
6. Navigate between dashboard and model views via tabs.

### Testing with Mock Data

Mock models are defined in `mocks/models.ts`. To connect to a real backend:

* Replace mock data with API endpoints.
* Adjust WebSocket hook (`hooks/use-websocket.ts`) to point to your server.

---

## Deployment Options

You can deploy your dashboard using several free and reliable services:

### GitHub Pages

Ideal for static deployments:

* Add `"homepage": "https://<username>.github.io/<repo-name>"` to `package.json`.
* In `scripts`, define:

  ```json
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
  ```
* Install `gh-pages` via `npm install gh-pages --save-dev`.
* Run `npm run deploy`, and activate GitHub Pages in repo settings ([CloudMinister Technologies][1], [DEV Community][2], [GitHub][3]).

### Vercel

Supports zero-config deployment:

* Sign in and import the repo—Vercel auto-detects React and sets build settings ([create-react-app.dev][4]).
* Push to `main` for production, or create branches for preview deploys.
* Optionally set a custom domain.

### Netlify

Easy CI/CD process:

* Link your Git repository.
* Provide build command (`npm run build`) and publish directory (`build`).
* Deploy instantly with previews and instant rollbacks available ([create-react-app.dev][4], [CloudMinister Technologies][1], [LogRocket Blog][5], [DEV Community][2]).

### GitHub Actions + Vercel (Optional Advanced Flow)

Set up full control via CI/CD:

* Create a `.github/workflows/preview.yaml` for preview and production build/push events.
* Use Vercel CLI and environment secrets to deploy: install Vercel, pull envs, build, and `vercel deploy --prebuilt` ([LogRocket Blog][5], [Vercel][6]).

---

## Contributing

We welcome your contributions!

1. Fork the repository.
2. Create a feature or bugfix branch: `git checkout -b feature/name`.
3. Commit changes: `git commit -m "Add awesome feature"`.
4. Push your branch: `git push origin feature/name`.
5. Open a Pull Request—describe your changes and the motivation.

### Contributions Guidelines

* Follow existing coding style.
* Document components and hooks thoroughly.
* Ensure cross-browser compatibility.
* Add or update unit/integration tests if available.

---

## License

MIT License — feel free to use, modify, and distribute this code. Contributions are covered under the same license unless otherwise noted.
