#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var args = process.argv.slice(2);
var fs = __importStar(require("fs"));
var https = __importStar(require("https"));
if (args[0] === "add") {
    var component = args[1];
    if (component === "signup") {
        // create signup file
        // fetch file data from github
        var url = "https://raw.githubusercontent.com/Chensokheng/supa-auth/master/components/auth/signup.tsx"; // Replace with your URL
        https
            .get(url, function (response) {
            var data = "";
            response.on("data", function (chunk) {
                data += chunk;
            });
            response.on("end", function () {
                fs.writeFile("signup.tsx", data, function (err) {
                    if (err) {
                        console.error("Error writing to file:", err);
                    }
                    else {
                        console.log("Data written to file successfully.");
                    }
                });
            });
        })
            .on("error", function (err) {
            console.error("Error fetching data from URL:", err);
        });
    }
}
