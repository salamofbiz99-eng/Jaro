import { createHash, randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import process from "node:process";
import readline from "node:readline";
import readlinePromises from "node:readline/promises";

const terminal = readlinePromises.createInterface({ input: process.stdin, output: process.stdout });
const username = (await terminal.question("Choose an admin username: ")).trim();

async function hiddenQuestion(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") return terminal.question(prompt);
  terminal.pause();
  process.stdout.write(prompt);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise((resolve, reject) => {
    let value = "";
    const finish = () => {
      process.stdin.off("keypress", onKeypress);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
    };
    const onKeypress = (character, key) => {
      if (key?.ctrl && key.name === "c") {
        finish();
        reject(new Error("Setup cancelled."));
      } else if (key?.name === "return" || key?.name === "enter") {
        finish();
        resolve(value);
      } else if (key?.name === "backspace") {
        if (value.length > 0) {
          value = value.slice(0, -1);
          process.stdout.write("\b \b");
        }
      } else if (character && !key?.ctrl && !key?.meta) {
        value += character;
        process.stdout.write("•");
      }
    };
    process.stdin.on("keypress", onKeypress);
  });
}

const password = await hiddenQuestion("Choose a strong admin password: ");
const confirmation = await hiddenQuestion("Repeat the password: ");
terminal.close();

if (username.length < 4) throw new Error("The username must contain at least 4 characters.");
if (password.length < 12) throw new Error("The password must contain at least 12 characters.");
if (password !== confirmation) throw new Error("The passwords do not match.");

const passwordHash = createHash("sha256").update(password).digest("hex");
const sessionSecret = randomBytes(32).toString("hex");
const contents = [
  `ADMIN_USERNAME=${username}`,
  `ADMIN_PASSWORD_SHA256=${passwordHash}`,
  `ADMIN_SESSION_SECRET=${sessionSecret}`,
  "RESEND_API_KEY=",
  "RESEND_FROM_EMAIL=",
  "",
].join("\n");

await writeFile(new URL("../.dev.vars", import.meta.url), contents, { encoding: "utf8", flag: "wx" });
console.log("Local administrator configured. Keep .dev.vars private.");
