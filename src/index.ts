import readline from 'readline';
import fetch from 'node-fetch';

// TODO: Add here your Bearer token
const token = "Bearer sk-or-v1-...";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let messages = [
    { role: "system", content: "You are an assistant that helps with technical questions." }
];

async function callOpenRouter() {
    while (true) {
        // Espera a pergunta do usuário
        const userQuestion: string = await new Promise(resolve => {
            rl.question("Enter your question (or 'exit' to finish it): ", resolve);
        });

        if (userQuestion.toLowerCase() === 'exit') {
            console.log("Closing the chat system. Good bye!");
            rl.close();
            break;
        }

        messages.push({
            role: "user",
            content: userQuestion
        });

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324:free",
                messages
            })
        });

        if (!response.ok) {
            console.error("Request failure:", response.status, await response.text());
            return;
        }

        const data: any = await response.json();
        const assistantResponse = data.choices[0].message.content;
        console.log("Assistant answer:", assistantResponse);

        messages.push({
            role: "assistant",
            content: assistantResponse
        });
    }
}

callOpenRouter();
