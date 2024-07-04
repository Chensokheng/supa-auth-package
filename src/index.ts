#!/usr/bin/env node

import * as fs from "fs";
import { spawn } from "child_process";

import {
	createFolderAndFile,
	getWriteComponentPath,
	initSupabase,
	writeFile,
} from "./utils";

import { program } from "commander";

program
	.command("init")
	.option("--skip <type>", "Skip a specific step")
	.action(async (options) => {
		console.log("1. Init supaauth");
		const supaAuthFolder = "components/supaauth";
		if (
			!fs.existsSync("./src/" + supaAuthFolder) &&
			!fs.existsSync("./" + supaAuthFolder)
		) {
			if (fs.existsSync("./src")) {
				fs.mkdirSync("./src/" + supaAuthFolder, { recursive: true });
			} else {
				fs.mkdirSync("./" + supaAuthFolder, { recursive: true });
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
		if (options.component === "register") {
			// create file
			console.log("creating register.tsx..");
			writeFile(
				"create regiser",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/register.tsx",
				getWriteComponentPath("register")
			);
			console.log("creating signup.tsx..");

			writeFile(
				"create signup",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/signup.tsx",
				getWriteComponentPath("signup")
			);
			console.log("creating social.tsx..");
			writeFile(
				"create social",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/social.tsx",
				getWriteComponentPath("social")
			);
			console.log("creating middlware.tsx..");
			writeFile(
				"middleware",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/middleware.tsx",
				"./middleware.ts"
			);
			console.log("creating signup api ...");
			createFolderAndFile(
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/app/api/signup/route.ts",
				"app/api/signup",
				"route.ts"
			);
			console.log("creating auth callback ...");
			createFolderAndFile(
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/app/auth/callback/route.ts",
				"app/auth/callback",
				"route.ts"
			);
			console.log("creating email template ...");
			createFolderAndFile(
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/emails/index.tsx",
				"./emails",
				"index.tsx",
				true
			);
			console.log("creating auth actions ...");

			createFolderAndFile(
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/actions/auth.ts",
				"actions",
				"auth.ts"
			);
			if (!(options.skip === "dep")) {
				console.log("Installing dependencies...");
				console.log(
					"npx shadcn-ui@latest add input-otp\nnpx shadcn-ui@latest add form\nnpx shadcn-ui@latest add input\nnpm i react-icons resend sonner\nnpm install react-email @react-email/components -E"
				);
				const child = spawn(
					"npx shadcn-ui@latest add input-otp && npx shadcn-ui@latest add form && npx shadcn-ui@latest add input && npm i react-icons resend sonner && npm install react-email @react-email/components -E",
					{
						stdio: "inherit",
						shell: true,
					}
				);
				// Handle child process exit
				child.on("close", (code) => {});
			}
		} else if (options.component === "signin") {
			console.log("creating signin.tsx..");
			writeFile(
				"create signin",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/signin.tsx",
				getWriteComponentPath("signin")
			);
		} else if (options.component === "user-profile") {
			console.log(
				"creating user-profile.tsx, avatar.tsx, manage-profile.tsx,query-provider.tsx"
			);
			writeFile(
				"create user-profile",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/user-profile.tsx",
				getWriteComponentPath("user-profile")
			);
			writeFile(
				"create avatar",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/avatar.tsx",
				getWriteComponentPath("avatar")
			);
			writeFile(
				"create manage-profile",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/manage-profile.tsx",
				getWriteComponentPath("manage-profile")
			);
			writeFile(
				"create query-provider",
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/query-provider.tsx",
				getWriteComponentPath("query-provider", "")
			);
			createFolderAndFile(
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/app/hook/useUser.ts",
				"app/hook",
				"useUser.tsx"
			);

			createFolderAndFile(
				"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/ui/dialog.tsx",
				"components/ui",
				"dialog.tsx"
			);
			console.log(
				"npx shadcn-ui@latest add popover\nnpm i @tanstack/react-query @tanstack/react-query-devtools @radix-ui/react-dialog"
			);
			const child = spawn(
				"npx shadcn-ui@latest add popover && npm i @tanstack/react-query @tanstack/react-query-devtools @radix-ui/react-dialog",
				{
					stdio: "inherit",
					shell: true,
				}
			);
			child.on("close", (code) => {});

			// create hook file
		} else {
			console.log("no component");
		}
	});

program.parse(process.argv);
