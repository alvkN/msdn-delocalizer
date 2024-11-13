import { defineConfig } from "vite";
import * as path from "path";
import { normalizePath } from "vite";
import webExtension from "vite-plugin-web-extension";
import * as fs from "fs";
import { zip } from "zip-a-folder";

const targetBrowser = process.env.TARGET || "chrome";
const isBuild = process.env.NODE_ENV === "production";
const isPublish = process.env.PUBLISH === "1";

// normalize path for windows compatibility
const resolvePath = (...args: string[]) => normalizePath(path.resolve(...args));
const joinPath = (...args: string[]) => normalizePath(path.join(...args));

const distFolder = resolvePath("build", "dist");

export default defineConfig({
    root: "src",
    build: {
        outDir: distFolder,
        emptyOutDir: true,
    },
    test: {
        dir: resolvePath("test"),
    },
    publicDir: "assets",
    plugins: [
        webExtension({
            browser: targetBrowser,
            disableAutoLaunch: true,
            onBundleReady: async () => {
                const distFolder = resolvePath("build", "dist");
                const webExtFolder = resolvePath("build", "web-ext");

                await fs.promises.copyFile(
                    resolvePath("LICENSE.md"),
                    joinPath(distFolder, "LICENSE.md")
                );

                if (!isBuild) return;

                fs.access(webExtFolder, async (error) => {
                    if (!error) return;

                    await fs.promises.mkdir(webExtFolder);
                });

                const webExtFilename = `msdn-delocalizer-${targetBrowser}.zip`;
                const webExtPath = joinPath(webExtFolder, webExtFilename);

                await zip(distFolder, webExtPath);

                if (!isPublish) return;

                await fs.promises.rm(distFolder, {
                    recursive: true,
                    force: true,
                });
            },
        }),
    ],
});
