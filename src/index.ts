#!/usr/bin/env node

const args = process.argv.slice(2);
import * as fs from "fs";
import * as https from "https";

if (args[0] === "add") {
	const component = args[1];

	if (component === "signup") {
		// create signup file

		// fetch file data from github

		const url =
			"https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/signup.tsx"; // Replace with your URL

		https
			.get(url, (response) => {
				let data = "";

				response.on("data", (chunk) => {
					data += chunk;
				});

				response.on("end", () => {
					fs.writeFile("signup.tsx", data, (err) => {
						if (err) {
							console.error("Error writing to file:", err);
						} else {
							console.log("Data written to file successfully.");
						}
					});
				});
			})
			.on("error", (err) => {
				console.error("Error fetching data from URL:", err);
			});
	}
}
