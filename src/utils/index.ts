import fs from "fs";
import * as https from "https";
import { spawn } from "child_process";

export function getWriteComponentPath(
	component: string,
	defaultPath = "supaauth/"
) {
	const path = "./src";

	if (fs.existsSync(path)) {
		return "./src/components" + defaultPath + component + ".tsx";
	} else {
		return "./components/" + defaultPath + component + ".tsx";
	}
}

export function createFolderAndFile(
	url: string,
	folderPath: string,
	fileName: string,
	isRoot?: boolean
) {
	let path = "";
	if (isRoot) {
		fs.mkdirSync(folderPath, { recursive: true });

		path = folderPath + "/" + fileName;
	} else if (fs.existsSync("./src")) {
		fs.mkdirSync("./src/" + folderPath, { recursive: true });
		path = "./src/" + folderPath + "/" + fileName;
	} else {
		fs.mkdirSync("./" + folderPath, { recursive: true });
		path = "./" + folderPath + "/" + fileName;
	}

	writeFile(fileName, url, path);
}

export function writeFile(action: string, url: string, path: string) {
	https
		.get(url, (response) => {
			let data = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				fs.writeFile(path, data, (err) => {
					if (err) {
						console.error("Fail to create " + action, err);
					}
				});
			});
		})
		.on("error", (err) => {
			console.error("Fail to create " + action, err);
		});
}

function createEnvFile() {
	https
		.get(
			"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/.env.sample",
			(response) => {
				let data = "";

				response.on("data", (chunk) => {
					data += chunk;
				});

				response.on("end", () => {
					try {
						fs.appendFileSync(".env.local", data, "utf8");
					} catch (err) {
						console.error(`Error appending data to file: ${err}`);
					}
				});
			}
		)
		.on("error", (err) => {
			console.error("Fail to create " + ".env.local", err);
		});
}

export function initSupabase() {
	console.log("Init Supabase...");
	let path = fs.existsSync("./src/lib/supabase")
		? "./src/lib/supabase"
		: "./lib/supabase";
	if (
		!fs.existsSync("./src/lib/supabase") &&
		!fs.existsSync("./lib/supabase")
	) {
		if (fs.existsSync("./src")) {
			fs.mkdirSync("./src/lib/supabase", { recursive: true });
			path = "./src/lib/supabase";
		} else {
			fs.mkdirSync("./lib/supabase", { recursive: true });
			path = "./lib/supabase";
		}
	}

	createFolderAndFile(
		"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/lib/constants/index.ts",
		"lib/constants",
		"index.ts"
	);
	createEnvFile();
	writeFile(
		"supabase browser",
		"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/lib/supabase/client.ts",
		path + "/client.ts"
	);
	writeFile(
		"supabase server",
		"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/lib/supabase/server.ts",
		path + "/server.ts"
	);
	writeFile(
		"middlware",
		"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/lib/supabase/middleware.ts",
		path + "/middleware.ts"
	);
	writeFile(
		"middlware",
		"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/lib/supabase/admin.ts",
		path + "/admin.ts"
	);

	const child = spawn("npm install @supabase/supabase-js @supabase/ssr", {
		stdio: "inherit",
		shell: true,
	});

	child.on("close", (code) => {});
}
