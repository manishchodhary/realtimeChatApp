import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, MessageCircle, Plus, Search, Users } from "lucide-react";
import api from "../../../lib/axios";

type User = { id: string; name: string; email: string };
type Conversation = {
  id: string;
  type: "DIRECT" | "GROUP";
  conversationMembers: { user: User }[];
  messages: { id: string; content: string; senderId: string; createdAt: string }[];
};
type ApiResult<T> = { success: boolean; data: T; message?: string };

export default function Home() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creatingFor, setCreatingFor] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/auth/login", { replace: true });
      return;
    }
    try {
      const [usersResponse, conversationsResponse] = await Promise.all([
        api.get<ApiResult<User[]>>("/auth/users", { headers: { Authorization: `Bearer ${token}` } }),
        api.get<ApiResult<Conversation[]>>("/api/conversations", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setUsers(usersResponse.data.data);
      setConversations(conversationsResponse.data.data);
    } catch {
      setError("Could not load your conversations. Please sign in again or check that the API is running.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { void load(); }, [load]);

  async function startConversation(user: User) {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/auth/login");
    setCreatingFor(user.id);
    setError("");
    try {
      const response = await api.post<ApiResult<{ id: string }>>(
        "/api/conversations/direct",
        { userId: user.id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      navigate(`/chat/${response.data.data.id}`);
    } catch {
      setError("Unable to start this conversation. Please try again.");
    } finally {
      setCreatingFor("");
    }
  }

  function signOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/auth/login", { replace: true });
  }

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <button onClick={() => navigate("/home")} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-white"><MessageCircle className="h-5 w-5" /></span>
            <span className="text-xl font-bold tracking-tight">Relay</span>
          </button>
          <button onClick={signOut} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"><LogOut className="h-4 w-4" /> Sign out</button>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div><p className="text-sm font-semibold text-sky-700">YOUR WORKSPACE</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Conversations</h1><p className="mt-2 text-slate-500">Pick up where you left off.</p></div>
            <span className="rounded-2xl bg-sky-50 p-3 text-sky-700"><MessageCircle className="h-6 w-6" /></span>
          </div>
          {error && <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {loading ? <p className="py-10 text-center text-slate-500">Loading conversations…</p> : conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center"><MessageCircle className="mx-auto h-8 w-8 text-slate-400" /><h2 className="mt-3 font-semibold">No conversations yet</h2><p className="mt-1 text-sm text-slate-500">Choose someone on the right to start your first chat.</p></div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.map((conversation) => {
                const other = conversation.conversationMembers[0]?.user;
                const latest = conversation.messages[0];
                return <button key={conversation.id} onClick={() => navigate(`/chat/${conversation.id}`)} className="flex w-full items-center gap-4 rounded-xl px-3 py-4 text-left transition hover:bg-slate-50">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-800">{(other?.name || "G").slice(0, 1).toUpperCase()}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{other?.name || "Group conversation"}</span><span className="mt-1 block truncate text-sm text-slate-500">{latest?.content || "Start the conversation"}</span></span>
                  <span className="text-xs text-slate-400">{latest ? new Date(latest.createdAt).toLocaleDateString() : ""}</span>
                </button>;
              })}
            </div>
          )}
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3"><span className="rounded-2xl bg-indigo-50 p-3 text-indigo-700"><Users className="h-5 w-5" /></span><div><h2 className="text-xl font-bold">Find people</h2><p className="text-sm text-slate-500">Start a direct conversation.</p></div></div>
          <label className="relative mb-5 block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50" /></label>
          {loading ? <p className="py-8 text-center text-slate-500">Loading people…</p> : filteredUsers.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">No other users found yet. Create another test account to try a chat.</p> : <div className="space-y-2">{filteredUsers.map((user) => <div key={user.id} className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-slate-50"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">{user.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{user.name}</p><p className="truncate text-sm text-slate-500">{user.email}</p></div><button disabled={creatingFor === user.id} onClick={() => void startConversation(user)} className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"><Plus className="h-4 w-4" />{creatingFor === user.id ? "Opening" : "Chat"}</button></div>)}</div>}
        </section>
      </div>
    </main>
  );
}
