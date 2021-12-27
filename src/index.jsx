import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App.jsx"
import reportWebVitals from "./reportWebVitals"
import { HashRouter,BrowserRouter } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min"

if(process.env.REACT_APP_ROUTER == 'Hash'){
ReactDOM.render(
		<HashRouter>
		<App />
		</HashRouter>,
		document.getElementById("root")
		)
	}
else if(process.env.REACT_APP_ROUTER == 'Browser'){
ReactDOM.render(
		<BrowserRouter>
		<App />
		</BrowserRouter>,
		document.getElementById("root")
		)
	}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
