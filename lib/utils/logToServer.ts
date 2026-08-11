"use server";

export async function logToServerTerminal(message: any, data = {}) {
  console.log(`[CLIENT-SIGNAL]: ${message}`, data);
}
