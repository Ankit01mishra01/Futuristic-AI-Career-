import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/lib/prisma";

export async function POST(request) {
  try {
    const payload = await request.text();
    const headers = Object.fromEntries(request.headers);

    // Verify webhook signature
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");
    let event;

    try {
      event = webhook.verify(payload, headers);
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        
        const name = `${first_name || ""} ${last_name || ""}`.trim();
        const email = email_addresses?.[0]?.email_address;

        if (!email) {
          console.error("No email found for user:", id);
          return NextResponse.json({ error: "No email found" }, { status: 400 });
        }

        try {
          await db.user.create({
            data: {
              clerkUserId: id,
              name: name || "Unknown User",
              email,
              imageUrl: image_url,
            },
          });

          console.log("User created successfully:", id);
        } catch (dbError) {
          console.error("Database error creating user:", dbError);
          // Don't fail the webhook if user already exists
          if (dbError.code === "P2002") {
            console.log("User already exists:", id);
          } else {
            throw dbError;
          }
        }
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = event.data;
        
        const name = `${first_name || ""} ${last_name || ""}`.trim();
        const email = email_addresses?.[0]?.email_address;

        try {
          await db.user.update({
            where: { clerkUserId: id },
            data: {
              name: name || "Unknown User",
              email,
              imageUrl: image_url,
            },
          });

          console.log("User updated successfully:", id);
        } catch (dbError) {
          console.error("Database error updating user:", dbError);
          throw dbError;
        }
        break;
      }

      case "user.deleted": {
        const { id } = event.data;

        try {
          await db.user.delete({
            where: { clerkUserId: id },
          });

          console.log("User deleted successfully:", id);
        } catch (dbError) {
          console.error("Database error deleting user:", dbError);
          // Don't fail if user doesn't exist
          if (dbError.code === "P2025") {
            console.log("User not found for deletion:", id);
          } else {
            throw dbError;
          }
        }
        break;
      }

      default:
        console.log("Unhandled webhook event:", event.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
