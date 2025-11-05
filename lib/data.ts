"use server";
import { PoolClient } from "pg";
import connectionPool from "./db";

type Room = {
  room_creator: string;
};

let client: PoolClient | null = null;

async function getClient() {
  if (!client) {
    client = await connectionPool.connect();
  }
  return client;
}

export async function getAllRooms() {
  const client = await getClient();
  const result = await client.query<Room>("SELECT * FROM rooms");
  return result.rows;
}

export async function createRoom(roomCreator: string) {
  const client = await getClient();
  const result = await client.query<Room>(
    "INSERT INTO rooms (room_creator) VALUES ($1) RETURNING *",
    [roomCreator]
  );
  return result.rows[0];
}
