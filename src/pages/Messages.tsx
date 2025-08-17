import React, { useState } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  Video,
  MoreVertical,
  User,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations data
  const conversations = [
    {
      id: '1',
      participant: {
        name: 'Ahmed Ibrahim',
        type: 'handyman',
        profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        online: true
      },
      lastMessage: {
        content: 'I can start the plumbing work tomorrow morning at 9 AM. Is that good for you?',
        timestamp: new Date('2024-01-23T10:30:00'),
        sender: 'them',
        read: false
      },
      unreadCount: 2
    },
    {
      id: '2',
      participant: {
        name: 'Sarah Johnson',
        type: 'customer',
        profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        online: false
      },
      lastMessage: {
        content: 'Thank you for the excellent work! The electrical issue is completely fixed.',
        timestamp: new Date('2024-01-22T16:45:00'),
        sender: 'them',
        read: true
      },
      unreadCount: 0
    },
    {
      id: '3',
      participant: {
        name: 'John Okafor',
        type: 'handyman',
        profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
        online: true
      },
      lastMessage: {
        content: 'I have all the materials ready. See you at 2 PM.',
        timestamp: new Date('2024-01-22T08:15:00'),
        sender: 'me',
        read: true
      },
      unreadCount: 0
    }
  ];

  // Mock messages for selected conversation
  const messages = [
    {
      id: '1',
      content: 'Hi! I saw your booking request for plumbing work. When would be a good time to discuss the details?',
      timestamp: new Date('2024-01-22T14:30:00'),
      sender: 'them',
      status: 'read'
    },
    {
      id: '2',
      content: 'Hello Ahmed! Thanks for reaching out. I\'m available to discuss anytime today. The main issue is with the kitchen sink - it\'s been leaking for a few days.',
      timestamp: new Date('2024-01-22T14:45:00'),
      sender: 'me',
      status: 'read'
    },
    {
      id: '3',
      content: 'No problem! Kitchen sink leaks are common. I can come take a look tomorrow morning. What time works best for you?',
      timestamp: new Date('2024-01-22T15:00:00'),
      sender: 'them',
      status: 'read'
    },
    {
      id: '4',
      content: 'Morning works great! How about 9 AM? I\'ll be home all morning.',
      timestamp: new Date('2024-01-22T15:15:00'),
      sender: 'me',
      status: 'read'
    },
    {
      id: '5',
      content: 'Perfect! I\'ll be there at 9 AM sharp. I\'ll bring all necessary tools and some common replacement parts. The estimated cost should be between ₦8,000 - ₦12,000 depending on what needs to be replaced.',
      timestamp: new Date('2024-01-23T09:00:00'),
      sender: 'them',
      status: 'read'
    },
    {
      id: '6',
      content: 'I can start the plumbing work tomorrow morning at 9 AM. Is that good for you?',
      timestamp: new Date('2024-01-23T10:30:00'),
      sender: 'them',
      status: 'delivered'
    }
  ];

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation === conversation.id ? 'bg-forest-50 border-forest-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {conversation.participant.profileImage ? (
                      <img
                        src={conversation.participant.profileImage}
                        alt={conversation.participant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-500" />
                    )}
                  </div>
                  {conversation.participant.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.sender === 'me' ? 'You: ' : ''}
                      {conversation.lastMessage.content}
                    </p>
                    
                    {conversation.unreadCount > 0 && (
                      <span className="ml-2 bg-forest-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      conversation.participant.type === 'handyman' 
                        ? 'bg-forest-100 text-forest-800' 
                        : 'bg-forest-50 text-forest-700'
                    }`}>
                      {conversation.participant.type === 'handyman' ? 'Handyman' : 'Customer'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversationData ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {selectedConversationData.participant.profileImage ? (
                      <img
                        src={selectedConversationData.participant.profileImage}
                        alt={selectedConversationData.participant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {selectedConversationData.participant.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-white"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedConversationData.participant.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversationData.participant.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-forest-600 hover:bg-forest-50 rounded-full transition-colors">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-forest-600 hover:bg-forest-50 rounded-full transition-colors">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-full">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'me'
                    ? 'bg-forest-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  <div className={`flex items-center justify-end mt-1 space-x-1 ${
                    message.sender === 'me' ? 'text-forest-200' : 'text-gray-500'
                  }`}>
                    <span className="text-xs">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'me' && (
                      <>
                        {message.status === 'read' ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full">
                <Paperclip className="h-5 w-5" />
              </button>
              
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 bg-forest-600 text-white rounded-full hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Conversation Selected
            </h3>
            <p className="text-gray-500">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
}