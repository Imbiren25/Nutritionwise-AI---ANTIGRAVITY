import React, { useState, useEffect, useRef, useCallback } from 'react';
import { startChat, sendMessageStream, isAIReady } from '../services/aiAssistantService';
import { AssessmentData, StockInventoryData, ChatMessage, FeatureFlags } from '../types';
import Icon from './Icon';
import Logo from './Logo';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { ScrollArea } from './ui/ScrollArea';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { cn } from '@/lib/utils';

interface AiAssistantProps {
    assessmentData: AssessmentData;
    stockData?: StockInventoryData;
    featureFlags: FeatureFlags;
}

// Simple component to render text with markdown bolding
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
    return (
        <>
            {text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
                }
                return part;
            })}
        </>
    );
};


const AiAssistant: React.FC<AiAssistantProps> = ({ assessmentData, stockData, featureFlags }) => {
    const [chatMode, setChatMode] = useState<'report' | 'general' | 'stock-report'>('general');
    // Store history for each mode
    const [chatHistories, setChatHistories] = useState<{
        report: ChatMessage[];
        general: ChatMessage[];
        'stock-report': ChatMessage[];
    }>({
        report: [],
        general: [],
        'stock-report': []
    });

    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const isOnline = useOnlineStatus();

    // Initialize or switch chat mode
    useEffect(() => {
        if (featureFlags.enable_ai_chat) {
            const status = isAIReady();
            if (!status.ready) {
                setErrorMsg(status.reason || 'AI provider not configured.');
                return;
            }
            try {
                // Get previous history for this mode to restore context
                const previousMessages = chatHistories[chatMode].map(msg => ({
                    role: msg.type === 'user' ? 'user' as const : 'model' as const,
                    content: msg.text
                }));

                const dataToUse = chatMode === 'stock-report' && stockData ? stockData : assessmentData;
                startChat(dataToUse, chatMode, previousMessages);

                // Set the UI history to the stored history for this mode
                setHistory(chatHistories[chatMode]);
                setErrorMsg(null);
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'AI chat initialization failed.';
                setErrorMsg(msg);
            }
        }
    }, [assessmentData, stockData, featureFlags.enable_ai_chat, chatMode]); // Depend on chatMode to re-init on switch

    const handleModeChange = (newMode: 'report' | 'general' | 'stock-report') => {
        if (newMode === chatMode) return;

        // Save current history before switching
        setChatHistories(prev => ({
            ...prev,
            [chatMode]: history
        }));

        setChatMode(newMode);
        // The useEffect will trigger and load the history for the newMode
    };

    // Update chatHistories whenever history changes to keep them in sync
    useEffect(() => {
        setChatHistories(prev => ({
            ...prev,
            [chatMode]: history
        }));
    }, [history, chatMode]);

    useEffect(() => {
        // Auto-scroll to the bottom of the chat
        // We need to access the viewport of the ScrollArea, which is a bit tricky with the component wrapper
        // For now, we rely on the user scrolling or basic behavior, or we could add a ref to the last message
        const scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async (messageText: string, messageId?: string) => {
        if (!messageText.trim() || loading) return;

        setLoading(true);

        // If it's a new message, add it to history. If it's a retry, clear its error state.
        if (!messageId) {
            const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', parts: [{ text: messageText }] };
            setHistory(prev => [...prev, userMessage]);
            setInput('');
        } else {
            setHistory(prev => prev.map(msg => msg.id === messageId ? { ...msg, error: false } : msg));
        }

        try {
            const stream = await sendMessageStream(messageText);
            let modelResponse = '';
            setHistory(prev => [...prev, { id: crypto.randomUUID(), role: 'model', parts: [{ text: '' }] }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setHistory(prev => {
                    const newHistory = [...prev];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                        lastMessage.parts[0].text = modelResponse;
                    }
                    return newHistory;
                });
            }
        } catch (error) {
            // Mark the user's message as having an error
            const idToMark = messageId || history[history.length - 1]?.id;
            setHistory(prev => prev.map(msg => msg.id === idToMark ? { ...msg, error: true } : msg));
            const msg = error instanceof Error ? error.message : 'Failed to get response from AI.';
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
    }

    const handleRetry = useCallback((message: ChatMessage) => {
        handleSendMessage(message.parts[0].text, message.id);
    }, []);

    if (!featureFlags.enable_ai_chat) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 bg-card rounded-3xl shadow-sm border border-border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Icon name="ai" className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground font-heading">AI Assistant Unavailable</h2>
                <p className="mt-2 max-w-md text-sm">This feature has been temporarily disabled by the administrator.</p>
            </div>
        )
    }

    const hasApiKey = Boolean((import.meta as any).env.VITE_GENAI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY);

    return (
        <Card className="flex flex-col h-[600px] w-full max-w-5xl mx-auto overflow-hidden border-border shadow-xl bg-card/50 backdrop-blur-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-card/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Icon name="ai" className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground font-heading leading-tight">AI Diet Assistant</h2>
                        <p className="text-xs text-muted-foreground font-medium">Your personal nutrition expert</p>
                    </div>
                </div>
                <div className="flex bg-muted/50 p-1 rounded-lg">
                    <button
                        onClick={() => handleModeChange('general')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                            chatMode === 'general' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        General
                    </button>
                    <button
                        onClick={() => handleModeChange('report')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                            chatMode === 'report' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Report Analysis
                    </button>
                    {stockData && (
                        <button
                            onClick={() => handleModeChange('stock-report')}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                                chatMode === 'stock-report' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Stock Analysis
                        </button>
                    )}
                </div>
            </div>

            {!hasApiKey && (
                <div className="px-6 py-2 bg-yellow-500/10 text-yellow-600 text-xs font-medium border-b border-yellow-500/20 flex items-center justify-center">
                    <Icon name="info" className="w-3 h-3 mr-2" />
                    Connect AI in Settings to enable the assistant.
                </div>
            )}

            {/* Error Banner */}
            {errorMsg && (
                <div className="px-6 py-2 bg-destructive/10 text-destructive text-xs font-medium border-b border-destructive/20 flex items-center justify-center">
                    <Icon name="warning" className="w-3 h-3 mr-2" />
                    {errorMsg}
                </div>
            )}

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-6 bg-muted/5">
                <div className="space-y-6 pb-4">
                    {history.length === 0 && !loading && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-12 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                            <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                <Icon name="ai" className="w-10 h-10 text-primary/50" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground">
                                    {chatMode === 'report' ? 'Ready to discuss your report!' : 'Hello! Ask me anything.'}
                                </h3>
                                <p className="text-muted-foreground max-w-xs mx-auto mt-2 text-sm">
                                    {chatMode === 'report'
                                        ? "I've analyzed your nutrition data. What would you like to know?"
                                        : "I can help you with general nutrition advice, food sources, and healthy habits."}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg px-4">
                                {["Analyze my protein intake", "Suggest healthy snacks", "How to improve iron?", "Explain my BMI"].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setInput(suggestion)}
                                        className="p-4 text-sm text-left bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-200 shadow-sm"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {history.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-[slideIn_0.3s_ease-out]`}>
                            {msg.role === 'model' && (
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                                </Avatar>
                            )}

                            <div className="flex flex-col items-end max-w-[85%]">
                                <div className={cn(
                                    "px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                        : "bg-card text-card-foreground border border-border rounded-bl-none",
                                    msg.error && "bg-destructive/10 text-destructive border-destructive/20"
                                )}>
                                    <div className="whitespace-pre-wrap">
                                        <MarkdownText text={msg.parts[0].text} />
                                    </div>
                                </div>
                                {msg.error && (
                                    <Button variant="link" size="sm" className="mt-1 text-destructive hover:text-destructive h-auto p-0 text-xs" onClick={() => handleRetry(msg)}>
                                        <Icon name="refresh" className="w-3 h-3 mr-1" /> Retry
                                    </Button>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarFallback className="bg-muted text-muted-foreground">ME</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}

                    {loading && history[history.length - 1]?.role === 'user' && (
                        <div className="flex items-end gap-3 justify-start animate-pulse">
                            <Avatar className="h-8 w-8 border border-border">
                                <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                            </Avatar>
                            <div className="px-5 py-4 rounded-2xl rounded-bl-none bg-card border border-border shadow-sm">
                                <div className="flex items-center space-x-1.5">
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-card border-t border-border">
                <form
                    onSubmit={handleSubmit}
                    className="relative flex items-center gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={errorMsg ? "AI Assistant requires configuration." : (isOnline ? "Type your question here..." : "You are offline.")}
                        className="flex-1 py-6 bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 rounded-xl shadow-inner"
                        disabled={loading || !isOnline || !!errorMsg}
                    />
                    <Button
                        type="submit"
                        disabled={loading || !input.trim() || !isOnline || !!errorMsg}
                        size="icon"
                        className={cn(
                            "h-12 w-12 rounded-xl transition-all duration-200 shrink-0",
                            input.trim() && !loading ? "shadow-md hover:scale-105" : "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Icon name="arrowForward" className="w-5 h-5" />
                    </Button>
                </form>
                <p className="text-center text-[10px] text-muted-foreground mt-3">
                    AI can make mistakes. Please verify important medical information.
                </p>
            </div>
        </Card>
    );
};

export default AiAssistant;
