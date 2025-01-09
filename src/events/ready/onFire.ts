// onFireUpdate.ts
import { Client, Message, TextChannel } from "discord.js";
import cron from "node-cron";
import axios from "axios";
import * as cheerio from "cheerio";
import { announcementChannel } from "../../../config.json";

const CALFIRE_URL = "https://www.fire.ca.gov/";

let lastMessage: Message | null = null;
let lastData = "";

/**
 * Fetch and parse the incidents data from CALFIRE_URL using Cheerio.
 * This function mimics the logic from your DOM-based script.
 */
async function fetchFireData(): Promise<string> {
  try {
    const { data: html } = await axios.get(CALFIRE_URL);
    const $ = cheerio.load(html);

    const results: Array<{
      placeName: string;
      acres: number;
      containment: string;
    }> = [];

    $("#incidents tbody tr").each((_, row) => {
      const incidentNameElement = $(row).find("th");
      const placeName = incidentNameElement.text().trim();

      const cells = $(row).find("td");

      if (cells.length >= 4) {
        const acresText = $(cells[2]).text().trim();
        const acres = parseInt(acresText.replace(/,/g, ""), 10);

        const containmentText = $(cells[3]).text().trim();

        results.push({
          placeName,
          acres: isNaN(acres) ? 0 : acres,
          containment: containmentText,
        });
      }
    });

    let message =
      "ACSL bot has been set up to report live fire containment. " +
      "Updates are queried from https://www.fire.ca.gov/ every 3 hours.\n\n";

    for (const incident of results) {
      message += `${incident.placeName} ------- ${incident.containment} Containment ------- ${incident.acres} acres\n`;
    }

    return message.trim();
  } catch (error) {
    console.error(`Error fetching fire data: ${error}`);
    return "";
  }
}

/**
 * Sets up a cron job to update the channel with latest fire data every 3 hours.
 */
export default function onFireUpdate(client: Client) {
  cron.schedule("0 */3 * * *", async () => {
    try {
      const data = await fetchFireData();
      if (!data) return;
      if (data === lastData) {
        console.log("Fire data is unchanged. Skipping update.");
        return;
      }

      const channel = client.channels.cache.get(
        announcementChannel
      ) as TextChannel;
      if (!channel) {
        console.error("Announcement channel not found. Check your config.json");
        return;
      }

      if (lastMessage) {
        try {
          await lastMessage.edit(data);
          console.log("Fire update message edited.");
        } catch (error: any) {
          if (error?.code === 10008) {
            console.log("Last message was deleted. Sending a new one.");
            lastMessage = await channel.send(data);
          } else {
            console.error(`Failed to edit last message: ${error}`);
          }
        }
      } else {
        lastMessage = await channel.send(data);
        console.log("Fire update message posted.");
      }

      lastData = data;
    } catch (err) {
      console.error(`Failed to update fire data: ${err}`);
    }
  });

  console.log("Scheduled job for fire updates is set to run every 3 hours.");
}
