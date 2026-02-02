import { useState, useEffect } from 'react';
import { MessageCircle, Search, Filter, Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SupportConversation {
  id: string;
  customer_id: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  unread_count?: number;
}

interface SupportMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_internal_note: boolean;
  sender_name?: string;
}

export default function CustomerSupport() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages();
    }
  }, [activeConversation]);

  const loadConversations = async () => {
    setLoading(true);
    console.log('Loading conversations with filters:', { statusFilter, priorityFilter });
    setLoading(false);
  };

  const loadMessages = async () => {
    console.log('Loading messages for conversation:', activeConversation);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    console.log('Sending message:', { message: newMessage, isInternal: isInternalNote });
    setNewMessage('');
    setIsInternalNote(false);
  };

  const updateConversationStatus = async (status: string) => {
    if (!activeConversation) return;
    console.log('Updating conversation status:', { conversationId: activeConversation, status });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conv.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const selectedConversation = conversations.find((c) => c.id === activeConversation);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-96 bg-white border-r flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Customer Support</h1>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading conversations...</div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <MessageCircle className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeConversation === conv.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-sm text-gray-900 flex-1 pr-2">
                      {conv.subject}
                    </p>
                    {conv.unread_count && conv.unread_count > 0 && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    {conv.customer_name || 'Customer'}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(conv.status)}
                      <span className="text-xs text-gray-600 capitalize">
                        {conv.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(conv.priority)}`}>
                      {conv.priority}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white">
        {activeConversation && selectedConversation ? (
          <>
            <div className="p-4 border-b bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedConversation.subject}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedConversation.customer_name || 'Customer'} • {selectedConversation.category}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedConversation.status}
                    onChange={(e) => updateConversationStatus(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-sm">No messages in this conversation</p>
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
                      className={`max-w-[70%] ${
                        msg.is_internal_note
                          ? 'bg-yellow-50 border-2 border-yellow-200'
                          : msg.sender_id === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border'
                      } px-4 py-3 rounded-lg`}
                    >
                      {msg.is_internal_note && (
                        <p className="text-xs font-semibold text-yellow-700 mb-1">
                          Internal Note
                        </p>
                      )}
                      <p className="text-sm font-medium mb-1">
                        {msg.sender_name || (msg.sender_id === user?.id ? 'You' : 'Customer')}
                      </p>
                      <p className={`text-sm ${msg.is_internal_note ? 'text-gray-700' : ''}`}>
                        {msg.message}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.is_internal_note
                            ? 'text-yellow-600'
                            : msg.sender_id === user?.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <div className="mb-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded"
                  />
                  Internal Note (hidden from customer)
                </label>
              </div>
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isInternalNote ? 'Add internal note...' : 'Type your message...'}
                  rows={3}
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">Choose a conversation from the list to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
