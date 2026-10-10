import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, MessageCircle, Send, Sparkles } from "lucide-react";
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
        api.get<ApiResult<Message[]>>("/api/conversations/" + conversationId + "/messages", { headers: { Authorization: "Bearer " + token } }),
        api.get<ApiResult<{ id: string }>>("/auth/user", { headers: { Authorization: "Bearer " + token } }),
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
    <main className="relay-paper flex min-h-screen flex-col text-slate-950">
      <header className="border-b border-slate-950/10">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 sm:px-8">
          <button onClick={() => navigate("/home")} aria-label="Back to conversations" className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-950 bg-white transition hover:-translate-x-1 hover:shadow-[3px_3px_0_#172554]"><ArrowLeft className="h-5 w-5" /></button>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-950 bg-sky-500 text-white shadow-[3px_3px_0_#172554]"><MessageCircle className="h-5 w-5" /></span>
          <div className="min-w-0"><h1 className="text-lg font-black tracking-tight">The conversation club</h1><p className="text-xs font-medium text-slate-500">Thread #{conversationId.slice(0, 8)}</p></div>
          <span className="ml-auto flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Live</span>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">A space for your thoughts</p><h2 className="mt-1 font-serif text-3xl font-black tracking-tight sm:text-4xl">Say what’s on your mind.</h2></div>
          <span className="hidden -rotate-6 items-center gap-2 rounded-xl border-2 border-slate-950 bg-amber-300 px-3 py-2 text-xs font-black shadow-[3px_3px_0_#172554] sm:flex"><Sparkles className="h-4 w-4" /> NO SMALL TALK REQUIRED</span>
        </div>

        {error && <p role="alert" className="mb-4 rounded-2xl border-2 border-rose-300 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>}

        <div className="relay-chat-surface flex min-h-[55vh] flex-1 flex-col rounded-[2rem] border-2 border-slate-950 bg-white p-4 shadow-[7px_7px_0_#172554] sm:p-7">
          <div className="mb-5 flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">The thread so far</p>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">{messages.length} {messages.length === 1 ? "message" : "messages"}</span>
          </div>
          <div className="flex-1 space-y-5">
            {loading ? (
              <div className="flex min-h-56 items-center justify-center gap-3 text-sm font-semibold text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin text-sky-600" /> Getting the conversation…</div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 rotate-6 items-center justify-center rounded-[1.4rem] border-2 border-slate-950 bg-amber-300 text-slate-950 shadow-[4px_4px_0_#172554]"><MessageCircle className="h-7 w-7" /></span>
                <h3 className="mt-5 text-xl font-black">A blank page. Your move.</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">Send the first message and get this conversation going.</p>
              </div>
            ) : messages.map((message) => {
              const mine = message.senderId === currentUserId;
              return (
                <div key={message.id} className={"flex " + (mine ? "justify-end" : "justify-start")}>
                  <div className={"max-w-[88%] sm:max-w-[72%] " + (mine ? "text-right" : "text-left")}>
                    <p className={"mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.15em] " + (mine ? "text-sky-700" : "text-slate-400")}>{mine ? "YOU · " : "YOUR PERSON · "}{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                    <div className={"inline-block rounded-[1.5rem] border-2 border-slate-950 px-4 py-3 text-left shadow-[3px_3px_0_#172554] sm:px-5 " + (mine ? "rounded-br-md bg-sky-500 text-white" : "rounded-bl-md bg-[#f8fafc] text-slate-800")}>
                      <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={sendMessage} className="mt-5 flex items-center gap-2 rounded-[1.5rem] border-2 border-slate-950 bg-white p-2 shadow-[5px_5px_0_#172554] sm:gap-3 sm:p-3">
          <span className="hidden h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700 sm:flex"><MessageCircle className="h-5 w-5" /></span>
          <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={500} placeholder="Write the thing you were going to say…" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-medium outline-none placeholder:text-slate-400 sm:px-3" aria-label="Message" />
          <button type="submit" disabled={sending || !draft.trim()} className="flex h-12 items-center gap-2 rounded-xl border-2 border-slate-950 bg-sky-500 px-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-sky-600 hover:shadow-[3px_3px_0_#172554] disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /><span className="hidden sm:inline">{sending ? "Sending…" : "Send it"}</span></button>
        </form>
        <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Saved to PostgreSQL · Delivered over Socket.IO</p>
      </section>
    </main>
  );
}
