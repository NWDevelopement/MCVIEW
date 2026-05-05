import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import SkinRenderer from "./pages/SkinRenderer";
import ThumbnailGenerator from "./pages/ThumbnailGenerator";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/tools" component={Tools} />
        <Route path="/tools/skin-renderer" component={SkinRenderer} />
        <Route path="/tools/thumbnail-generator" component={ThumbnailGenerator} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  // Enforce dark mode
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
