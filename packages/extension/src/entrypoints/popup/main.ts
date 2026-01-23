import { mount } from "svelte";
import App from "./App.svelte";
import "./app.css";
import { isRtlLanguage } from "@/shared/i18n/i18n";

// Apply RTL direction based on browser language
const browserLang = navigator.language;
if (isRtlLanguage(browserLang)) {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = browserLang;
}

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
