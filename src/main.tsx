import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";

import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router";
import App from "./App";
import worker from "./_mock";
import { registerLocalIcons } from "./components/icon";
import PageError from "./pages/sys/error/PageError";
import { routesSection } from "./routes/sections";
import { urlJoin } from "./utils";
// import { PostHogProvider } from "posthog-js/react";
const { VITE_APP_BASE_PATH = "/" } = import.meta.env;

await registerLocalIcons();

worker.start({ onUnhandledRequest: "bypass", serviceWorker: { url: urlJoin(VITE_APP_BASE_PATH, "mockServiceWorker.js") } });

if (import.meta.env.DEV) {
	import("react-scan").then(({ scan }) => {
		scan({
			enabled: false,
			showToolbar: true,
			log: false,
			animationSpeed: "fast",
		});
	});
}

// const options = {
// 	api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
// };

const router = createBrowserRouter(
	[
		{
			Component: () => (
				// <PostHogProvider
				// apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
				// options={options}
				// 	>
				<App>
					<Outlet />
				</App>
				// </PostHogProvider>
			),
			errorElement: <ErrorBoundary fallbackRender={PageError} />,
			children: routesSection,
		},
	],
	{
		basename: VITE_APP_BASE_PATH,
	},
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
