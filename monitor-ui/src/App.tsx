import React from "react";
import "./App.css";
import {BrowserRouter} from "react-router-dom";
import BaseRouter from "./router/index";
import Layout from "./components/Layout";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout baseRouter = {BaseRouter}>
          <BaseRouter></BaseRouter>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
