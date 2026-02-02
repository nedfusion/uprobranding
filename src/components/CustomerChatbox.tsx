import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SupportConversation {
  id: string;
  subject: string;
  status: string;
  created_at: string;
}

interface SupportMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_internal_note: boolean;
}

export default function CustomerChatbox() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [category, setCategory] = useState('general');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConversation) {
      scrollToBottom();
    }
  }, [messages, activeConversation]);

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages();
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    console.log('Loading conversations for user:', user?.id);
  };

  const loadMessages = async () => {
    console.log('Loading messages for conversation:', activeConversation);
  };

  const createConversation = async () => {
    if (!newSubject.trim()) {
      alert('Please enter a subject');
      return;
    }

    console.log('Creating new conversation:', { subject: newSubject, category });
    setShowNewConversation(false);
    setNewSubject('');
    setCategory('general');
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl z-50 flex flex-col ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[600px]'
          } transition-all`}
        >
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">Customer Support</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-blue-700 p-1 rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {!activeConversation && !showNewConversation && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-4">
                    <button
                      onClick={() => setShowNewConversation(true)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start New Conversation
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">
                      Your Conversations
                    </h4>
                    {conversations.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No conversations yet</p>
                        <p className="text-xs mt-1">Start a conversation to get help</p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => setActiveConversation(conv.id)}
                          className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium text-sm">{conv.subject}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {new Date(conv.created_at).toLocaleDateString()}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                conv.status === 'open'
                                  ? 'bg-green-100 text-green-700'
                                  : conv.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {conv.status}
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {showNewConversation && (
                <div className="flex-1 overflow-y-auto p-4">
                  <button
                    onClick={() => setShowNewConversation(false)}
                    className="text-blue-600 text-sm mb-4 hover:underline"
                  >
                    ← Back to conversations
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        placeholder="What do you need help with?"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="general">General Question</option>
                        <option value="technical">Technical Issue</option>
                        <option value="billing">Billing</option>
                        <option value="account">Account Management</option>
                        <option value="service">Service Request</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </div>

                    <button
                      onClick={createConversation}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Conversation
                    </button>
                  </div>
                </div>
              )}

              {activeConversation && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    <button
                      onClick={() => setActiveConversation(null)}
                      className="text-blue-600 text-sm mb-2 hover:underline"
                    >
                      ← Back to conversations
                    </button>

                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">No messages yet</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] px-4 py-2 rounded-lg ${
                              msg.sender_id === user?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-800 border'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.sender_id === user?.id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t bg-white rounded-b-lg">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
