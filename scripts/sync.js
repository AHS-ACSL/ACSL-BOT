const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = process.env.API_KEY;
const PANEL_URL = process.env.PANEL_URL;
const SERVER_ID = process.env.SERVER_ID;
const LOCAL_DIR = path.resolve("");
const REMOTE_DIR = "/";
const IGNORE_LIST = [".env", "node_modules", ".git", ".npm"];

function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : {});
        } else {
          reject(
            new Error(`Request failed: ${res.statusCode} ${res.statusMessage}`)
          );
        }
      });
    });

    req.on("error", (err) => reject(err));
    if (data) req.write(data);
    req.end();
  });
}

async function deleteServerFiles(remoteDir, exclude) {
  try {
    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      Accept: "Application/vnd.pterodactyl.v1+json",
      "Content-Type": "application/json",
    };

    const options = {
      method: "GET",
      hostname: PANEL_URL.replace(/^https?:\/\//, ""),
      path: `/api/client/servers/${SERVER_ID}/files/list?directory=${encodeURIComponent(remoteDir)}`,
      headers,
    };

    const listResponse = await httpsRequest(options);

    const allItems = listResponse.data.map((item) => `${remoteDir}/${item.attributes.name}`);

    const itemsToDelete = allItems.filter((item) => {
      const itemName = path.basename(item);
      return !exclude.includes(itemName);
    });

    if (itemsToDelete.length === 0) {
      console.log("No items to delete based on exclusions.");
      return;
    }

    const deleteOptions = {
      method: "POST",
      hostname: PANEL_URL.replace(/^https?:\/\//, ""),
      path: `/api/client/servers/${SERVER_ID}/files/delete`,
      headers,
    };

    await httpsRequest(deleteOptions, JSON.stringify({
      root: remoteDir,
      files: itemsToDelete.map((item) => path.relative(remoteDir, item)),
    }));

    console.log(`Successfully deleted the following items inside ${remoteDir}:`, itemsToDelete);
  } catch (error) {
    console.error("Error deleting files:", error.message);
  }
}

async function uploadFile(localFilePath, remotePath) {
  const fileContent = fs.readFileSync(localFilePath, "utf8");

  const options = {
    method: "POST",
    hostname: PANEL_URL.replace(/^https?:\/\//, ""),
    path: `/api/client/servers/${SERVER_ID}/files/write?file=${encodeURIComponent(remotePath)}`,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "text/plain",
      Accept: "Application/vnd.pterodactyl.v1+json",
    },
  };

  try {
    await httpsRequest(options, fileContent);
    console.log(`Uploaded: ${localFilePath} -> ${remotePath}`);
  } catch (error) {
    console.error(`Failed to upload ${localFilePath}:`, error.message);
  }
}

async function uploadDirectory(localDir, remoteDir, ignoreList = []) {
  const items = fs.readdirSync(localDir);

  for (const item of items) {
    const localPath = path.join(localDir, item);
    const remotePath = `${remoteDir}/${item}`;
    const itemName = path.basename(localPath);

    if (ignoreList.includes(itemName)) {
      console.log(`Skipping ignored item: ${localPath}`);
      continue;
    }

    if (fs.lstatSync(localPath).isDirectory()) {
      console.log(`Entering directory: ${localPath}`);
      await uploadDirectory(localPath, remotePath, ignoreList);
    } else {
      console.log(`Uploading file: ${localPath}`);
      await uploadFile(localPath, remotePath);
    }
  }
}

async function restartServer() {
  console.log("Restarting the server...");
  const options = {
    method: "POST",
    hostname: PANEL_URL.replace(/^https?:\/\//, ""),
    path: `/api/client/servers/${SERVER_ID}/power`,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    await httpsRequest(options, JSON.stringify({ signal: "restart" }));
    console.log("Server restarted successfully.");
  } catch (error) {
    console.error("Failed to restart the server:", error.message);
  }
}

(async () => {
  try {
    console.log(`Starting deployment process...`);

    await deleteServerFiles("dist", ["runtime"]);
    await deleteServerFiles("dist", [".env", ".apollo", ".trash", "dist"])

    console.log(`Uploading files from ${LOCAL_DIR} to ${REMOTE_DIR}...`);
    await uploadDirectory(LOCAL_DIR, REMOTE_DIR, IGNORE_LIST);

    await restartServer();

    console.log("Deployment process complete!");
  } catch (err) {
    console.error("An error occurred during deployment:", err);
  }
})();
