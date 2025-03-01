"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

type Message = {
    role: string;
    content: string;
};

export default function ChatClient() {
    const [conversation, setConversation] = useState<Array<Message>>([]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // Use relative URLs instead of absolute URLs with host/port
    const apiBaseUrl = '/api';
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when conversation updates
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    // Função para iniciar uma nova conversa
    const startConversation = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${apiBaseUrl}/conversation/start`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });

            if (!res.ok) throw new Error('Erro ao iniciar conversa');

            const data = await res.json();
            setConversation(data.conversation || []);
        } catch (error) {
            console.error("Erro ao iniciar a conversa:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Função para enviar uma mensagem na conversa atual
    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            setIsLoading(true);
            // Adiciona a mensagem do usuário imediatamente na UI
            const updatedConversation = [
                ...conversation,
                { role: "user", content: message }
            ];
            setConversation(updatedConversation);
            setMessage("");

            const res = await fetch(`${apiBaseUrl}/conversation/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    conversation: updatedConversation
                })
            });

            if (!res.ok) throw new Error('Erro ao enviar mensagem');

            const data = await res.json();
            setConversation(data.conversation || updatedConversation);
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Helper function to get the CSS class based on message role
    const getMessageClass = (role: string) => {
        switch (role) {
            case 'user':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'assistant':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'system':
                return 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 text-sm';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20';
        }
    };

    // Helper function to get the display name based on role
    const getRoleName = (role: string) => {
        switch (role) {
            case 'user':
                return 'Você';
            case 'assistant':
                return 'Assistente';
            case 'system':
                return 'Sistema';
            default:
                return role.charAt(0).toUpperCase() + role.slice(1);
        }
    };

    // Check if content contains SQL
    const containsSQL = (content: string) => {
        return content.includes('SQL:');
    };

    return (
        <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4 h-[90vh]">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Chatbot</h1>
                <button
                    onClick={startConversation}
                    className="rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors py-2 px-4 flex items-center justify-center gap-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Carregando...
                        </>
                    ) : "Iniciar Nova Conversa"}
                </button>
            </div>

            <div
                ref={chatContainerRef}
                className="border dark:border-gray-700 rounded-lg flex-1 overflow-y-auto mb-4 flex flex-col"
                style={{ maxHeight: "calc(90vh - 180px)" }}
            >
                {conversation.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500 max-w-md p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 className="font-medium text-lg mb-2">Nenhuma conversa iniciada</h3>
                            <p>Clique no botão "Iniciar Nova Conversa" para começar a interagir com o assistente.</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {conversation.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${getMessageClass(msg.role)} transition-all`}
                            >
                                <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">
                                    {getRoleName(msg.role)}
                                </div>

                                {containsSQL(msg.content) ? (
                                    <div>
                                        <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">Consulta SQL:</div>
                                        <pre className="bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto">
                                            {msg.content.replace('SQL: ', '')}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {msg.content.startsWith('USER: ')
                                                ? msg.content.substring(6)
                                                : msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex gap-2 relative">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={conversation.length === 0 ? "Inicie uma conversa primeiro..." : "Digite sua mensagem..."}
                    className="flex-1 p-3 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading || conversation.length === 0}
                />
                <button
                    onClick={sendMessage}
                    className="rounded-lg transition-colors flex items-center justify-center px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || message.trim() === "" || conversation.length === 0}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={`w-6 h-6 ${isLoading || message.trim() === "" || conversation.length === 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'}`}
                    >
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
