#!/usr/bin/env node

import * as fs from "fs";
import { spawn } from "child_process";

import { getWriteComponentPath, initSupabase, writeFile } from "./utils";

import { program } from "commander";

program
	.command("init")
	.option("--skip <type>", "Skip a specific step")
	.action(async (options) => {
		console.log("1. Init supaauth");

		if (!fs.existsSync("./src/supaauth") && !fs.existsSync("./supaauth")) {
			if (fs.existsSync("./src")) {
				fs.mkdirSync("./src/supaauth", { recursive: true });
			} else {
				fs.mkdirSync("./supaauth", { recursive: true });
			}
		}

		if (options.skip === "shadcn") {
			initSupabase();
		} else {
			console.log("Init Shadcn");
			const child = spawn("npx shadcn-ui@latest init", {
				stdio: "inherit",
				shell: true,
			});

			// Handle child process exit
			child.on("close", (code) => {
				initSupabase();
			});
		}
	});

program
	.command("add")
	.option("--component <type>", "Component")
	.option("--skip <type>", "Skip")
	.action(async (options) => {
		if (options.component === "signup") {
			// create file
			console.log("Creating supaauth/signup.tsx file..");
			writeFile(
				"create signup",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/signup.tsx",
				getWriteComponentPath(options.component)
			);
			if (!(options.skip === "dep")) {
				console.log("Installing dependencies...");
				console.log("Installing form..");
				const child = spawn(
					"npx shadcn-ui@latest add form && npx shadcn-ui@latest add input",
					{
						stdio: "inherit",
						shell: true,
					}
				);
				// Handle child process exit
				child.on("close", (code) => {
					console.log("Installing React Icons");
					spawn("npm i react-icons", {
						stdio: "inherit",
						shell: true,
					});
				});
			}
		}
	});

program.parse(process.argv);
