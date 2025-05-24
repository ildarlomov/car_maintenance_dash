import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const botToken = process.env.BOT_TOKEN;

  if (!botToken) {
    console.error('Bot token is missing from environment variables');
    return NextResponse.json({ error: 'Telegram bot token is missing' }, { status: 500 });
  }

  let telegramId: string | number;
  let channelUsername: string;
  let numericTelegramId: number;

  try {
    const body = await req.json();
    console.log('Received request body:', body);
    
    telegramId = body.telegramId;
    channelUsername = body.channelUsername;

    if (!telegramId || !channelUsername) {
      console.error('Missing required fields:', { telegramId, channelUsername });
      return NextResponse.json({ error: 'Invalid request: missing telegramId or channelUsername' }, { status: 400 });
    }

    numericTelegramId = typeof telegramId === 'string' ? parseInt(telegramId, 10) : telegramId;
    if (isNaN(numericTelegramId)) {
      console.error('Invalid telegramId format:', telegramId);
      return NextResponse.json({ error: 'Invalid request: telegramId must be a number' }, { status: 400 });
    }

  } catch (parseError) {
    console.error('Failed to parse request body:', parseError);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    let formattedChatId: string | number = channelUsername;
    if (isNaN(Number(channelUsername)) || (typeof channelUsername === 'string' && !channelUsername.startsWith('-100'))) {
        if (typeof channelUsername === 'string' && !channelUsername.startsWith('@')) {
             formattedChatId = '@' + channelUsername;
        }
    } else {
        formattedChatId = Number(channelUsername);
    }

    // Construct the Telegram API URL
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/getChatMember`;
    console.log('Telegram API URL:', telegramApiUrl);
    console.log('Request parameters:', { chat_id: formattedChatId, user_id: numericTelegramId });

    // Make the API call using fetch
    const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chat_id: formattedChatId, user_id: numericTelegramId })
    });

    console.log('Telegram API Response Status:', response.status);
    console.log('Telegram API Response Headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('Raw Telegram API Response:', responseText);

    let data;
    try {
        data = JSON.parse(responseText);
    } catch (parseError) {
        console.error('Failed to parse Telegram API response:', parseError);
        return NextResponse.json({ error: 'Invalid response from Telegram API', isMember: false }, { status: 500 });
    }

    if (!response.ok || !data.ok) {
        console.error('Telegram API Error:', data);
        let message = `Telegram API error: ${data.description || 'Unknown error'}`;
        if (data.error_code === 400 && data.description?.includes("user not found")) {
            message = "User not found.";
        } else if (data.error_code === 400 && data.description?.includes("chat not found")) {
            message = "Channel/Group not found or bot is not an administrator.";
        } else if (data.error_code === 403 && data.description?.includes("bot was kicked")) {
            message = "Bot was kicked from the channel/group.";
        } else if (data.error_code === 403 && data.description?.includes("bot is not a member")) {
            message = "Bot must be an administrator in the channel/group.";
        }
        return NextResponse.json({ error: message, isMember: false }, { status: response.status });
    }

    const chatMemberStatus = data.result?.status;
    console.log('ChatMember status:', chatMemberStatus);

    const isMember = chatMemberStatus && ['creator', 'administrator', 'member', 'restricted'].includes(chatMemberStatus);
    console.log('Final membership result:', isMember);

    return NextResponse.json({ isMember });

  } catch (error: any) {
    console.error('Fetch or processing error:', error);
    return NextResponse.json({ error: 'Failed to check membership due to an internal error', isMember: false }, { status: 500 });
  }
} 