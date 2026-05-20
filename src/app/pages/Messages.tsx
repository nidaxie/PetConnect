import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Search, Send, MoreVertical } from "lucide-react";
import { api, type Conversation, type Message } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function Messages() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { navigate("/login"); return; }
    if (isAuthenticated) {
      api.messages.conversations()
        .then(convs => {
          setConversations(convs);
          const convParam = searchParams.get("conv");
          if (convParam) {
            setSelectedConvId(convParam);
          } else if (convs.length > 0) {
            setSelectedConvId(convs[0].id);
          }
          setLoadingConvs(false);
        })
        .catch(() => setLoadingConvs(false));
    }
  }, [isAuthenticated, authLoading, navigate, searchParams]);

  useEffect(() => {
    if (!selectedConvId) return;
    setLoadingMsgs(true);
    api.messages.getMessages(selectedConvId)
      .then(msgs => {
        setMessages(msgs);
        setLoadingMsgs(false);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      })
      .catch(() => setLoadingMsgs(false));
  }, [selectedConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvId || sending) return;
    setSending(true);
    try {
      const msg = await api.messages.sendMessage(selectedConvId, messageText.trim());
      setMessages(prev => [...prev, msg]);
      setMessageText("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

      setConversations(prev => prev.map(c =>
        c.id === selectedConvId ? { ...c, lastMessage: messageText.trim(), unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find(c => c.id === selectedConvId);
  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.petName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loadingConvs) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-12rem)]">
          <div className="flex h-full">
            <div className="w-full md:w-96 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>Henüz mesajınız yok</p>
                    <p className="text-sm mt-2">Bir hayvan ilanına giderek mesaj gönderebilirsiniz</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedConvId === conv.id ? "bg-orange-50" : ""}`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {conv.otherUserAvatar}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-semibold truncate">{conv.otherUserName}</h3>
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleDateString("tr-TR") : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">İlan: {conv.petName}</p>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {conv.unreadCount}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="hidden md:flex flex-1 flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {activeConversation.otherUserAvatar}
                      </div>
                      <div>
                        <h3 className="font-semibold">{activeConversation.otherUserName}</h3>
                        <p className="text-sm text-gray-500">İlan: {activeConversation.petName}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMsgs ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-md px-4 py-2 rounded-2xl ${message.sender === "me" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white" : "bg-gray-100 text-gray-900"}`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === "me" ? "text-orange-100" : "text-gray-500"}`}>
                            {message.timestamp ? new Date(message.timestamp).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim() || sending}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Gönder
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Bir konuşma seçin
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
