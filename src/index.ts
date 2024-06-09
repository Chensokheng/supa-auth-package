#!/usr/bin/env node

import * as fs from "fs";

import { createComponent } from "./utils";
const args = process.argv.slice(2);

if (args[0] === "init") {
	if (fs.existsSync("./src/supaauth") || fs.existsSync("./src/supaauth")) {
		process.exit(1);
	}
	if (fs.existsSync("./src")) {
		fs.mkdirSync("./src/supaauth");
	} else {
		fs.mkdirSync("./supaauth");
	}
}

if (args[0] === "add") {
	const component = args[1];
	if (component === "signup") {
		const url =
			"https://raw.githubusercontent.com/Chensokheng/next-supabase-vote/master/components/Footer.tsx";
		createComponent(component, url);
	}
}
