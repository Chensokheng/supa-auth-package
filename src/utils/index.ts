import fs, { write } from "fs";
import * as https from "https";
import { spawn } from "child_process";

export function getWriteComponentPath(component: string) {
	const path = "./src";

	if (fs.existsSync(path)) {
		return "./src/supaauth/" + component + ".tsx";
	} else {
		return "./supaauth/" + component + ".tsx";
	}
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
			fs.mkdirSync("./src/lib/supabase");
			path = "./src/lib/supabase";
		} else {
			fs.mkdirSync("./lib/supabase");
			path = "./lib/supabase";
		}
	}

	const data =
		"NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>\nNEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>\n";

	try {
		fs.appendFileSync(".env.local", data, "utf8");
	} catch (err) {
		console.error(`Error appending data to file: ${err}`);
	}
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

	const child = spawn("npm install @supabase/supabase-js @supabase/ssr", {
		stdio: "inherit",
		shell: true,
	});

	// Handle child process exit
	child.on("close", (code) => {});
}
