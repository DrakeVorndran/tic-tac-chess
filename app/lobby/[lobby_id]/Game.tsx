"use client";

import * as Ably from "ably";
import Board from "./Board";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";
import { useState } from "react";

export default function Game({ lobby }: { lobby: string }) {
  const client = new Ably.Realtime({ authUrl: "/api" });

  function AblyPubSub() {
    const [messages, setMessages] = useState<Ably.Message[]>([]);

    useConnectionStateListener("connected", () => {
      console.log("Connected to Ably!");
    });

    // Create a channel called 'get-started' and subscribe to all messages with the name 'first' using the useChannel hook
    const { channel } = useChannel(lobby, "first", (message) => {
      setMessages((previousMessages) => [...previousMessages, message]);
    });

    return (
      // Publish a message with the name 'first' and the contents 'Here is my first message!' when the 'Publish' button is clicked
      <div>
        <button
          onClick={() => {
            channel.publish("first", "Here is my first message!");
          }}
        >
          Publish
        </button>
        {messages.map((message) => {
          return <p key={message.id}>{message.data}</p>;
        })}
      </div>
    );
  }

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={lobby}>
        <AblyPubSub />
      </ChannelProvider>
    </AblyProvider>
  );
}
