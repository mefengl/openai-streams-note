import React, { useEffect, useState } from 'react';
import { OpenAI } from "openai-streams/node";

type Props = {
  name: string | undefined;
};

export default function App({ name = 'Stranger' }: Props) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResponse = async () => {
      setLoading(true);
      try {
        const stream = await OpenAI("chat", {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant."
            },
            {
              role: "user",
              content: "Translate this English text to French: 'Hello, how are you?'"
            },
          ],
        });

        let response = "";
        for await (const chunk of stream) {
          response += Buffer.from(chunk).toString();
        }

        setResponse(response);
        setLoading(false);
      } catch (error) {
        console.error('Error getting response:', error);
        setLoading(false);
      }
    };

    fetchResponse();
  }, []);

  return (
    <div>
      <h1>Hello, {name}</h1>
      {response && <p>Response: {response}</p>}
      {loading && <p>Loading response...</p>}
    </div>
  );
}
