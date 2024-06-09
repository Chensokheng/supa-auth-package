import fs from "fs";
import * as https from "https";
import { exec } from "child_process";

export function getWritePath(component: string) {
	const path = "./src";

	if (fs.existsSync(path)) {
		return "./src/supaauth/" + component + ".tsx";
	} else {
		return "./supaauth/" + component + ".tsx";
	}
}

export function createComponent(component: string, url: string) {
	const path = getWritePath(component);

	https
		.get(url, (response) => {
			let data = "";

			response.on("data", (chunk) => {
				data += chunk;
			});

			response.on("end", () => {
				fs.writeFile(path, data, (err) => {
					if (err) {
						console.error("Fail to create " + component, err);
					}
				});
			});
		})
		.on("error", (err) => {
			console.error("Fail to create " + component, err);
		});
}

export function execCmd(cmd: string) {
	exec(cmd, (error, stdout, stderr) => {
		if (error) {
			console.error(`${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`${stderr}`);
			return;
		}
		console.log(`${stdout}`);
	});
}
