import { Inngest } from "inngest";

// create a client to send and receive events
export const inngest = new Inngest({
  id: "careergenius", 
  name: "Career Genius",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
