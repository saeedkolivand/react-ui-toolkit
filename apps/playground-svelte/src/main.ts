import { mount } from "svelte";
import "@crosskit-ui/styles";
import Parity from "./Parity.svelte";
import "./parity.css";

mount(Parity, { target: document.getElementById("app")! });
