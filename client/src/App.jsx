import { ThemeProvider } from "@mui/material/styles";
import { useSelector } from "react-redux";
import themeConfigs from "./configs/theme.configs";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import routes from "./routes/routes";
import { routesGen } from "./routes/routes";
import PageWrapper from "./components/common/PageWrapper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const App = () => {
  const { themeMode } = useSelector((state) => state.themeMode);

  return (
    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
      {/* mui reset css */}
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path={routesGen.home} element={<MainLayout />}>
            {routes.map((route, index) => (
              route.index ? (
                <Route index key={index} element={
                  route.state ? (
                    <PageWrapper state={route.state}>
                      {route.element}
                    </PageWrapper>
                  ) : route.element
                } />
              ) : (
                <Route path={route.path} key={index} element={
                  route.state ? (
                    <PageWrapper state={route.state}>
                      {route.element}
                    </PageWrapper>
                  ) : route.element
                } />
              )
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
