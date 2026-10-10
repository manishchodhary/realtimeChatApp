import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, MessageCircle, Send } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import api from "../../../lib/axios";

type Message = { id: string; conversationId: string; senderId: string; content: string; createdAt: string | Date };
type ApiResult<T> = { success: boolean; data: T; message?: string };
type SocketMessage = Omit<Message, "createdAt"> & { createdAt: string | Date };

export default function ChatRoom() {
  const { conversationId = "" } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem("accessToken");

  const loadMessages = useCallback(async () => {
    if (!token) {
      navigate("/auth/login", { replace: true });
      return;
    }
    try {
      const [messagesResponse, userResponse] = await Promise.all([
        api.get<ApiResult<Message[]>>(`/api/conversations/${conversationId}/messages`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get<ApiResult<{ id: string }>>("/auth/user", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setMessages(messagesResponse.data.data);
      setCurrentUserId(userResponse.data.data.id);
    } catch {
      setError("Could not load this conversation. You may not be a member of it.");
    } finally {
      setLoading(false);
    }
  }, [conversationId, navigate, token]);

  useEffect(() => { void loadMessages(); }, [loadMessages]);

  useEffect(() => {
    if (!token || !conversationId) return;
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", { auth: { token }, withCredentials: true });
    socketRef.current = socket;
    socket.on("connect", () => {
      socket.emit("conversation:join", conversationId, (result: { success: boolean; error?: string }) => {
        if (!result.success) setError(result.error || "Unable to join conversation.");
      });
    });
    socket.on("message:new", (message: SocketMessage) => {
      if (message.conversationId === conversationId) {
        setMessages((previous) => previous.some((item) => item.id === message.id) ? previous : [...previous, message]);
      }
    });
    socket.on("connect_error", () => setError("Realtime connection failed. Check your API and socket authentication."));
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [conversationId, token]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    const socket = socketRef.current;
    if (!content || !socket?.connected || sending) {
      if (!socket?.connected) setError("Realtime connection is not ready yet.");
      return;
    }
    setSending(true);
    setError("");
    socket.emit("message:send", { conversationId, content }, (result: { success: boolean; messageId?: string; error?: string }) => {
      setSending(false);
      if (!result.success) {
        setError(result.error || "Message could not be sent.");
        return;
      }
      setDraft("");
    });
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-4 py-4 sm:px-8">
          <button onClick={() => navigate("/home")} aria-label="Back to conversations" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"><ArrowLeft className="h-5 w-5" /></button>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700"><MessageCircle className="h-5 w-5" /></span>
          <div><h1 className="font-bold">Relay chat</h1><p className="text-xs text-slate-500">Conversation {conversationId.slice(0, 8)}</p></div>
          <span className="ml-auto flex items-center gap-2 text-xs text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Realtime</span>
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-8">
        {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <div className="flex-1 space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {loading ? <div className="flex h-48 items-center justify-center gap-2 text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading messages…</div> : messages.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center text-center"><span className="rounded-2xl bg-sky-50 p-4 text-sky-700"><MessageCircle className="h-7 w-7" /></span><h2 className="mt-4 font-semibold">Say hello 👋</h2><p className="mt-1 text-sm text-slate-500">Your messages will appear here.</p></div> : messages.map((message) => {
            const mine = message.senderId === currentUserId;
            return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${mine ? "rounded-br-md bg-sky-600 text-white" : "rounded-bl-md bg-slate-100 text-slate-800"}`}><p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p><p className={`mt-1 text-right text-[10px] ${mine ? "text-sky-100" : "text-slate-400"}`}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div></div>;
          })}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={sendMessage} className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} placeholder="Write a message…" className="min-w-0 flex-1 bg-transparent px-3 py-3 outline-none placeholder:text-slate-400" aria-label="Message" />
          <button type="submit" disabled={sending || !draft.trim()} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /><span className="hidden sm:inline">{sending ? "Sending…" : "Send"}</span></button>
        </form>
        <p className="mt-2 text-center text-xs text-slate-400">Messages are saved to PostgreSQL and delivered over Socket.IO.</p>
      </section>
    </main>
  );
}
